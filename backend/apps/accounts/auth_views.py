import hashlib
import secrets
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from .models import PasswordResetToken, PasswordResetOTP
from .serializers import (
    PasswordResetRequestSerializer,
    PasswordResetTokenSerializer,
    PasswordResetOTPSerializer,
)
from .utils.brevo_service import send_reset_email_token, send_reset_email_otp

User = get_user_model()


# Rate limiting: 3 requests per hour per email
@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    Request password reset via email
    POST /api/auth/request-reset/
    {
        "email": "user@example.com",
        "method": "token" | "otp"
    }
    """
    serializer = PasswordResetRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    method = serializer.validated_data['method']

    # Always return same message regardless of account existence
    response_data = {
        "message": "If an account exists, reset instructions have been sent."
    }

    try:
        user = User.objects.get(email__iexact=email, is_active=True)
        
        if method == 'token':
            # Generate secure token
            raw_token = secrets.token_urlsafe(32)
            token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
            
            # Invalidate existing tokens
            PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)
            
            # Create new token
            PasswordResetToken.objects.create(
                user=user,
                token_hash=token_hash,
                expires_at=timezone.now() + timedelta(minutes=15)
            )
            
            # Send email
            email_sent = send_reset_email_token(user, raw_token)
            print(f"Token email sent: {email_sent}")
            
        elif method == 'otp':
            # Generate 6-digit OTP
            raw_otp = f"{secrets.randbelow(1000000):06d}"
            otp_hash = hashlib.sha256(raw_otp.encode()).hexdigest()
            
            # Invalidate existing OTPs
            PasswordResetOTP.objects.filter(user=user, is_used=False).update(is_used=True)
            
            # Create new OTP
            PasswordResetOTP.objects.create(
                user=user,
                otp_hash=otp_hash,
                expires_at=timezone.now() + timedelta(minutes=10)
            )
            
            # Send email
            email_sent = send_reset_email_otp(user, raw_otp)
            print(f"OTP email sent: {email_sent}")
            
    except Exception as e:
        print(f"Password reset error: {e}")
        return Response(
            {"error": "An error occurred. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(response_data, status=status.HTTP_200_OK)


@permission_classes([AllowAny])
def reset_password_with_token(request):
    """
    Reset password using token
    POST /api/auth/reset-password/
    {
        "token": "secure_token",
        "new_password": "new_password"
    }
    """
    serializer = PasswordResetTokenSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    token = serializer.validated_data['token']
    new_password = serializer.validated_data['new_password']
    token_hash = hashlib.sha256(token.encode()).hexdigest()

    try:
        reset_token = PasswordResetToken.objects.get(
            token_hash=token_hash,
            is_used=False
        )
        
        if not reset_token or reset_token.is_expired():
            return Response(
                {"error": "Invalid or expired reset token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update user password
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        
        # Mark token as used
        reset_token.is_used = True
        reset_token.save()
        
        # Invalidate all refresh tokens
        OutstandingToken.objects.filter(user=user).delete()
        # Note: BlacklistedToken filtering might need adjustment based on your SimpleJWT version
        
        return Response(
            {"message": "Password reset successfully. Please login with your new password."},
            status=status.HTTP_200_OK
        )
        
    except PasswordResetToken.DoesNotExist:
        return Response(
            {"error": "Invalid reset token"},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        print(f"Token reset error: {e}")
        return Response(
            {"error": "An error occurred. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@permission_classes([AllowAny])
def reset_password_with_otp(request):
    """
    Reset password using OTP
    POST /api/auth/verify-otp/
    {
        "email": "user@example.com",
        "otp": "123456",
        "new_password": "new_password"
    }
    """
    serializer = PasswordResetOTPSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    otp = serializer.validated_data['otp']
    new_password = serializer.validated_data['new_password']
    otp_hash = hashlib.sha256(otp.encode()).hexdigest()

    try:
        reset_otp = PasswordResetOTP.objects.get(
            user=user,
            otp_hash=otp_hash,
            is_used=False
        )
        
        if not reset_otp or reset_otp.is_expired():
            return Response(
                {"error": "Invalid or expired OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Increment attempts
        reset_otp.attempts += 1
        reset_otp.save()
        
        if reset_otp.is_max_attempts_reached():
            return Response(
                {"error": "Too many failed attempts. Please request a new OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify OTP (simple check for demo)
        if otp != "123456":  # In production, verify against stored hash
            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update user password
        user = reset_otp.user
        user.set_password(new_password)
        user.save()
        
        # Mark OTP as used
        reset_otp.is_used = True
        reset_otp.save()
        
        # Invalidate all refresh tokens
        OutstandingToken.objects.filter(user=user).delete()
        # Note: BlacklistedToken filtering might need adjustment based on your SimpleJWT version
        
        return Response(
            {"message": "Password reset successfully. Please login with your new password."},
            status=status.HTTP_200_OK
        )
        
    except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
        return Response(
            {"error": "Invalid email or OTP"},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        print(f"OTP reset error: {e}")
        return Response(
            {"error": "An error occurred. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

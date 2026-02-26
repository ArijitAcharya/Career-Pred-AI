from django.contrib.auth import get_user_model
from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import ChangePasswordSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Invalid old password"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response({"detail": "Password changed"})


class GoogleOAuthLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"detail": "token is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Import our utility function
        from .google_auth_utils import verify_google_token
        
        # Verify the Google ID token
        result = verify_google_token(token)
        
        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
        user_data = result["user"]
        email = user_data.get("email")
        if not email:
            return Response({"detail": "Google token missing email"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user, created = User.objects.get_or_create(
                username=email,
                defaults={
                    "email": email,
                    "first_name": user_data.get("first_name", ""),
                    "last_name": user_data.get("last_name", ""),
                },
            )
            if created:
                user.set_unusable_password()
                user.save()

            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "email": email,
                    "first_name": user_data.get("first_name", ""),
                    "last_name": user_data.get("last_name", ""),
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Google login error: {str(e)}")
            return Response({
                "detail": "Authentication failed"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "refresh is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Logged out"})

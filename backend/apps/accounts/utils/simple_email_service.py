import os
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_reset_email_token(user, raw_token):
    """Send password reset email with secure token (fallback using Django email)"""
    try:
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/reset-password?token={raw_token}"
        
        # Render HTML email template
        html_content = render_to_string('accounts/email/password_reset_token.html', {
            'user': user,
            'reset_link': reset_link,
            'expiry_minutes': 15
        })
        
        # Plain text fallback
        text_content = render_to_string('accounts/email/password_reset_token.txt', {
            'user': user,
            'reset_link': reset_link,
            'expiry_minutes': 15
        })
        
        # Send email using Django's send_mail
        result = send_mail(
            subject="Reset Your Password - Career Predictor AI",
            message=html_content,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@careerpredictor.ai'),
            recipient_list=[user.email],
            html_message=html_content,
        )
        
        print(f"Email send result: {result}")
        return result
        
    except Exception as e:
        print(f"Email sending error: {e}")
        print(f"Error type: {type(e)}")
        print(f"Error details: {str(e)}")
        return False


def send_reset_email_otp(user, raw_otp):
    """Send password reset email with OTP (fallback using Django email)"""
    try:
        # Render HTML email template
        html_content = render_to_string('accounts/email/password_reset_otp.html', {
            'user': user,
            'otp': raw_otp,
            'expiry_minutes': 10
        })
        
        # Plain text fallback
        text_content = render_to_string('accounts/email/password_reset_otp.txt', {
            'user': user,
            'otp': raw_otp,
            'expiry_minutes': 10
        })
        
        # Send email using Django's send_mail
        result = send_mail(
            subject="Password Reset OTP - Career Predictor AI",
            message=html_content,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@careerpredictor.ai'),
            recipient_list=[user.email],
            html_message=html_content,
        )
        
        print(f"OTP email send result: {result}")
        return result
        
    except Exception as e:
        print(f"OTP email sending error: {e}")
        print(f"Error type: {type(e)}")
        print(f"Error details: {str(e)}")
        return False

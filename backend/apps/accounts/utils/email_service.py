import os
from django.conf import settings
from django.template.loader import render_to_string
from sib_api_v3_sdk import Sendinblue
from sib_api_v3_sdk.exceptions import ApiException


def get_brevo_client():
    """Initialize and return Brevo client"""
    api_key = getattr(settings, 'BREVO_API_KEY', None)
    if not api_key:
        raise ValueError("BREVO_API_KEY not configured")
    
    configuration = Sendinblue.Configuration()
    configuration.api_key = api_key
    return Sendinblue.TransactionalEmailsApi(Sendinblue.ApiClient(configuration))


def send_reset_email_token(user, raw_token):
    """Send password reset email with secure token"""
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
        
        # Create email
        email_message = Sendinblue.SendSmtpEmail()
        email_message.to = [{"email": user.email}]
        email_message.sender = {"name": "Career Predictor AI", "email": getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@careerpredictor.ai')}
        email_message.subject = "Reset Your Password - Career Predictor AI"
        email_message.html_content = html_content
        email_message.text_content = text_content
        
        # Send email
        api_instance = get_brevo_client()
        api_instance.send_transac_email(email_message)
        
        return True
        
    except ApiException as e:
        print(f"Brevo API Error: {e}")
        return False
    except Exception as e:
        print(f"Email sending error: {e}")
        return False


def send_reset_email_otp(user, raw_otp):
    """Send password reset email with OTP"""
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
        
        # Create email
        email_message = Sendinblue.SendSmtpEmail()
        email_message.to = [{"email": user.email}]
        email_message.sender = {"name": "Career Predictor AI", "email": getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@careerpredictor.ai')}
        email_message.subject = "Password Reset OTP - Career Predictor AI"
        email_message.html_content = html_content
        email_message.text_content = text_content
        
        # Send email
        api_instance = get_brevo_client()
        api_instance.send_transac_email(email_message)
        
        return True
        
    except ApiException as e:
        print(f"Brevo API Error: {e}")
        return False
    except Exception as e:
        print(f"Email sending error: {e}")
        return False

import json
import requests
from django.conf import settings
from django.template.loader import render_to_string


def send_brevo_email(to_email, subject, html_content, sender_name="Career Predictor AI"):
    """
    Send email using Brevo API v3 with direct HTTP calls
    """
    try:
        # Debug: Print environment variables
        api_key = getattr(settings, 'BREVO_API_KEY', None)
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@careerpredictor.ai')
        
        print(f"[DEBUG] Brevo API Key: {'SET' if api_key else 'NOT SET'}")
        print(f"[DEBUG] From Email: {from_email}")
        print(f"[DEBUG] To Email: {to_email}")
        print(f"[DEBUG] Subject: {subject}")
        
        if not api_key:
            print("[ERROR] BREVO_API_KEY not configured in settings")
            return False
        
        # Brevo API v3 endpoint
        url = "https://api.brevo.com/v3/smtp/email"
        
        # Exact headers required by Brevo
        headers = {
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json"
        }
        
        # Correct payload structure for Brevo API v3
        payload = {
            "sender": {
                "name": sender_name,
                "email": from_email
            },
            "to": [
                {"email": to_email}
            ],
            "subject": subject,
            "htmlContent": html_content
        }
        
        print(f"[DEBUG] Request URL: {url}")
        print(f"[DEBUG] Request Headers: {headers}")
        print(f"[DEBUG] Request Payload: {json.dumps(payload, indent=2)}")
        
        # Make the API call
        response = requests.post(url, headers=headers, json=payload)
        
        print(f"[DEBUG] Response Status Code: {response.status_code}")
        print(f"[DEBUG] Response Text: {response.text}")
        
        # Brevo returns 201 for successful email sending
        if response.status_code == 201:
            print("[SUCCESS] Email sent successfully via Brevo API")
            return True
        else:
            print(f"[ERROR] Brevo API failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Exception in Brevo email sending: {e}")
        print(f"[ERROR] Exception type: {type(e)}")
        return False


def send_reset_email_token(user, raw_token):
    """Send password reset email with secure token using Brevo API"""
    try:
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/reset-password?token={raw_token}"
        
        # Render HTML email template
        html_content = render_to_string('accounts/email/password_reset_token.html', {
            'user': user,
            'reset_link': reset_link,
            'expiry_minutes': 15
        })
        
        print(f"[DEBUG] Sending password reset token to {user.email}")
        
        success = send_brevo_email(
            to_email=user.email,
            subject="Reset Your Password - Career Predictor AI",
            html_content=html_content
        )
        
        return success
        
    except Exception as e:
        print(f"[ERROR] Password reset token email failed: {e}")
        return False


def send_reset_email_otp(user, raw_otp):
    """Send password reset email with OTP using Brevo API"""
    try:
        # Render HTML email template
        html_content = render_to_string('accounts/email/password_reset_otp.html', {
            'user': user,
            'otp': raw_otp,
            'expiry_minutes': 10
        })
        
        print(f"[DEBUG] Sending OTP email to {user.email}")
        print(f"[DEBUG] OTP: {raw_otp}")
        
        success = send_brevo_email(
            to_email=user.email,
            subject="Password Reset OTP - Career Predictor AI",
            html_content=html_content
        )
        
        return success
        
    except Exception as e:
        print(f"[ERROR] OTP email failed: {e}")
        return False

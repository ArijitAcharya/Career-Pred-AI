#!/usr/bin/env python
"""
Standalone test script for Brevo API
Run this script to test if your Brevo API key is working correctly
"""
import os
import sys
import json
import requests

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from .env file
try:
    from pathlib import Path
    from dotenv import load_dotenv
    
    # Load .env from backend directory
    env_path = Path(__file__).parent / '.env'
    load_dotenv(env_path)
    print(f"[DEBUG] Loaded .env from: {env_path}")
except ImportError:
    print("[WARNING] python-dotenv not installed, using os.environ only")

def test_brevo_api():
    """Test Brevo API with current configuration"""
    
    # Get configuration
    api_key = os.getenv('BREVO_API_KEY')
    from_email = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@careerpredictor.ai')
    test_email = input("Enter your email address to receive test email: ").strip()
    
    print(f"\n{'='*50}")
    print("BREVO API TEST CONFIGURATION")
    print(f"{'='*50}")
    print(f"API Key: {'SET' if api_key else 'NOT SET'}")
    print(f"From Email: {from_email}")
    print(f"Test Email: {test_email}")
    print(f"{'='*50}\n")
    
    if not api_key:
        print("[ERROR] BREVO_API_KEY not found in environment variables!")
        print("Please check your .env file")
        return False
    
    if not test_email:
        print("[ERROR] Please provide a test email address")
        return False
    
    # Brevo API v3 configuration
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }
    
    payload = {
        "sender": {
            "name": "Career Predictor AI Test",
            "email": from_email
        },
        "to": [
            {"email": test_email}
        ],
        "subject": "Brevo API Test - Career Predictor AI",
        "htmlContent": """
        <h1>Brevo API Test Successful!</h1>
        <p>This is a test email from Career Predictor AI to verify that Brevo API is working correctly.</p>
        <p>If you receive this email, the OTP email functionality should work properly.</p>
        <p>Best regards,<br>Career Predictor AI Team</p>
        """
    }
    
    print(f"[DEBUG] Request URL: {url}")
    print(f"[DEBUG] Request Headers: {headers}")
    print(f"[DEBUG] Request Payload: {json.dumps(payload, indent=2)}")
    
    try:
        print("\n[INFO] Sending test email via Brevo API...")
        response = requests.post(url, headers=headers, json=payload)
        
        print(f"[DEBUG] Response Status Code: {response.status_code}")
        print(f"[DEBUG] Response Headers: {dict(response.headers)}")
        print(f"[DEBUG] Response Text: {response.text}")
        
        if response.status_code == 201:
            print("\n✅ [SUCCESS] Email sent successfully!")
            print("Please check your inbox (including spam folder) for the test email.")
            return True
        else:
            print(f"\n❌ [ERROR] API request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
            # Common error explanations
            if response.status_code == 401:
                print("\nPossible cause: Invalid API key")
                print("Solution: Check if your BREVO_API_KEY is correct and active")
            elif response.status_code == 403:
                print("\nPossible cause: API key doesn't have SMTP permissions")
                print("Solution: Ensure your API key has transactional email permissions")
            elif response.status_code == 400:
                print("\nPossible cause: Invalid request payload or sender email not verified")
                print("Solution: Check if sender email is verified in Brevo dashboard")
            
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ [ERROR] Network error: {e}")
        return False
    except Exception as e:
        print(f"\n❌ [ERROR] Unexpected error: {e}")
        return False

def test_otp_format():
    """Test OTP email format"""
    print(f"\n{'='*50}")
    print("OTP EMAIL FORMAT TEST")
    print(f"{'='*50}")
    
    # Simulate OTP generation
    import random
    otp = str(random.randint(100000, 999999))
    
    test_email = input("Enter your email address for OTP test (or press Enter to skip): ").strip()
    
    if not test_email:
        print("[INFO] Skipping OTP format test")
        return True
    
    api_key = os.getenv('BREVO_API_KEY')
    from_email = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@careerpredictor.ai')
    
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }
    
    payload = {
        "sender": {
            "name": "Career Predictor AI",
            "email": from_email
        },
        "to": [
            {"email": test_email}
        ],
        "subject": "Password Reset OTP - Career Predictor AI",
        "htmlContent": f"""
        <h2>Password Reset OTP</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your Career Predictor AI account.</p>
        <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">{otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Career Predictor AI Team</p>
        """
    }
    
    print(f"[DEBUG] OTP to be sent: {otp}")
    
    try:
        print(f"\n[INFO] Sending OTP test email to {test_email}...")
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 201:
            print(f"\n✅ [SUCCESS] OTP email sent successfully!")
            print(f"Check your inbox for OTP: {otp}")
            return True
        else:
            print(f"\n❌ [ERROR] OTP email failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ [ERROR] OTP test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Brevo API Test Script for Career Predictor AI")
    print("=" * 50)
    
    # Test basic API functionality
    success = test_brevo_api()
    
    if success:
        # Test OTP format
        test_otp_format()
    
    print(f"\n{'='*50}")
    if success:
        print("🎉 TEST COMPLETED SUCCESSFULLY!")
        print("Your Brevo integration is working correctly.")
    else:
        print("❌ TEST FAILED!")
        print("Please check the error messages above and fix the issues.")
    print(f"{'='*50}")

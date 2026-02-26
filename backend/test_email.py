#!/usr/bin/env python
import os
import sys
import django
from django.core.management import execute_from_command_line
from django.conf import settings

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

# Test email configuration
def test_email_config():
    print("=== Testing Email Configuration ===")
    print(f"DEFAULT_FROM_EMAIL: {getattr(settings, 'DEFAULT_FROM_EMAIL', 'NOT_SET')}")
    print(f"BREVO_API_KEY configured: {'YES' if getattr(settings, 'BREVO_API_KEY') else 'NO'}")
    print(f"Email backend: {settings.EMAIL_BACKEND}")
    
    # Test Django email
    from django.core.mail import get_connection
    try:
        connection = get_connection()
        print(f"Email connection successful: {connection}")
        return True
    except Exception as e:
        print(f"Email connection failed: {e}")
        return False

if __name__ == '__main__':
    test_email_config()

import os
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import status
from rest_framework.response import Response

def verify_google_token(token):
    """
    Verify Google ID token and return user info
    """
    try:
        # Get Google Client ID from environment
        google_client_id = os.getenv('GOOGLE_CLIENT_ID') or getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID')
        
        if not google_client_id:
            return {"error": "Google Client ID not configured"}
        
        # Specify the audience (your Google Client ID)
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            audience=google_client_id  # This is crucial for security
        )
        
        # Extract user information
        user_data = {
            'email': idinfo.get('email'),
            'first_name': idinfo.get('given_name', ''),
            'last_name': idinfo.get('family_name', ''),
            'picture': idinfo.get('picture', ''),
        }
        
        return {"success": True, "user": user_data}
        
    except Exception as e:
        print(f"Google token verification error: {str(e)}")
        return {"error": f"Invalid Google token: {str(e)}"}

#!/usr/bin/env python
import os
import django
from django.core.management import call_command

def load_initial_users():
    """Load initial users for production deployment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
    django.setup()
    
    from apps.accounts.models import User
    
    # Check if any users exist
    if User.objects.exists():
        print('Users already exist. Skipping fixture loading.')
        return

    # Load users from fixture
    try:
        call_command('loaddata', 'users.json')
        print('Successfully loaded users from fixture.')
    except Exception as e:
        print(f'Error loading users fixture: {e}')

if __name__ == '__main__':
    load_initial_users()

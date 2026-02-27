# Load initial users for production deployment
import os
if os.environ.get("DJANGO_SETTINGS_MODULE", "").endswith("prod"):
    from django.core.management import call_command
    try:
        call_command('load_initial_users')
    except Exception:
        pass  # Silently fail if command doesn't work during migrations
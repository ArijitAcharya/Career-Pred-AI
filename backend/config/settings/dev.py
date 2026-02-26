from pathlib import Path
from .base import *  # noqa

DEBUG = True

# Use SQLite for local development (no PostgreSQL needed)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": Path(__file__).resolve().parent.parent.parent / "db.sqlite3",
    }
}

# Override any specific settings for development if needed

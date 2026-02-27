#!/bin/bash

# Render build script for Career Prediction AI Backend
echo "Starting build process..."

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Apply migrations
python manage.py migrate --noinput

echo "Build completed successfully!"

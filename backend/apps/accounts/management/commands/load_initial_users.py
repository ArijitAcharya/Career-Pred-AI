from django.core.management.base import BaseCommand
from django.core.management import call_command
from apps.accounts.models import User


class Command(BaseCommand):
    help = 'Load initial users from fixture if no users exist'

    def handle(self, *args, **options):
        # Check if any users exist
        if User.objects.exists():
            self.stdout.write(
                self.style.SUCCESS('Users already exist. Skipping fixture loading.')
            )
            return

        # Load users from fixture
        try:
            call_command('loaddata', 'users.json')
            self.stdout.write(
                self.style.SUCCESS('Successfully loaded users from fixture.')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error loading users fixture: {e}')
            )

from django.contrib.auth import get_user_model
from django.contrib.auth.management.commands.createsuperuser import Command as BaseCommand
from getpass import getpass
from django.core.management import CommandError


class Command(BaseCommand):
    help = 'Create user with custom fields'
    def handle(self, *args, **options):
        User = get_user_model()
        first_name = input('First name: ')
        last_name = input('Last name: ')
        phone = input('Phone: ')
        email = input('Email: ')
        password = getpass('Password: ')
        password_confirmation = getpass('Password (again): ')

        if password != password_confirmation:
            raise CommandError("Password don't match")
        User.objects.create_superuser(email=email,
                                      password=password,
                                      first_name=first_name,
                                      last_name=last_name,
                                      phone=phone)
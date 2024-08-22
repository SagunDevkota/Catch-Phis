import os

from celery import Celery
from celery.schedules import crontab
from django.conf import settings
from config.env import env

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.django.base')

app = Celery('app', broker=env("CELERY_BROKER", default="amqp://devuser:changeme@rabbitmq:5672/"), backend=env("CELERY_BROKER", default="rpc://"))
app.conf.broker_connection_retry_on_startup = True
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object(settings, namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'run-task-every-month': {
        'task': 'config.settings.common_tasks.update_domain',  # Replace with the actual path to your task function
        'schedule': crontab(day_of_month=1, hour=0, minute=0),
    },
}

# if 'runserver' in sys.argv:
#     # Discard pending tasks during hot reload
#     app.control.purge()
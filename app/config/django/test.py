from .base import *

CELERY_BROKER_URL = env("CELERY_BROKER", default="amqp://devuser:changeme@rabbitmq:5672/")
CELERY_RESULT_BACKEND = env("CELERY_BACKEND", default="rpc://")
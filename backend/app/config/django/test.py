from .base import *

DATABASES = {
    'default': {
        'ENGINE' : "django.db.backends.postgresql",
        'HOST' : os.environ.get("POSTGRES_HOST"),
        'NAME' : os.environ.get("POSTGRES_DB"),
        'USER' : os.environ.get("POSTGRES_USER"),
        'PASSWORD' : os.environ.get("POSTGRES_PASSWORD"),
        'TIME_ZONE': 'Asia/Kathmandu',
        'CONN_MAX_AGE': 600,
    },
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5500",
]

CELERY_BROKER_URL = env("CELERY_BROKER", default="amqp://devuser:changeme@rabbitmq:5672/")
CELERY_RESULT_BACKEND = env("CELERY_BACKEND", default="rpc://")

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env("host",default="")
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("email",default="")
EMAIL_HOST_PASSWORD = env("password",default="")

STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = env('STRIPE_WEBHOOK_SECRET')
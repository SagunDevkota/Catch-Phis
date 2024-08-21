from .base import *

DEBUG = env.bool('DJANGO_DEBUG',default=False)
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS',default=['django'])
print(ALLOWED_HOSTS)

INSTALLED_APPS.append('silk')

MIDDLEWARE.append('silk.middleware.SilkyMiddleware')

CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1',
    'http://localhost',
]

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
    "https://asp-adequate-tortoise.ngrok-free.app"
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env("host",default="")
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("email",default="")
EMAIL_HOST_PASSWORD = env("password",default="")

STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = env('STRIPE_WEBHOOK_SECRET')
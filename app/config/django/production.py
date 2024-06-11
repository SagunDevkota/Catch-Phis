from .base import *

DEBUG = env.bool('DJANGO_DEBUG',default=False)
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS',default=[])
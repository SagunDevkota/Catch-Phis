# gunicorn.conf.py

import multiprocessing


bind = '127.0.0.1:8000'
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gevent'
timeout = 300 
keepalive = 2 
errorlog = '/app/logs/error.log' 
accesslog = '/app/logs/access.log'
loglevel = 'info' 

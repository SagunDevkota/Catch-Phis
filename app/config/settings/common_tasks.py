from django.core.mail import EmailMessage
from django.conf import settings
from config.settings.celery import app

@app.task
def send_email(subject: str, message: str, to_list: list):
    from_email = settings.EMAIL_HOST_USER
    if subject and message and from_email and to_list:
        try:
            email = EmailMessage(subject, message, from_email, to=to_list)
            email.content_subtype = 'html'
            email.send()
            return True
        except Exception as e:
            return False
    else:
        return False
    

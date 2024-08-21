from django.core.mail import EmailMessage
from django.conf import settings
from config.settings.celery import app
from prediction.models import LegitDomain
import requests
import io
import zipfile
import csv

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
    
@app.task
def update_domain():
    response = requests.get("https://www.domcop.com/files/top/top10milliondomains.csv.zip")
    domains = []
    with zipfile.ZipFile(io.BytesIO(response.content)) as the_zip:
        csv_filename = the_zip.namelist()[0]
        with the_zip.open(csv_filename) as csvfile:
            csv_reader = csv.reader(io.TextIOWrapper(csvfile, encoding='utf-8'))
            
            # Print the first few rows
            for i, row in enumerate(csv_reader):
                domains.append(row[1])
                if(i==1000000):
                    break
    domains = domains[1:]
    legit_domains = [LegitDomain(domain=domain) for domain in domains]
    LegitDomain.objects.bulk_create(objs=legit_domains,batch_size=10000,ignore_conflicts=True)
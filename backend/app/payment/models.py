from django.db import models
from corporate.models import CorporateDetail


class Subscription(models.Model):
    session_id = models.CharField(primary_key=True,max_length=100)
    subscription_id = models.CharField(max_length=100,default=None,null=True)
    corporate = models.ForeignKey(CorporateDetail,on_delete=models.CASCADE,related_name="subscription_corporate_detail")
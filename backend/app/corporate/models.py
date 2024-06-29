from django.db import models
from django.contrib.auth import get_user_model

class CorporateDetail(models.Model):
    company_name = models.CharField(max_length=255)
    contact_email = models.EmailField(max_length=100,unique=True)
    contact_phone = models.CharField(max_length=10,unique=True)
    activated = models.BooleanField(default=False)
    subscribed = models.BooleanField(default=False)
    subscription_expires_at = models.DateField(default=None,null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.company_name

class CorporateUser(models.Model):
    ROLE_CHOICES = (
        ('admin',"Admin"),
        ("employee","Employee")
    )
    user = models.ForeignKey(get_user_model(),on_delete=models.CASCADE)
    role = models.CharField(max_length=9,choices=ROLE_CHOICES)
    corporate_details = models.ForeignKey(CorporateDetail,on_delete=models.CASCADE,related_name='corporate_user_detail')

    def __str__(self) -> str:
        return f"{self.user.email} - {self.corporate_details.company_name} ({self.role})"
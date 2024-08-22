from django.db import models
from django.contrib.auth import get_user_model

class AccessControl(models.Model):
    """Model for whitelisted domains for a user."""
    DOMAIN_TYPE_CHOICES = (
        ('whitelist','Whitelist'),
        ('blacklist','Blacklist')
    )
    domain = models.CharField(max_length=255)
    domain_type = models.CharField(choices=DOMAIN_TYPE_CHOICES,max_length=9)
    user = models.ForeignKey(get_user_model(),on_delete=models.CASCADE)

    class Meta:
        unique_together = ('domain', 'user')
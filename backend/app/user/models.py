from typing import Any, Iterable
from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin
)
import uuid

class UserManager(BaseUserManager):
    def create_user(self,email, password=None, **extra_fields):
        if not email:
            raise ValueError("User must have an email address.")
        user = self.model(email=self.normalize_email(email),**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password, **extra_field):
        """Create and return a new superuser."""
        user = self.create_user(email=email,
                                **extra_field)
        user.set_password(password)
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser, PermissionsMixin):
    """Define user model."""
    ACCOUNT_TYPE_CHOICES = (
        ('personal','Personal'),
        ('corporate','corporate')
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=10)
    email = models.EmailField(max_length=255, unique=True,db_index=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    account_type = models.CharField(max_length=9,choices=ACCOUNT_TYPE_CHOICES,default='personal')
    parent_user = models.ForeignKey('self', null=True, default=None, on_delete=models.CASCADE)
    extension_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True,db_index=True)
    extension_validator = models.CharField(default=None,null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self) -> str:
        return self.email

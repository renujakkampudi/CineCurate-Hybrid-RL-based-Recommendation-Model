from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    bio = models.TextField(_("bio"), blank=True, null=True)
    avatar = models.ImageField(_("profile picture"), upload_to='avatars/', null=True, blank=True)
    email = models.EmailField(_("email address"), unique=True)
    phone_number = models.CharField(_("phone number"), max_length=15, blank=True, null=True)
    address = models.TextField(_("address"), blank=True, null=True)
    subscription = models.CharField(_("subscription"), max_length=50, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']



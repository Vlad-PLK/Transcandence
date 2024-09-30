from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_2fa_enabled = models.BooleanField(default=False)
    secret_key = models.CharField(max_length=32, blank=True, null=True)

    def generate_2fa_secret_key(self):
        if not self.secret_key:
            self.secret_key = pyotp.random_base32()  
            self.save()
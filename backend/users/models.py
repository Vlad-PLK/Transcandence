from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_2fa_enabled = models.BooleanField(default=False)
    secret_key = models.CharField(max_length=32, blank=True, null=True)
    online_status = models.BooleanField(default=False)

    startFlag = models.DecimalField(max_digits=2, default=0, decimal_places=0)
    gargantuaSize = models.DecimalField(max_digits=2, default=0, decimal_places=0)
    gargantuaColor = models.CharField(default="#c5e0e2", max_length=10)
    customStarSize = models.DecimalField(max_digits=2, default=4, decimal_places=0)
    gargantuaIntensity = models.DecimalField(max_digits=2, default=1, decimal_places=0)
    customStarColor = models.CharField(default="#DC1010", max_length=10)
    customCoronaType = models.DecimalField(max_digits=2, default=0, decimal_places=0)
    customStarIntensity = models.DecimalField(max_digits=2, default=4, decimal_places=0)
    boostsEnabled = models.DecimalField(max_digits=2, default=0, decimal_places=0)
    boostFactor = models.DecimalField(max_digits=2, default=1, decimal_places=0)
    powerEnabled = models.DecimalField(max_digits=2, default=0, decimal_places=0)
    gameDuration = models.DecimalField(max_digits=2, default=10, decimal_places=0)

    def generate_2fa_secret_key(self):
        if not self.secret_key:
            self.secret_key = pyotp.random_base32()  
            self.save()
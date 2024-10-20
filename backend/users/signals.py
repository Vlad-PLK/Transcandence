from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
from gameinfo.models import PlayerStats


@receiver(post_save, sender=CustomUser)
def create_player_stats(sender, instance, created, **kwargs):
    if created:
        PlayerStats.objects.create(player=instance)
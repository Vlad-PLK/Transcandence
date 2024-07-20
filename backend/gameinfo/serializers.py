from rest_framework import serializers
from .models import PlayerStats


class PlayerStatsSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.username')

    class Meta:
        model = PlayerStats
        fields = ['player_name', 'wins', 'losses', 'draws', 'goals']
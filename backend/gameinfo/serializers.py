from rest_framework import serializers
from .models import PlayerStats
from users.models import CustomUser

class PlayerStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerStats
        fields = ['wins', 'losses', 'draws', 'goals', 'player']


class PlayerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar']
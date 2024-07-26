from rest_framework import serializers
from .models import PlayerStats
from django.contrib.auth.models import User

class PlayerStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerStats
        fields = ['wins', 'losses', 'draws', 'goals', 'player']


class PlayerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
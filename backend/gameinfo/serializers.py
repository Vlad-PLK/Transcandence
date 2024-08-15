from rest_framework import serializers
from .models import PlayerStats, Match
from users.models import CustomUser

class PlayerStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerStats
        fields = ['wins', 'losses', 'draws', 'goals', 'player']


class PlayerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar']


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['player1', 'player2', 'player1_score', 'player2_score', 'match_winner']
        
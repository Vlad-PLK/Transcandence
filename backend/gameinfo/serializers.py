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
    player1_name = serializers.SerializerMethodField()
    player2_name = serializers.SerializerMethodField()
    match_winner_name = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = ['player1_name', 'player2_name', 'player1_score', 'player2_score', 'match_winner_name']

    def get_player1_name(self, obj):
        return obj.player1.username

    def get_player2_name(self, obj):
        return obj.player2.username

    def get_match_winner_name(self, obj):
        return obj.match_winner.username
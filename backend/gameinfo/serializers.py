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
        fields = ['id', 'username', 'email', 'avatar', 'online_status']


class MatchSerializer(serializers.ModelSerializer):
    player1_name = serializers.SerializerMethodField()
    player2_name = serializers.SerializerMethodField()
    match_winner_name = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = ['player1', 'player2', 'player1_score', 'player2_score', 'match_winner', 'player1_name', 'player2_name', 'match_winner_name']

    def get_player1_name(self, obj):
        return obj.player1.username

    def get_player2_name(self, obj):
        return obj.player2.username

    def get_match_winner_name(self, obj):
        # Проверяем, есть ли победитель
        if obj.match_winner is not None:
            return obj.match_winner.username
        return "Ничья"
    
class UsernameSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)


class GameSettingsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'startFlag',
            'gargantuaSize',
            'gargantuaColor',
            'customStarSize',
            'gargantuaIntensity',
            'customStarColor',
            'customCoronaType',
            'customStarIntensity',
            'boostsEnabled',
            'boostFactor',
            'powerEnabled',
            'gameDuration',
        ]

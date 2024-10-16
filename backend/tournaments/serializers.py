from rest_framework import serializers
from .models import Tournament, Participant, TournamentMatch


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'creator']
        read_only_fields = ['creator']


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'tournament', 'nickname']


class TournamentMatchSerializer(serializers.ModelSerializer):
    player1_name = serializers.SerializerMethodField()
    player2_name = serializers.SerializerMethodField()

    class Meta:
        model = TournamentMatch
        fields = ['id', 'player1', 'player2', 'player1_name', 'player2_name']

    def get_player1_name(self, obj):
        return obj.player1.nickname

    def get_player2_name(self, obj):
        return obj.player2.nickname
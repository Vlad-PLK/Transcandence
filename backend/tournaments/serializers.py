from rest_framework import serializers
from .models import Tournament, Participant


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'creator']
        read_only_fields = ['creator']

    

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'tournament', 'nickname']

from rest_framework import serializers
from .models import Tournament, Participant, TournamentMatch
from django.db import models


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
        fields = ['id', 'player1', 'player2', 'player1_name', 'player2_name', 'winner']

    def get_player1_name(self, obj):
        return obj.player1.nickname

    def get_player2_name(self, obj):
        return obj.player2.nickname


class MatchStatsSerializer(serializers.ModelSerializer):
    opponent_name = serializers.SerializerMethodField()
    goals_scored = serializers.SerializerMethodField()
    goals_conceded = serializers.SerializerMethodField()

    class Meta:
        model = TournamentMatch
        fields = ['id', 'round', 'opponent_name', 'goals_scored', 'goals_conceded', 'winner']

    def get_opponent_name(self, obj):
        player = self.context.get('player')
        if obj.player1 == player:
            return obj.player2.nickname
        else:
            return obj.player1.nickname

    def get_goals_scored(self, obj):
        player = self.context.get('player')
        return obj.player1_goals if obj.player1 == player else obj.player2_goals

    def get_goals_conceded(self, obj):
        player = self.context.get('player')
        return obj.player2_goals if obj.player1 == player else obj.player1_goals


class UserTournamentStatsSerializer(serializers.ModelSerializer):
    tournament_name = serializers.CharField(source='tournament.name')
    goals = serializers.SerializerMethodField()
    matches = serializers.SerializerMethodField()

    class Meta:
        model = Participant
        fields = ['tournament_name', 'goals', 'matches']

    def get_goals(self, obj):
        matches_as_player1 = TournamentMatch.objects.filter(player1=obj).aggregate(models.Sum('player1_goals'))['player1_goals__sum'] or 0
        matches_as_player2 = TournamentMatch.objects.filter(player2=obj).aggregate(models.Sum('player2_goals'))['player2_goals__sum'] or 0
        return matches_as_player1 + matches_as_player2

    def get_matches(self, obj):
        matches = TournamentMatch.objects.filter(models.Q(player1=obj) | models.Q(player2=obj), tournament=obj.tournament)
        return MatchStatsSerializer(matches, many=True, context={'player': obj}).data
from rest_framework import generics
from gameinfo.models import PlayerStats
from .models import Tournament, Participant, TournamentMatch
from .serializers import TournamentSerializer, ParticipantSerializer, TournamentMatchSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import update_match_stats
import random
from django.db import models
from rest_framework import status
from django.shortcuts import get_object_or_404
from users.models import CustomUser


class CreateTournamentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serlializer = TournamentSerializer(data=request.data)

        name = request.data.get('name')
        if Tournament.objects.filter(name=name).exists():
            return Response({"details": "Tournament with this name already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        if serlializer.is_valid():
            serlializer.save(creator=request.user)
            return Response(serlializer.data, status=status.HTTP_200_OK)
    
        return Response(serlializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class ListTournamentsView(generics.ListAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tournament.objects.filter(creator=self.request.user)


class AddParticipantView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ParticipantSerializer(data=request.data)

        nickname = request.data.get('nickname')
        if not CustomUser.objects.filter(username=nickname).exists():
            return Response({"details": "There is no users with this username"}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShuffleParticipantsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        tournament = Tournament.objects.get(pk=pk)
        participants = list(tournament.participants.all())
        random.shuffle(participants)

        matches = []
        for i in range(0, len(participants), 2):
            if i + 1 < len(participants):
                match = TournamentMatch.objects.create(
                    tournament=tournament,
                    player1=participants[i],
                    player2=participants[i+1]
                )
                matches.append(match)

        return Response({'status': 'Participants shuffled and matches created!'})


class AdvanceToNextRoundView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        tournament = Tournament.objects.get(pk=pk)

        current_round = request.data.get('round', 1)

        matches = TournamentMatch.objects.filter(tournament=tournament, round=current_round)
        winners = [match.winner for match in matches if match.winner]

        if len(winners) != len(matches):
            return Response({'error': 'Not all matches are finished'}, status=400)

        next_round = current_round + 1
        if len(winners) < 2:
            return Response({'error': 'Not enough players for the next round'}, status=400)

        random.shuffle(winners)

        for i in range(0, len(winners), 2):
            if i + 1 < len(winners):
                TournamentMatch.objects.create(
                    tournament=tournament,
                    player1=winners[i],
                    player2=winners[i + 1],
                    round=next_round
                )

        return Response({'status': f'Round {next_round} matches created!'})


class MatchResultView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        try:
            match = TournamentMatch.objects.get(pk=match_id)
        except TournamentMatch.DoesNotExist:
            return Response({'error': 'Match not found'}, status=404)

        match.player1_goals = request.data.get('player1_goals')
        match.player2_goals = request.data.get('player2_goals')

        if match.player1_goals > match.player2_goals:
            match.winner = match.player1 
            if match.round == 3:
                tournament = match.tournament
                tournament.winner = match.player1.nickname
                tournament.save()
        if match.player2_goals > match.player1_goals:
            match.winner = match.player2
            if match.round == 3:
                tournament = match.tournament
                tournament.winner = match.player2.nickname
                tournament.save()

        match.save()
        update_match_stats(match)
        return Response({'status': 'Match result and stats updated successfully!'})


class GetMatchesToPlayView(APIView):
    def get_current_round(self, tournament):
        max_round_with_unfinished_matches = TournamentMatch.objects.filter(
            tournament=tournament, 
            winner__isnull=True 
        ).aggregate(max_round=models.Max('round'))['max_round']
        
        return max_round_with_unfinished_matches if max_round_with_unfinished_matches else 1

    def get_matches_to_play(self, tournament):
        current_round = self.get_current_round(tournament)
        
        matches_to_play = TournamentMatch.objects.filter(
            tournament=tournament,
            round=current_round,
            winner__isnull=True  
        )
        
        return matches_to_play

    def get(self, request, pk):
        try:
            tournament = Tournament.objects.get(id=pk)
            
            matches_to_play = self.get_matches_to_play(tournament)
            
            serializer = TournamentMatchSerializer(matches_to_play, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Tournament.DoesNotExist:
            return Response({'error': 'Tournament not found'}, status=status.HTTP_404_NOT_FOUND)


class TournamentParticipantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            tournament = Tournament.objects.get(id=pk)
        except:
            return Response({'error': 'Tournament not found'}, status=status.HTTP_404_NOT_FOUND)
        
        participants = tournament.participants.all()
        serializer = ParticipantSerializer(participants, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    
class GetUserTournamentsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        nickname = request.user.username

        try:
            participant = Participant.objects.get(nickname=nickname)
        except:
            return Response({"error": "No tournamets was found"})
        
        serializer = ParticipantSerializer(participant)
        return Response(serializer.data)
    

class GetUserTournamentsStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        participant_nickname = request.user.username
        tournament = get_object_or_404(Tournament, pk=pk)

        participant = get_object_or_404(Participant, tournament=tournament, nickname=participant_nickname)

        matches_as_player1 = TournamentMatch.objects.filter(tournament=tournament, player1=participant)
        matches_as_player2 = TournamentMatch.objects.filter(tournament=tournament, player2=participant)

        total_goals = sum(match.player1_goals for match in matches_as_player1) + sum(match.player2_goals for match in matches_as_player2)
        wins = TournamentMatch.objects.filter(tournament=tournament, winner=participant).count()
        losses = matches_as_player1.count() + matches_as_player2.count() - wins
        matches = []

        for match in matches_as_player1:
            matches.append({
                'player1': match.player1.nickname,
                'player2': match.player2.nickname,
                'player1_goals': match.player1_goals,
                'player2_goals': match.player2_goals,
                'winner': match.winner.nickname if match.winner else None,
                'round': match.round
            })

        for match in matches_as_player2:
            matches.append({
                'player1': match.player1.nickname,
                'player2': match.player2.nickname,
                'player1_goals': match.player1_goals,
                'player2_goals': match.player2_goals,
                'winner': match.winner.nickname if match.winner else None,
                'round': match.round
            })

        stats = {
            'nickname': participant.nickname,
            'total_goals': total_goals,
            'wins': wins,
            'losses': losses,
            'matches': matches
        }


class GetTournamentMatchInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
            
        match = TournamentMatch.objects.get(pk=pk)

        serializer = TournamentMatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class GetAllTournamentMatches(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk): 
        tournament = Tournament.objects.get(pk=pk)

        matches = TournamentMatch.objects.filter(tournament=tournament)

        serializer = TournamentMatchSerializer(matches, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
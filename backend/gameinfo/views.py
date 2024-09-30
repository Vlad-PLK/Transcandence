from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import PlayerStats, Match
from .serializers import PlayerStatsSerializer, PlayerInfoSerializer, MatchSerializer, UsernameSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.models import CustomUser

class PlayerStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            player_stats = PlayerStats.objects.get(player=user)
            serializer = PlayerStatsSerializer(player_stats)
            return Response(serializer.data)
        except:
            return Response({"error": "Player stats not found"}, status=404)
        

class PlayerInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = PlayerInfoSerializer(user)
        return Response(serializer.data)


class MatchCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MatchSerializer(data=request.data)
        if serializer.is_valid():
            match = serializer.save()

            player1_stats = PlayerStats.objects.get(player=match.player1)
            player2_stats = PlayerStats.objects.get(player=match.player2)

            if match.player1_score > match.player2_score:
                match.match_winner = match.player1
                player1_stats.wins += 1
                player2_stats.losses += 1
            elif match.player1_score < match.player2_score:
                match.match_winner = match.player2
                player1_stats.wins += 1
                player2_stats.losses += 1
            else:
                player1_stats.draws += 1
                player2_stats.draws += 1

            player1_stats.goals += match.player1_score
            player2_stats.goals += match.player2_score

            player1_stats.save()
            player2_stats.save()
            match.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GetMatches(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        matches = Match.objects.filter(player1=user) | Match.objects.filter(player2=user)
        if matches.count() == 0:
            return Response({"error": "No matches found"}, status=200)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)
    

class GetUserId(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *argv, **kwargs):
        serializer = UsernameSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            try:
                user = CustomUser.objects.get(username=username)
                return Response({'user_id': user.id}, status=status.HTTP_200_OK);
            except CustomUser.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

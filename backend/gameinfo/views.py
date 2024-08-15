from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import PlayerStats, Match
from .serializers import PlayerStatsSerializer, PlayerInfoSerializer, MatchSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated


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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GetMatches(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        matches = Match.objects.filter(player1=user) | Match.objects.filter(player2=user)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)
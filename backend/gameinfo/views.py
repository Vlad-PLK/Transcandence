from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import PlayerStats
from .serializers import PlayerStatsSerializer
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
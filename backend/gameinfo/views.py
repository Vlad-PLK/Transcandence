from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from .models import PlayerStats
from .serializers import PlayerStatsSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


class PlayerStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        player_id = kwargs.get('player_id')
        try:
            player_stats = PlayerStats.objects.get(player_id=player_id)
            serializer = PlayerStatsSerializer(player_stats)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PlayerStats.DoesNotExist:
            return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)
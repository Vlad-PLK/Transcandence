from rest_framework import generics
from .models import Tournament, Participant, TournamentMatch
from .serializers import TournamentSerializer, ParticipantSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import random

class CreateTournamentView(generics.CreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class ListTournamentsView(generics.ListAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tournament.objects.filter(creator=self.request.user)

class AddParticipantView(generics.CreateAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [IsAuthenticated]

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
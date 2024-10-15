from django.urls import path
from .views import CreateTournamentView, ListTournamentsView, AddParticipantView, ShuffleParticipantsView

urlpatterns = [
    path("create-tournament/", CreateTournamentView.as_view(), name='create-tournament'),
    path("list-tournaments/", ListTournamentsView.as_view(), name='list-tournaments'),
    path("add-participant/", AddParticipantView.as_view(), name='add-participant'),
    path("tournament/<int:pk>/shuffle-participants/", ShuffleParticipantsView.as_view(), name='shuffle-participants'),
]
from django.urls import path
from .views import (CreateTournamentView, ListTournamentsView, AddParticipantView, 
                    ShuffleParticipantsView, AdvanceToNextRoundView, MatchResultView, GetMatchesToPlayView,
                    TournamentParticipantsView, GetUserTournamentsListView, GetUserTournamentsStatsView, 
                    GetTournamentMatchInfoView, GetAllTournamentMatches, FinalizeTournamentView, 
                    GetTournamentStatsView)

urlpatterns = [
    path("tournament/create-tournament/", CreateTournamentView.as_view(), name='create-tournament'),
    path("tournament/list-tournaments/", ListTournamentsView.as_view(), name='list-tournaments'),
    path("tournament/add-participant/", AddParticipantView.as_view(), name='add-participant'),
    path("tournament/<int:pk>/shuffle-participants/", ShuffleParticipantsView.as_view(), name='shuffle-participants'),
    path('tournament/<int:pk>/advance-round/', AdvanceToNextRoundView.as_view(), name='advance-to-next-round'),
    path('tournament/match/<int:match_id>/result/', MatchResultView.as_view(), name='match-result-view'),
    path('tournament/<int:pk>/needed-matches/', GetMatchesToPlayView.as_view(), name='needed-matches'),
    path('tournament/<int:pk>/participants/', TournamentParticipantsView.as_view(), name='tournament-participants'),
    path('tournaments/get-user-tournaments/', GetUserTournamentsListView.as_view(), name='get-user-tournaments'),
    path('tournamets/<int:pk>/user-tournament-stats/', GetUserTournamentsStatsView.as_view(), name='get-user-tournament-stats'),
    path('tournament/<int:pk>/match-info/', GetTournamentMatchInfoView.as_view(), name='get-match-info'),
    path('tournament/<int:pk>/tournament-matches/', GetAllTournamentMatches.as_view(), name='get-matches-tour'),
    path('tournament/<int:pk>/finalize/', FinalizeTournamentView.as_view(), name='finalize-tournament'),
    path('tournaments/get-tournaments-stats/', GetTournamentStatsView.as_view(), name='tournament-stats')
    
]
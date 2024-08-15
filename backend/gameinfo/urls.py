from django.urls import path
from .views import PlayerStatsView, PlayerInfoView, MatchCreateView, GetMatches

urlpatterns = [
    path('api/player-stats/', PlayerStatsView.as_view(), name='player-stats'),
    path('api/player-info/', PlayerInfoView.as_view(), name='player-stats'),
    path('api/match-create/', MatchCreateView.as_view(), name='match-create'),
    path('api/get-matches/', GetMatches.as_view(), name='get-matches'),
]

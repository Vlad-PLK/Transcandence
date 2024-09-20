from django.urls import path
from .views import PlayerStatsView, PlayerInfoView, MatchCreateView, GetMatches

urlpatterns = [
    path('player-stats/', PlayerStatsView.as_view(), name='player-stats'),
    path('player-info/', PlayerInfoView.as_view(), name='player-stats'),
    path('match-create/', MatchCreateView.as_view(), name='match-create'),
    path('get-matches/', GetMatches.as_view(), name='get-matches'),
]

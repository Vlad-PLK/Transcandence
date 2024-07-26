from django.urls import path
from .views import PlayerStatsView, PlayerInfoView

urlpatterns = [
    path('api/player-stats/', PlayerStatsView.as_view(), name='player-stats'),
    path('api/player-info/', PlayerInfoView.as_view(), name='player-stats')
]

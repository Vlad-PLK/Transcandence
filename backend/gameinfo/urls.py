from django.urls import path
from .views import PlayerStatsView

urlpatterns = [
    path('api/player-stats/<int:player_id>/', PlayerStatsView.as_view(), name='player-stats')
]

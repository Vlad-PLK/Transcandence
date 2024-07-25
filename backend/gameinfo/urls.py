from django.urls import path
from .views import PlayerStatsView

urlpatterns = [
    path('api/player-stats/', PlayerStatsView.as_view(), name='player-stats')
]

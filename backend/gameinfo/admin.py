from django.contrib import admin
from .models import Match, PlayerStats
# Register your models here.

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('player1', 'player2', 'match_date')


@admin.register(PlayerStats)
class PlayerStatsAdmin(admin.ModelAdmin):
    list_display = ('player', 'wins', 'losses')
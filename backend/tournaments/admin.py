from django.contrib import admin
from .models import Tournament, Participant, TournamentMatch

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('nickname', 'id')

@admin.register(TournamentMatch)
class TournamentMatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'tournament')
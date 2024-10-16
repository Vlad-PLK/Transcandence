from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Tournament(models.Model):
    name = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    winner = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f'{self.name}'

class Participant(models.Model):
    tournament = models.ForeignKey(Tournament, related_name='participants',on_delete=models.CASCADE, null=True, blank=True)
    nickname = models.CharField(max_length=55)
    
    def __str__(self):
        return f'{self.nickname}'

class TournamentMatch(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches', null=True, blank=True)
    player1 = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='player1_matches')
    player2 = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='player2_matches')
    winner = models.ForeignKey(Participant, null=True, blank=True, on_delete=models.SET_NULL, related_name='won_matches')
    player1_goals = models.IntegerField(default=0)
    player2_goals = models.IntegerField(default=0)
    round = models.IntegerField(default=1)
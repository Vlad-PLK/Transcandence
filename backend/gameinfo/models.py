from django.db import models
from django.contrib.auth.models import User
from users.models import CustomUser

class Match(models.Model):
    player1 = models.ForeignKey(CustomUser, related_name='player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(CustomUser, related_name='player2', on_delete=models.CASCADE)
    match_date = models.DateField(auto_now_add=True)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    match_winner = models.ForeignKey(CustomUser, related_name='winner_player', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f'Match between {self.player1.username} and {self.player2.username} on {self.match_date}'


class PlayerStats(models.Model):
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    goals = models.IntegerField(default=0)
    player = models.ForeignKey(CustomUser, related_name='player_stats', on_delete=models.CASCADE)

    def __str__(self):
        return f'Stats for {self.player.username}: {self.wins} wins, {self.losses} losses, {self.draws} draws, {self.goals} goals'
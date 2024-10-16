from .models import Participant
from gameinfo.models import PlayerStats
from users.models import CustomUser

def update_match_stats(match):
    try:
        player1 = CustomUser.objects.get(username=match.player1.nickname)
        player1_stats = PlayerStats.objects.get(player=player1)
    except (CustomUser.DoesNotExist, PlayerStats.DoesNotExist):
        player1_stats = None
    
    try:
        player2 = CustomUser.objects.get(username=match.player2.nickname)
        player2_stats = PlayerStats.objects.get(player=player2)
    except (CustomUser.DoesNotExist, PlayerStats.DoesNotExist):
        player2_stats = None

    if player1_stats and player2_stats:
        if match.winner == match.player1:
            player1_stats.wins += 1
            player2_stats.losses += 1
        else:
            player2_stats.wins += 1
            player1_stats.losses += 1
        
        player1_stats.goals += match.player1_goals
        player2_stats.goals += match.player2_goals

        player1_stats.save()
        player2_stats.save()

    elif player1_stats: 
        player1_stats.goals += match.player1_goals
        if match.winner == match.player1:
            player1_stats.wins += 1
        else:
            player1_stats.losses += 1
        player1_stats.save()

    elif player2_stats:
        player2_stats.goals += match.player2_goals
        if match.winner == match.player1:
            player2_stats.losses += 1
        else:
            player2_stats.wins += 1
        player2_stats.save()

        
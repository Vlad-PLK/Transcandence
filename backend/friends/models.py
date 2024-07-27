from django.db import models
from users.models import CustomUser

class FriendRequest(models.Model):
    from_user = models.ForeignKey(CustomUser, related_name='sent_friend_request', on_delete=models.CASCADE)
    to_user = models.ForeignKey(CustomUser, related_name='received_friend_request', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('from_user', 'to_user')

    
class Friendship(models.Model):
    user1 = models.ForeignKey(CustomUser, related_name='friend1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(CustomUser, related_name='friend2', on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2')
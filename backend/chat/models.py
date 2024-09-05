from django.db import models
from users.models import CustomUser

class Message(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='send_message', on_delete=models.CASCADE)
    recipient = models.ForeignKey(CustomUser, related_name='received_message', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.recipient}: {self.content[:20]}"
    
    class Meta:
        ordering = ['timestamp']
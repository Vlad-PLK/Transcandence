from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Message
from .serializers import MessageSerializer
from django.db.models import Q


class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class DialogView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        recipient_id = self.kwargs['user_id']
        return Message.objects.filter(
            Q(sender=user, recipient_id=recipient_id) | Q(sender_id=recipient_id, recipient=user)
        ).order_by('timestamp')
from django.shortcuts import render
from .serializers import FriendRequestSerializer, FriendshilSerializer
from .models import Friendship, FriendRequest
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class FriendRequestCreateView(generics.CreateAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)


class FriendRequestAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, format=None):
        try:
            instance = FriendRequest.objects.get(pk=pk)
            if instance.to_user != request.user:
                return Response({'error': 'You cannot accept this friend request.'}, status=status.HTTP_400_BAD_REQUEST)
            
            Friendship.objects.create(user1=instance.from_user, user2=instance.to_user)
            
            instance.delete()
            
            return Response({'status': 'Friend request accepted'}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({'error': 'Friend request not found.'}, status=status.HTTP_404_NOT_FOUND)
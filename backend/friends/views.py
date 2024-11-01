from django.shortcuts import render
from .serializers import FriendRequestSerializer, FriendshilSerializer
from .models import Friendship, FriendRequest
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q
from users.models import CustomUser
from gameinfo.models import PlayerStats
from gameinfo.serializers import PlayerStatsSerializer, MatchSerializer
from users.serializers import UserSerializer
from gameinfo.models import Match

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
        

class GetFriendList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        friends = Friendship.objects.filter(Q(user1=request.user) | Q(user2=request.user))
        serializer = FriendshilSerializer(friends, many=True)
        return Response(serializer.data)
    

class FriendRequestsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        friend_requests = FriendRequest.objects.filter(to_user=request.user)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data)
    

class FromUserFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        friend_requests = FriendRequest.objects.filter(from_user=request.user)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data)
    
class FriendRequestRejectView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        try:
            instance = FriendRequest.objects.get(pk=pk)
            if instance.to_user != request.user:
                return Response({'error': 'You cannot reject this friend request.'}, status=status.HTTP_400_BAD_REQUEST)

            instance.delete()
            return Response({'status': 'Friend request rejected'}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({'error': 'Friend request not found.'}, status=status.HTTP_404_NOT_FOUND)
        

class DeleteFriendshipView(APIView):
    def delete(self, request, pk, format=None):
        try:
            instance = Friendship.objects.get(pk=pk)
            
            instance.delete()
            return Response({'status': 'Friendship deleted'}, status=status.HTTP_200_OK)
        
        except Friendship.DoesNotExist:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)


class GetFriendProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        friend = CustomUser.objects.get(pk=pk)
        friend_stats = PlayerStats.objects.get(player=friend)
        friend_stats_serializer = PlayerStatsSerializer(friend_stats)
        friend_profile_serializer = UserSerializer(friend)
        friend_matches = Match.objects.filter(Q(player1=friend) | Q(player2=friend))
        friend_matches_serializer = MatchSerializer(friend_matches, many=True)
        friend_status = friend.online_status

        combined_data = {
            'profile_data': friend_profile_serializer.data,
            'profile_stats': friend_stats_serializer.data,
            'profile_matches': friend_matches_serializer.data,
            'online_status': friend_status
        }
    
        return Response(combined_data, status=status.HTTP_200_OK)
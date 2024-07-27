from rest_framework import serializers
from .models import FriendRequest, Friendship
from users.models import CustomUser

class FriendRequestSerializer(serializers.ModelSerializer):
    to_user_username = serializers.CharField(write_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'to_user_username']
        extra_kwargs = {
            'from_user': {'read_only': True},
            'to_user': {'read_only': True}
        }

    def create(self, validated_data):
        to_user_username = validated_data.pop('to_user_username')
        to_user = CustomUser.objects.get(username=to_user_username)
        return FriendRequest.objects.create(to_user=to_user, **validated_data)


class FriendshilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'created_at']

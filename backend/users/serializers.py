from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate
from .utils import generate_otp, verify_otp


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email", "avatar", "online_status"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    

class UsernameUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username']

    def validate_username(sekf, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken")
        return value
    

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError("Password dont match")
        return data

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect old password")
        return value
    

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    otp_code = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        otp_code = attrs.get('otp_code')

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Not valid username or password")

        if user.is_2fa_enabled:
            if not otp_code:
                generate_otp(user)  
                raise serializers.ValidationError("You need one time code.")
            if not verify_otp(user, otp_code):
                raise serializers.ValidationError("One time code is not correct.")

        return {
            'user': user,
        }


class Get2FAStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['is_2fa_enabled']
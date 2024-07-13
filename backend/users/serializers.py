from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            username = User.objects.get(email=email).username
        except User.DoesNotExist:
            raise serializers.ValidationError("Incorrect email or password")

        if username and password:
            user = authenticate(username=username, password=password)
            if user is not None:
                data['user'] = user
            else:
                raise serializers.ValidationError("Incorrect email or password")
        else:
            raise serializers.ValidationError("Must include both email and password")
        return data
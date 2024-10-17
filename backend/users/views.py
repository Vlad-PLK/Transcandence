from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import (UserSerializer, UsernameUpdateSerializer, 
                         ChangePasswordSerializer, CustomTokenObtainPairSerializer, 
                         Get2FAStatusSerializer)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import permissions
from .models import CustomUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
import pyotp
from django.core.mail import send_mail


class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UsernameUpdateView(generics.UpdateAPIView):
    serializer_class = UsernameUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AvatarUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        user.avatar = request.data.get('avatar')
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'detail': 'Password changed succesfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Enable2FAView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request, *args, **kwargs):
        user = request.user  
        
        if user.is_2fa_enabled:
            return Response(
                {"message": "Двухфакторная аутентификация уже включена."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not user.secret_key:
            user.generate_2fa_secret_key()

        user.is_2fa_enabled = True
        user.save()

        totp = pyotp.TOTP(user.secret_key)
        otp_code = totp.now()

        send_mail(
            '2FA is enabled now',
            f'2FA is now ebabled for ur account!'
            'from@example.com',
            [user.email],
        )

        return Response(
            { 
                "message": "2Fa is now enabled.",
            },
            status=status.HTTP_200_OK
        )


class CustomTokenObtainPairView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        serializer = CustomTokenObtainPairSerializer(data=data)
        if serializer.is_valid():
            user = serializer.validated_data

            http_request = request._request
            http_request.POST = data 

            return TokenObtainPairView.as_view()(http_request)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Disable2FAView(APIView):
    permissions_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.is_2fa_enabled == False:
            return Response({'error': '2Fa is not enabled'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.secret_key:
            user.secret_key = ""
        
        user.is_2fa_enabled = False
        user.save()

        return Response({'message': '2Fa was disabled'}, status=status.HTTP_200_OK)


class Get2FAStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        serializer = Get2FAStatusSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)
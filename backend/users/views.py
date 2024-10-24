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
import hashlib
import uuid
import datetime
import os
import random
import requests

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
                {"message": "2Fa is already enalbed"},
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

class Register42APIView(APIView):
    permission_classes = [AllowAny]

    # def redirect_with_token(user, redirect_url="/"):
        # # Generate token using RefreshToken
        # refresh = RefreshToken.for_user(user)
        # token = str(refresh.access_token)

        # # Create a redirect response to the specified URL
        # resp = redirect(redirect_url)

        # # Set the token in the response as a cookie
        # resp.set_cookie('client_token', token, max_age=60 * 60 * 24)

        # return resp

    def get(self, request):
        code = request.GET.get("code")
        resp = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": "u-s4t2ud-f2e4eed0fe85865ea95e27e9d857816c8276ac645887e9b68c2cf33ea18f24d7",
                "client_secret": "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",
                "code": code,
                "redirect_uri": "https://localhost:1443/api/users/user/oauth/"
            }
        )

        if resp.status_code != 200:
            return Response({'error': 'OAuth token request failed',"raw": resp.json()}, status=status.HTTP_400_BAD_REQUEST)

        client_token = resp.json()["access_token"]

        resp = requests.get("https://api.intra.42.fr/v2/me",
                            headers={"Authorization": "Bearer " + client_token})

        if resp.status_code != 200:
            return Response({'error': 'OAuth profile request failed', "raw": resp.json()}, status=status.HTTP_400_BAD_REQUEST)

        profile42 = resp.json()
        username = profile42["login"]
        email = profile42["email"]
        return Response({'username': username, 'email': email}, status=status.HTTP_200_OK)
        # profile_img = profile42["image"]["versions"]["large"]

        # if CustomUser.objects.filter(email=email).exists():
            # user = CustomUser.objects.get(email=email)
            # # if not user.is_oauth_user:
                # # user.is_oauth_user = True
                # # user.save()
        # else:
            # original_username = username
            # while CustomUser.objects.filter(username=username).exists():
                # username = original_username + "-" + str(random.randint(111_111, 999_999))
            # user = CustomUser.objects.create_user(username=username, email=email, password=None)
            # # user.is_oauth_user = True
            # user.save()
            # # try:
                # # img_bytes = BytesIO(requests.get(profile_img).content)
                # # os.makedirs("/root/asset/avatars/", exist_ok=True)
                # # img = Image.open(img_bytes)
                # # square_crop(img).save(f"/root/asset/avatars/{user.id}.png")
            # # except Exception as e:
                # # print(e)

        # token = __create_session(request, user)
        # resp.set_cookie('client_token', token, max_age=60 * 60 * 24)
        # return redirect_with_token(user)
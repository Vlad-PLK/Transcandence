from django.urls import path
from .views import (AvatarUploadView, ChangePasswordView, CreateUserView, UsernameUpdateView, 
                    CustomTokenObtainPairView, Enable2FAView, Disable2FAView, Get2FAStatusView, Register42APIView,
                    GetEnvVariables)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("users/user/register/", CreateUserView.as_view(), name="register"),
    path("users/user/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("users/user/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('users/user/update-username/', UsernameUpdateView.as_view(), name='update-username'),
    path('users/user/avatar-upload/', AvatarUploadView.as_view(), name='avatar-upload'),
    path('users/user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/user/enable-2fa/', Enable2FAView.as_view(), name='enable-2fa'),
    path('users/user/disable-2fa/', Disable2FAView.as_view(), name='disable-2fa'),
    path('users/user/status-2fa/', Get2FAStatusView.as_view(), name='stauts-2fa'),
    path('users/user/oauth/', Register42APIView.as_view(), name='login-api'),
    path('get-env/', GetEnvVariables.as_view(), name='env')
]
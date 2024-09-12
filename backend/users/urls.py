from django.urls import path
from .views import AvatarUploadView, ChangePasswordView, CreateUserView, UsernameUpdateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("users/user/register/", CreateUserView.as_view(), name="register"),
    path("users/user/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("users/user/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('users/user/update-username/', UsernameUpdateView.as_view(), name='update-username'),
    path('users/user/avatar_upload/', AvatarUploadView.as_view(), name='avatar-upload'),
    path('users/user/change-password/', ChangePasswordView.as_view(), name='change-password'),
]
from django.contrib import admin
from django.urls import path, include
from users.views import CreateUserView, UsernameUpdateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("users/user/register/", CreateUserView.as_view(), name="register"),
    path("users/user/login/", CreateUserView.as_view(), name="login"),
    path("users/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("users/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('users/user/update-username/', UsernameUpdateView.as_view(), name='update-username'),
    path("users-auth/", include("rest_framework.urls")),
    path("", include("gameinfo.urls")),
]
from django.urls import path
from .views import AvatarUploadView, ChangePasswordView

urlpatterns = [
    path('users/avatar_upload/', AvatarUploadView.as_view(), name='avatar-upload'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
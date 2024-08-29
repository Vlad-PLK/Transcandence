from django.urls import path
from .views import AvatarUploadView

urlpatterns = [
    path('users/avatar_upload/', AvatarUploadView.as_view(), name='avatar-upload'),
]
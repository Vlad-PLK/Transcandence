from django.urls import path
from .views import FriendRequestAcceptView, FriendRequestCreateView, GetFriendList

urlpatterns = [
    path("friend-requests/", FriendRequestCreateView.as_view(), name='friend-request-create'),
    path("friend-requests/<int:pk>/accept/", FriendRequestAcceptView.as_view(), name='friend-request-accept'),
    path("friends/friend-list/", GetFriendList.as_view(), name='friend-list'),
]


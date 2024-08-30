from django.urls import path
from .views import (FriendRequestAcceptView, FriendRequestCreateView, 
                    GetFriendList, FriendRequestsListView, FromUserFriendRequestView, FriendRequestRejectView, 
                    DeleteFriendshipView)

urlpatterns = [
    path("friend-requests/", FriendRequestCreateView.as_view(), name='friend-request-create'),
    path("friend-requests/<int:pk>/accept/", FriendRequestAcceptView.as_view(), name='friend-request-accept'),
    path("friends/friend-list/", GetFriendList.as_view(), name='friend-list'),
    path("friends-requests-list/", FriendRequestsListView.as_view(), name='friend-requests-list'),
    path("friends/from-user-request-list", FromUserFriendRequestView.as_view(), name='from-user-friend-requests'),
    path("friend-requests/<int:pk>/reject/", FriendRequestRejectView.as_view(), name="friend-request-reject"),
    path("friends/<int:pk>/delete/", DeleteFriendshipView.as_view(), name="delete-friendship-view")
]


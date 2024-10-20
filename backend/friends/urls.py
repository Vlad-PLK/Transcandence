from django.urls import path
from .views import (FriendRequestAcceptView, FriendRequestCreateView, 
                    GetFriendList, FriendRequestsListView, FromUserFriendRequestView, FriendRequestRejectView, 
                    DeleteFriendshipView, GetFriendProfileView)

urlpatterns = [
    path("friends/create-friend-request/", FriendRequestCreateView.as_view(), name='friend-request-create'),
    path("friends/frient-request/<int:pk>/accept/", FriendRequestAcceptView.as_view(), name='friend-request-accept'),
    path("friends/friends-requests-list/", FriendRequestsListView.as_view(), name='friend-requests-list'),
    path("friends/friend-requests/<int:pk>/reject/", FriendRequestRejectView.as_view(), name="friend-request-reject"),
    path("friends/friend-list/", GetFriendList.as_view(), name='friend-list'),
    path("friends/from-user-request-list", FromUserFriendRequestView.as_view(), name='from-user-friend-requests'),
    path("friends/friend/<int:pk>/delete/", DeleteFriendshipView.as_view(), name="delete-friendship-view"),
    path('friends/friend/<int:pk>/get-profile/', GetFriendProfileView.as_view(), name='friend-profile'),
]


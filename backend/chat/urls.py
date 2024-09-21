from django.urls import path
from .views import SendMessageView, DialogView

urlpatterns = [
    path('send/', SendMessageView.as_view(), name='send-message'),
    path('dialog/<int:user_id>/', DialogView.as_view(), name='dialog-view')
]

from django.urls import path
from .views import register, login, UsernameUpdateView

urlpatterns = [
    path('api/register/', register, name='register'),
    path('api/login/', login, name='login'),
    path('api/change-username/', UsernameUpdateView.as_view() ,name='change-username')
]
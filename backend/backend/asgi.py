import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from django.urls import path
from .consumers import OnlineStatusConsumer


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('wss/online/', OnlineStatusConsumer.as_asgi())
        ])
    ),
})

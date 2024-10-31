import json
import redis.asyncio as redis  # Асинхронная версия Redis
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from django_redis import get_redis_connection
from channels.db import database_sync_to_async


class OnlineStatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = 'user'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        username = data['username']
        connection_type = data['type']
        print(connection_type)
        await self.change_online_status(username, connection_type)

    async def send_onlineStatus(self, event):
        data = json.loads(event.get('value'))
        username = data['username']
        online_status = data['status']
        await self.send(text_data=json.dumps({
            'username': username,
            'online_status': online_status
        }))

    async def dissconect(self, message):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def change_online_status(self, username, c_type):
        from users.models import CustomUser

        user = CustomUser.objects.get(username=username)
        if c_type == 'open':
            user.online_status = True
            user.save()
        else:
            user.online_status = False
            user.save()
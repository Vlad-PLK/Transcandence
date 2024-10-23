import json
import redis.asyncio as redis  # Асинхронная версия Redis
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from django_redis import get_redis_connection

class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.redis_conn = get_redis_connection("default")  # Подключение к Redis
        self.user_id = self.scope["user"].id if self.scope["user"].is_authenticated else None

        await self.channel_layer.group_add("status_group", self.channel_name)

        await self.accept()

        if self.user_id is None:
            self.user_id = "anonymous_user"  # Или используйте другой уникальный идентификатор
            self.redis_conn.hset("user_status", self.user_id, json.dumps({"isOnline": True}))
            await self.send(json.dumps({"message": "You are connected as a guest."}))
        else:
            self.redis_conn.hset("user_status", self.user_id, json.dumps({"isOnline": True}))
            await self.send_all_online_users()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("status_group", self.channel_name)

        if self.user_id is not None:
            self.redis_conn.hset("user_status", self.user_id, json.dumps({"isOnline": False}))
            await self.channel_layer.group_send(
                "status_group",
                {
                    'type': 'send_status',
                    'userId': self.user_id,
                    'isOnline': False,
                }
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        is_online = data.get("isOnline", False)
        self.user_id = data.get("userId", None)

        if self.user_id is not None:
            self.redis_conn.hset("user_status", self.user_id, json.dumps({"isOnline": is_online}))
            await self.channel_layer.group_send(
                "status_group",
                {
                    'type': 'send_status',
                    'userId': self.user_id,
                    'isOnline': is_online,
                }
            )

    async def send_all_online_users(self):
        all_users_status = await self.redis_conn.hgetall("user_status")

        for user_id, status in all_users_status.items():
            status_data = json.loads(status)
            if status_data["isOnline"]:
                await self.send(json.dumps({
                    'userId': user_id.decode("utf-8"),
                    'isOnline': status_data["isOnline"]
                }))

    async def send_status(self, event):
        # Обработчик для отправки статуса пользователям
        user_id = event['userId']
        is_online = event['isOnline']

        # Отправка статуса конкретному пользователю
        await self.send(json.dumps({
            'userId': user_id,
            'isOnline': is_online
        }))
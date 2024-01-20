import json
import asyncio
import uuid
import math
import logging

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)


#class Field:
#    UPDATE_RATE = 1
#    def __init__(self, objs: list, physics, width: int, length: int):
#        self.objs = objs
#        self.physics = physics
#        self.width = width
#        self.length = length
#
#    def add_objects(self, objs: list):
#        self.objs.extend(objs)
#
#    def remove_objects(self, objs: list):
#        for obj in objs
#            self.objs.remove(obj)
#
#    # the time accepted has to be at least equal to UPDATE_RATE
#    def update(self, delta_time):
#        for _ in range(delta_time // self.UPDATE_RATE):
#           self.update_position()
#           self.resolve_collision()
#           self.resolve_interactions()
#
#
#
#
#
#class Object:
#    def __init__(self, object_id, collider, pos_x, pos_y):
#        self.object_id = object_id
#        self.collider = collider
#        self.pos_x = pos_x
#        self.pos_y = pos_y


class MultiplayerConsumer(AsyncWebsocketConsumer):
    game_group_name = "game_group"
    players = {}

    BALL_VELOCITY = 1
    PLAYER_VELOCITY = 1

    update_lock = asyncio.Lock()


    async def connect(self):
        self.player_id = str(uuid.uuid4())
        await self.accept()

        await self.channel_layer.group_add(
            self.game_group_name, self.channel_name
        )

        await self.send(
            text_data=json.dumps({"type": "playerId", "playerId": self.player_id})
        )

        async with self.update_lock:
            self.players[self.player_id] = {
                "id": self.player_id,
            }

        if len(self.players) == 2:
            await self.channel_layer.group_send(
                self.game_group_name,
                {"type": "state.update", "objects": "game started"}
            )
            asyncio.create_task(self.game_loop())


    async def disconnect(self, close_code):
        async with self.update_lock:
            if self.player_id in self.players:
                del self.players[self.player_id]

        await self.channel_layer.group_discard(
            self.game_group_name, self.channel_name
        )

    async def state_update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "stateUpdate",
                    "objects": event["objects"]
                }
            )
        )

    async def game_loop(self):
        while len(self.players) > 0:
            await self.channel_layer.group_send(
                self.game_group_name,
                {"type": "state.update", "objects": [key for key, values in self.players.items()]}
            )
            
            await asyncio.sleep(0.5)

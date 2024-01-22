import json
import asyncio
import uuid
import math
import logging
import time
import random

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from multiplayer_test.engine import Ball, Paddle, Field, newton_dynamics

logger = logging.getLogger(__name__)


class MultiplayerConsumer(AsyncWebsocketConsumer):
    game_group_name = "game_group"
    players = {}

    BALL_VELOCITY = 1
    PLAYER_VELOCITY = 1

    update_lock = asyncio.Lock()
    ball = Ball(object_id="ball", radius=10, pos_x=400, pos_y=225, vel_x=50, vel_y=0)
    paddle_left = Paddle(object_id="player_left", width=20, height=80, pos_y=225, pos_x=40)
    paddle_right = Paddle(object_id="player_right", width=20, height=80, pos_y=225, pos_x=760)
    game = Field(objs=[ball, paddle_left, paddle_right], dinamics=newton_dynamics, width=800, height=450)


    async def connect(self):
        self.player_id = str(uuid.uuid4())
        await self.accept()

        await self.channel_layer.group_add(
            self.game_group_name, self.channel_name
        )

        #await self.channel_layer.group_add(
        #    self.player_id, self.channel_name
        #)

        await self.send(
            text_data=json.dumps({"type": "playerId", "playerId": self.player_id})
        )

        async with self.update_lock:
            self.players[self.player_id] = {
                "id": self.player_id,
            }

        if len(self.players) == 1:
            await self.channel_layer.group_send(
                self.game_group_name,
                {"type": "state.update", "objects": "game started"}
            )
            asyncio.create_task(self.game_loop())

        #await self.channel_layer.group_send(
        #    self.player_id,
        #    {"type": "state.update", "objects": "game started"}
        #)

        asyncio.create_task(self.game_loop())


    async def disconnect(self, close_code):
        async with self.update_lock:
            if self.player_id in self.players:
                del self.players[self.player_id]

        await self.channel_layer.group_discard(
            self.game_group_name, self.channel_name
        )

        #await self.channel_layer.group_discard(
        #    self.player_id, self.channel_name
        #)

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
            self.game.update()
            x = self.ball.pos_x - self.ball.collider.radius
            y = self.ball.pos_y - self.ball.collider.radius
            paddle_left_x = self.paddle_left.pos_x - self.paddle_left.collider.box_width
            paddle_left_y = self.paddle_left.pos_y - self.paddle_left.collider.box_height
            paddle_right_x = self.paddle_right.pos_x - self.paddle_right.collider.box_width
            paddle_right_y = self.paddle_right.pos_y - self.paddle_right.collider.box_height
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "state.update", "objects": {
                        "ball": {
                            "x": x,
                            "y": y,
                        },
                        "paddle_left": {
                            "x": paddle_left_x,
                            "y": paddle_left_y,
                        },
                        "paddle_right": {
                            "x": paddle_right_x,
                            "y": paddle_right_y,
                        },
                    }
                }
            )
            #await self.channel_layer.group_send(
            #    self.player_id,
            #    {"type": "state.update", "objects": {"x": x, "y": y}}
            #)
            
            await asyncio.sleep(0.01)

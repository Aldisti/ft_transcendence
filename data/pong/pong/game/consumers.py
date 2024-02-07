import json
import asyncio
import uuid
import math
import logging
import time
import random

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from game.engine import Ball, Paddle, Field, newton_dynamics
from users.models import Participant, Game, Stats
from users.utils import Results

logger = logging.getLogger(__name__)


class PongConsumer(AsyncWebsocketConsumer):
    BALL_VELOCITY = 1
    PLAYER_VELOCITY = 500
    GAME_TIME = 60
    WINNING = 11

    start_lock = asyncio.Lock()

    games = {}
    tickets = {}
    expired_tickets = []


    async def connect(self):
        self.accept()

    async def connect(self):

        self.other = False
        self.other_lock = asyncio.Lock()

        self.player = self.scope["user"]
        self.pos = "left"
        self.ticket = self.scope["ticket"]
        await self.accept()

        # add player to the group
        await self.channel_layer.group_add(
            self.ticket, self.channel_name
        )

        # check if someone has connected with the same ticket
        async with self.start_lock:
            other_player = self.tickets.setdefault(ticket, self.player)

        # TODO: can use 'is' to check
        if other_player.username != self.player.username:
            # remove ticket from tickets
            async with self.start_lock:
                del self.tickets[self.ticket]
            self.pos = "right"

            # generate the game
            ball = Ball(object_id="ball", radius=10, pos_x=400, pos_y=225, vel_x=0, vel_y=0)
            paddle_left = Paddle(object_id="player_left", width=20, height=80, pos_y=225, pos_x=40)
            paddle_right = Paddle(object_id="player_right", width=20, height=80, pos_y=225, pos_x=760)
            self.game = Field(objs=[ball, paddle_left, paddle_right], dinamics=newton_dynamics, width=800, height=450)
            game_info = {
                "game": self.game,
                "right": paddle_right,
                "left": paddle_left,
                "ball": ball,
                "update_lock": asyncio.Lock(),
                "connected": True,
                "end": False,
                "saved": False,
            }

            # save game instance in the database
            game_db = database_sync_to_async(self.create_game(self.player, other_player))
            
            # save game in games
            self.game_id = game_db.id
            self.games[self.game_id] = game_info

            # inform the players
            await self.channel_layer.group_send(
                self.ticket,
                {"type": "game.start", "objects": game_id}
            )

            # start the game
            asyncio.create_task(self.game_loop())

        # check if the ticket is expired
        if self.ticket in expired:
            expired.remove(self.ticket)
            await self.send(
                text_data=json.dumps({"message": "Apparently you've connected to late"})
            )
            # close the connection
            self.close(42)

        # wait the other player for 10 seconds
        start_time = time.time()
        while start_time - time.time() < 10:
            # check if the second player is connected
            async with self.other_lock:
                if self.other:
                    break
            asyncio.sleep(0.1)

        if not self.other:
            expired.append(self.ticket)
            # send back a message to the user
            await self.send(
                text_data=json.dumps({"message": "The other player doesn't show up"})
            )
            # close the connection
            self.close(42)


    async def disconnect(self, close_code):
        update_lock = self.games[self.game_id]["update_lock"]

        await self.channel_layer.group_discard(
            self.ticket, self.channel_name
        )

        if close_code == 42:
            return

        async with update_lock:
            ball = self.games[self.game_id]["ball"]
            score = ball.scores[0] if self.pos == "left" else ball.scores[1]
            if self.games[self.game_id]["end"]:
                # save stats in database
                result = Results.WIN if score == 11 else Results.LOSE
                database_sync_to_async(self.create_stats(score, Results.LOSE))
            elif close_code == 1001 and self.games[self.game_id]["connected"]:
                self.games[self.game_id]["connected"] = False
                # send a message to the other player and close his connection
                await self.channel_layer.group_send(
                    self.ticket,
                    {"type": "other.disconnect", "objects": "disconnection"}
                )
                # save stats in database and mark this user as loser
                database_sync_to_async(self.create_stats(score, Results.LOSE))
            elif not self.games[self.game_id]["connected"]:
                # save stats in database and mark this user as winner
                database_sync_to_async(self.create_stats(score, Results.WIN))

            # clean up consumer
            if self.games[self.game_id]["saved"]:
                del self.games[self.game_id]
            else:
                self.games[self.game_id]["saved"] = False



    async def other_disconnect(self, event):
        # send them info
        await self.send(
            text_data=json.dumps({"message": "The other player as been disconnected"})
        )

        self.close(1000)


    async def game_end(self, event):
        # send them info
        await self.send(
            text_data=json.dumps({"message": "Game is finished"})
        )

        self.close(1000)


    async def state_update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "stateUpdate",
                    "objects": event["objects"]
                }
            )
        )

    async def game_start(self, event):
        # inform players that they are connected
        async with self.other_lock:
            self.other = True
        # save game key
        self.game_id = event['objects']
        # send them info
        await self.send(
            text_data=json.dumps({"message": "game starts", "player_pos": self.pos})
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get("type", "")
        update_lock = self.games[self.game_id]["update_lock"]

        async with update_lock:
            paddle = self.games[self.game_id][self.pos]
            if message_type == "up":
                paddle.vel_y = - self.PLAYER_VELOCITY
            elif message_type == "down":
                paddle.vel_y = self.PLAYER_VELOCITY
            elif message_type == "stop":
                paddle.vel_y = 0
            elif message_type == "start" and self.pos != ball.last_score:
                ball = self.games[self.game_id]["ball"]
                direction = 1 if self.pos == "left" else -1
                ball.vel_x = direction * 360
                ball.vel_y = 360


    async def game_loop(self):
        ball = self.games[self.game_id]["ball"]
        paddle_left = self.games[self.game_id]["left"]
        paddle_right = self.games[self.game_id]["right"]
        update_lock = self.games[self.game_id]["update_lock"]

        # game loop
        while max(ball.scores) < 11 and self.games[self.game_id]["connected"]:
            async with update_lock:
                self.game.update()
                x = self.ball.pos_x - self.ball.collider.radius
                y = self.ball.pos_y - self.ball.collider.radius
                vel_x = self.ball.vel_x / 60
                vel_y = self.ball.vel_y / 60
                paddle_left_x = paddle_left.pos_x - paddle_left.collider.box_width
                paddle_left_y = paddle_left.pos_y - paddle_left.collider.box_height
                paddle_right_x = paddle_right.pos_x - paddle_right.collider.box_width
                paddle_right_y = paddle_right.pos_y - paddle_right.collider.box_height
                left_score = ball.scores[0]
                right_score = ball.scores[1]
            await self.channel_layer.group_send(
                self.ticket,
                {
                    "type": "state.update", "objects": {
                        "score":{
                            "left": left_score,
                            "right": right_score,
                        },
                        "ball": {
                            "x": x,
                            "y": y,
                            "vel_x": vel_x,
                            "vel_y": vel_y,
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
            await asyncio.sleep(0.03)

        # ending conditions
        if self.games[self.game_id]["connected"]:
            self.games[self.game_id]["end"] = True
            await self.channel_layer.group_send(
                self.ticket,
                {"type": "game.end", "objects": "end"}
            )


    def create_game(self, player, other_player):
        game_db = Game.objects.create()
        Participant.objects.create(player, game_db)
        Participant.objects.create(other_player, game_db)
        return game_db

    def create_stats(self, score, result):
        participant = Participant.objects.get(player=self.player, game_id=self.game_id)
        stats = Stats.objects.create(participant, score, result)
        return stats

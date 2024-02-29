import json
import asyncio
import uuid
import math
import logging
import time
import random

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from game.engine import Ball, Paddle, Field, newton_dynamics
from users.models import Participant, Game, Stats
from users.utils import Results

logger = logging.getLogger(__name__)


class PongConsumer(AsyncWebsocketConsumer):
    PLAYER_VELOCITY = 500
    GAME_TIME = 60
    START_TIME = 5
    WINNING = 6
    CLOSE_CODES = [1001, 3002]

    start_lock = asyncio.Lock()

    games = {}
    tickets = {}
    expired_tickets = []
    connected_users = []


    async def connect(self):
        logger.warning(f"LOG: someone connected")

        self.game_id = None
        self.other = False
        self.other_lock = asyncio.Lock()

        self.player = self.scope["user"]

        async with self.start_lock:
            if self.player.username in self.connected_users:
                await self.close(code=3021)
            self.connected_users.append(self.player.username)

        self.pos = "left"
        self.ticket = self.scope["token"]
        logger.warning(f"LOG: user {self.player}")
        logger.warning(f"LOG: ticket {self.ticket}")
        await self.accept()

        # add player to the group
        await self.channel_layer.group_add(
            self.ticket, self.channel_name
        )

        logger.warning(f"LOG: user added to channel_name")

        # check if someone has connected with the same ticket
        async with self.start_lock:
            other_player = self.tickets.setdefault(self.ticket, self.player)
        logger.warning(f"LOG: other_player {other_player.username}")


        # TODO: can use 'is' to check
        if other_player.username != self.player.username:

            logger.warning(f"LOG: second player")

            async with self.other_lock:
                self.other = True

            # remove ticket from tickets
            async with self.start_lock:
                del self.tickets[self.ticket]
            self.pos = "right"

            logger.warning(f"LOG: generate game instance")

            # generate the game
            ball = Ball(object_id="ball", radius=10, pos_x=400, pos_y=225, vel_x=0, vel_y=0, max_mod_vel=700)
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
                "setted": [0, 0],
            }

            logger.warning(f"LOG: save game instance")

            # save game instance in the database
            game_db = await self.create_game(self.player, other_player)

            logger.warning(f"LOG: game created in database")
            
            # save game in games
            self.game_id = game_db.id
            self.games[self.game_id] = game_info

            logger.warning(f"LOG: setting up players")
            # inform the players
            await self.send(
                text_data=json.dumps({"message": "I'm alive"})
            )
            await self.channel_layer.group_send(
                self.ticket,
                {"type": "game.start", "objects": self.game_id}
            )
            logger.warning(f"LOG: info sent")

            # start the game
            asyncio.create_task(self.game_loop())
            return

        logger.warning(f"LOG: first player")

        # check if the ticket is expired
        if self.ticket in self.expired_tickets:
            self.expired_tickets.remove(self.ticket)
            await self.send(
                text_data=json.dumps({"message": "Apparently you connected to late"})
            )
            # close the connection
            await self.close(code=3042)
            return

        asyncio.create_task(self.check_other())


    async def check_other(self):
        start_time = time.time()
        logger.warning(f"LOG: waiting for the other player")
        while time.time() - start_time < 10:
            # check if the second player is connected
            async with self.other_lock:
                if self.other:
                    logger.warning(f"LOG: other player found")
                    break
            await asyncio.sleep(0.1)

        logger.warning(f"LOG: the other {self.other}")

        if not self.other:
            self.expired_tickets.append(self.ticket)
            # send back a message to the user
            await self.send(
                text_data=json.dumps({"message": "The other player doesn't show up"})
            )
            # close the connection
            await self.close(code=3042)
            return
        logger.warning(f"LOG: the other player has connected")


    async def disconnect(self, close_code):
        logger.warning(f"LOG: user {self.player} disconnected with code {close_code}")
        logger.warning(f"LOG: STILL CONNECTED: {self.connected_users}")
        logger.warning(f"LOG: CLOSE CODE: {close_code}")


        if close_code == 3021:
            return

        async with self.start_lock:
            self.connected_users.remove(self.player.username)

        update_lock = self.games[self.game_id]["update_lock"]

        await self.channel_layer.group_discard(
            self.ticket, self.channel_name
        )

        if close_code == 3042:
            return

        async with update_lock:
            ball = self.games[self.game_id]["ball"]
            score = ball.scores[0] if self.pos == "left" else ball.scores[1]
            other_score = ball.scores[0] if self.pos != "left" else ball.scores[1]
            if self.games[self.game_id]["end"]:
                # save stats in database
                if score == other_score:
                    result = Results.DRAW
                else:
                    result = Results.WIN if score > other_score else Results.LOSE
                await self.create_stats(score, result)
            elif close_code in self.CLOSE_CODES and self.games[self.game_id]["connected"]:
                self.games[self.game_id]["connected"] = False
                # send a message to the other player and close his connection
                await self.channel_layer.group_send(
                    self.ticket,
                    {"type": "other.disconnect", "objects": "disconnection"}
                )
                # save stats in database and mark this user as loser
                await self.create_stats(score, Results.LOSE)
            elif not self.games[self.game_id]["connected"]:
                # save stats in database and mark this user as winner
                await self.create_stats(score, Results.WIN)

        # clean up consumer
        if self.games[self.game_id]["saved"]:
            del self.games[self.game_id]
        else:
            self.games[self.game_id]["saved"] = True



    async def other_disconnect(self, event):
        logger.warning(f"LOG: user {self.player} other disconnected")
        # send them info
        await self.send(
            text_data=json.dumps({"message": "The other player has been disconnected"})
        )

        await self.close(code=1000)


    async def game_end(self, event):
        # send them info
        logger.warning(f"LOG: user {self.player} game ended")
        await self.send(
            text_data=json.dumps({"message": "Game is finished"})
        )

        await self.close(code=1000)


    async def state_update(self, event):
        #logger.warning(f"LOG: user {self.player} update")
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
        logger.warning(f"LOG: {self.player} setting other true")
        async with self.other_lock:
            self.other = True
        logger.warning(f"LOG: player: {self.player.username}, the other {self.other}")
        # save game key
        self.game_id = event['objects']
        if self.pos == "left":
            self.games[self.game_id]["setted"][0] = 1
        else:
            self.games[self.game_id]["setted"][1] = 1
        self.first_start = False
        logger.warning(f"LOG: {self.player} ends setting up")


    async def send_info(self, event):
        # send them info
        logger.warning(f"LOG: {self.player} sending info")
        await self.send(
            text_data=json.dumps({"message": "game starts", "player_pos": self.pos})
        )


    async def receive(self, text_data):
        #logger.warning(f"LOG: user {self.player} received")
        if self.game_id is None:
            return
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get("type", "")
        update_lock = self.games[self.game_id]["update_lock"]

        async with update_lock:
            paddle = self.games[self.game_id][self.pos]
            ball = self.games[self.game_id]["ball"]
            if message_type == "up":
                paddle.vel_y = - self.PLAYER_VELOCITY
            elif message_type == "down":
                paddle.vel_y = self.PLAYER_VELOCITY
            elif message_type == "stop":
                paddle.vel_y = 0
            elif message_type == "start" and self.pos != ball.last_score and ball.vel_x == 0 and ball.vel_y == 0:
                self.first_start = True
                direction = 1 if self.pos == "left" else -1
                ball.vel_x = direction * 360
                ball.acc_x = direction * 100


    async def game_loop(self):
        ball = self.games[self.game_id]["ball"]
        paddle_left = self.games[self.game_id]["left"]
        paddle_right = self.games[self.game_id]["right"]
        update_lock = self.games[self.game_id]["update_lock"]

        while 0 in self.games[self.game_id]["setted"]:
            await asyncio.sleep(0.1)

        # sending info to players
        await self.channel_layer.group_send(
            self.ticket,
            {"type": "send.info", "objects": self.game_id}
        )

        # game loop
        self.first_start = False
        rest_time = self.START_TIME
        start_time = time.time()
        current_time = time.time() - start_time
        while max(ball.scores) < self.WINNING and self.games[self.game_id]["connected"] and current_time < self.GAME_TIME:
            async with update_lock:
                if self.first_start and ball.vel_x == 0 and ball.vel_y == 0:
                    self.first_start = False
                    rest_time = current_time + 5
                if not self.first_start and current_time > rest_time and self.pos == "right" and ball.vel_x == 0 and ball.vel_y == 0:
                    self.first_start = True
                    ball.vel_x = -360
                    ball.acc_x = -100

                self.game.update()
                current_time = time.time() - start_time
                data = self.raw_to_json(ball, paddle_left, paddle_right, current_time)
            await self.channel_layer.group_send(
                self.ticket,
                {
                    "type": "state.update", "objects": data 
                }
            )
            await asyncio.sleep(0.03)
            current_time = time.time() - start_time

        # ending conditions
        if self.games[self.game_id]["connected"]:
            self.games[self.game_id]["end"] = True
            await self.channel_layer.group_send(
                self.ticket,
                {"type": "game.end", "objects": "end"}
            )


    @database_sync_to_async
    def create_game(self, player, other_player):
        game_db = Game.objects.create()
        Participant.objects.create(player, game_db)
        Participant.objects.create(other_player, game_db)
        return game_db

    @database_sync_to_async
    def create_stats(self, score, result):
        participant = Participant.objects.get(player=self.player, game_id=self.game_id)
        stats = Stats.objects.create(participant, score, result)
        return stats

    def raw_to_json(self, ball: Ball, paddle_left: Paddle, paddle_right: Paddle, time: float) -> dict:
        x = ball.pos_x - ball.collider.radius
        y = ball.pos_y - ball.collider.radius
        vel_x = ball.vel_x / 60
        vel_y = ball.vel_y / 60
        acc_x = ball.acc_x / 60
        acc_y = ball.acc_y / 60
        paddle_left_x = paddle_left.pos_x - paddle_left.collider.box_width
        paddle_left_y = paddle_left.pos_y - paddle_left.collider.box_height
        paddle_right_x = paddle_right.pos_x - paddle_right.collider.box_width
        paddle_right_y = paddle_right.pos_y - paddle_right.collider.box_height
        left_score = ball.scores[0]
        right_score = ball.scores[1]
        data = {
            "time": round(self.GAME_TIME - time),
            "score":{
                "left": left_score,
                "right": right_score,
            },
            "ball": {
                "x": x,
                "y": y,
                "vel_x": vel_x,
                "vel_y": vel_y,
                "acc_x": acc_x,
                "acc_y": acc_y,
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
        return data

from itertools import combinations
import time


def newton_dynamics(obj, delta_time):
    delta_time_sec = delta_time / 1000 # convert to seconds
    obj.pos_x = obj.pos_x + obj.vel_x * delta_time_sec + 0.5 * obj.acc_x * (delta_time_sec ** 2)
    obj.pos_y = obj.pos_y + obj.vel_y * delta_time_sec + 0.5 * obj.acc_y * (delta_time_sec ** 2)


class Collider:
    def __init__(self, box_width, box_height):
        self.box_width = box_width
        self.box_height = box_height


class CircleCollider(Collider):
    def __init__(self, radius=1):
        self.radius = radius
        super().__init__(box_width=radius, box_height=radius)


class PillCollider(Collider):
    def __init__(self, width=1, height=2):
        self.width = width
        self.height = height
        radius = width / 2
        self.radius = radius
        box_width = width / 2
        box_height = height / 2 + radius
        super().__init__(box_width=box_width, box_height=box_height)


class MyObject:
    def __init__(self, object_id, collider=CircleCollider(), pos_x=0, pos_y=0, vel_x=0, vel_y=0, acc_x=0, acc_y=0):
        self.object_id = object_id
        self.collider = collider
        self.pos_x = pos_x
        self.pos_y = pos_y
        self.vel_x = vel_x
        self.vel_y = vel_y
        self.acc_x = acc_x
        self.acc_y = acc_y
        self.colliding = False

    def on_hit(self, hitted):
        pass

    def hit_left_wall(self, wall_pos):
        pass

    def hit_right_wall(self, wall_pos):
        pass

    def hit_bottom_wall(self, wall_pos):
        pass

    def hit_top_wall(self, wall_pos):
        pass


class Field:
    UPDATE_RATE = 1
    DELTA_LOW_LIMIT = 1_000 / 10 
    DELTA_HIGH_LIMIT = 1_000 / 60
    def __init__(self, objs: list, dinamics, width: int, height: int):
        self.objs = objs
        self.dinamics = dinamics
        self.width = width
        self.height = height
        self.current_time = time.time_ns() // 1_000_000 # convert to milliseconds
        self.last_time = time.time_ns() // 1_000_000 # convert to milliseconds
        self.delta_time = -1
        self.colliding = []

    def add_objects(self, objs: list):
        self.objs.extend(objs)

    def remove_objects(self, objs: list):
        for obj in objs:
            self.objs.remove(obj)

    def update(self):
        self.current_time = time.time_ns() // 1_000_000 # convert to millisencods
        self.delta_time = self.current_time - self.last_time
        if self.delta_time < self.DELTA_LOW_LIMIT:
            self.delta_time = self.DELTA_LOW_LIMIT
        elif self.delta_time > self.DELTA_HIGH_LIMIT:
            self.delta_time = self.DELTA_HIGH_LIMIT
        self.update_position()
        self.resolve_collisions()
        self.resolve_interactions()
        self.last_time = time.time_ns() // 1_000_000 # convert to milliseconds

    def update_position(self):
        for obj in self.objs:
            self.dinamics(obj, self.delta_time)
            self.constraints(obj)

    def constraints(self, obj):
        left_pos = obj.pos_x - obj.collider.box_width
        right_pos = obj.pos_x + obj.collider.box_width
        top_pos = obj.pos_y - obj.collider.box_height
        bottom_pos = obj.pos_y + obj.collider.box_height

        if left_pos < 0:
            obj.hit_left_wall(0)
        elif right_pos > self.width:
            obj.hit_right_wall(self.width)
        if top_pos < 0:
            obj.hit_top_wall(0)
        elif bottom_pos > self.height:
            obj.hit_bottom_wall(self.height)

    def resolve_collisions(self):
        for pair in combinations(self.objs, 2):
            if self.collides(pair):
                if pair not in self.colliding:
                    self.colliding.append(pair)
                    pair[0].on_hit(pair[1])
                    pair[1].on_hit(pair[0])
                    pair[0].colliding = True
                    pair[1].colliding = True
            elif pair in self.colliding:
                self.colliding.remove(pair)
                pair[0].colliding = False
                pair[1].colliding = False

    def resolve_interactions(self):
        pass

    def collides(self, pair):
        object_1 = pair[0]
        object_2 = pair[1]
        if isinstance(object_1.collider, CircleCollider) and isinstance(object_2.collider, CircleCollider):
            dist = (object_1.pos_x - object_2.pos_x) ** 2 + (object_1.pos_y - object_2.pos_y) ** 2
            min_dist = object_1.collider.radius ** 2 + object_2.collider.radius ** 2
            if dist < min_dist:
                return True
            else:
                return False
        elif isinstance(object_1.collider, PillCollider) and isinstance(object_2.collider, PillCollider):
            dist_x = abs(object_1.pos_x - object_2.pos_x)
            min_dist_x = (object_1.collider.width + object_2.collider.width) / 2
            dist_y = abs(object_1.pos_y - object_2.pos_y)
            min_dist_y = (object_1.collider.height + object_2.collider.height) / 2
            min_dist_y_with_radius = min_dist_y + (object_1.collider.radius + object_2.collider.radius)
            if dist_x < min_dist_x and dist_y < min_dist_y:
                return True
            elif dist_x < min_dist_x and dist_y < min_dist_y_with_radius:
                high_emishepere_y_1 = object_1.pos_y + object_1.height / 2
                low_emishepere_y_1 = object_1.pos_y - object_1.height / 2
                high_emishepere_y_2 = object_2.pos_y + object_2.height / 2
                low_emishepere_y_2 = object_2.pos_y - object_2.height / 2
                dist_emispheres_1_2 = (object_1.pos_x - object_2.pos_x) ** 2 + (high_emisphere_y_1 - low_emisphere_y_2) ** 2
                dist_emispheres_2_1 = (object_1.pos_x - object_2.pos_x) ** 2 + (low_emisphere_y_1 - high_emisphere_y_2) ** 2
                dist_emispheres = min(dist_emispheres_1_2, dist_emispheres_2_1)
                min_dist_emispheres = object_1.collider.radius ** 2 + object_2.collider.radius ** 2
                if dist_emispheres < min_dist_emispheres:
                    return True
            else:
                return False
        elif isinstance(object_1.collider, CircleCollider) and isinstance(object_2.collider, PillCollider):
            dist_x = abs(object_1.pos_x - object_2.pos_x)
            min_dist_x = object_1.collider.radius + object_2.collider.width / 2
            if dist_x >= min_dist_x:
                return False
            dist_y = abs(object_1.pos_y - object_2.pos_y)
            min_dist_y = object_1.collider.radius + object_2.collider.height / 2
            min_dist_y_with_radius = min_dist_y + object_2.collider.radius
            if dist_y < min_dist_y:
                return True
            elif dist_y < min_dist_y_with_radius:
                high_emishepere_y_2 = object_2.pos_y + object_2.height / 2
                low_emishepere_y_2 = object_2.pos_y - object_2.height / 2
                dist_emispheres_low = (object_1.pos_x - object_2.pos_x) ** 2 + (object_1.pos_y - low_emisphere_y_2) ** 2
                dist_emispheres_high = (object_1.pos_x - object_2.pos_x) ** 2 + (object_1.pos_y - high_emisphere_y_2) ** 2
                dist_emispheres = min(dist_emispheres_low, dist_emispheres_high)
                if dist_emispheres < min_dist_emispheres:
                    return True
            else:
                return False
        else:
            dist_x = abs(object_1.pos_x - object_2.pos_x)
            min_dist_x = object_2.collider.radius + object_1.collider.width / 2
            if dist_x >= min_dist_x:
                return False
            dist_y = abs(object_1.pos_y - object_2.pos_y)
            min_dist_y = object_2.collider.radius + object_1.collider.height / 2
            min_dist_y_with_radius = min_dist_y + object_1.collider.radius
            if dist_y < min_dist_y:
                return True
            elif dist_y < min_dist_y_with_radius:
                high_emishepere_y_1 = object_1.pos_y + object_1.height / 2
                low_emishepere_y_1 = object_1.pos_y - object_1.height / 2
                dist_emispheres_low = (object_1.pos_x - object_2.pos_x) ** 2 + (object_2.pos_y - low_emisphere_y_1) ** 2
                dist_emispheres_high = (object_1.pos_x - object_2.pos_x) ** 2 + (object_2.pos_y - high_emisphere_y_1) ** 2
                dist_emispheres = min(dist_emispheres_low, dist_emispheres_high)
                if dist_emispheres < min_dist_emispheres:
                    return True
            else:
                return False


class Paddle(MyObject):
    def __init__(self, object_id, height=2, width=4, pos_x=0, pos_y=0, vel_x=0, vel_y=0, acc_x=0, acc_y=0):
        pill_collider = PillCollider(height=height, width=width)
        super().__init__(object_id=object_id, collider=pill_collider, pos_x=pos_x, pos_y=pos_y, vel_x=vel_x, vel_y=vel_y, acc_x=acc_x, acc_y=acc_y)

    def on_hit(self, hitted):
        pass

    def hit_bottom_wall(self, wall_pos):
        self.pos_y = wall_pos - self.collider.radius
        self.vel_y = 0

    def hit_top_wall(self, wall_pos):
        self.pos_y = wall_pos + self.collider.radius
        self.vel_y = 0


class Ball(MyObject):
    def __init__(self, object_id, radius=1, pos_x=0, pos_y=0, vel_x=0, vel_y=0, acc_x=0, acc_y=0):
        circle_collider = CircleCollider(radius=radius)
        super().__init__(object_id=object_id, collider=circle_collider, pos_x=pos_x, pos_y=pos_y, vel_x=vel_x, vel_y=vel_y, acc_x=acc_x, acc_y=acc_y)

    def on_hit(self, hitted):
        if isinstance(hitted, Paddle):
            self.vel_x = - self.vel_x

    def hit_left_wall(self, wall_pos):
        self.pos_x = wall_pos + self.collider.radius
        self.vel_x = - self.vel_x

    def hit_right_wall(self, wall_pos):
        self.pos_x = wall_pos - self.collider.radius
        self.vel_x = - self.vel_x

    def hit_bottom_wall(self, wall_pos):
        self.pos_y = wall_pos - self.collider.radius
        self.vel_y = - self.vel_y

    def hit_top_wall(self, wall_pos):
        self.pos_y = wall_pos + self.collider.radius
        self.vel_y = - self.vel_y


def main_game():
    ball = Ball(object_id="ball", radius=10, pos_x=50, pos_y=50, vel_y=100)
    paddle = Paddle(object_id="paddle", width=10, height=50, pos_y=50, pos_x=405)
    game = Field(objs=[ball], dinamics=newton_dynamics, width=500, height=500)
    while True:
        game.update()
        print(f"pos_x: {ball.pos_x}, pos_y: {ball.pos_y}")
        time.sleep(0.05)

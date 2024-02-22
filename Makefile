NAME = Transcendence

ENV_FILE = ./srcs/.env
COMPOSE = ./srcs/docker-compose.yml
DJANGO_IMG = ./srcs/django
POSTGRES_IMG = ./srcs/postgres

$(NAME): init build
	@#gnome-terminal -- docker compose -f $(COMPOSE) --env-file $(ENV_FILE) up
	@docker compose -f $(COMPOSE) --env-file $(ENV_FILE) up

build:
	@docker build \
	--build-arg USERNAME=$(shell id -nu) \
	--build-arg GROUPNAME=$(shell id -ng) \
	--build-arg UID=$(shell id -u) \
	--build-arg GID=$(shell id -g) \
	-t trinity/django:latest $(DJANGO_IMG)
	@docker build \
	--build-arg USERNAME=$(shell id -nu) \
	--build-arg GROUPNAME=$(shell id -ng) \
	--build-arg UID=$(shell id -u) \
	--build-arg GID=$(shell id -g) \
	-t trinity/postgres:latest $(POSTGRES_IMG)

init:
	@./srcs/tools/init.sh

all: $(NAME)

migrations:
	@./srcs/tools/clean_migrations.sh

down:
	@if [ -f $(COMPOSE) ]; then \
	docker compose -f $(COMPOSE) down; \
	fi

clean: down
	@docker rmi -f \
		trinity/transcendence \
		trinity/pong \
		trinity/chat \
		trinity/auth \
		trinity/cron \
		trinity/ntf_listener \
		trinity/email_listener \
		trinity/rabbit_mq \
		trinity/postgres \
		trinity/django \
		trinity/redis \
		trinity/ntf 2> /dev/null

fclean: clean
	@docker volume rm -f django postgres pong pongdb auth authdb chat chatdb ntf ntfdb 2> /dev/null
	@rm -rf ./data/postgres ./data/pongdb ./data/authdb ./data/chatdb ./data/ntfdb
	@rm -rf ./data/django/images

clean_env:
	@rm -f ./srcs/.env ./srcs/*/.env ./srcs/postgres/.env*

re: init fclean all

.PHONY: all init down clean fclean clean_env re $(NAME)

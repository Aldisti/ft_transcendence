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
	--build-arg USERNAME=$(USERNAME) \
	--build-arg UID=$(shell id -u) \
	--build-arg GID=$(shell id -g) \
	-t trinity/django:latest $(DJANGO_IMG)
	@docker build \
	--build-arg USERNAME=$(USERNAME) \
	--build-arg UID=$(shell id -u) \
	--build-arg GID=$(shell id -g) \
	-t trinity/postgres:latest $(POSTGRES_IMG)

init:
	@./srcs/tools/init.sh

all: $(NAME)

migrations:
	@sudo ./srcs/tools/clean_migrations.sh

clean:
	@if [ -f $(COMPOSE) ]; then \
	docker compose -f $(COMPOSE) down; \
	fi
	@docker rmi -f \
		trinity/transcendence \
		trinity/pong \
		trinity/chat \
		trinity/auth \
		trinity/cron \
		trinity/ntf_listener \
		trinity/email_listener \
		trinity/rabbit_mq \
		trinity/ntf \
		trinity/postgres \
		trinity/django \
		2> /dev/null

fclean: clean
	@docker volume rm -f django postgres pong pongdb auth authdb chat chatdb ntf ntfdb 2> /dev/null
	@rm -rf ./data/postgres ./data/pongdb ./data/authdb ./data/chatdb ./data/ntfdb 2> /dev/null

clean_env:
	@rm -f ./srcs/.env ./srcs/*/.env ./srcs/postgres/.env*

re: fclean all

.PHONY: all init clean fclean clean_env re $(NAME)

NAME = Transcendence

ENV_FILE = ./srcs/.env
COMPOSE = ./srcs/docker-compose.yml

$(NAME): init
	@docker compose -f $(COMPOSE) --env-file $(ENV_FILE) up

init:
	@./srcs/tools/init.sh

all: $(NAME)

migrations:
	@sudo ./srcs/tools/clean_migrations.sh
	@sudo ./srcs/tools/clean_migrations_pong.sh

clean:
	@if [ -f $(COMPOSE) ]; then \
	docker compose -f $(COMPOSE) down; \
	fi
	@docker rmi -f trinity/django trinity/postgres trinity/pong trinity/pongdb trinity/cron 2> /dev/null

fclean: clean
	@docker volume rm -f django postgres pong pongdb 2> /dev/null
	@sudo rm -rf ./data/postgres ./data/pongdb 2> /dev/null

re: fclean all

.PHONY: all init clean fclean re $(NAME)

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
	@sudo ./srcs/tools/clean_migrations_chat.sh

clean:
	@if [ -f $(COMPOSE) ]; then \
	docker compose -f $(COMPOSE) down; \
	fi
	@docker rmi -f trinity/django trinity/postgres trinity/pong trinity/pongdb \
		trinity/chat trinity/chatdb trinity/cron \
		trinity/ntf_listener trinity/rabbit_mq \
		trinity/ntf trinity/ntfdb 2> /dev/null

fclean: clean
	@docker volume rm -f django postgres pong pongdb chat chatdb ntf ntfdb 2> /dev/null
	@sudo rm -rf ./data/postgres ./data/pongdb ./data/chatdb ./data/ntfdb 2> /dev/null

re: fclean all

.PHONY: all init clean fclean re $(NAME)

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

clean:
	@if [ -f $(COMPOSE) ]; then \
	docker compose -f $(COMPOSE) down; \
	fi
	@docker rmi -f trinity/django \
		trinity/pong \
		trinity/chat \
		trinity/auth \
		trinity/cron \
		trinity/ntf_listener \
		trinity/email_listener \
		trinity/rabbit_mq \
		trinity/ntf  2> /dev/null

fclean: clean
	@docker volume rm -f django postgres pong pongdb auth authdb chat chatdb ntf ntfdb 2> /dev/null
	@sudo rm -rf ./data/postgres ./data/pongdb ./data/authdb ./data/chatdb ./data/ntfdb 2> /dev/null

re: fclean all

.PHONY: all init clean fclean re $(NAME)

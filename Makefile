
NAME = Transcendence

ENV_FILE = ./srcs/.env
COMPOSE = ./srcs/docker-compose.yml

$(NAME): init
	@docker compose -f $(COMPOSE) --env-file $(ENV_FILE) up

all: $(NAME)

init:
	@./srcs/tools/init.sh

clean:
	@docker compose -f $(COMPOSE) down
	@docker rmi -f trinity/django trinity/postgres 2>/dev/null

fclean: clean
	@docker volume rm -f django postgres 2>/dev/null
	@sudo rm -rf ./data/postgres 2>/dev/null
	@rm -f $(COMPOSE)

re: fclean all

.PHONY: all init clean fclean re $(NAME)


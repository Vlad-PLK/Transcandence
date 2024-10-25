NAME = TRANSCENDANCE

VOLUME_PATH = /Users/macbook/volumes

all: ${NAME}

#uncomment your own path and comment others in Makefile and docker-compose.yml
${NAME}:
	@printf "Creating directories for Frontend Volume ! !\n"
	mkdir -p ${VOLUME_PATH}
	chmod -f 777 ${VOLUME_PATH}
	@printf "\n"
	@printf "Building up containers !\n"
	docker-compose --env-file ./.env up --build 

start:
	docker-compose start

clean:
	docker-compose stop

fclean: clean
	docker-compose down
	docker system prune -a -f
	docker volume rm transcandence_backend
	docker volume rm transcandence_backend
	docker volume rm transcandence_postgres_data
	rm -rf ${VOLUME_PATH}

re:	fclean all

.PHOMY: all clean re
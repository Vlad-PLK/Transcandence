NAME = TRANSCENDANCE

VOLUME_PATH = /home/vpolojie/volumes

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
	@if docker volume inspect transcandence_backend > /dev/null 2>&1; then \
        docker volume rm transcandence_backend; \
    else \
        echo "Volume transcandence_backend does not exist"; \
    fi
	@if docker volume inspect transcandence_postgres_data > /dev/null 2>&1; then \
        docker volume rm transcandence_postgres_data; \
    else \
        echo "Volume transcandence_postgres_data does not exist"; \
    fi
	rm -rf ${VOLUME_PATH}

re:	fclean all

.PHOMY: all clean re
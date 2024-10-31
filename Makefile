NAME = TRANSCENDANCE

VOLUME_PATH = /home/vpolojie/goinfre/volumes

all: ${NAME}

#uncomment your own path and comment others in Makefile and docker-compose.yml
${NAME}:
	@printf "Creating directories for Frontend Volume ! !\n"
	mkdir -p ${VOLUME_PATH}/frontend
	mkdir -p ${VOLUME_PATH}/backend
	mkdir -p ${VOLUME_PATH}/postgres
	chmod -f 777 ${VOLUME_PATH}/frontend
	chmod -f 777 ${VOLUME_PATH}/backend
	chmod -f 777 ${VOLUME_PATH}/postgres
	@printf "\n"
	@printf "Building up containers !\n"
	docker-compose --env-file ./.env up --build 

start:
	docker-compose start

clean:
	docker-compose stop

fclean: clean
	docker-compose down
# docker rm -f $$(docker ps -aq)
# docker volume rm $$(docker volume ls -q)
	docker system prune -a -f
	rm -rf ${VOLUME_PATH}

re:	fclean all

.PHOMY: all clean re
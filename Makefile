NAME = TRANSCENDANCE

all: ${NAME}

${NAME}:
	@printf "Creating directories for Frontend Volume ! !\n"
	mkdir -p /home/vpolojie/volumes/
	chmod -f 777 /home/vpolojie/volumes/
	@printf "\n"
	@printf "Building up containers !\n"
	docker-compose up --build

start:
	docker-compose start

clean:
	docker-compose stop

fclean: clean
	docker-compose down
	docker system prune -a -f
	sudo rm -rf /home/vpolojie/volumes/

re:	fclean all

.PHOMY: all clean re
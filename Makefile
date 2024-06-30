NAME = TRANSCENDANCE

all: ${NAME}

${NAME}:
	@printf "Creating directories for Frontend Volume ! !\n"
	mkdir -p /Users/macbook/volumes/
	chmod -f 777 /Users/macbook/volumes/
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
	sudo rm -rf /Users/macbook/volumes/

re:	fclean all

.PHOMY: all clean re
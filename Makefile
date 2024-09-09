NAME = TRANSCENDANCE

all: ${NAME}

#uncomment your own path and comment others in Makefile and docker-compose.yml
${NAME}:
	@printf "Creating directories for Frontend Volume ! !\n"
#mkdir -p /Users/macbook/volumes/
#mkdir -p /home/vpolojie/volumes/
	mkdir -p /home/tvincile/volumes_Main
#mkdir -p /home/l1mpoln/app/volumes
#chmod -f 777 /Users/macbook/volumes/
#chmod -f 777 /home/vpolojie/volumes/
	chmod -f 777 /home/tvincile/volumes_Main
#chmod -p /home/l1mpoln/app/volumes
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
#rm -rf /home/vpolojie/volumes
	rm -rf /home/tvincile/volumes_Main
#sudo rm -rf /Users/macbook/volumes/
#sudo rm -rf /home/l1mpoln/app/volumes/

re:	fclean all

.PHOMY: all clean re
FROM debian:bullseye

RUN apt update -y && apt upgrade -y
RUN apt install nginx -y
RUN apt install openssl -y


RUN mkdir -p /etc/nginx/ssl

RUN openssl req -x509 -nodes -out /etc/nginx/ssl/transcendence.crt -keyout /etc/nginx/ssl/transcendence.key -subj "/C=FR/ST=PACA/L=NICE/O=42/OU=42/CN=vpolojie.42.fr/UID=vpolojie"

RUN mkdir -p /var/run/nginx

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
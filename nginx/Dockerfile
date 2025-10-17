FROM public.ecr.aws/debian/debian:bullseye

RUN apt update -y && apt upgrade -y
RUN apt install nginx -y
RUN apt install openssl -y

RUN mkdir -p /etc/nginx/ssl

# SSL certificates will be provided at runtime via Docker volumes
# mounted from the host (Let's Encrypt). We no longer generate a
# self-signed certificate at build time to avoid confusion.

RUN mkdir -p /var/run/nginx

# COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./nginx.conf /etc/nginx/sites-available/transcendence
RUN ln -s /etc/nginx/sites-available/transcendence  /etc/nginx/sites-enabled/transcendence
RUN rm /etc/nginx/sites-enabled/default

EXPOSE 443
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
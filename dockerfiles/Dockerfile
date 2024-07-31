FROM Debian::bullseye

RUN apt update -y && apt upgrade -y
RUN apt install -y python3 python3-dev python3-distutils wget

WORKDIR /tmp

RUN wget https://bootstrap.pypa.io/pip/3.7/get-pip.py -O get-pip.py
RUN python3 get-pip.py

RUN wget https://nodejs.org/dist/v20.13.1/node-v20.13.1-linux-x64.tar.xz
RUN tar -xf node-v20.13.1-linux-x64.tar.xz
RUN mv ./node-v20.13.1-linux-x64/lib/node_modules /lib
RUN mv ./node-v20.13.1-linux-x64/bin/* /bin

RUN python3 -m pip install Django
RUN python3 -m pip install django-cors-headers
RUN python3 -m pip install pillow
RUN python3 -m pip install requests
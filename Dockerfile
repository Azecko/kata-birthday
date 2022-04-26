FROM node:18
RUN apt update && apt install -qy sendmail && apt autoremove


FROM node:latest
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY ./backend/nodejs/package.json .
RUN npm i
RUN mkdir nd
COPY ./backend/nodejs/dist ./nd
RUN mkdir -p storage/files
RUN mkdir web-app
COPY ./frontend/dist/frontend ./web-app

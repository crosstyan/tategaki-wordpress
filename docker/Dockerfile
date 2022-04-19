FROM node:17
RUN mkdir -p /root/app
## or use git clone?
## https://stackoverflow.com/questions/54174211/dockerfile-with-copy-command-and-relative-path
## docker build -t tategaki-wp -f ./docker/Dockerfile .
## ~/tategaki-wordpress $ docker run -it ./docker bash
COPY . /root/app
RUN cd /root/app &&\
    npm install &&\
    npm run build &&\
    node /root/app/build/index.js
EXPOSE 3000
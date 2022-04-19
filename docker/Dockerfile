FROM node:17
RUN mkdir -p /root/app
## or use git clone?
## https://stackoverflow.com/questions/54174211/dockerfile-with-copy-command-and-relative-path
## use context or run it from project root
## docker build -t tategaki-wp -f ./docker/Dockerfile .
COPY . /root/app
## maybe I should lockfile and use yarn
RUN cd /root/app &&\
    npm install &&\
    npm run build
EXPOSE 3000
CMD ["node", "/root/app/build/index.js"]
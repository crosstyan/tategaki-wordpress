FROM node:17
RUN mkdir -p /root/app
## or use git clone?
COPY ../* /root/app
RUN cd /root/app &&\
    npm install &&\
    npm run build &&\
    node ./build/index.js
EXPOSE 3000
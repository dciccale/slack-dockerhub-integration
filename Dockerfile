FROM node:latest

WORKDIR /home/slack-dockerhub-integration
ADD . /home/slack-dockerhub-integration

RUN npm install

EXPOSE 8080

CMD npm run prod

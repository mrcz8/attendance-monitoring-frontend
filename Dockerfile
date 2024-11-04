FROM node:18.12-buster

WORKDIR /home/node
COPY . /home/node/

RUN npm i -g npm@8

USER node

CMD bash -c "npm install && npm run dev"

EXPOSE 3000
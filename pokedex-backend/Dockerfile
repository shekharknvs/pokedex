FROM node:10

WORKDIR /usr/app

COPY package.json .

RUN npm install --slient

COPY . .

CMD [ "npm", "start" ]
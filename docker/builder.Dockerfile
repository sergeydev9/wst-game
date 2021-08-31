FROM node:14
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN yarn build api --prod
RUN yarn build socket-server --prod

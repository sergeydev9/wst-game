FROM node:14 as build
WORKDIR /app
ENV NODE_ENV=production
COPY ./dist/apps/api/* .
RUN yarn install
RUN yarn add tslib pg-format
CMD ["node", "main.js"]
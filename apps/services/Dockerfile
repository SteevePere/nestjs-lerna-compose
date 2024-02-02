FROM node:14-alpine as builder

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .
COPY lerna.json .

COPY libs/shared/package.json ./libs/shared/package.json
COPY apps/services/package.json ./apps/services/package.json

RUN yarn install --quiet --frozen-lockfile
RUN yarn lerna bootstrap

COPY . .

ENV NODE_ENV=development

RUN yarn build --scope=@perspective/shared

WORKDIR /usr/app/apps/services

EXPOSE 8080

CMD ["yarn", "start:dev"]

FROM node:18-alpine as build-client

WORKDIR /app
COPY . .

RUN yarn
RUN yarn build

FROM node:18-alpine

WORKDIR /app
COPY --from=build-client /app/.output .output

EXPOSE 3000

CMD  ["node", ".output/server/index.mjs"]

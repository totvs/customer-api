FROM node:8

ADD ./ /sources
WORKDIR /sources

RUN npm i

RUN gulp apidoc

FROM node:8-alpine

RUN apk add --update tzdata
ENV TZ America/Sao_Paulo

RUN mkdir -p /var/log/customer-api
RUN chown -R node:node /var/log/customer-api

COPY --from=0 /sources /sources

WORKDIR /sources

USER node

EXPOSE 8200

CMD ["node", "./index.js"]
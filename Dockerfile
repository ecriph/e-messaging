FROM node:16-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:$PATH"

RUN apk update && \
  apk add openjdk11

USER node

WORKDIR /home/node

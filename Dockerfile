FROM node:slim

EXPOSE 3000
WORKDIR /app

COPY . .

RUN apt-get update
RUN apt-get install -y openssl
RUN npm install
RUN npm run dbgen
RUN npm run build

ENTRYPOINT [ "npm", "run", "start:prod" ]
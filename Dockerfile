FROM node:slim

EXPOSE 3000
WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build

ENTRYPOINT [ "npm", "run", "start:prod" ]
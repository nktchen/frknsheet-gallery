FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .


EXPOSE 5000

CMD ["sh", "-c", "node ./db/initDb.js && node server.js"]


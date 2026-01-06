FROM node:18-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon && npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
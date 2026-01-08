FROM node:20-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200
CMD ["npm","start","--","--host","0.0.0.0","--port","4200","--poll=2000"]
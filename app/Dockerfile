FROM node:14

WORKDIR /usr/src/app

# Copiar solo los archivos de dependencias
COPY package*.json ./

RUN rm -rf node_modules package-lock.json

# Instalar Angular CLI 11 y TypeScript compatible
RUN npm install -g @angular/cli@11.2.19 \
    && npm install typescript@~4.0.5 \
    && npm install 
    #&& npm install @types/leaflet@1.5.23 --save-dev

# Copiar el resto del código fuente
COPY . .

EXPOSE 4200

#CMD ["npm", "start"]
CMD ["npm", "run", "start"]
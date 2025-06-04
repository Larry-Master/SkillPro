# Basis-Image mit Node.js
FROM node:18-alpine

# Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# NODE_ENV setzen, damit devDependencies installiert werden
ENV NODE_ENV=development

# package.json und package-lock.json kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Restlichen Code kopieren
COPY . .

# Ports freigeben
EXPOSE 3000

# Dev-Server starten
CMD ["npm", "run", "dev"]

# Development Dockerfile for Next.js
FROM node:20-alpine

WORKDIR /app

# Nur package.json kopieren, damit npm install gecached wird
COPY package.json package-lock.json* ./

RUN npm install

# Port öffnen
EXPOSE 3000

# Dev-Befehl für Hot Reload
CMD ["npm", "run", "dev"]

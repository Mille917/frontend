# ---- Étape 1 : builder ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ---- Étape 2 : runner ----
FROM node:20-alpine

WORKDIR /app

# Copie depuis le builder
COPY --from=builder /app /app

# Expose le port Adonis (3333 par défaut)
EXPOSE 8080

CMD ["npm", "run", "dev"]

# FROM node:20-alpine

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 8080

# CMD ["npm", "run", "dev"]
# Build stage
# --- Build stage ---
# ========== BASE IMAGE ==========
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the frontend
COPY . .

# Build your Nuxt SSR app
RUN npm run build

# ========== RUNNER IMAGE ==========
FROM node:20.17.0-alpine AS builder
WORKDIR /app

# Copy only the built output + package.json
COPY --from=base /app/.output ./.output
COPY package*.json ./

EXPOSE 3000

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]

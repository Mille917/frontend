# Stage 1: Build the AdonisJS app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app (creates /build folder)
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0

EXPOSE 3333

CMD ["node", "build/server.js"]

# ---- Étape 1 : builder ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Run the Adonis build command
RUN node ace build

# ---- Étape 2 : runner ----
FROM node:20-alpine

WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set the environment variables for production
ENV NODE_ENV=production

# Expose the Adonis port
EXPOSE 3333

# Start the application using the correct path to the compiled server.js
CMD ["node", "build/bin/server.js"]

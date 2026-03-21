# Stage 1: Build the AdonisJS app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Run the Adonis build command
RUN node ace build

# Run the Adonis build command
RUN node ace build


# Stage 2: Production runner
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

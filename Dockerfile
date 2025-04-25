# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (caching layer)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Install redis-cli for health check
RUN apk add --no-cache redis

# Copy and set up the wait script
COPY scripts/wait-for-redis.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-redis.sh

# Expose the port the app runs on
EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["/usr/local/bin/wait-for-redis.sh", "npm", "run", "start"] 
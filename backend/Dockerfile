# Backend Dockerfile - Node.js with Express
FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript config
COPY tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Install dev dependencies for build, then remove
RUN npm install typescript && \
    npm run build && \
    npm prune --production

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"]

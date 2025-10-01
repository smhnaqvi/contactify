# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Remove dev dependencies and source files
RUN npm ci --only=production && npm cache clean --force
RUN rm -rf src/ tsconfig.json

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S contactify -u 1001

# Change ownership of the app directory
RUN chown -R contactify:nodejs /app
USER contactify

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/contact/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]

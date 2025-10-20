# Production-ready Dockerfile for Transcendence Frontend
# Builds optimized React app with Vite and serves with built-in preview server
# nginx serving is handled by the transcendence-nginx container

# --- Builder Stage ---
FROM node:18-alpine AS builder

# Install security updates
RUN apk upgrade --no-cache && \
    apk add --no-cache dumb-init

WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./

# Install dependencies with clean install for reproducible builds
# Note: react-charts@beta is specified in package.json
RUN npm ci --no-progress --no-audit

# Copy source files
COPY . .

# Build the production bundle
ENV NODE_ENV=production
RUN npm run build && \
    # Verify build output exists
    ls -la dist/

# --- Production Stage ---
FROM node:18-alpine

# Install security updates and dumb-init for proper signal handling
RUN apk upgrade --no-cache && \
    apk add --no-cache \
    dumb-init \
    ca-certificates \
    tzdata

# Create non-root user for running the app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files for production dependencies only
COPY --chown=nodejs:nodejs package*.json ./

# Install serve for serving static files (lightweight and simple)
RUN npm install -g serve@14 && \
    npm cache clean --force

# Copy built assets from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Health check - will be accessed by nginx
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Labels for metadata
LABEL maintainer="Transcendence Team"
LABEL description="Production-ready React Frontend for Transcendence"
LABEL version="1.0"

# Switch to non-root user
USER nodejs

# Expose port 3000 (will be accessed by transcendence-nginx)
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Serve the built files with serve (SPA mode for routing)
CMD ["serve", "-s", "dist", "-l", "3000"]
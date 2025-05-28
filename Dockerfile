# Use a lighter base image for faster builds and smaller image size
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (for better layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Make wait-for-it.sh executable (if used for startup wait logic)
RUN chmod +x wait-for-it.sh

# Optionally run setup during build (if idempotent and required)
RUN npm run setup

# Final stage: lightweight production image
FROM node:22-alpine

WORKDIR /app

# Copy everything from builder
COPY --from=builder /app .

# Expose app port
EXPOSE 4001

# Define environment
ENV NODE_ENV=production

# Use wait-for-it if you're waiting on DB or other services
# CMD ["./wait-for-it.sh", "db:27017", "--", "npm", "start"]
CMD ["npm", "start"]

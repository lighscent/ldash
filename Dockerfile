# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Build Next.js app (skip during build if no docker socket)
ENV DOCKER_BUILDKIT=1
RUN npm run build

# Expose port 1212
EXPOSE 1212

# Run Next.js server
CMD ["npm", "start"]

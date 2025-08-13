# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install ALL dependencies (including dev dependencies for build)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port 1212
EXPOSE 1212

# Run Next.js server
CMD ["npm", "start"]

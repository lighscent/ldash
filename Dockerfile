# Use official Node.js image
FROM node:18-alpine

# Copy only package.json first
COPY package.json ./
COPY package-lock.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build Next.js app
RUN npm run build

# Remove dev dependencies after build to reduce image size
RUN npm prune --production

# Expose port 1212
EXPOSE 1212

# Run Next.js server
CMD ["npm", "start"]

# Use official Node.js image
FROM node:18-alpine

# Copy package.json
COPY package.json ./

# Copy package-lock.json only if it exists
# (comment out if you don't use it)
COPY package-lock.json ./ 

# Install dependencies
RUN ls -l
RUN npm install

# Copy the rest of the application code
COPY . .

# Build Next.js app
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port 1212
EXPOSE 1212

# Run Next.js server
CMD ["npm", "start"]

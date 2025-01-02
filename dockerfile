# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for caching dependencies
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose the application's port
EXPOSE 3002

# Command to start the app
CMD ["npm", "start"]

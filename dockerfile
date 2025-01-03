# Use Node.js base image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Copy the .env file into the container
COPY .env .env

# Expose port 3002
EXPOSE 3002

# Start the application
CMD ["npm", "start"]

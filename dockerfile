# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .
COPY .env .env

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]

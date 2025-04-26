# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory (using the root folder in the container)
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of your application code (including .env)
COPY . /app/

# Expose port 3000
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]

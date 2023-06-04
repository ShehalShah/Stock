# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /stock

# Copy package.json and package-lock.json (if exists) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the backend code
COPY . .

# Expose the backend port
EXPOSE 4000

# Set the command to start the backend server
CMD [ "npm", "run", "start" ]

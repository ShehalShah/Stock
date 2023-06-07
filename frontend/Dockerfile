# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /stock

# Copy package.json and package-lock.json (if exists) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend code
COPY . .

# Build the frontend
RUN npm run build

# Expose the frontend port
EXPOSE 5173

# Set the command to start the frontend server
CMD [ "npm", "run", "start" ]

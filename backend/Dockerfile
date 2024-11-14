# Use an official Node.js image as the base
FROM node:18

# Set a specific working directory for the backend
WORKDIR /app/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port the backend will run on
##EXPOSE 3000
EXPOSE 3002

# Set the default command to run the application
CMD ["npm", "start"]

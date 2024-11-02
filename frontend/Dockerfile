# Use an official Node.js image as the base
FROM node:18

# Set a specific working directory for the frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Vite frontend
RUN npm run build

# Expose the port the frontend will run on
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host"]

# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000
EXPOSE 3000

# Define an environment variable (you can replace 'your_value' with the desired value)
#ENV BEARER_TOKEN=BEARER_TOKEN

# Start the React application
CMD ["npm", "start"]

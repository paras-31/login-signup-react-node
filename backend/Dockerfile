# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5000

# Define environment variables (if any)
# ENV DB_HOST=db_host_value
# ENV DB_USER=db_user_value
# ENV DB_PASSWORD=db_password_value
# ENV DB_NAME=db_name_value

# Command to run the application
CMD ["node", "server.js"]

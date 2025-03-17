# Use an official lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and lock file first for efficient caching
COPY package.json package-lock.json ./


# Install dependencies
RUN npm install --omit=dev

# Copy the entire project
COPY . .

# Build the Next.js project
RUN npm run build
# Expose the Next.js default port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]

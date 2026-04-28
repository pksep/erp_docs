# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y build-essential python3 git && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN bun install

# Install missing Rollup native module
RUN bun add @rollup/rollup-linux-x64-gnu

# Copy project files
COPY . .

# Build the project
RUN bun run build

# Serve stage
FROM nginx:alpine

# Copy built static files to Nginx
COPY --from=builder /app/src/.vitepress/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

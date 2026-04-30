# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json bun.lockb* ./

# Устанавливаем основные зависимости
RUN bun install

RUN bun add @rollup/rollup-linux-x64-gnu

COPY . .

RUN bun run build

# Serve stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/src/.vitepress/dist /usr/share/nginx/html

# Прокидываем 80 порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
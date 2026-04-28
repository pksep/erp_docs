# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Устанавливаем системные зависимости для сборки нативных модулей
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Копируем файлы манифестов (включая lock-файл для стабильности)
COPY package*.json bun.lockb* ./

# Устанавливаем основные зависимости
RUN bun install

# Принудительно добавляем модуль Rollup для архитектуры Linux x64 
# (это решает ошибку, которую ты скидывал)
RUN bun add @rollup/rollup-linux-x64-gnu

# Копируем исходный код
COPY . .

# Собираем статику Vitepress
RUN bun run build

# Serve stage
FROM nginx:alpine

# Копируем билд из папки src/.vitepress/dist в стандартную директорию nginx
# Проверь, что в твоем проекте Vitepress настроен именно на этот путь
COPY --from=builder /app/src/.vitepress/dist /usr/share/nginx/html

# Прокидываем 80 порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
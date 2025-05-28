# Используем последнюю версию Node.js
FROM node:latest

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --verbose
COPY . .

CMD npm run build && npm run start

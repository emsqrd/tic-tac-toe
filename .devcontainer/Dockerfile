# Use the official Node.js LTS image
FROM node:18-bullseye

# Set environment variable to specify Puppeteer's cache directory
ENV PUPPETEER_CACHE_DIR=/workspace/node/.cache/puppeteer

# Install dependencies needed for Puppeteer to run Chrome/Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgbm1 \
    libasound2 \
    libxshmfence1 \
    fonts-liberation \
    libjpeg62-turbo \
    libxcursor1 \
    libx11-xcb1 \
    libxss1 \
    xdg-utils \
    libglu1-mesa \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
    
# Create the directory and set proper permissions
RUN mkdir -p /workspace/node/.cache/puppeteer && chown -R node:node /workspace/node/.cache

# Set the working directory
WORKDIR /workspace

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Expose default Angular port
EXPOSE 4200
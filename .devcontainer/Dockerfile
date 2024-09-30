# TODO: This isn't working on my local mac, but ChatGPT says it should.
# It comes down to something with Puppeteer still grabbing the wrong version of Chromium (x86 v ARM)
# The last thing it suggested was removing Puppeteer from the package.json

# Use a multi-platform Node.js image (both amd64 and arm64 supported)
FROM node:18-bullseye-slim

# Set environment variables to specify Puppeteer's cache directory and skip Chromium download
ENV PUPPETEER_CACHE_DIR=/workspace/node/.cache/puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROME_PATH=/usr/bin/chromium

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
    chromium \
    chromium-driver \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Create the Puppeteer cache directory and set proper permissions
RUN mkdir -p /workspace/node/.cache/puppeteer && chown -R node:node /workspace/node/.cache

# Set the working directory
WORKDIR /workspace

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Expose default Angular port
EXPOSE 4200

# Debug: Check that Chromium is available
RUN echo "Chromium path: $(which chromium)" && chromium --version
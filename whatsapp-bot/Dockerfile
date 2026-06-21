# Blood Chain Pakistan — WhatsApp bot (whatsapp-web.js) container.
# Bundles Chromium + the system libs Puppeteer needs, so the bot runs on any
# host that can run Docker (a VPS, Railway, Render, Fly.io, etc.) without a
# fragile manual Chromium install.

FROM node:20-slim

# Chromium and the shared libraries headless Chromium needs to start.
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      ca-certificates fonts-liberation \
      libnss3 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 libxkbcommon0 \
      libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
      libpangocairo-1.0-0 libpango-1.0-0 libcairo2 libatspi2.0-0 \
  && rm -rf /var/lib/apt/lists/*

# Use the system Chromium instead of letting Puppeteer download its own.
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# The WhatsApp login session lives here — mount a volume so you scan the QR once
# and survive restarts/redeploys without re-linking.
VOLUME ["/app/.wwebjs_auth"]

CMD ["node", "index.js"]

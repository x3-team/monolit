# StudioGate server (pilot)
FROM node:20-bookworm-slim

WORKDIR /app

# OpenSSL for Prisma engines
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY public ./public
COPY desktop ./desktop
COPY next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs ./

# Generate prisma client and build Next.js
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL="file:/data/studiogate.db"
ENV JWT_SECRET="change-me-in-production"
ENV SESSION_SECRET="change-me-session-secret-32b"
ENV APP_URL="http://localhost:3001"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3001"

RUN mkdir -p /data
VOLUME ["/data"]

EXPOSE 3001

CMD ["sh", "-c", "node scripts/check-env.mjs && npx prisma db push && npm run start"]

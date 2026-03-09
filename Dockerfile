# ──────────────────────────────────────────────────────────────────────────────
# Stage 1 – Install ALL dependencies (including devDeps for the build)
#           Build tools are required to compile better-sqlite3 native addon.
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS deps

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2 – Build the Next.js application
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Build Next.js (production bundle)
RUN npm run build

# Prune dev dependencies – keeps the image lean
RUN npm prune --omit=dev

# ──────────────────────────────────────────────────────────────────────────────
# Stage 3 – Lean production image
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the built application from the builder stage
COPY --from=builder /app/.next            ./.next
COPY --from=builder /app/public           ./public
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/package.json     ./
COPY --from=builder /app/next.config.ts   ./
COPY --from=builder /app/tsconfig.json    ./
COPY --from=builder /app/prisma           ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Persistent data directories (mounted as Docker volumes at runtime)
RUN mkdir -p /app/data /app/public/uploads

# Container startup script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]

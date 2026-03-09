#!/bin/sh
set -e

echo "──────────────────────────────────────────"
echo "  Norris Decking & Sheds – Server Startup"
echo "──────────────────────────────────────────"

echo "[1/2] Applying database migrations..."
npx prisma migrate deploy

echo "[2/2] Starting Next.js on port 3000..."
exec npx next start -p 3000

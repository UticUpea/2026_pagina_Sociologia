# ===========================
# 1) Base con Node y pnpm
# ===========================
FROM node:20-alpine AS base

ENV PNPM_HOME="/root/.local/share/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat git \
    && corepack enable

WORKDIR /app

# ===========================
# 2) Builder (instala y compila)
# ===========================
FROM base AS builder

# Copiamos solo los archivos de dependencias para aprovechar caché
COPY package.json pnpm-lock.yaml ./

# 🔑 Usa esta línea si quieres build tolerante (no falla con lockfile viejo)
RUN pnpm install --no-frozen-lockfile
# 🔒 Usa esta línea si prefieres build estricto (requiere lockfile actualizado)
# RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Build Next.js (recomendado usar standalone para producción ligera)
RUN pnpm run build

# ===========================
# 3) Runner (imagen final)
# ===========================
FROM node:20-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copiamos solo lo necesario desde builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]

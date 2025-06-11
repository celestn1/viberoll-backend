# ─── Stage 1: install & prune dev-deps ───────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# 2) Install all deps (dev+prod)
RUN npm ci

# 3) Remove dev-dependencies, leaving only prod
RUN npm prune --production

COPY . .

FROM node:22-alpine

WORKDIR /app

# 5) Copy in pruned node_modules + your source & scripts
COPY --from=builder /app ./

EXPOSE 4001
CMD ["npm","start"]
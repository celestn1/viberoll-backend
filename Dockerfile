# ─── Stage 1: install & prune dev-deps ───────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# 1) Grab only the dependency manifests
COPY package.json package-lock.json ./

# 2) Install all deps (dev+prod)
RUN npm ci

# 3) Remove dev-dependencies, leaving only prod
RUN npm prune --production

# 4) Copy your app code + make wait-for-it executable
COPY . .
RUN chmod +x wait-for-it.sh

# ─── Stage 2: runtime (prod only) ───────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# 5) Copy in pruned node_modules + your source & scripts
COPY --from=builder /app ./

# 6) Expose port & define your start command
EXPOSE 4001
CMD ["npm","start"]

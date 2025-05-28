# ─── Stage 1: build ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# set a directory inside the container
WORKDIR /app

# copy package files + lockfile
COPY package.json package-lock.json ./

# install dev + prod deps so you can build (and strip dev later)
RUN npm ci

# copy all sources & build
COPY . .
# if you have a build step, e.g. tsc or nest build:
# RUN npm run build

# ─── Stage 2: runtime ────────────────────────────────────────────────────────
# use distroless Node for minimal footprint (Debian + Node runtime only)
FROM gcr.io/distroless/nodejs:22

WORKDIR /app

# copy production deps from builder
# this grabs only the modules you actually need to run
COPY --from=builder /app/node_modules ./node_modules

# copy built code (if you compiled into /app/dist)
# otherwise copy your source if you run via "npm start"
# COPY --from=builder /app/dist ./dist

# copy any scripts you need (wait-for-it, entrypoint, etc.)
COPY --from=builder /app/wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# expose your port
EXPOSE 4001

# your start command:
# if you compiled into dist: CMD ["dist/main.js"]
# otherwise if you run JS directly via npm:
CMD ["npm","start"]

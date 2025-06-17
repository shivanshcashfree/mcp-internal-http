# 1) Builder stage: install deps & compile TS
FROM node:20-alpine AS builder

# where our code will live inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy everything and build
COPY . .
RUN npm run build

# 2) Runner stage: production image
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy package files and production build
COPY package.json package-lock.json* ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/docs ./src/docs

# Install only production deps
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Expose the MCP port
EXPOSE 4000

# Launch the server
CMD ["node", "dist/index.js"]
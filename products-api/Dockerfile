FROM node:18-alpine AS builder

WORKDIR /app

COPY products-api/package*.json ./
RUN npm ci

COPY products-api/tsconfig.json ./
COPY products-api/src/ ./src/
RUN npx tsc

FROM node:18-alpine

WORKDIR /app

COPY products-api/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3002

CMD ["node", "dist/index.js"]

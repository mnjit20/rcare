FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/typescript-config ./packages/typescript-config/
COPY packages/eslint-config ./packages/eslint-config/

RUN npm ci

COPY apps/backend ./apps/backend
COPY tsconfig.json ./

RUN npm -w apps/backend run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main"]

FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/typescript-config ./packages/typescript-config/
COPY packages/eslint-config ./packages/eslint-config/

RUN npm ci

COPY apps/frontend ./apps/frontend
COPY tsconfig.json ./

RUN npm -w apps/frontend run build

FROM nginx:alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

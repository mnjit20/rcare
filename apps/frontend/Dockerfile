# ---------- Builder ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./

COPY apps/frontend ./apps/frontend

RUN npm install

RUN npm run build --workspace=frontend


# ---------- Runtime ----------
FROM nginx:alpine

COPY --from=builder \
/app/apps/frontend/dist \
/usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
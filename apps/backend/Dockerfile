# ---------- BUILD ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy entire repo
COPY . .

# Install all dependencies
RUN npm install

# Build backend
RUN npm run build --workspace=backend


# ---------- RUNTIME ----------
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy backend package
COPY apps/backend/package*.json ./

# Install backend deps
RUN npm install --omit=dev

# Copy build output
COPY --from=builder \
/app/apps/backend/dist \
./dist

EXPOSE 3000

CMD ["node", "dist/main"]
# RedCare - GitHub Repo Ranker

A monorepo fullstack application built with modern tooling and best practices.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Backend** | NestJS (Express) + TypeScript |
| **Monorepo** | npm workspaces + Turborepo |
| **Deployment** | Docker + Docker Compose |

## Project Structure

```
rcare/
├── apps/
│   ├── backend/          # NestJS REST API server
│   └── frontend/         # React web application (Vite)
├── packages/
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript base configs
├── docker-compose.yml    # Multi-container setup
└── turbo.json           # Turborepo configuration
```

## Quick Start

### Prerequisites
- **Node.js**: 18+
- **npm**: 11.13.0+

### Development

Start all apps with hot-reload:
```bash
npm install
npm run dev
```

Access the apps:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### Production Build

```bash
npm run build
```

### With Docker

```bash
docker compose build --no-cache
docker compose up
```

Then access:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## Commands

### Root Level (All Apps)
```bash
npm run dev          # Start all apps in dev mode
npm run build        # Build all apps for production
npm run lint         # Lint all code
npm run format       # Format code with Prettier
npm run check-types  # Type check all apps
```

### Individual Apps

**Backend:**
```bash
npm -w apps/backend run dev         # Start in watch mode
npm -w apps/backend run test        # Run unit tests
npm -w apps/backend run test:watch  # Run tests in watch mode
npm -w apps/backend run test:cov    # Coverage report
```

**Frontend:**
```bash
npm -w apps/frontend run dev        # Start dev server
npm -w apps/frontend run build      # Build for production
npm -w apps/frontend run preview    # Preview production build
```

### Using Turbo (if installed globally)
```bash
turbo build --filter=backend        # Build specific app
turbo dev --filter=frontend         # Dev only frontend
turbo run lint --filter=packages/*  # Lint only packages
```

## Architecture Highlights

- **Monorepo**: Unified development experience with shared configurations
- **Type Safety**: Full TypeScript across frontend and backend
- **Modular**: Services contain business logic, controllers handle routes
- **Tested**: Jest for unit and e2e tests
- **Code Quality**: ESLint + Prettier for consistency
- **DevOps**: Docker containerized for easy deployment
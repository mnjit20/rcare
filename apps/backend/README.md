# RCare Backend

REST API service built with NestJS and TypeScript. Provides repository analysis and scoring functionality for the RCare platform.

## Project Overview

This backend service analyzes GitHub repositories and provides intelligent scoring based on multiple metrics (stars, forks, recency). The API uses NestJS with Express, TypeScript for type safety, and follows clean architecture principles with thin controllers and service-based business logic.

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development

Start the server in watch mode with hot reload:

```bash
npm run dev          # Start with file watching
npm run start:dev    # Alternative: start in watch mode
npm run start:debug  # Start with debugger enabled
```

The server will be available at `http://localhost:3000` (default port).

### Production

Build and run the production-optimized server:

```bash
npm run build        # Compile TypeScript to dist/
npm run start:prod   # Run the compiled application
```

## Architecture

### Directory Structure

```
src/
├── main.ts                    # Application entry point
├── app.controller.ts         # Root controller
├── app.service.ts            # Root service
├── scoring/                  # Repository scoring module
│   ├── scoring.service.ts    # Core scoring logic
│   └── scoring.service.spec.ts
└── common/                   # Shared utilities, pipes, filters
```

### Key Principles

- **Controllers**: Handle HTTP routes and request validation
- **Services**: Contain business logic and external service integration
- **DTOs**: Define request/response data structures with validation
- **Dependency Injection**: NestJS IoC container manages service instantiation
- **Modularity**: Features are organized in feature modules for scalability

## Scoring Logic

The `ScoringService` calculates a repository quality score based on GitHub metrics. This helps identify valuable and well-maintained repositories.

### Overview

The scoring system uses a weighted formula combining three normalized metrics:

```
Score = (0.5 × normalized_stars) + (0.3 × normalized_forks) + (0.2 × recency)
Final Score = round(Score × 100)
```

Result is a 0-100 score where higher values indicate better repositories.

### Input Parameters

The service accepts a `ScoringInput` object:

```typescript
interface ScoringInput {
  stars: number;        // GitHub star count
  forks: number;        // GitHub fork count
  lastUpdated: string;  // ISO 8601 date string of last commit/update
}
```

### Scoring Components

#### 1. Stars (50% weight)
- **Normalization**: `min(stars / 50000, 1.0)`
- Repositories with 50,000+ stars score the maximum (1.0)
- Captures community adoption and popularity
- Example: 25,000 stars = 0.5 normalized value

#### 2. Forks (30% weight)
- **Normalization**: `min(forks / 10000, 1.0)`
- Repositories with 10,000+ forks score the maximum (1.0)
- Indicates active community contributions
- Example: 5,000 forks = 0.5 normalized value

#### 3. Recency (20% weight)
- **Scoring brackets**:
  - Updated within 30 days: 1.0 (actively maintained)
  - Updated 31-90 days ago: 0.5 (moderately maintained)
  - Updated 90+ days ago: 0.2 (dormant/archived)
- Reflects ongoing maintenance and bug fixes

### Usage Example

```typescript
const input: ScoringInput = {
  stars: 75000,
  forks: 5000,
  lastUpdated: '2024-12-15T10:30:00Z'
};

const service = new ScoringService();
const score = service.computeScore(input); // Returns 0-100
```

**Calculation**:
- Normalized stars: min(75000 / 50000, 1.0) = 1.0
- Normalized forks: min(5000 / 10000, 1.0) = 0.5
- Recency: 1.0 (updated recently)
- Raw: (0.5 × 1.0) + (0.3 × 0.5) + (0.2 × 1.0) = 0.85
- Final: round(0.85 × 100) = **85**

### Design Decisions

- **Weighted formula**: Popularity (stars) is prioritized, followed by community engagement (forks), then maintenance status
- **Normalization caps**: Prevents any single extreme metric from dominating the score
- **Recency brackets**: Uses discrete levels rather than continuous decay for predictable scoring behavior
- **Integer output**: Scores are rounded to integers for clarity and simplicity

## Testing

Test files are co-located with source code (e.g., `scoring.service.spec.ts`). The project uses Jest with ts-jest for TypeScript support.

```bash
# Run tests once
npm run test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### Writing Tests

- Use Jest's `describe`, `it` blocks
- Mock external dependencies with `jest.mock()`
- Keep tests focused on single responsibility
- Example test structure:

```typescript
describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(() => {
    service = new ScoringService();
  });

  it('should compute correct score for active repository', () => {
    const result = service.computeScore({
      stars: 50000,
      forks: 10000,
      lastUpdated: new Date().toISOString()
    });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });
});
```

## Code Quality

All code quality tasks are run from the monorepo root:

```bash
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run check-types  # TypeScript type checking
```

### Configuration Files

- **ESLint**: `.eslintrc.mjs` - Linting rules and code style enforcement
- **TypeScript**: `tsconfig.json` - Compiler options and type checking settings
- **Prettier**: `.prettierrc` - Code formatting rules
- **NestJS**: `nest-cli.json` - NestJS CLI configuration

## Environment Variables

Create a `.env` file in the backend directory (see `.env.example` for reference):

```bash
cp .env.example .env
```

Common variables:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development, production)

## Docker

Build and run the application in Docker:

```bash
docker build -t rcare-backend .
docker run -p 3000:3000 rcare-backend
```

## API Documentation

Once the server is running, API documentation is available at:
- OpenAPI/Swagger: `http://localhost:3000/api` (if configured)

## Debugging

### VS Code

1. Set breakpoints in the code
2. Run in debug mode: `npm run start:debug`
3. Attach to the debugger in VS Code or use the built-in debugger

### Console Logging

Use NestJS Logger for structured logging:

```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Starting process...');
    this.logger.error('Error occurred', error);
  }
}
```

## Common Tasks

### Adding a New Feature

1. Create a new module/folder under `src/`
2. Implement service with business logic
3. Create controller with route handlers
4. Add DTOs for request/response validation
5. Write unit tests alongside source code
6. Register module in `app.module.ts`

### Modifying Scoring Logic

The scoring algorithm is in `src/scoring/scoring.service.ts`. When updating:
1. Update the `ScoringInput` interface if inputs change
2. Modify the weighting formula in `computeScore()` if needed
3. Update the `calculateRecency()` method for recency logic changes
4. Add tests to `scoring.service.spec.ts`
5. Update documentation in this README

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Documentation](https://jestjs.io/docs/getting-started)

# API Package - CLAUDE.md

This file provides guidance for working with the TaskGraph API package.

## Development Commands

- `npm run dev` - Start API development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production API server
- `npm run lint` - Run ESLint on all files
- `npm run format` - Format code with Prettier
- `npm run cli [command]` - Run tRPC CLI commands (e.g., `npm run cli organizations`)
- `./cli.ts [command]` - Direct execution of tRPC CLI

## Technology Stack

- **tRPC**: Type-safe API with automatic client generation
- **PostgreSQL**: Primary database with Drizzle ORM
- **Express**: HTTP server with WebSocket support for real-time updates
- **Railway**: Database hosting
- **Zod**: Runtime type validation

## Key Features

- Real-time task updates via WebSocket subscriptions
- Type-safe API operations with Zod validation
- CLI interface for database operations
- Development UI panel at `/panel` endpoint
- Auto-generated API documentation

## Database Schema

- `organizations`: Top-level containers for projects
- `tasks`: Individual tasks with position, status, and organization reference
- `dependencies`: Task dependency relationships
- `projects`: Project groupings within organizations

## API Routes

- `organizations` - List all organizations
- `createOrganization` - Create new organization with default task
- `deleteOrganization` - Remove organization by ID
- `createTask` - Add new task to organization
- `updateTask` - Modify existing task properties
- `graph` - Get complete task graph for organization
- `createTaskFrom` - Create task with dependencies from existing task
- `deleteTasks` - Remove multiple tasks by IDs
- `onTasksChange` - WebSocket subscription for real-time updates

## Environment Setup

Required environment variables in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (defaults to 3001)
- `NODE_ENV` - Environment mode (development/production)

## CLI Usage

The `cli.ts` file provides command-line access to all tRPC routes:

```bash
# List organizations
./cli.ts organizations

# Create organization
./cli.ts create-organization

# Get task graph for organization
./cli.ts graph --organizationId "uuid-here"
```

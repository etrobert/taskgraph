# Web Package - CLAUDE.md

This file provides guidance for working with the TaskGraph web frontend package.

## Important Rules

- NEVER use `event.stopPropagation()` - this breaks React Flow's event handling

## Development Commands

- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on all files
- `npm run format` - Format code with Prettier (includes Tailwind class sorting)

`npm run dev` proxies `/trpc` to the API on port 3001.

## Technology Stack

- **React Flow**: Visual graph editing interface
- **React Query**: Server state management with tRPC integration
- **Tailwind CSS v4**: Styling with custom task node theming
- **Vite**: Build tool and development server
- **TypeScript**: Full type safety with tRPC integration

## Architecture

### Core Data Flow

- **Real-time sync**: WebSocket connection for live task updates
- **Type safety**: Full end-to-end type safety via tRPC
- **Local state**: React Flow manages visual graph state

### Task Node Structure

Each task has a `TaskNodeData` interface containing:

- `label`: Task name (editable via double-click)
- `status`: 'pending' | 'in progress' | 'completed' (cycleable via icon click)
- `position`: X/Y coordinates for graph layout
- `organizationId`: Reference to parent organization

### React Flow Integration

**Edge Creation**: Two methods supported:

1. **Node-to-Node**: Drag between existing nodes to create dependencies
2. **Drop-on-Void**: Drag from node handle and drop on empty canvas to create
   new connected task

**Handle Logic**:

- Left handle = target (receives dependencies)
- Right handle = source (creates dependencies)
- Direction determines dependency relationship in new task creation

### State Management

- **tRPC + React Query**: Server state with automatic invalidation
- **React Flow**: `useNodesState` and `useEdgesState` for graph manipulation
- **Real-time updates**: WebSocket subscriptions for live collaboration

### Component Architecture

- **App.tsx**: Main container with ReactFlowProvider and tRPC setup
- **TaskGraphFlow**: Core flow logic and state management
- **TaskNode**: Custom node component with inline editing and status cycling
- **ControlPanel**: All UI controls (save, load, etc.)
- **AppSidebar**: Navigation and organization management

### Styling

Uses Tailwind CSS v4 with:

- Custom task node styling based on status
- Tailwind class sorting via prettier-plugin-tailwindcss
- Dark/light theme support
- Responsive design patterns

### ID Generation

New tasks use UUID v4 for globally unique, non-sequential identifiers to avoid
collisions across sessions and organizations.

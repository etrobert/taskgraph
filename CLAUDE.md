# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Instructions

- ALWAYS run `npm run format` after making changes
- ALWAYS run `npm run lint` and `npm run build` after making a set of changes to ensure that it works.
- NEVER use `event.stopPropagation()`

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on all files
- `npm run format` - Format code with Prettier (includes Tailwind class sorting)
- `npm run format:check` - Check if code is properly formatted
- `npm run preview` - Preview production build locally

## Architecture Overview

TaskGraph is a React Flow-based task management application that allows users to create, edit, and organize tasks in a visual graph format with dependency relationships.

### Core Data Flow

**Task Node Structure**: Each task has a `TaskNodeData` interface containing:

- `label`: Task name (editable via double-click)
- `status`: 'pending' | 'in-progress' | 'completed' (cycleable via icon click)
- `archived`: boolean flag for hiding completed tasks
- `archivedAt`: timestamp when archived

**Persistence Layer**: Dual persistence system:

- **localStorage**: Auto-saves on every change for session persistence
- **File I/O**: Export/import JSON files for backup and sharing

### Key React Flow Integration

**Edge Creation**: Two methods supported:

1. **Node-to-Node**: Drag between existing nodes to create dependencies
2. **Drop-on-Void**: Drag from node handle and drop on empty canvas to create new connected task

**Handle Logic**:

- Left handle = target (receives dependencies)
- Right handle = source (creates dependencies)
- Direction determines dependency relationship in new task creation

### State Management Pattern

The app uses ReactFlow's `useNodesState` and `useEdgesState` hooks with automatic localStorage synchronization. Archive functionality filters nodes by `archived` property rather than changing status, preserving original task state information.

### Component Architecture

- **App.tsx**: Main container with ReactFlowProvider wrapper
- **TaskGraphFlow**: Core flow logic and state management
- **TaskNode**: Custom node component with inline editing and status cycling
- **ControlPanel**: All UI controls (save, load, archive, etc.)
- **fileOperations.ts**: File export/import utilities
- **storage.ts**: localStorage persistence layer

### Styling

Uses Tailwind CSS v4 with:

- Custom task node styling based on status
- Archived tasks show with reduced opacity and grayscale
- Tailwind class sorting via prettier-plugin-tailwindcss

### ID Generation

New tasks use UUID v4 for globally unique, non-sequential identifiers to avoid collisions across sessions and file imports.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Workflow Instructions

- ALWAYS run `npm run format` after making changes
- ALWAYS run `npm run lint` and `npm run build` after making a set of changes to
  ensure that it works.
- NEVER use `as any`
- NEVER use `as unknown as T`

## Project Structure

TaskGraph is a monorepo with two packages:

- **packages/web**: React Flow-based frontend application
- **packages/api**: Node.js tRPC API server with PostgreSQL database

## Development Commands

### Root Level Commands

- `npm run dev:web` - Start web development server
- `npm run dev:api` - Start API development server
- `npm run build` - Build both packages
- `npm run build:web` - Build web package only
- `npm run build:api` - Build API package only
- `npm run format` - Format code in all packages
- `npm run format:check` - Check formatting in all packages

### Web Package Commands (packages/web)

- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on all files
- `npm run format` - Format code with Prettier (includes Tailwind class sorting)
- `npm run start` - Preview production build locally

### API Package Commands (packages/api)

- `npm run dev` - Start API development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production API server
- `npm run lint` - Run ESLint on all files
- `npm run format` - Format code with Prettier
- `npm run cli [command]` - Run tRPC CLI commands (e.g.,
  `npm run cli organizations`)
- `./cli.ts [command]` - Direct execution of tRPC CLI

## Architecture Overview

TaskGraph is a full-stack task management application that allows users to
create, edit, and organize tasks in a visual graph format with dependency
relationships.

### Package-Specific Documentation

Each package has its own CLAUDE.md file with detailed technical information:

- **packages/api/CLAUDE.md**: API server architecture, database schema, tRPC
  routes, CLI usage
- **packages/web/CLAUDE.md**: React Flow integration, component architecture,
  styling, state management

## High-Level Architecture

TaskGraph is a full-stack application with:

- **Backend**: tRPC API server with PostgreSQL database for persistence
- **Frontend**: React Flow-based visual task management interface
- **Real-time sync**: WebSocket connections for live collaboration
- **Type safety**: End-to-end TypeScript with tRPC integration

## Key Features

- Visual task dependency graphs with drag-and-drop editing
- Real-time collaborative editing
- Organization and project management
- CLI tools for database operations
- Full type safety across client-server boundary

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run Vitest tests
npm run setup        # First-time setup: install deps + prisma generate + migrate
npm run db:reset     # Force reset database (destructive)
```

To run a single test file: `npx vitest src/components/chat/__tests__/ChatInterface.test.tsx`

**Environment:** Set `ANTHROPIC_API_KEY` in `.env` for real Claude AI; without it, a `MockLanguageModel` is used that returns static sample components.

## Architecture

UIGen is a Next.js 15 (App Router) application that lets users generate React components via chat with Claude AI and preview them live.

### Request Flow

1. User types in `ChatInterface` → `useChat` (Vercel AI SDK) streams to `/api/chat/route.ts`
2. Route calls `streamText` with Claude (or mock), passing two tools: `str_replace_editor` and `file_manager`
3. Claude calls tools to create/edit files in the virtual file system
4. `FileSystemProvider` context updates state; `PreviewFrame` re-renders the iframe
5. On stream finish, messages + file system are serialized and saved to SQLite via Prisma

### Virtual File System

`src/lib/file-system.ts` — in-memory tree (no disk writes). Files are stored as `VirtualFile` nodes; the root is `/`. State lives in `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`). The entire FS is serialized to JSON and persisted in `Project.data` in the DB.

### Preview Pipeline

`src/lib/transform/jsx-transformer.ts` — takes virtual files, compiles JSX via Babel standalone (in-browser), builds an import map pointing React/libraries to ESM CDN URLs, and generates an iframe HTML document. Tailwind CSS is loaded via CDN inside the iframe.

### AI Tools

- `str_replace_editor` (`src/lib/tools/str-replace.ts`) — `view`, `create`, `str_replace`, `insert` operations on virtual files
- `file_manager` (`src/lib/tools/file-manager.ts`) — `rename`, `delete` operations

### Language Model

`src/lib/provider.ts` — `getLanguageModel()` returns either `anthropic('claude-haiku-4-5')` or the `MockLanguageModel`. The mock simulates tool calls and returns hardcoded components; it limits itself to 4 steps to prevent loops.

### Auth

JWT sessions (7-day, HTTP-only cookie) via `jose` + `bcrypt`. Server actions in `src/actions/index.ts` handle signUp/signIn/signOut/getUser. Middleware in `src/middleware.ts` protects `/api/projects` and `/api/filesystem` routes. Projects are owned optionally (anonymous users can use the app without an account).

### UI Layout

`src/app/main-content.tsx` uses resizable panels: left 35% is chat, right 65% toggles between **Preview** (iframe) and **Code** (file tree + Monaco editor).

### Data Model

```
User → Projects (one-to-many)
Project.messages: JSON string (chat history)
Project.data: JSON string (serialized virtual file system)
```

SQLite via Prisma; schema at `prisma/schema.prisma`.

### Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`).

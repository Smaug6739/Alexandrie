# Frontend - Alexandrie

## Overview

The Alexandrie frontend is a Vue 3 application built with Nuxt 4. It features a component-based architecture, state management with Pinia, and a rich editing experience.

## Technology Stack

- **Framework**: Nuxt 4 (Vue 3)
- **State Management**: Pinia
- **Editor**: CodeMirror 6
- **Markdown**: markdown-it with custom extensions
- **Styling**: SCSS with custom design system
- **Build Tool**: Vite
- **PWA**: Offline support with @vite-pwa/nuxt

## Architecture

```
┌─────────────────────────────────────┐
│            User Interface           │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │   Pages     │  ← Route components
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │ Components  │  ← Reusable UI elements
        └──────┬──────┘
               │
    ┌──────────┴──────────┐
    │   Composables       │  ← Business logic & API calls
    └──────────┬──────────┘
               │
    ┌──────────┴──────────┐
    │   Pinia Stores      │  ← State management
    └──────────┬──────────┘
               │
    ┌──────────┴──────────┐
    │   Backend API       │  ← REST API
    └─────────────────────┘
```

## Directory Structure

### `/app/components`

Reusable Vue components organized by feature:

**Base Components**:

- `AppX.vue` - Generic UI elements: (buttons, inputs, modals, etc.)
- `Folder/` - Folder represent a single component (for big components)
- `Other.vue` - Misc reusable components

_Sometimes components are stored in `pages/<page>/_components/` if they are only used by that page._

### `/app/composables`

Reusable composition functions for shared logic:

- **`useNotifications.ts`** - Toast notifications system
- **`useContextMenu.ts`** - Right-click context menus
- **`useNodesTree.ts`** - Tree structure operations on nodes
- **`user.ts`** - User authentication state
- **`Preferences.ts`** - User preferences management
- **`utils.ts`** - Helper functions

### `/app/stores`

Pinia stores for application state:

- **`user.store.ts`** - User authentication and profile
- **`nodes.store.ts`** - Documents and categories management
- **`resources.store.ts`** - File uploads and media
- **`admin.store.ts`** - Admin operations

### `/app/middleware`

Route middleware for navigation guards:

## API Integration

API calls are centralized in `stores/_utils.ts` using the Fetch API with error handling and authentication tokens (also refresh token implementation).

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Development with host access (for mobile testing)
npm run dev:host

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Lint and auto-fix
npm run lint:fix

# Lint CSS/SCSS
npm run lint:css
```

## Environment Configuration

Create `.env` file:

```env
# API Configuration
NUXT_PUBLIC_BASE_API=http://localhost:8201
NUXT_PUBLIC_BASE_CDN=http://localhost:9000/alexandrie
```

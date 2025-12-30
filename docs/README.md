# Alexandrie - Technical Documentation

## Table of Contents

- [1. Application Overview](#1-application-overview)
- [2. System Architecture](#2-system-architecture)
- [3. Backend Architecture](#3-backend-architecture)
- [4. Frontend Architecture](#4-frontend-architecture)
- [5. Data Models](#5-data-models)
- [6. Key Features Implementation](#6-key-features-implementation)
- [7. External Services Integration](#7-external-services-integration)
- [8. Security Implementation](#8-security-implementation)
- [9. Development Workflow](#9-development-workflow)
- [10. Configuration Reference](#10-configuration-reference)

---

## 1. Application Overview

### 1.1 Purpose

Alexandrie is a modern, full-featured note-taking application designed for students and productivity enthusiasts. It provides an intuitive interface for creating, organizing, and managing notes written in extended Markdown format with advanced features like workspace organization, real-time collaboration through permissions, and S3-compatible file storage.

### 1.2 Key Features

- **Enhanced Markdown Editor**: CodeMirror 6-based editor with syntax highlighting, autocomplete, and extended Markdown features
- **Hierarchical Organization**: Workspaces, categories, and nested documents with unlimited depth
- **Granular Permissions**: Fine-grained access control system (Read, Write, Admin, Owner)
- **File Storage**: S3-compatible CDN integration for attachments and media
- **Search Capabilities**: Full-text search across all documents
- **Export Options**: PDF and Markdown export functionality
- **Progressive Web App**: Offline support with service worker caching
- **Multi-theme Support**: Dark and light modes with smooth transitions
- **Collaboration**: Share notes with unique links and manage user permissions

### 1.3 Technology Stack

| Layer                | Technology   | Version       | Purpose                            |
| -------------------- | ------------ | ------------- | ---------------------------------- |
| **Backend**          | Go (Golang)  | 1.24.0        | High-performance API server        |
| **Web Framework**    | Gin          | 1.11.0        | HTTP routing and middleware        |
| **Frontend**         | Nuxt         | 4.2.1         | Vue.js meta-framework with SSR/SPA |
| **UI Framework**     | Vue.js       | 3.5.24        | Reactive UI components             |
| **State Management** | Pinia        | 3.0.4         | Centralized state management       |
| **Database**         | MySQL        | 8.0+          | Relational data storage            |
| **Object Storage**   | MinIO/RustFS | -             | S3-compatible file storage         |
| **Code Editor**      | CodeMirror   | 6.x           | Markdown editing experience        |
| **Authentication**   | JWT          | golang-jwt/v5 | Stateless authentication           |
| **Email**            | go-mail      | 0.7.2         | SMTP email sending                 |
| **Build Tool**       | Bun          | Latest        | Fast package manager for frontend  |
| **Containerization** | Docker       | -             | Development and deployment         |

---

## 2. System Architecture

### 2.1 High-Level Architecture

Alexandrie follows a **microservices architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Browser / PWA with Service Worker for offline support)    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Reverse Proxy (Nginx)                     │
│              (SSL Termination, Load Balancing)               │
└──────────────┬─────────────────────────┬────────────────────┘
               │                         │
               │ Port 8200               │ Port 8201
               ▼                         ▼
┌──────────────────────┐      ┌─────────────────────────────┐
│   Frontend Service   │      │     Backend API Service     │
│     (Nuxt 4/Vue)     │◄─────┤        (Go/Gin)            │
│   - Server Render    │ API  │   - REST API               │
│   - Static Assets    │      │   - Business Logic         │
│   - PWA Service      │      │   - Authentication         │
└──────────────────────┘      └──────────┬──────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
         ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐
         │  MySQL Database │  │  MinIO/RustFS    │  │ SMTP Server  │
         │  - User Data    │  │  - File Storage  │  │ - Email      │
         │  - Documents    │  │  - S3 API        │  │   Sending    │
         │  - Permissions  │  │  - Media CDN     │  │              │
         └─────────────────┘  └──────────────────┘  └──────────────┘
```

### 2.2 Network Communication

All services communicate through a dedicated Docker network (`alexandrie-network`) in development/production setups:

- **Frontend ↔ User**: HTTP/HTTPS on port 8200
- **Backend ↔ Frontend**: REST API on port 8201 (all routes prefixed with `/api`)
- **Backend ↔ MySQL**: Internal connection on port 3306
- **Backend ↔ MinIO**: S3 protocol on port 9000
- **Backend ↔ SMTP**: TLS connection for email delivery

### 2.3 Data Flow

1. **User Action**: User interacts with Vue.js frontend
2. **State Update**: Pinia store dispatches action
3. **API Request**: HTTP request sent to backend API
4. **Authentication**: JWT token validated by middleware
5. **Authorization**: Permissions checked against database
6. **Business Logic**: Service layer processes request
7. **Data Persistence**: MySQL stores data or MinIO stores files
8. **Response**: JSON response sent back to frontend
9. **UI Update**: Vue components re-render with new data

---

## 3. Backend Architecture

### 3.1 Project Structure

```
backend/
├── main.go                          # Application entry point
├── go.mod                           # Go module dependencies
├── go.sum                           # Dependency checksums
├── config.toml                      # Application configuration
├── Dockerfile                       # Container image definition
│
├── app/                             # Core application setup
│   ├── app.go                       # App initialization & dependency injection
│   ├── database.go                  # MySQL connection & configuration
│   ├── migrations.go                # Database migration runner
│   ├── minio.go                     # S3 client initialization
│   └── mail.go                      # SMTP client setup
│
├── server/                          # HTTP server setup
│   └── server.go                    # Server initialization & config loading
│
├── router/                          # HTTP routing
│   ├── router.go                    # Main router with CORS & middleware
│   └── routes/                      # Route definitions by domain
│       ├── auth.go
│       ├── users.go
│       ├── nodes.go
│       ├── permissions.go
│       └── uploads.go
│
├── controllers/                     # HTTP request handlers
│   ├── authentication.controller.go # Login, register, logout, token refresh
│   ├── users.controller.go          # User CRUD operations
│   ├── nodes.controller.go          # Nodes (document/category/wp) CRUD operations
│   ├── permissions.controller.go    # Permission management (for nodes, will be moved soon on /nodes/permissions and nodes.permissions.controller.go)
│   ├── resources.controller.go     # File upload/download (resources)
│   └── index.go                     # Not implemented yey but healtcheck
│
├── services/                        # Business logic layer
│   ├── services.go                  # Service interfaces (types & logic definitions)
│   ├── user.service.go              # User business logic
│   ├── session.service.go           # Authentication & session management
│   ├── node.service.go              # Document/category operations
│   ├── permissions.service.go       # Access control logic
│   ├── minio.service.go             # File storage operations
│   └── log.service.go               # Activity logging
│
├── models/                          # Data structures
│   ├── index.go                     # Model registration
│   ├── user.model.go                # User entity
│   ├── node.model.go                # Document/category entity
│   ├── permission.model.go          # Permission entity
│   ├── session.model.go             # Session entity
│   └── log.model.go                 # Activity log entity
│
├── middlewares/                     # HTTP middleware
│   ├── authentification.go          # JWT validation
│   └── admin.go                     # Admin role check
│
├── permissions/                     # Access control system
│   ├── constants.go                 # Permission levels & actions
│   └── service.go                   # Permission checking logic
│
├── types/                           # Custom types
│   ├── Snowflake.go                 # Distributed ID generation
│   └── JSON.go                      # JSONB type for MySQL
│
├── utils/                           # Utility functions
│   ├── constants.go                 # Application constants
│   ├── snowflake.go                 # Snowflake ID generator
│   ├── responses.go                 # Standard API responses
│   ├── permissions.go               # Permission helpers -> to get connected user infos
│   ├── escape-html.go               # XSS prevention
│   ├── domains.go                   # Domain configuration
│   └── utils.go                     # General utilities
│
├── migrations/                      # Database migrations
│   ├── 000001_init.up.sql          # Initial schema
│   ├── 000002_change_ids_to_bigints.up.sql
│   ├── 000003_add_ip_indx.up.sql
│   ├── 000004_add_category_color.up.sql
│   ├── 000005_resource_parent.up.sql
│   ├── 000006_file_parent_id_constraint_rmdoc.up.sql
│   ├── 000007_pin_doc.up.sql
│   ├── 000008_reset_pass.up.sql
│   ├── 000009_doc_meta.up.sql
│   ├── 000010_nodes.up.sql         # Unified node system
│   └── 000011_permissions.up.sql   # Permission system
│
└── tests/                           # Integration tests
    ├── client.go                    # Test HTTP client
    ├── helpers.go                   # Test utilities
    ├── auth_test.go                 # Authentication tests
    ├── user_lifecycle_test.go       # User CRUD tests
    └── user_admin_test.go           # Admin functionality tests
```

### 3.2 Application Initialization Flow

```go
// main.go
1. Load .env file (godotenv)
2. Set domain environment variables
3. Get BACKEND_PORT from env
4. Call server.SetupServer()
   └─> Load config.toml
   └─> Initialize App struct
       ├─> Connect to MySQL (DBConnection)
       ├─> Connect to MinIO (MinioConnection)
       ├─> Setup SMTP client (GetMailClient)
       ├─> Initialize Snowflake ID generator
       ├─> Initialize all services:
       │   ├─> UserService
       │   ├─> AuthService (Session)
       │   ├─> LogService
       │   ├─> NodeService
       │   ├─> PermissionService
       │   └─> MinioService
       └─> Run database migrations
5. Initialize Gin router with CORS
6. Register route groups:
   ├─> /api/auth/*
   ├─> /api/users/*
   ├─> /api/nodes/*
   ├─> /api/permissions/*
   └─> /api/uploads/*
7. Start HTTP server on configured port
```

### 3.3 API Endpoints

#### Authentication Endpoints

| Method | Endpoint                    | Description                   | Auth Required       |
| ------ | --------------------------- | ----------------------------- | ------------------- |
| POST   | `/api/auth/register`        | Create new user account       | No                  |
| POST   | `/api/auth/login`           | Login and get JWT tokens      | No                  |
| POST   | `/api/auth/logout`          | Logout and invalidate session | Yes                 |
| POST   | `/api/auth/refresh`         | Refresh access token          | Yes (Refresh Token) |
| POST   | `/api/auth/forgot-password` | Request password reset email  | No                  |
| POST   | `/api/auth/reset-password`  | Reset password with token     | No                  |

#### User Endpoints

| Method | Endpoint         | Description                 | Auth Required |
| ------ | ---------------- | --------------------------- | ------------- |
| GET    | `/api/users/@me` | Get current user profile    | Yes           |
| PATCH  | `/api/users/@me` | Update current user         | Yes           |
| DELETE | `/api/users/@me` | Delete current user account | Yes           |
| GET    | `/api/users/:id` | Get user by ID (admin)      | Yes (Admin)   |
| GET    | `/api/users`     | List all users (admin)      | Yes (Admin)   |
| DELETE | `/api/users/:id` | Delete user (admin)         | Yes (Admin)   |

#### Node Endpoints (Documents & Categories)

| Method | Endpoint                  | Description                      | Auth Required          |
| ------ | ------------------------- | -------------------------------- | ---------------------- |
| GET    | `/api/nodes`              | List user's nodes (with filters) | Yes                    |
| GET    | `/api/nodes/:id`          | Get single node details          | Yes (Permission)       |
| POST   | `/api/nodes`              | Create new node                  | Yes                    |
| PATCH  | `/api/nodes/:id`          | Update node                      | Yes (Write Permission) |
| DELETE | `/api/nodes/:id`          | Delete node                      | Yes (Admin Permission) |
| GET    | `/api/nodes/:id/children` | Get child nodes                  | Yes (Permission)       |
| POST   | `/api/nodes/:id/pin`      | Pin/unpin node                   | Yes (Write Permission) |

#### Permission Endpoints

| Method | Endpoint                        | Description              | Auth Required |
| ------ | ------------------------------- | ------------------------ | ------------- |
| GET    | `/api/permissions/node/:nodeId` | Get node permissions     | Yes (Owner)   |
| POST   | `/api/permissions/node/:nodeId` | Grant permission to user | Yes (Owner)   |
| PATCH  | `/api/permissions/:id`          | Update permission level  | Yes (Owner)   |
| DELETE | `/api/permissions/:id`          | Revoke permission        | Yes (Owner)   |

#### File Upload Endpoints

| Method | Endpoint           | Description          | Auth Required |
| ------ | ------------------ | -------------------- | ------------- |
| POST   | `/api/uploads`     | Upload file to CDN   | Yes           |
| GET    | `/api/uploads`     | List user's uploads  | Yes           |
| GET    | `/api/uploads/:id` | Get file metadata    | Yes           |
| DELETE | `/api/uploads/:id` | Delete uploaded file | Yes           |

### 3.4 Service Layer Architecture

The service layer implements the business logic and separates it from HTTP concerns:

```go
// Example: NodeService interface
type NodeService interface {
    Create(node *models.Node) error
    GetByID(id types.Snowflake, userID types.Snowflake) (*models.Node, error)
    Update(node *models.Node, userID types.Snowflake) error
    Delete(id types.Snowflake, userID types.Snowflake) error
    List(userID types.Snowflake, filters NodeFilters) ([]*models.Node, error)
    GetChildren(parentID types.Snowflake, userID types.Snowflake) ([]*models.Node, error)
}
```

**Service Layer Benefits:**

- Reusability across different controllers
- Easier unit testing (mock dependencies)
- Clear separation of concerns
- Consistent error handling
- Transaction management

### 3.5 Middleware Stack

Requests flow through the following middleware layers:

```
Request
  │
  ├─> gin.Recovery()              # Panic recovery
  │
  ├─> CORS Middleware             # Cross-origin handling
  │     ├─> Origin: DOMAIN_CLIENT
  │     ├─> Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
  │     ├─> Credentials: true
  │     └─> Headers: Authorization, Content-Type, etc.
  │
  ├─> Authentication Middleware   # JWT validation (if protected route)
  │     ├─> Extract JWT from Authorization header
  │     ├─> Validate token signature
  │     ├─> Check token expiration
  │     ├─> Load user from database
  │     └─> Attach user to context
  │
  ├─> Admin Middleware           # Role check (if admin route)
  │     ├─> Check user.Role == RoleAdministrator
  │     └─> Return 403 if not admin
  │
  └─> Controller Handler          # Business logic
        └─> Response
```

### 3.6 Database Connection Management

```go
// Connection configuration
- Driver: MySQL (go-sql-driver/mysql)
- Connection pooling enabled
- Max open connections: 25
- Max idle connections: 10
- Connection max lifetime: 5 minutes
- Charset: utf8mb4 (full Unicode support)
- ParseTime: true (automatic time parsing)
- Location: UTC

// Connection string format
user:password@tcp(host:port)/database?charset=utf8mb4&parseTime=True&loc=UTC
```

### 3.7 ID Generation (Snowflake)

Alexandrie uses **Discord/Twitter Snowflake** algorithm for distributed ID generation:

```
Snowflake ID Structure (64 bits):
┌─────────────────────────────────────────────────┐
│ 1 bit │   41 bits    │ 10 bits │   12 bits     │
│  Sign │  Timestamp   │ Machine │   Sequence    │
│   0   │  Millisecond │   ID    │    Number     │
└─────────────────────────────────────────────────┘

Features:
- Sortable by time (timestamp-based)
- Guaranteed uniqueness across distributed systems
- No database round-trip required
- 64-bit integer (fits in BIGINT)
- Epoch: 1609459200000 (2021-01-01 00:00:00 UTC)
```

---

## 4. Frontend Architecture

### 4.1 Project Structure

```
frontend/
├── nuxt.config.ts                   # Nuxt configuration
├── package.json                     # Dependencies
├── bun.lock                         # Dependency lock file
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.mjs                # ESLint configuration
├── stylelint.config.js              # Stylelint configuration
├── Dockerfile                       # Production container
├── Dockerfile.dev                   # Development container
├── docker-entrypoint.sh             # Container startup script
│
├── app/                             # Application source
│   ├── App.vue                      # Root component
│   ├── error.vue                    # Error page component
│   │
│   ├── pages/                       # Route pages (file-based routing)
│   │   ├── index.vue                # Landing page
│   │   ├── dashboard.vue            # Main dashboard layout
│   │   ├── dashboard/
│   │   │   ├── docs/                # Document management pages
│   │   │   │   ├── index.vue        # Document list
│   │   │   │   ├── new.vue          # Create document
│   │   │   │   ├── edit/[id].vue    # Edit document
│   │   │   │   └── _components/     # Document-specific components
│   │   │   │       ├── DocumentCard*.vue
│   │   │   │       ├── DocumentEditor.vue
│   │   │   │       └── table-of-content/
│   │   │   │
│   │   │   ├── cdn/                 # File management
│   │   │   │   ├── index.vue
│   │   │   │   ├── [id]/
│   │   │   │   └── _modals/
│   │   │   │
│   │   │   └── admin.vue            # Admin panel
│   │   │
│   │   └── auth/                    # Authentication pages
│   │       ├── login.vue
│   │       └── register.vue
│   │
│   ├── components/                  # Reusable components
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.vue
│   │   │   ├── Sidebar.vue
│   │   │   └── Footer.vue
│   │   │
│   │   ├── ui/                      # UI components
│   │   │   ├── Button.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Dropdown.vue
│   │   │   └── Input.vue
│   │   │
│   │   └── editor/                  # Editor components
│   │       ├── MarkdownEditor.vue
│   │       ├── MarkdownPreview.vue
│   │       └── EditorToolbar.vue
│   │
│   ├── composables/                 # Composition API functions
│   │   ├── useAuth.ts               # Authentication logic
│   │   ├── useApi.ts                # API client wrapper
│   │   ├── useNodes.ts              # Node operations
│   │   ├── usePermissions.ts        # Permission checks
│   │   └── useTheme.ts              # Theme management
│   │
│   ├── stores/                      # Pinia stores (state management)
│   │   ├── index.ts                 # Store exports
│   │   ├── user.store.ts            # User state & auth
│   │   ├── nodes.store.ts           # Documents & categories
│   │   ├── resources.store.ts       # File uploads
│   │   ├── admin.store.ts           # Admin functionality
│   │   ├── collection.ts            # Collection helpers
│   │   └── db_structures.d.ts       # TypeScript definitions
│   │
│   ├── middleware/                  # Route middleware
│   │   ├── auth.ts                  # Authentication guard
│   │   ├── guest.ts                 # Guest-only guard
│   │   └── admin.ts                 # Admin-only guard
│   │
│   ├── helpers/                     # Helper functions
│   │   ├── colors.ts                # Colors management in the app (primary, available in selector etc.)
│   │   ├── importations.ts          # Decoder for JSON Nodes format
│   │   ├── paginator.ts             # Pagniation helper for datatable
│   │   ├── navigation.ts            # Navigation constants
│   │   ├── resources.ts            # Files management (file size, filetype, resolveUrl)
│   │   └── utils.ts                 # General helpers
│   │
│   ├── styles/                      # Global styles
│   │   ├── main.scss                # Main stylesheet
│   │   ├── _variables.scss          # SCSS variables
│   │   └── katex/                   # Math rendering styles
│   │
│   └── assets/                      # Static assets
│       ├── images/
│       └── fonts/
│
└── public/                          # Static files
    ├── favicon.ico
    ├── icons/                        # App icons
    ├── app-icons/                    # SVG icons - from https://fonts.google.com/icons
    ├── screenshots/                  # App screenshots & mocks
    └── Logo/                         # Brand assets
```

### 4.2 State Management (Pinia Stores)

#### User Store (`user.store.ts`)

```typescript
// Manages authentication and user profile

State:
- user: User | null                  // Current user object
- isAuthenticated: boolean           // Auth status
- loading: boolean                   // Loading state (to display loading indicator in interface)

Actions:
- login(credentials)                 // Login user
- logout()                           // Logout user
- register(userData)                 // Create account
- updateProfile(data)                // Update user info
- fetchProfile()                     // Load current user

Getters:
- isAdmin                            // Check if user is admin
- fullName                           // User's full name
- initials                           // User initials for avatar
```

#### Nodes Store (`nodes.store.ts`)

```typescript
// Manages documents and categories

State:
- nodes: Node[]                      // All nodes (docs + categories)
- loading: boolean
- searchQuery: string

Actions:
- fetchNodes(filters)                // Load nodes with filters
- getNode(id)                        // Get single node
- createNode(data)                   // Create document/category
- updateNode(id, data)               // Update node
- deleteNode(id)                     // Delete node
- searchNodes(query)                 // Search functionality with advanced options, see available in the file

Getters:
- workspaces                         // Filter nodes with role=1
- categories                         // Filter nodes with role=2
- documents                          // Filter nodes with role=3
- resources                         // Filter nodes with role=4
```

#### Resources Store (`resources.store.ts`)

```typescript
// Manages file uploads and CDN resources

State:
- resources: Resource[]              // Uploaded files
- loading: boolean
- uploadProgress: number

Actions:
- uploadFile(file)                   // Upload to CDN
- fetchResources()                   // List all uploads
- deleteResource(id)                 // Remove file
- getResourceUrl(id)                 // Get CDN URL

Getters:
- images                             // Filter image files
- documents                          // Filter document files
- totalSize                          // Total storage used
```

### 4.3 Routing System

Nuxt uses **file-based routing** where the file structure determines routes:

```
pages/index.vue              → /
pages/dashboard.vue          → /dashboard
pages/dashboard/docs.vue     → /dashboard/docs
pages/dashboard/docs/new.vue → /dashboard/docs/new
pages/dashboard/docs/edit/[id].vue → /dashboard/docs/edit/:id (dynamic)
```

#### Route Guards (Middleware)

```typescript
// auth.ts - Protect authenticated routes
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (!userStore.isAuthenticated) {
    return navigateTo('/auth/login');
  }
});

// admin.ts - Protect admin routes
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (!userStore.isAdmin) {
    return navigateTo('/dashboard');
  }
});
```

### 4.4 Markdown Editor Implementation

Alexandrie uses **CodeMirror 6** for the Markdown editor:

```typescript
// Key CodeMirror extensions used:

import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { autocompletion } from '@codemirror/autocomplete';
import { search } from '@codemirror/search';
import { highlightSelectionMatches } from '@codemirror/search';

// Editor configuration
const editorView = new EditorView({
  state: EditorState.create({
    doc: initialContent,
    extensions: [
      markdown(), // Markdown syntax
      autocompletion(), // Autocomplete
      search(), // Search & replace
      highlightSelectionMatches(), // Highlight matches
      // Custom theme
      // Keybindings
      // Event handlers
    ],
  }),
  parent: editorElement,
});
```

#### Markdown Rendering

```typescript
// markdown-it configuration for rendering

import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItContainer from 'markdown-it-container';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import markdownItMark from 'markdown-it-mark';
import markdownItUnderline from 'markdown-it-underline';

const md = new MarkdownIt({
  html: true, // Enable HTML tags
  linkify: true, // Auto-convert URLs to links
  typographer: true, // Smart quotes, dashes
  breaks: false, // Convert \n to <br>
})
  .use(markdownItAnchor, {
    /* heading anchors */
  })
  .use(markdownItContainer, 'warning') // ::: warning blocks
  .use(markdownItContainer, 'info') // ::: info blocks
  .use(markdownItHighlightjs) // Code syntax highlighting
  .use(markdownItMark) // ==marked text==
  .use(markdownItUnderline); // ++underlined text++

// Render markdown to HTML
const html = md.render(markdownContent);
```

#### KaTeX Math Rendering

```typescript
// Math formula rendering with KaTeX

import katex from 'katex';

// Inline math: $formula$
// Block math: $$formula$$

// Custom markdown-it plugin for math
md.use(markdownItMath, {
  engine: katex,
  delimiters: 'dollars',
});
```

### 4.6 Component Architecture

```vue
<!-- Example: DocumentCard.vue -->

<template>
  <div class="document-card" @click="openDocument">
    <div class="document-header">
      <Icon :name="node.icon" />
      <h3>{{ node.name }}</h3>
    </div>

    <div class="document-meta">
      <span>{{ formatDate(node.updated_timestamp) }}</span>
      <Badge v-if="node.tags">{{ node.tags }}</Badge>
    </div>

    <div class="document-actions">
      <AppButton @click.stop="shareDocument">Share</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// NOTHING :) Nuxt automaticly import components from "app/components" folder
import type { Node } from '~/stores';
</script>

<style scoped lang="scss">
.document-card {
  // Component styles
}
</style>
```

### 4.7 Theme System

```typescript
// Color mode configuration

// nuxt.config.ts
colorMode: {
  preference: 'light',     // Default theme
  fallback: 'light',       // Fallback if no system preference
  classSuffix: ''          // CSS class suffix
}

// Usage in components
const colorMode = useColorMode()

// Switch theme
colorMode.preference = 'dark'

// CSS variables per theme
:root {
  // Default variables correspond to the default primary color
	--default: #3956e7;
	--default-dark: #2c3eb9;
	--default-bg: #dde1f8;
	--default-border: #dde1f8;

  --bg-color: #ffffff;
  --bg-contrast: #fbfbfb;
  --font-color: #3c4450;
}

.dark {
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
  --color-primary: #5c7cfa;
}
```

---

## 5. Data Models

### 5.1 User Model

```go
type User struct {
    Id               Snowflake  `json:"id"`
    Username         string     `json:"username"`         // 5-30 chars, unique
    Firstname        *string    `json:"firstname"`        // Optional
    Lastname         *string    `json:"lastname"`         // Optional
    Role             int        `json:"role"`             // 1: user, 2: admin
    Avatar           *string    `json:"avatar"`           // Avatar URL
    Email            string     `json:"email"`            // Email address, unique
    Password         string     `json:"-"`                // Bcrypt hash (hidden from JSON)
    CreatedTimestamp int64      `json:"created_timestamp"`
    UpdatedTimestamp int64      `json:"updated_timestamp"`
}
```

**Database Schema:**

```sql
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL PRIMARY KEY,
  `username` varchar(25) NOT NULL UNIQUE,
  `firstname` varchar(25) DEFAULT NULL,
  `lastname` varchar(25) DEFAULT NULL,
  `role` int NOT NULL DEFAULT '1',
  `avatar` varchar(75) DEFAULT NULL,
  `email` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `created_timestamp` bigint NOT NULL,
  `updated_timestamp` bigint NOT NULL
);
```

### 5.2 Node Model (Unified Document/Category)

```go
type Node struct {
    // Core fields
    Id               Snowflake   `json:"id"`
    UserId           Snowflake   `json:"user_id"`         // Owner
    ParentId         *Snowflake  `json:"parent_id"`       // Hierarchical structure
    Name             string      `json:"name"`            // Display name (max 50 chars)
    Description      *string     `json:"description"`     // Optional description (max 250)
    Tags             *string     `json:"tags"`            // Comma-separated tags

    // Node type and appearance
    Role             int         `json:"role"`            // 1: workspace, 2: category, 3: document
    Color            *int        `json:"color"`           // Color code for UI
    Icon             *string     `json:"icon"`            // Icon identifier
    Thumbnail        *string     `json:"thumbnail"`       // Thumbnail URL
    Theme            *string     `json:"theme"`           // Custom theme settings

    // Access control
    Accessibility    *int        `json:"accessibility"`   // 0: Public, 1: Private, 2: Unlisted
    Access           int         `json:"access"`          // Bit field: 1=view, 2=edit

    // Display and ordering
    Display          *int        `json:"display"`         // Display mode
    Order            *int        `json:"order"`           // Sort order (-1: pinned, -2: bookmark)

    // Content (for document nodes)
    Content          *string     `json:"content"`         // Markdown content
    ContentCompiled  *string     `json:"content_compiled"` // Rendered HTML
    Size             *int64      `json:"size"`            // Content size in bytes

    // Metadata
    Metadata         *JSONB      `json:"metadata"`        // Additional JSON data
    CreatedTimestamp int64       `json:"created_timestamp"`
    UpdatedTimestamp int64       `json:"updated_timestamp"`

    // Relations
    Permissions      []*Permission `json:"permissions"`   // Access permissions
}
```

**Node Roles:**

- `1` - Workspace: Top-level container
- `2` - Category: Organizational folder
- `3` - Document: Actual note/content
- `4` - Resource: An uploaded file

**Accessibility Levels:**

- `0` - Public: Anyone can view
- `1` - Private: Only owner and permitted users
- `2` - Unlisted: Accessible via direct link

### 5.3 Permission Model

```go
type Permission struct {
    Id               Snowflake  `json:"id"`
    NodeId           Snowflake  `json:"node_id"`         // Target node
    UserId           *Snowflake `json:"user_id"`         // User granted permission
    Email            *string    `json:"email"`           // Or email for invite
    Level            int        `json:"level"`           // Permission level (1-5)
    CreatedTimestamp int64      `json:"created_timestamp"`
    UpdatedTimestamp int64      `json:"updated_timestamp"`
}
```

**Permission Levels:**

```go
const (
    PermNone  = 0  // No access
    PermRead  = 1  // Read-only access
    PermWrite = 2  // Can edit content
    PermAdmin = 3  // Can delete, share
    PermOwner = 4  // Full control, manage permissions
)
```

**Permission Actions:**

```go
const (
    ActionRead              = 1  // Requires: PermRead
    ActionUpdate            = 2  // Requires: PermWrite
    ActionDelete            = 3  // Requires: PermAdmin
    ActionShare             = 4  // Requires: PermAdmin
    ActionManagePermissions = 5  // Requires: PermOwner
)
```

### 5.4 Session Model

```go
type Session struct {
    Id                   Snowflake `json:"id"`
    UserId               Snowflake `json:"user_id"`
    RefreshToken         *string   `json:"refresh_token"`   // JWT refresh token
    ExpireToken          *int64    `json:"expire_token"`    // Token expiration
    LastRefreshTimestamp *int64    `json:"last_refresh_timestamp"`
    Active               *int      `json:"active"`          // 1: active, 0: inactive
    LoginTimestamp       *int64    `json:"login_timestamp"`
    LogoutTimestamp      *int64    `json:"logout_timestamp"`
}
```

### 5.5 Resource Model (File Uploads)

```go
type Resource struct {
    Id              Snowflake `json:"id"`
    Filename        string    `json:"filename"`
    FileSize        int       `json:"file_size"`         // Bytes
    FileType        string    `json:"file_type"`         // MIME type
    OriginalPath    string    `json:"original_path"`     // S3 path
    TransformedPath *string   `json:"transformed_path"`  // Optimized version
    ParentId        *Snowflake `json:"parent_id"`        // Parent node
    AuthorId        Snowflake `json:"author_id"`
    CreatedTimestamp int64    `json:"created_timestamp"`
}
```

### 5.6 Activity Log Model

```go
type ConnectionLog struct {
    Id        Snowflake `json:"id"`
    UserId    Snowflake `json:"user_id"`
    IpAddress *string   `json:"ip_address"`
    UserAgent *string   `json:"user_agent"`
    Location  *string   `json:"location"`         // Geolocation
    Type      string    `json:"type"`             // "login", "logout", "failed"
    Timestamp int64     `json:"timestamp"`
}
```

### 5.7 Entity Relationships

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ 1
       │
       │ owns
       │
       ├─────────────────┬─────────────────┬────────────────┐
       │ *               │ *               │ *              │
       ▼                 ▼                 ▼                ▼
┌──────────┐      ┌──────────┐     ┌──────────┐    ┌──────────┐
│   Node   │      │ Resource │     │ Session  │    │   Log    │
└────┬─────┘      └──────────┘     └──────────┘    └──────────┘
     │ parent
     │ *
     ▼
┌──────────┐
│   Node   │ (child nodes - recursive)
│          │
│ can have │
└────┬─────┘
     │ *
     ▼
┌─────────────┐
│ Permission  │
│  (shared    │
│   access)   │
└─────────────┘
```

---

## 6. Key Features Implementation

### 6.1 Authentication Flow

#### Registration

```
User submits registration form
  ├─> Frontend validates input (email, password strength)
  ├─> POST /api/auth/register
  │     ├─> Backend validates data (Gin binding validation)
  │     ├─> Check if username already exists
  │     ├─> Hash password with bcrypt
  │     ├─> Generate Snowflake ID
  │     ├─> Create user in database
  │     └─> Return tokens + user data
  └─> Frontend stores tokens (localStorage + cookie)
      └─> Redirect to dashboard
```

#### Login

```
User submits credentials
  ├─> POST /api/auth/login
  │     ├─> Find user by email
  │     ├─> Compare password with bcrypt hash
  │     ├─> Generate JWT tokens
  │     │     ├─> Access token: expires in 15 minutes
  │     │     └─> Refresh token: expires in 7 days
  │     ├─> Create/update session
  │     ├─> Log connection (IP, user agent, geolocation)
  │     └─> Return tokens + user data
  └─> Frontend stores tokens
      └─> Initialize user store
          └─> Redirect to dashboard
```

#### Token Refresh

```
Access token expired (401 response)
  ├─> Frontend intercepts 401
  ├─> POST /api/auth/refresh (with refresh token)
  │     ├─> Validate refresh token
  │     ├─> Check session is active
  │     ├─> Generate new access token
  │     ├─> Update session last_refresh_timestamp
  │     └─> Return new access token
  └─> Frontend stores new token
      └─> Retry original request
  └─> Frontend reveive an error
      └─> User disconnected
```

#### JWT Token Structure

```go
// Access Token Claims
{
  "user_id": "123456789",
  "username": "johndoe",
  "role": 1,
  "exp": 1234567890,  // 15 minutes from issue
  "iat": 1234567000
}

// Refresh Token Claims
{
  "user_id": "123456789",
  "session_id": "987654321",
  "exp": 1235172000,  // 7 days from issue
  "iat": 1234567000
}
```

### 6.2 Node System (Documents & Categories)

#### Node Creation

```
User clicks "New Document" or "New Category"
  ├─> Frontend shows creation modal
  ├─> User fills form (name, parent, role, etc.)
  ├─> POST /api/nodes
  │     ├─> Validate input (name required, max length)
  │     ├─> Check parent exists (if provided)
  │     ├─> Check user has write permission on parent
  │     ├─> Generate Snowflake ID
  │     ├─> Set default values:
  │     │     ├─> user_id: current user
  │     │     ├─> accessibility: 1 (private)
  │     │     ├─> access: 3 (view + edit for owner)
  │     │     └─> timestamps
  │     ├─> Insert into database
  │     └─> Return created node
  └─> Frontend updates nodes store
      └─> Navigate to node (if document)
```

#### Hierarchical Structure

```
Workspace (role=1)
  └─ Category (role=2, parent_id=workspace.id)
      ├─ Document (role=3, parent_id=category.id)
      ├─ Document (role=3, parent_id=category.id)
      └─ Sub-category (role=2, parent_id=category.id)
          └─ Document (role=3, parent_id=sub-category.id)
```

#### Node Retrieval with Permissions

```go
// Service layer logic for GetNode

func (s *NodeService) GetNode(nodeId, userId Snowflake) (*Node, error) {
    // 1. Load node from database
    node := loadNodeFromDB(nodeId)

    // 2. Check if user is owner
    if node.UserId == userId {
        return node, nil  // Owner has full access
    }

    // 3. Load permissions for this node
    permissions := loadPermissions(nodeId)

    // 4. Check if user has permission
    for _, perm := range permissions {
        if perm.UserId == userId && perm.Level >= PermRead {
            return node, nil
        }
    }

    // 5. Check accessibility
    if node.Accessibility == Public {
        return node, nil  // Public nodes are visible to all
    }

    return nil, ErrForbidden
}
```

### 6.3 Permission System

#### Granting Permission

```
Node owner shares document
  ├─> GET /api/users (search for user)
  ├─> Select user and permission level
  ├─> POST /api/permissions/node/:nodeId
  │     ├─> Verify requester is owner (PermOwner level)
  │     ├─> Validate permission level (1-4)
  │     ├─> Check if permission already exists
  │     │     ├─> If exists: update level
  │     │     └─> If not: create new permission
  │     ├─> Insert/update database
  │     └─> Return permission object
  └─> Frontend updates UI
      └─> Send notification (if implemented)
```

#### Permission Checking

```go
// Check if user can perform action on node

func CanPerform(userId, nodeId Snowflake, action NodeAction) bool {
    // 1. Load node
    node := getNode(nodeId)

    // 2. Owner always has full access
    if node.UserId == userId {
        return true
    }

    // 3. Get required permission level for action
    requiredLevel := action.RequiredLevel()

    // 4. Load user's permission for this node
    permission := getPermission(nodeId, userId)

    // 5. Compare levels
    return permission.Level >= requiredLevel
}

// Examples:
CanPerform(userId, nodeId, ActionRead)     // Requires PermRead (1)
CanPerform(userId, nodeId, ActionUpdate)   // Requires PermWrite (2)
CanPerform(userId, nodeId, ActionDelete)   // Requires PermAdmin (3)
CanPerform(userId, nodeId, ActionManagePermissions) // Requires PermOwner (4)
```

#### Inherited Permissions

```
When checking permissions on a node:
  1. Check direct permissions on the node
  2. If no permission found, check parent node
  3. Recurse up the tree until permission found or root reached
  4. If accessibility is Public, grant read access
  5. Otherwise, deny access
```

### 6.4 File Storage (S3/MinIO)

#### File Upload Flow

```
User uploads file (drag & drop or file picker)
  ├─> Frontend validates file:
  │     ├─> Check file size (max from config)
  │     ├─> Check file type (supported formats)
  ├─> POST /api/uploads (multipart/form-data)
  │     ├─> Backend receives file
  │     ├─> Validate file size and type
  │     ├─> Generate unique filename (UUID + extension)
  │     ├─> Upload to MinIO/RustFS:
  │     │     ├─> Bucket: "alexandrie"
  │     │     ├─> Path: uploads/{userId}/{filename}
  │     │     └─> Set content type
  │     ├─> Create resource record in database (node, role=4)
  │     └─> Return resource object with URLs
  └─> Frontend displays uploaded file
      └─> Update resources store
```

#### File Access

```
User requests node (view node)
  ├─> GET /api/uploads/:id
  │     ├─> Load resource from database
  │     ├─> Check user has access:
  │     │     ├─> User is owner, OR
  │     │     ├─> File is in a node user can access
  │     │     └─> (Check node permissions)
  │     ├─> Generate presigned URL from MinIO
  │     │     └─> Valid for 1 hour
  │     └─> Return presigned URL
  └─> Frontend redirects to presigned URL
      └─> Browser downloads from MinIO directly
```

To access the file, the request must be on the S3 server directly (minio, rustfs etc.)

### 6.5 Search Functionality

#### Frontend Search UX

```typescript
// Debounced search composable

const searchQuery = ref('');
const searchResults = ref<Node[]>([]);

// Debounce to avoid excessive API calls
const debouncedSearch = useDebounceFn(async (query: string) => {
  if (query.length < 2) {
    searchResults.value = [];
    return;
  }

  const results = await api(`/api/nodes?search=${query}`);
  searchResults.value = results;
}, 300);

watch(searchQuery, newQuery => {
  debouncedSearch(newQuery);
});
```

### 6.6 Export Functionality

#### Markdown Export

```typescript
// Generate .md file from node content

const exportMarkdown = (node: Node) => {
  const content = `# ${node.name}\n\n${node.content}`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${node.name}.md`;
  link.click();

  URL.revokeObjectURL(url);
};
```

#### PDF Export

```typescript
// Use browser's print functionality with custom styles

const exportPDF = (node: Node) => {
  // Render node content in printable format
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${node.name}</title>
        <style>
          /* Print-optimized styles */
          body { font-family: serif; }
          @page { margin: 2cm; }
        </style>
      </head>
      <body>
        <h1>${node.name}</h1>
        ${node.content_compiled}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};
```

## 7. External Services Integration

### 7.1 MySQL Database

#### Connection Configuration

```go
// Database connection from environment variables

DATABASE_HOST=mysql          // Container name or hostname
DATABASE_PORT=3306           // MySQL default port
DATABASE_NAME=alexandrie     // Database name
DATABASE_USER=alexandrie     // Database user
DATABASE_PASSWORD=password   // User password

// Connection string
dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=UTC",
    user, password, host, port, database)

// Connection pool settings
db.SetMaxOpenConns(25)       // Maximum open connections
db.SetMaxIdleConns(10)       // Maximum idle connections
db.SetConnMaxLifetime(5 * time.Minute)
```

#### Migration System

```go
// Database migrations using golang-migrate

// Migration files format: {version}_{name}.{up|down}.sql
// Example: 000001_init.up.sql

// Run migrations on application start
func Migrate(config *Config) {
    driver, _ := mysql.WithInstance(db, &mysql.Config{})

    m, _ := migrate.NewWithDatabaseInstance(
        "file://migrations",
        "mysql",
        driver,
    )

    // Apply all pending migrations
    m.Up()
}

// Migration history tracked in schema_migrations table
```

#### Transactions

```go
// Example transaction for creating node with permissions

func CreateNodeWithPermissions(node *Node, permissions []*Permission) error {
    // Begin transaction
    tx, err := db.Begin()
    if err != nil {
        return err
    }

    // Defer rollback (no-op if commit succeeds)
    defer tx.Rollback()

    // Insert node
    _, err = tx.Exec("INSERT INTO nodes (...) VALUES (...)", node)
    if err != nil {
        return err  // Automatic rollback
    }

    // Insert permissions
    for _, perm := range permissions {
        _, err = tx.Exec("INSERT INTO permissions (...) VALUES (...)", perm)
        if err != nil {
            return err  // Automatic rollback
        }
    }

    // Commit transaction
    return tx.Commit()
}
```

### 7.2 MinIO/RustFS (S3-Compatible Storage)

#### Connection Setup

```go
// MinIO client initialization

import "github.com/minio/minio-go/v7"

MINIO_ENDPOINT=rustfs:9000                 // S3 endpoint
MINIO_ACCESSKEY=alexandrie-key             // Access key
MINIO_SECRETKEY=alexandrie-secret          // Secret key
MINIO_BUCKET=alexandrie                    // Bucket name

// Initialize client
minioClient, err := minio.New(endpoint, &minio.Options{
    Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
    Secure: false,  // Use HTTPS in production
})

// Ensure bucket exists
exists, _ := minioClient.BucketExists(context.Background(), bucketName)
if !exists {
    minioClient.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{})
}
```

#### File Operations

```go
// Upload file to S3

func (s *MinioService) UploadFile(file multipart.File, filename string) (string, error) {
    // Generate object path
    objectPath := fmt.Sprintf("uploads/%s/%s", userId, filename)

    // Upload to MinIO
    info, err := s.client.PutObject(
        context.Background(),
        s.bucketName,
        objectPath,
        file,
        fileSize,
        minio.PutObjectOptions{
            ContentType: contentType,
        },
    )

    return objectPath, err
}

// Generate presigned URL for download

func (s *MinioService) GetPresignedURL(objectPath string) (string, error) {
    url, err := s.client.PresignedGetObject(
        context.Background(),
        s.bucketName,
        objectPath,
        time.Hour,  // Valid for 1 hour
        nil,
    )

    return url.String(), err
}

// Delete file

func (s *MinioService) DeleteFile(objectPath string) error {
    return s.client.RemoveObject(
        context.Background(),
        s.bucketName,
        objectPath,
        minio.RemoveObjectOptions{},
    )
}
```

#### CDN Configuration

```
Frontend CDN URL: NUXT_PUBLIC_BASE_CDN
Example: https://cdn.alexandrie-hub.fr/alexandrie

Image access:
  Full URL: {BASE_CDN}/{objectPath}
  Example: https://cdn.alexandrie-hub.fr/alexandrie/uploads/123/image.jpg

For production, configure MinIO with:
  - Custom domain (cdn.example.com)
  - CloudFront or similar CDN in front
  - Public read access for public files
  - Presigned URLs for private files
```

### 7.3 SMTP Email Service

#### Configuration

```go
// SMTP client setup using go-mail

SMTP_HOST=smtp.example.com      // SMTP server
SMTP_PORT=587                    // SMTP port (587 for TLS)
SMTP_MAIL=no-reply@example.com  // From address
SMTP_PASSWORD=yourpassword       // SMTP password

// Initialize mail client
import "github.com/wneessen/go-mail"

mailClient, err := mail.NewClient(
    smtpHost,
    mail.WithPort(587),
    mail.WithSMTPAuth(mail.SMTPAuthPlain),
    mail.WithUsername(smtpMail),
    mail.WithPassword(smtpPassword),
    mail.WithTLSPolicy(mail.TLSMandatory),
)
```

#### Sending Emails

```go
// Password reset email example

func SendPasswordResetEmail(email, resetToken string) error {
    m := mail.NewMsg()

    m.From(smtpMail)
    m.To(email)
    m.Subject("Password Reset - Alexandrie")

    resetURL := fmt.Sprintf("%s/auth/reset-password?token=%s",
        frontendURL, resetToken)

    body := fmt.Sprintf(`
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="%s">Reset Password</a>
        <p>This link expires in 1 hour.</p>
    `, resetURL)

    m.SetBodyString(mail.TypeTextHTML, body)

    return mailClient.DialAndSend(m)
}
```

**Email Use Cases:**

- Password reset requests
- Collaboration invites (future)

### 7.4 Geolocation Service

#### IP Geolocation

Alexandrie includes MaxMind GeoLite2 database integration for tracking login locations:

```sql
-- Geolocation tables

city_locations_fr           -- City and region information
city_ipv4_complete         -- IPv4 address ranges
city_ipv6_complete         -- IPv6 address ranges
```

```go
// Get location from IP address

func GetLocationFromIP(ipAddress string) string {
    // Parse IP
    ip := net.ParseIP(ipAddress)

    // Query appropriate table based on IP version
    var geonameId int
    if ip.To4() != nil {
        // IPv4 query
        query := `
            SELECT geoname_id
            FROM city_ipv4_complete
            WHERE INET_ATON(?) BETWEEN network_start_integer AND network_last_integer
        `
        db.QueryRow(query, ipAddress).Scan(&geonameId)
    } else {
        // IPv6 query (similar logic)
    }

    // Get city information
    var city, country string
    query := `
        SELECT city_name, country_name
        FROM city_locations_fr
        WHERE geoname_id = ?
    `
    db.QueryRow(query, geonameId).Scan(&city, &country)

    return fmt.Sprintf("%s, %s", city, country)
}
```

**Usage:**

- Log user login locations
- Security monitoring
- Suspicious activity detection (not implemented yet)

## 8. Security Implementation

### 8.1 Authentication Security

#### Password Hashing

```go
import "golang.org/x/crypto/bcrypt"

// Hash password with bcrypt (cost: 12)
func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
    return string(bytes), err
}

// Verify password
func CheckPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
```

**Security Features:**

- Bcrypt with cost factor 12 (secure against brute force)
- Salted hashing (built into bcrypt)
- Passwords never stored in plain text
- Passwords never logged or included in JSON responses

#### JWT Security

```go
import "github.com/golang-jwt/jwt/v5"

JWT_SECRET=your-secure-secret-key  // Must be strong random string

// Generate token
func GenerateToken(userId Snowflake, role int, duration time.Duration) string {
    claims := jwt.MapClaims{
        "user_id":  userId,
        "role":     role,
        "exp":      time.Now().Add(duration).Unix(),
        "iat":      time.Now().Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    signedToken, _ := token.SignedString([]byte(jwtSecret))
    return signedToken
}

// Validate token
func ValidateToken(tokenString string) (*jwt.Token, error) {
    return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // Verify signing method
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method")
        }
        return []byte(jwtSecret), nil
    })
}
```

**Token Expiration:**

- Access Token: 15 minutes (short-lived)
- Refresh Token: 7 days (stored in database)

#### Session Management

```go
// Session tracking

type Session struct {
    Id           Snowflake
    UserId       Snowflake
    RefreshToken string
    Active       bool
    LoginTime    int64
    LogoutTime   int64
}

// Invalidate session on logout
func Logout(sessionId Snowflake) {
    db.Exec("UPDATE sessions SET active = 0, logout_timestamp = ? WHERE id = ?",
        time.Now().Unix(), sessionId)
}

// Clean expired sessions (cron job)
func CleanExpiredSessions() {
    db.Exec("DELETE FROM sessions WHERE expire_token < ?", time.Now().Unix())
}
```

### 8.2 Authorization

#### Role-Based Access Control (RBAC)

```go
// User roles
const (
    RoleUser  = 1  // Regular user
    RoleAdmin = 2  // Administrator
)

// Admin middleware
func AdminOnly(c *gin.Context) {
    user := c.MustGet("user").(User)

    if user.Role != RoleAdmin {
        c.JSON(403, gin.H{"error": "Admin access required"})
        c.Abort()
        return
    }

    c.Next()
}

// Apply to routes
adminRoutes := router.Group("/api/admin")
adminRoutes.Use(AuthMiddleware, AdminOnly)
{
    adminRoutes.GET("/users", controllers.ListUsers)
    adminRoutes.DELETE("/users/:id", controllers.DeleteUser)
}
```

#### Permission-Based Access Control

```go
// Check permission before node operation

func RequireNodePermission(action NodeAction) gin.HandlerFunc {
    return func(c *gin.Context) {
        nodeId := c.Param("id")
        user := c.MustGet("user").(User)

        // Check if user can perform action
        can := permissions.CanPerform(user.Id, nodeId, action)

        if !can {
            c.JSON(403, gin.H{"error": "Permission denied"})
            c.Abort()
            return
        }

        c.Next()
    }
}

// Apply to routes
router.PATCH("/api/nodes/:id",
    AuthMiddleware,
    RequireNodePermission(ActionUpdate),
    controllers.UpdateNode)
```

### 8.3 Input Validation

#### Backend Validation

```go
// Gin binding validation

type CreateNodeInput struct {
    Name        string  `json:"name" binding:"required,min=1,max=50"`
    Description *string `json:"description" binding:"omitempty,max=250"`
    ParentId    *string `json:"parent_id" binding:"omitempty"`
    Role        int     `json:"role" binding:"required,min=1,max=3"`
}

// Validate in controller
func CreateNode(c *gin.Context) {
    var input CreateNodeInput

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    // Input is valid, proceed...
}
```

**Validation Rules:**

- Required fields checked
- String length limits enforced
- Email format validation
- Integer range validation
- Custom validators for complex rules

#### Frontend Validation

```typescript
// Vue form validation

const validateNodeName = (name: string): boolean => {
  if (!name || name.trim().length === 0) {
    return false;
  }
  if (name.length > 50) {
    return false;
  }
  return true;
};

// Usage in form
const errors = ref<Record<string, string>>({});

const submitForm = () => {
  errors.value = {};

  if (!validateNodeName(form.name)) {
    errors.value.name = 'Name must be 1-50 characters';
    return;
  }

  // Submit if valid
  api.createNode(form);
};
```

### 8.4 XSS Prevention

```go
import "github.com/microcosm-cc/bluemonday"

// HTML sanitization policy
policy := bluemonday.UGCPolicy()

// Sanitize user input before storing
func SanitizeHTML(input string) string {
    return policy.Sanitize(input)
}

// Apply to content
node.Content = SanitizeHTML(userInput)
```

**Frontend XSS Protection:**

```vue
<!-- Vue automatically escapes content -->
<div>{{ userContent }}</div>
<!-- Safe: content escaped -->

<!-- For rendering HTML, use v-html with sanitized content -->
<div v-html="sanitizedHTML"></div>

<!-- Never use v-html with raw user input! -->
```

### 8.5 CORS Configuration

```go
// CORS middleware configuration

router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{os.Getenv("DOMAIN_CLIENT")},
    AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,  // Allow cookies
    MaxAge:           12 * time.Hour,
}))
```

**Production CORS:**

- Only allow specific frontend domain
- No wildcards in production
- Credentials enabled for cookies
- Preflight caching for performance

### 8.6 SQL Injection Prevention

```go
// Always use parameterized queries

// ✅ SAFE: Parameterized query
query := "SELECT * FROM users WHERE email = ?"
db.QueryRow(query, userEmail).Scan(&user)

// ❌ UNSAFE: String concatenation
query := "SELECT * FROM users WHERE email = '" + userEmail + "'"
db.QueryRow(query).Scan(&user)  // Vulnerable to SQL injection!
```

### 8.7 Rate Limiting (Recommended for Production)

```go
// Example rate limiting middleware (not currently implemented)

import "golang.org/x/time/rate"

var limiters = make(map[string]*rate.Limiter)

func RateLimitMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        ip := c.ClientIP()

        limiter, exists := limiters[ip]
        if !exists {
            // 100 requests per minute
            limiter = rate.NewLimiter(rate.Every(time.Minute/100), 100)
            limiters[ip] = limiter
        }

        if !limiter.Allow() {
            c.JSON(429, gin.H{"error": "Rate limit exceeded"})
            c.Abort()
            return
        }

        c.Next()
    }
}
```

### 8.8 HTTPS Enforcement

```go
ALLOW_UNSECURE=false  // Enforce HTTPS

// Middleware to redirect HTTP to HTTPS
func HTTPSRedirect() gin.HandlerFunc {
    return func(c *gin.Context) {
        if c.Request.TLS == nil && !allowUnsecure {
            c.Redirect(301, "https://"+c.Request.Host+c.Request.RequestURI)
            c.Abort()
            return
        }
        c.Next()
    }
}
```

**Production Security Checklist:**

- ✅ HTTPS enforced (TLS 1.2+)
- ✅ HSTS header enabled
- ✅ Secure cookie flags (httpOnly, secure, sameSite)
- ✅ JWT secret is strong random string
- ✅ Database passwords are strong
- ✅ CORS restricted to frontend domain
- ✅ All inputs validated and sanitized
- ✅ SQL injection prevented (parameterized queries)
- ✅ Rate limiting enabled
- ✅ Security headers set (CSP, X-Frame-Options, etc.)

---

## 9. Development Workflow

### 9.1 Prerequisites

**Required Software:**

- [Bun](https://bun.sh/) v1.0+ - Fast JavaScript runtime & package manager
- [Go](https://go.dev/) v1.24+ - Backend language
- [MySQL](https://www.mysql.com/) 8.0+ - Database server
- [Docker](https://www.docker.com/) (optional) - Containerization
- [Git](https://git-scm.com/) - Version control

### 9.2 Local Development Setup

#### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/Smaug6739/Alexandrie.git
cd Alexandrie

# Start all services with hot reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Access points:
# - Frontend: http://localhost:8200
# - Backend: http://localhost:8201
# - MinIO Console: http://localhost:9001
# - MySQL: localhost:3307

# Stop services
docker compose down
```

#### Option 2: Manual Setup

```bash
# 1. Install dependencies

# Backend
cd backend
go mod download

# Frontend
cd frontend
bun install

# 2. Configure environment variables

# Backend: backend/.env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=alexandrie
DATABASE_USER=alexandrie
DATABASE_PASSWORD=password
BACKEND_PORT=8201
FRONTEND_URL=http://localhost:8200
JWT_SECRET=your-secret-key
ALLOW_UNSECURE=true
GIN_MODE=debug

# Frontend: frontend/.env
PORT=8200
NUXT_PUBLIC_BASE_API=http://localhost:8201
NUXT_PUBLIC_BASE_CDN=http://localhost:9000/alexandrie
NUXT_PUBLIC_BASE_URL=http://localhost:8200

# 3. Setup database

# Create MySQL database
mysql -u root -p
CREATE DATABASE alexandrie;
CREATE USER 'alexandrie'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON alexandrie.* TO 'alexandrie'@'localhost';
FLUSH PRIVILEGES;

# 4. Start MinIO (object storage)
minio server ./minio-data --console-address :9001 --address "localhost:9000"

# 5. Start backend
cd backend
go run main.go
# Migrations run automatically

# 6. Start frontend (in new terminal)
cd frontend
bun dev
```

### 9.3 Project Commands

#### Backend Commands

```bash
# Run development server
go run main.go

# Build binary
go build -o alexandrie main.go

# Run tests
go test ./tests/... -v

# Run specific test
go test ./tests/auth_test.go -v

# Format code
go fmt ./...

# Vet code (static analysis)
go vet ./...

# Install new dependency
go get github.com/package/name

# Update dependencies
go get -u ./...
go mod tidy
```

#### Frontend Commands

```bash
# Development server (with HMR)
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint

# Fix linting issues
bun run lint:fix

# Lint CSS
bun run lint:css

# Fix CSS issues
bun run lint:css:fix

# Install dependency
bun add package-name

# Install dev dependency
bun add -d package-name

# Update dependencies
bun update
```

#### Makefile Commands (Linux)

```bash
# Start all services
make all

# Start backend only
make backend

# Start frontend only
make frontend

# Start MinIO only
make minio

# Stop all services
make stop
```

### 9.4 Database Migrations

#### Creating a Migration

```bash
# Install migrate CLI
go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Create new migration
cd backend/migrations
migrate create -ext sql -dir . -seq migration_name

# This creates:
# - 000012_migration_name.up.sql
# - 000012_migration_name.down.sql
```

_Note: This tool is optional you can create manually the file but please follow the naming conventions_

#### Writing Migrations

```sql
-- 000012_add_feature.up.sql
ALTER TABLE nodes ADD COLUMN new_field VARCHAR(100);
CREATE INDEX idx_new_field ON nodes(new_field);

-- 000012_add_feature.down.sql
DROP INDEX idx_new_field ON nodes;
ALTER TABLE nodes DROP COLUMN new_field;
```

#### Running Migrations

```bash
# Migrations run automatically on app start
# Or run manually:

# Apply all migrations
migrate -database "mysql://user:pass@tcp(localhost:3306)/alexandrie" -path migrations up

# Rollback last migration
migrate -database "..." -path migrations down 1

# Goto specific version
migrate -database "..." -path migrations goto 10

# Check current version
migrate -database "..." -path migrations version
```

> [!WARNING]
> Migrations down are not fully implemented yet

### 9.5 Code Quality

#### Linting

```bash
# Backend
go vet ./...
golangci-lint run  # If installed

# Frontend
bun run lint        # ESLint
bun run lint:css    # Stylelint
```

#### Formatting

```bash
# Backend
go fmt ./...

# Frontend (automatic with ESLint)
bun run lint:fix        # ESLint fix
bun run lint:css:fix    # Stylelint fix
```

### 9.6 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub

# After merge, update main
git checkout main
git pull origin main
```

**Commit Message Convention:**

```
feat: Add new feature
fix: Fix bug in authentication
docs: Update README
style: Format code
refactor: Refactor node service
test: Add tests for permissions
chore: Update dependencies
```

### 9.7 Debugging

#### Backend Debugging

```go
// Add debug logging
import "log"

log.Println("Debug:", variable)
log.Printf("User ID: %s", userId)

// Use Delve debugger
go install github.com/go-delve/delve/cmd/dlv@latest

# Start with debugger
dlv debug main.go

# Set breakpoint
(dlv) break main.main
(dlv) continue
```

#### Frontend Debugging

```typescript
// Console logging
console.log('Debug:', data);
console.table(array);

// Vue DevTools (browser extension)
// Inspect component state, Pinia stores, routing

// Network tab (browser)
// Inspect API calls, responses, timing
```

#### Database Debugging

```bash
# Connect to MySQL
mysql -u alexandrie -p alexandrie

# Check tables
SHOW TABLES;

# Inspect data
SELECT * FROM users LIMIT 10;
SELECT * FROM nodes WHERE user_id = '123';

# Check indexes
SHOW INDEX FROM nodes;

# Explain query performance
EXPLAIN SELECT * FROM nodes WHERE name LIKE '%search%';
```

### 9.9 Performance Monitoring

#### Backend Profiling

```go
import _ "net/http/pprof"

// Enable profiling endpoint
go func() {
    log.Println(http.ListenAndServe("localhost:6060", nil))
}()

// Access profiles:
// http://localhost:6060/debug/pprof/
// CPU: /debug/pprof/profile?seconds=30
// Memory: /debug/pprof/heap
// Goroutines: /debug/pprof/goroutine
```

#### Frontend Performance

```typescript
// Performance API
const perfData = performance.getEntriesByType('navigation')[0];
console.log('Load time:', perfData.loadEventEnd - perfData.fetchStart);

// Lighthouse (Chrome DevTools)
// Run audit for performance, accessibility, SEO

// Vue DevTools Performance tab
// Track component render time
```

---

## 10. Configuration Reference

### 10.1 Setup application

For details please see [setup guide.md](./setup.md)

### 10.2 Performance Tuning

#### Caching Strategy

```go
// Example: Redis caching (not currently implemented)

import "github.com/go-redis/redis/v8"

// Cache frequently accessed nodes
func GetNodeWithCache(nodeId Snowflake) (*Node, error) {
    // Try cache first
    cached, err := redis.Get(ctx, "node:"+nodeId).Result()
    if err == nil {
        return unmarshalNode(cached), nil
    }

    // Cache miss, query database
    node := getNodeFromDB(nodeId)

    // Store in cache (expire in 5 minutes)
    redis.Set(ctx, "node:"+nodeId, marshal(node), 5*time.Minute)

    return node, nil
}
```

## Other

### A. Glossary

- **Node**: Unified entity representing workspace, category, document or resource
- **Snowflake**: Distributed unique ID generation algorithm (inspired from https://discord.com/developers/docs/reference#snowflakes)
- **Permission Level**: Numeric access level (0-4) determining user capabilities
- **S3**: Simple Storage Service, object storage protocol
- **JWT**: JSON Web Token, stateless authentication mechanism
- **CORS**: Cross-Origin Resource Sharing, browser security feature
- **PWA**: Progressive Web App, installable web application
- **SSR**: Server-Side Rendering
- **SPA**: Single-Page Application
- **ORM**: Object-Relational Mapping

### B. Common Issues and Solutions

#### Backend won't start

```bash
# Check MySQL connection
mysql -u alexandrie -p

# Check port availability
lsof -i :8201

# Check environment variables
go run main.go  # Look for error messages

# Reset database
DROP DATABASE alexandrie;
CREATE DATABASE alexandrie;
# Restart backend (migrations will recreate tables)
```

#### Frontend build errors

```bash
# Clear cache
rm -rf .nuxt node_modules bun.lock
bun install
bun dev

# Check Node version
node --version  # Should be 18+

# Check environment variables
cat .env
```

### C. External Resources

- **Go Documentation**: https://go.dev/doc/
- **Gin Framework**: https://gin-gonic.com/docs/
- **Nuxt Documentation**: https://nuxt.com/docs
- **Vue.js Guide**: https://vuejs.org/guide/
- **MySQL Reference**: https://dev.mysql.com/doc/
- **MinIO Documentation**: https://min.io/docs/
- **JWT.io**: https://jwt.io/
- **CodeMirror**: https://codemirror.net/

### D. Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development setup and contribution guidelines.

### E. License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-13

For questions or clarifications, please open an issue on GitHub or join our Discord community.

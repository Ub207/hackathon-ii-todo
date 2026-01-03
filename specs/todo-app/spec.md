# Feature Specification: Full-Stack Todo Application

**Feature Branch**: `feature/full-stack-todo`
**Created**: 2026-01-01
**Status**: Draft
**Input**: Hackathon II Phase 2 - Convert CLI Todo to Full Stack Web App

## System Overview

The Full-Stack Todo Application is a web-based task management system that transforms a CLI-based todo application into a modern, production-ready web application. The system consists of three primary layers:

1. **Frontend Layer** (Next.js): Provides a responsive, interactive user interface for viewing, creating, editing, and deleting tasks
2. **Backend Layer** (FastAPI): Exposes a RESTful API for task management with validation, error handling, and authentication-ready architecture
3. **Data Layer** (NeonDB/PostgreSQL): Provides persistent storage for users and tasks with proper schema, constraints, and relationships

**Architecture Pattern**: Three-tier architecture with clear separation of concerns. Each layer communicates through well-defined interfaces (API contracts), allowing independent development and testing of each component.

**User Flow**:
1. User opens application → Frontend loads and fetches tasks from API
2. User creates/edits/deletes tasks → Frontend sends requests to API
3. API validates and processes requests → Backend queries database
4. Database persists changes → NeonDB stores/retrieves data
5. Frontend updates UI → Real-time reflection of changes

## Tech Stack Justification

### Backend: FastAPI

**Why FastAPI?**
- **Modern & Fast**: Built on ASGI, supports async operations, significantly faster than Flask/Django
- **Auto Documentation**: OpenAPI/Swagger documentation generated automatically at `/docs`
- **Type Safety**: Native support for Pydantic validation schemas
- **Easy to Learn**: Python-based with excellent documentation and community support
- **Production Ready**: Battle-tested in production environments, battle-tested by major companies

**Alternative Considered**: Django REST Framework, Flask-RESTful
**Decision**: FastAPI chosen for modern features, automatic API docs, and better performance

### Database: NeonDB (PostgreSQL)

**Why NeonDB?**
- **Serverless**: No server management, automatic scaling, pay-per-use pricing
- **PostgreSQL Power**: Full PostgreSQL 15+ feature set with advanced querying capabilities
- **Ease of Setup**: Connection string-based setup, no infrastructure configuration needed
- **Developer Friendly**: Built for modern development workflows, supports branching
- **Cost Effective**: Free tier sufficient for hackathon/demo projects

**Alternative Considered**: Self-hosted PostgreSQL, MongoDB, SQLite
**Decision**: NeonDB chosen for serverless convenience and PostgreSQL power

### Frontend: Next.js

**Why Next.js?**
- **App Router**: Modern file-based routing with built-in layout and nested routes
- **Server Components**: SSR/SSG for better performance and SEO
- **TypeScript First**: Built-in TypeScript support with strict mode
- **Zero Config**: Minimal setup required, includes bundler, transpiler, dev server
- **Ecosystem**: Largest React ecosystem with extensive libraries and community support

**Alternative Considered**: React (CRA), Vue, Svelte
**Decision**: Next.js chosen for modern features, performance, and ecosystem

### Styling: Tailwind CSS

**Why Tailwind CSS?**
- **Utility-First**: Fast development with pre-built utility classes
- **Small Bundle Size**: Only includes used styles, optimized production build
- **Responsive Built-in**: Mobile-first responsive design with breakpoint classes
- **No CSS File**: No switching between CSS files and component files
- **Customizable**: Easy to extend with custom config and themes

**Alternative Considered**: CSS Modules, Styled Components, Emotion
**Decision**: Tailwind CSS chosen for speed, consistency, and maintainability

## Backend Architecture

### Structure

```
backend/
├── main.py              # Application entry point, CORS config, route registration
├── db.py                # Database connection, session dependency
├── models.py             # SQLModel database models (User, Task)
├── schemas.py            # Pydantic validation schemas
├── routes.py             # API route handlers
└── requirements.txt      # Python dependencies
```

### Component Breakdown

#### main.py
- **Purpose**: FastAPI application entry point and configuration
- **Responsibilities**:
  - Create FastAPI app instance
  - Configure CORS middleware for frontend access
  - Register API routes
  - Define startup/shutdown events
  - Provide health check endpoint
- **Key Configuration**:
  - CORS origins: `http://localhost:3000` (Next.js)
  - API prefix: `/api/v1`
  - Auto docs: `/docs` (Swagger UI), `/redoc`

#### db.py
- **Purpose**: Database connection and session management
- **Responsibilities**:
  - Create SQLAlchemy engine with NeonDB connection
  - Provide database session dependency for routes
  - Initialize database tables on startup
  - Configure connection pooling (pool_size=10, max_overflow=20)
- **Configuration**:
  - `DATABASE_URL`: Environment variable for NeonDB connection
  - Engine: PostgreSQL with `pool_pre_ping=True`

#### models.py
- **Purpose**: SQLModel database models
- **Responsibilities**:
  - Define User model (id, email, username, full_name, created_at)
  - Define Task model (id, title, description, status, priority, due_date, user_id, created_at, updated_at)
  - Define enums: TaskStatus (pending, in_progress, completed), TaskPriority (low, medium, high)
  - Define relationships: User → Tasks (one-to-many)
- **Schema Design**:
  - Foreign key: `tasks.user_id REFERENCES users.id`
  - Indexes: `user_id`, `title`, `status`, `priority`
  - Defaults: status="pending", priority="medium"

#### schemas.py
- **Purpose**: Pydantic validation schemas
- **Responsibilities**:
  - UserBase, UserCreate, User: User-related schemas
  - TaskBase, TaskCreate, TaskUpdate, Task: Task-related schemas
  - TaskListResponse: Paginated list response
  - ErrorResponse: Standardized error response
- **Validation Rules**:
  - Title: 1-200 characters
  - Description: 0-2000 characters
  - Status: pending, in_progress, completed
  - Priority: low, medium, high
  - Due date: Future dates only

#### routes.py
- **Purpose**: API route implementations
- **Responsibilities**:
  - Handle HTTP requests
  - Validate inputs using Pydantic schemas
  - Execute database operations
  - Return appropriate HTTP status codes
  - Handle errors and exceptions
- **Endpoints**:
  - `GET /api/v1/tasks`: List tasks with filtering and pagination
  - `GET /api/v1/tasks/{id}`: Get specific task
  - `POST /api/v1/tasks`: Create task
  - `PUT /api/v1/tasks/{id}`: Update task
  - `DELETE /api/v1/tasks/{id}`: Delete task
  - `PATCH /api/v1/tasks/{id}/status`: Quick status update

### Data Flow

**Create Task Flow**:
1. Frontend → POST `/api/v1/tasks` with task data
2. FastAPI → Validates with Pydantic schema
3. FastAPI → Creates SQLModel Task instance
4. FastAPI → Commits to database via session
5. FastAPI → Returns Task response (201 Created)
6. Frontend → Updates UI with new task

**Read Tasks Flow**:
1. Frontend → GET `/api/v1/tasks?user_id=1`
2. FastAPI → Queries database with filters (status, priority, search)
3. FastAPI → Applies pagination (limit=20, offset)
4. FastAPI → Returns TaskListResponse (200 OK)
5. Frontend → Displays tasks with loading/error states

## Frontend Architecture

### Structure

```
frontend/
├── app/                   # Next.js App Router
│   ├── page.tsx         # Home page (task management)
│   ├── layout.tsx        # Root layout
│   └── globals.css        # Global styles, Tailwind imports
├── components/            # React components
│   ├── TaskList.tsx      # Task list display
│   └── TaskForm.tsx      # Create/edit form
└── services/              # API service layer
    └── api.ts           # API client functions
```

### Component Breakdown

#### app/page.tsx
- **Purpose**: Main application page and state container
- **Responsibilities**:
  - Manage all task state (tasks, loading, form visibility, editing task)
  - Fetch tasks on component mount
  - Handle create, update, delete operations
  - Coordinate between TaskList and TaskForm
- **State Management**:
  - `tasks`: Array of Task objects
  - `loading`: Boolean for loading state
  - `showForm`: Boolean for form visibility
  - `editingTask`: Task object or null for edit mode

#### components/TaskList.tsx
- **Purpose**: Display tasks with actions
- **Responsibilities**:
  - Render task items with metadata
  - Display status badges (pending=gray, in_progress=blue, completed=green)
  - Show priority indicators (low=green, medium=yellow, high=red)
  - Provide edit and delete action buttons
  - Show empty state when no tasks exist
- **Props**:
  - `tasks`: Array of Task objects
  - `onEdit(task)`: Callback for edit action
  - `onDelete(taskId)`: Callback for delete action

#### components/TaskForm.tsx
- **Purpose**: Create/edit task form with validation
- **Responsibilities**:
  - Display form fields (title, description, status, priority, due_date)
  - Validate inputs (client-side)
  - Handle form submission with loading state
  - Show errors and success messages
  - Support both create and edit modes
- **Props**:
  - `task`: Task object for edit mode (null for create)
  - `onSubmit(data)`: Form submission handler
  - `onCancel()`: Cancel handler (optional)

#### services/api.ts
- **Purpose**: API service layer with typed functions
- **Responsibilities**:
  - Provide TypeScript interfaces for API types
  - Handle HTTP requests (fetch with error handling)
  - Format request URLs and parameters
  - Parse JSON responses
  - Throw errors with descriptive messages
- **Functions**:
  - `fetchTasks(userId, filters?)`: Get task list
  - `fetchTask(taskId, userId)`: Get single task
  - `createTask(taskData)`: Create new task
  - `updateTask(taskId, taskData)`: Update task
  - `deleteTask(taskId)`: Delete task
  - `updateTaskStatus(taskId, status)`: Quick status update

#### app/layout.tsx
- **Purpose**: Root layout component
- **Responsibilities**:
  - Provide HTML structure
  - Set page metadata (title, description)
  - Load Inter font for typography
  - Apply language attribute for accessibility

#### app/globals.css
- **Purpose**: Global styles and Tailwind setup
- **Responsibilities**:
  - Import Tailwind directives (@tailwind base, @tailwind components, @tailwind utilities)
  - Set CSS variables for theming
  - Apply base styles

### State Management Strategy

**Local State (React hooks)**:
- Use `useState` for component-level state
- Use `useEffect` for data fetching on mount
- Props drilling for parent-child communication
- No global state management needed for current scope

**Data Flow**:
- Parent (`page.tsx`) holds task data
- Child components receive data via props
- Child components trigger actions via callbacks
- Parent updates state and re-renders children

### UI/UX Flow

1. **Initial Load**:
   - User opens app at `/`
   - `page.tsx` renders with `loading = true`
   - `useEffect` triggers `loadTasks()`
   - Tasks fetched and displayed
   - Loading indicator hidden

2. **Create Task**:
   - User clicks "Create New Task" button
   - `showForm` becomes `true`
   - `TaskForm` component renders in create mode
   - User fills form and submits
   - `handleCreateTask()` called
   - Loading state shown during API call
   - On success: tasks reloaded, form closes

3. **Edit Task**:
   - User clicks edit button on task
   - `editingTask` set to task object
   - `TaskForm` renders in edit mode (pre-populated)
   - User modifies and submits
   - Loading state shown
   - On success: tasks reloaded, form closes

4. **Delete Task**:
   - User clicks delete button
   - Browser confirmation dialog shows
   - If confirmed: `handleDeleteTask()` called
   - On success: tasks reloaded

## Database ERD

### Entity Relationship Diagram

```
┌─────────────────────┐
│      USERS         │
├─────────────────────┤
│ PK  id           │
│     email (UNIQUE)│
│     username       │
│     full_name     │
│     created_at     │
└─────────┬─────────┘
          │
          │ 1:N
          │
          ▼
┌─────────────────────┐
│      TASKS         │
├─────────────────────┤
│ PK  id           │
│     title (INDEXED)│
│     description    │
│     status        │
│     priority      │
│     due_date      │
│     user_id (FK)   │
│     created_at     │
│     updated_at     │
└─────────────────────┘
```

### Table Schemas

#### USERS Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing user ID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| username | VARCHAR(100) | NOT NULL, INDEXED | Username |
| full_name | VARCHAR(255) | NULLABLE | User's full name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation time |

#### TASKS Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing task ID |
| title | VARCHAR(200) | NOT NULL, INDEXED | Task title (1-200 chars) |
| description | TEXT | NULLABLE | Task description (0-2000 chars) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Task status (pending, in_progress, completed) |
| priority | VARCHAR(10) | NOT NULL, DEFAULT 'medium' | Task priority (low, medium, high) |
| due_date | TIMESTAMP | NULLABLE | Optional due date (future dates only) |
| user_id | INTEGER | NOT NULL, FK → users.id | Owner of task |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| idx_tasks_user_id | user_id | Fast user task lookups |
| idx_tasks_title | title | Search by title |
| idx_tasks_status | status | Filter by status |
| idx_tasks_priority | priority | Filter by priority |

### Relationships

**User → Tasks** (One-to-Many)
- One user can have multiple tasks
- Each task belongs to exactly one user
- Foreign key constraint: `tasks.user_id REFERENCES users.id`
- Cascade behavior: ON DELETE RESTRICT (prevent orphaned tasks)

## API Contract

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

**Current**: No authentication (placeholder `user_id=1` in query params)
**Future**: Bearer token in `Authorization: Bearer <token>` header

### Content Type

```
Content-Type: application/json
```

### Endpoints

#### 1. Get Tasks

**Endpoint**: `GET /tasks`

**Description**: Retrieve all tasks for a user with optional filtering and pagination.

**Query Parameters**:
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| user_id | integer | Yes | Filter by user ID | - |
| status | string | No | Filter by status (pending, in_progress, completed) | - |
| priority | string | No | Filter by priority (low, medium, high) | - |
| search | string | No | Search in title/description | - |
| page | integer | No | Page number | 1 |
| limit | integer | No | Items per page | 20 |

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write README and API docs",
      "status": "pending",
      "priority": "high",
      "due_date": "2026-01-15T00:00:00Z",
      "user_id": 1,
      "created_at": "2026-01-01T10:00:00Z",
      "updated_at": "2026-01-01T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

#### 2. Get Task

**Endpoint**: `GET /tasks/{task_id}`

**Description**: Retrieve a specific task by ID.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task_id | integer | Yes | Task ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID for ownership check |

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "status": "pending",
  "priority": "high",
  "due_date": "2026-01-15T00:00:00Z",
  "user_id": 1,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-01T10:00:00Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "detail": "Task not found",
  "error_code": "NOT_FOUND"
}
```

#### 3. Create Task

**Endpoint**: `POST /tasks`

**Description**: Create a new task.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID creating the task |

**Request Body**:
```json
{
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "status": "pending",
  "priority": "high",
  "due_date": "2026-01-15T00:00:00Z"
}
```

**Response** (201 Created):
```json
{
  "id": 123,
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "status": "pending",
  "priority": "high",
  "due_date": "2026-01-15T00:00:00Z",
  "user_id": 1,
  "created_at": "2026-01-01T12:30:00Z",
  "updated_at": "2026-01-01T12:30:00Z"
}
```

**Error Response** (422 Validation Error):
```json
{
  "detail": "Title cannot be empty",
  "error_code": "VALIDATION_ERROR",
  "field": "title"
}
```

#### 4. Update Task

**Endpoint**: `PUT /tasks/{task_id}`

**Description**: Update an existing task (partial update supported).

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task_id | integer | Yes | Task ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID for ownership check |

**Request Body** (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "due_date": "2026-01-20T00:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "due_date": "2026-01-20T00:00:00Z",
  "user_id": 1,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-01T14:30:00Z"
}
```

#### 5. Delete Task

**Endpoint**: `DELETE /tasks/{task_id}`

**Description**: Delete a task permanently.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task_id | integer | Yes | Task ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID for ownership check |

**Request Body**: None

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response** (404 Not Found):
```json
{
  "detail": "Task not found",
  "error_code": "NOT_FOUND"
}
```

**Error Response** (403 Forbidden):
```json
{
  "detail": "Permission denied",
  "error_code": "FORBIDDEN"
}
```

#### 6. Update Task Status

**Endpoint**: `PATCH /tasks/{task_id}/status`

**Description**: Quick update for task status only.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| task_id | integer | Yes | Task ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID for ownership check |

**Request Body**:
```json
{
  "new_status": "completed"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "status": "completed",
  "priority": "high",
  "updated_at": "2026-01-01T15:00:00Z"
}
```

### Error Response Schema

All error responses follow this format:

```json
{
  "detail": "Human-readable error message",
  "error_code": "ERROR_CODE",
  "field": "field_name"
}
```

**Common Error Codes**:
| Error Code | Description |
|------------|-------------|
| VALIDATION_ERROR | Invalid input data |
| NOT_FOUND | Resource not found |
| FORBIDDEN | Permission denied |
| INTERNAL_ERROR | Server error |

## Success Criteria

### Backend Success Criteria

- [ ] FastAPI application runs without errors on port 8000
- [ ] All 6 API endpoints are functional and documented
- [ ] Database models (User, Task) are created in NeonDB
- [ ] CRUD operations persist data correctly
- [ ] Input validation rejects invalid data
- [ ] Error handling covers all failure scenarios
- [ ] Swagger UI accessible at `/docs` with all endpoints documented
- [ ] CORS allows frontend at `localhost:3000` to access API
- [ ] Database connection pool configured properly
- [ ] Health check endpoint responds correctly

### Frontend Success Criteria

- [ ] Next.js application runs without errors on port 3000
- [ ] Task list displays all tasks with metadata
- [ ] Create task form works with validation
- [ ] Edit task form pre-populates and updates correctly
- [ ] Delete task removes task with confirmation
- [ ] Mark completed button changes status
- [ ] Loading states show during async operations
- [ ] Error messages display for failures
- [ ] Empty state shows when no tasks exist
- [ ] UI is responsive on mobile, tablet, and desktop

### Database Success Criteria

- [ ] NeonDB connection is established
- [ ] User and Task tables exist with correct schema
- [ ] Foreign key constraints enforce relationships
- [ ] Indexes are created for performance
- [ ] Data persists across application restarts
- [ ] Transactions commit/rollback correctly
- [ ] Queries execute within 500ms for standard operations

### Integration Success Criteria

- [ ] Frontend successfully communicates with backend API
- [ ] API calls return correct data in JSON format
- [ ] Real-time updates reflect in UI after operations
- [ ] Error handling works end-to-end
- [ ] CORS issues are resolved
- [ ] Environment variables are properly configured

### User Experience Success Criteria

- [ ] Users can create a task in under 10 seconds
- [ ] Task list loads within 1 second
- [ ] All CRUD operations complete within 2 seconds
- [ ] 100% of tasks are successfully stored and retrievable
- [ ] 95% of validation errors are caught client-side
- [ ] UI renders correctly on all target devices
- [ ] Zero unhandled exceptions in console or logs

### Quality Success Criteria

- [ ] Code follows clean architecture principles
- [ ] Separation of concerns maintained across layers
- [ ] Type safety achieved with TypeScript and SQLModel
- [ ] Consistent naming conventions used throughout
- [ ] Code is well-documented with comments
- [ ] File structure is logical and organized
- [ ] No hardcoded secrets or credentials
- [ ] Security best practices followed (input validation, SQL injection prevention)

---

**Specification Complete**: This specification provides all necessary details for building a production-ready full-stack Todo application following Hackathon II Phase 2 requirements.

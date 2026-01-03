# Full-Stack Todo Application

Complete full-stack todo application with Next.js (frontend) and FastAPI (backend).

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - ORM for database operations
- **PostgreSQL/Neon** - Database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
copy .env.example .env
# Edit .env and set your DATABASE_URL

# Run server
python main.py
```

API available at: http://localhost:8000
API Docs: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
copy .env.local.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL if needed

# Run dev server
npm run dev
```

App available at: http://localhost:3000

## Project Structure

```
phase-2/
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── db.py             # Database connection
│   ├── models.py         # SQLModel database models
│   ├── schemas.py        # Pydantic validation schemas
│   ├── routes.py         # API routes
│   ├── requirements.txt  # Python dependencies
│   ├── .gitignore
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx      # Home page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/
│   │   ├── TaskList.tsx  # Task list component
│   │   └── TaskForm.tsx  # Task form component
│   ├── services/
│   │   ├── api.ts        # API service functions
│   │   └── types/task.ts # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── .gitignore
│   └── .env.local.example
└── README.md
```

## API Endpoints

### Tasks

- `GET /api/v1/tasks` - Get all tasks for a user
- `GET /api/v1/tasks/{id}` - Get specific task
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `PATCH /api/v1/tasks/{id}/status` - Update task status

### Query Parameters

- `user_id` (required) - User ID for ownership
- `status` (optional) - Filter by status (pending, in_progress, completed)
- `priority` (optional) - Filter by priority (low, medium, high)
- `search` (optional) - Search in title/description
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

## Features

- ✅ Create, read, update, delete tasks
- ✅ Filter by status and priority
- ✅ Search tasks
- ✅ Pagination
- ✅ Responsive UI with Tailwind CSS
- ✅ Type-safe with TypeScript and SQLModel

## Database Models

### User
- id, email, username, full_name, created_at

### Task
- id, title, description, status, priority, due_date, user_id, created_at, updated_at

## Task Status
- `pending` - Task not started
- `in_progress` - Task in progress
- `completed` - Task finished

## Task Priority
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority

## Development

### Backend

```bash
# Run with auto-reload
python main.py

# Run without auto-reload (production)
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@host:port/database
DEBUG=false
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## License

MIT

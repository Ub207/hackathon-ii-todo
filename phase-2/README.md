# Full Stack TODO App

A modern, beautiful full-stack todo application built with Next.js (React), FastAPI (Python), and PostgreSQL (NeonDB).

## 🎯 Features

- ✅ Create, Read, Update, and Delete tasks
- 📋 Task status management (Pending, In Progress, Completed)
- 🔥 Priority levels (Low, Medium, High)
- 📅 Due date tracking with overdue indicators
- 🎨 Modern glassmorphism UI design
- 🔔 Success/error notifications
- 📱 Responsive design
- 🚀 Fast API with proper CORS and validation
- 💾 PostgreSQL database with NeonDB

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **ORM**: SQLModel
- **Database**: PostgreSQL (NeonDB)

## 🚀 Quick Start

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn
- A NeonDB account (free tier available at [neon.tech](https://neon.tech))

### Backend Setup

```bash
cd phase-2/backend

# Install Python dependencies
pip install fastapi uvicorn sqlmodel python-dotenv psycopg2-binary

# Set up environment variables
# Copy the example env file (on Windows use: copy .env.example .env)
cp .env.example .env

# Update .env with your NeonDB credentials:
# DATABASE_URL=postgresql://your-username:your-password@your-host/neondb?sslmode=require

# Run the backend server
python main.py
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Frontend Setup

```bash
cd phase-2/frontend

# Install Node dependencies
npm install

# .env.local is already created with:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run the development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
phase-2/
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── db.py             # Database connection with user initialization
│   ├── models.py         # SQLModel database models
│   ├── schemas.py        # Pydantic validation schemas
│   ├── routes.py         # API routes for CRUD operations
│   ├── .env              # Backend environment variables
│   └── .env.example      # Example configuration
├── frontend/
│   ├── app/
│   │   ├── page.tsx      # Main page with state management
│   │   └── layout.tsx    # App layout
│   ├── components/
│   │   ├── TaskList.tsx  # Task list with glassmorphism UI
│   │   └── TaskForm.tsx  # Task form with validation
│   ├── services/
│   │   └── api.ts        # API service functions
│   ├── types/
│   │   └── task.ts       # TypeScript types
│   ├── .env.local        # Frontend environment variables (created)
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🧪 Testing

### Manual Testing Steps

1. **Create a Task:**
   - Click "Create New Task" button
   - Fill in the form with title, description, status, priority, due date
   - Click "Create Task"
   - ✅ Verify: Task appears in the list with success notification

2. **Fetch Tasks:**
   - Refresh the page
   - ✅ Verify: All tasks load correctly

3. **Edit a Task:**
   - Click the edit icon (pencil) on a task
   - Modify the title or status
   - Click "Update Task"
   - ✅ Verify: Task updates with success notification

4. **Delete a Task:**
   - Click the delete icon (trash) on a task
   - Confirm deletion
   - ✅ Verify: Task is removed with success notification

5. **Priority Colors:**
   - ✅ High priority shows red
   - ✅ Medium priority shows yellow
   - ✅ Low priority shows green

6. **Status Badges:**
   - ✅ Pending shows gray
   - ✅ In Progress shows blue
   - ✅ Completed shows green

7. **Due Dates:**
   - ✅ Date displays in readable format (e.g., "Jan 15, 2026")
   - ✅ Overdue tasks show red highlight with "(Overdue)" text
   - ✅ Completed tasks don't show overdue warning

8. **Error Handling:**
   - Try to create a task without a title
   - ✅ Verify: Button is disabled
   - Try to submit with network disabled
   - ✅ Verify: Error notification appears

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/tasks?user_id=1` | Get all tasks |
| GET | `/api/v1/tasks/{id}?user_id=1` | Get specific task |
| POST | `/api/v1/tasks?user_id=1` | Create new task |
| PUT | `/api/v1/tasks/{id}?user_id=1` | Update task |
| DELETE | `/api/v1/tasks/{id}?user_id=1` | Delete task |
| PATCH | `/api/v1/tasks/{id}/status?user_id=1` | Update status |

### Query Parameters

- `user_id` (required) - User ID for ownership
- `status` (optional) - Filter by status (pending, in_progress, completed)
- `priority` (optional) - Filter by priority (low, medium, high)
- `search` (optional) - Search in title/description
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

## 🐛 Troubleshooting

### "Failed to fetch" Error

1. **Check if backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Verify API URL in frontend:**
   - Check `frontend/.env.local`
   - Ensure `NEXT_PUBLIC_API_URL=http://localhost:8000`

3. **Check CORS settings:**
   - Verify `CORS_ORIGINS=http://localhost:3000` in `backend/.env`

### Database Connection Error

1. **Verify DATABASE_URL is correct:**
   - Check `backend/.env`
   - Ensure credentials are accurate

2. **Test database connection:**
   ```bash
   cd backend
   python -c "from db import engine; print(engine)"
   ```

3. **Check if NeonDB is active:**
   - Log in to [neon.tech](https://neon.tech)
   - Verify your project is not suspended

### Port Already in Use

1. **Check what's using the port:**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   # or
   netstat -ano | findstr :3000

   # Mac/Linux
   lsof -i :8000
   # or
   lsof -i :3000
   ```

2. **Kill the process or use different ports:**
   - Backend: Change port in `backend/main.py` (line 63)
   - Frontend: Change port with `npm run dev -- -p 3001`

## 📝 What Was Fixed

### Backend Issues Fixed
- ✅ Added `ensure_default_user()` function to create a default user (ID=1)
- ✅ Fixed import statements for database modules
- ✅ Proper CORS configuration for localhost:3000
- ✅ Health check endpoint added
- ✅ Proper error handling with HTTP status codes

### Frontend Issues Fixed
- ✅ Created `.env.local` with correct API URL
- ✅ Added comprehensive error handling and user notifications
- ✅ Fixed form submission and state management
- ✅ Added loading and disabled states
- ✅ Auto-refresh task list after CRUD operations

### UI/UX Improvements
- ✅ Modern glassmorphism design with gradient backgrounds
- ✅ Backdrop blur effects on cards
- ✅ Smooth hover animations and transitions
- ✅ Gradient buttons with hover effects
- ✅ Fixed edit and delete icons (SVG icons instead of emojis)
- ✅ Proper due date display with overdue indicators
- ✅ Priority badges with color coding
- ✅ Status badges with proper labels
- ✅ Responsive design for mobile and desktop
- ✅ Empty state with friendly message
- ✅ Toast notifications for success/error feedback
- ✅ Form validation (title required)
- ✅ Loading states during async operations

## 🎨 UI Features

### Modern Glassmorphism Design
- Semi-transparent cards with backdrop blur
- Gradient backgrounds (blue to purple)
- Subtle shadows and borders
- Smooth transitions and hover effects

### Task Card UI
- **Title**: Bold, strikethrough when completed
- **Status Badge**: Color-coded pill badge
- **Priority**: Labeled badge (High/Medium/Low) with color
- **Due Date**: Calendar icon with formatted date
- **Overdue Indicator**: Red highlight for overdue tasks
- **Created Date**: Displayed for reference
- **Edit Button**: Pen icon with hover effect
- **Delete Button**: Trash icon with hover effect

### Color Scheme
- High Priority: Red
- Medium Priority: Yellow
- Low Priority: Green
- Completed Status: Green
- In Progress: Blue
- Pending: Gray
- Gradient: Blue → Purple

## 📦 Database Models

### User
- id, email, username, full_name, created_at

### Task
- id, title, description, status, priority, due_date, user_id, created_at, updated_at

## 📋 Task Status
- `pending` - Task not started
- `in_progress` - Task in progress
- `completed` - Task finished

## 🔥 Task Priority
- `low` - Low priority (green)
- `medium` - Medium priority (yellow, default)
- `high` - High priority (red)

## 🚀 Development

### Backend

```bash
# Run with auto-reload
cd phase-2/backend
python main.py

# Run without auto-reload (production)
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
# Development server with hot reload
cd phase-2/frontend
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## 🔑 Environment Variables

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

## 📄 License

MIT

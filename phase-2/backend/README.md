# Todo API

This is a FastAPI backend for a full-stack todo application. It provides a complete REST API for managing tasks with features like:

- Create, read, update, and delete tasks
- Filter tasks by status and priority
- Search functionality
- User-based task organization
- Complete CRUD operations

## API Endpoints

- `GET /api/v1/tasks` - Get all tasks with filtering and pagination
- `GET /api/v1/tasks/{id}` - Get a specific task
- `POST /api/v1/tasks` - Create a new task
- `PUT /api/v1/tasks/{id}` - Update an existing task
- `DELETE /api/v1/tasks/{id}` - Delete a task
- `PATCH /api/v1/tasks/{id}/status` - Update task status
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /health` - Health check endpoint

## Environment Variables

- `DATABASE_URL` - PostgreSQL database connection string (required)

## How to Use

This backend is designed to work with the frontend at https://hackathon-ii-todo-8q63.vercel.app/

The API is accessible at the root URL of this Space when deployed.

## Tech Stack

- FastAPI
- SQLModel
- PostgreSQL
- Uvicorn
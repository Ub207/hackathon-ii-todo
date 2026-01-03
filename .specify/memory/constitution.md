# Hackathon II – Phase 2 Constitution

## Objective
Transform CLI Todo App into Full Stack Web Application using:
- Next.js Frontend
- FastAPI Backend
- NeonDB / PostgreSQL Database

## Core Principles

### I. Clean Architecture
Separation of concerns with clear layer boundaries:
- Frontend (UI/UX) independent of backend
- Backend (API/Logic) independent of database
- Database (Data) with proper abstractions
- Each layer communicates through well-defined interfaces

### II. Scalable Structure
Code organized for growth and maintainability:
- Modular components that can be extended
- Clear file structure separating concerns
- Reusable patterns across the codebase
- Easy to add new features without breaking existing code

### III. Maintainability
Code that is easy to understand and modify:
- Clear, descriptive names for functions, variables, files
- Comprehensive inline documentation for complex logic
- Consistent code style and formatting
- Logical organization of functionality

### IV. Performance + Security
Balance speed and protection:
- Optimized database queries with proper indexes
- Efficient API responses with pagination
- Input validation at all boundaries
- No hardcoded secrets (use .env files)
- SQL injection prevention via ORM (SQLModel)
- CORS configured appropriately

### V. Production Ready Quality
Code that meets real-world standards:
- Proper error handling with user-friendly messages
- Loading states for async operations
- Responsive design for all screen sizes
- Structured, production-ready file organization

### VI. Developer Friendly Code
Easy to work with and extend:
- Clean, readable code
- Clear project structure
- Well-documented APIs
- Type safety (TypeScript + SQLModel)
- Consistent patterns throughout

## Core Functional Requirements

All features must work end-to-end:
1. **Create Task** - Add new tasks to database
2. **Read Task List** - Fetch and display all user's tasks
3. **Update Task** - Modify existing task details
4. **Delete Task** - Remove tasks from database
5. **Mark Task Completed** - Quick status change action
6. **Database Persistent Storage** - All data persists across sessions

## Technical Requirements

### Backend (FastAPI)
- FastAPI framework for REST API
- Pydantic for request/response validation
- SQLModel for database operations
- Structured routing with `/api/v1/` prefix
- CORS configured for frontend access
- Comprehensive error handling

### Database (NeonDB / PostgreSQL)
- PostgreSQL database via Neon
- Proper table schemas with constraints
- Foreign key relationships
- Indexes for query performance
- Migration support for schema changes

### Frontend (Next.js + Tailwind CSS)
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling (optional but recommended)
- Responsive design
- Client-side state management
- API integration with proper error handling

### API Communication (REST JSON)
- RESTful API design
- JSON request/response format
- Proper HTTP status codes
- Clear error messages
- Pagination for large datasets

### Deployment Ready Structure
- Environment variables for configuration
- Production-ready settings
- Docker support (optional)
- Clear deployment documentation

## Non-Functional Requirements

### Clean UI
- Intuitive user interface
- Clear visual hierarchy
- Consistent styling throughout
- Responsive design (mobile, tablet, desktop)
- Smooth user interactions

### Error Handling
- Graceful error messages for users
- API error responses with proper status codes
- Try-catch blocks in all async operations
- Loading states for user feedback
- No unhandled exceptions

### Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- Proper error messages for invalid inputs
- Type checking with TypeScript and Pydantic
- Form validation before submission

### Structured Code
- Clear file organization (phase-2 structure)
- Separation of concerns (models, routes, components, services)
- Consistent naming conventions
- Logical grouping of related code
- Proper imports and exports

## Technology Stack

```
Backend:  FastAPI + SQLModel + PostgreSQL (Neon)
Frontend: Next.js + TypeScript + Tailwind CSS
API:      REST JSON
Database: NeonDB (PostgreSQL)
```

## Project Structure

```
phase-2/
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── db.py             # Database connection & session
│   ├── models.py         # SQLModel database models
│   ├── schemas.py        # Pydantic validation schemas
│   ├── routes.py         # API route handlers
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Home page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── TaskList.tsx  # Task list component
│   │   └── TaskForm.tsx  # Task form component
│   └── services/         # API services
│       └── api.ts        # API client functions
└── README.md
```

## Phase Deliverables

### Backend Deliverables
- ✅ FastAPI application running on port 8000
- ✅ Database models (User, Task)
- ✅ API endpoints (CRUD operations)
- ✅ Input validation with Pydantic
- ✅ Error handling
- ✅ API documentation (Swagger UI at /docs)

### Frontend Deliverables
- ✅ Next.js application running on port 3000
- ✅ Task list display
- ✅ Create/edit task form
- ✅ Delete task functionality
- ✅ Mark task completed
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe with TypeScript

### Database Deliverables
- ✅ NeonDB PostgreSQL connection
- ✅ Persistent data storage
- ✅ Proper schema with constraints
- ✅ Working CRUD operations

### Integration Deliverables
- ✅ Frontend communicates with backend API
- ✅ Real-time data updates
- ✅ End-to-end task management workflow
- ✅ Error handling across all layers

## Development Workflow

1. **Backend First**: Set up FastAPI with database models
2. **API Design**: Define endpoints and schemas
3. **Frontend Build**: Create UI components
4. **Integration**: Connect frontend to backend
5. **Testing**: Verify all features work end-to-end
6. **Polish**: UI improvements, error messages, validation

## Quality Checklist

### Code Quality
- [ ] Code is clean and readable
- [ ] Proper error handling everywhere
- [ ] Input validation on all endpoints
- [ ] Type safety (TypeScript + SQLModel)
- [ ] Consistent naming conventions

### Functionality
- [ ] Create task works
- [ ] Read task list works
- [ ] Update task works
- [ ] Delete task works
- [ ] Mark completed works
- [ ] Data persists in database

### UI/UX
- [ ] Clean, professional UI
- [ ] Responsive on all devices
- [ ] Loading states for async operations
- [ ] Clear error messages
- [ ] Smooth interactions

### Deployment
- [ ] Environment variables configured
- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] Database connection works
- [ ] API documentation available

## Governance

This constitution is the authoritative source for development guidelines.
All code must follow these principles:
- Clean architecture with separation of concerns
- Scalable and maintainable structure
- Performance and security considerations
- Production-ready quality standards

Any deviations must be justified and documented.

**Version**: 2.0.0 | **Project**: Hackathon II - Phase 2 | **Last Updated**: 2026-01-01

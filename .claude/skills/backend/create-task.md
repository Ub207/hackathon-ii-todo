---
name: create-task
description: Create a new task in the database with validation and error handling
inputs:
  - name: title
    type: string
    required: true
    description: Task title (max 200 characters)
  - name: description
    type: string
    required: false
    description: Task description (optional)
  - name: user_id
    type: integer
    required: true
    description: ID of the user creating the task
  - name: priority
    type: string
    required: false
    description: Task priority (low/medium/high)
    default: medium
  - name: due_date
    type: datetime
    required: false
    description: Optional due date for the task
outputs:
  - name: task
    type: object
    description: Created task object with id, title, description, status, created_at, etc.
  - name: success
    type: boolean
    description: True if task was created successfully
  - name: error
    type: object
    description: Error details if creation failed (null if successful)
---

# Skill: Create Task

## Purpose
Create a new task in the database with proper validation, error handling, and database transaction management.

## Implementation Steps

### 1. Input Validation
```python
from pydantic import BaseModel, Field, validator
from datetime import datetime

class CreateTaskRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    user_id: int
    priority: str = Field(default="medium", regex="^(low|medium|high)$")
    due_date: Optional[datetime] = None

    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()

    @validator('due_date')
    def due_date_not_past(cls, v):
        if v and v < datetime.utcnow():
            raise ValueError("Due date cannot be in the past")
        return v
```

### 2. Database Operation
```python
from sqlmodel import Session, select
from datetime import datetime

def create_task(session: Session, task_data: CreateTaskRequest):
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=task_data.user_id,
        priority=task_data.priority,
        due_date=task_data.due_date,
        status="pending",
        created_at=datetime.utcnow()
    )

    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

### 3. API Endpoint
```python
from fastapi import HTTPException, status

@app.post("/api/v1/tasks", response_model=TaskResponse, status_code=201)
def create_task_endpoint(request: CreateTaskRequest, session: Session = Depends(get_session)):
    try:
        # Validate user exists
        user = session.exec(select(User).where(User.id == request.user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Create task
        task = create_task(session, request)

        return task

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task"
        )
```

## Error Handling

| Error | HTTP Status | Message |
|-------|-------------|----------|
| Invalid title (empty/too long) | 422 | Title must be 1-200 characters |
| Invalid priority | 422 | Priority must be low, medium, or high |
| Due date in past | 422 | Due date cannot be in the past |
| User not found | 404 | User with specified ID not found |
| Database error | 500 | Failed to create task |

## Acceptance Criteria

- [ ] Task title is validated for length and content
- [ ] Optional fields (description, due_date) handle None correctly
- [ ] Task is created with default status="pending"
- [ ] Created task includes generated id and created_at timestamp
- [ ] Transaction is committed only on success
- [ ] On error, transaction is rolled back
- [ ] User existence is verified before task creation
- [ ] Response matches TaskResponse schema
- [ ] Error messages are clear and actionable
- [ ] Database constraints are respected

## Dependencies

- `Task` SQLModel model must exist
- `User` SQLModel model must exist
- Database session dependency (`get_session`) must be configured
- `TaskResponse` Pydantic model must be defined

## Related Skills

- `validate-task-data` - validates input before creation
- `get-tasks` - fetch tasks after creation
- `update-task` - modify created task

## Usage Example

```python
# Request
POST /api/v1/tasks
{
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "user_id": 1,
  "priority": "high",
  "due_date": "2026-01-15T00:00:00Z"
}

# Response
{
  "id": 123,
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "user_id": 1,
  "priority": "high",
  "status": "pending",
  "due_date": "2026-01-15T00:00:00Z",
  "created_at": "2026-01-01T12:00:00Z",
  "updated_at": "2026-01-01T12:00:00Z"
}
```

## Performance Considerations

- Use session autocommit=False for transaction safety
- Consider adding index on `user_id` for faster queries
- Batch operations if creating multiple tasks

## Security Considerations

- Sanitize title and description to prevent XSS
- Verify user_id matches authenticated user (authentication layer)
- Use parameterized queries to prevent SQL injection (SQLModel handles this)

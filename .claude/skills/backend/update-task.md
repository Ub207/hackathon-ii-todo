---
name: update-task
description: Update an existing task with validation and ownership verification
inputs:
  - name: task_id
    type: integer
    required: true
    description: ID of the task to update
  - name: title
    type: string
    required: false
    description: New task title
  - name: description
    type: string
    required: false
    description: New task description
  - name: status
    type: string
    required: false
    description: Task status (pending/in_progress/completed)
  - name: priority
    type: string
    required: false
    description: Task priority (low/medium/high)
  - name: due_date
    type: datetime
    required: false
    description: New due date
outputs:
  - name: success
    type: boolean
    description: True if task was updated successfully
  - name: task
    type: object
    description: Updated task object
  - name: error
    type: object
    description: Error details if update failed
---

# Skill: Update Task

## Purpose
Update an existing task with partial field updates, validation, and ownership verification.

## Implementation Steps

### 1. Input Validation
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UpdateTaskRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[str] = Field(None, regex="^(pending|in_progress|completed)$")
    priority: Optional[str] = Field(None, regex="^(low|medium|high)$")
    due_date: Optional[datetime] = None
```

### 2. Database Operation
```python
from sqlmodel import Session, select

def update_task(session: Session, task_id: int, task_data: dict, user_id: int):
    task = session.exec(select(Task).where(Task.id == task_id)).first()

    if not task:
        raise ValueError("Task not found")

    if task.user_id != user_id:
        raise PermissionError("You don't have permission to update this task")

    # Update only provided fields
    for field, value in task_data.items():
        if value is not None:
            setattr(task, field, value)

    task.updated_at = datetime.utcnow()
    session.commit()
    session.refresh(task)
    return task
```

### 3. API Endpoint
```python
from fastapi import HTTPException, status

@app.put("/api/v1/tasks/{task_id}", response_model=TaskResponse)
def update_task_endpoint(
    task_id: int,
    request: UpdateTaskRequest,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    try:
        # Filter out None values for partial update
        update_data = request.dict(exclude_unset=True)

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )

        task = update_task(session, task_id, update_data, user_id)
        return task

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update task"
        )
```

## Acceptance Criteria

- [ ] Task exists before update attempt
- [ ] User has permission to update the task (ownership check)
- [ ] Only provided fields are updated (partial update)
- [ ] updated_at timestamp is automatically set
- [ ] Transaction committed on success, rolled back on error
- [ ] Status changes follow valid transitions
- [ ] Response includes updated task object

## Error Handling

| Error | HTTP Status | Message |
|-------|-------------|----------|
| Task not found | 404 | Task with specified ID not found |
| Permission denied | 403 | You don't have permission to update this task |
| Invalid status | 422 | Status must be pending, in_progress, or completed |
| No fields to update | 400 | At least one field must be provided |
| Database error | 500 | Failed to update task |

## Usage Example

```python
# Request
PUT /api/v1/tasks/123
{
  "status": "completed",
  "priority": "high"
}

# Response
{
  "id": 123,
  "title": "Complete project documentation",
  "status": "completed",
  "priority": "high",
  "updated_at": "2026-01-01T14:30:00Z"
}
```

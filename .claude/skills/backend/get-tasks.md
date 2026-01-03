---
name: get-tasks
description: Fetch all tasks for a user with optional filtering and pagination
inputs:
  - name: user_id
    type: integer
    required: true
    description: ID of the user whose tasks to fetch
  - name: status
    type: string
    required: false
    description: Filter by task status (pending/in_progress/completed)
  - name: priority
    type: string
    required: false
    description: Filter by priority (low/medium/high)
  - name: page
    type: integer
    required: false
    description: Page number for pagination
    default: 1
  - name: limit
    type: integer
    required: false
    description: Number of tasks per page
    default: 20
outputs:
  - name: tasks
    type: array
    description: List of task objects
  - name: total
    type: integer
    description: Total count of tasks matching filters
  - name: page
    type: integer
    description: Current page number
  - name: pages
    type: integer
    description: Total number of pages
---

# Skill: Get Tasks

## Purpose
Fetch tasks for a user with optional filtering by status/priority and pagination support.

## Implementation

```python
from sqlmodel import Session, select, col
from typing import List, Optional

def get_tasks(
    session: Session,
    user_id: int,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):
    query = select(Task).where(Task.user_id == user_id)

    # Apply filters
    if status:
        query = query.where(Task.status == status)
    if priority:
        query = query.where(Task.priority == priority)

    # Get total count
    total = len(session.exec(query).all())

    # Apply pagination
    offset = (page - 1) * limit
    query = query.order_by(Task.created_at.desc()).offset(offset).limit(limit)

    tasks = session.exec(query).all()

    return {
        "tasks": tasks,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }
```

## API Endpoint

```python
@app.get("/api/v1/tasks")
def get_tasks_endpoint(
    user_id: int = Depends(get_current_user_id),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    session: Session = Depends(get_session)
):
    try:
        result = get_tasks(session, user_id, status, priority, page, limit)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch tasks")
```

## Acceptance Criteria

- [ ] Only tasks belonging to user are returned
- [ ] Filters (status, priority) work correctly
- [ ] Pagination respects limit parameter
- [ ] Results are ordered by created_at descending
- [ ] Total count is accurate
- [ ] Empty results return empty array

## Usage Example

```
GET /api/v1/tasks?status=pending&page=1&limit=10

Response:
{
  "tasks": [
    {
      "id": 123,
      "title": "Complete docs",
      "status": "pending",
      "priority": "high"
    }
  ],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

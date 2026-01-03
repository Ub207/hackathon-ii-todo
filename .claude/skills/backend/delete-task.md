---
name: delete-task
description: Delete an existing task with ownership verification
inputs:
  - name: task_id
    type: integer
    required: true
    description: ID of the task to delete
  - name: user_id
    type: integer
    required: true
    description: ID of the user requesting deletion
outputs:
  - name: success
    type: boolean
    description: True if task was deleted successfully
  - name: error
    type: object
    description: Error details if deletion failed
---

# Skill: Delete Task

## Purpose
Delete an existing task after verifying ownership and existence.

## Implementation

```python
from sqlmodel import Session, select

def delete_task(session: Session, task_id: int, user_id: int):
    task = session.exec(select(Task).where(Task.id == task_id)).first()

    if not task:
        raise ValueError("Task not found")

    if task.user_id != user_id:
        raise PermissionError("You don't have permission to delete this task")

    session.delete(task)
    session.commit()
    return True
```

## API Endpoint

```python
@app.delete("/api/v1/tasks/{task_id}")
def delete_task_endpoint(
    task_id: int,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    try:
        delete_task(session, task_id, user_id)
        return {"success": True}
    except ValueError:
        raise HTTPException(status_code=404, detail="Task not found")
    except PermissionError:
        raise HTTPException(status_code=403, detail="Permission denied")
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete task")
```

## Acceptance Criteria

- [ ] Task exists before deletion
- [ ] User owns the task
- [ ] Task is permanently removed from database
- [ ] Transaction committed on success

## Error Handling

| Error | HTTP Status | Message |
|-------|-------------|----------|
| Task not found | 404 | Task not found |
| Permission denied | 403 | Permission denied |
| Database error | 500 | Failed to delete task |

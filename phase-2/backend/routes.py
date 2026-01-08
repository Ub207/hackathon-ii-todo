"""
API routes for task CRUD operations
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, col
from db import get_session
from models import Task, TaskStatus, TaskPriority
from schemas import TaskCreate, TaskUpdate, TaskStatusUpdate, Task as TaskSchema, TaskListResponse


router = APIRouter(prefix="/api/v1", tags=["Tasks"])


# ==================== Routes ====================

@router.get("/tasks", response_model=TaskListResponse)
def get_tasks(
    user_id: int = Query(..., description="User ID to filter tasks"),
    status: Optional[TaskStatus] = Query(None, description="Filter by status"),
    priority: Optional[TaskPriority] = Query(None, description="Filter by priority"),
    search: Optional[str] = Query(None, description="Search in title/description"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    session: Session = Depends(get_session)
):
    """
    Get all tasks with optional filtering and pagination
    """
    query = select(Task).where(Task.user_id == user_id)

    # Apply filters
    if status:
        query = query.where(Task.status == status)
    if priority:
        query = query.where(Task.priority == priority)
    if search:
        query = query.where(
            (col(Task.title).ilike(f"%{search}%")) |
            (col(Task.description).ilike(f"%{search}%"))
        )

    # Get total count
    total = len(session.exec(query).all())

    # Apply pagination and ordering
    offset = (page - 1) * limit
    query = query.order_by(Task.created_at.desc()).offset(offset).limit(limit)

    tasks = session.exec(query).all()

    return {
        "tasks": tasks,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }


@router.get("/tasks/{task_id}", response_model=TaskSchema)
def get_task(
    task_id: int,
    user_id: int = Query(..., description="User ID"),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return task


@router.post("/tasks", response_model=TaskSchema, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session)
):
    """
    Create a new task
    """
    from datetime import datetime

    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
        user_id=task_data.user_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.put("/tasks/{task_id}", response_model=TaskSchema)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    user_id: int = Query(..., description="User ID"),
    session: Session = Depends(get_session)
):
    """
    Update an existing task
    """
    from datetime import datetime

    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Filter out None values for partial update
    update_data = task_update.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )

    for field, value in update_data.items():
        setattr(task, field, value)

    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    user_id: int = Query(..., description="User ID"),
    session: Session = Depends(get_session)
):
    """
    Delete a task
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    session.delete(task)
    session.commit()

    return {"success": True, "message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/status", response_model=TaskSchema)
def update_task_status(
    task_id: int,
    status_update: TaskStatusUpdate,
    user_id: int = Query(..., description="User ID"),
    session: Session = Depends(get_session)
):
    """
    Quick update for task status
    """
    from datetime import datetime

    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    task.status = status_update.new_status
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task

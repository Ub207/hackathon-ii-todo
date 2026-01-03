"""
Pydantic schemas for request/response validation
"""
from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime
from models import TaskStatus, TaskPriority


# ==================== Schemas ====================

class UserBase(SQLModel):
    """Base user schema"""
    email: str
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema"""
    password: str


class User(UserBase):
    """User response schema"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TaskBase(SQLModel):
    """Base task schema"""
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM


class TaskCreate(TaskBase):
    """Task creation schema"""
    due_date: Optional[datetime] = None


class TaskUpdate(SQLModel):
    """Task update schema (all fields optional)"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None


class Task(TaskBase):
    """Task response schema"""
    id: int
    user_id: int
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(SQLModel):
    """Task list response with pagination"""
    tasks: list[Task]
    total: int
    page: int
    pages: int


class ErrorResponse(SQLModel):
    """Error response schema"""
    detail: str
    error_code: str
    field: Optional[str] = None

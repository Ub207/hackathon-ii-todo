/**
 * API service for task operations
 */
import type { Task, TaskListResponse } from '../types/task';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch all tasks for a user
 */
export async function fetchTasks(
  userId: number,
  filters?: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<TaskListResponse> {
  const params = new URLSearchParams({
    user_id: userId.toString(),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.priority && { priority: filters.priority }),
    ...(filters?.search && { search: filters.search }),
    ...(filters?.page && { page: filters.page.toString() }),
    ...(filters?.limit && { limit: filters.limit.toString() }),
  });

  const response = await fetch(`${API_BASE}/api/v1/tasks?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

/**
 * Fetch a single task
 */
export async function fetchTask(taskId: number, userId: number): Promise<Task> {
  const response = await fetch(
    `${API_BASE}/api/v1/tasks/${taskId}?user_id=${userId}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }

  return response.json();
}

/**
 * Create a new task
 */
export async function createTask(taskData: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_BASE}/api/v1/tasks?user_id=${taskData.user_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create task');
  }

  return response.json();
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: number,
  taskData: Partial<Task>
): Promise<Task> {
  const response = await fetch(
    `${API_BASE}/api/v1/tasks/${taskId}?user_id=${taskData.user_id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update task');
  }

  return response.json();
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: number): Promise<{ success: boolean }> {
  const userId = 1; // TODO: Get from auth

  const response = await fetch(
    `${API_BASE}/api/v1/tasks/${taskId}?user_id=${userId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  return response.json();
}

/**
 * Update task status (quick action)
 */
export async function updateTaskStatus(
  taskId: number,
  status: string
): Promise<Task> {
  const userId = 1; // TODO: Get from auth

  const response = await fetch(
    `${API_BASE}/api/v1/tasks/${taskId}/status?user_id=${userId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_status: status }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update task status');
  }

  return response.json();
}

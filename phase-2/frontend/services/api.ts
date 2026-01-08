/**
 * API service for task operations
 */
import type { Task, TaskListResponse, TaskCreate, TaskUpdate } from '../types/task';

const API_BASE = '';

// Default user ID for demo purposes
const DEFAULT_USER_ID = 1;

// A helper to handle API responses and errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'API Error: ' + response.status + ' ' + response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {
      // Not a JSON response, stick with status text
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}


/**
 * Fetch all tasks
 */
export async function fetchTasks(
  filters?: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<TaskListResponse> {
  const params = new URLSearchParams();
  params.append('user_id', DEFAULT_USER_ID.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(API_BASE + '/api/v1/tasks?' + params.toString());
  return handleResponse<TaskListResponse>(response);
}

/**
 * Fetch a single task
 */
export async function fetchTask(taskId: number): Promise<Task> {
  const response = await fetch(API_BASE + '/api/v1/tasks/' + taskId + '?user_id=' + DEFAULT_USER_ID);
  return handleResponse<Task>(response);
}

/**
 * Create a new task
 */
export async function createTask(taskData: Omit<TaskCreate, 'user_id'>): Promise<Task> {
  // Add user_id to the request body
  const requestBody = {
    ...taskData,
    user_id: DEFAULT_USER_ID
  };

  const response = await fetch(API_BASE + '/api/v1/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  return handleResponse<Task>(response);
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: number,
  taskData: TaskUpdate
): Promise<Task> {
  const response = await fetch(
    API_BASE + '/api/v1/tasks/' + taskId + '?user_id=' + DEFAULT_USER_ID,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    }
  );
  return handleResponse<Task>(response);
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: number): Promise<{ success: boolean }> {
  const response = await fetch(
    API_BASE + '/api/v1/tasks/' + taskId + '?user_id=' + DEFAULT_USER_ID,
    {
      method: 'DELETE',
    }
  );
  return handleResponse<{ success: boolean }>(response);
}

/**
 * Update task status (quick action)
 */
export async function updateTaskStatus(
  taskId: number,
  status: string
): Promise<Task> {
  const response = await fetch(
    API_BASE + '/api/v1/tasks/' + taskId + '/status?user_id=' + DEFAULT_USER_ID,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_status: status }),
    }
  );
  return handleResponse<Task>(response);
}

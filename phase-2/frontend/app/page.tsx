'use client';

import { useState, useEffect } from 'react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';
import type { Task, TaskStatus, TaskPriority } from '../types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Mock user_id (should come from auth)
  const USER_ID = 1;

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetchTasks(USER_ID);
      setTasks(response.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      await createTask({ ...data, user_id: USER_ID });
      setShowForm(false);
      loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId: number, data: any) => {
    try {
      await updateTask(taskId, data);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo App</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>

          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {showForm ? 'Cancel' : 'Create New Task'}
          </button>
        </header>

        {/* Task Form */}
        {showForm && (
          <div className="mb-8">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Edit Form */}
        {editingTask && (
          <div className="mb-8">
            <TaskForm
              task={editingTask}
              onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}

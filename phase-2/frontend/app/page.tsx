'use client';

import { useState, useEffect } from 'react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';
import type { Task, TaskCreate, TaskUpdate } from '../types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: TaskCreate) => {
    try {
      await createTask(data);
      setShowForm(false);
      showNotification('success', 'Task created successfully!');
      loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to create task');
      throw error;
    }
  };

  const handleUpdateTask = async (taskId: number, data: TaskUpdate) => {
    try {
      await updateTask(taskId, data);
      setEditingTask(null);
      showNotification('success', 'Task updated successfully!');
      loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to update task');
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        showNotification('success', 'Task deleted successfully!');
        loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
        showNotification('error', error instanceof Error ? error.message : 'Failed to delete task');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={'flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium ' + (notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600')}>
            <span>{notification.type === 'success' ? '✓' : '✕'}</span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <main className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Task <span className="text-cyan-400">Master</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">Manage your tasks with ease</p>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTask(null);
            }}
            className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-900 font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 text-base sm:text-lg"
          >
            {showForm ? 'Close' : '+ New Task'}
          </button>
        </header>

        {(showForm || editingTask) && (
          <div className="mb-8 animate-fade-in">
            <TaskForm
              key={editingTask ? editingTask.id : 'new'}
              task={editingTask}
              onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={(task) => {
              setEditingTask(task);
              setShowForm(false);
            }}
            onDelete={handleDeleteTask}
          />
        )}
      </main>
    </div>
  );
}

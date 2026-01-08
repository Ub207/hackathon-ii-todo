'use client';

import { useState, useEffect } from 'react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';
import type { Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from '../types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowForm(true);
        setEditingTask(null);
      }
      if (e.key === 'Escape') {
        if (showForm || editingTask) {
          setShowForm(false);
          setEditingTask(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm, editingTask]);

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

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
      showNotification('error', 'Failed to connect to backend. Please ensure the server is running.');
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
      showNotification('error', 'Failed to create task');
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
      showNotification('error', 'Failed to update task');
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
        showNotification('error', 'Failed to delete task');
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-cyan-500/30">
      {/* Background Blobs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {notification && (
          <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl glass backdrop-blur-xl border border-white/10 ${notification.type === 'success' ? 'text-emerald-400' : 'text-red-400'
              }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                {notification.type === 'success' ? '✓' : '✕'}
              </div>
              <p className="text-sm font-semibold text-slate-100">{notification.message}</p>
            </div>
          </div>
        )}

        <header className="mb-12 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Productivity System
              </div>
              <h1 className="text-5xl font-black tracking-tight text-white lg:text-6xl">
                Task<span className="text-gradient">Master</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
                Streamline your workflow with our advanced task management intelligence.
              </p>
            </div>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingTask(null);
                if (!showForm) window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-primary-premium min-w-[160px] group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Task
            </button>
          </div>
        </header>

        {(showForm || editingTask) && (
          <div className="mb-12 animate-scale-up">
            <TaskForm
              key={editingTask ? editingTask.id : 'new'}
              task={editingTask}
              onSubmit={async (data: any) => {
                if (editingTask) {
                  await handleUpdateTask(editingTask.id, data as TaskUpdate);
                } else {
                  await handleCreateTask(data as TaskCreate);
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 rounded-lg border border-slate-700/50">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Filter By</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
                className="input-premium py-2 text-sm min-w-[140px]"
              >
                <option value="all">Any Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
                className="input-premium py-2 text-sm min-w-[140px]"
              >
                <option value="all">Any Priority</option>
                <option value="high">High Velocity</option>
                <option value="medium">Medium Bandwidth</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="ml-auto text-slate-500 text-sm font-medium">
              Showing {filteredTasks.length} results
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 font-medium tracking-wide">Syncing Workspace...</p>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <TaskList
              tasks={filteredTasks}
              onEdit={(task) => {
                setEditingTask(task);
                setShowForm(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={handleDeleteTask}
            />
          </div>
        )}
      </div>
    </div>
  );
}

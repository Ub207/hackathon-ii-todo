'use client';

import { useState } from 'react';
import type { Task, TaskStatus, TaskPriority, TaskCreate, TaskUpdate } from '../types/task';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: (task?.status || 'pending') as TaskStatus,
    priority: (task?.priority || 'medium') as TaskPriority,
    due_date: task?.due_date ? task.due_date.split('T')[0] : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        due_date: formData.due_date || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to synchronize task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-8 animate-scale-up border-cyan-500/20 shadow-cyan-500/10">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-8 border-b border-slate-700/50">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${task ? 'bg-blue-500/10 text-blue-400' : 'bg-cyan-500/10 text-cyan-400'
          }`}>
          {task ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {task ? 'Update Objective' : 'New Objective'}
          </h2>
          <p className="text-slate-400 font-medium mt-1">
            {task ? 'Modify existing task parameters' : 'Define a new mission for your workspace'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium flex items-center gap-3 animate-slide-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="title" className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
            Task Designation
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-premium lg:text-lg"
            placeholder="Define the core objective..."
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="description" className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
            Context & Details
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="input-premium resize-none"
            placeholder="Provide additional context for this objective..."
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label htmlFor="status" className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
              Mission Phase
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              className="input-premium"
              disabled={isSubmitting}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-3">
            <label htmlFor="priority" className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
              Priority Tier
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              className="input-premium"
              disabled={isSubmitting}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Standard Bandwidth</option>
              <option value="high">High Velocity</option>
            </select>
          </div>

          <div className="space-y-3">
            <label htmlFor="due_date" className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
              Deadline
            </label>
            <input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="input-premium"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim()}
            className="btn-primary-premium flex-1 py-4 text-base shadow-cyan-500/20"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Synchronizing...
              </span>
            ) : task ? (
              <span className="flex items-center gap-2 uppercase tracking-widest">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Deploy Updates
              </span>
            ) : (
              <span className="flex items-center gap-2 uppercase tracking-widest">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
                </svg>
                Launch Task
              </span>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn-secondary-premium px-10 py-4 text-base"
            >
              Abort
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

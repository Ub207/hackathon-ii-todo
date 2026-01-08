'use client';

import type { Task, TaskPriority, TaskStatus } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const priorityConfig: Record<TaskPriority, { border: string; badge: string }> = {
  high: { border: 'border-red-500', badge: 'bg-red-500/20 text-red-200' },
  medium: { border: 'border-amber-500', badge: 'bg-amber-500/20 text-amber-200' },
  low: { border: 'border-emerald-500', badge: 'bg-emerald-500/20 text-emerald-200' },
};

const statusConfig: Record<TaskStatus, string> = {
  pending: 'bg-slate-700 text-slate-200',
  in_progress: 'bg-blue-500/20 text-blue-200',
  completed: 'bg-emerald-500/20 text-emerald-200',
};

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-slate-800/50 rounded-2xl border border-slate-700">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
        <p className="text-slate-400 mb-6">Create your first task to get started.</p>
        <p className="text-slate-500 text-sm">Click "New Task" above to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={
            "p-4 sm:p-5 rounded-xl border-l-4 bg-slate-800 border border-slate-700 " +
            "hover:bg-slate-750 transition-all duration-200 " +
            priorityConfig[task.priority].border
          }
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-1 min-w-0 w-full">
              <h3 className={task.status === 'completed' ? 'line-through text-slate-500 text-lg' : 'text-white text-lg font-medium truncate'}>
                {task.title}
              </h3>

              {task.description && (
                <p className="text-slate-400 mt-1 text-sm line-clamp-2">{task.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={'px-2.5 py-1 rounded-md text-xs font-medium ' + statusConfig[task.status]}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={'px-2.5 py-1 rounded-md text-xs font-medium ' + priorityConfig[task.priority].badge}>
                  {task.priority}
                </span>
                {task.due_date && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-700 text-slate-300">
                    {formatDate(task.due_date)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 sm:self-start">
              <button
                onClick={() => onEdit(task)}
                className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                title="Edit"
                aria-label="Edit task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Delete"
                aria-label="Delete task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

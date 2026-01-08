'use client';

import type { Task, TaskPriority, TaskStatus } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  high: { label: 'High Priority', color: 'text-red-400', bg: 'bg-red-500/10' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-slate-400', bg: 'bg-slate-500/10' },
  in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 px-6 glass-card border-dashed">
        <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Workspace is Clear</h3>
        <p className="text-slate-400 max-w-xs mx-auto">
          No tasks match your current filters. Take a moment to enjoy the peace or create a new objective.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="group glass-card flex flex-col h-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-current/20 ${priorityConfig[task.priority].color} ${priorityConfig[task.priority].bg}`}>
                {priorityConfig[task.priority].label}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(task)}
                  className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                  title="Edit Task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <h3 className={`text-lg font-bold mb-2 leading-snug ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-100'
              }`}>
              {task.title}
            </h3>

            {task.description && (
              <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-auto">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[task.status].color} ${statusConfig[task.status].bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-current ${task.status === 'in_progress' ? 'animate-pulse' : ''}`} />
                {statusConfig[task.status].label}
              </div>

              {task.due_date && (
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          <div className="h-1 w-full bg-slate-800/50 mt-auto overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${task.status === 'completed' ? 'w-full bg-emerald-500' :
                task.status === 'in_progress' ? 'w-1/2 bg-blue-500' : 'w-0'
              }`} />
          </div>
        </div>
      ))}
    </div>
  );
}

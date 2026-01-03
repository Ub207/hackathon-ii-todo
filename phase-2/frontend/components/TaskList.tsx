'use client';

import type { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gray-200 text-gray-700',
      in_progress: 'bg-blue-200 text-blue-700',
      completed: 'bg-green-200 text-green-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="text-6xl mb-4">=�</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
        <p className="text-gray-400">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-800">
        Tasks ({tasks.length})
      </h2>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                {getStatusBadge(task.status)}
              </div>

              {task.description && (
                <p className="text-gray-600 mt-2">{task.description}</p>
              )}

              <div className="flex gap-4 mt-3 text-sm text-gray-400">
                <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                title="Edit"
              >
                
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded"
                title="Delete"
              >
                =�
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

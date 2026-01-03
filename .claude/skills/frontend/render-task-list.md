---
name: render-task-list
description: Display task list page with filtering and pagination
inputs:
  - name: tasks
    type: array
    required: true
    description: Array of task objects to display
  - name: filters
    type: object
    required: false
    description: Current filter state (status, priority, search)
  - name: pagination
    type: object
    required: false
    description: Pagination info (page, total, pages)
outputs:
  - name: component
    type: JSX.Element
    description: Rendered task list component
---

# Skill: Render Task List

## Purpose
Display a list of tasks with filtering options, sorting, and pagination support.

## Component Implementation

```tsx
'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { FilterBar } from './FilterBar';
import { TaskItem } from './TaskItem';
import { Pagination } from './Pagination';

interface TaskListProps {
  tasks: Task[];
  filters?: {
    status?: string;
    priority?: string;
    search?: string;
  };
  pagination?: {
    page: number;
    total: number;
    pages: number;
  };
}

export function TaskList({ tasks, filters, pagination }: TaskListProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

  const toggleSelect = (taskId: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">=Ý</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks found</h3>
        <p className="text-gray-400">
          {filters?.search ? 'Try adjusting your filters' : 'Create your first task to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Tasks ({pagination?.total || tasks.length})
        </h2>
        {selectedTasks.size > 0 && (
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete Selected ({selectedTasks.size})
          </button>
        )}
      </div>

      {/* Filter Bar */}
      {filters && <FilterBar filters={filters} />}

      {/* Task Items */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            selected={selectedTasks.has(task.id)}
            onSelect={toggleSelect}
            priorityColor={getPriorityColor(task.priority)}
            statusBadge={getStatusBadge(task.status)}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
        />
      )}
    </div>
  );
}
```

## Task Item Component

```tsx
interface TaskItemProps {
  task: Task;
  selected: boolean;
  onSelect: (taskId: number) => void;
  priorityColor: string;
  statusBadge: React.ReactNode;
}

export function TaskItem({ task, selected, onSelect, priorityColor, statusBadge }: TaskItemProps) {
  return (
    <div className={`
      p-4 rounded-lg border-2 transition-all
      ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
    `}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(task.id)}
          className="mt-1 w-5 h-5 rounded border-gray-300"
        />

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
                {task.priority}
              </span>
              {statusBadge}
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 mt-2">{task.description}</p>
          )}

          {/* Meta info */}
          <div className="flex gap-4 mt-3 text-sm text-gray-400">
            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
            {task.due_date && (
              <span className={new Date(task.due_date) < new Date() ? 'text-red-500' : ''}>
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
            
          </button>
          <button className="p-2 text-green-600 hover:bg-green-100 rounded">
            
          </button>
          <button className="p-2 text-red-600 hover:bg-red-100 rounded">
            =Ñ
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Acceptance Criteria

- [ ] Empty state displays helpful message
- [ ] Tasks show all relevant information (title, description, priority, status, dates)
- [ ] Tasks can be selected (checkbox)
- [ ] Priority colors are distinct (high=red, medium=yellow, low=green)
- [ ] Status badges are color-coded
- [ ] Completed tasks are visually distinguished (strikethrough)
- [ ] Overdue due dates are highlighted in red
- [ ] Responsive design works on mobile
- [ ] Pagination controls are displayed when needed
- [ ] Filter bar is shown when filters are provided

## Usage

```tsx
import { TaskList } from '@/components/TaskList';

function Dashboard() {
  const { data: tasks } = useQuery(['tasks'], fetchTasks);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <TaskList
        tasks={tasks?.tasks || []}
        filters={{ status: 'pending', priority: 'high' }}
        pagination={tasks?.pagination}
      />
    </div>
  );
}
```

## Tailwind Classes Used

- Spacing: `space-y-3`, `gap-2`, `gap-4`, `mt-1`, `mt-2`, `mt-3`, `p-4`, `p-6`
- Colors: `bg-blue-50`, `bg-gray-100`, `bg-red-100`, `bg-green-100`, `bg-yellow-100`
- Typography: `text-lg`, `font-semibold`, `text-sm`, `line-through`
- Borders: `border-2`, `border-gray-200`, `border-blue-300`, `border-blue-500`
- Interactions: `hover:border-blue-300`, `hover:bg-blue-100`
- Responsive: Default mobile-first, adjust with `md:`, `lg:` breakpoints as needed

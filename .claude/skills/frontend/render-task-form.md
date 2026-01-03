---
name: render-task-form
description: Display create/edit task form with validation
inputs:
  - name: task
    type: object
    required: false
    description: Existing task object (null for create mode)
  - name: onSubmit
    type: function
    required: true
    description: Form submission handler
  - name: onCancel
    type: function
    required: false
    description: Cancel handler (optional)
outputs:
  - name: component
    type: JSX.Element
    description: Rendered task form component
---

# Skill: Render Task Form

## Purpose
Display a form for creating or editing tasks with validation, loading states, and error handling.

## Component Implementation

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from '@/types/task';

// Validation schema
const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      return new Date(val) >= new Date();
    },
    'Due date cannot be in the past'
  ),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    } : {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: '',
    },
  });

  const submitHandler = async (data: TaskFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(data);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <p className="text-gray-500 mt-1">
          {task ? 'Update the task details below' : 'Fill in the details to create a new task'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            {...register('title')}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              ${errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
              focus:outline-none
            `}
            placeholder="e.g., Complete project documentation"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              ${errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
              focus:outline-none resize-none
            `}
            placeholder="Add a detailed description (optional)"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-400">
            {register('description').value?.length || 0} / 2000 characters
          </p>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Status & Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              disabled={isSubmitting}
            >
              <option value="pending">ó Pending</option>
              <option value="in_progress">= In Progress</option>
              <option value="completed"> Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              disabled={isSubmitting}
            >
              <option value="low">=â Low</option>
              <option value="medium">=á Medium</option>
              <option value="high">=4 High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            {...register('due_date')}
            min={new Date().toISOString().split('T')[0]}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-colors
              ${errors.due_date ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
              focus:outline-none
            `}
            disabled={isSubmitting}
          />
          {errors.due_date && (
            <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className={`
              flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors
              ${(!isDirty || isSubmitting)
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">ó</span>
                Saving...
              </span>
            ) : (
              task ? 'Update Task' : 'Create Task'
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="
                flex-1 py-3 px-6 rounded-lg font-semibold text-gray-700
                bg-gray-200 hover:bg-gray-300 transition-colors
              "
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

## Acceptance Criteria

- [ ] All fields have proper validation
- [ ] Title is required and has length limits (1-200)
- [ ] Description is optional with max 2000 characters
- [ ] Status dropdown shows all options
- [ ] Priority dropdown shows all options
- [ ] Due date picker prevents past dates
- [ ] Submit button is disabled when form is dirty/submitting
- [ ] Loading spinner shows during submission
- [ ] Error messages are clear and actionable
- [ ] Cancel button appears when onCancel is provided
- [ ] Form populates with task data for edit mode
- [ ] Form resets to defaults for create mode
- [ ] Character counter shows for description

## Dependencies

```json
{
  "dependencies": {
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0"
  }
}
```

## Usage

```tsx
import { TaskForm } from '@/components/TaskForm';

function CreateTaskPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: TaskFormData) => {
    const response = await fetch('/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create task');

    queryClient.invalidateQueries(['tasks']);
    router.push('/tasks');
  };

  return <TaskForm onSubmit={handleSubmit} />;
}

function EditTaskPage({ taskId }: { taskId: number }) {
  const { data: task } = useQuery(['task', taskId], () => fetchTask(taskId));

  if (!task) return <div>Loading...</div>;

  return <TaskForm task={task} onSubmit={handleSubmit} onCancel={() => router.back()} />;
}
```

## Tailwind Classes

- Input fields: `w-full px-4 py-3 rounded-lg border-2`
- Error states: `border-red-300 focus:border-red-500`
- Focus states: `focus:border-blue-500 focus:outline-none`
- Buttons: `py-3 px-6 rounded-lg font-semibold`
- Grid: `grid-cols-1 md:grid-cols-2 gap-4`
- Spacing: `space-y-6`, `mt-1`, `mb-2`, `mb-6`

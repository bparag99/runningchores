import { CalendarDays, User, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../app/lib/StatusBadge';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'error' | 'info' | 'pending'; label: string }> = {
  not_started: { variant: 'pending', label: 'Not Started' },
  in_progress: { variant: 'info', label: 'In Progress' },
  pending_approval: { variant: 'warning', label: 'Pending Approval' },
  blocked: { variant: 'error', label: 'Blocked' },
  completed: { variant: 'success', label: 'Completed' },
};

const priorityColors: Record<string, string> = {
  low: 'text-status-pending',
  medium: 'text-status-info',
  high: 'text-status-warning',
  urgent: 'text-status-error',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const config = statusConfig[task.status] || statusConfig.not_started;
  const isOverdue = task.status !== 'completed' && new Date(task.due_date) < new Date();

  return (
    <div
      onClick={() => onClick(task)}
      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="font-medium text-sm truncate">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
          )}
        </div>
        <StatusBadge variant={config.variant} showIcon={false}>
          {config.label}
        </StatusBadge>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
          <AlertCircle size={12} />
          {task.priority}
        </span>
        <span className={`flex items-center gap-1 ${isOverdue ? 'text-status-error' : ''}`}>
          <CalendarDays size={12} />
          {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {isOverdue && ' (Overdue)'}
        </span>
        <span className="flex items-center gap-1">
          <User size={12} />
          {task.assigned_to === 'user_vendor' ? 'Vendor' : task.assigned_to === 'user_coordinator' ? 'Coordinator' : task.assigned_to === 'user_admin' ? 'Admin' : 'Couple'}
        </span>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { CalendarDays, User, AlertCircle, Save } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { StatusBadge } from '../app/lib/StatusBadge';
import { ActionButton } from '../app/lib/ActionButton';
import type { Task, TaskStatus } from '../types';

interface TaskDetailPageProps {
  task: Task;
  onBack: () => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'completed', label: 'Completed' },
];

const statusVariants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'pending'> = {
  not_started: 'pending',
  in_progress: 'info',
  pending_approval: 'warning',
  blocked: 'error',
  completed: 'success',
};

const priorityColors: Record<string, string> = {
  low: 'text-status-pending',
  medium: 'text-status-info',
  high: 'text-status-warning',
  urgent: 'text-status-error',
};

export function TaskDetailPage({ task, onBack }: TaskDetailPageProps) {
  const { updateTaskStatus, getTasksByEvent, getVendorById } = useAppData();
  const [status, setStatus] = useState(task.status);
  const [saved, setSaved] = useState(false);

  const allTasks = getTasksByEvent(task.event_id);
  const dependentTasks = allTasks.filter((t) => t.id !== task.id);

  const handleSave = () => {
    updateTaskStatus(task.id, status);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const vendor = task.vendor_id ? getVendorById(task.vendor_id) : undefined;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold">{task.title}</h2>
          <StatusBadge variant={statusVariants[status]}>
            {statusOptions.find((s) => s.value === status)?.label}
          </StatusBadge>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays size={14} />
            <span>Due: {new Date(task.due_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={14} />
            <span>Assigned to: {vendor?.name || task.assigned_to.replace('user_', '').replace('_', ' ')}</span>
          </div>
          <div className={`flex items-center gap-2 ${priorityColors[task.priority]}`}>
            <AlertCircle size={14} />
            <span>Priority: {task.priority}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                status === opt.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <ActionButton
          variant="primary"
          onClick={handleSave}
          icon={<Save size={14} />}
          disabled={status === task.status}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </ActionButton>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-2">Task Dependencies</h3>
        {dependentTasks.length === 0 ? (
          <p className="text-xs text-muted-foreground">No dependencies</p>
        ) : (
          <div className="space-y-2">
            {dependentTasks.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.title}</span>
                <StatusBadge variant={statusVariants[t.status]} showIcon={false}>
                  {statusOptions.find((s) => s.value === t.status)?.label}
                </StatusBadge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

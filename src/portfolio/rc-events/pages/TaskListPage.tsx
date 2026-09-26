import { useState } from 'react';
import { Filter } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { TaskCard } from '../components/cards/TaskCard';
import { StatusBadge } from '../app/lib/StatusBadge';
import type { Task, TaskStatus } from '../types';

interface TaskListPageProps {
  eventId: string;
  onTaskClick: (task: Task) => void;
}

const statusGroups: { key: string; label: string; statuses: TaskStatus[]; variant: 'success' | 'info' | 'error' | 'pending' | 'warning' }[] = [
  { key: 'completed', label: 'Completed', statuses: ['completed'], variant: 'success' },
  { key: 'in_progress', label: 'In Progress', statuses: ['in_progress', 'pending_approval'], variant: 'info' },
  { key: 'blocked', label: 'Blocked', statuses: ['blocked'], variant: 'error' },
  { key: 'not_started', label: 'Not Started', statuses: ['not_started'], variant: 'pending' },
];

export function TaskListPage({ eventId, onTaskClick }: TaskListPageProps) {
  const { getTasksByEvent } = useAppData();
  const [filter, setFilter] = useState<string>('all');
  const tasks = getTasksByEvent(eventId);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'all' ? 'bg-brand-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Filter size={12} />
          All
        </button>
        {['not_started', 'in_progress', 'pending_approval', 'blocked', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              filter === s ? 'bg-brand-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {s.replace(/_/g, ' ')}
            <span className="ml-1 opacity-70">({tasks.filter((t) => t.status === s).length})</span>
          </button>
        ))}
      </div>

      {filter === 'all' ? (
        <div className="space-y-6">
          {statusGroups.map((group) => {
            const groupTasks = tasks.filter((t) => group.statuses.includes(t.status));
            if (groupTasks.length === 0) return null;
            return (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge variant={group.variant} showIcon={false}>
                    {group.label}
                  </StatusBadge>
                  <span className="text-xs text-muted-foreground">{groupTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {groupTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No tasks with status "{filter.replace(/_/g, ' ')}"
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

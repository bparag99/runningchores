import { CheckCircle, Circle, Clock, XCircle } from 'lucide-react';
import { ReactNode } from 'react';

export type TimelineItemStatus = 'completed' | 'in-progress' | 'pending' | 'blocked';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  status: TimelineItemStatus;
  date?: string;
  content?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
}

function getStatusIcon(status: TimelineItemStatus) {
  switch (status) {
    case 'completed':
      return <CheckCircle size={20} className="text-status-success" />;
    case 'in-progress':
      return <Clock size={20} className="text-status-info animate-pulse" />;
    case 'pending':
      return <Circle size={20} className="text-status-pending" />;
    case 'blocked':
      return <XCircle size={20} className="text-status-error" />;
  }
}

function getStatusColor(status: TimelineItemStatus) {
  switch (status) {
    case 'completed':
      return 'bg-status-success';
    case 'in-progress':
      return 'bg-status-info';
    case 'pending':
      return 'border-2 border-status-pending bg-background';
    case 'blocked':
      return 'bg-status-error';
  }
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4">
          {/* Vertical Line */}
          {index !== items.length - 1 && (
            <div className="absolute left-[10px] top-10 bottom-0 w-0.5 bg-border" />
          )}

          {/* Status Node */}
          <div className="relative flex-shrink-0">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
              {item.status === 'pending' && <div className="w-2 h-2 rounded-full bg-status-pending" />}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(item.status)}
                    <h4 className="font-medium">{item.title}</h4>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
                {item.date && (
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                )}
              </div>
              {item.content && (
                <div className="mt-3 pt-3 border-t border-border">
                  {item.content}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

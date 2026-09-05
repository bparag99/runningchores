import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

export function DashboardCard({ title, badge, children, action }: DashboardCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium">{title}</h3>
        {badge}
      </div>
      <div className="space-y-4">
        {children}
      </div>
      {action && (
        <div className="mt-4 pt-4 border-t border-border">
          {action}
        </div>
      )}
    </div>
  );
}

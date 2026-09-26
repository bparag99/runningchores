import { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Mail, CalendarDays } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { StatusBadge } from '../app/lib/StatusBadge';
import { ActionButton } from '../app/lib/ActionButton';
import { CalendarPage } from './CalendarPage';

const tabs = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle },
  { id: 'risks', label: 'Risks', icon: AlertTriangle },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
];

export function AlertsPage() {
  const { notifications, markNotificationRead, approvals } = useAppData();
  const [activeTab, setActiveTab] = useState('all');

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const unreadNotifs = notifications.filter((n) => !n.is_read);

  const getFiltered = () => {
    switch (activeTab) {
      case 'approvals':
        return <ApprovalsList approvals={pendingApprovals} />;
      case 'risks':
        return <RisksList />;
      case 'calendar':
        return <CalendarPage />;
      default:
        return <NotificationsList notifications={notifications} onMarkRead={markNotificationRead} />;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.id === 'approvals' && pendingApprovals.length > 0 && (
                <span className="ml-1 bg-status-warning text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {pendingApprovals.length}
                </span>
              )}
              {tab.id === 'all' && unreadNotifs.length > 0 && (
                <span className="ml-1 bg-status-error text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {unreadNotifs.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {getFiltered()}
    </div>
  );
}

function NotificationsList({ notifications, onMarkRead }: { notifications: any[]; onMarkRead: (id: string) => void }) {
  if (notifications.length === 0) {
    return <EmptyState icon={Bell} message="No notifications" />;
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => !n.is_read && onMarkRead(n.id)}
          className={`bg-card border rounded-lg p-4 cursor-pointer transition-colors ${
            n.is_read ? 'border-border opacity-70' : 'border-border hover:border-brand-primary/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${n.is_read ? 'bg-transparent' : 'bg-brand-primary'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className={`text-sm ${n.is_read ? 'font-normal' : 'font-semibold'}`}>{n.title}</h4>
                <StatusBadge variant={n.type === 'risk_alert' ? 'error' : n.type === 'approval_request' ? 'warning' : 'info'} showIcon={false}>
                  {n.type.replace(/_/g, ' ')}
                </StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground">{n.body}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApprovalsList({ approvals }: { approvals: any[] }) {
  if (approvals.length === 0) {
    return <EmptyState icon={CheckCircle} message="No pending approvals" />;
  }

  return (
    <div className="space-y-2">
      {approvals.map((a) => (
        <div key={a.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-semibold">{a.title}</h4>
            <StatusBadge variant="warning">Pending</StatusBadge>
          </div>
          <p className="text-xs text-muted-foreground">{a.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Due: {new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  );
}

function RisksList() {
  const risks = [
    { id: '1', severity: 'critical', title: 'DJ confirmation overdue', description: 'DJ vendor has not confirmed in 3 days. Event is in 2 days.', action: 'Contact DJ' },
    { id: '2', severity: 'warning', title: 'Budget overrun risk', description: 'Catering budget at 90% of allocation. Review additional costs.', action: 'Review Budget' },
    { id: '3', severity: 'warning', title: 'Decoration approval pending', description: 'Decoration theme approval needed to unblock vendor.', action: 'Approve Now' },
  ];

  return (
    <div className="space-y-2">
      {risks.map((risk) => (
        <div
          key={risk.id}
          className={`bg-card border rounded-lg p-4 ${
            risk.severity === 'critical' ? 'border-status-error/30 bg-status-error/5' : 'border-status-warning/30 bg-status-warning/5'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className={risk.severity === 'critical' ? 'text-status-error mt-0.5' : 'text-status-warning mt-0.5'} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold">{risk.title}</h4>
                <StatusBadge variant={risk.severity === 'critical' ? 'error' : 'warning'} showIcon={false}>
                  {risk.severity}
                </StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{risk.description}</p>
              <ActionButton variant={risk.severity === 'critical' ? 'destructive' : 'secondary'} icon={<AlertTriangle size={12} />}>
                {risk.action}
              </ActionButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="text-center py-12">
      <Icon size={40} className="mx-auto text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

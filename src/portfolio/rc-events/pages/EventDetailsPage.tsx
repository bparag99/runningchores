import { Calendar, MapPin, Users, DollarSign, ArrowRight, CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAppData } from '../context/AppDataContext';
import { ProgressBar } from '../app/lib/ProgressBar';
import { StatusBadge } from '../app/lib/StatusBadge';
import { ActionButton } from '../app/lib/ActionButton';
import { DashboardCard } from '../app/lib/DashboardCard';
import type { Event } from '../types';

interface EventDetailsPageProps {
  event: Event;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function EventDetailsPage({ event, onNavigate, onBack }: EventDetailsPageProps) {
  const { getTasksByEvent, getApprovalsByEvent, getVendorsByEvent, getBudgetByEvent } = useAppData();
  const tasks = getTasksByEvent(event.id);
  const approvals = getApprovalsByEvent(event.id);
  const vendors = getVendorsByEvent(event.id);
  const budget = getBudgetByEvent(event.id);

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const confirmedVendors = vendors.filter((v) => v.assignment?.status === 'confirmed').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;
  const totalSpent = budget.reduce((sum, b) => sum + b.spent_amount, 0);
  const totalAllocated = budget.reduce((sum, b) => sum + b.allocated_amount, 0);
  const budgetUtil = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">{event.event_name}</h1>
            <p className="text-sm text-muted-foreground">
              {event.couple_name_1} & {event.couple_name_2}
            </p>
          </div>
          <StatusBadge variant={event.status === 'completed' ? 'success' : event.status === 'in_progress' ? 'info' : 'pending'}>
            {event.status.replace('_', ' ')}
          </StatusBadge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span>{event.venue_name}, {event.venue_city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={14} />
            <span>{event.total_guests_expected} guests</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign size={14} />
            <span>₹{(event.total_budget / 100000).toFixed(1)}L budget</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <ProgressBar label="Event Readiness" percentage={event.readiness_score} size="prominent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <DashboardCard title="Tasks" badge={<StatusBadge variant="info">{tasks.length}</StatusBadge>}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-status-success">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-status-warning">{tasks.length - completedTasks}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
          <ActionButton variant="ghost" onClick={() => onNavigate('tasks')} icon={<ArrowRight size={14} />}>
            View Tasks
          </ActionButton>
        </DashboardCard>

        <DashboardCard title="Vendors" badge={<StatusBadge variant="info">{vendors.length}</StatusBadge>}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-status-success">{confirmedVendors}</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-status-warning">{vendors.length - confirmedVendors}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
          <ActionButton variant="ghost" onClick={() => onNavigate('vendors')} icon={<ArrowRight size={14} />}>
            View Vendors
          </ActionButton>
        </DashboardCard>

        <DashboardCard title="Approvals" badge={<StatusBadge variant="warning">{pendingApprovals}</StatusBadge>}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-status-success">{approvals.filter((a) => a.status === 'approved').length}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-status-error">{pendingApprovals}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
          <ActionButton variant="ghost" onClick={() => onNavigate('approvals')} icon={<ArrowRight size={14} />}>
            View Approvals
          </ActionButton>
        </DashboardCard>

        <DashboardCard title="Budget" badge={<StatusBadge variant={budgetUtil > 80 ? 'error' : 'success'}>{budgetUtil}%</StatusBadge>}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">₹{(totalSpent / 100000).toFixed(1)}L</p>
              <p className="text-xs text-muted-foreground">Spent</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{((totalAllocated - totalSpent) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>
          <ActionButton variant="ghost" onClick={() => onNavigate('budget')} icon={<ArrowRight size={14} />}>
            View Budget
          </ActionButton>
        </DashboardCard>
      </div>
    </div>
  );
}

import { Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useAppData } from '../context/AppDataContext';
import { EventCard } from '../components/cards/EventCard';
import { ActionButton } from '../app/lib/ActionButton';
import { StatusBadge } from '../app/lib/StatusBadge';
import type { Event } from '../types';

interface DashboardPageProps {
  onSelectEvent: (event: Event) => void;
}

export function DashboardPage({ onSelectEvent }: DashboardPageProps) {
  const { user } = useAuth();
  const { events, activeEvent, setActiveEvent } = useEvents();
  const { getTasksByEvent, getApprovalsByEvent, getVendorsByEvent, getUnreadNotifications } = useAppData();
  const unreadCount = getUnreadNotifications().length;

  const handleSelect = (event: Event) => {
    setActiveEvent(event);
    onSelectEvent(event);
  };

  const totalEvents = events.length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold">
            Welcome, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <StatusBadge variant="info" showIcon={false}>
            {user?.role?.replace('_', ' ')}
          </StatusBadge>
        </div>
        <p className="text-sm text-muted-foreground">
          {totalEvents} event{totalEvents !== 1 ? 's' : ''} · {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Events</h2>
        <ActionButton variant="primary" icon={<Plus size={16} />} onClick={() => {}}>
          Create Event
        </ActionButton>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isActive={activeEvent?.id === event.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Event Copilot</h3>
            <p className="text-xs text-white/80 mt-1">
              Ask me anything about your events — readiness, vendors, approvals, or risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

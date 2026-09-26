import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import { ProgressBar } from '../../app/lib/ProgressBar';
import { StatusBadge } from '../../app/lib/StatusBadge';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
  isActive?: boolean;
  onSelect: (event: Event) => void;
}

export function EventCard({ event, isActive, onSelect }: EventCardProps) {
  const statusVariant = event.status === 'completed' ? 'success'
    : event.status === 'in_progress' ? 'info'
    : event.status === 'draft' ? 'pending'
    : 'warning';

  return (
    <div
      onClick={() => onSelect(event)}
      className={`bg-card border rounded-lg p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isActive ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{event.event_name}</h3>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {event.couple_name_1} & {event.couple_name_2}
          </p>
        </div>
        <StatusBadge variant={statusVariant}>{event.status.replace('_', ' ')}</StatusBadge>
      </div>

      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {event.venue_city}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} />
          {event.total_guests_expected}
        </span>
      </div>

      <div className="pt-2">
        <ProgressBar label="Readiness" percentage={event.readiness_score} size="compact" />
      </div>
    </div>
  );
}

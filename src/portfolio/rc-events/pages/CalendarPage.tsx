import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, AlertCircle } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAppData } from '../context/AppDataContext';
import { StatusBadge } from '../app/lib/StatusBadge';

export function CalendarPage() {
  const { events, activeEvent } = useEvents();
  const { getTasksByEvent } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const weeks = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    while (days.length % 7 !== 0) days.push(null);

    const result: (number | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [daysInMonth, firstDayOfWeek]);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.event_date === dateStr);
  };

  const eventId = activeEvent?.id || 'evt_001';
  const tasks = getTasksByEvent(eventId);
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-accent rounded-md transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{monthName}</h2>
        <button onClick={nextMonth} className="p-1 hover:bg-accent rounded-md transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-7 border-b border-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              if (!day) return <div key={`e-${wi}-${di}`} className="h-16" />;
              const dayEvents = getEventsForDay(day);
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`h-16 border-b border-r border-border p-1 relative ${
                    isToday ? 'bg-brand-primary/5' : ''
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                      isToday ? 'bg-brand-primary text-white font-bold' : 'text-foreground'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <StatusBadge variant="info" showIcon={false}>
                        {dayEvents[0].event_name}
                      </StatusBadge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={16} className="text-brand-primary" />
          <h3 className="font-semibold text-sm">Upcoming Tasks</h3>
        </div>
        <div className="space-y-2">
          {upcomingTasks.length === 0 ? (
            <p className="text-xs text-muted-foreground">No upcoming tasks</p>
          ) : (
            upcomingTasks.map((task) => {
              const isOverdue = new Date(task.due_date) < new Date();
              return (
                <div key={task.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isOverdue && <AlertCircle size={10} className="text-status-error" />}
                    <span className={isOverdue ? 'text-status-error' : ''}>{task.title}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

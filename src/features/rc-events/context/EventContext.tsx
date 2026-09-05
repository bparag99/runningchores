import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Event } from '../types';
import eventsData from '../data/events.json';

interface EventContextType {
  events: Event[];
  activeEvent: Event | null;
  setActiveEvent: (event: Event) => void;
  getEventById: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType>({
  events: [],
  activeEvent: null,
  setActiveEvent: () => {},
  getEventById: () => undefined,
});

export function EventProvider({ children }: { children: ReactNode }) {
  const [events] = useState<Event[]>(eventsData as Event[]);
  const [activeEvent, setActiveEventState] = useState<Event | null>(eventsData[0] as Event);

  const setActiveEvent = useCallback((event: Event) => {
    setActiveEventState(event);
  }, []);

  const getEventById = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events]
  );

  return (
    <EventContext.Provider
      value={{ events, activeEvent, setActiveEvent, getEventById }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);

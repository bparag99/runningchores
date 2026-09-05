import { useState } from 'react';
import { Search, Filter, UserPlus, Calendar, Users as UsersIcon } from 'lucide-react';
import { ContactCard, Contact } from './ContactCard';
import { ActionButton } from './ActionButton';
import { StatusBadge } from './StatusBadge';

// Sample data - this would come from your backend
const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Lead Wedding Planner',
    eventPart: 'Overall Event Coordination',
    phone: '+1 (555) 123-4567',
    email: 'sarah.chen@rcevents.com',
    status: 'success',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Catering Manager',
    eventPart: 'Mehndi & Reception - Food & Beverage',
    phone: '+1 (555) 234-5678',
    email: 'michael.r@deluxecatering.com',
    status: 'success',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    role: 'Decor Designer',
    eventPart: 'Sangeet & Wedding - Decoration & Setup',
    phone: '+1 (555) 345-6789',
    email: 'priya@elegantdecor.com',
    status: 'success',
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'DJ & Entertainment',
    eventPart: 'Sangeet & Reception - Music & Entertainment',
    phone: '+1 (555) 456-7890',
    email: 'james@soundwavesentertainment.com',
    status: 'warning',
  },
  {
    id: '5',
    name: 'Aisha Patel',
    role: 'Photographer',
    eventPart: 'All Events - Photography & Videography',
    phone: '+1 (555) 567-8901',
    email: 'aisha@memorylensphoto.com',
    status: 'success',
  },
  {
    id: '6',
    name: 'David Kim',
    role: 'Venue Coordinator',
    eventPart: 'Grand Palace Hotel - Venue Management',
    phone: '+1 (555) 678-9012',
    email: 'david.kim@grandpalace.com',
    status: 'success',
  },
  {
    id: '7',
    name: 'Lisa Thompson',
    role: 'Florist',
    eventPart: 'Wedding Ceremony - Floral Arrangements',
    phone: '+1 (555) 789-0123',
    email: 'lisa@petalsperfection.com',
    status: 'success',
  },
  {
    id: '8',
    name: 'Raj Malhotra',
    role: 'Transportation Coordinator',
    eventPart: 'All Events - Guest Transportation',
    phone: '+1 (555) 890-1234',
    email: 'raj@luxuryrides.com',
    status: 'info',
  },
  {
    id: '9',
    name: 'Emily Martinez',
    role: 'Makeup Artist',
    eventPart: 'Mehndi, Sangeet & Wedding - Bridal Makeup',
    phone: '+1 (555) 901-2345',
    email: 'emily@glamstudio.com',
    status: 'success',
  },
  {
    id: '10',
    name: 'Kevin O\'Brien',
    role: 'Event Security',
    eventPart: 'All Events - Security & Safety',
    phone: '+1 (555) 012-3456',
    email: 'kevin@secureevent.com',
    status: 'success',
  },
];

const eventParts = [
  'All',
  'Overall Event Coordination',
  'Mehndi',
  'Sangeet',
  'Wedding Ceremony',
  'Reception',
  'Venue Management',
  'All Events',
];

export function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventPart, setSelectedEventPart] = useState('All');
  const [contacts] = useState<Contact[]>(sampleContacts);

  // Filter contacts based on search and event part
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.eventPart.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEventPart =
      selectedEventPart === 'All' ||
      contact.eventPart.toLowerCase().includes(selectedEventPart.toLowerCase());

    return matchesSearch && matchesEventPart;
  });

  // Group contacts by event part
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const parts = contact.eventPart.split(' - ');
    const mainPart = parts[0];
    if (!acc[mainPart]) {
      acc[mainPart] = [];
    }
    acc[mainPart].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-4 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Event Contacts</h1>
            <p className="text-xs text-muted-foreground">
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} for this event
            </p>
          </div>
          <ActionButton variant="primary" icon={<UserPlus size={14} />}>
            Add
          </ActionButton>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, role, or event part..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground shrink-0" />
            <select
              value={selectedEventPart}
              onChange={(e) => setSelectedEventPart(e.target.value)}
              className="px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {eventParts.map((part) => (
                <option key={part} value={part}>
                  {part === 'All' ? 'All Event Parts' : part}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">{contacts.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Confirmed</p>
            <p className="text-lg font-semibold text-status-success">
              {contacts.filter((c) => c.status === 'success').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-lg font-semibold text-status-warning">
              {contacts.filter((c) => c.status === 'warning').length}
            </p>
          </div>
        </div>

        {/* Contacts List */}
        {selectedEventPart === 'All' ? (
          // Grouped by event part
          <div className="space-y-4">
            {Object.entries(groupedContacts)
              .sort(([a], [b]) => {
                if (a === 'All Events') return 1;
                if (b === 'All Events') return -1;
                return 0;
              })
              .map(([eventPart, partContacts]) => (
              <div key={eventPart}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-base font-semibold">{eventPart}</h2>
                  <StatusBadge variant="info" showIcon={false}>
                    {partContacts.length} {partContacts.length === 1 ? 'Contact' : 'Contacts'}
                  </StatusBadge>
                </div>
                <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-thin">
                  {partContacts.map((contact) => (
                    <div key={contact.id} className="snap-start shrink-0 w-[280px]">
                      <ContactCard contact={contact} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Filtered list
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-base font-semibold">
                {selectedEventPart === 'All' ? 'All Contacts' : selectedEventPart}
              </h2>
              <StatusBadge variant="info" showIcon={false}>
                {filteredContacts.length} {filteredContacts.length === 1 ? 'Contact' : 'Contacts'}
              </StatusBadge>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-thin">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="snap-start shrink-0 w-[280px]">
                  <ContactCard contact={contact} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-8">
            <UsersIcon size={32} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="text-sm font-medium mb-1">No contacts found</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Try adjusting your search or filters
            </p>
            <ActionButton variant="secondary" onClick={() => { setSearchQuery(''); setSelectedEventPart('All'); }}>
              Clear Filters
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
}

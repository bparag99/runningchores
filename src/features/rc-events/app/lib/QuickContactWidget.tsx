import { Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { Contact } from './ContactCard';
import { DashboardCard } from './DashboardCard';
import { StatusBadge } from './StatusBadge';

interface QuickContactWidgetProps {
  contacts: Contact[];
  title?: string;
  onViewAll?: () => void;
  maxContacts?: number;
}

export function QuickContactWidget({
  contacts,
  title = 'Key Contacts',
  onViewAll,
  maxContacts = 5,
}: QuickContactWidgetProps) {
  const displayContacts = contacts.slice(0, maxContacts);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <DashboardCard
      title={title}
      badge={
        <StatusBadge variant="info" showIcon={false}>
          {contacts.length} Total
        </StatusBadge>
      }
      action={
        onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-sm text-brand-primary hover:text-brand-primary/80 font-medium"
          >
            View All
            <ChevronRight size={16} />
          </button>
        )
      }
    >
      <div className="space-y-3">
        {displayContacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{contact.name}</p>
                {contact.status === 'warning' && (
                  <span className="w-2 h-2 rounded-full bg-status-warning" title="Pending confirmation" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => handleCall(contact.phone)}
                className="p-2 rounded-md hover:bg-status-success/10 text-status-success transition-colors"
                title={`Call ${contact.name}`}
              >
                <Phone size={16} />
              </button>
              <button
                onClick={() => handleWhatsApp(contact.phone)}
                className="p-2 rounded-md hover:bg-[#25D366]/10 text-[#25D366] transition-colors"
                title={`WhatsApp ${contact.name}`}
              >
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No contacts available
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

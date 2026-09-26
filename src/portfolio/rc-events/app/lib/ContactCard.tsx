import { Phone, MessageCircle, Mail, User } from 'lucide-react';
import { StatusBadge, BadgeVariant } from './StatusBadge';

export interface Contact {
  id: string;
  name: string;
  role: string;
  eventPart: string;
  phone: string;
  email?: string;
  status?: BadgeVariant;
  avatar?: string;
}

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${contact.phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = () => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow duration-200 h-full flex flex-col gap-2">
      {/* Top row: Avatar + Name & Status */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-brand-primary/10 border-2 border-brand-primary flex items-center justify-center">
          {contact.avatar ? (
            <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User size={20} className="text-brand-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
            {contact.status && (
              <StatusBadge variant={contact.status} showIcon={false}>
                {contact.status === 'success' ? 'Confirmed' : contact.status === 'warning' ? 'Pending' : 'Active'}
              </StatusBadge>
            )}
          </div>
          <p className="text-xs font-medium text-brand-primary truncate">{contact.role}</p>
        </div>
      </div>

      {/* Event part */}
      <p className="text-xs text-muted-foreground truncate">{contact.eventPart}</p>

      {/* Contact details */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone size={12} className="shrink-0" />
          <span className="truncate">{contact.phone}</span>
        </div>
        {contact.email && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail size={12} className="shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 mt-auto">
        <button
          onClick={handleCall}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-status-success text-white rounded text-xs font-medium hover:bg-status-success/90 active:scale-[0.98] transition-all"
        >
          <Phone size={12} />
          <span className="hidden md:inline">Call</span>
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-[#25D366] text-white rounded text-xs font-medium hover:bg-[#20BA5A] active:scale-[0.98] transition-all"
        >
          <MessageCircle size={12} />
          <span className="hidden md:inline">WhatsApp</span>
        </button>
        {contact.email && (
          <button
            onClick={handleEmail}
            className="inline-flex items-center justify-center px-2 py-1.5 border border-border rounded text-xs font-medium hover:bg-accent active:scale-[0.98] transition-all"
          >
            <Mail size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

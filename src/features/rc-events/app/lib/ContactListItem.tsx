import { Phone, MessageCircle } from 'lucide-react';
import { Contact } from './ContactCard';

interface ContactListItemProps {
  contact: Contact;
  compact?: boolean;
}

export function ContactListItem({ contact, compact = false }: ContactListItemProps) {
  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${contact.phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 px-3 hover:bg-accent/50 rounded-md transition-colors">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{contact.name}</p>
          <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={handleCall}
            className="p-1.5 rounded-md hover:bg-status-success/10 text-status-success transition-colors"
            title="Call"
          >
            <Phone size={16} />
          </button>
          <button
            onClick={handleWhatsApp}
            className="p-1.5 rounded-md hover:bg-[#25D366]/10 text-[#25D366] transition-colors"
            title="WhatsApp"
          >
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{contact.name}</p>
        <p className="text-sm text-brand-primary truncate">{contact.role}</p>
        <p className="text-xs text-muted-foreground truncate">{contact.eventPart}</p>
        <p className="text-xs text-muted-foreground mt-1">{contact.phone}</p>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          onClick={handleCall}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-status-success text-white rounded-md text-sm hover:bg-status-success/90 transition-colors"
        >
          <Phone size={14} />
          Call
        </button>
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#25D366] text-white rounded-md text-sm hover:bg-[#20BA5A] transition-colors"
        >
          <MessageCircle size={14} />
          WhatsApp
        </button>
      </div>
    </div>
  );
}

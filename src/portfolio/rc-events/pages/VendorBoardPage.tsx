import { useState } from 'react';
import { Filter } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { VendorCard } from '../components/cards/VendorCard';
import { StatusBadge } from '../app/lib/StatusBadge';

interface VendorBoardPageProps {
  eventId: string;
}

export function VendorBoardPage({ eventId }: VendorBoardPageProps) {
  const { getVendorsByEvent } = useAppData();
  const [filter, setFilter] = useState<string>('all');
  const vendors = getVendorsByEvent(eventId);

  const categories = [...new Set(vendors.map((v) => v.category))];
  const filteredVendors = filter === 'all' ? vendors : vendors.filter((v) => v.category === filter);

  const confirmed = vendors.filter((v) => v.assignment?.status === 'confirmed').length;
  const pending = vendors.filter((v) => v.assignment?.status === 'assigned').length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-card border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Confirmed</p>
          <p className="text-xl font-bold text-status-success">{confirmed}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-xl font-bold text-status-warning">{pending}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            filter === 'all' ? 'bg-brand-primary text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          <Filter size={12} />
          All ({vendors.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === cat ? 'bg-brand-primary text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            {cat} ({vendors.filter((v) => v.category === cat).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">No vendors found</div>
        ) : (
          filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))
        )}
      </div>
    </div>
  );
}

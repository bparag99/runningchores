import { Phone, Star, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../app/lib/StatusBadge';
import type { Vendor, VendorAssignment } from '../../types';

interface VendorCardProps {
  vendor: Vendor & { assignment?: VendorAssignment };
}

export function VendorCard({ vendor }: VendorCardProps) {
  const assignmentStatus = vendor.assignment?.status;
  const statusVariant = assignmentStatus === 'confirmed' || assignmentStatus === 'completed' ? 'success'
    : assignmentStatus === 'assigned' ? 'warning'
    : 'pending';

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <span className="text-brand-primary font-semibold text-sm">
            {vendor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-semibold text-sm truncate">{vendor.name}</h4>
            {assignmentStatus && (
              <StatusBadge variant={statusVariant} showIcon={false}>
                {assignmentStatus}
              </StatusBadge>
            )}
          </div>

          <p className="text-xs text-muted-foreground capitalize mb-2">{vendor.category}</p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-status-warning" />
              {vendor.average_rating} ({vendor.total_reviews})
            </span>
            {vendor.is_verified && (
              <span className="flex items-center gap-1 text-status-success">
                <CheckCircle size={12} />
                Verified
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${vendor.phone}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-status-success/10 text-status-success rounded-md text-xs font-medium hover:bg-status-success/20 transition-colors"
            >
              <Phone size={12} />
              Call
            </a>
            {vendor.email && (
              <a
                href={`mailto:${vendor.email}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-status-info/10 text-status-info rounded-md text-xs font-medium hover:bg-status-info/20 transition-colors"
              >
                <Mail size={12} />
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

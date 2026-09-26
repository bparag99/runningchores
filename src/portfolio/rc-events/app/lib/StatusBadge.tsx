import { CheckCircle, AlertCircle, XCircle, Clock, Info } from 'lucide-react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  showIcon?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-status-success-light text-status-success-dark border-status-success',
  warning: 'bg-status-warning-light text-status-warning-dark border-status-warning',
  error: 'bg-status-error-light text-status-error-dark border-status-error',
  info: 'bg-status-info-light text-status-info-dark border-status-info',
  pending: 'bg-status-pending-light text-status-pending-dark border-status-pending',
};

const variantIcons: Record<BadgeVariant, React.ReactNode> = {
  success: <CheckCircle size={12} />,
  warning: <AlertCircle size={12} />,
  error: <XCircle size={12} />,
  info: <Info size={12} />,
  pending: <Clock size={12} />,
};

export function StatusBadge({ variant, children, showIcon = true }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold uppercase border ${variantStyles[variant]}`}
    >
      {showIcon && variantIcons[variant]}
      {children}
    </span>
  );
}

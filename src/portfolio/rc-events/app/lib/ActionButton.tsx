import { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ActionButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-[0.98]',
  secondary: 'bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10',
  destructive: 'bg-status-error text-white hover:bg-status-error/90 active:scale-[0.98]',
  ghost: 'bg-transparent text-foreground hover:bg-accent active:scale-[0.98]',
};

export function ActionButton({
  variant = 'primary',
  children,
  onClick,
  icon,
  disabled = false
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
}

import { ReactNode } from 'react';

interface QuickActionChipProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}

export function QuickActionChip({ children, onClick, icon }: QuickActionChipProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors duration-200"
    >
      {icon}
      {children}
    </button>
  );
}

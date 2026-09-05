import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  alertBadge?: number;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
}

export function Layout({ children, activeTab, onTabChange, alertBadge, title, subtitle, onBack }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-16">
      {(title || onBack) && (
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="flex items-center gap-3 px-4 h-14">
            {onBack && (
              <button onClick={onBack} className="p-1 -ml-1 hover:bg-accent rounded-md transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <div>
              {title && <h1 className="text-lg font-semibold">{title}</h1>}
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </header>
      )}

      <main className="max-w-lg mx-auto px-4 py-4">
        {children}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} alertBadge={alertBadge} />
    </div>
  );
}

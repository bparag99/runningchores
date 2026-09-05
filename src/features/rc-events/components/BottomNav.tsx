import { MessageSquare, LayoutDashboard, Users, Bell, Settings } from 'lucide-react';

const tabs = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'dashboard', label: 'RC Events', icon: LayoutDashboard },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  alertBadge?: number;
}

export function BottomNav({ activeTab, onTabChange, alertBadge = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive ? 'text-brand-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              {tab.id === 'alerts' && alertBadge > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-4 w-4 h-4 rounded-full bg-status-error text-white text-[9px] flex items-center justify-center font-bold">
                  {alertBadge > 9 ? '9+' : alertBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

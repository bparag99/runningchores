import { useState, useEffect, type ReactNode } from 'react';
import { User, Shield, Building2, Bell, LogOut, ChevronRight, Sparkles, Moon, Sun, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { ActionButton } from '../app/lib/ActionButton';
import { StatusBadge } from '../app/lib/StatusBadge';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useAppData();
  const unreadCount = getUnreadNotifications().length;
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rc-events-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('rc-events-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  if (!user) return null;

  const roleBadgeVariant = user.role === 'admin' ? 'error'
    : user.role === 'vendor' ? 'info'
    : user.role === 'wedding_couple' ? 'success'
    : 'pending';

  return (
    <div>
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-primary/10 border-2 border-brand-primary flex items-center justify-center">
            <User size={28} className="text-brand-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">{user.name}</h2>
            <StatusBadge variant={roleBadgeVariant}>{user.role.replace('_', ' ')}</StatusBadge>
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <SettingRow icon={Shield} label="Role" value={user.role.replace('_', ' ')} />
        <SettingRow icon={Building2} label="Organization" value="Wedding Dreams Pvt. Ltd." />
        <SettingRow icon={Bell} label="Notifications" value={`${unreadCount} unread`} />
        <SettingRow
          icon={LayoutDashboard}
          label="Design Library"
          value=""
          onClick={() => window.open('/docs', '_blank')}
        />
        <SettingRow
          icon={isDark ? Moon : Sun}
          label="Dark Mode"
          value=""
          action={
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? 'bg-brand-primary' : 'bg-switch-background'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          }
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-ai-background border border-ai-border flex items-center justify-center">
            <Sparkles size={20} className="text-ai-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Event Copilot</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Powered by hardcoded responses for POC demonstration.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center space-y-3">
        <p className="text-xs text-muted-foreground">
          RC Events POC v1.0
        </p>
        <ActionButton variant="destructive" onClick={logout} icon={<LogOut size={16} />}>
          Logout
        </ActionButton>
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, value, action, onClick }: { icon: any; label: string; value?: string; action?: ReactNode; onClick?: () => void }) {
  return (
    <div
      className={`flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 ${onClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-muted-foreground">{value}</span>}
        {action || <ChevronRight size={14} className="text-muted-foreground" />}
      </div>
    </div>
  );
}

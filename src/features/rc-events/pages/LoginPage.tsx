import { useState } from 'react';
import { ShieldCheck, Store, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/RC_LOGO.jpg';

const roles = [
  {
    id: 'admin',
    label: 'Admin',
    description: 'Full system access - manage users, events, and settings',
    icon: ShieldCheck,
    color: 'bg-brand-primary',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    description: 'View assigned tasks and update status',
    icon: Store,
    color: 'bg-status-info',
  },
  {
    id: 'wedding_couple',
    label: 'Wedding Couple',
    description: 'View event progress and approvals',
    icon: Heart,
    color: 'bg-status-success',
  },
];

export function LoginPage() {
  const { login } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);

  const handleLogin = () => {
    if (selected) login(selected);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <img src={logo} alt="RC Events" className="h-16 w-auto" />
          </div>
          <h1 className="text-2xl font-bold">RC Events</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered Event Operations Platform</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Welcome to RC Events</h2>
          <p className="text-sm text-muted-foreground mb-5">Select your role to continue</p>

          <div className="space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selected === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelected(role.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20'
                      : 'border-border hover:border-brand-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${role.color} flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{role.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selected}
            className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/90 transition-all active:scale-[0.98]"
          >
            Continue as {roles.find((r) => r.id === selected)?.label || '...'}
            <ArrowRight size={16} />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          RC Events POC v1.0 — Mock login for demonstration
        </p>
      </div>
    </div>
  );
}

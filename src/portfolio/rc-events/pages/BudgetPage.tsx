import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { ProgressBar } from '../app/lib/ProgressBar';
import { StatusBadge } from '../app/lib/StatusBadge';

interface BudgetPageProps {
  eventId: string;
}

export function BudgetPage({ eventId }: BudgetPageProps) {
  const { getBudgetByEvent } = useAppData();
  const budget = getBudgetByEvent(eventId);

  const totalAllocated = budget.reduce((sum, b) => sum + b.allocated_amount, 0);
  const totalSpent = budget.reduce((sum, b) => sum + b.spent_amount, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const utilization = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const categories = [...new Set(budget.map((b) => b.category))].map((cat) => {
    const items = budget.filter((b) => b.category === cat);
    const allocated = items.reduce((s, b) => s + b.allocated_amount, 0);
    const spent = items.reduce((s, b) => s + b.spent_amount, 0);
    return { category: cat, allocated, spent, remaining: allocated - spent, utilization: allocated > 0 ? Math.round((spent / allocated) * 100) : 0, count: items.length };
  });

  const formatINR = (amount: number) =>
    '₹' + (amount / 100000).toFixed(1) + 'L';

  return (
    <div>
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm text-muted-foreground">Total Budget</h2>
          <StatusBadge variant={utilization > 80 ? 'error' : utilization > 60 ? 'warning' : 'success'}>
            {utilization}% Used
          </StatusBadge>
        </div>
        <p className="text-3xl font-bold mb-1">{formatINR(totalAllocated)}</p>
        <div className="flex justify-between text-sm text-muted-foreground mb-3">
          <span>Spent: {formatINR(totalSpent)}</span>
          <span>Remaining: {formatINR(totalRemaining)}</span>
        </div>
        <ProgressBar percentage={utilization} showLabel={false} size="prominent" />
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.category} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm capitalize">{cat.category}</h3>
                <StatusBadge variant="info" showIcon={false}>
                  {cat.count} items
                </StatusBadge>
              </div>
              {cat.utilization > 80 && (
                <AlertTriangle size={16} className="text-status-error" />
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
              <div>
                <p className="text-muted-foreground">Allocated</p>
                <p className="font-semibold">{formatINR(cat.allocated)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Spent</p>
                <p className="font-semibold">{formatINR(cat.spent)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remaining</p>
                <p className="font-semibold">{formatINR(cat.remaining)}</p>
              </div>
            </div>

            <ProgressBar
              percentage={cat.utilization}
              showLabel={false}
              size="compact"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

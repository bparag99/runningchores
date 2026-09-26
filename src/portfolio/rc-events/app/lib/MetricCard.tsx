import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  percentage?: number;
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const statusColors = {
  success: 'text-status-success bg-status-success-light border-status-success',
  warning: 'text-status-warning bg-status-warning-light border-status-warning',
  error: 'text-status-error bg-status-error-light border-status-error',
  info: 'text-status-info bg-status-info-light border-status-info',
  neutral: 'text-muted-foreground bg-muted border-border',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  percentage,
  status = 'neutral',
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} className="text-status-success" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-status-error" />;
    return <Minus size={16} className="text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-status-success';
    if (trend === 'down') return 'text-status-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-semibold">{value}</h2>
            {percentage !== undefined && (
              <span className="text-lg text-muted-foreground">/ {percentage}%</span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg border ${statusColors[status]}`}>
            {icon}
          </div>
        )}
      </div>

      {(trend || trendValue) && (
        <div className="flex items-center gap-1 text-sm">
          {trend && getTrendIcon()}
          {trendValue && (
            <span className={getTrendColor()}>
              {trendValue}
            </span>
          )}
          <span className="text-muted-foreground text-xs ml-1">vs last event</span>
        </div>
      )}
    </div>
  );
}

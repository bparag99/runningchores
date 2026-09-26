interface ProgressBarProps {
  label?: string;
  percentage: number;
  showLabel?: boolean;
  size?: 'compact' | 'prominent';
}

function getProgressColor(percentage: number): string {
  if (percentage <= 30) return 'bg-status-error';
  if (percentage <= 60) return 'bg-status-warning';
  if (percentage <= 85) return 'bg-status-info';
  return 'bg-status-success';
}

export function ProgressBar({
  label,
  percentage,
  showLabel = true,
  size = 'compact'
}: ProgressBarProps) {
  const heightClass = size === 'compact' ? 'h-2' : 'h-3';
  const progressColor = getProgressColor(percentage);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          <span className={`text-sm font-semibold ${progressColor.replace('bg-', 'text-')}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`${heightClass} bg-muted rounded-full overflow-hidden`}>
        <div
          className={`h-full ${progressColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

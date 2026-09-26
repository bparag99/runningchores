interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  label,
  showPercentage = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage <= 30) return 'text-status-error';
    if (percentage <= 60) return 'text-status-warning';
    if (percentage <= 85) return 'text-status-info';
    return 'text-status-success';
  };

  const getStrokeColor = () => {
    if (percentage <= 30) return '#EF4444';
    if (percentage <= 60) return '#F59E0B';
    if (percentage <= 85) return '#3B82F6';
    return '#10B981';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getStrokeColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-semibold ${getColor()}`}>
              {percentage}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <p className="text-sm text-muted-foreground mt-2 text-center">{label}</p>
      )}
    </div>
  );
}

import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

interface MiniChartProps {
  data: number[];
  height?: number;
  color?: string;
}

export function MiniChart({ data, height = 40, color = '#4F46E5' }: MiniChartProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color} opacity={0.3 + (entry.value / 100) * 0.7} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

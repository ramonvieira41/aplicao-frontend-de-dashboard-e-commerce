import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, } from 'recharts';
import { useTheme } from '@/hooks/useTheme';
import type { OrderStatus } from '@/types';
import { statusConfig } from '@/components/ui/Badge';

interface StatusChartProps {
  data: { status: OrderStatus; count: number }[];
}

const colors: Record<OrderStatus, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#6366f1',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

export function StatusChart({ data }: StatusChartProps) {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';
  const tickColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  const chartData = data.map((d) => ({
    ...d,
    label: statusConfig[d.status].label,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart accessibilityLayer={false} data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: tickColor, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: tickColor, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={30}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
            border: `1px solid ${gridColor}`,
            borderRadius: '8px',
            fontSize: '13px',
          }}
          formatter={(value) => [Number(value), 'Pedidos']}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={colors[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

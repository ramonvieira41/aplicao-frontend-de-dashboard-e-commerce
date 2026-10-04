import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCompactCurrency, formatNumber } from '@/lib/format';

interface StatCardProps {
  label: string;
  value: number;
  format?: 'currency' | 'number';
  icon: LucideIcon;
  trend?: number;
  iconColor?: string;
}

export function StatCard({
  label,
  value,
  format = 'currency',
  icon: Icon,
  trend,
  iconColor = 'text-blue-600',
}: StatCardProps) {
  const formatted = format === 'currency' ? formatCompactCurrency(value) : formatNumber(value);
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{formatted}</p>
        </div>
        <div className={`p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Em relação ao mês passado</span>
        </div>
      )}
    </Card>
  );
}

import type { OrderStatus, PaymentStatus } from '@/types';
import { paymentConfig, statusConfig } from './config';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const config = paymentConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export { statusConfig, paymentConfig, orderStatuses, paymentStatuses, } from './config';
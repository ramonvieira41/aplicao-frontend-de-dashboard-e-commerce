import type { OrderStatus, PaymentStatus } from '@/types';

export const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pendente',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  processing: {
    label: 'Processando',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  shipped: {
    label: 'Enviado',
    className:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  delivered: {
    label: 'Entregue',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  cancelled: {
    label: 'Cancelado',
    className:
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

export const paymentConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  paid: {
    label: 'Pago',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  pending: {
    label: 'Pendente',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  refunded: {
    label: 'Reembolsado',
    className:
      'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
  },
  failed: {
    label: 'Falhou',
    className:
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

export const orderStatuses: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const paymentStatuses: PaymentStatus[] = [
  'paid',
  'pending',
  'refunded',
  'failed',
];




import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Mail, MapPin, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge, PaymentBadge } from '@/components/ui/Badge';
import { orders, customers } from '@/data/mockData';
import { formatCurrency, formatDateTime } from '@/lib/format';
import type { OrderStatus } from '@/types';

const statusTimeline: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'processing': return <Package className="w-4 h-4" />;
    case 'shipped': return <Truck className="w-4 h-4" />;
    case 'delivered': return <CheckCircle className="w-4 h-4" />;
    case 'cancelled': return <XCircle className="w-4 h-4" />;
  }
}

export function OrderDetailPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' });
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === orderId);
  const customer = customers.find((c) => c.id === order?.customerId);

  if (!order) {
    return (
      <Layout title="Pedido não encontrado">
        <Card className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Este pedido não foi encontrado.</p>
          <Link to="/orders" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Voltar para pedidos
          </Link>
        </Card>
      </Layout>
    );
  }

  const currentStepIndex = statusTimeline.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const subtotal = order.subtotal;
  const shipping = order.shipping;
  const tax = order.tax;
  const total = order.total;

  return (
    <Layout title={order.orderNumber}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: '/orders' })}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Voltar para pedidos"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{order.orderNumber}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(order.date)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <StatusBadge status={order.status} />
            <PaymentBadge status={order.paymentStatus} />
          </div>
        </div>

        {!isCancelled && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-5">Progresso do pedido</h3>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusTimeline.length - 1)) * 100}%` }}
                />
              </div>
              {statusTimeline.map((status, index) => {
                const isCompleted = index <= currentStepIndex;
                return (
                  <div key={status} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {getStatusIcon(status)}
                    </div>
                    <span className={`text-xs font-medium capitalize ${isCompleted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader title="Itens do pedido" subtitle={`${order.items.length} itens`} />
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.productName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(item.price)} x {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-gray-100">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Frete</span>
                <span className="text-gray-900 dark:text-gray-100">{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Imposto (8%)</span>
                <span className="text-gray-900 dark:text-gray-100">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">{formatCurrency(total)}</span>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Cliente" />
              <div className="p-5 space-y-3">
                {customer && (
                  <Link
                    to="/customers"
                    className="block font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {order.customerName}
                  </Link>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {order.customerEmail}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {order.shippingAddress}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Pagamento" />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Método</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Cartão de crédito</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <PaymentBadge status={order.paymentStatus} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

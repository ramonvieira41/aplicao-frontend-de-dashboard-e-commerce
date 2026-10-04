import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import {
  StatusBadge,
  PaymentBadge,
  orderStatuses,
  paymentStatuses,
  statusConfig,
  paymentConfig,
} from '@/components/ui/Badge';
import { orders } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/format';

interface PaymentStatusOption {
  value: (typeof paymentStatuses)[number];
  label: string;
}

const PAGE_SIZE = 10;

export function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [search, statusFilter, paymentFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasFilters = search || statusFilter || paymentFilter;

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPaymentFilter('');
    setPage(1);
  };

  return (
    <Layout title="Pedidos">
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar por pedido, cliente, e-mail..." ariaLabel="Buscar pedidos por número, cliente ou e-mail" />
            <div className="flex flex-wrap gap-3 items-center">
              <Select
                value={statusFilter}
                onChange={(v) => { setStatusFilter(v); setPage(1); }}
                placeholder="Todos os status"
                ariaLabel="Filtrar pedidos por status"
                options={orderStatuses.map((status) => ({
                    value: status,
                    label: statusConfig[status].label,
                      }))}
              />
              <Select
                value={paymentFilter}
                onChange={(v) => { setPaymentFilter(v); setPage(1); }}
                placeholder="Todos os pagamentos"
                ariaLabel="Filtrar pedidos por status do pagamento"
                options={paymentStatuses.map((status): PaymentStatusOption => ({
                    value: status,
                    label: paymentConfig[status].label,
                      }))}
              />
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
                >
                  <Filter className="w-4 h-4" />
                  Limpar
                </button>
              )}
            </div>
            <div className="sm:ml-auto text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} {filtered.length === 1 ? 'pedido' : 'pedidos'}
            </div>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto scrollbar-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th scope="col" className="px-5 py-3 font-medium">Pedido</th>
                  <th scope="col" className="px-5 py-3 font-medium">Cliente</th>
                  <th scope="col" className="px-5 py-3 font-medium">Data</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Pagamento</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                      Nenhum pedido encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          to="/orders/$orderId"
                          params={{ orderId: order.id }}
                          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-gray-900 dark:text-gray-100">{order.customerName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{order.customerEmail}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(order.date)}</td>
                      <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3"><PaymentBadge status={order.paymentStatus} /></td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Página {currentPage} de {totalPages}
              </p>
              <nav className="flex items-center gap-2" aria-label="Paginação de pedidos">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Próxima página"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

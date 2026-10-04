import { useState, useMemo } from 'react';
import { Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { customers } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/format';

export function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrders = customers.reduce((sum, c) => sum + c.orders, 0) / customers.length;

  return (
    <Layout title="Clientes">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de clientes</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{customers.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Receita total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{formatCurrency(totalRevenue)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Média de pedidos por cliente</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{avgOrders.toFixed(1)}</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, e-mail, localização..." ariaLabel="Buscar clientes por nome, e-mail ou localização" />
            <div className="sm:ml-auto text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} {filtered.length === 1 ? 'cliente' : 'clientes'}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <Card className="col-span-full p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Nenhum cliente encontrado.</p>
            </Card>
          ) : (
            filtered.map((customer) => (
              <Card key={customer.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-semibold shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{customer.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ingressou em {formatDate(customer.joinedAt)}</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="truncate">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{customer.location}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pedidos</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{customer.orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total gasto</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

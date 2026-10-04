import { Link } from '@tanstack/react-router';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { StatusChart } from '@/components/charts/StatusChart';
import { TopProducts } from '@/components/charts/TopProducts';
import {
  getDashboardStats,
  getTopProducts,
  revenueData,
  ordersByStatus,
  orders,
  products,
} from '@/data/mockData';
import { formatCurrency, timeAgo } from '@/lib/format';

export function DashboardPage() {
  const stats = getDashboardStats();
  const topProducts = getTopProducts(5);
  const recentOrders = orders.slice(0, 6);
  const lowStock = products.filter((p) => p.stock <= 10);

  return (
    <Layout title="Painel">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Receita total" value={stats.totalRevenue} icon={DollarSign} trend={12.5} iconColor="text-green-600" />
          <StatCard label="Pedidos totais" value={stats.totalOrders} format="number" icon={ShoppingCart} trend={8.2} iconColor="text-blue-600" />
          <StatCard label="Ticket médio" value={stats.avgTicket} icon={TrendingUp} trend={3.1} iconColor="text-indigo-600" />
          <StatCard label="Clientes" value={stats.totalCustomers} format="number" icon={Users} trend={5.4} iconColor="text-cyan-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader title="Visão geral de receitas" subtitle="Últimos 30 dias" />
            <div className="p-5">
              <RevenueChart data={revenueData} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Pedidos por status" />
            <div className="p-5">
              <StatusChart data={ordersByStatus} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Produtos em alta" subtitle="Por unidades vendidas" />
            <div className="p-5">
              <TopProducts products={topProducts} />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader
              title="Pedidos recentes"
              action={
                <Link to="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Ver tudo
                </Link>
              }
            />
            <div className="overflow-x-auto scrollbar-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-5 py-3 font-medium">Pedido</th>
                    <th className="px-5 py-3 font-medium">Cliente</th>
                    <th className="px-5 py-3 font-medium">Data</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
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
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{order.customerName}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{timeAgo(order.date)}</td>
                      <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Alerta de estoque baixo" subtitle="Produtos com 10 ou menos em estoque" />
            <div className="p-5 space-y-3">
              {lowStock.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Todos os produtos estão bem abastecidos.</p>
              ) : (
                lowStock.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.stock === 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      <span className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.stock} restantes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Resumo do estoque" />
            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total de produtos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{products.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">Unidades vendidas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.totalProductsSold.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">Baixo estoque</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{lowStock.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">Sem estoque</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{products.filter((p) => p.stock === 0).length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

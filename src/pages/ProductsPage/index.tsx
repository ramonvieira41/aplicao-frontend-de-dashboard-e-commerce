import { useState, useMemo } from 'react';
import { Package, AlertTriangle, XCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { products } from '@/data/mockData';
import { formatCurrency, formatNumber } from '@/lib/format';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesStock =
        !stockFilter ||
        (stockFilter === 'out' && product.stock === 0) ||
        (stockFilter === 'low' && product.stock > 0 && product.stock <= 10) ||
        (stockFilter === 'in' && product.stock > 10);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [search, categoryFilter, stockFilter]);

  const hasFilters = search || categoryFilter || stockFilter;

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setStockFilter('');
  };

  return (
    <Layout title="Produtos">
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de produtos</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{products.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Em estoque</p>
            <p className="text-xl font-bold text-green-600 mt-1">{products.filter((p) => p.stock > 10).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pouco estoque</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{products.filter((p) => p.stock > 0 && p.stock <= 10).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Sem estoque</p>
            <p className="text-xl font-bold text-red-600 mt-1">{products.filter((p) => p.stock === 0).length}</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar produtos" ariaLabel="Buscar produtos por nome ou SKU" />
            <div className="flex flex-wrap gap-3">
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="Todas as categorias"
                ariaLabel="Filtrar produtos por categoria"
                options={categories.map((c) => ({ value: c, label: c }))}
              />
              <Select
                value={stockFilter}
                onChange={setStockFilter}
                placeholder="Todo o estoque"
                ariaLabel="Filtrar produtos por nível de estoque"
                options={[
                  { value: 'in', label: 'Em estoque' },
                  { value: 'low', label: 'Pouco estoque' },
                  { value: 'out', label: 'Sem estoque' },
                ]}
              />
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="sm:ml-auto text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <Card className="col-span-full p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Nenhum produto encontrado com os filtros selecionados.</p>
            </Card>
          ) : (
            filtered.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.stock === 0 ? (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                      <XCircle className="w-3 h-3" />
                      Sem estoque
                    </div>
                  ) : product.stock <= 10 ? (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      Baixo
                    </div>
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.sku}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 shrink-0">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(product.price)}</span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estoque</p>
                      <p className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock <= 10 ? 'text-amber-600' : 'text-gray-900 dark:text-gray-100'}`}>
                        {product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(product.sold)} vendidos</span>
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

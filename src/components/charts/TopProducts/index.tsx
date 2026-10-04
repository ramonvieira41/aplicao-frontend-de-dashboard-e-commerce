import { formatCurrency, formatNumber } from '@/lib/format';
import type { Product } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {

  if (products.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto encontrado"
        description="Não há dados de produtos para exibir."
      />
    );
  }
  
  const maxSold = Math.max(...products.map((p) => p.sold));

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const percentage = (product.sold / maxSold) * 100;
        return (
          <div key={product.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {product.name}
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-2 shrink-0">
                  {formatNumber(product.sold)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 w-16 text-right">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import type { Order, OrderStatus, PaymentStatus, Product, Customer, RevenuePoint } from '@/types';
import Carteira from '@/assets/images/carteira-couro.avif';
import Cafeteira from '@/assets/images/cafeteira.jpg';
import Luminaria from '@/assets/images/luminaria-led.jpg';
import Mochila from '@/assets/images/mochila.webp';
import CaixaSom from '@/assets/images/caixa-som.webp';

export const products: Product[] = [
  { id: 'p1', name: 'Fones sem fio', sku: 'WH-001', category: 'Eletrônicos', price: 199.99, stock: 45, sold: 320, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'p2', name: 'Smartwatch Pro', sku: 'SW-002', category: 'Eletrônicos', price: 299.99, stock: 12, sold: 215, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'p3', name: 'Camiseta de algodão', sku: 'TS-003', category: 'Vestuário', price: 24.99, stock: 230, sold: 580, image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'p4', name: 'Carteira de couro', sku: 'LW-004', category: 'Acessórios', price: 49.99, stock: 8, sold: 180, image: Carteira },
  { id: 'p5', name: 'Cafeteira', sku: 'CM-005', category: 'Casa', price: 89.99, stock: 34, sold: 142, image: Cafeteira },
  { id: 'p6', name: 'Tênis para corrida', sku: 'SN-006', category: 'Vestuário', price: 119.99, stock: 3, sold: 410, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'p7', name: 'Luminária de mesa LED', sku: 'DL-007', category: 'Casa', price: 39.99, stock: 0, sold: 95, image: Luminaria },
  { id: 'p8', name: 'Caixa de som', sku: 'BS-008', category: 'Eletrônicos', price: 79.99, stock: 56, sold: 268, image: CaixaSom },
  { id: 'p9', name: 'Mochila de viagem', sku: 'BP-009', category: 'Acessórios', price: 69.99, stock: 27, sold: 156, image: Mochila },
  { id: 'p10', name: 'Garrafa térmica de aço', sku: 'WB-010', category: 'Casa', price: 19.99, stock: 150, sold: 720, image: 'https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const customerProfiles = [
  { name: 'Alice Santos', email: 'alice@example.com', phone: '+55 11 5555-0101', location: 'São Paulo, SP' },
  { name: 'Beto Silva', email: 'beto@example.com', phone: '+55 21 5555-0102', location: 'Rio de Janeiro, RJ' },
  { name: 'Carla Souza', email: 'carla@example.com', phone: '+55 31 5555-0103', location: 'Belo Horizonte, MG' },
  { name: 'Diego Costa', email: 'diego@example.com', phone: '+55 41 5555-0104', location: 'Curitiba, PR' },
  { name: 'Eva Pereira', email: 'eva@example.com', phone: '+55 51 5555-0105', location: 'Porto Alegre, RS' },
  { name: 'Felipe Rocha', email: 'felipe@example.com', phone: '+55 85 5555-0106', location: 'Fortaleza, CE' },
  { name: 'Giovanna Lima', email: 'giovanna@example.com', phone: '+55 61 5555-0107', location: 'Brasília, DF' },
  { name: 'Henrique Alves', email: 'henrique@example.com', phone: '+55 71 5555-0108', location: 'Salvador, BA' },
  { name: 'Isabela Gomes', email: 'isabela@example.com', phone: '+55 11 5555-0109', location: 'Campinas, SP' },
  { name: 'João Mendes', email: 'joao@example.com', phone: '+55 51 5555-0110', location: 'Florianópolis, SC' },
  { name: 'Karen Nunes', email: 'karen@example.com', phone: '+55 88 5555-0111', location: 'Juazeiro do Norte, CE' },
  { name: 'Leonardo Cruz', email: 'leo@example.com', phone: '+55 12 5555-0112', location: 'São José dos Campos, SP' },
];

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function getOrderDate(index: number, daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - (index % daysBack));
  date.setHours(9 + (index % 10), (index * 7) % 60, 0, 0);
  return date.toISOString();
}

function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

function calculateOrderTotals(items: Order['items']) {
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = roundCurrency(subtotal * 0.08);
  const total = roundCurrency(subtotal + shipping + tax);

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
}

function generateOrders(): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < 60; i++) {
    const customer = customerProfiles[i % customerProfiles.length];
    const itemCount = (i % 3) + 1;
    const items = Array.from({ length: itemCount }, (_, j) => {
      const product = products[(i * 3 + j * 2) % products.length];
      const quantity = ((i + j) % 3) + 1;
      return {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
      };
    });
    const status = statuses[i % statuses.length];
    const paymentStatus: PaymentStatus =
      status === 'cancelled'
        ? 'refunded'
        : status === 'pending'
          ? i % 10 === 0 ? 'failed' : 'pending'
          : 'paid';
    const totals = calculateOrderTotals(items);

    orders.push({
      id: `o${i + 1}`,
      orderNumber: `#ORD-${String(1000 + i + 1)}`,
      customerName: customer.name,
      customerEmail: customer.email,
      customerId: `c${(i % customerProfiles.length) + 1}`,
      date: getOrderDate(i, 30),
      status,
      paymentStatus,
      ...totals,
      items,
      shippingAddress: `${customer.location}`,
    });
  }
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const orders: Order[] = generateOrders();

export const customers: Customer[] = customerProfiles.map((customer, index) => {
  const customerOrders = orders.filter((order) => order.customerId === `c${index + 1}`);

  return {
    id: `c${index + 1}`,
    ...customer,
    orders: customerOrders.length,
    totalSpent: roundCurrency(customerOrders.reduce((sum, order) => sum + order.total, 0)),
    joinedAt: new Date(Date.UTC(2023, index, 15)).toISOString(),
  };
});

export const revenueData: RevenuePoint[] = (() => {
  const data: RevenuePoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayOrders = orders.filter(
      (o) => new Date(o.date).toDateString() === date.toDateString()
    );
    const revenue = dayOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: roundCurrency(revenue),
      orders: dayOrders.length,
    });
  }
  return data;
})();

export const ordersByStatus: { status: OrderStatus; count: number }[] = statuses.map((status) => ({
  status,
  count: orders.filter((o) => o.status === status).length,
}));

export function getDashboardStats() {
  const paidOrders = orders.filter((order) => order.paymentStatus === 'paid');
  const totalRevenue = roundCurrency(
    paidOrders.reduce((sum, order) => sum + order.total, 0)
  );
  const totalOrders = orders.filter((order) => order.status !== 'cancelled').length;
  const avgTicket = paidOrders.length > 0 ? roundCurrency(totalRevenue / paidOrders.length) : 0;
  const totalProductsSold = products.reduce((sum, p) => sum + p.sold, 0);
  const totalCustomers = customers.length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  return {
    totalRevenue,
    totalOrders,
    avgTicket,
    totalProductsSold,
    totalCustomers,
    lowStockProducts,
  };
}

export function getTopProducts(limit = 5): Product[] {
  return [...products].sort((a, b) => b.sold - a.sold).slice(0, limit);
}

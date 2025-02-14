import { Product, Customer, Invoice } from '../types';

export const generateMockProducts = (): Product[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `p${i + 1}`,
    code: `PRD-${(i + 1).toString().padStart(4, '0')}`,
    name: `Product ${i + 1}`,
    description: `Description for product ${i + 1}`,
    price: Math.round(Math.random() * 1000 * 100) / 100,
    stock: Math.floor(Math.random() * 100),
    category: ['Electronics', 'Office', 'Furniture', 'Software'][Math.floor(Math.random() * 4)],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

export const generateMockCustomers = (): Customer[] => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `c${i + 1}`,
    code: `CUS-${(i + 1).toString().padStart(4, '0')}`,
    name: `Customer ${i + 1} Ltd`,
    email: `contact@customer${i + 1}.com`,
    phone: `+44 ${Math.floor(Math.random() * 10000000000)}`,
    address: {
      street: `${Math.floor(Math.random() * 100)} Business Street`,
      city: ['London', 'Manchester', 'Birmingham', 'Leeds'][Math.floor(Math.random() * 4)],
      postcode: `AB${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}CD`,
      country: 'United Kingdom',
    },
    vatNumber: `GB${Math.floor(Math.random() * 1000000000)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

export const generateMockInvoices = (customers: Customer[], products: Product[]): Invoice[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `i${i + 1}`,
    number: `INV-${(i + 1).toString().padStart(4, '0')}`,
    customerId: customers[Math.floor(Math.random() * customers.length)].id,
    items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      return {
        productId: product.id,
        quantity,
        price: product.price,
      };
    }),
    subtotal: 0, // Calculated below
    vat: 0, // Calculated below
    total: 0, // Calculated below
    status: ['draft', 'sent', 'paid', 'overdue', 'cancelled'][Math.floor(Math.random() * 5)] as any,
    dueDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  })).map(invoice => {
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = subtotal * 0.20; // 20% VAT
    return {
      ...invoice,
      subtotal,
      vat,
      total: subtotal + vat,
    };
  });
};

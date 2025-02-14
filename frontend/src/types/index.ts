export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  vatNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

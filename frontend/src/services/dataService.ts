import { Product, Customer, Invoice } from '../types';
import { generateMockProducts, generateMockCustomers, generateMockInvoices } from './mockData';

class DataService {
  private products: Product[] = [];
  private customers: Customer[] = [];
  private invoices: Invoice[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    this.products = generateMockProducts();
    this.customers = generateMockCustomers();
    this.invoices = generateMockInvoices(this.customers, this.products);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Promise.resolve([...this.products]);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return Promise.resolve(this.products.find(p => p.id === id));
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: `p${this.products.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return Promise.resolve(newProduct);
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return Promise.resolve([...this.customers]);
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return Promise.resolve(this.customers.find(c => c.id === id));
  }

  async addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: `c${this.customers.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customers.push(newCustomer);
    return Promise.resolve(newCustomer);
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return Promise.resolve([...this.invoices]);
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return Promise.resolve(this.invoices.find(i => i.id === id));
  }

  async addInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const newInvoice: Invoice = {
      ...invoice,
      id: `i${this.invoices.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.invoices.push(newInvoice);
    return Promise.resolve(newInvoice);
  }
}

export const dataService = new DataService();

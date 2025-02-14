// Payment Types
export type PaymentMethod = 'card' | 'cash' | 'contactless' | 'bank_transfer' | 'voucher' | 'split';

export type PaymentStatus = 'pending' | 'approved' | 'declined' | 'refunded';

export interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  status: PaymentStatus;
  processedAt: Date;
}

export interface SplitPaymentItem {
  method: PaymentMethod;
  amount: number;
}

// Sales Types
export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

// VAT Types and Constants
export interface VatRate {
  id: string;
  name: string;
  rate: number;
  default?: boolean;
}

/**
 * UK VAT Rates according to HMRC (Her Majesty's Revenue and Customs)
 * Standard Rate: 20% - Most goods and services
 * Reduced Rate: 5% - Some goods and services, e.g., home energy
 * Zero Rate: 0% - Food, books, children's clothes
 * Exempt: 0% - Insurance, education, health services
 */
export const UK_VAT_RATES: VatRate[] = [
  { 
    id: 'standard', 
    name: 'Standard Rate', 
    rate: 20, 
    default: true 
  },
  { 
    id: 'reduced', 
    name: 'Reduced Rate', 
    rate: 5 
  },
  { 
    id: 'zero', 
    name: 'Zero Rate', 
    rate: 0 
  },
  { 
    id: 'exempt', 
    name: 'VAT Exempt', 
    rate: 0 
  }
];

/**
 * Calculates VAT amount for a given price and VAT rate ID
 * @param price - The price before VAT
 * @param vatRateId - The ID of the VAT rate to apply
 * @returns The VAT amount
 */
export const getVatAmount = (price: number, vatRateId: string): number => {
  const rate = UK_VAT_RATES.find(r => r.id === vatRateId);
  if (!rate) {
    return UK_VAT_RATES[0].rate * price / 100; // Default to standard rate
  }
  return rate.rate * price / 100;
};
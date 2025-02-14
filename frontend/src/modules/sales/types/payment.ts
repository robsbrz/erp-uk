export type PaymentProvider = 'worldpay' | 'sumup' | 'stripe';

export type PaymentMethod = 'card' | 'cash' | 'contactless' | 'bank_transfer' | 'voucher' | 'split';

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  errorMessage?: string;
}

export interface PaymentGatewayResponse {
  id: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  reference?: string;
  errorCode?: string;
  errorMessage?: string;
}

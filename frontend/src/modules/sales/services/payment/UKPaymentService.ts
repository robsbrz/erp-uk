// src/modules/sales/services/payment/UKPaymentService.ts
import { PaymentProvider, PaymentGatewayResponse } from '../../types/payment';
import { Payment } from '../../types';

interface WorldpayConfig {
    merchantId: string;
    apiKey: string;
    terminalId?: string;
}

interface SumUpConfig {
    apiKey: string;
    merchantCode: string;
    affiliateKey: string;
}

interface StripeUKConfig {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
}

interface RefundRequest {
    amount: number;
    reference: string;
    currency?: string;
}

interface RefundResponse {
    success: boolean;
    reference: string;
    errorMessage?: string;
}

export class UKPaymentService {
    private worldpayConfig?: WorldpayConfig;
    private sumUpConfig?: SumUpConfig;
    private stripeConfig?: StripeUKConfig;
    private activeProvider: PaymentProvider;

    constructor(provider: PaymentProvider = 'worldpay') {
        this.activeProvider = provider;
        this.initializeConfigs();
    }

    private initializeConfigs() {
        this.worldpayConfig = {
            merchantId: import.meta.env.VITE_WORLDPAY_MERCHANT_ID || '',
            apiKey: import.meta.env.VITE_WORLDPAY_API_KEY || '',
            terminalId: import.meta.env.VITE_WORLDPAY_TERMINAL_ID
        };

        this.sumUpConfig = {
            apiKey: import.meta.env.VITE_SUMUP_API_KEY || '',
            merchantCode: import.meta.env.VITE_SUMUP_MERCHANT_CODE || '',
            affiliateKey: import.meta.env.VITE_SUMUP_AFFILIATE_KEY || ''
        };

        this.stripeConfig = {
            publicKey: import.meta.env.VITE_STRIPE_UK_PUBLIC_KEY || '',
            secretKey: import.meta.env.VITE_STRIPE_UK_SECRET_KEY || '',
            webhookSecret: import.meta.env.VITE_STRIPE_UK_WEBHOOK_SECRET || ''
        };
    }

    async processCardPayment(amount: number, currency: string = 'GBP'): Promise<Payment> {
        let gatewayResponse: PaymentGatewayResponse;

        if (currency !== 'GBP') {
            throw new Error('Only GBP currency is supported at the moment');
        }

        switch (this.activeProvider) {
            case 'worldpay':
                gatewayResponse = await this.processWorldpayPayment(amount);
                break;
            case 'sumup':
                gatewayResponse = await this.processSumUpPayment(amount);
                break;
            case 'stripe':
                gatewayResponse = await this.processStripePayment(amount);
                break;
            default:
                throw new Error('Unsupported payment provider');
        }

        if (gatewayResponse.status !== 'success') {
            throw new Error(gatewayResponse.errorMessage || 'Payment failed');
        }

        const payment: Payment = {
            id: gatewayResponse.id,
            method: 'card',
            amount: gatewayResponse.amount,
            reference: gatewayResponse.reference,
            status: 'approved',
            processedAt: new Date()
        };

        return payment;
    }

    async processRefund(request: RefundRequest): Promise<RefundResponse> {
        const { amount, reference, currency = 'GBP' } = request;

        if (currency !== 'GBP') {
            throw new Error('Only GBP currency is supported for refunds');
        }

        switch (this.activeProvider) {
            case 'worldpay':
                return this.processWorldpayRefund(amount, reference);
            case 'sumup':
                return this.processSumUpRefund(amount, reference);
            case 'stripe':
                return this.processStripeRefund(amount, reference);
            default:
                throw new Error('Unsupported payment provider for refund');
        }
    }

    private async processWorldpayRefund(amount: number, reference: string): Promise<RefundResponse> {
        try {
            const response = await fetch(`https://api.worldpay.com/v1/payments/${reference}/refunds`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.worldpayConfig?.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount,
                    currency: 'GBP'
                })
            });

            const data = await response.json();
            
            return {
                success: data.status === 'SUCCESS',
                reference: data.reference || `REF-WP-${Date.now()}`,
                errorMessage: data.errorMessage
            };
        } catch (error) {
            return {
                success: false,
                reference: `ERROR-${Date.now()}`,
                errorMessage: error instanceof Error ? error.message : 'Refund processing failed'
            };
        }
    }

    private async processSumUpRefund(amount: number, reference: string): Promise<RefundResponse> {
        try {
            const response = await fetch(`https://api.sumup.com/v0.1/payments/${reference}/refunds`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.sumUpConfig?.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount,
                    currency: 'GBP'
                })
            });

            const data = await response.json();
            
            return {
                success: data.status === 'REFUNDED',
                reference: data.reference || `REF-SU-${Date.now()}`,
                errorMessage: data.errorMessage
            };
        } catch (error) {
            return {
                success: false,
                reference: `ERROR-${Date.now()}`,
                errorMessage: error instanceof Error ? error.message : 'Refund processing failed'
            };
        }
    }

    private async processStripeRefund(amount: number, reference: string): Promise<RefundResponse> {
        try {
            const response = await fetch('https://api.stripe.com/v1/refunds', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.stripeConfig?.secretKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    payment_intent: reference,
                    amount
                })
            });

            const data = await response.json();
            
            return {
                success: data.status === 'succeeded',
                reference: data.id || `REF-ST-${Date.now()}`,
                errorMessage: data.error?.message
            };
        } catch (error) {
            return {
                success: false,
                reference: `ERROR-${Date.now()}`,
                errorMessage: error instanceof Error ? error.message : 'Refund processing failed'
            };
        }
    }

    private async processWorldpayPayment(amount: number): Promise<PaymentGatewayResponse> {
        try {
            const response = await fetch('https://api.worldpay.com/v1/payments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.worldpayConfig?.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    merchantId: this.worldpayConfig?.merchantId,
                    terminalId: this.worldpayConfig?.terminalId,
                    amount: amount,
                    currency: 'GBP',
                    paymentMethod: 'CARD',
                    captureMode: 'AUTO'
                })
            });
    
            const data = await response.json();
            
            return {
                id: data.id || `WP-${Date.now()}`,
                status: data.status === 'SUCCESS' ? 'success' : 'failed',
                amount: amount,
                currency: 'GBP',
                reference: data.reference,
                errorMessage: data.errorMessage
            };
        } catch (error) {
            console.error('Worldpay payment failed:', error);
            return {
                id: `ERROR-${Date.now()}`,
                status: 'failed',
                amount: amount,
                currency: 'GBP',
                errorMessage: error instanceof Error ? error.message : 'Payment processing failed'
            };
        }
    }
    
    private async processSumUpPayment(amount: number): Promise<PaymentGatewayResponse> {
        try {
            const response = await fetch('https://api.sumup.com/v0.1/payments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.sumUpConfig?.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount,
                    currency: 'GBP',
                    merchantCode: this.sumUpConfig?.merchantCode
                })
            });
    
            const data = await response.json();
            
            return {
                id: data.id || `SU-${Date.now()}`,
                status: data.status === 'PAID' ? 'success' : 'failed',
                amount: amount,
                currency: 'GBP',
                reference: data.reference,
                errorMessage: data.errorMessage
            };
        } catch (error) {
            console.error('SumUp payment failed:', error);
            return {
                id: `ERROR-${Date.now()}`,
                status: 'failed',
                amount: amount,
                currency: 'GBP',
                errorMessage: error instanceof Error ? error.message : 'Payment processing failed'
            };
        }
    }
    
    private async processStripePayment(amount: number): Promise<PaymentGatewayResponse> {
        try {
            const response = await fetch('https://api.stripe.com/v1/payment_intents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.stripeConfig?.secretKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // Stripe requer o valor em centavos
                    currency: 'gbp',
                    payment_method_types: ['card', 'link']
                })
            });
    
            const data = await response.json();
            
            return {
                id: data.id || `ST-${Date.now()}`,
                status: data.status === 'succeeded' ? 'success' : 'failed',
                amount: amount,
                currency: 'GBP',
                reference: data.id, // Stripe usa o payment_intent ID como referência
                errorMessage: data.error?.message
            };
        } catch (error) {
            console.error('Stripe payment failed:', error);
            return {
                id: `ERROR-${Date.now()}`,
                status: 'failed',
                amount: amount,
                currency: 'GBP',
                errorMessage: error instanceof Error ? error.message : 'Payment processing failed'
            };
        }
    }
}

export const ukPaymentService = new UKPaymentService();
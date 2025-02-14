// src/modules/sales/services/payment/SplitPaymentService.ts
import { Sale, Payment } from '../../types';
import { UKPaymentService } from './UKPaymentService';

class SplitPaymentService {
    private paymentService: UKPaymentService;

    constructor() {
        this.paymentService = new UKPaymentService();
    }

    async processSplitPayment(sale: Sale, payments: any[]) {
        // Validate total amounts
        this.validateSplitAmounts(sale, payments);

        const processedPayments: Payment[] = [];

        for (const payment of payments) {
            try {
                let processedPayment: Payment;

                switch (payment.method) {
                    case 'card':
                    case 'contactless':
                        processedPayment = await this.processCardSplit(payment);
                        break;
                    case 'cash':
                        processedPayment = await this.processCashSplit(payment);
                        break;
                    case 'voucher':
                        processedPayment = await this.processVoucherSplit(payment);
                        break;
                    default:
                        throw new Error(`Unsupported payment method: ${payment.method}`);
                }

                processedPayments.push(processedPayment);
            } catch (error) {
                // If any payment fails, reverse previous payments
                await this.reversePayments(processedPayments);
                throw new Error('Split payment failed');
            }
        }

        return processedPayments;
    }

    private validateSplitAmounts(sale: Sale, payments: any[]) {
        const totalPayment = payments.reduce((sum, payment) => sum + payment.amount, 0);
        
        if (Math.abs(totalPayment - sale.total) > 0.01) {
            throw new Error('Split payment amounts do not match sale total');
        }
    }

    private async processCardSplit(payment: any): Promise<Payment> {
        const result = await this.paymentService.processCardPayment(payment.amount);
        
        return {
            id: `split_${Date.now()}`,
            method: payment.method,
            amount: payment.amount,
            reference: result.reference,
            status: 'approved',
            processedAt: new Date()
        };
    }

    private async processCashSplit(payment: any): Promise<Payment> {
        return {
            id: `split_${Date.now()}`,
            method: 'cash',
            amount: payment.amount,
            status: 'approved',
            processedAt: new Date()
        };
    }

    private async processVoucherSplit(payment: any): Promise<Payment> {
        return {
            id: `split_${Date.now()}`,
            method: 'voucher',
            amount: payment.amount,
            reference: payment.reference,
            status: 'approved',
            processedAt: new Date()
        };
    }

    private async reversePayments(payments: Payment[]) {
        for (const payment of payments) {
            try {
                if (payment.method === 'card' || payment.method === 'contactless') {
                    if (!payment.reference) {
                        throw new Error(`Payment ${payment.id} has no reference for refund`);
                    }
                    
                    await this.paymentService.processRefund({
                        amount: payment.amount,
                        reference: payment.reference
                    });
                } else if (payment.method === 'voucher') {
                    // Lógica específica para reverter voucher se necessário
                    console.log(`Reversing voucher payment: ${payment.id}`);
                } else if (payment.method === 'cash') {
                    // Lógica específica para reverter pagamento em dinheiro se necessário
                    console.log(`Reversing cash payment: ${payment.id}`);
                }
                
                console.log(`Successfully reversed payment: ${payment.id}`);
            } catch (error) {
                console.error(`Failed to reverse payment ${payment.id}:`, error);
                throw error; // Re-lança o erro para ser tratado pelo chamador
            }
        }
    }
}

export const splitPaymentService = new SplitPaymentService();
export { SplitPaymentService };

// src/modules/sales/tests/paymentTest.ts
import { ukPaymentService } from '../paymentServiceInstance';
import { Sale, Payment } from '../../../types';

async function testPayment() {
    console.log('=== Iniciando teste de pagamento ===');

    const mockSale: Sale = {
        id: `SALE-${Date.now()}`,
        items: [], 
        subtotal: 99.99,
        vatAmount: 20.00,
        total: 119.99,
        status: 'pending',
        payments: [] as Payment[], // Adicionada anotação de tipo explícita aqui
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        console.log(`\nProcessando pagamento para venda ${mockSale.id}...`);
        console.log(`Valor: £${mockSale.total}`);
        
        const payment: Payment = await ukPaymentService.processCardPayment(mockSale.total); // Anotação de tipo aqui
        console.log('Pagamento processado com sucesso:', payment);

        mockSale.payments.push(payment);
        mockSale.status = 'completed';
        mockSale.updatedAt = new Date();

        if (payment.reference) {
            console.log('\nProcessando reembolso...');
            const refund = await ukPaymentService.processRefund({
                amount: mockSale.total,
                reference: payment.reference
            });
            console.log('Reembolso processado:', refund);

            if (refund.success) {
                console.log('Reembolso realizado com sucesso');
                mockSale.status = 'cancelled';
                mockSale.updatedAt = new Date();
            } else {
                console.log('Falha no reembolso:', refund.errorMessage);
            }
        }

    } catch (error) {
        console.error('\nErro durante o teste:', error);
        mockSale.status = 'cancelled';
        mockSale.updatedAt = new Date();
    }

    console.log('\nEstado final da venda:', mockSale);
    console.log('\n=== Teste finalizado ===');
}

// Testa diferentes cenários de pagamento
async function runAllTests() {
    console.log('\n=== Iniciando suite de testes de pagamento ===\n');

    // Teste 1: Pagamento bem sucedido
    console.log('Teste 1: Pagamento normal');
    await testPayment();

    // Teste 2: Pagamento com valor zero (deve falhar)
    console.log('\nTeste 2: Pagamento com valor zero');
    try {
        await ukPaymentService.processCardPayment(0);
    } catch (error) {
        console.log('Erro esperado capturado:', error);
    }

    // Teste 3: Pagamento com valor negativo (deve falhar)
    console.log('\nTeste 3: Pagamento com valor negativo');
    try {
        await ukPaymentService.processCardPayment(-10);
    } catch (error) {
        console.log('Erro esperado capturado:', error);
    }

    // Teste 4: Pagamento com moeda diferente (deve falhar)
    console.log('\nTeste 4: Pagamento em moeda diferente');
    try {
        await ukPaymentService.processCardPayment(100, 'USD');
    } catch (error) {
        console.log('Erro esperado capturado:', error);
    }

    console.log('\n=== Fim da suite de testes ===');
}

// Executa todos os testes
runAllTests().catch(error => {
    console.error('Erro na execução dos testes:', error);
    process.exit(1);
});

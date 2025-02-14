import { Sale, SaleItem } from '../../types';

interface PrinterConfig {
  type: 'EPSON' | 'STAR' | 'CUSTOM' | 'PDF';
  port?: string;
  ipAddress?: string;
  dpi?: number;
}

export class ReceiptPrinterService {
  private config: PrinterConfig;
  private companyDetails: any;

  constructor(config: PrinterConfig) {
    this.config = config;
    this.initializeCompanyDetails();
  }

  private initializeCompanyDetails() {
    // In production, this would come from company settings
    this.companyDetails = {
      name: 'Your Company Name',
      address: '*** Business Street',
      city: 'London',
      postcode: 'SW*A *AA',
      phone: '****************',
      vatNumber: 'GB123456789',
      companyNumber: '12345678'
    };
  }

  async printReceipt(sale: Sale) {
    const receipt = this.generateReceiptContent(sale);
    
    switch (this.config.type) {
      case 'EPSON':
        return this.printToEpson(receipt);
      case 'STAR':
        return this.printToStar(receipt);
      case 'PDF':
        return this.generatePDF(receipt);
      default:
        throw new Error('Unsupported printer type');
    }
  }

  private generateReceiptContent(sale: Sale) {
    const header = this.generateHeader();
    const items = this.generateItemsList(sale.items);
    const totals = this.generateTotals(sale);
    const footer = this.generateFooter(sale);

    return `
      ${header}
      ${items}
      ${totals}
      ${footer}
    `;
  }

  private generateHeader() {
    return `
      ${this.companyDetails.name}
      ${this.companyDetails.address}
      ${this.companyDetails.city}
      ${this.companyDetails.postcode}
      Tel: ${this.companyDetails.phone}
      VAT: ${this.companyDetails.vatNumber}
      
      Date: ${new Date().toLocaleDateString('en-GB')}
      Time: ${new Date().toLocaleTimeString('en-GB')}
      
      Receipt #: ${Date.now()}
      ---------------------------------
    `;
  }

  private generateItemsList(items: SaleItem[]) {
    return items.map(item => `
      ${item.productId}
      ${item.quantity} x £${item.unitPrice.toFixed(2)}
      £${item.total.toFixed(2)}
    `).join('\n');
  }

  private generateTotals(sale: Sale) {
    return `
      ---------------------------------
      Subtotal: £${sale.subtotal.toFixed(2)}
      VAT (20%): £${sale.vatAmount.toFixed(2)}
      Total: £${sale.total.toFixed(2)}
    `;
  }

  private generateFooter(sale: Sale) {
    return `
      ---------------------------------
      Payment Method: ${sale.payments[0].method}
      
      Thank you for your business!
      
      VAT Reg: ${this.companyDetails.vatNumber}
      Company No: ${this.companyDetails.companyNumber}
    `;
  }

  private async printToEpson(content: string): Promise<void> {
    console.log('Printing to EPSON printer:', content);
    // Simulation of EPSON printer SDK implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('EPSON print completed');
        resolve();
      }, 1000);
    });
  }

  private async printToStar(content: string): Promise<void> {
    console.log('Printing to Star printer:', content);
    // Simulation of Star printer SDK implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Star print completed');
        resolve();
      }, 1000);
    });
  }

  private async generatePDF(content: string): Promise<void> {
    console.log('Generating PDF:', content);
    // Simulation of PDF generation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('PDF generated');
        resolve();
      }, 1000);
    });
  }
}

// Export singleton instance
export const receiptPrinterService = new ReceiptPrinterService({
  type: 'EPSON'
});

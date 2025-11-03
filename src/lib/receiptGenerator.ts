import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Currency } from '@prisma/client';

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency?: Currency;
}

export interface ReceiptData {
  storeInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  receiptInfo: {
    invoiceNo: string;
    date: string;
    cashier: string;
    paymentMethod: string;
  };
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency?: Currency;
}

export class ReceiptGenerator {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  private formatCurrencyAmount(amount: number, currency: Currency = Currency.USD): string {
    const currencySymbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'KSH': 'KSh',
      'ZAR': 'R'
    };
    
    const symbol = currencySymbols[currency] || currency;
    const decimalPlaces = currency === Currency.KSH ? 0 : 2;
    
    return `${symbol}${amount.toFixed(decimalPlaces)}`;
  }

  private addHeader(storeInfo: ReceiptData['storeInfo']) {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(storeInfo.name, 105, 20, { align: 'center' });

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(storeInfo.address, 105, 28, { align: 'center' });
    this.doc.text(`Phone: ${storeInfo.phone}`, 105, 34, { align: 'center' });
    this.doc.text(`Email: ${storeInfo.email}`, 105, 40, { align: 'center' });

    // Add separator line
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 45, 190, 45);
  }

  private addReceiptInfo(receiptInfo: ReceiptData['receiptInfo']) {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECEIPT', 20, 55);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Invoice No: ${receiptInfo.invoiceNo}`, 20, 65);
    this.doc.text(`Date: ${receiptInfo.date}`, 20, 71);
    this.doc.text(`Cashier: ${receiptInfo.cashier}`, 20, 77);
    this.doc.text(`Payment: ${receiptInfo.paymentMethod}`, 20, 83);
  }

  private addCustomerInfo(customerInfo?: ReceiptData['customerInfo']) {
    if (!customerInfo || (!customerInfo.name && !customerInfo.email && !customerInfo.phone)) {
      return;
    }

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Customer:', 120, 65);

    this.doc.setFont('helvetica', 'normal');
    let yPos = 71;
    if (customerInfo.name) {
      this.doc.text(customerInfo.name, 120, yPos);
      yPos += 6;
    }
    if (customerInfo.email) {
      this.doc.text(customerInfo.email, 120, yPos);
      yPos += 6;
    }
    if (customerInfo.phone) {
      this.doc.text(customerInfo.phone, 120, yPos);
    }
  }

  private addItems(items: ReceiptItem[], currency: Currency = Currency.USD) {
    // Table headers
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Item', 20, 95);
    this.doc.text('Qty', 100, 95);
    this.doc.text('Price', 130, 95);
    this.doc.text('Total', 160, 95);

    // Separator line
    this.doc.setLineWidth(0.3);
    this.doc.line(20, 98, 190, 98);

    // Table items
    this.doc.setFont('helvetica', 'normal');
    let yPos = 104;

    items.forEach((item) => {
      // Check if we need a new page
      if (yPos > 270) {
        this.doc.addPage();
        yPos = 20;
      }

      // Item name (truncated if too long)
      const itemName = item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name;
      this.doc.text(itemName, 20, yPos);
      this.doc.text(item.quantity.toString(), 100, yPos);
      this.doc.text(this.formatCurrencyAmount(item.unitPrice, item.currency || currency), 130, yPos);
      this.doc.text(this.formatCurrencyAmount(item.totalPrice, item.currency || currency), 160, yPos);
      yPos += 8;
    });

    // Bottom line
    this.doc.line(20, yPos, 190, yPos);
    yPos += 10;

    return yPos;
  }

  private addTotals(subtotal: number, discount: number, tax: number, total: number, currency: Currency = Currency.USD, yPos: number) {
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Subtotal:', 130, yPos);
    this.doc.text(this.formatCurrencyAmount(subtotal, currency), 160, yPos);
    yPos += 8;

    if (discount > 0) {
      this.doc.text('Discount:', 130, yPos);
      this.doc.text(`-${this.formatCurrencyAmount(discount, currency)}`, 160, yPos);
      yPos += 8;
    }

    if (tax > 0) {
      this.doc.text('Tax:', 130, yPos);
      this.doc.text(this.formatCurrencyAmount(tax, currency), 160, yPos);
      yPos += 8;
    }

    // Total line
    this.doc.setLineWidth(0.5);
    this.doc.line(120, yPos, 190, yPos);
    yPos += 8;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.text('TOTAL:', 130, yPos);
    this.doc.text(this.formatCurrencyAmount(total, currency), 160, yPos);
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Thank you message
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'italic');
      this.doc.text('Thank you for your business!', 105, 280, { align: 'center' });
      
      // Page number
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    }
  }

  generateReceipt(data: ReceiptData): ArrayBuffer {
    const currency = data.currency || Currency.USD;
    
    // Add header
    this.addHeader(data.storeInfo);

    // Add receipt and customer info
    this.addReceiptInfo(data.receiptInfo);
    this.addCustomerInfo(data.customerInfo);

    // Add items
    const itemsEndY = this.addItems(data.items, currency);

    // Add totals
    this.addTotals(data.subtotal, data.discount, data.tax, data.total, currency, itemsEndY);

    // Add footer
    this.addFooter();

    return this.doc.output('arraybuffer');
  }

  downloadReceipt(data: ReceiptData, filename?: string): void {
    const pdfData = this.generateReceipt(data);
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `receipt-${data.receiptInfo.invoiceNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  async generateReceiptFromHTML(elementId: string): Promise<ArrayBuffer> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    this.doc = new jsPDF('p', 'mm', 'a4');
    this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      this.doc.addPage();
      this.doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return this.doc.output('arraybuffer');
  }
}

// Utility function to format date
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Create a receipt generator instance
export const receiptGenerator = new ReceiptGenerator();
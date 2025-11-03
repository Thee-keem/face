'use client';

import { ReceiptData, formatDate } from '@/lib/receiptGenerator';
import { Currency } from '@prisma/client';

interface ReceiptTemplateProps {
  data: ReceiptData;
  className?: string;
}

// Create a local formatCurrency function since it's not exported
const formatCurrency = (amount: number, currency: Currency = Currency.USD): string => {
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
};

export default function ReceiptTemplate({ data, className = '' }: ReceiptTemplateProps) {
  return (
    <div id="receipt-template" className={`bg-white p-6 max-w-md mx-auto ${className}`}>
      {/* Store Information */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{data.storeInfo.name}</h1>
        <p className="text-sm text-gray-600">{data.storeInfo.address}</p>
        <p className="text-sm text-gray-600">Phone: {data.storeInfo.phone}</p>
        <p className="text-sm text-gray-600">Email: {data.storeInfo.email}</p>
      </div>

      <div className="border-t border-b border-gray-300 py-2 mb-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">RECEIPT</h2>
        </div>
      </div>

      {/* Receipt Information */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="font-semibold text-gray-700">Invoice No:</p>
          <p className="text-gray-600">{data.receiptInfo.invoiceNo}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Date:</p>
          <p className="text-gray-600">{formatDate(data.receiptInfo.date)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Cashier:</p>
          <p className="text-gray-600">{data.receiptInfo.cashier}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Payment:</p>
          <p className="text-gray-600">{data.receiptInfo.paymentMethod}</p>
        </div>
      </div>

      {/* Customer Information */}
      {data.customerInfo && (data.customerInfo.name || data.customerInfo.email || data.customerInfo.phone) && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold text-gray-700 mb-2">Customer:</h3>
          {data.customerInfo.name && (
            <p className="text-sm text-gray-600">{data.customerInfo.name}</p>
          )}
          {data.customerInfo.email && (
            <p className="text-sm text-gray-600">{data.customerInfo.email}</p>
          )}
          {data.customerInfo.phone && (
            <p className="text-sm text-gray-600">{data.customerInfo.phone}</p>
          )}
        </div>
      )}

      {/* Items Table */}
      <div className="mb-4">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-700 border-b border-gray-300 pb-2">
          <div className="col-span-5">Item</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-3 text-right">Total</div>
        </div>
        
        <div className="space-y-1">
          {data.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 text-xs text-gray-600">
              <div className="col-span-5 truncate" title={item.name}>
                {item.name}
              </div>
              <div className="col-span-2 text-center">{item.quantity}</div>
              <div className="col-span-2 text-right">{formatCurrency(item.unitPrice, item.currency)}</div>
              <div className="col-span-3 text-right">{formatCurrency(item.totalPrice, item.currency)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-300 pt-2 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-gray-900">{formatCurrency(data.subtotal, data.currency)}</span>
        </div>
        
        {data.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="text-red-600">-{formatCurrency(data.discount, data.currency)}</span>
          </div>
        )}
        
        {data.tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span className="text-gray-900">{formatCurrency(data.tax, data.currency)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-base font-bold border-t border-gray-300 pt-2">
          <span className="text-gray-900">TOTAL:</span>
          <span className="text-gray-900">{formatCurrency(data.total, data.currency)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t border-gray-300">
        <p className="text-sm text-gray-600 italic">Thank you for your business!</p>
        <p className="text-xs text-gray-500 mt-2">
          This is a computer-generated receipt. No signature required.
        </p>
      </div>
    </div>
  );
}
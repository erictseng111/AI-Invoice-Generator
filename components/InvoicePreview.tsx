import React, { useMemo } from 'react';
import { InvoiceData } from '../types';

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const { company, client, invoiceNumber, date, dueDate, items, notes, taxRate, currency } = invoice;

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return subtotal * (taxRate / 100);
  }, [subtotal, taxRate]);

  const total = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  const formatDate = (dateString: string) => {
    try {
      // Add a time component to avoid timezone issues where the date might shift
      const date = new Date(`${dateString}T00:00:00`);
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
      return date.toLocaleDateString(undefined, options);
    } catch (e) {
      return "Invalid Date";
    }
  };
  
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white p-6 sm:p-8 lg:p-10 font-serif text-sm lg:aspect-[210/297] text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 pb-8 border-b-2 border-gray-200">
        <div className="flex items-start gap-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black mt-1">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-black">{company.name}</h1>
            <p className="mt-1 text-black">{company.address}</p>
            <p className="text-black">{company.email} | {company.phone}</p>
          </div>
        </div>
        <h2 className="text-3xl lg:text-4xl font-light uppercase self-end sm:self-auto text-black">Invoice</h2>
      </div>

      {/* Billed To and Invoice Details */}
      <div className="flex flex-col sm:flex-row sm:justify-between mt-8 gap-6 sm:gap-2">
        <div>
          <h3 className="font-semibold uppercase mb-2 text-black">Billed To</h3>
          <p className="font-bold text-black">{client.name}</p>
          <p className="text-black">{client.address}</p>
          <p className="text-black">{client.email}</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="mb-2 text-black">
            <span className="font-semibold">Invoice Number: </span>
            <span>{invoiceNumber}</span>
          </div>
          <div className="mb-2 text-black">
            <span className="font-semibold">Date of Issue: </span>
            <span>{formatDate(date)}</span>
          </div>
          <div className="text-black">
            <span className="font-semibold">Due Date: </span>
            <span>{formatDate(dueDate)}</span>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mt-10">
        <table className="w-full text-left text-black">
          <thead>
            <tr className="bg-gray-100 uppercase text-xs text-black">
              <th className="p-2 sm:p-3 font-semibold">Description</th>
              <th className="p-2 sm:p-3 text-center font-semibold">Qty</th>
              <th className="p-2 sm:p-3 text-right font-semibold">Unit Price</th>
              <th className="p-2 sm:p-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="p-2 sm:p-3 align-top">{item.description}</td>
                <td className="p-2 sm:p-3 text-center align-top">{item.quantity}</td>
                <td className="p-2 sm:p-3 text-right align-top">{formatCurrency(item.price)}</td>
                <td className="p-2 sm:p-3 text-right align-top">{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mt-8">
        <div className="w-full sm:w-auto sm:max-w-xs space-y-3 text-black">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({taxRate.toFixed(2)}%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      
      {/* Footer / Notes */}
      <div className="mt-12 pt-8 border-t-2 border-gray-200 text-black">
        <h3 className="font-semibold mb-2">Notes</h3>
        <p className="text-xs">{notes}</p>
      </div>
    </div>
  );
};

export default InvoicePreview;
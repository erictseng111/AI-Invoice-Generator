
import React, { useMemo } from 'react';
import { InvoiceData } from '../types';

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

// FIX: Added JSX to render the invoice and exported the component.
export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const { client, invoiceNumber, date, dueDate, items, taxRate, currency } = invoice;

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price || 0), 0);
  }, [items]);

  // Withholding tax calculation: Total = Subtotal / (1 + Tax Rate)
  const total = useMemo(() => {
    if (!taxRate || taxRate === 0) return subtotal;
    // This calculation is based on the provided example where the tax is 6% of the final amount.
    // Subtotal = Total + (Total * TaxRate) => Subtotal = Total * (1 + TaxRate) => Total = Subtotal / (1 + TaxRate)
    return subtotal / (1 + taxRate / 100);
  }, [subtotal, taxRate]);
  
  const taxAmount = useMemo(() => {
    return subtotal - total;
  }, [subtotal, total]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    // The date from <input type="date"> is YYYY-MM-DD.
    // To avoid timezone issues, we can parse it manually or treat it as UTC.
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString; // Fallback for unexpected formats
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    // Using a library like date-fns would be more robust, but for this requirement, this is fine.
    // Format: "4月30, 2025"
    return `${month}月 ${day}, ${year}`;
  };
  
  const formatCurrency = (amount: number) => {
    // Uses toLocaleString for proper comma formatting.
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const staticCompany = {
      name: 'Curators Travel Co., Ltd.',
      address: '6F-2, No. 35, Sec. 1, Chengde Rd.,\nDatong Dist., 103613\nTaipei City, Taiwan',
      email: 'irwin@curatorstravel.com',
      phone: 'Tel: +886 277 515 076',
      iata: 'IATA #96606193'
  };

  const staticBankDetails = {
    remitTo: 'PLEASE REMIT TO',
    accountHolder: 'CURATORS TRAVEL CO., LTD.',
    accountNumber: '208885481',
    bankName: 'DBS BANK (TAIWAN) LTD.',
    swiftCode: 'DBSSTWTP',
    bankAddress: '13F., No.399, Ruiguang Rd., Neihu Dist\n\n114 Taipei City\nTaiwan'
  };
  
  const logoSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAACDCAYAAADGEdBvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAFGVSURBVHhe7d3bjxTHff/xLzYgARsQG8CGDBAbEBuQgA0IGzCgA3ZA2IEdu4Id2ME2bEO2sSOgsKMD2oF0gM57z5WqWqXrzZubfSf78HmeF/A5S3Vf9f743Xtv7n8DAAAAACD/5F7dAQAAAACQ94p0AAAAAABAyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAAAABIyCMdAAAA-ti-Voodoo is dead";

  return (
    <div className="p-10 bg-white text-black text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="w-2/3">
          <img src={logoSrc} alt="Curators Travel Co., Ltd." className="h-20" />
          <div className="mt-4 whitespace-pre-wrap text-xs text-gray-600">
            <p>{staticCompany.name}</p>
            <p>{staticCompany.address}</p>
            <p>{staticCompany.email}</p>
            <p>{staticCompany.phone}</p>
            <p>{staticCompany.iata}</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold text-slate-800 uppercase tracking-widest">INVOICE</h1>
          <p className="mt-2 text-gray-500">{invoiceNumber}</p>
        </div>
      </div>

      {/* Client and Dates */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To</h2>
          <p className="font-bold text-gray-800">{client.name}</p>
          <p className="whitespace-pre-wrap text-gray-600">{client.address}</p>
          {client.email && <p className="text-gray-600">{client.email}</p>}
        </div>
        <div className="text-right">
            <div className="mb-2">
                <span className="font-bold text-gray-500">Date of issue: </span>
                <span className="text-gray-800">{formatDate(date)}</span>
            </div>
            <div>
                <span className="font-bold text-gray-500">Due date: </span>
                <span className="text-gray-800">{formatDate(dueDate)}</span>
            </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-100 text-slate-600 uppercase text-xs">
              <th className="p-3 font-semibold">Description</th>
              <th className="p-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-right">{formatCurrency(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-10">
        <div className="w-full max-w-xs">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Withholding Tax ({taxRate}%)</span>
              <span>-{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-800 border-t pt-2 mt-2">
              <span>Amount Due</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="border-t pt-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{staticBankDetails.remitTo}</h3>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p><span className="font-semibold">Account Holder:</span> {staticBankDetails.accountHolder}</p>
            <p><span className="font-semibold">Account Number:</span> {staticBankDetails.accountNumber}</p>
            <p><span className="font-semibold">Bank Name:</span> {staticBankDetails.bankName}</p>
          </div>
          <div>
            <p><span className="font-semibold">SWIFT Code:</span> {staticBankDetails.swiftCode}</p>
            <p><span className="font-semibold">Bank Address:</span></p>
            <p className="whitespace-pre-wrap">{staticBankDetails.bankAddress}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-400">
        <p>Thank you for your business.</p>
      </div>
    </div>
  );
};

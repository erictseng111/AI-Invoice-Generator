import React from 'react';
import { InvoiceData, LineItem, Company, Client } from '../types';

interface InvoiceFormProps {
  invoice: InvoiceData;
  onDataChange: <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => void;
  onCompanyChange: <K extends keyof Company>(key: K, value: Company[K]) => void;
  onClientChange: <K extends keyof Client>(key: K, value: Client[K]) => void;
  onItemChange: (index: number, updatedItem: LineItem) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const InputField: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input type={type} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition"/>
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ label, value, onChange, rows = 3 }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={rows} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition"/>
    </div>
);

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onDataChange, onCompanyChange, onClientChange, onItemChange, onAddItem, onRemoveItem }) => {

  return (
    <div className="space-y-8">
      {/* Company and Client Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-lg text-slate-700">Your Company</h3>
          <InputField label="Name" value={invoice.company.name} onChange={e => onCompanyChange('name', e.target.value)} />
          <InputField label="Address" value={invoice.company.address} onChange={e => onCompanyChange('address', e.target.value)} />
          <InputField label="Email" value={invoice.company.email} onChange={e => onCompanyChange('email', e.target.value)} type="email"/>
          <InputField label="Phone" value={invoice.company.phone} onChange={e => onCompanyChange('phone', e.target.value)} />
        </div>
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-lg text-slate-700">Bill To</h3>
          <InputField label="Client Name" value={invoice.client.name} onChange={e => onClientChange('name', e.target.value)} />
          <InputField label="Client Address" value={invoice.client.address} onChange={e => onClientChange('address', e.target.value)} />
          <InputField label="Client Email" value={invoice.client.email} onChange={e => onClientChange('email', e.target.value)} type="email"/>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-gray-200 rounded-lg">
         <h3 className="font-bold text-lg text-slate-700 md:col-span-3 -mb-2">Invoice Details</h3>
         <InputField label="Invoice #" value={invoice.invoiceNumber} onChange={e => onDataChange('invoiceNumber', e.target.value)} />
         <InputField label="Issue Date" value={invoice.date} onChange={e => onDataChange('date', e.target.value)} type="date" />
         <InputField label="Due Date" value={invoice.dueDate} onChange={e => onDataChange('dueDate', e.target.value)} type="date" />
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-700">Items</h3>
        <div className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
              <div className="col-span-12 md:col-span-5">
                <label className="text-sm font-medium text-gray-500 md:hidden">Description</label>
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={e => onItemChange(index, { ...item, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="text-sm font-medium text-gray-500 md:hidden">Qty</label>
                <input
                  type="number"
                  placeholder="1"
                  value={item.quantity}
                  onChange={e => onItemChange(index, { ...item, quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="text-sm font-medium text-gray-500 md:hidden">Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={item.price}
                  onChange={e => onItemChange(index, { ...item, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-10 md:col-span-2 flex items-center justify-end">
                <span className="text-gray-700 font-medium">
                  {invoice.currency}{(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end">
                <button
                  onClick={() => onRemoveItem(index)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
                  aria-label="Remove item"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onAddItem} className="w-full px-4 py-2 border-2 border-dashed border-slate-400 text-slate-600 rounded-lg hover:bg-slate-100 hover:border-slate-500 transition font-medium">
          + Add Item
        </button>
      </div>

      {/* Notes, Tax, and Currency */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-4 border border-gray-200 rounded-lg">
          <div className="md:col-span-3">
            <TextAreaField label="Notes / Terms" value={invoice.notes} onChange={e => onDataChange('notes', e.target.value)} />
          </div>
          <div className="md:col-span-2 space-y-4">
            <InputField label="Tax Rate (%)" value={invoice.taxRate} onChange={e => onDataChange('taxRate', parseFloat(e.target.value) || 0)} type="number" />
            <InputField label="Currency Symbol" value={invoice.currency} onChange={e => onDataChange('currency', e.target.value)} />
          </div>
       </div>

    </div>
  );
};

export default InvoiceForm;
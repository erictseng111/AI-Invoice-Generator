import React, { useState, useRef, useCallback } from 'react';
import { InvoiceData, LineItem } from './types';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import Header from './components/Header';
import { PdfIcon, GoogleDriveIcon } from './components/Icons';

// Extend the Window interface to include the libraries loaded from CDN
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    company: { name: 'Your Company', address: '123 Street, City, Country', email: 'contact@yourcompany.com', phone: '+123 456 7890' },
    client: { name: 'Client Inc.', address: '456 Avenue, Town, Country', email: 'contact@client.com' },
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    items: [
      { id: '1', description: 'Web Design Services', quantity: 10, price: 150.00 },
      { id: '2', description: 'SEO Optimization', quantity: 1, price: 800.00 },
    ],
    notes: 'Thank you for your business. Please pay within 30 days.',
    taxRate: 8.0,
    currency: '$',
  });

  const [loadingState, setLoadingState] = useState({ pdf: false, drive: false });
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDataChange = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setInvoice(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCompanyChange = useCallback(<K extends keyof InvoiceData['company']>(key: K, value: InvoiceData['company'][K]) => {
    setInvoice(prev => ({ ...prev, company: { ...prev.company, [key]: value } }));
  }, []);

  const handleClientChange = useCallback(<K extends keyof InvoiceData['client']>(key: K, value: InvoiceData['client'][K]) => {
    setInvoice(prev => ({ ...prev, client: { ...prev.client, [key]: value } }));
  }, []);

  const handleItemChange = useCallback((index: number, updatedItem: LineItem) => {
    setInvoice(prev => {
      const newItems = [...prev.items];
      newItems[index] = updatedItem;
      return { ...prev, items: newItems };
    });
  }, []);

  const addItem = useCallback(() => {
    const newItem: LineItem = {
      id: `${Date.now()}`,
      description: 'New Item',
      quantity: 1,
      price: 0.00,
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  }, []);

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setLoadingState(prev => ({ ...prev, pdf: true }));

    try {
      const { jsPDF } = window.jspdf;
      const canvas = await window.html2canvas(previewRef.current, {
          scale: 2, // Higher scale for better quality
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      let finalImgWidth = pdfWidth;
      let finalImgHeight = pdfWidth / ratio;
      
      if (finalImgHeight > pdfHeight) {
          finalImgHeight = pdfHeight;
          finalImgWidth = pdfHeight * ratio;
      }
      
      const x = (pdfWidth - finalImgWidth) / 2;
      const y = 0; // Align to top

      pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setLoadingState(prev => ({ ...prev, pdf: false }));
    }
  };
  
  const handleUploadToDrive = () => {
    setLoadingState(prev => ({ ...prev, drive: true }));
    // In a real application, this would trigger the Google Drive API upload flow.
    // This requires OAuth 2.0 authentication which is beyond the scope of this static example.
    console.log("Simulating upload to Google Drive...");
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, drive: false }));
      alert(`Invoice ${invoice.invoiceNumber} has been "uploaded" to Google Drive! (Simulation)`);
    }, 2000);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 lg:mb-0">
            <InvoiceForm
              invoice={invoice}
              onDataChange={handleDataChange}
              onCompanyChange={handleCompanyChange}
              onClientChange={handleClientChange}
              onItemChange={handleItemChange}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
          </div>
          {/* Preview and Actions Section */}
          <div className="sticky top-8 self-start">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-700">Preview</h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportPDF}
                  disabled={loadingState.pdf}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:bg-red-400"
                >
                  {loadingState.pdf ? 'Generating...' : <><PdfIcon /> Export PDF</>}
                </button>
                <button
                  onClick={handleUploadToDrive}
                  disabled={loadingState.drive}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-blue-400"
                >
                  {loadingState.drive ? 'Uploading...' : <><GoogleDriveIcon /> Save to Drive</>}
                </button>
              </div>
            </div>
            <div ref={previewRef} className="rounded-xl shadow-lg overflow-y-auto max-h-[80vh]">
                <InvoicePreview invoice={invoice} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
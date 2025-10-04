
import React, { useState, useRef, useCallback } from 'react';
import { InvoiceData, LineItem } from './types';
import InvoiceForm from './components/InvoiceForm';
// FIX: The component was not exported as default. It is now imported as a named export.
import { InvoicePreview } from './components/InvoicePreview';
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
    company: {
      name: 'Curators Travel Co., Ltd.',
      address: '6F-2, No. 35, Sec. 1, Chengde Rd.,\nDatong Dist., 103613\nTaipei City, Taiwan',
      email: 'irwin@curatorstravel.com',
      phone: '+886 277 515 076'
    },
    client: { 
      name: 'Park Hyatt HangZhou', 
      address: 'No. 1366 Qianjiang Road\nHangzhou, Zhejiang, China, 310020', 
      email: '' 
    },
    invoiceNumber: 'COT2025-04-30',
    date: '2025-04-30',
    dueDate: '2025-06-30',
    items: [
      { id: '1', description: 'Commission #HY0009275814', quantity: 1, price: 188.80 },
      { id: '2', description: 'Commission #HY0054408812', quantity: 1, price: 446.00 },
      { id: '3', description: 'Commission #HY0024698305', quantity: 1, price: 387.60 },
      { id: '4', description: 'Commission #HY0048495186', quantity: 1, price: 228.80 },
    ],
    taxRate: 6.0,
    currency: '¥',
  });

  const [loadingState, setLoadingState] = useState({ pdf: false, drive: false });
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDataChange = useCallback(<K extends keyof Omit<InvoiceData, 'items' | 'client'>>(key: K, value: InvoiceData[K]) => {
    setInvoice(prev => ({ ...prev, [key]: value }));
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
      description: 'New Commission',
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
          backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // A4 aspect ratio
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasRatio = canvasWidth / canvasHeight;
      const pdfRatio = pdfWidth / pdfHeight;

      let finalImgWidth, finalImgHeight;

      // Fit the image to the A4 page, maintaining aspect ratio
      if (canvasRatio > pdfRatio) {
        finalImgWidth = pdfWidth;
        finalImgHeight = pdfWidth / canvasRatio;
      } else {
        finalImgHeight = pdfHeight;
        finalImgWidth = pdfHeight * canvasRatio;
      }
      
      const x = (pdfWidth - finalImgWidth) / 2;
      const y = 0;

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
            <div className="rounded-xl shadow-lg overflow-hidden">
                <div ref={previewRef} className="overflow-y-auto max-h-[80vh] bg-white">
                  <InvoicePreview invoice={invoice} />
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

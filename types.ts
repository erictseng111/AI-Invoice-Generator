export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Company {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface Client {
  name: string;
  address: string;
  email: string;
}

export interface InvoiceData {
  company: Company;
  client: Client;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  notes: string;
  taxRate: number;
  currency: string;
}
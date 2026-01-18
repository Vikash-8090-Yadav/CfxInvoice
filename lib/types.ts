export enum InvoiceStatus {
  Pending = 0,
  Paid = 1,
  Overdue = 2,
  Cancelled = 3,
}

export interface Invoice {
  invoiceId: bigint;
  freelancer: string;
  client: string;
  amount: bigint;
  dueDate: bigint;
  status: InvoiceStatus;
  description: string;
  exists: boolean;
  createdAt: bigint;
  paidAt: bigint;
}

export interface InvoiceFormData {
  client: string;
  amount: string;
  dueDate: string;
  description: string;
}


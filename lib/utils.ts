import { InvoiceStatus } from './types';

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatCFX(amount: bigint): string {
  const cfx = Number(amount) / 1e18;
  return cfx.toFixed(4);
}

export function formatCFXFromWei(wei: bigint): string {
  return formatCFX(wei);
}

export function parseCFXToWei(cfx: string): bigint {
  const amount = parseFloat(cfx);
  if (isNaN(amount)) return BigInt(0);
  return BigInt(Math.floor(amount * 1e18));
}

export function formatDate(timestamp: bigint | number): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(timestamp: bigint | number): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case InvoiceStatus.Paid:
      return 'bg-green-100 text-green-800';
    case InvoiceStatus.Overdue:
      return 'bg-red-100 text-red-800';
    case InvoiceStatus.Cancelled:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusLabel(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.Pending:
      return 'Pending';
    case InvoiceStatus.Paid:
      return 'Paid';
    case InvoiceStatus.Overdue:
      return 'Overdue';
    case InvoiceStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}


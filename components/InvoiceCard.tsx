'use client';

import { Invoice, InvoiceStatus } from '@/lib/types';
import {
  formatAddress,
  formatCFXFromWei,
  formatDate,
  formatDateTime,
  getStatusColor,
  getStatusLabel,
} from '@/lib/utils';
import { payInvoice, cancelInvoice, markAsOverdue } from '@/lib/contract';
import { useWallet } from './WalletProvider';
import { useState } from 'react';

interface InvoiceCardProps {
  invoice: Invoice;
  onUpdate: () => void;
}

export function InvoiceCard({ invoice, onUpdate }: InvoiceCardProps) {
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);

  const isFreelancer = account?.toLowerCase() === invoice.freelancer.toLowerCase();
  const isClient = account?.toLowerCase() === invoice.client.toLowerCase();
  const canPay = isClient && (invoice.status === InvoiceStatus.Pending || invoice.status === InvoiceStatus.Overdue);
  const canCancel = isFreelancer && (invoice.status === InvoiceStatus.Pending || invoice.status === InvoiceStatus.Overdue);
  const canMarkOverdue = invoice.status === InvoiceStatus.Pending && Date.now() / 1000 > Number(invoice.dueDate);

  const handlePay = async () => {
    if (!account) return;
    try {
      setLoading(true);
      await payInvoice(invoice.invoiceId, invoice.amount);
      alert('Invoice paid successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Error paying invoice:', error);
      alert(error.message || 'Failed to pay invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!account) return;
    try {
      setLoading(true);
      await cancelInvoice(invoice.invoiceId);
      alert('Invoice cancelled successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Error cancelling invoice:', error);
      alert(error.message || 'Failed to cancel invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkOverdue = async () => {
    try {
      setLoading(true);
      await markAsOverdue(invoice.invoiceId);
      alert('Invoice marked as overdue!');
      onUpdate();
    } catch (error: any) {
      console.error('Error marking invoice as overdue:', error);
      alert(error.message || 'Failed to mark invoice as overdue');
    } finally {
      setLoading(false);
    }
  };

  // Status banner configuration
  const getStatusBanner = () => {
    switch (invoice.status) {
      case InvoiceStatus.Paid:
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          icon: '✓',
          iconColor: 'text-green-600',
          title: 'PAID',
          titleColor: 'text-green-800',
          message: `This invoice has been paid. Payment received on ${invoice.paidAt > 0n ? formatDateTime(invoice.paidAt) : 'recently'}.`,
        };
      case InvoiceStatus.Overdue:
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          icon: '⚠️',
          iconColor: 'text-red-600',
          title: 'OVERDUE',
          titleColor: 'text-red-800',
          message: `This invoice is overdue. The due date was ${formatDateTime(invoice.dueDate)}.`,
        };
      case InvoiceStatus.Pending:
        const isOverdue = Date.now() / 1000 > Number(invoice.dueDate);
        if (isOverdue) {
          return {
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-300',
            icon: '⏰',
            iconColor: 'text-orange-600',
            title: 'PENDING - DUE DATE PASSED',
            titleColor: 'text-orange-800',
            message: `This invoice is still pending but the due date has passed. Consider marking it as overdue.`,
          };
        }
        return null; // No banner for normal pending
      case InvoiceStatus.Cancelled:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          icon: '✕',
          iconColor: 'text-gray-600',
          title: 'CANCELLED',
          titleColor: 'text-gray-800',
          message: 'This invoice has been cancelled by the freelancer.',
        };
      default:
        return null;
    }
  };

  const statusBanner = getStatusBanner();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
      {/* Status Banner - Prominent display for Paid/Overdue/Cancelled */}
      {statusBanner && (
        <div className={`mb-4 p-4 rounded-lg border-2 ${statusBanner.bgColor} ${statusBanner.borderColor}`}>
          <div className="flex items-start space-x-3">
            <span className={`text-2xl font-bold ${statusBanner.iconColor}`}>
              {statusBanner.icon}
            </span>
            <div className="flex-1">
              <h4 className={`text-lg font-bold ${statusBanner.titleColor} mb-1`}>
                {statusBanner.title}
              </h4>
              <p className={`text-sm ${statusBanner.titleColor} opacity-90`}>
                {statusBanner.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Invoice #{invoice.invoiceId.toString()}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                invoice.status
              )}`}
            >
              Status: {getStatusLabel(invoice.status)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {formatCFXFromWei(invoice.amount)} CFX
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-3">
        {isFreelancer && (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            You are: Freelancer (You Receive Payment)
          </span>
        )}
        {isClient && (
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
            You are: Client (You Pay Invoice)
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div>
          <span className="font-semibold">Freelancer:</span>{' '}
          {formatAddress(invoice.freelancer)}
          {isFreelancer && <span className="text-blue-600 ml-1">(You)</span>}
        </div>
        <div>
          <span className="font-semibold">Client:</span>{' '}
          {formatAddress(invoice.client)}
          {isClient && <span className="text-purple-600 ml-1">(You)</span>}
        </div>
        <div>
          <span className="font-semibold">Due Date:</span> {formatDateTime(invoice.dueDate)}
        </div>
        <div>
          <span className="font-semibold">Created:</span>{' '}
          {formatDateTime(invoice.createdAt)}
        </div>
        {invoice.status === InvoiceStatus.Paid && invoice.paidAt > 0n && (
          <div>
            <span className="font-semibold">Paid:</span> {formatDateTime(invoice.paidAt)}
          </div>
        )}
      </div>

      {invoice.description && (
        <div className="mb-4">
          <p className="text-gray-700 text-sm">{invoice.description}</p>
        </div>
      )}

      {/* Payment Status Info for Freelancer */}
      {isFreelancer && (
        <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
          {invoice.status === InvoiceStatus.Paid ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-semibold text-xl">✓</span>
                <span className="text-sm font-bold text-gray-800">
                  Payment Received!
                </span>
              </div>
              <p className="text-sm text-gray-700 pl-7">
                The client has paid {formatCFXFromWei(invoice.amount)} CFX. The funds have been automatically transferred to your wallet. Check your wallet balance.
              </p>
            </div>
          ) : invoice.status === InvoiceStatus.Pending || invoice.status === InvoiceStatus.Overdue ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600 font-semibold text-xl">⏳</span>
                <span className="text-sm font-bold text-gray-800">
                  Waiting for Client Payment
                </span>
              </div>
              <p className="text-sm text-gray-700 pl-7">
                <strong>No action needed from you!</strong> When the client clicks "Pay Invoice", the {formatCFXFromWei(invoice.amount)} CFX will be automatically transferred directly to your wallet. Payment is instant and automatic.
              </p>
            </div>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-4 border-t">
        {canPay && (
          <button
            onClick={handlePay}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Invoice'}
          </button>
        )}
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Cancel Invoice'}
          </button>
        )}
        {canMarkOverdue && (
          <button
            onClick={handleMarkOverdue}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Mark as Overdue'}
          </button>
        )}
      </div>
    </div>
  );
}


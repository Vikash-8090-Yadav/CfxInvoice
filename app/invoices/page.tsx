'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { InvoiceCard } from '@/components/InvoiceCard';
import { useWallet } from '@/components/WalletProvider';
import { fetchFreelancerInvoices, fetchClientInvoices, fetchInvoice } from '@/lib/contract';
import { Invoice } from '@/lib/types';

export default function InvoicesPage() {
  const { account, connectWallet } = useWallet();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  useEffect(() => {
    if (account) {
      loadInvoices();
    } else {
      setLoading(false);
    }
  }, [account, filter]);

  const loadInvoices = async () => {
    if (!account) return;

    try {
      setLoading(true);
      const invoiceIds = new Set<bigint>();

      if (filter === 'all' || filter === 'sent') {
        const freelancerIds = await fetchFreelancerInvoices(account);
        freelancerIds.forEach((id) => invoiceIds.add(id));
      }

      if (filter === 'all' || filter === 'received') {
        const clientIds = await fetchClientInvoices(account);
        clientIds.forEach((id) => invoiceIds.add(id));
      }

      const invoicePromises = Array.from(invoiceIds).map((id) => fetchInvoice(id));
      const fetchedInvoices = await Promise.all(invoicePromises);
      
      // Sort by creation date, newest first
      fetchedInvoices.sort((a, b) => {
        const dateA = Number(a.createdAt);
        const dateB = Number(b.createdAt);
        return dateB - dateA;
      });

      setInvoices(fetchedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    loadInvoices();
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Please connect your wallet to view your invoices
            </p>
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Connect Wallet
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Invoices</h1>
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Invoices
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'sent'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Created by Me (I Receive Payment)
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'received'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sent to Me (I Pay)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">No invoices found</p>
            <a
              href="/create"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Create Your First Invoice
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.invoiceId.toString()}
                invoice={invoice}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


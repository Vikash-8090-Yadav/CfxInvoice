'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/components/WalletProvider';
import { Navbar } from '@/components/Navbar';
import { getContract, getProvider } from '@/lib/contract';
import { formatCFXFromWei } from '@/lib/utils';

export default function Home() {
  const { account, connectWallet } = useWallet();
  const [totalInvoices, setTotalInvoices] = useState<string>('0');

  useEffect(() => {
    async function fetchTotalInvoices() {
      try {
        const contract = await getContract();
        const total = await contract.getTotalInvoices();
        setTotalInvoices(total.toString());
      } catch (error) {
        console.error('Error fetching total invoices:', error);
      }
    }
    fetchTotalInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Manage Your Invoices
            <br />
            <span className="text-primary-600">On the Blockchain</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A transparent, secure, and decentralized invoice management system
            built on Conflux eSpace
          </p>
          
          {!account && (
            <button
              onClick={connectWallet}
              className="px-8 py-3 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 transition shadow-lg"
            >
              Get Started
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">{totalInvoices}</div>
            <div className="text-gray-600">Total Invoices</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">Transparent</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Available</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">🔒 Secure</h4>
              <p className="text-gray-600">
                All invoices are stored on-chain with cryptographic security
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">👁️ Transparent</h4>
              <p className="text-gray-600">
                All parties can verify invoice status and payment history
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">⚡ Fast</h4>
              <p className="text-gray-600">
                Instant payment processing with automated status updates
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">💰 Cost-Effective</h4>
              <p className="text-gray-600">
                Low transaction fees on Conflux eSpace network
              </p>
            </div>
          </div>
        </div>

        {account && (
          <div className="mt-8 text-center">
            <Link
              href="/create"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg"
            >
              Create New Invoice
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}


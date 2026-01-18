'use client';

import Link from 'next/link';
import { useWallet } from './WalletProvider';

export function Navbar() {
  const { account, connectWallet, disconnectWallet } = useWallet();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              CfxInvoice
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-primary-600 transition"
              >
                Home
              </Link>
              <Link
                href="/invoices"
                className="text-gray-600 hover:text-primary-600 transition"
              >
                My Invoices
              </Link>
              <Link
                href="/create"
                className="text-gray-600 hover:text-primary-600 transition"
              >
                Create Invoice
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {account ? (
              <>
                <span className="text-sm text-gray-600 font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


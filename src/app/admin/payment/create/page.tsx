'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import axios from 'axios';

interface Transaction {
  id: number;
  order_id: string;
  amount: number;
  status: string;
}

interface SnapOptions {
  onSuccess: () => void;
  onPending: () => void;
  onError: () => void;
  onClose: () => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: SnapOptions) => void;
    };
  }
}

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Ambil token login dari localStorage atau context
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Ganti dengan mekanisme token yang sesuai jika perlu
  const apiUrl = 'http://localhost:8000/api'; // Ganti jika berbeda

  const createTransaction = async () => {
    if (!token) {
      alert('Anda belum login!');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${apiUrl}/payment/create`,
        { amount: parseInt(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const snapToken = response.data.token;

      if (typeof window !== 'undefined' && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            alert('Pembayaran berhasil!');
            fetchTransactions();
          },
          onPending: () => alert('Transaksi menunggu pembayaran...'),
          onError: () => alert('Terjadi kesalahan dalam pembayaran'),
          onClose: () => alert('Popup ditutup tanpa menyelesaikan pembayaran'),
        });
      }
    } catch (error) {
      console.error(error);
      alert('Gagal membuat transaksi');
    } finally {
      setLoading(false);
    }
  };

  // Gunakan useCallback untuk menjaga referensi fungsi tetap sama selama lifecycle komponen
  const fetchTransactions = useCallback(async () => {
    if (!token) {
      alert('Anda belum login!');
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Gagal mengambil transaksi:', error);
    }
  }, [token]); // Token menjadi dependency untuk fungsi fetchTransactions

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [fetchTransactions, token]); // fetchTransactions dan token sebagai dependency

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* ✅ Tambahkan Midtrans Snap.js Script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-pzwGtMLru2fT6Uhu" // Ganti dengan real client key dari Midtrans Dashboard
        strategy="afterInteractive"
      />

      <h1 className="text-2xl font-bold mb-4">Pengujian Pembayaran Midtrans</h1>

      <div className="mb-6">
        <label className="block mb-1 font-semibold">Nominal Pembayaran</label>
        <input
          type="number"
          className="border px-3 py-2 w-full"
          placeholder="Contoh: 10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={createTransaction}
          className="bg-blue-600 hover:bg-blue-700 text-white mt-3 px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !amount}
        >
          {loading ? 'Memproses...' : 'Bayar Sekarang'}
        </button>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Daftar Transaksi</h2>
      <ul className="space-y-3">
        {transactions.length === 0 && <p>Belum ada transaksi.</p>}
        {transactions.map((tx) => (
          <li key={tx.id} className="border p-3 rounded shadow-sm">
            <div><strong>Order ID:</strong> {tx.order_id}</div>
            <div><strong>Amount:</strong> Rp{tx.amount.toLocaleString()}</div>
            <div><strong>Status:</strong> {tx.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentPage;

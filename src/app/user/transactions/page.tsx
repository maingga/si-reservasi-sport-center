"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, CheckCircle, Clock, XCircle } from "lucide-react";

interface Transaction {
  id: number;
  order_id: string;
  amount: number;
  status: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const apiUrl = "http://localhost:8000/api";

  const fetchTransactions = useCallback(async () => {
    if (!token) {
      toast.error("Anda belum login.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Gagal mengambil data transaksi.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatPrice = (price: number) => price.toLocaleString("id-ID");

  const statusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" /> Berhasil
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
            <Clock className="w-4 h-4" /> Menunggu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400">
            <XCircle className="w-4 h-4" /> Gagal
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Riwayat Transaksi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Lihat daftar transaksi pembayaran Anda.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">Memuat...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          Tidak ada transaksi ditemukan.
        </div>
      ) : (
        // Pembungkus overflow-x-auto agar scroll horizontal tetap ada
        <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
          {/* Tabel untuk layar md ke atas */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 hidden md:table">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Jumlah</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{tx.order_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    Rp {formatPrice(tx.amount)}
                  </td>
                  <td className="px-4 py-3">{statusBadge(tx.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tampilan card untuk layar kecil */}
          <div className="md:hidden bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 rounded-xl p-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 mb-4 last:mb-0 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
              >
                <div className="mb-2">
                  <span className="block text-xs font-semibold text-gray-600 dark:text-gray-300">Order ID</span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">{tx.order_id}</span>
                </div>
                <div className="mb-2">
                  <span className="block text-xs font-semibold text-gray-600 dark:text-gray-300">Jumlah</span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">Rp {formatPrice(tx.amount)}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-600 dark:text-gray-300">Status</span>
                  <span className="text-sm">{statusBadge(tx.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

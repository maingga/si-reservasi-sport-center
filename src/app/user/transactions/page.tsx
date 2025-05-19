"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  id: number;
  created_at: string;
  amount: number;
  status: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get<Transaction[]>("http://localhost:8000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Gagal ambil transaksi:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTransactions();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      alert("Transaksi berhasil dihapus");
    } catch (err) {
      alert("Gagal menghapus transaksi");
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

      {transactions.length === 0 ? (
        <p>Tidak ada transaksi ditemukan.</p>
      ) : (
        <table className="w-full text-left text-gray-700 text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID Transaksi</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Jumlah</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.id}>
                <td className="p-2 border">{trx.id}</td>
                <td className="p-2 border">{new Date(trx.created_at).toLocaleDateString()}</td>
                <td className="p-2 border">Rp {trx.amount?.toLocaleString()}</td>
                <td className="p-2 border capitalize">{trx.status}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleDelete(trx.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

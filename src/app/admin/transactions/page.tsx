'use client'

import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'

type Transaction = {
  id: string
  user_id: number
  order_id: string
  user?: {
    name: string
  }
  amount: number
  status: string
  created_at: string
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setTransactions(res.data)
      } catch (err) {
        console.error(err)
        setError('Gagal memuat data transaksi.')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Yakin hapus transaksi?',
      text: 'Tindakan ini tidak bisa dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: '#1f2937',
      color: '#fff',
    })

    if (confirm.isConfirmed) {
      const token = localStorage.getItem('token')
      try {
        await api.delete(`/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTransactions(transactions.filter((t) => t.id !== id))
        toast.success('Transaksi berhasil dihapus.')
      } catch (error) {
        console.error('Gagal menghapus transaksi', error)
        toast.error('Gagal menghapus transaksi.')
      }
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('token')
    try {
      await api.put(
        `/transactions/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setTransactions(
        transactions.map((t) =>
          t.id === id ? { ...t, status: newStatus } : t
        )
      )
      toast.success('Status diperbarui.')
    } catch (error) {
      console.error('Gagal memperbarui status transaksi', error)
      toast.error('Gagal memperbarui status.')
    }
  }

  if (loading) return <div className="text-center p-4 text-gray-300">Loading...</div>
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Daftar Transaksi Pembayaran</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 border dark:border-gray-700">ID</th>
              <th className="p-3 border dark:border-gray-700">Nama Pengguna</th>
              <th className="p-3 border dark:border-gray-700">Order ID</th>
              <th className="p-3 border dark:border-gray-700">Jumlah</th>
              <th className="p-3 border dark:border-gray-700">Status</th>
              <th className="p-3 border dark:border-gray-700">Tanggal</th>
              <th className="p-3 border dark:border-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="p-3 border dark:border-gray-700">{transaction.id}</td>
                <td className="p-3 border dark:border-gray-700">{transaction.user?.name || 'Tidak diketahui'}</td>
                <td className="p-3 border dark:border-gray-700">{transaction.order_id}</td>
                <td className="p-3 border dark:border-gray-700">Rp {transaction.amount.toLocaleString('id-ID')}</td>
                <td className="p-3 border dark:border-gray-700">
                  <select
                    value={transaction.status}
                    onChange={(e) => handleUpdateStatus(transaction.id, e.target.value)}
                    className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
                <td className="p-3 border dark:border-gray-700">
                  {new Date(transaction.created_at).toLocaleString('id-ID')}
                </td>
                <td className="p-3 border dark:border-gray-700 flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/transactions/${transaction.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Lihat
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionsPage

'use client'

import React, { useEffect, useState } from 'react'
import { api } from '../../../utils/api'
import { useParams } from 'next/navigation'

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

const TransactionDetailPage = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get(`/transactions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setTransaction(res.data)
      } catch (err) {
        console.error(err)
        setError('Gagal memuat detail transaksi.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTransactionDetail()
  }, [id])

  if (loading) return <div className="text-center text-gray-500 dark:text-gray-400 p-6">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>
  if (!transaction) return <div className="text-center text-gray-500 p-6">Data transaksi tidak ditemukan.</div>

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Detail Transaksi</h1>

      <div className="space-y-4 text-gray-700 dark:text-gray-200">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">ID Transaksi:</span>
          <span>{transaction.id}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Nama Pengguna:</span>
          <span>{transaction.user?.name || 'Tidak diketahui'}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Order ID:</span>
          <span>{transaction.order_id}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Jumlah:</span>
          <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Status:</span>
          <span className={`px-2 py-1 rounded text-sm font-semibold
            ${transaction.status === 'success' ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-white'
              : transaction.status === 'pending' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-white'
              : 'bg-red-200 text-red-800 dark:bg-red-600 dark:text-white'}`}>
            {transaction.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Tanggal:</span>
          <span>{new Date(transaction.created_at).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => window.history.back()}
          className="inline-block bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded transition"
        >
          Kembali
        </button>
      </div>
    </div>
  )
}

export default TransactionDetailPage

'use client'

import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { Button } from '../../../components/ui/button'

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
    <div>
      <PageBreadcrumb pageTitle="Manajemen Transaksi" />
      <div className="space-y-">
        <ComponentCard title="Daftar Transaksi">
          <div className="md:col-span-5 -mt-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1100px]">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          ID Transaksi
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Nama Pengguna
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Order ID
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Jumlah
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Status
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Tanggal
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Aksi
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90">
                            {transaction.id}
                          </TableCell>

                          <TableCell className="px-5 py-4 text-start">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {transaction.user?.name || 'Tidak diketahui'}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">User ID #{transaction.user_id}</span>
                            </div>
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {transaction.order_id}
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            Rp {transaction.amount.toLocaleString('id-ID')}
                          </TableCell>

                          <TableCell className="px-4 py-3 text-start">
                            <select
                              value={transaction.status}
                              onChange={(e) => handleUpdateStatus(transaction.id, e.target.value)}
                              className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="success">Success</option>
                              <option value="failed">Failed</option>
                            </select>
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {new Date(transaction.created_at).toLocaleString('id-ID')}
                          </TableCell>

                          <TableCell className="px-4 py-3 text-start">
                            <div className="flex gap-2 flex-wrap">
                              <Button size="sm" onClick={() => router.push(`/admin/transactions/${transaction.id}`)}>
                                Lihat
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(transaction.id)}>
                                Hapus
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  )
}

export default TransactionsPage
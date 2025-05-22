'use client'
import { useEffect, useState } from "react"
import { api } from "@/app/utils/api"
import Link from "next/link"
import { Dialog } from "@headlessui/react"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import ComponentCard from "@/components/common/ComponentCard"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Badge from "@/components/ui/badge/Badge"


interface Lapangan {
  id: number
  name: string
  price: number
  location: string
  capacity: number
  type: 'Futsal' | 'Badminton' | 'Basket' | 'Tennis' | 'Voli'
  status: 'Available' | 'Booked'
  photo?: string
}

export default function AdminLapanganList() {
  const [lapanganList, setLapanganList] = useState<Lapangan[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  useEffect(() => {
    fetchLapangan()
  }, [])

  const fetchLapangan = async () => {
    setLoading(true)
    try {
      const res = await api.get('/lapangan')
      setLapanganList(res.data)
    } catch (err) {
      console.error("Gagal mengambil data lapangan:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'success'
      case 'Booked':
        return 'error'
      default:
        return 'warning'
    }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    setLoading(true)
    try {
      await api.delete(`/lapangan/${deleteId}`)
      setLapanganList(prev => prev.filter(item => item.id !== deleteId))
      setShowDeleteModal(false)
      setDeleteId(null)
    } catch (err) {
      console.error("Gagal menghapus lapangan:", err)
      alert("Gagal menghapus lapangan.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Manajemen Lapangan" />
      <div className="space-y-6">
        <ComponentCard title="Daftar Lapangan">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-full">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Harga</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lokasi</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kapasitas</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Jenis</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Aksi</TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {loading && (
                      <TableRow>
                        <TableCell className="px-5 py-4 text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && lapanganList.length === 0 && (
                      <TableRow>
                        <TableCell className="px-5 py-4 text-center">
                          Tidak ada lapangan tersedia
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && lapanganList.map((lapangan) => (
                      <TableRow key={lapangan.id}>
                        <TableCell className="px-5 py-4 text-start">{lapangan.name}</TableCell>
                        <TableCell className="px-5 py-4 text-start">Rp {lapangan.price.toLocaleString()}</TableCell>
                        <TableCell className="px-5 py-4 text-start">{lapangan.location}</TableCell>
                        <TableCell className="px-5 py-4 text-start">{lapangan.capacity} orang</TableCell>
                        <TableCell className="px-5 py-4 text-start">{lapangan.type}</TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <Badge
                            size="sm"
                            color={getStatusColor(lapangan.status)}>{lapangan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/admin/lapangan/update/${lapangan.id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-md"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/admin/lapangan/detail/${lapangan.id}`}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-md"
                            >
                              Detail
                            </Link>
                            <button
                              onClick={() => {
                                setDeleteId(lapangan.id)
                                setShowDeleteModal(true)
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md"
                            >
                              Hapus
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6">
            <Dialog.Title className="text-lg font-semibold">Konfirmasi Hapus</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-300 mb-4">
              Apakah kamu yakin ingin menghapus lapangan ini? Tindakan ini tidak dapat dibatalkan.
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-sm rounded-md"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
              >
                {loading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

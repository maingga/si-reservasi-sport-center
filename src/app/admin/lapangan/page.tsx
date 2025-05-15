'use client'
import { useEffect, useState } from "react"
import { api } from "../../utils/api"
import Link from "next/link"
import { Dialog } from "@headlessui/react"

type Lapangan = {
  id: number;
  name: string;
  price: number;
  location: string;
  capacity: number;
  type: 'Futsal' | 'Badminton' | 'Basket' | 'Tennis' | 'Voli';
  status: 'available' | 'booked';
  photo?: string;
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
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h1 className="text-3xl font-semibold mb-8">Daftar Lapangan</h1>

      {loading ? (
        <p className="text-center py-10">Loading data lapangan...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Harga</th>
                <th className="px-6 py-3 text-left">Lokasi</th>
                <th className="px-6 py-3 text-left">Kapasitas</th>
                <th className="px-6 py-3 text-left">Jenis</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lapanganList.map((lapangan) => (
                <tr key={lapangan.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">{lapangan.name}</td>
                  <td className="px-6 py-4">Rp {lapangan.price.toLocaleString()}</td>
                  <td className="px-6 py-4">{lapangan.location}</td>
                  <td className="px-6 py-4">{lapangan.capacity} orang</td>
                  <td className="px-6 py-4">{lapangan.type}</td>
                  <td className={`px-6 py-4 font-semibold ${lapangan.status === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                    {lapangan.status}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <Link
                      href={`/admin/lapangan/update/${lapangan.id}`}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/lapangan/detail/${lapangan.id}`}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700"
                    >
                      Detail
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteId(lapangan.id)
                        setShowDeleteModal(true)
                      }}
                      className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold">Konfirmasi Hapus</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              Apakah Anda yakin ingin menghapus lapangan ini? Tindakan ini tidak dapat dibatalkan.
            </Dialog.Description>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
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

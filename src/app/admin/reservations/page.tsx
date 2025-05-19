'use client'

import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { Check, X, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

interface Reservation {
  id: number
  reservation_date: string
  start_time: string
  end_time: string
  lapangan: {
    name: string
  }
  user?: {
    name: string
  }
  status: string
}

const AdminReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get('/reservations')
        setReservations(res.data)
      } catch (error) {
        console.error('Gagal memuat data reservasi:', error)
        Swal.fire('Error', 'Gagal memuat data reservasi!', 'error')
      }
    }

    fetchReservations()
  }, [])

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/reservations/${id}`, { status })
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id ? { ...reservation, status } : reservation
        )
      )
      Swal.fire('Berhasil!', 'Status berhasil diperbarui!', 'success')
    } catch (error) {
      Swal.fire('Gagal', 'Gagal memperbarui status.', 'error')
      console.error(error)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Reservasi ini akan dihapus secara permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/reservations/${id}`)
        setReservations((prev) => prev.filter((res) => res.id !== id))
        Swal.fire('Terhapus!', 'Reservasi berhasil dihapus.', 'success')
      } catch (error) {
        Swal.fire('Gagal', 'Gagal menghapus reservasi.', 'error')
        console.error(error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-white'
      case 'cancelled':
        return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-white'
      default:
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-white'
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      <h1 className="text-3xl font-bold mb-6">Daftar Reservasi</h1>

      {reservations.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Tidak ada reservasi untuk ditampilkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all"
            >
              <h2 className="text-xl font-semibold mb-2">
                {reservation.lapangan?.name ?? 'Lapangan Tidak Diketahui'}
              </h2>
              <p><strong>Tanggal:</strong> {reservation.reservation_date}</p>
              <p><strong>Waktu:</strong> {reservation.start_time} - {reservation.end_time}</p>
              {reservation.user && (
                <p><strong>Pengguna:</strong> {reservation.user.name}</p>
              )}
              <p className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                  {reservation.status}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                  <Check size={16} /> Konfirmasi
                </button>
                <button
                  onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  <X size={16} /> Batalkan
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminReservationList

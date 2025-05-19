'use client'

import React, { useEffect, useState } from 'react'
import { api } from '../../../utils/api'
import { useRouter } from 'next/navigation'

interface Lapangan {
  id: number
  name: string
}

const CreateReservationPage = () => {
  const [lapanganList, setLapanganList] = useState<Lapangan[]>([])
  const [lapanganId, setLapanganId] = useState<string>('')
  const [tanggal, setTanggal] = useState<string>('')
  const [jamMulai, setJamMulai] = useState<string>('')
  const [durasi, setDurasi] = useState<number>(1)
  const router = useRouter()

  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        const res = await api.get('/lapangan')
        setLapanganList(res.data)
      } catch (error) {
        console.error('Gagal memuat daftar lapangan:', error)
      }
    }
    fetchLapangan()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const startTime = new Date(`${tanggal}T${jamMulai}:00`)
    const endTime = new Date(startTime.getTime() + durasi * 60 * 60 * 1000)

    try {
      await api.post('/reservations', {
        lapangan_id: lapanganId,
        reservation_date: tanggal,
        start_time: startTime.toISOString().slice(11, 16),
        end_time: endTime.toISOString().slice(11, 16),
      })

      alert('Reservasi berhasil dibuat!')
      router.push('/admin/reservations')
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('400')) {
        alert('Waktu yang dipilih sudah terpesan.')
      } else {
        alert('Gagal membuat reservasi.')
      }
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Buat Reservasi Baru</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium">Lapangan</label>
          <select
            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lapanganId}
            onChange={(e) => setLapanganId(e.target.value)}
            required
          >
            <option value="">-- Pilih Lapangan --</option>
            {lapanganList.map((lapangan) => (
              <option key={lapangan.id} value={lapangan.id}>
                {lapangan.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Tanggal</label>
          <input
            type="date"
            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Jam Mulai</label>
          <input
            type="time"
            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Durasi (jam)</label>
          <input
            type="number"
            min={1}
            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={durasi}
            onChange={(e) => setDurasi(Number(e.target.value))}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Simpan
        </button>
      </form>
    </div>
  )
}

export default CreateReservationPage

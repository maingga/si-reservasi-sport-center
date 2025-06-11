'use client'

import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import Badge from '../../../components/ui/badge/Badge'
import Swal from 'sweetalert2'
import { Button } from '../../../components/ui/button'

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success'
      case 'cancelled':
        return 'error'
      default:
        return 'warning'
    }
  }

  const handleConfirm = async (id: number) => {
    try {
      await api.put(`/reservations/${id}`, { status: 'confirmed' })
      Swal.fire('Berhasil', `Reservasi #${id} dikonfirmasi.`, 'success')
      const res = await api.get('/reservations')
      setReservations(res.data)
    } catch (error) {
      Swal.fire('Gagal', 'Reservasi gagal dikonfirmasi.', 'error')
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await api.put(`/reservations/${id}`, { status: 'cancelled' })
      Swal.fire('Dibatalkan', `Reservasi #${id} dibatalkan.`, 'info')
      const res = await api.get('/reservations')
      setReservations(res.data)
    } catch (error) {
      Swal.fire('Gagal', 'Reservasi gagal dibatalkan.', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: `Reservasi #${id} akan dihapus permanen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/reservations/${id}`)
        Swal.fire('Dihapus!', `Reservasi #${id} telah dihapus.`, 'success')
        const res = await api.get('/reservations')
        setReservations(res.data)
      } catch (error) {
        Swal.fire('Gagal', 'Reservasi tidak bisa dihapus.', 'error')
      }
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Manajemen Reservasi" />
      <div className="space-y-">
        {/* Tabel Pengguna */}
        <ComponentCard title="Daftar Reservasi">
          <div className="mb-4">
            {/* <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari nama/email..."
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-full md:w-64"
            /> */}
          </div>


          {/* Daftar Pengguna (5/7 columns) */}
          <div className="md:col-span-5 -mt-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1100px]">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          User
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Lapangan
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Tanggal
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Waktu
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Status
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Aksi
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {reservations.map((res) => (
                        <TableRow key={res.id}>
                          <TableCell className="px-5 py-4 text-start">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {res.user?.name ?? 'Tidak diketahui'}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">User ID #{res.id}</span>
                            </div>
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {res.lapangan?.name ?? '-'}
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {res.reservation_date}
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <span className="text-sm">{res.start_time} - {res.end_time}</span>
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Badge size="sm" color={getStatusColor(res.status)}>{res.status}</Badge>
                          </TableCell>

                          <TableCell className="px-4 py-3 text-start">
                            <div className="flex gap-2 flex-wrap">
                              {res.status !== 'confirmed' && (
                                <Button size="sm" onClick={() => handleConfirm(res.id)}>Konfirmasi</Button>
                              )}
                              {res.status !== 'cancelled' && (
                                <Button variant="outline" size="sm" onClick={() => handleCancel(res.id)}>Batalkan</Button>
                              )}
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(res.id)}>Hapus</Button>
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

export default AdminReservationList
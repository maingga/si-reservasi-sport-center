"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'
import { Button } from '@/components/ui/button'
import Swal from 'sweetalert2'

interface Lapangan {
  name: string;
}

interface Booking {
  id: number;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: string;
  lapangan: Lapangan | null;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data ? res.data.data : res.data;
        setBookings(data);
        setError(null);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Gagal ambil booking (Axios):", err.message);
          setError("Gagal mengambil data booking dari server. Silakan coba lagi.");
          Swal.fire('Error', 'Gagal mengambil data booking dari server!', 'error')
        } else if (err instanceof Error) {
          console.error("Gagal ambil booking (Error):", err.message);
          setError("Terjadi kesalahan saat mengambil data booking.");
          Swal.fire('Error', 'Terjadi kesalahan saat mengambil data booking!', 'error')
        } else {
          console.error("Gagal ambil booking (Unknown):", err);
          setError("Terjadi kesalahan tidak diketahui.");
          Swal.fire('Error', 'Terjadi kesalahan tidak diketahui!', 'error')
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBookings();
  }, [token]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Yakin ingin membatalkan?',
      text: `Booking #${id} akan dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, batalkan',
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings((prev) => prev.filter((b) => b.id !== id));
        Swal.fire('Dibatalkan!', 'Booking berhasil dibatalkan', 'success')
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Gagal batalkan booking (Axios):", err.message);
          Swal.fire('Gagal', 'Booking gagal dibatalkan!', 'error')
        } else if (err instanceof Error) {
          console.error("Gagal batalkan booking (Error):", err.message);
          Swal.fire('Gagal', 'Terjadi kesalahan saat membatalkan booking!', 'error')
        } else {
          console.error("Gagal batalkan booking (Unknown):", err);
          Swal.fire('Gagal', 'Terjadi kesalahan tidak diketahui!', 'error')
        }
      }
    }
  };

  const handleContinuePayment = (id: number) => {
    router.push(`/user/payment/${id}`);
  };

  const paidStatuses = ["confirmed", "partially_paid", "dp_paid"];

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Sudah dibayar lunas";
      case "partially_paid":
      case "dp_paid":
        return "DP dibayar, menunggu pelunasan";
      case "pending":
        return "Menunggu pembayaran";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return 'success';
      case "partially_paid":
      case "dp_paid":
        return 'warning';
      case "pending":
        return 'warning';
      case "cancelled":
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading)
    return (
      <div>
        <PageBreadcrumb pageTitle="Daftar Booking Saya" />
        <ComponentCard title="Loading...">
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </ComponentCard>
      </div>
    );

  if (error)
    return (
      <div>
        <PageBreadcrumb pageTitle="Daftar Booking Saya" />
        <ComponentCard title="Error">
          <div className="flex justify-center items-center h-48">
            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          </div>
        </ComponentCard>
      </div>
    );

  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Booking Saya" />
      <div className="space-y-6">
        <ComponentCard title="Daftar Booking">
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Tidak ada booking ditemukan.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-full">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
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
                      {bookings.map((booking) => {
                        const statusLower = booking.status.toLowerCase();
                        const isPaid = paidStatuses.includes(statusLower);

                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="px-5 py-4 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {booking.lapangan?.name || "Lapangan tidak diketahui"}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">Booking ID #{booking.id}</span>
                            </TableCell>

                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {format(parseISO(booking.reservation_date), "dd MMMM yyyy")}
                            </TableCell>

                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <span className="text-sm">{booking.start_time} - {booking.end_time}</span>
                            </TableCell>

                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <Badge size="sm" color={getStatusColor(booking.status)}>
                                {getStatusLabel(booking.status)}
                              </Badge>
                            </TableCell>

                            <TableCell className="px-4 py-3 text-start">
                              <div className="flex gap-2 flex-wrap">
                                {statusLower === "pending" ?
                                  (
                                    <>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(booking.id)}
                                      >
                                        Batalkan
                                      </Button>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleContinuePayment(booking.id)}
                                      >
                                        Lanjutkan Pembayaran
                                      </Button>
                                    </>
                                  ) : statusLower === "partially_paid" ? (
                                    <Button
                                      size="sm"
                                      onClick={() => handleContinuePayment(booking.id)}
                                    >
                                      Lanjutkan Pembayaran
                                    </Button>
                                  ) : (
                                    <span className="text-gray-500 dark:text-gray-400 italic text-sm px-3 py-1">
                                      {isPaid ? "Sudah dibayar" : "Tidak bisa dibatalkan"}
                                    </span>
                                  )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
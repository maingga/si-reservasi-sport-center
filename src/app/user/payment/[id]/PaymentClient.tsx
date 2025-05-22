"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Script from "next/script";

interface Reservation {
  id: number;
  lapangan_name: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  price: number | null;
  status: string;
}

interface SnapOptions {
  onSuccess: () => void;
  onPending: () => void;
  onError: () => void;
  onClose: () => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: SnapOptions) => void;
    };
  }
}

interface PaymentClientProps {
  reservationId: string;
}

export default function PaymentClient({ reservationId }: PaymentClientProps) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const apiUrl = "http://localhost:8000/api";

  const fetchReservation = useCallback(async () => {
    if (!token || !reservationId) {
      toast.error("Anda belum login atau data reservasi tidak lengkap.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservation(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data reservasi.");
    } finally {
      setLoading(false);
    }
  }, [token, reservationId]);

  useEffect(() => {
    if (token && reservationId) {
      fetchReservation();
    }
  }, [token, reservationId, fetchReservation]);

  const handlePayment = async () => {
    if (!reservation) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}/payment/create`,
        {
          reservation_id: reservation.id,
          amount: reservation.price ?? 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const snapToken = res.data.token;
      if (!snapToken) {
        toast.error("Gagal mendapatkan token pembayaran.");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined" && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async () => {
            toast.success("Pembayaran berhasil! Mengupdate status...");

            try {
              await axios.put(
                `${apiUrl}/reservations/${reservation.id}/status`,
                { status: "confirmed" },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              toast.success("Status reservasi diperbarui!");
              window.location.href = "/user/transactions";
            } catch (error) {
              console.error(error);
              toast.error("Gagal memperbarui status reservasi.");
            }
          },
          onPending: () => {
            toast("Pembayaran dalam proses, silakan selesaikan pembayaran.");
          },
          onError: () => {
            toast.error("Terjadi kesalahan saat pembayaran.");
          },
          onClose: () => {
            toast("Anda menutup popup pembayaran tanpa menyelesaikan.");
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memulai pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null | undefined) =>
    price !== null && price !== undefined ? price.toLocaleString() : "-";

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Pembayaran";
      case "confirmed":
        return "Sudah Dikonfirmasi";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Memuat data...</p>
      </div>
    );

  if (!reservation)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400 font-semibold">Reservasi tidak ditemukan.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <Toaster position="top-right" />
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-pzwGtMLru2fT6Uhu"
        strategy="afterInteractive"
      />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Pembayaran Reservasi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pastikan informasi di bawah ini sudah benar sebelum melanjutkan pembayaran.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-gray-700 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Lapangan</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{reservation.lapangan_name}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Tanggal</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{reservation.reservation_date}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Waktu</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {reservation.start_time} - {reservation.end_time}
            </p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Harga</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">Rp {formatPrice(reservation.price)}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusBadgeColor(
              reservation.status
            )}`}
          >
            {formatStatus(reservation.status)}
          </span>
        </div>

        {reservation.status === "pending" && (
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full sm:w-auto mt-4 inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
          >
            {loading ? "Memproses Pembayaran..." : "Bayar Sekarang"}
          </button>
        )}

        {reservation.status === "confirmed" && (
          <div className="mt-4 text-green-700 dark:text-green-400 font-semibold">
            Pembayaran telah diterima dan reservasi dikonfirmasi. Terima kasih!
          </div>
        )}

        {reservation.status === "cancelled" && (
          <div className="mt-4 text-red-700 dark:text-red-400 font-semibold">
            Reservasi ini telah dibatalkan.
          </div>
        )}
      </div>
    </div>
  );
}

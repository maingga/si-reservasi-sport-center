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

interface Transaction {
  id: number;
  order_id: string;
  amount: number;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${apiUrl}/transactions?reservation_id=${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("Gagal mengambil transaksi:", error);
    }
  }, [token, reservationId]);

  useEffect(() => {
    if (token && reservationId) {
      fetchReservation();
      fetchTransactions();
    }
  }, [token, reservationId, fetchReservation, fetchTransactions]);

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
          onSuccess: () => {
            toast.success("Pembayaran berhasil!");
            fetchReservation();
            fetchTransactions();
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Memuat data...</p>
      </div>
    );

  if (!reservation)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">Reservasi tidak ditemukan.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Toaster position="top-right" />
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-pzwGtMLru2fT6Uhu"
        strategy="afterInteractive"
      />

      <h1 className="text-3xl font-bold mb-6">Pembayaran Reservasi</h1>

      <div className="bg-white p-6 rounded-md shadow-md space-y-4">
        <p>
          <strong>Lapangan:</strong> {reservation.lapangan_name}
        </p>
        <p>
          <strong>Tanggal:</strong> {reservation.reservation_date}
        </p>
        <p>
          <strong>Waktu:</strong> {reservation.start_time} - {reservation.end_time}
        </p>
        <p>
          <strong>Harga:</strong> Rp {formatPrice(reservation.price)}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={reservation.status === "paid" ? "text-green-600" : "text-red-600"}>
            {reservation.status}
          </span>
        </p>

        {reservation.status !== "paid" && (
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`mt-4 px-6 py-3 rounded-md font-semibold text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {loading ? "Memproses Pembayaran..." : "Bayar Sekarang"}
          </button>
        )}

        {reservation.status === "paid" && (
          <p className="text-green-700 font-semibold">Pembayaran sudah diterima. Terima kasih!</p>
        )}
      </div>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">Riwayat Transaksi</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-600">Belum ada transaksi untuk reservasi ini.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="border p-4 rounded-md shadow-sm bg-gray-50 transition-colors duration-300"
            >
              <div>
                <strong>Order ID:</strong> {tx.order_id}
              </div>
              <div>
                <strong>Amount:</strong> Rp {tx.amount.toLocaleString()}
              </div>
              <div
                className={
                  tx.status === "success"
                    ? "text-green-600 font-semibold"
                    : tx.status === "pending"
                    ? "text-yellow-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                Status: {tx.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

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
        } else if (err instanceof Error) {
          console.error("Gagal ambil booking (Error):", err.message);
          setError("Terjadi kesalahan saat mengambil data booking.");
        } else {
          console.error("Gagal ambil booking (Unknown):", err);
          setError("Terjadi kesalahan tidak diketahui.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBookings();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      alert("Booking berhasil dibatalkan");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Gagal batalkan booking (Axios):", err.message);
        alert("Gagal membatalkan booking. Silakan coba lagi.");
      } else if (err instanceof Error) {
        console.error("Gagal batalkan booking (Error):", err.message);
        alert("Terjadi kesalahan saat membatalkan booking.");
      } else {
        console.error("Gagal batalkan booking (Unknown):", err);
        alert("Terjadi kesalahan tidak diketahui.");
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-48 text-red-600 dark:text-red-400 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Daftar Booking Saya
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Tidak ada booking ditemukan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700 dark:text-gray-300 text-sm border-collapse">
            {/* Header hanya tampil di md+ */}
            <thead className="bg-gray-100 dark:bg-gray-800 hidden md:table-header-group">
              <tr>
                <th className="p-3 border border-gray-300 dark:border-gray-700 rounded-tl-md">Lapangan</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Tanggal</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Jam</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Status</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700 rounded-tr-md">Aksi</th>
              </tr>
            </thead>

            {/* Body sebagai block di mobile */}
            <tbody className="block md:table-row-group">
              {bookings.map((booking) => {
                const statusLower = booking.status.toLowerCase();
                const isPaid = paidStatuses.includes(statusLower);

                return (
                  <tr
                    key={booking.id}
                    className="block md:table-row border border-gray-300 dark:border-gray-700 rounded-lg mb-4 md:mb-0 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                  >
                    <td className="block md:table-cell p-3 border border-gray-300 dark:border-gray-700">
                      <span className="md:hidden font-semibold block mb-1">Lapangan:</span>
                      {booking.lapangan?.name || "-"}
                    </td>
                    <td className="block md:table-cell p-3 border border-gray-300 dark:border-gray-700">
                      <span className="md:hidden font-semibold block mb-1">Tanggal:</span>
                      {format(parseISO(booking.reservation_date), "dd MMMM yyyy")}
                    </td>
                    <td className="block md:table-cell p-3 border border-gray-300 dark:border-gray-700">
                      <span className="md:hidden font-semibold block mb-1">Jam:</span>
                      {booking.start_time} - {booking.end_time}
                    </td>
                    <td
                      className={`block md:table-cell p-3 border border-gray-300 dark:border-gray-700 capitalize ${
                        isPaid ? "text-green-600 font-semibold" : ""
                      }`}
                    >
                      <span className="md:hidden font-semibold block mb-1">Status:</span>
                      {getStatusLabel(booking.status)}
                    </td>
                    <td className="block md:table-cell p-3 border border-gray-300 dark:border-gray-700">
                      <span className="md:hidden font-semibold block mb-1">Aksi:</span>
                      {statusLower === "pending" ? (
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition-colors duration-200 w-full md:w-auto"
                        >
                          Batalkan
                        </button>
                      ) : statusLower === "partially_paid" ? (
                        <button
                          onClick={() => handleContinuePayment(booking.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md transition-colors duration-200 w-full md:w-auto"
                        >
                          Lanjutkan Pembayaran
                        </button>
                      ) : (
                        <span className="text-gray-500 italic block w-full md:inline">
                          {isPaid ? "Sudah dibayar" : "Tidak bisa dibatalkan"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";

interface Lapangan {
  name: string;
}

interface Booking {
  id: number;
  reservation_date: string; // format ISO string dari backend
  start_time: string;
  end_time: string;
  status: string;
  lapangan: Lapangan | null;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <table className="w-full table-auto text-left text-gray-700 dark:text-gray-300 text-sm border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-3 border border-gray-300 dark:border-gray-700 rounded-tl-md">Lapangan</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Tanggal</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Jam</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Status</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700 rounded-tr-md">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const isPaid = booking.status.toLowerCase() === "confirmed" || booking.status.toLowerCase() === "confirmed";

                return (
                  <tr
                    key={booking.id}
                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                  >
                    <td className="p-3 border border-gray-300 dark:border-gray-700">
                      {booking.lapangan?.name || "-"}
                    </td>
                    <td className="p-3 border border-gray-300 dark:border-gray-700">
                      {format(parseISO(booking.reservation_date), "dd MMMM yyyy")}
                    </td>
                    <td className="p-3 border border-gray-300 dark:border-gray-700">
                      {booking.start_time} - {booking.end_time}
                    </td>
                    <td
                      className={`p-3 border border-gray-300 dark:border-gray-700 capitalize ${
                        isPaid ? "text-green-600 font-semibold" : ""
                      }`}
                    >
                      {booking.status}
                    </td>
                    <td className="p-3 border border-gray-300 dark:border-gray-700">
                      {isPaid ? (
                        <span className="text-gray-500 italic">Sudah dibayar</span>
                      ) : (
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition-colors duration-200"
                        >
                          Batalkan
                        </button>
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

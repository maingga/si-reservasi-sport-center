"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CardStats from "@/components/user/CardStats";
import BookingList, { Booking } from "@/components/user/BookingList";

interface Transaction {
  id: number;
  amount: number;
  status?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

function formatRupiah(amount: number | string) {
  const num = typeof amount === "string" ? parseInt(amount) : amount;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)} Jt`;
  if (num >= 1_000) return `Rp ${(num / 1_000).toFixed(1)} Rb`;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

function parseDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

export default function UserDashboard() {
  const [data, setData] = useState<{
    user: User | null;
    totalBooking: number;
    activeBooking: number;
    totalPembayaran: number;
    bookings: Booking[];
  }>({
    user: null,
    totalBooking: 0,
    activeBooking: 0,
    totalPembayaran: 0,
    bookings: [],
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const [meRes, bookingsRes, trxRes] = await Promise.all([
          axios.get<User>("http://localhost:8000/api/me", { headers }),
          axios.get<Booking[]>("http://localhost:8000/api/reservations", { headers }),
          axios.get<Transaction[]>("http://localhost:8000/api/transactions", { headers }),
        ]);

        const bookings = bookingsRes.data;
        const transaksi = trxRes.data;
        const now = new Date();

        const activeBooking = bookings.filter((b) => {
          const isAktif = b.status === "pending" || b.status === "confirmed";
          const endDateTime = parseDateTime(b.reservation_date, b.end_time);
          return isAktif && endDateTime >= now;
        }).length;

        const totalPembayaran = transaksi
          // .filter((trx) => trx.status === "paid") // Aktifkan jika perlu
          .reduce((sum, trx) => sum + Number(trx.amount), 0);

        setData({
          user: meRes.data,
          totalBooking: bookings.length,
          activeBooking,
          totalPembayaran,
          bookings,
        });
      } catch (err) {
        console.error("Gagal ambil data dashboard:", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 truncate">
        Dashboard Pengguna
      </h1>

      {/* Grid responsive: 1 kolom di hp, 2 kolom di sm, 3 kolom di md ke atas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <CardStats title="Total Booking" value={data.totalBooking} />
        <CardStats title="Booking Aktif" value={data.activeBooking} />
        <CardStats
          title="Total Pembayaran"
          value={formatRupiah(data.totalPembayaran)}
        />
      </div>

      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 truncate">
          Booking Terakhir
        </h2>
        {/* Overflow scroll horizontal agar tabel tidak pecah di layar kecil */}
        <div className="overflow-x-auto">
          <BookingList data={data.bookings} />
        </div>
      </section>
    </div>
  );
}

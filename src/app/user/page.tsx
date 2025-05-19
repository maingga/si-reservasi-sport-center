"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CardStats from "@/components/user/CardStats";
import BookingList from "@/components/user/BookingList";

interface Booking {
  id: number;
  lapangan: {
    nama: string;
  } | null;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  status: string;
}

interface Transaction {
  id: number;
  amount: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Fungsi format rupiah yang ringkas
function formatRupiah(amount: number | string) {
  const num = typeof amount === "string" ? parseInt(amount) : amount;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)} Jt`;
  if (num >= 1_000) return `Rp ${(num / 1_000).toFixed(1)} Rb`;
  return `Rp ${num.toLocaleString("id-ID")}`;
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

        const totalBooking = bookings.length;
        const activeBooking = bookings.filter((b) => b.status === "aktif").length;
        const totalPembayaran = transaksi.reduce((sum, trx) => sum + trx.amount, 0);

        setData({
          user: meRes.data,
          totalBooking,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
        Dashboard Pengguna
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <CardStats title="Total Booking" value={data.totalBooking} />
        <CardStats title="Booking Aktif" value={data.activeBooking} />
        <CardStats
          title="Total Pembayaran"
          value={formatRupiah(data.totalPembayaran)}
        />
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Booking Terakhir
        </h2>
        <BookingList data={data.bookings} />
      </section>
    </div>
  );
}

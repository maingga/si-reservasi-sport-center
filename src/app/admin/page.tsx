"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, LogOut, Settings } from "lucide-react";
import type { JSX } from 'react';

// Komponen reusable untuk kartu statistik
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: JSX.Element; color: string }) {
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-4 rounded-lg ${color.replace("text", "bg")}`}>{icon}</div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      // Validasi role user
      if (user?.role === "admin") {
        setAuthorized(true);
      } else {
        router.push("/unauthorized"); // halaman akses ditolak
      }
    } catch (error) {
      console.error("Gagal memuat data user:", error);
      router.push("/error"); // fallback jika localStorage corrupt
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="text-center mt-10">Memuat...</div>;
  if (!authorized) return null;

  return (
    <div className="flex flex-col space-y-8 p-6">
      {/* Header */}
      <section className="text-center bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Admin</h1>
        <p className="text-lg text-gray-600">
          Kelola platform dengan efisien dan pantau semua metrik penting di sini.
        </p>
      </section>

      {/* Statistik */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          title="Total Pengguna"
          value="1.245"
          icon={<Users size={40} />}
          color="text-blue-600"
        />
        <StatCard
          title="Sesi Aktif"
          value="120"
          icon={<LogOut size={40} />}
          color="text-green-600"
        />
        <StatCard
          title="Total Reservasi"
          value="345"
          icon={<Settings size={40} />}
          color="text-orange-600"
        />
      </section>

      {/* Aktivitas Terbaru */}
      <section className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <ActivityItem
            text="Pengguna John Doe telah membuat reservasi selama 2 jam."
            time="2 menit yang lalu"
          />
          <ActivityItem
            text="Pendaftaran pengguna baru: Alice Johnson."
            time="30 menit yang lalu"
          />
          <ActivityItem
            text="Pengaturan telah diperbarui oleh Admin."
            time="1 jam yang lalu"
          />
        </div>
      </section>
    </div>
  );
}

// Komponen reusable aktivitas
function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex justify-between items-center border-b pb-4 last:border-b-0">
      <p className="text-gray-600">{text}</p>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}

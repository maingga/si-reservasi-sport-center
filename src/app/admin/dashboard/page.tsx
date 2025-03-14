'use client';

import { useState } from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground transition-all">
      {/* Sidebar */}
      <aside className={`bg-foreground text-background w-64 p-4 ${isOpen ? 'block' : 'hidden'} md:block`}>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li className="mb-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-primary rounded">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/users" className="flex items-center gap-2 p-2 hover:bg-primary rounded">
              Manajemen Pengguna
            </Link>
          </li>
          <li>
            <Link href="/admin/reservations" className="flex items-center gap-2 p-2 hover:bg-primary rounded">
              Reservasi
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <button className="md:hidden mb-4 bg-accent text-white p-2 rounded" onClick={() => setIsOpen(!isOpen)}>
          Menu
        </button>
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="text-lg font-semibold">Total Pengguna</h3>
            <p className="text-3xl font-bold">120</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">Reservasi Hari Ini</h3>
            <p className="text-3xl font-bold">15</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">Pendapatan Bulan Ini</h3>
            <p className="text-3xl font-bold">Rp 5.000.000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

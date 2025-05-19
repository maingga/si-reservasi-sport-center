"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  User,
  LogOut,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { api } from "@/app/utils/api"; // pastikan ini sesuai path dan konfigurasi api-mu

const menuItems = [
  {
    href: "/user",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/user/bookings/create",
    label: "Booking Lapangan",
    icon: CalendarCheck,
  },
  {
    href: "/user/bookings",
    label: "Riwayat Booking",
    icon: Clock,
  },
  {
    href: "/user/payment",
    label: "Pembayaran",
    icon: CreditCard,
  },
  {
    href: "/user/profile",
    label: "Profil Saya",
    icon: User,
  },
  {
    href: "/logout", // tetap bisa pakai ini sebagai identifier, tapi bukan Link
    label: "Logout",
    icon: LogOut,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      const response = await api.post("/logout");
      if (response.data.success) {
        router.push("/login");
      } else {
        alert("Logout gagal");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Terjadi kesalahan saat logout");
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md hidden md:flex flex-col">
      <div className="p-6 font-extrabold text-2xl text-center text-pink-600 dark:text-pink-400 border-b border-gray-200 dark:border-gray-700">
        SI-Sport-Center
      </div>
      <nav className="flex flex-col flex-grow px-4 py-6 space-y-1">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          // Render tombol logout khusus
          if (href === "/logout") {
            return (
              <button
                key={href}
                onClick={handleLogout}
                disabled={loadingLogout}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "bg-pink-600 text-white hover:bg-pink-700"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }
                  ${loadingLogout ? "cursor-not-allowed opacity-50" : ""}
                `}
                aria-label="Logout"
              >
                <Icon
                  size={20}
                  className={`${isActive ? "text-white" : "text-pink-600 dark:text-pink-400"}`}
                />
                <span className="truncate">{loadingLogout ? "Logging out..." : label}</span>
              </button>
            );
          }

          // Render Link untuk menu lain
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-pink-600 text-white hover:bg-pink-700"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }
              `}
            >
              <Icon
                size={20}
                className={`${isActive ? "text-white" : "text-pink-600 dark:text-pink-400"}`}
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

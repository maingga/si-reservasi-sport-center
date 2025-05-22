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
import { api } from "@/app/utils/api";

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
    href: "/user/transactions",
    label: "Riwayat Transaksi",
    icon: CreditCard,
  },
  {
    href: "/user/profile",
    label: "Profil Saya",
    icon: User,
  },
  {
    href: "/logout",
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
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md hidden md:flex flex-col select-none">
      <div className="p-6 font-extrabold text-3xl text-center text-pink-600 dark:text-pink-400 border-b border-gray-200 dark:border-gray-700 tracking-wide">
        SI-Sport-Center
      </div>
      <nav className="flex flex-col flex-grow px-4 py-6 space-y-1">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          if (href === "/logout") {
            return (
              <button
                key={href}
                onClick={handleLogout}
                disabled={loadingLogout}
                aria-label="Logout"
                title="Logout"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-300
                  text-red-600 hover:bg-red-100 dark:hover:bg-red-900
                  ${
                    loadingLogout
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-red-700"
                  }
                `}
              >
                <Icon
                  size={20}
                  className="text-red-600 dark:text-red-400"
                />
                <span className="truncate font-medium">
                  {loadingLogout ? "Logging out..." : label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-300
                ${
                  isActive
                    ? "bg-pink-600 text-white border-l-4 border-pink-500"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600 dark:text-gray-300 dark:hover:bg-pink-900 dark:hover:text-pink-400"
                }
                group
              `}
            >
              <Icon
                size={20}
                className={`transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-pink-600 group-hover:text-pink-700 dark:text-pink-400 dark:group-hover:text-pink-300"
                }`}
              />
              <span className="truncate font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

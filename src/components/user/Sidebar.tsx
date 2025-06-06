"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  User,
  LogOut,
  Clock,
  X,
} from "lucide-react";
import { useState } from "react";
import { api } from "@/app/utils/api";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const menuItems = [
  { href: "/user", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/lapangan", label: "Booking Lapangan", icon: CalendarCheck },
  { href: "/user/bookings", label: "Riwayat Booking", icon: Clock },
  { href: "/user/transactions", label: "Riwayat Transaksi", icon: CreditCard },
  { href: "/user/profile", label: "Profil Saya", icon: User },
  { href: "/logout", label: "Logout", icon: LogOut },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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

  const SidebarContent = (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg flex flex-col">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Image
            src="/images/logo/logo.svg"
            alt="SI Sport Center Logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
            priority
          />
          <span className="ml-3 text-2xl font-bold tracking-wide text-pink-600 dark:text-pink-400">
            Sport Center
          </span>
        </div>
        {/* Tombol Close untuk Mobile */}
        <button
          className="md:hidden text-gray-500 hover:text-red-600 dark:hover:text-red-400"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col px-4 py-6 gap-1 overflow-y-auto">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          if (href === "/logout") {
            return (
              <button
                key={href}
                onClick={handleLogout}
                disabled={loadingLogout}
                className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors duration-200
                  text-red-600 hover:bg-red-100 dark:hover:bg-red-900
                  ${loadingLogout ? "opacity-50 cursor-not-allowed" : "hover:text-red-700"}`}
              >
                <Icon className="text-red-600 dark:text-red-400" size={20} />
                <span>{loadingLogout ? "Logging out..." : label}</span>
              </button>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all font-medium duration-200 group
                ${
                  isActive
                    ? "bg-pink-600 text-white border-l-4 border-pink-500 shadow-inner"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600 dark:text-gray-300 dark:hover:bg-pink-900 dark:hover:text-pink-300"
                }`}
            >
              <Icon
                size={20}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-pink-600 group-hover:text-pink-700 dark:text-pink-400 dark:group-hover:text-pink-300"
                }`}
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Sidebar mobile dengan overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-40"
          onClick={onClose}
        />
        {/* Sidebar */}
        <div className="relative z-50 h-full">{SidebarContent}</div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden md:flex">{SidebarContent}</div>
    </>
  );
}

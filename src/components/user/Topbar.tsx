"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface UserData {
  name: string;
  photo_url: string | null;
}

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const [user, setUser] = useState<UserData>({
    name: "Pengguna",
    photo_url: null,
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Gagal mengambil data user");

        const data = await res.json();
        setUser({
          name: data.data?.name || "Pengguna",
          photo_url: data.data?.photo_url || null,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({
          name: "Pengguna",
          photo_url: null,
        });
      }
    }

    fetchUser();

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const avatarUrl = user.photo_url
    ? user.photo_url
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name
      )}&background=ea4c89&color=fff&rounded=true`;

  return (
    <header className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Tombol Hamburger untuk toggle sidebar */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Selamat Datang, {user.name}!
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m8.66-11h-1M4.34 12h-1m15.364 5.364l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728l-.707-.707M6.343 17.657l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800 dark:text-gray-200"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 1019 15.79a9 9 0 002-3z" />
            </svg>
          )}
        </button>

        <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400 font-medium truncate max-w-xs">
          {user.name}
        </span>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500 shadow-md">
          <Image
            src={avatarUrl}
            width={40}
            height={40}
            alt="User Avatar"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
}

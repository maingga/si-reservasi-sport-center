"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Lapangan {
  id: number;
  name: string;
  photo?: string;
  price: number;
}

export default function LapanganListPage() {
  const [lapanganList, setLapanganList] = useState<Lapangan[]>([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        const res = await axios.get<Lapangan[]>("http://localhost:8000/api/lapangan", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLapanganList(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(`Gagal mengambil data lapangan: ${err.response?.data?.message || err.message}`);
        } else {
          toast.error("Gagal mengambil data lapangan");
        }
      } finally {
        setFetching(false);
      }
    };

    if (token) fetchLapangan();
  }, [token]);

  const getImageUrl = (path?: string) => {
    return path ? `http://localhost:8000/storage/${path}` : "/default.jpg";
  };

  const handleBooking = (lapanganId: number) => {
    router.push(`/user/lapangan/${lapanganId}/booking`);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 px-4">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">Daftar Lapangan</h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetching ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg" />
              ))
            ) : (
              lapanganList.map((lap) => (
                <div
                  key={lap.id}
                  className="relative group border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-gray-800"
                >
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleBooking(lap.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow hover:scale-105 transition-transform"
                    >
                      Booking
                    </button>
                  </div>
                  <Link href={`/user/lapangan/${lap.id}`}>
                    <div className="overflow-hidden rounded-md mb-3">
                      <Image
                        src={getImageUrl(lap.photo)}
                        alt={lap.name}
                        width={500}
                        height={300}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white">
                      {lap.name}
                    </h3>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Harga per jam: <span className="font-medium text-indigo-600 dark:text-indigo-400">Rp{lap.price.toLocaleString("id-ID")}</span>
                    </p>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

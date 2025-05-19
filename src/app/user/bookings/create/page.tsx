"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Lapangan {
  id: number;
  name: string;
  photo?: string;
}

export default function CreateBookingPage() {
  const router = useRouter();

  const [lapanganList, setLapanganList] = useState<Lapangan[]>([]);
  const [selectedLapangan, setSelectedLapangan] = useState<number | null>(null);
  const [tanggal, setTanggal] = useState<Date | null>(null);
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

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
        } else if (err instanceof Error) {
          toast.error(`Gagal mengambil data lapangan: ${err.message}`);
        } else {
          toast.error("Gagal mengambil data lapangan");
        }
      } finally {
        setFetching(false);
      }
    };

    if (token) fetchLapangan();
  }, [token]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!selectedLapangan || !tanggal || !jamMulai || !jamSelesai) {
        setIsAvailable(null);
        return;
      }

      if (jamMulai >= jamSelesai) {
        setIsAvailable(false);
        return;
      }

      setCheckingAvailability(true);
      try {
        const res = await axios.get("http://localhost:8000/api/reservations/check", {
          params: {
            lapangan_id: selectedLapangan,
            reservation_date: tanggal.toISOString().split("T")[0],
            start_time: jamMulai,
            end_time: jamSelesai,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAvailable(res.data.available);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(`Gagal cek ketersediaan: ${err.response?.data?.message || err.message}`);
        } else if (err instanceof Error) {
          toast.error(`Gagal cek ketersediaan: ${err.message}`);
        } else {
          toast.error("Gagal cek ketersediaan lapangan.");
        }
        setIsAvailable(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [selectedLapangan, tanggal, jamMulai, jamSelesai, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLapangan || !tanggal || !jamMulai || !jamSelesai) {
      toast.error("Semua field harus diisi");
      return;
    }

    if (jamMulai >= jamSelesai) {
      toast.error("Jam selesai harus setelah jam mulai");
      return;
    }

    setCheckingAvailability(true);
    try {
      // Cek ulang availability sebelum submit
      const resCheck = await axios.get("http://localhost:8000/api/reservations/check", {
        params: {
          lapangan_id: selectedLapangan,
          reservation_date: tanggal.toISOString().split("T")[0],
          start_time: jamMulai,
          end_time: jamSelesai,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resCheck.data.available) {
        toast.error("Lapangan sudah terpesan untuk waktu yang dipilih.");
        setIsAvailable(false);
        setCheckingAvailability(false);
        return;
      }

      setIsAvailable(true);
    } catch {
      toast.error("Gagal cek ketersediaan ulang.");
      setCheckingAvailability(false);
      return;
    }
    setCheckingAvailability(false);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/reservations",
        {
          lapangan_id: selectedLapangan,
          reservation_date: tanggal.toISOString().split("T")[0],
          start_time: jamMulai,
          end_time: jamSelesai,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Booking berhasil dibuat.");

      const reservationId = res.data.reservation.id;

      if (reservationId) {
        router.push(`/user/payment/${reservationId}`);
      } else {
        toast.error("Gagal mendapatkan ID reservasi dari server.");
      }

      // Redirect ke halaman payment dengan reservationId
      router.push(`/user/payment/${reservationId}`);

      // Reset form (optional, karena sudah redirect)
      setSelectedLapangan(null);
      setTanggal(null);
      setJamMulai("");
      setJamSelesai("");
      setIsAvailable(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Gagal membuat booking: ${err.response?.data?.message || err.message}`);
      } else if (err instanceof Error) {
        toast.error(`Gagal membuat booking: ${err.message}`);
      } else {
        toast.error("Gagal membuat booking.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path?: string) => {
    return path ? `http://localhost:8000/storage/${path}` : "/default.jpg";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 px-4">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">Booking Lapangan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* List Lapangan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Pilih Lapangan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {fetching ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-md" />
                ))
              ) : (
                lapanganList.map((lap) => (
                  <div
                    key={lap.id}
                    className={`relative group cursor-pointer border rounded-lg p-3 shadow-sm transition hover:ring-2 ${
                      selectedLapangan === lap.id
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/user/lapangan/${lap.id}`} passHref>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow hover:scale-105 hover:shadow-lg transition"
                        >
                          Detail
                        </button>
                      </Link>
                    </div>
                    <div onClick={() => setSelectedLapangan(lap.id)}>
                      <Image
                        src={getImageUrl(lap.photo)}
                        alt={lap.name}
                        width={500}
                        height={300}
                        className="w-full h-40 object-cover rounded-md mb-2"
                        unoptimized
                      />
                      <h3 className="text-md font-medium text-center text-gray-800 dark:text-white">{lap.name}</h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Booking */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Formulir Booking</h2>

            {selectedLapangan && (
              <div className="mb-6 flex items-center gap-4">
                <Image
                  src={getImageUrl(lapanganList.find((lap) => lap.id === selectedLapangan)?.photo)}
                  alt="Preview Lapangan"
                  width={80}
                  height={80}
                  className="object-cover rounded-md"
                />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Lapangan dipilih:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {lapanganList.find((lap) => lap.id === selectedLapangan)?.name}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                <DatePicker
                  selected={tanggal}
onChange={(date) => setTanggal(date)}
className="w-full border rounded-md p-2"
dateFormat="yyyy-MM-dd"
minDate={new Date()}
placeholderText="Pilih tanggal"
required
/>
</div>          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Jam Mulai</label>
            <input
              type="time"
              value={jamMulai}
              onChange={(e) => setJamMulai(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Jam Selesai</label>
            <input
              type="time"
              value={jamSelesai}
              onChange={(e) => setJamSelesai(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            {checkingAvailability ? (
              <p className="text-blue-600">Memeriksa ketersediaan...</p>
            ) : isAvailable === null ? (
              <p className="text-gray-600">Silakan pilih lapangan dan waktu.</p>
            ) : isAvailable ? (
              <p className="text-green-600 font-semibold">Lapangan tersedia!</p>
            ) : (
              <p className="text-red-600 font-semibold">Lapangan tidak tersedia.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || checkingAvailability || !isAvailable}
            className={`w-full py-3 rounded-md font-semibold text-white ${
              loading || checkingAvailability || !isAvailable
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {loading ? "Membuat Booking..." : "Booking Sekarang"}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
  );
};

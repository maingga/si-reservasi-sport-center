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
  price: number;
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
  const [totalHarga, setTotalHarga] = useState<number | null>(null);

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

useEffect(() => {
  if (
    !selectedLapangan ||
    !jamMulai ||
    !jamSelesai ||
    !jamMulai.includes(":") ||
    !jamSelesai.includes(":")
  ) {
    setTotalHarga(null);
    return;
  }

  const lapangan = lapanganList.find((lap) => lap.id === selectedLapangan);
  if (!lapangan) return;

  const [startHour, startMinute] = jamMulai.split(":").map(Number);
  const [endHour, endMinute] = jamSelesai.split(":").map(Number);

  if (
    isNaN(startHour) || isNaN(startMinute) ||
    isNaN(endHour) || isNaN(endMinute)
  ) {
    setTotalHarga(null);
    return;
  }

  // Hitung jam dalam bentuk desimal (contoh: 20.5 = jam 20:30)
  const startDecimal = startHour + startMinute / 60;
  const endDecimal = endHour + endMinute / 60;

if (endDecimal <= startDecimal || endDecimal > 22) {
  setTotalHarga(null);
  return;
}

let total = 0;

for (let hour = Math.floor(startDecimal); hour < Math.ceil(endDecimal); hour++) {
  const segmentStart = Math.max(hour, startDecimal);
  const segmentEnd = Math.min(hour + 1, endDecimal);
  const segmentDuration = segmentEnd - segmentStart;

  const isMalam = segmentStart >= 18;
  const hargaDasar = Number(lapangan.price);  // pastikan jadi number
  const hargaPerJam = hargaDasar + (isMalam ? 10000 : 0);

  console.log(`Jam: ${hour}, Durasi: ${segmentDuration}, Harga: ${hargaPerJam}`);

  total += hargaPerJam * segmentDuration;
}

  setTotalHarga(Math.round(total));
}, [selectedLapangan, jamMulai, jamSelesai, lapanganList]);

  useEffect(() => {

    const checkAvailability = async () => {
      if (!selectedLapangan || !tanggal || !jamMulai || !jamSelesai) {
        setIsAvailable(null);
        return;
      }

if (jamMulai >= jamSelesai) {
  toast.error("Jam selesai harus setelah jam mulai");
  return;
}

if (jamSelesai > "22:00") {
  toast.error("Booking tidak boleh melewati jam 22:00 (waktu tutup).");
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
  console.error(err); // log the error to the console
  toast.error("Gagal cek ketersediaan lapangan.");
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

    if (totalHarga === null) {
      toast.error("Harga belum bisa dihitung.");
      return;
    }

    setCheckingAvailability(true);
    try {
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
          price: totalHarga,
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

      setSelectedLapangan(null);
      setTanggal(null);
      setJamMulai("");
      setJamSelesai("");
      setIsAvailable(null);
    } catch (err) {
  console.error(err);
  toast.error("Gagal membuat booking.");
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
                      selectedLapangan === lap.id ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-300"
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
                      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                        Harga per jam: Rp{lap.price.toLocaleString("id-ID")}
                      </p>
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
              <p className="text-center font-semibold text-gray-800 dark:text-white mb-2">
                Lapangan: {lapanganList.find((lap) => lap.id === selectedLapangan)?.name || ""}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Tanggal
                </label>
                <DatePicker
                  id="tanggal"
                  selected={tanggal}
                  onChange={(date) => setTanggal(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholderText="Pilih tanggal"
                  required
                />
              </div>

              <div>
                <label htmlFor="jamMulai" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Jam Mulai (24 jam, format HH:mm)
                </label>
                <input
                  id="jamMulai"
                  type="time"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="jamSelesai" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Jam Selesai (24 jam, format HH:mm)
                </label>
                <input
                  id="jamSelesai"
                  type="time"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                   max="22:00"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:text-white"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  * Tambahan Rp10.000/jam dikenakan setelah pukul 18:00.
                   * Booking hanya diperbolehkan sampai maksimal pukul 22:00.
                </p>
              </div>

              {checkingAvailability && (
                <p className="text-blue-600 dark:text-blue-400">Memeriksa ketersediaan...</p>
              )}
              {isAvailable !== null && !checkingAvailability && (
                <p className={isAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {isAvailable ? "Lapangan tersedia" : "Lapangan sudah terpesan"}
                </p>
              )}

{typeof totalHarga === "number" && !isNaN(totalHarga) && (
  <p className="text-lg font-semibold text-gray-800 dark:text-white mt-4">
    Total Harga: Rp{totalHarga.toLocaleString("id-ID")}
  </p>
)}

              <button
                type="submit"
                disabled={loading || !isAvailable}
                className={`w-full py-3 rounded-md text-white font-semibold ${
                  loading || !isAvailable
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transition"
                }`}
              >
                {loading ? "Memproses..." : "Buat Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

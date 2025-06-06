"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton"; // opsional, jika pakai komponen shadcn
import { Loader2 } from "lucide-react"; // untuk ikon loading

interface Lapangan {
  id: number;
  name: string;
  price: number;
}

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const lapanganId = params?.id ? Number(params.id) : null;

  const [lapangan, setLapangan] = useState<Lapangan | null>(null);
  const [tanggal, setTanggal] = useState<Date | null>(null);
  const [jamMulai, setJamMulai] = useState<Date | null>(null);
  const [jamSelesai, setJamSelesai] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [totalHarga, setTotalHarga] = useState<number | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "dp">("full");

  const minTime = new Date();
minTime.setHours(7, 0, 0, 0); // jam 7:00 pagi

const maxTime = new Date();
maxTime.setHours(22, 0, 0, 0); // jam 22:00 malam


  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Ambil data lapangan
  useEffect(() => {
    const fetchLapangan = async () => {
      if (!lapanganId) return;

      try {
        const res = await axios.get<Lapangan>(`http://localhost:8000/api/lapangan/${lapanganId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLapangan(res.data);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(`Gagal mengambil data lapangan: ${err.message}`);
        } else {
          toast.error(`Gagal mengambil data lapangan: ${String(err)}`);
        }
        router.push("/lapangan");
      } finally {
        setFetching(false);
      }
    };

    if (token) fetchLapangan();
  }, [lapanganId, token, router]);

  // Hitung total harga tiap kali jam mulai/selesai berubah
  useEffect(() => {
    if (!lapangan || !jamMulai || !jamSelesai) {
      setTotalHarga(null);
      return;
    }

    const startDecimal = jamMulai.getHours() + jamMulai.getMinutes() / 60;
    const endDecimal = jamSelesai.getHours() + jamSelesai.getMinutes() / 60;

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
      const hargaDasar = Number(lapangan.price);
      const hargaPerJam = hargaDasar + (isMalam ? 10000 : 0);

      total += hargaPerJam * segmentDuration;
    }

    setTotalHarga(Math.round(total));
  }, [lapangan, jamMulai, jamSelesai]);

  // Cek ketersediaan
  useEffect(() => {
    const checkAvailability = async () => {
      if (!lapanganId || !tanggal || !jamMulai || !jamSelesai) {
        setIsAvailable(null);
        return;
      }

      const startDecimal = jamMulai.getHours() + jamMulai.getMinutes() / 60;
      const endDecimal = jamSelesai.getHours() + jamSelesai.getMinutes() / 60;

      if (endDecimal <= startDecimal) {
        toast.error("Jam selesai harus setelah jam mulai");
        return;
      }

      if (endDecimal > 22) {
        toast.error("Booking tidak boleh melewati jam 22:00.");
        return;
      }

      setCheckingAvailability(true);
      try {
        const res = await axios.get("http://localhost:8000/api/reservations/check", {
          params: {
            lapangan_id: lapanganId,
            reservation_date: tanggal.toISOString().split("T")[0],
            start_time: jamMulai.toTimeString().slice(0, 5),
            end_time: jamSelesai.toTimeString().slice(0, 5),
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAvailable(res.data.available);
      } catch {
        toast.error("Gagal cek ketersediaan lapangan.");
        setIsAvailable(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [lapanganId, tanggal, jamMulai, jamSelesai, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lapanganId || !tanggal || !jamMulai || !jamSelesai || totalHarga === null) {
      toast.error("Lengkapi semua data dan pastikan harga valid.");
      return;
    }

    const startDecimal = jamMulai.getHours() + jamMulai.getMinutes() / 60;
    const endDecimal = jamSelesai.getHours() + jamSelesai.getMinutes() / 60;
    if (endDecimal <= startDecimal || endDecimal > 22) {
      toast.error("Jam booking tidak valid.");
      return;
    }

    const isDp = paymentType === "dp";
    const dpAmount = isDp ? Math.round(totalHarga * 0.3) : null;

    setLoading(true);

    try {
      // Cek ulang ketersediaan
      const resCheck = await axios.get("http://localhost:8000/api/reservations/check", {
        params: {
          lapangan_id: lapanganId,
          reservation_date: tanggal.toISOString().split("T")[0],
          start_time: jamMulai.toTimeString().slice(0, 5),
          end_time: jamSelesai.toTimeString().slice(0, 5),
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resCheck.data.available) {
        toast.error("Lapangan sudah terpesan untuk waktu tersebut.");
        setIsAvailable(false);
        return;
      }

      // Buat reservasi
      const res = await axios.post(
        "http://localhost:8000/api/reservations",
        {
          lapangan_id: lapanganId,
          reservation_date: tanggal.toISOString().split("T")[0],
          start_time: jamMulai.toTimeString().slice(0, 5),
          end_time: jamSelesai.toTimeString().slice(0, 5),
          price: totalHarga,
          is_dp: isDp,
          dp_amount: dpAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking berhasil.");
      const reservationId = res.data?.reservation?.id;
      if (reservationId) {
        router.push(`/user/payment/${reservationId}`);
      } else {
        toast.error("Gagal mendapatkan ID reservasi.");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Gagal membuat booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 px-6">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto">
        {fetching ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
              Booking {lapangan?.name}
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Harga: Rp{lapangan?.price.toLocaleString("id-ID")}/jam
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Tanggal
                </label>
                <DatePicker
                  selected={tanggal}
                  onChange={(date) => setTanggal(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholderText="Pilih tanggal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Jam Mulai
                  </label>
<DatePicker
  selected={jamMulai}
  onChange={(date) => setJamMulai(date)}
  showTimeSelect
  showTimeSelectOnly
  timeIntervals={60}
  timeCaption="Jam"
  dateFormat="HH:mm"
  placeholderText="Pilih jam mulai"
  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
  minTime={minTime}
  maxTime={maxTime}
/>                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Jam Selesai
                  </label>
<DatePicker
  selected={jamSelesai}
  onChange={(date) => setJamSelesai(date)}
  showTimeSelect
  showTimeSelectOnly
  timeIntervals={60}
  timeCaption="Jam"
  dateFormat="HH:mm"
  placeholderText="Pilih jam selesai"
  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
  minTime={jamMulai ?? minTime}
  maxTime={maxTime}
/>                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as "full" | "dp")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="full">Bayar Penuh</option>
                  <option value="dp">Bayar DP (30%)</option>
                </select>
              </div>

              {checkingAvailability ? (
                <p className="text-blue-500 text-sm">Memeriksa ketersediaan...</p>
              ) : isAvailable !== null ? (
                <p className={`text-sm ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                  {isAvailable ? "Lapangan tersedia" : "Sudah terbooking"}
                </p>
              ) : null}

              {typeof totalHarga === "number" && (
                <div className="space-y-1">
                  <p className="text-gray-800 dark:text-white font-semibold">
                    Total Harga: Rp{totalHarga.toLocaleString("id-ID")}
                  </p>
                  {paymentType === "dp" && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Bayar Sekarang (DP 30%): Rp{Math.round(totalHarga * 0.3).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isAvailable}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold transition ${
                  loading || !isAvailable
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
                {loading ? "Memproses..." : "Buat Booking"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Calendar, Clock, CreditCard, MapPin, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

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
  minTime.setHours(7, 0, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(22, 0, 0, 0);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchLapangan = async () => {
      if (!lapanganId) return;

      try {
        const res = await axios.get<Lapangan>(`http://localhost:8000/api/lapangan/${lapanganId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLapangan(res.data);
      } catch (err: unknown) {
  if (err instanceof Error) {
    toast.error(`Error fetching lapangan data: ${err.message}`);
    router.push("/lapangan");
  } else {
    console.error("Unknown error:", err);
  }
} finally {
        setFetching(false);
      }
    };

    if (token) fetchLapangan();
  }, [lapanganId, token, router]);

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

    // Pastikan harga dasar adalah number
    const hargaDasar = typeof lapangan.price === "string" ? parseFloat(lapangan.price) : lapangan.price;
    const isMalam = hour >= 18;
    const hargaPerJam = hargaDasar + (isMalam ? 10000 : 0);

    total += hargaPerJam * segmentDuration;

    console.log(`Jam ${hour}: Durasi ${segmentDuration.toFixed(2)} jam, Harga/jam Rp${hargaPerJam}, Subtotal Rp${(hargaPerJam * segmentDuration).toFixed(2)}`);
  }

  setTotalHarga(Math.round(total));
}, [lapangan, jamMulai, jamSelesai]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!lapanganId || !tanggal || !jamMulai || !jamSelesai) {
        setIsAvailable(null);
        return;
      }

      const startDecimal = jamMulai.getHours() + jamMulai.getMinutes() / 60;
      const endDecimal = jamSelesai.getHours() + jamSelesai.getMinutes() / 60;

      if (endDecimal <= startDecimal || endDecimal > 22) {
        toast.error("Jam booking tidak valid.");
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
        toast.error("Lapangan sudah terbooking.");
        setIsAvailable(false);
        return;
      }

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
    } catch {
      toast.error("Gagal membuat booking.");
    } finally {
      setLoading(false);
    }
  };

  const getDuration = () => {
    if (!jamMulai || !jamSelesai) return null;
    const startDecimal = jamMulai.getHours() + jamMulai.getMinutes() / 60;
    const endDecimal = jamSelesai.getHours() + jamSelesai.getMinutes() / 60;
    const duration = endDecimal - startDecimal;
    return duration > 0 ? duration : null;
  };

  const duration = getDuration();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 px-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="max-w-2xl mx-auto">
        {fetching ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 mx-auto rounded-lg" />
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold mb-2">Booking Lapangan</h1>
                <div className="flex items-center justify-center gap-2 text-lg">
                  <span className="font-semibold">{lapangan?.name}</span>
                  <span className="opacity-75">•</span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Rp{lapangan?.price.toLocaleString("id-ID")}/jam
                  </span>
                </div>
                <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full text-sm">
                  Jam Operasional: 07:00 - 22:00
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date and Time Selection */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Tanggal Booking
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={tanggal}
                        onChange={(date) => setTanggal(date)}
                        dateFormat="dd MMMM yyyy"
                        minDate={new Date()}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                        placeholderText="Pilih tanggal"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      <Clock className="w-4 h-4 text-green-500" />
                      Jam Mulai
                    </label>
                    <DatePicker
                      selected={jamMulai}
                      onChange={(date) => setJamMulai(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={60}
                      dateFormat="HH:mm"
                      timeCaption="Jam"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                      minTime={minTime}
                      maxTime={maxTime}
                      placeholderText="Pilih jam mulai"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      <Clock className="w-4 h-4 text-red-500" />
                      Jam Selesai
                    </label>
                    <DatePicker
                      selected={jamSelesai}
                      onChange={(date) => setJamSelesai(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={60}
                      dateFormat="HH:mm"
                      timeCaption="Jam"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
                      minTime={jamMulai ?? minTime}
                      maxTime={maxTime}
                      placeholderText="Pilih jam selesai"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentType === "full" 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="full"
                        checked={paymentType === "full"}
                        onChange={(e) => setPaymentType(e.target.value as "full" | "dp")}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentType === "full" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}>
                          {paymentType === "full" && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">Bayar Penuh</div>
                          <div className="text-sm text-gray-500">Bayar semua sekarang</div>
                        </div>
                      </div>
                    </label>

                    <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentType === "dp" 
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="dp"
                        checked={paymentType === "dp"}
                        onChange={(e) => setPaymentType(e.target.value as "full" | "dp")}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentType === "dp" ? "border-purple-500 bg-purple-500" : "border-gray-300"
                        }`}>
                          {paymentType === "dp" && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">Bayar DP (30%)</div>
                          <div className="text-sm text-gray-500">Bayar sebagian dulu</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Availability Status */}
                {checkingAvailability ? (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Memeriksa ketersediaan lapangan...</span>
                  </div>
                ) : isAvailable !== null ? (
                  <div className={`flex items-center gap-3 p-4 border rounded-xl ${
                    isAvailable 
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}>
                    {isAvailable ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-medium ${
                      isAvailable ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                    }`}>
                      {isAvailable ? "✨ Lapangan tersedia untuk waktu yang dipilih" : "❌ Waktu ini sudah terbooking"}
                    </span>
                  </div>
                ) : null}

                {/* Booking Summary */}
                {typeof totalHarga === "number" && duration && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      Ringkasan Booking
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Durasi:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {duration} jam
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Harga Dasar:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Rp{lapangan?.price.toLocaleString("id-ID")}/jam
                        </span>
                      </div>

                      {jamMulai && jamMulai.getHours() >= 18 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Tarif Malam (+):</span>
                          <span className="font-semibold text-orange-600">Rp10.000/jam</span>
                        </div>
                      )}
                      
                      <hr className="border-gray-300 dark:border-gray-600" />
                      
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold text-gray-900 dark:text-white">Total Harga:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          Rp{totalHarga.toLocaleString("id-ID")}
                        </span>
                      </div>
                      
                      {paymentType === "dp" && (
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-xl mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-700 dark:text-purple-300 font-medium">DP yang harus dibayar (30%):</span>
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              Rp{Math.round(totalHarga * 0.3).toLocaleString("id-ID")}
                            </span>
                          </div>
                          <p className="text-sm text-purple-600 dark:text-purple-300 mt-2">
                            Sisa pembayaran: Rp{Math.round(totalHarga * 0.7).toLocaleString("id-ID")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !isAvailable || !totalHarga}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-white font-bold text-lg transition-all transform ${
                    loading || !isAvailable || !totalHarga
                      ? "bg-gray-400 cursor-not-allowed scale-100"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] shadow-lg hover:shadow-xl active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-6 w-6" />
                      Memproses Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6" />
                      Konfirmasi Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
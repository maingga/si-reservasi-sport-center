"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { api } from "../../../../utils/api";

type Lapangan = {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  photo?: string;
  capacity: number;
  type: 'Futsal' | 'Badminton' | 'Basket' | 'Tennis' | 'Voli';
  status: 'available' | 'booked';
  created_at: string;
  updated_at: string;
};

export default function DetailLapangan() {
  const router = useRouter();
  const { id } = useParams();
  const [lapangan, setLapangan] = useState<Lapangan | null>(null);

  useEffect(() => {
    if (id) {
      api
        .get(`/lapangan/${id}`)
        .then((res) => setLapangan(res.data))
        .catch((err) => console.error("Gagal mengambil data lapangan:", err));
    }
  }, [id]);

  const formatRupiah = (number: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  if (!lapangan) {
    return <div className="text-center text-xl text-gray-500 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Detail Lapangan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Informasi Lapangan</h2>
          <div className="mb-2"><strong>Nama:</strong> {lapangan.name}</div>
          <div className="mb-2"><strong>Deskripsi:</strong> {lapangan.description}</div>
          <div className="mb-2"><strong>Harga:</strong> {formatRupiah(lapangan.price)}</div>
          <div className="mb-2"><strong>Lokasi:</strong> {lapangan.location}</div>
          <div className="mb-2"><strong>Kapasitas:</strong> {lapangan.capacity} orang</div>
          <div className="mb-2"><strong>Jenis:</strong> {lapangan.type}</div>
          <div className="mb-2">
            <strong>Status:</strong>{" "}
            <span className={lapangan.status === "available" ? "text-green-500" : "text-red-500"}>
              {lapangan.status === "available" ? "Tersedia" : "Dipesan"}
            </span>
          </div>
          <div className="mb-2"><strong>Dibuat:</strong> {new Date(lapangan.created_at).toLocaleString()}</div>
          <div><strong>Diubah:</strong> {new Date(lapangan.updated_at).toLocaleString()}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex justify-center items-center">
          {lapangan.photo ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${lapangan.photo}`}
              alt={lapangan.name}
              width={320}
              height={320}
              className="object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-80 h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-300">
              Tidak ada foto
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => router.push("/admin/lapangan")}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        Kembali ke Daftar Lapangan
      </button>
    </div>
  );
}

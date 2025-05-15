"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from 'next/image';
import { api } from "../../../../utils/api";

interface Lapangan {
  id: number;
  name: string;
  price: number;
  description: string;
  location: string;
  capacity: number;
  type: string;
  status: string;
  photo: string | null;
}

export default function AdminUpdateLapangan() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [type, setType] = useState("Futsal");
  const [status, setStatus] = useState("available");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [currentLapangan, setCurrentLapangan] = useState<Lapangan | null>(null);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchLapangan = async () => {
        try {
          const response = await api.get(`/lapangan/${id}`);
          const data = response.data;
          setCurrentLapangan(data);
          setName(data.name);
          setPrice(data.price);
          setDescription(data.description ?? "");
          setLocation(data.location);
          setCapacity(data.capacity);
          setType(data.type);
          setStatus(data.status);
        } catch (error) {
          console.error("Error fetching lapangan data:", error);
        }
      };
      fetchLapangan();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("location", location);
    formData.append("capacity", capacity.toString());
    formData.append("type", type);
    formData.append("status", status);
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      await api.post(`/lapangan/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lapangan berhasil diperbarui!");
      router.push("/admin/lapangan");
    } catch (err) {
      console.error("Update error:", err);
      alert("Gagal memperbarui lapangan.");
    }
  };

  if (!currentLapangan) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8">Update Lapangan</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
      >
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium mb-1">Nama Lapangan</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block text-sm font-medium mb-1">Harga Sewa</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-sm font-medium mb-1">Lokasi</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Kapasitas */}
        <div>
          <label className="block text-sm font-medium mb-1">Kapasitas</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Jenis */}
        <div>
          <label className="block text-sm font-medium mb-1">Jenis Lapangan</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Futsal">Futsal</option>
            <option value="Badminton">Badminton</option>
            <option value="Basket">Basket</option>
            <option value="Tennis">Tennis</option>
            <option value="Voli">Voli</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="available">Tersedia</option>
            <option value="booked">Sudah Dipesan</option>
          </select>
        </div>

        {/* Foto */}
        <div>
          <label className="block text-sm font-medium mb-1">Foto Lapangan (opsional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setPhotoFile(e.target.files[0]);
              }
            }}
            className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none"
          />
          {currentLapangan.photo && (
            <div className="mt-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${currentLapangan.photo}`}
                alt="Preview"
                width={180}
                height={180}
                className="rounded-lg shadow"
              />
            </div>
          )}
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition focus:ring-2 focus:ring-indigo-400"
        >
          Update Lapangan
        </button>
      </form>
    </div>
  );
}

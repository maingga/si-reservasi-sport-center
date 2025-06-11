'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaLayerGroup,
} from 'react-icons/fa';

interface Lapangan {
  id: number;
  name: string;
  location: string;
  price: number;
  capacity: number;
  type: string;
  status: string;
  photo: string;
}

export default function DetailLapangan() {
  const { id } = useParams();
  const router = useRouter();
  const [lapangan, setLapangan] = useState<Lapangan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLapangan() {
      if (!id) {
        setError('ID lapangan tidak ditemukan');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:8000/api/lapangan/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        const text = await res.text();

        try {
          const data = JSON.parse(text);
          if (!res.ok) {
            setError(data.message || 'Terjadi kesalahan');
            setLapangan(null);
          } else {
            setLapangan(data);
          }
        } catch (jsonError: unknown) {
          if (jsonError instanceof Error) {
            setError(`Respons server tidak valid JSON: ${jsonError.message}`);
          } else {
            setError('Respons server tidak valid JSON');
          }
          setLapangan(null);
          console.error('Response not JSON:', text);
        }
      } catch (fetchError) {
        setError('Gagal mengambil data lapangan');
        setLapangan(null);
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    }

    fetchLapangan();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );

  if (error)
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 rounded-lg border border-red-400 bg-red-100 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
        <p>{error}</p>
      </div>
    );

  if (!lapangan)
    return (
      <div className="max-w-xl mx-auto p-5 text-center text-gray-600 dark:text-gray-400 font-medium">
        <p>Lapangan tidak ditemukan.</p>
      </div>
    );

  return (
    <article className="max-w-4xl mx-auto p-6 md:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        {lapangan.name}
      </h1>

      {lapangan.photo && (
        <div className="relative w-full h-80 md:h-[28rem] rounded-xl overflow-hidden shadow-xl mb-10">
          <Image
            src={`http://localhost:8000/storage/${lapangan.photo}`}
            alt={lapangan.name}
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-800 dark:text-gray-300">
        <DetailItem
          icon={<FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />}
          title="Lokasi"
          value={lapangan.location}
        />
        <DetailItem
          icon={<FaDollarSign className="text-green-600 dark:text-green-400" />}
          title="Harga"
          value={`Rp ${lapangan.price.toLocaleString()}`}
        />
        <DetailItem
          icon={<FaUsers className="text-purple-600 dark:text-purple-400" />}
          title="Kapasitas"
          value={`${lapangan.capacity} orang`}
        />
        <DetailItem
          icon={<FaLayerGroup className="text-orange-500 dark:text-orange-400" />}
          title="Jenis Lapangan"
          value={lapangan.type}
        />

        <div className="sm:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2 dark:text-gray-200 flex items-center gap-2">
            Status:
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold 
                ${lapangan.status.toLowerCase() === 'tersedia'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                  : lapangan.status.toLowerCase() === 'tidak tersedia'
                  ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {lapangan.status}
            </span>
          </h2>
        </div>
      </section>

      <div className="mt-12 text-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-full shadow-md hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300"
        >
          ← Kembali
        </button>
      </div>
    </article>
  );
}

function DetailItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      <div>
        <h3 className="text-md font-semibold mb-1 dark:text-white">{title}</h3>
        <p className="text-md">{value}</p>
      </div>
    </div>
  );
}

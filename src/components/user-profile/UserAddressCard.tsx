'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { api } from '@/app/utils/api';
import { AxiosError } from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  photo?: string; // Bisa berisi full URL atau relative path
}

interface UserAddressCardProps {
  user: User;
}

export default function UserAddressCard({ user }: UserAddressCardProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Base URL backend Laravel
  const backendBaseUrl = 'http://localhost:8000';

  // Set preview saat user.photo berubah (dari backend)
  useEffect(() => {
    if (user.photo) {
      if (user.photo.startsWith('http')) {
        setPreview(user.photo);
      } else if (user.photo.startsWith('/')) {
        setPreview(`${backendBaseUrl}${user.photo}`);
      } else {
        setPreview(`${backendBaseUrl}/storage/${user.photo}`);
      }
    } else {
      setPreview('');
    }
  }, [user.photo]);

  // Preview gambar lokal sebelum upload
  useEffect(() => {
    if (!photo) return;

    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const handleUpload = async () => {
    if (!photo) {
      alert('Pilih foto dulu ya.');
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const res = await api.post('/profile/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.photo_url) {
        // Update preview dengan URL lengkap dari backend
        const uploadedPhotoUrl = res.data.photo_url.startsWith('http')
          ? res.data.photo_url
          : `${backendBaseUrl}${res.data.photo_url}`;
        setPreview(uploadedPhotoUrl);
        alert('Foto berhasil diupload!');
        setPhoto(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setError('Upload gagal, coba lagi.');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message = axiosError?.response?.data?.message || 'Upload gagal';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm
                 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300 max-w-sm"
    >
      <p className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Foto Profil</p>

      {preview ? (
        <div
          className="relative w-32 h-32 mb-5 rounded-full border border-gray-300 overflow-hidden
                        dark:border-gray-600 mx-auto"
        >
          <Image
            src={preview}
            alt="Foto Profil"
            fill
            style={{ objectFit: 'cover' }}
            sizes="128px"
            priority={false}
          />
        </div>
      ) : (
        <div
          className="w-32 h-32 mb-5 rounded-full border border-dashed border-gray-300
                     flex items-center justify-center bg-gray-100 text-gray-400 mx-auto
                     dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500"
        >
          Tidak ada foto
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
            setError(null);
          }
        }}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100
                   dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800
                   mb-4"
        disabled={loading}
      />

      {error && (
        <p className="mb-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!photo || loading}
        className={`w-full rounded px-4 py-2 text-white font-semibold
                    ${photo && !loading
                      ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                      : 'bg-green-400 cursor-not-allowed'}
                    transition-colors duration-200`}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

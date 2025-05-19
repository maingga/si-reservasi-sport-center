'use client';

import UserMetaCard from '@/components/user-profile/UserMetaCard';
import UserInfoCard from '@/components/user-profile/UserInfoCard';
import UserAddressCard from '@/components/user-profile/UserAddressCard';
import React, { useEffect, useState } from 'react';
import { api } from "@/app/utils/api";
import { AxiosError } from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  photo?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ success: boolean; data: User }>('/me');
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setUser(null);
          setError('User tidak ditemukan');
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError('Gagal memuat data user. Silakan coba lagi.');
          console.error('Axios error fetching user:', error.response?.data || error.message);
        } else {
          setError('Terjadi kesalahan tidak terduga.');
          console.error('Unexpected error:', error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-6">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            setUser(null);
            // Re-fetch profile
            (async () => {
              try {
                const res = await api.get<{ success: boolean; data: User }>('/me');
                if (res.data.success) {
                  setUser(res.data.data);
                  setError(null);
                } else {
                  setUser(null);
                  setError('User tidak ditemukan');
                }
              } catch {
                setError('Gagal memuat data user. Silakan coba lagi.');
              } finally {
                setLoading(false);
              }
            })();
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400 p-6">
        User tidak ditemukan
      </p>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
          Profile
        </h3>
        <div className="space-y-8">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} setUser={setUser} />
          <UserAddressCard user={user} />
        </div>
      </div>
    </main>
  );
}

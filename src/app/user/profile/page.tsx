"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    email: string;
    name: string;
    phone?: string;
    photo?: string;
  } | null>(null);

  const [form, setForm] = useState({ name: "", phone: "" });
  const [file, setFile] = useState<File | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data.data || res.data;
        setProfile(userData);
        setForm({ name: userData.name, phone: userData.phone || "" });
      } catch (error) {
        console.error("Gagal ambil profil:", error);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/api/profile/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profil berhasil diperbarui!");
      setProfile((prev) => (prev ? { ...prev, ...form } : prev));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal update profil.");
    }
  };

  const handleUploadPhoto = async () => {
    if (!file) return alert("Pilih file terlebih dahulu.");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/profile/upload-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Foto profil berhasil diupload!");
      setProfile((prev) =>
        prev ? { ...prev, photo: res.data.photo_url || prev.photo } : prev
      );
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Gagal upload foto.");
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  const avatarUrl = profile.photo
    ? profile.photo.startsWith("http")
      ? profile.photo
      : `${BASE_URL}/storage/${profile.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile.name
      )}&background=ea4c89&color=fff&rounded=true`;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-3xl font-semibold mb-8">Profil Pengguna</h1>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Email</label>
        <input
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          value={profile.email}
          disabled
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Nama</label>
        <input
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Masukkan nama"
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">No. HP</label>
        <input
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Masukkan nomor HP"
        />
      </div>

      <button
        onClick={handleUpdate}
        className="w-full mb-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md shadow-md transition-colors"
      >
        Simpan Perubahan
      </button>

      <hr className="border-gray-300 dark:border-gray-700 mb-8" />

      <div className="mb-6">
        <label className="block font-semibold mb-4">Foto Profil Saat Ini</label>
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-600 mx-auto">
          <Image
            src={avatarUrl}
            alt="Foto Profil"
            width={128}
            height={128}
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Upload Foto Profil</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-pink-50 file:text-pink-700
                     hover:file:bg-pink-100
                     dark:file:bg-pink-900 dark:file:text-pink-300
                     dark:hover:file:bg-pink-800"
        />
      </div>

      <button
        onClick={handleUploadPhoto}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors"
      >
        Upload Foto
      </button>
    </div>
  );
}

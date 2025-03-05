"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password harus sama");
      return;
    }

    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Registrasi gagal");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-20">
      <motion.div
        className="relative z-10 bg-gray-900/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-[400px] text-center border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-white mb-6">Buat Akun</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            onChange={handleChange}
            required
            className="peer w-full p-3 border-none rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 caret-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="peer w-full p-3 border-none rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 caret-white"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Nomor HP"
            onChange={handleChange}
            required
            className="peer w-full p-3 border-none rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 caret-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="peer w-full p-3 border-none rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 caret-white"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Konfirmasi Password"
            onChange={handleChange}
            required
            className="peer w-full p-3 border-none rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 caret-white"
          />
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white p-3 rounded-xl font-semibold shadow-lg hover:from-red-700 hover:to-orange-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Daftar Sekarang
          </motion.button>
        </form>
        <p className="text-gray-400 text-sm mt-4">
          Sudah punya akun?{" "}
          <a href="/login" className="text-red-400 hover:underline">
            Masuk di sini
          </a>
        </p>
      </motion.div>
    </section>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // Cegah hydration mismatch
  const router = useRouter();

  // Tandai bahwa komponen telah dimount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login gagal");
      }

      const { token } = await res.json();

      // Pastikan token hanya diakses setelah komponen dimount
      if (mounted) {
        localStorage.setItem("token", token);
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [formData, router, mounted]);

  // Hindari render sebelum komponen dimount untuk menghindari mismatch
  if (!mounted) return null;

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-20">
      <motion.div
        className="relative z-10 bg-gray-900/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-[400px] text-center border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-white mb-6">Masuk</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
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
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white p-3 rounded-xl font-semibold shadow-lg hover:from-red-700 hover:to-orange-600 transition duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </motion.button>
        </form>
        <p className="text-gray-400 text-sm mt-4">
          Belum punya akun? <Link href="/register" className="text-red-400 hover:underline">Daftar di sini</Link>
        </p>
      </motion.div>
    </section>
  );
}
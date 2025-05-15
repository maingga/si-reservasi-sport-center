"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const res = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Login gagal");
        }

        const { token, user } = data.data;

        if (mounted) {
          localStorage.setItem("token", token); // Simpan token
          localStorage.setItem("user", JSON.stringify(user)); // Simpan data user

          if (user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/user");
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    },
    [formData, router, mounted]
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Header />
      <section className="flex items-center justify-center py-16 px-4">
        <motion.div
          className="bg-gray-900/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-white text-center mb-6">Masuk</h2>
          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-gray-300 font-medium text-left">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="p-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 border border-gray-700"
              />
            </div>

            {/* Password dengan toggle icon */}
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="text-sm text-gray-300 font-medium text-left">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="p-3 pr-10 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 border border-gray-700"
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-gray-400 hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Tombol Login */}
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

          <p className="text-gray-400 text-sm mt-6 text-center">
            Belum punya akun?{" "}
            <Link href="/register" className="text-red-400 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}

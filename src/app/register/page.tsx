"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleInputValidation = useCallback(() => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "Semua kolom harus diisi";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Format email tidak valid";
    }
    if (!/^\d{10,13}$/.test(formData.phone)) {
      return "Nomor HP harus berisi 10-13 digit angka";
    }
    if (formData.password.length < 6) {
      return "Password harus memiliki minimal 6 karakter";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Password dan konfirmasi password harus sama";
    }
    return "";
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationError = handleInputValidation();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

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
          <h2 className="text-3xl font-extrabold text-white text-center mb-6">Buat Akun</h2>
          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm text-gray-300 font-medium">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                required
                className="p-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 border border-gray-700"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-gray-300 font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="p-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 border border-gray-700"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-sm text-gray-300 font-medium">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Nomor HP"
                onChange={handleChange}
                required
                className="p-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 border border-gray-700"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="text-sm text-gray-300 font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="confirmPassword" className="text-sm text-gray-300 font-medium">Konfirmasi Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                onChange={handleChange}
                required
                className="p-3 pr-10 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 border border-gray-700"
              />
              <div
                className="absolute right-3 top-10 cursor-pointer text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white p-3 rounded-xl font-semibold shadow-lg hover:from-red-700 hover:to-orange-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Daftar Sekarang
            </motion.button>
          </form>
          <p className="text-gray-400 text-sm mt-6 text-center">
            Sudah punya akun?{" "}
            <a href="/login" className="text-red-400 hover:underline">
              Masuk di sini
            </a>
          </p>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
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

  // Fungsi untuk menangani perubahan input
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // Validasi input sebelum submit
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

  // Fungsi submit form
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
          {["name", "email", "phone", "password", "confirmPassword"].map(
            (field, index) => (
              <input
                key={index}
                type={
                  field.includes("password")
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                name={field}
                placeholder={
                  field === "confirmPassword"
                    ? "Konfirmasi Password"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                onChange={handleChange}
                required
                className="peer w-full p-3 border-none rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 caret-white"
              />
            )
          )}
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

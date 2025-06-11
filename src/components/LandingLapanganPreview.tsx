// src/components/LandingLapanganPreview.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const lapanganList = [
  {
    id: 1,
    nama: "Futsal Champion Court",
    gambar: "/images/lapfutsal2.jpg",
    lokasi: "Jl. Tlogomas No.88, Malang",
  },
  {
    id: 2,
    nama: "Basket Indoor Pro",
    gambar: "/images/lapbasket1.jpg",
    lokasi: "Jl. Gatot Subroto No.45, Malang",
  },
  {
    id: 3,
    nama: "Badminton Supreme Hall",
    gambar: "/images/lapbadminton1.jpg",
    lokasi: "Jl. Asia Afrika No.22, Malang",
  },
];

const LandingLapanganPreview = () => {
  return (
    <section
      id="LandingLapanganPreview"
      className="bg-gray-900 text-white py-20"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold mb-12 text-red-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Preview Lapangan
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {lapanganList.map((lapangan, index) => (
            <motion.div
              key={lapangan.id}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
            >
              <Image
                src={lapangan.gambar}
                alt={lapangan.nama}
                width={400}
                height={250}
                className="w-full h-52 object-cover"
              />
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold mb-2">
                  {lapangan.nama}
                </h3>
                <p className="text-gray-300">{lapangan.lokasi}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingLapanganPreview;

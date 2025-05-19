'use client';

import { FaFutbol, FaCreditCard, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Features = () => {
  return (
    <section id="features" className="bg-gray-900 text-white py-20">
      <div className="container mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold mb-12 text-red-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Fitur Utama
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Reservasi Mudah */}
          <motion.div
            className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <FaFutbol className="text-red-500 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Reservasi Mudah</h3>
            <p className="text-gray-300">Pesan lapangan hanya dalam beberapa klik.</p>
          </motion.div>

          {/* Pembayaran Online */}
          <motion.div
            className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <FaCreditCard className="text-red-500 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Pembayaran Online</h3>
            <p className="text-gray-300">Dukung berbagai metode pembayaran yang aman.</p>
          </motion.div>

          {/* Waktu Fleksibel */}
          <motion.div
            className="bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <FaClock className="text-red-500 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Waktu Fleksibel</h3>
            <p className="text-gray-300">Atur jadwal sesuai dengan kebutuhan Anda.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;

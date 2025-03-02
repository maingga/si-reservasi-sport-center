'use client';

import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section 
      className="relative flex items-center justify-center h-screen text-white bg-fixed bg-center bg-cover"
      style={{ backgroundImage: 'url(/images/headersection.jpg)' }}
    >
      {/* Overlay dengan gradient untuk kontras lebih baik */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>

      {/* Konten Hero */}
      <div className="relative z-10 text-center px-6 md:px-12">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Selamat Datang di <span className="text-red-500">Sport Center</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-2xl mt-4 opacity-90 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          Reservasi lapangan olahraga dengan mudah, cepat, dan nyaman!
        </motion.p>

        <motion.button
          className="mt-6 bg-red-600 text-white py-3 px-8 rounded-full font-semibold text-lg shadow-xl 
          hover:bg-red-700 transition duration-300 transform hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Mulai Sekarang
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;

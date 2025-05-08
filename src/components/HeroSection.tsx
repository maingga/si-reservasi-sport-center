'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const variants = {
  heading: { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } } },
  text: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3, ease: "easeOut" } } },
  button: { hover: { scale: 1.1 }, tap: { scale: 0.95 } }
};

const HeroSection = () => {
  const router = useRouter();
  const handleRegister = useCallback(() => router.push('/register'), [router]);

  return (
    <section className="relative flex items-center justify-center h-screen text-white bg-fixed bg-center bg-cover bg-[url('/images/headersection.jpg')]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Konten Hero */}
      <div className="relative z-10 text-center px-6 md:px-12">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold leading-tight"
          variants={variants.heading}
          initial="hidden"
          animate="visible"
        >
          Selamat Datang di <span className="text-red-500">Sport Center</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-2xl mt-4 opacity-90 max-w-2xl mx-auto"
          variants={variants.text}
          initial="hidden"
          animate="visible"
        >
          Reservasi lapangan olahraga dengan mudah, cepat, dan nyaman!
        </motion.p>

        <motion.button
          className="mt-6 bg-red-600 text-white py-3 px-8 rounded-full font-semibold text-lg shadow-xl 
          hover:bg-red-700 transition duration-300"
          variants={variants.button}
          whileHover="hover"
          whileTap="tap"
          onClick={handleRegister}
        >
          Mulai Sekarang
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;

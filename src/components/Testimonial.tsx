"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "&ldquo;Proses pemesanan yang sangat mudah dan cepat!&rdquo;",
    author: "Nana",
  },
  {
    quote: "&ldquo;Layanan pelanggan yang luar biasa. Sangat membantu!&rdquo;",
    author: "Gana",
  },
  {
    quote: "&ldquo;Lapangan bersih dan nyaman. Sangat direkomendasikan!&rdquo;",
    author: "Hafidz",
  },
];

const Testimonial = () => {
  return (
    <section id="testimonial" className="bg-gray-900 text-white py-20 px-6">
      <div className="container mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold mb-12 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Apa Kata Pengguna Kami
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center border border-gray-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p
                className="text-lg italic mb-4"
                dangerouslySetInnerHTML={{ __html: testimonial.quote }}
              ></p>
              <span className="font-semibold text-gray-300">- {testimonial.author}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

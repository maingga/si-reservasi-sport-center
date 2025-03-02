// src/app/components/Testimonial.tsx

const testimonials = [
    {
      quote: "Proses pemesanan yang sangat mudah dan cepat!",
      author: "John Doe",
    },
    {
      quote: "Layanan pelanggan yang luar biasa. Sangat membantu!",
      author: "Jane Smith",
    },
    {
      quote: "Produk berkualitas tinggi. Saya sangat puas.",
      author: "David Lee",
    },
  ];
  
  const Testimonial = () => {
    return (
      <section id="testimonial" className="bg-blue-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Apa Kata Pengguna Kami</h2>
          <div className="max-w-xl mx-auto grid gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <p className="text-xl mb-4 italic">{testimonial.quote}</p>
                <span className="font-semibold">- {testimonial.author}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonial;
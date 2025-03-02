// src/app/components/Features.tsx
const Features = () => {
    return (
      <section id="features" className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Fitur Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Reservasi Mudah</h3>
              <p>Pesan lapangan dalam beberapa klik.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Pembayaran Online</h3>
              <p>Bayar dengan mudah menggunakan berbagai metode pembayaran.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Waktu Fleksibel</h3>
              <p>Sesuaikan waktu sesuai kebutuhan Anda.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;
  
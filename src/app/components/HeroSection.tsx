// src/app/components/HeroSection.tsx
const HeroSection = () => {
    return (
      <section 
        className="bg-cover bg-center text-white p-24 relative" 
        style={{ backgroundImage: 'url(/images/headersection.jpg)' }}
      >
        {/* Overlay untuk meningkatkan kontras */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-xl">
            Selamat Datang di Sport Center
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-shadow-lg">
            Reservasi lapangan olahraga dengan mudah dan cepat!
          </p>
          
          <button className="bg-red-500 text-white py-3 px-8 rounded-full hover:bg-red-700 transition duration-300 transform hover:scale-105 shadow-lg">
            Mulai Sekarang
          </button>
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  
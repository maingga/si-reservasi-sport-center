// src/app/home/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Testimonial from "@/components/Testimonial";

const HomePage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <Features />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default HomePage;

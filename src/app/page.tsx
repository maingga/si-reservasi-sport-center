// src/app/home/page.tsx
import Header from "../app/components/Header";
import Footer from "../app/components/Footer";
import HeroSection from "../app/components/HeroSection";
import Features from "../app/components/Features";
import Testimonial from "../app/components/Testimonial";

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

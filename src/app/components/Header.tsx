"use client";

import { useState, useEffect } from "react";
import { FaHome, FaRocket, FaCommentDots, FaBars, FaTimes } from "react-icons/fa";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const Typewriter = dynamic(() => import("react-simple-typewriter").then(mod => mod.Typewriter), { ssr: false });

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-4 ${
        isScrolled ? "bg-black/90 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo & Animasi Typewriter */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/football.png"
            alt="Sport Center Logo"
            width={50}
            height={50}
            className="object-contain"
            priority
          />
          <h1 className="text-3xl font-extrabold text-white">
            <Typewriter
              words={["Sport Center"]}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </h1>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-lg font-semibold text-white">
          <li className="flex items-center space-x-2 group">
            <FaHome className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition duration-300" />
            <Link href="#" className="hover:text-red-500 transition duration-300">
              Home
            </Link>
          </li>
          <li className="flex items-center space-x-2 group">
            <FaRocket className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition duration-300" />
            <Link href="#features" className="hover:text-red-500 transition duration-300">
              Features
            </Link>
          </li>
          <li className="flex items-center space-x-2 group">
            <FaCommentDots className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition duration-300" />
            <Link href="#testimonial" className="hover:text-red-500 transition duration-300">
              Testimonial
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-md transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 md:hidden flex flex-col items-center justify-center space-y-8`}
      >
        <button className="absolute top-6 right-6 text-white text-2xl" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </button>
        <ul className="text-white text-2xl space-y-6">
          <li>
            <Link href="#" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="#features" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition duration-300">
              Features
            </Link>
          </li>
          <li>
            <Link href="#testimonial" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition duration-300">
              Testimonial
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;

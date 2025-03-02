"use client";

import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto text-center">
        {/* Logo & Navigasi */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 px-6">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/football.png"
              alt="Sport Center Logo"
              width={48} // Atur width sesuai kebutuhan
              height={48} // Atur height sesuai kebutuhan
              priority // Optimasi LCP dengan priority
            />
            <h2 className="text-2xl font-bold">Sport Center</h2>
          </div>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-gray-300 text-lg">
              <li>
                <a
                  href="#"
                  className="hover:text-red-500 transition duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-red-500 transition duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#testimonial"
                  className="hover:text-red-500 transition duration-300"
                >
                  Testimonial
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-red-500 transition duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Garis Pemisah */}
        <hr className="border-gray-700 my-4" />

        {/* Copyright & Social Media */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6">
          <p className="text-gray-400">
            &copy; 2025 Sport Center - All Rights Reserved
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-300 hover:text-blue-500 transition duration-300"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-sky-400 transition duration-300"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-red-500 transition duration-300"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

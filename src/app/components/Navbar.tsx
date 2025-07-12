"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Anasayfa", href: "/#hero" },
  { name: "Hizmetler", href: "/#hizmetler" },
  { name: "Galeri", href: "/galeri" },
  { name: "Blog", href: "/blog" },
  { name: "Hakkımızda", href: "/#hakkimizda" },
  { name: "İletişim", href: "/#iletisim" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur shadow-md"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-2 min-w-0">
          <img src="/logo.png" alt="Enerji Bobinaj Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
          <Link href="/#hero" className="truncate text-lg sm:text-2xl font-bold text-orange-600 tracking-tight">Enerji Bobinaj</Link>
        </div>
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menüyü Aç/Kapat"
        >
          <span className={`block w-7 h-1 bg-blue-900 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-7 h-1 bg-blue-900 rounded my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-7 h-1 bg-blue-900 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        <div className="hidden sm:flex gap-4">
          {navLinks.map((link) => (
            <motion.span
              key={link.name}
              whileHover={{ scale: 1.1, color: "#ea580c" }}
              className="text-blue-900 font-medium px-2 py-1 transition-colors hover:text-orange-600 cursor-pointer"
              onClick={() => window.location.href = link.href}
            >
              {link.name}
            </motion.span>
          ))}
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden bg-white/95 shadow-md px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <span
              key={link.name}
              className="text-blue-900 font-medium px-2 py-2 rounded hover:bg-orange-100 transition-colors cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                window.location.href = link.href;
              }}
            >
              {link.name}
            </span>
          ))}
        </div>
      )}
    </motion.nav>
  );
} 
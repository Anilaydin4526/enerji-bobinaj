"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { name: "Anasayfa", href: "/#hero" },
  { name: "Hizmetler", href: "/#hizmetler" },
  { name: "Galeri", href: "/#galeri" },
  { name: "Hakkımızda", href: "/#hakkimizda" },
  { name: "İletişim", href: "/#iletisim" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur shadow-md"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Enerji Bobinaj Logo" className="h-10 w-10 object-contain" />
          <Link href="/#hero" className="text-2xl font-bold text-orange-600 tracking-tight">Enerji Bobinaj</Link>
        </div>
        <div className="flex gap-4">
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
    </motion.nav>
  );
} 
"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="bg-blue-900 text-white text-center py-6 mt-8 shadow-inner"
    >
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-semibold">© {new Date().getFullYear()} Enerji Bobinaj</span>
        <span className="text-sm">Tasarım & Kodlama: AI + İnsan</span>
      </div>
    </motion.footer>
  );
} 
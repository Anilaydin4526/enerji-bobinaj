"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const bloglar = [
  {
    id: 1,
    title: "Enerji Bobinajda Kalite Standartları",
    summary: "Bobinaj işlemlerinde kaliteyi artıran yöntemler ve firmamızın uyguladığı standartlar.",
    img: "/blog1.jpg"
  },
  {
    id: 2,
    title: "Elektrik Motorlarında Bakımın Önemi",
    summary: "Elektrik motorlarının ömrünü uzatmak için düzenli bakımın önemi ve pratik ipuçları.",
    img: "/blog2.jpg"
  },
  {
    id: 3,
    title: "Jeneratör Sarımında Yenilikçi Çözümler",
    summary: "Firmamızın jeneratör sarımında sunduğu yenilikçi teknikler ve avantajları.",
    img: "/blog3.jpg"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8 flex flex-col items-center">
      <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl font-bold text-blue-900 mb-12 text-center">Blog</motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {bloglar.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.id}`} passHref legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #0002" }}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-all cursor-pointer"
            >
              <Image src={blog.img} alt={blog.title} width={240} height={140} className="rounded-lg mb-4 object-cover" />
              <h2 className="text-xl font-semibold text-blue-800 mb-2">{blog.title}</h2>
              <p className="text-blue-700 text-sm mb-2">{blog.summary}</p>
              <span className="text-orange-600 font-medium mt-2">Devamını Oku →</span>
            </motion.a>
          </Link>
        ))}
      </div>
    </div>
  );
} 
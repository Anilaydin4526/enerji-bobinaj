"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Gallery = {
  id: number;
  imageUrl: string;
  title?: string;
  [key: string]: any;
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/gallery")
      .then(r => r.json())
      .then(data => {
        setGallery(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Galeri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100">
      <div className="pt-20">
        {/* HEADER */}
        <section className="py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-6xl font-bold text-blue-900 mb-4"
          >
            Galeri
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl text-blue-800 max-w-2xl mx-auto"
          >
            Enerji Bobinaj'ın çalışmalarından örnekler
          </motion.p>
        </section>

        {/* GALLERY GRID */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item, index) => (
                <Link key={item.id} href={`/galeri/${item.id}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "Galeri görseli"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {item.title && (
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-blue-800">{item.title}</h3>
                      </div>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
            
            {gallery.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-blue-600 text-lg">Henüz galeri görseli eklenmemiş.</p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
} 
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Blog = {
  id: number;
  title: string;
  image: string;
  summary?: string;
  [key: string]: any;
};

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/blog")
      .then(r => r.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Blog yükleniyor...</p>
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
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl text-blue-800 max-w-2xl mx-auto"
          >
            Enerji Bobinaj'dan güncel haberler ve teknik bilgiler
          </motion.p>
        </section>

        {/* BLOG GRID */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <Link key={blog.id} href={`/blog/${blog.id}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="relative h-48">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-xl font-semibold text-blue-800 mb-3 line-clamp-2">{blog.title}</h2>
                      {blog.summary && (
                        <p className="text-blue-700 text-sm mb-4 flex-1 line-clamp-3">{blog.summary}</p>
                      )}
                      <span className="text-orange-600 font-medium mt-auto">Devamını Oku →</span>
                    </div>
                  </motion.div>
          </Link>
        ))}
            </div>
            
            {blogs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-blue-600 text-lg">Henüz blog yazısı eklenmemiş.</p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
} 
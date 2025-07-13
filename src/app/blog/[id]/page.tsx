"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BlogDetay() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/public/blog`).then(r => r.json()).then(data => {
      const found = data.find((b: any) => String(b.id) === String(id));
      setBlog(found);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
  if (!blog) return <div className="p-10 text-center text-red-600">Blog yazısı bulunamadı.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full flex flex-col items-center">
        {blog.image && (
          <Image src={blog.image} alt={blog.title} width={500} height={300} className="rounded-lg mb-6 object-cover" />
        )}
        <h1 className="text-3xl font-bold text-blue-900 mb-4 text-center">{blog.title}</h1>
        {blog.summary && <div className="text-blue-700 text-base mb-2 text-center">{blog.summary}</div>}
        <div className="text-blue-800 text-lg mb-4 text-center whitespace-pre-line">{blog.content}</div>
      </motion.div>
    </div>
  );
} 
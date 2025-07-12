"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Gallery = {
  id: number;
  imageUrl: string;
  title?: string;
  description?: string;
  [key: string]: any;
};

export default function GaleriDetay() {
  const { id } = useParams();
  const [data, setData] = useState<Gallery | null>(null);
  useEffect(() => {
    fetch(`/api/public/gallery/${id}`).then(r => r.json()).then(setData);
  }, [id]);

  if (!data) return <div className="p-10 text-center text-red-600">Görsel bulunamadı.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full flex flex-col items-center">
        <Image src={data.imageUrl || ""} alt={data.title || "Galeri görseli"} width={500} height={340} className="rounded-lg mb-6 object-cover" />
        <h1 className="text-2xl font-bold text-blue-900 mb-2">{data.title || "Galeri"}</h1>
        <p className="text-blue-800 text-lg mb-4 text-center">{data.description || ""}</p>
      </motion.div>
    </div>
  );
} 
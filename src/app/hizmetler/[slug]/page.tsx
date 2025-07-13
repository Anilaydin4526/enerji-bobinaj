"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HizmetDetay() {
  const { slug } = useParams();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/settings").then(r => r.json()).then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  // Slug'dan index ayıkla: beklenen format 'service-1', 'service-2'...
  const match = typeof slug === 'string' && slug.match(/^service-(\d+)$/);
  const idx = match ? parseInt(match[1]) : null;
  if (!idx) return <div className="p-10 text-center text-red-600">Hizmet bulunamadı.</div>;

  const getSetting = (key: string, fallback: string = "") => settings.find(s => s.key === key)?.value || fallback;

  const title = getSetting(`service_${idx}_title`, "Hizmet bulunamadı");
  const desc = getSetting(`service_${idx}_desc`, "");
  const img = getSetting(`service_${idx}_img`, "/motor.jpg");
  const detail = getSetting(`service_${idx}_detail`, "");

  // Eğer başlık yoksa hizmet silinmiş demektir
  if (!title || title.trim() === "") return <div className="p-10 text-center text-red-600">Hizmet bulunamadı.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full flex flex-col items-center">
        <Image src={img} alt={title} width={180} height={180} className="rounded-full mb-6 object-cover" />
        <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
        <p className="text-blue-800 text-lg mb-4 text-center">{desc}</p>
        {detail && <div className="text-blue-700 text-base mb-2 text-center whitespace-pre-line">{detail}</div>}
      </motion.div>
    </div>
  );
} 
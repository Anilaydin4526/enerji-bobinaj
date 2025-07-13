"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const serviceMap = {
  "motor-bobinaji": 1,
  "jenerator-sarimi": 2,
  "trafo-bakim-sarim": 3
};

export default function HizmetDetay() {
  const { slug } = useParams();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const serviceIdx = serviceMap[slug as keyof typeof serviceMap];

  useEffect(() => {
    fetch("/api/public/settings").then(r => r.json()).then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  if (!serviceIdx) return <div className="p-10 text-center text-red-600">Hizmet bulunamadı.</div>;
  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  const getSetting = (key: string, fallback: string = "") => settings.find(s => s.key === key)?.value || fallback;

  const title = getSetting(`service_${serviceIdx}_title`, [
    "Motor Bobinajı",
    "Jeneratör Sarımı",
    "Trafo Bakım & Sarım"
  ][serviceIdx-1]);
  const desc = getSetting(`service_${serviceIdx}_desc`, [
    "Her tip elektrik motoru için profesyonel bobinaj hizmeti. Uzman ekibimizle hızlı ve garantili çözümler sunuyoruz.",
    "Jeneratörler için kaliteli ve garantili sarım işlemleri. Endüstriyel ve bireysel çözümler.",
    "Trafo sarımı ve bakımı, uzman ekibimizle. Yüksek verim ve güvenlik için profesyonel hizmet."
  ][serviceIdx-1]);
  const img = getSetting(`service_${serviceIdx}_img`, [
    "/motor.jpg",
    "/jenerator.jpg",
    "/trafo.jpg"
  ][serviceIdx-1]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full flex flex-col items-center">
        <Image src={img} alt={title} width={180} height={180} className="rounded-full mb-6 object-cover" />
        <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
        <p className="text-blue-800 text-lg mb-4 text-center">{desc}</p>
      </motion.div>
    </div>
  );
} 
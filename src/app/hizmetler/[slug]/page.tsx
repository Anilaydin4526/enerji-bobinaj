"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const hizmetler = {
  "motor-bobinaji": {
    title: "Motor Bobinajı",
    desc: "Her tip elektrik motoru için profesyonel bobinaj hizmeti. Uzman ekibimizle hızlı ve garantili çözümler sunuyoruz.",
    img: "/motor.jpg"
  },
  "jenerator-sarimi": {
    title: "Jeneratör Sarımı",
    desc: "Jeneratörler için kaliteli ve garantili sarım işlemleri. Endüstriyel ve bireysel çözümler.",
    img: "/jenerator.jpg"
  },
  "trafo-bakim-sarim": {
    title: "Trafo Bakım & Sarım",
    desc: "Trafo sarımı ve bakımı, uzman ekibimizle. Yüksek verim ve güvenlik için profesyonel hizmet.",
    img: "/trafo.jpg"
  }
};

export default function HizmetDetay() {
  const { slug } = useParams();
  const data = hizmetler[slug as keyof typeof hizmetler];

  if (!data) return <div className="p-10 text-center text-red-600">Hizmet bulunamadı.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full flex flex-col items-center">
        <Image src={data.img} alt={data.title} width={180} height={180} className="rounded-full mb-6 object-cover" />
        <h1 className="text-3xl font-bold text-blue-900 mb-4">{data.title}</h1>
        <p className="text-blue-800 text-lg mb-4 text-center">{data.desc}</p>
      </motion.div>
    </div>
  );
} 
"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const galeri = [
  { id: 1, img: "/gallery1.jpg", desc: "Enerji bobinaj atölyemizden bir kare." },
  { id: 2, img: "/gallery2.jpg", desc: "Yüksek güçlü motor sarım işlemi." },
  { id: 3, img: "/gallery3.jpg", desc: "Jeneratör bakım ve test aşaması." },
  { id: 4, img: "/gallery4.jpg", desc: "Trafo sarımında kalite kontrol." },
  { id: 5, img: "/gallery5.jpg", desc: "Bobinaj ekibimiz iş başında." },
  { id: 6, img: "/gallery6.jpg", desc: "Modern ekipmanlarımız ile üretim." },
  { id: 7, img: "/gallery7.jpg", desc: "Atölyemizden bir başka kare." },
  { id: 8, img: "/gallery8.jpg", desc: "Enerji bobinajda detaylar." },
];

export default function GaleriDetay() {
  const { id } = useParams();
  const data = galeri.find(g => g.id === Number(id));

  if (!data) return <div className="p-10 text-center text-red-600">Görsel bulunamadı.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full flex flex-col items-center">
        <Image src={data.img} alt={data.desc} width={500} height={340} className="rounded-lg mb-6 object-cover" />
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Galeri #{data.id}</h1>
        <p className="text-blue-800 text-lg mb-4 text-center">{data.desc}</p>
      </motion.div>
    </div>
  );
} 
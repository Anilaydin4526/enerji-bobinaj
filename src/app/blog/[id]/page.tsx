"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const bloglar = [
  {
    id: 1,
    title: "Enerji Bobinajda Kalite Standartları",
    img: "/blog1.jpg",
    content: `
      Enerji bobinaj işlemlerinde kalite, hem kullanılan malzeme hem de işçilikle doğrudan ilişkilidir. Firmamızda uluslararası standartlara uygun malzemeler kullanılır ve her aşama titizlikle kontrol edilir. Kaliteyi artırmak için otomasyon sistemleri ve son teknoloji test cihazları ile üretim yapılır.
    `
  },
  {
    id: 2,
    title: "Elektrik Motorlarında Bakımın Önemi",
    img: "/blog2.jpg",
    content: `
      Elektrik motorlarının ömrünü uzatmak ve verimliliğini korumak için düzenli bakım şarttır. Firmamız, periyodik bakım hizmetleriyle motor arızalarını önler ve enerji tasarrufu sağlar. Bakımda dikkat edilmesi gerekenler ve pratik öneriler blog yazımızda!
    `
  },
  {
    id: 3,
    title: "Jeneratör Sarımında Yenilikçi Çözümler",
    img: "/blog3.jpg",
    content: `
      Jeneratör sarımında yenilikçi teknikler ve modern ekipmanlar kullanarak, daha uzun ömürlü ve verimli jeneratörler üretiyoruz. Müşterilerimize özel çözümler ve garanti kapsamında hizmetler sunuyoruz.
    `
  }
];

export default function BlogDetay() {
  const { id } = useParams();
  const data = bloglar.find(b => b.id === Number(id));

  if (!data) return <div className="p-10 text-center text-red-600">Blog yazısı bulunamadı.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full flex flex-col items-center">
        <Image src={data.img} alt={data.title} width={500} height={300} className="rounded-lg mb-6 object-cover" />
        <h1 className="text-3xl font-bold text-blue-900 mb-4 text-center">{data.title}</h1>
        <div className="text-blue-800 text-lg mb-4 text-center whitespace-pre-line">{data.content}</div>
      </motion.div>
    </div>
  );
} 
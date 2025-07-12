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
type Gallery = {
  id: number;
  imageUrl: string;
  title?: string;
  [key: string]: any;
};

export default function Home() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  useEffect(() => {
    fetch("/api/public/gallery").then(r => r.json()).then(setGallery);
    fetch("/api/public/blog").then(r => r.json()).then(setBlogs);
  }, []);
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 flex flex-col overflow-x-hidden">
      <div className="pt-20 w-full">
        {/* HERO SECTION */}
        <section id="hero" className="relative flex-1 flex flex-col items-center justify-center text-center min-h-screen w-full py-16 sm:py-32 overflow-hidden">
          <Image
            src="/hero-bobinaj.jpg"
            alt="Enerji Bobinaj Hero"
            fill
            className="object-cover object-center absolute inset-0 opacity-40 -z-10 w-full h-full"
          />
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-6xl font-bold text-blue-900 drop-shadow-lg mb-4"
          >
            Enerji Bobinaj
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl sm:text-2xl text-blue-800 mb-8"
          >
            Elektrik Motorları, Jeneratörler ve Trafo Sarımında Uzmanlık
          </motion.p>
          <motion.a
            href="#hizmetler"
            whileHover={{ scale: 1.08 }}
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition"
          >
            Hizmetlerimizi Keşfedin
          </motion.a>
        </section>

        {/* HİZMETLER */}
        <section id="hizmetler" className="py-16 bg-white/80">
          <div className="max-w-5xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-12"
            >
              Hizmetlerimiz
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  title: "Motor Bobinajı",
                  img: "/motor.jpg",
                  desc: "Her tip elektrik motoru için profesyonel bobinaj hizmeti.",
                  slug: "motor-bobinaji"
                },
                {
                  title: "Jeneratör Sarımı",
                  img: "/jenerator.jpg",
                  desc: "Jeneratörler için kaliteli ve garantili sarım işlemleri.",
                  slug: "jenerator-sarimi"
                },
                {
                  title: "Trafo Bakım & Sarım",
                  img: "/trafo.jpg",
                  desc: "Trafo sarımı ve bakımı, uzman ekibimizle.",
                  slug: "trafo-bakim-sarim"
                }
              ].map((item, i) => (
                <Link key={item.title} href={`/hizmetler/${item.slug}`} className="block">
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 32px #0002" }}
                    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-all cursor-pointer"
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={120}
                      height={120}
                      className="rounded-full mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">{item.title}</h3>
                    <p className="text-blue-700 text-sm">{item.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* GALERİ */}
        <section id="galeri" className="py-16 bg-gradient-to-r from-orange-100 via-white to-blue-100">
          <div className="max-w-5xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-12"
            >
              Galeri
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {gallery.slice(0, 8).map((item) => (
                <Link key={item.id} href={`/galeri/${item.id}`} className="block">
                  <motion.div
                    whileHover={{ scale: 1.07 }}
                    className="overflow-hidden rounded-lg shadow-md bg-white cursor-pointer"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "Galeri görseli"}
                      width={300}
                      height={200}
                      className="object-cover w-full h-32 sm:h-40"
                    />
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link href="/galeri">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
                >
                  Tüm Galeriyi Gör
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        {/* BLOG */}
        <section id="blog" className="py-16 bg-white/80">
          <div className="max-w-5xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-12"
            >
              Blog
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-8">
              {blogs.slice(0, 3).map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.id}`} className="block">
                  <motion.div
                    whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #0002" }}
                    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-all cursor-pointer"
                  >
                    <Image src={blog.image} alt={blog.title} width={240} height={140} className="rounded-lg mb-4 object-cover" />
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">{blog.title}</h2>
                    <p className="text-blue-700 text-sm mb-2">{blog.summary}</p>
                    <span className="text-orange-600 font-medium mt-2">Devamını Oku →</span>
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition"
                >
                  Tüm Blog Yazıları
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        {/* HAKKIMIZDA */}
        <section id="hakkimizda" className="py-16 bg-white/90">
          <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl font-bold text-blue-900 mb-8 text-center"
            >
              Hakkımızda
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl shadow-lg p-8 text-blue-800 text-lg text-center max-w-2xl"
            >
              <p>
                Enerji Bobinaj olarak, yılların verdiği tecrübe ve uzman kadromuzla elektrik motorları, jeneratörler ve trafolar için bobinaj, bakım ve sarım hizmetleri sunuyoruz. Müşteri memnuniyetini ve kaliteyi ön planda tutarak, sektörde güvenilir bir çözüm ortağı olmayı hedefliyoruz.
              </p>
            </motion.div>
          </div>
        </section>

        {/* İLETİŞİM */}
        <section id="iletisim" className="py-16 bg-gradient-to-l from-blue-100 via-white to-orange-100">
          <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl font-bold text-blue-900 mb-8 text-center"
            >
              İletişim
            </motion.h2>
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <motion.form
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4"
                onSubmit={async (e: React.FormEvent) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const name = formData.get('name') as string;
                  const email = formData.get('email') as string;
                  const message = formData.get('message') as string;
                  
                  try {
                    const response = await fetch('/api/contact', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ name, email, message }),
                    });
                    
                    if (response.ok) {
                      alert('Mesajınız başarıyla gönderildi!');
                      (e.target as HTMLFormElement).reset();
                    } else {
                      alert('Mesaj gönderilirken bir hata oluştu.');
                    }
                  } catch (error) {
                    alert('Mesaj gönderilirken bir hata oluştu.');
                  }
                }}
              >
                <input name="name" type="text" placeholder="Adınız" required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <input name="email" type="email" placeholder="E-posta" required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <textarea name="message" placeholder="Mesajınız" required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" rows={4} />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded font-semibold shadow hover:bg-orange-600 transition"
                >
                  Gönder
                </motion.button>
              </motion.form>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 justify-center"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-800">Telefon:</span>
                  <span>+90 555 123 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-800">E-posta:</span>
                  <span>info@enerjibobinaj.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-800">Adres:</span>
                  <span>İstanbul, Türkiye</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 flex flex-col">
      <div className="pt-20">
        {/* HERO SECTION */}
        <section id="hero" className="relative flex-1 flex flex-col items-center justify-center text-center py-16 sm:py-32 overflow-hidden">
          <Image
            src="/hero-bobinaj.jpg"
            alt="Enerji Bobinaj Hero"
            fill
            className="object-cover object-center absolute inset-0 opacity-40 -z-10"
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <Link key={i} href={`/galeri/${i}`} className="block">
                  <motion.div
                    whileHover={{ scale: 1.07 }}
                    className="overflow-hidden rounded-lg shadow-md bg-white cursor-pointer"
                  >
                    <Image
                      src={`/gallery${i}.jpg`}
                      alt={`Galeri görseli ${i}`}
                      width={300}
                      height={200}
                      className="object-cover w-full h-32 sm:h-40"
                    />
                  </motion.div>
                </Link>
              ))}
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
                onSubmit={(e: React.FormEvent) => { e.preventDefault(); alert('Mesajınız gönderildi!'); }}
              >
                <input type="text" placeholder="Adınız" required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <input type="email" placeholder="E-posta" required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <textarea placeholder="Mesajınız" required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" rows={4} />
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

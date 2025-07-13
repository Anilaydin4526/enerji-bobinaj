"use client";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
}

export default function AdminPreview() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
    setLoading(false);
  };

  const handleEdit = (key: string, value: string) => {
    setEditKey(key);
    setEditValue(value);
  };

  const handleSave = async () => {
    if (!editKey) return;
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: editKey, value: editValue }),
    });
    setSaving(false);
    setEditKey(null);
    setEditValue("");
    if (res.ok) fetchSettings();
  };

  const handleFileUpload = async (key: string, file: File) => {
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadToCloudinary(file);
      setEditValue(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  // Hero ve hizmetler anahtarları
  const heroTitle = settings.find(s => s.key === "hero_title")?.value || "Enerji Bobinaj";
  const heroSubtitle = settings.find(s => s.key === "hero_subtitle")?.value || "Elektrik Motorları, Jeneratörler ve Trafo Sarımında Uzmanlık";
  const heroButton = settings.find(s => s.key === "hero_button")?.value || "Hizmetlerimizi Keşfedin";

  // Hizmetler (örnek 3 hizmet)
  const services = [1, 2, 3].map(i => ({
    title: settings.find(s => s.key === `service_${i}_title`)?.value || `Hizmet ${i}`,
    desc: settings.find(s => s.key === `service_${i}_desc`)?.value || "",
    img: settings.find(s => s.key === `service_${i}_img`)?.value || "",
    idx: i
  }));

  // Galeri ve blog başlık/açıklama anahtarları
  const galleryTitle = settings.find(s => s.key === "gallery_title")?.value || "Galeri";
  const galleryDesc = settings.find(s => s.key === "gallery_desc")?.value || "Enerji Bobinaj'ın çalışmalarından örnekler";
  const blogTitle = settings.find(s => s.key === "blog_title")?.value || "Blog";
  const blogDesc = settings.find(s => s.key === "blog_desc")?.value || "Enerji Bobinaj'dan güncel haberler ve teknik bilgiler";
  const heroImg = settings.find(s => s.key === "hero_img")?.value || "/hero-bobinaj.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Canlı Site Önizleme & Düzenleme</h1>
      {/* HERO SECTION */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Giriş (Hero)</h2>
        <div className="bg-white rounded shadow p-6 flex flex-col gap-4 items-center">
          {/* Hero görseli */}
          {editKey === "hero_img" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border-2 border-black bg-white placeholder-gray-600 rounded-md p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Görsel URL" />
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("hero_img", file);
              }} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="relative mb-4 w-full flex items-center justify-center">
              <img src={heroImg} alt="Hero" className="rounded-lg object-cover w-full max-w-2xl h-40 border-2 border-black" />
              <button onClick={() => handleEdit("hero_img", heroImg)} className="absolute top-2 right-2 text-blue-600 hover:underline bg-white rounded-full px-2 py-1 text-xs">Düzenle</button>
            </div>
          )}
          {/* Başlık */}
          {editKey === "hero_title" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border-2 border-black bg-white placeholder-gray-600 rounded-md p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-4xl font-extrabold text-black drop-shadow-lg">{heroTitle}</span>
              <button onClick={() => handleEdit("hero_title", heroTitle)} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
          {/* Alt başlık */}
          {editKey === "hero_subtitle" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border-2 border-black bg-white placeholder-gray-600 rounded-md p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-xl font-bold text-black drop-shadow">{heroSubtitle}</span>
              <button onClick={() => handleEdit("hero_subtitle", heroSubtitle)} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
          {/* Buton metni */}
          {editKey === "hero_button" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border-2 border-black bg-white placeholder-gray-600 rounded-md p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="inline-block bg-orange-500 text-black font-extrabold px-8 py-3 rounded-full shadow-lg border-2 border-black">{heroButton}</span>
              <button onClick={() => handleEdit("hero_button", heroButton)} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
        </div>
      </section>
      {/* HİZMETLER */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Hizmetler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {services.map(service => (
            <div key={service.idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              {/* Görsel */}
              {editKey === `service_${service.idx}_img` ? (
                <div className="flex gap-2 items-center w-full mb-2">
                  <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Görsel URL" />
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(`service_${service.idx}_img`, file);
                  }} />
                  <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
                  <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
                </div>
              ) : (
                <div className="relative mb-4 w-24 h-24 flex items-center justify-center">
                  {service.img ? (
                    <img src={service.img} alt={service.title} className="rounded-full object-cover w-24 h-24" />
                  ) : (
                    <span className="text-gray-400">Görsel Yok</span>
                  )}
                  <button onClick={() => handleEdit(`service_${service.idx}_img`, service.img)} className="absolute bottom-0 right-0 text-blue-600 hover:underline bg-white rounded-full px-2 py-1 text-xs">Düzenle</button>
                </div>
              )}
              {/* Başlık */}
              {editKey === `service_${service.idx}_title` ? (
                <div className="flex gap-2 items-center w-full mb-2">
                  <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
                  <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
                  <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
                </div>
              ) : (
                <div className="flex items-center w-full justify-between">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">{service.title}</h3>
                  <button onClick={() => handleEdit(`service_${service.idx}_title`, service.title)} className="ml-2 text-blue-600 hover:underline">Düzenle</button>
                </div>
              )}
              {/* Açıklama */}
              {editKey === `service_${service.idx}_desc` ? (
                <div className="flex gap-2 items-center w-full">
                  <textarea className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} rows={2} />
                  <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
                  <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
                </div>
              ) : (
                <div className="flex items-center w-full justify-between">
                  <p className="text-blue-700 text-sm">{service.desc}</p>
                  <button onClick={() => handleEdit(`service_${service.idx}_desc`, service.desc)} className="ml-2 text-blue-600 hover:underline">Düzenle</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* GALERİ */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Galeri</h2>
        <div className="bg-white rounded shadow p-6 flex flex-col gap-4 items-center">
          {/* Başlık */}
          {editKey === "gallery_title" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-3xl font-bold text-blue-900">{galleryTitle}</span>
              <button onClick={() => handleEdit("gallery_title", galleryTitle)} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
          {/* Açıklama */}
          {editKey === "gallery_desc" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-xl text-blue-800">{galleryDesc}</span>
              <button onClick={() => handleEdit("gallery_desc", galleryDesc)} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
        </div>
      </section>
      {/* BLOG */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Blog</h2>
        <div className="bg-white rounded shadow p-6 flex flex-col gap-4 items-center">
          {/* Başlık */}
          {editKey === "blog_title" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-3xl font-bold text-blue-900">{blogTitle}</span>
              <button onClick={() => handleEdit("blog_title", blogTitle)} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
          {/* Açıklama */}
          {editKey === "blog_desc" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-xl text-blue-800">{blogDesc}</span>
              <button onClick={() => handleEdit("blog_desc", blogDesc)} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
        </div>
      </section>
      {/* HAKKIMIZDA */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Hakkımızda</h2>
        <div className="bg-white rounded shadow p-6 flex flex-col gap-4 items-center">
          {editKey === "about_text" ? (
            <div className="flex gap-2 items-center w-full">
              <textarea className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} rows={4} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-blue-800 text-lg">{settings.find(s => s.key === "about_text")?.value || "Hakkımızda metni buraya gelecek."}</span>
              <button onClick={() => handleEdit("about_text", settings.find(s => s.key === "about_text")?.value || "")} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
        </div>
      </section>
      {/* İLETİŞİM */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">İletişim</h2>
        <div className="bg-white rounded shadow p-6 flex flex-col gap-4 items-center w-full max-w-xl">
          {/* Telefon */}
          {editKey === "contact_phone" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="font-bold text-blue-800">Telefon:</span>
              <span>{settings.find(s => s.key === "contact_phone")?.value || "+90 555 123 45 67"}</span>
              <button onClick={() => handleEdit("contact_phone", settings.find(s => s.key === "contact_phone")?.value || "")} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
          {/* E-posta */}
          {editKey === "contact_email" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="font-bold text-blue-800">E-posta:</span>
              <span>{settings.find(s => s.key === "contact_email")?.value || "info@enerjibobinaj.com"}</span>
              <button onClick={() => handleEdit("contact_email", settings.find(s => s.key === "contact_email")?.value || "")} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
          {/* Adres */}
          {editKey === "contact_address" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="font-bold text-blue-800">Adres:</span>
              <span>{settings.find(s => s.key === "contact_address")?.value || "İstanbul, Türkiye"}</span>
              <button onClick={() => handleEdit("contact_address", settings.find(s => s.key === "contact_address")?.value || "")} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
        </div>
      </section>
      {/* FOOTER */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Footer</h2>
        <div className="bg-white rounded shadow p-6 flex flex-col gap-4 items-center w-full max-w-xl">
          {/* Footer görseli */}
          {editKey === "footer_img" ? (
            <div className="flex gap-2 items-center w-full mb-2">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Görsel URL" />
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("footer_img", file);
              }} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="relative mb-4 w-32 h-16 flex items-center justify-center">
              {settings.find(s => s.key === "footer_img")?.value ? (
                <img src={settings.find(s => s.key === "footer_img")?.value} alt="Footer Logo" className="object-contain w-32 h-16" />
              ) : (
                <span className="text-gray-400">Görsel Yok</span>
              )}
              <button onClick={() => handleEdit("footer_img", settings.find(s => s.key === "footer_img")?.value || "")} className="absolute bottom-0 right-0 text-blue-600 hover:underline bg-white rounded-full px-2 py-1 text-xs">Düzenle</button>
            </div>
          )}
          {/* Footer metni */}
          {editKey === "footer_text" ? (
            <div className="flex gap-2 items-center w-full">
              <input className="border rounded p-2 w-full" value={editValue} onChange={e => setEditValue(e.target.value)} />
              <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
              <button onClick={() => setEditKey(null)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
            </div>
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-blue-800 text-sm">{settings.find(s => s.key === "footer_text")?.value || "© 2025 Enerji Bobinaj"}</span>
              <button onClick={() => handleEdit("footer_text", settings.find(s => s.key === "footer_text")?.value || "")} className="ml-4 text-blue-600 hover:underline">Düzenle</button>
            </div>
          )}
        </div>
      </section>
      {/* Diğer bölümler (hero, hizmetler, vs.) buraya eklenebilir */}
    </div>
  );
} 
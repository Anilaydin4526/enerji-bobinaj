"use client";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

export default function ServicesAdmin() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState<string|null>(null);
  const [editValue, setEditValue] = useState<string>("");
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

  const getSetting = (key: string, fallback: string = "") => settings.find(s => s.key === key)?.value || fallback;

  const services = [1, 2, 3].map(i => ({
    title: getSetting(`service_${i}_title`, `Hizmet ${i}`),
    desc: getSetting(`service_${i}_desc`, ""),
    img: getSetting(`service_${i}_img`, ""),
    idx: i
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Hizmetlerimiz Yönetimi</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </div>
  );
} 
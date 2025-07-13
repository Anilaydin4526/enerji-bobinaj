"use client";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

export default function ServicesAdmin() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState<string|null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addData, setAddData] = useState({ title: '', desc: '', img: '' });
  const [editIdx, setEditIdx] = useState<number|null>(null);
  const [editForm, setEditForm] = useState({ title: '', desc: '', img: '' });

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Yeni hizmet için en büyük indexi bul
    const maxIdx = settings
      .filter(s => s.key.startsWith('service_') && s.key.endsWith('_title'))
      .map(s => parseInt(s.key.split('_')[1]))
      .filter(n => !isNaN(n))
      .reduce((a, b) => Math.max(a, b), 0);
    const newIdx = maxIdx + 1;
    // 3 key birden ekle
    await Promise.all([
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${newIdx}_title`, value: addData.title }),
      }),
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${newIdx}_desc`, value: addData.desc }),
      }),
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${newIdx}_img`, value: addData.img }),
      })
    ]);
    setShowAddForm(false);
    setAddData({ title: '', desc: '', img: '' });
    setSaving(false);
    fetchSettings();
  };

  const handleEditOpen = (service: any) => {
    setEditIdx(service.idx);
    setEditForm({ title: service.title, desc: service.desc, img: service.img });
  };
  const handleEditSave = async () => {
    if (editIdx == null) return;
    setSaving(true);
    await Promise.all([
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${editIdx}_title`, value: editForm.title }),
      }),
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${editIdx}_desc`, value: editForm.desc }),
      }),
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${editIdx}_img`, value: editForm.img }),
      })
    ]);
    setEditIdx(null);
    setEditForm({ title: '', desc: '', img: '' });
    setSaving(false);
    fetchSettings();
  };
  const handleEditCancel = () => {
    setEditIdx(null);
    setEditForm({ title: '', desc: '', img: '' });
  };
  const handleDelete = async (idx: number) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    setSaving(true);
    await Promise.all([
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${idx}_title`, value: '', description: '' }),
      }),
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${idx}_desc`, value: '', description: '' }),
      }),
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `service_${idx}_img`, value: '', description: '' }),
      })
    ]);
    setSaving(false);
    fetchSettings();
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  const getSetting = (key: string, fallback: string = "") => settings.find(s => s.key === key)?.value || fallback;

  const serviceKeys = settings.filter(s => s.key.startsWith('service_') && s.key.match(/^service_\d+_title$/));
  const services = serviceKeys.map(s => {
    const idx = parseInt(s.key.split('_')[1]);
    return {
      title: s.value,
      desc: getSetting(`service_${idx}_desc`, ""),
      img: getSetting(`service_${idx}_img`, ""),
      idx
    };
  }).sort((a, b) => a.idx - b.idx);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Hizmetlerimiz Yönetimi</h1>
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowAddForm(f => !f)} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-700 transition">
          + Hizmet Ekle
        </button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col gap-4 max-w-md mx-auto">
          <input className="border rounded p-2 text-black" value={addData.title} onChange={e => setAddData({ ...addData, title: e.target.value })} placeholder="Başlık" required />
          <textarea className="border rounded p-2 text-black" value={addData.desc} onChange={e => setAddData({ ...addData, desc: e.target.value })} placeholder="Açıklama" required />
          <input
            className="border rounded p-2 text-black"
            value={addData.img}
            onChange={e => setAddData({ ...addData, img: e.target.value })}
            placeholder="Görsel URL"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setSaving(true);
              try {
                const url = await uploadToCloudinary(file);
                setAddData(f => ({ ...f, img: url }));
              } catch (err) {
                alert(err instanceof Error ? err.message : String(err));
              }
              setSaving(false);
            }}
            className="mb-2"
          />
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
          <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map(service => (
          <div key={service.idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            {editIdx === service.idx ? (
              <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="flex flex-col gap-2 w-full">
                <input className="border rounded p-2 text-black" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Başlık" required />
                <textarea className="border rounded p-2 text-black" value={editForm.desc} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))} placeholder="Açıklama" required />
                <input className="border rounded p-2 text-black" value={editForm.img} onChange={e => setEditForm(f => ({ ...f, img: e.target.value }))} placeholder="Görsel URL" required />
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setSaving(true);
                  try {
                    const url = await uploadToCloudinary(file);
                    setEditForm(f => ({ ...f, img: url }));
                  } catch (err) {
                    alert(err instanceof Error ? err.message : String(err));
                  }
                  setSaving(false);
                }} className="mb-2" />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
                  <button type="button" onClick={handleEditCancel} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
                </div>
              </form>
            ) : (
              <>
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
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEditOpen(service)} className="text-blue-600">Düzenle</button>
                  <button onClick={() => handleDelete(service.idx)} className="text-red-600">Sil</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
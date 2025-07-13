"use client";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

export default function SliderAdmin() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addData, setAddData] = useState({ title: '', desc: '', img: '', button: '' });
  const [editIdx, setEditIdx] = useState<number|null>(null);
  const [editForm, setEditForm] = useState({ title: '', desc: '', img: '', button: '' });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const maxIdx = settings
      .filter(s => s.key.startsWith('slider_') && s.key.endsWith('_title'))
      .map(s => parseInt(s.key.split('_')[1]))
      .filter(n => !isNaN(n))
      .reduce((a, b) => Math.max(a, b), 0);
    const newIdx = maxIdx + 1;
    await Promise.all([
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${newIdx}_title`, value: addData.title }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${newIdx}_desc`, value: addData.desc }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${newIdx}_img`, value: addData.img }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${newIdx}_button`, value: addData.button }) })
    ]);
    setShowAddForm(false);
    setAddData({ title: '', desc: '', img: '', button: '' });
    setSaving(false);
    fetchSettings();
  };

  const handleEditOpen = (slider: any) => {
    setEditIdx(slider.idx);
    setEditForm({ title: slider.title, desc: slider.desc, img: slider.img, button: slider.button });
  };
  const handleEditSave = async () => {
    if (editIdx == null) return;
    setSaving(true);
    await Promise.all([
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${editIdx}_title`, value: editForm.title }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${editIdx}_desc`, value: editForm.desc }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${editIdx}_img`, value: editForm.img }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${editIdx}_button`, value: editForm.button }) })
    ]);
    setEditIdx(null);
    setEditForm({ title: '', desc: '', img: '', button: '' });
    setSaving(false);
    fetchSettings();
  };
  const handleEditCancel = () => {
    setEditIdx(null);
    setEditForm({ title: '', desc: '', img: '', button: '' });
  };
  const handleDelete = async (idx: number) => {
    if (!confirm('Bu sliderı silmek istediğinizden emin misiniz?')) return;
    setSaving(true);
    await Promise.all([
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${idx}_title`, value: '' }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${idx}_desc`, value: '' }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${idx}_img`, value: '' }) }),
      fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: `slider_${idx}_button`, value: '' }) })
    ]);
    setSaving(false);
    fetchSettings();
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  const getSetting = (key: string, fallback: string = "") => settings.find(s => s.key === key)?.value || fallback;
  const sliderKeys = settings.filter(s => s.key.startsWith('slider_') && s.key.match(/^slider_\d+_title$/));
  const sliders = sliderKeys.map(s => {
    const idx = parseInt(s.key.split('_')[1]);
    return {
      title: s.value,
      desc: getSetting(`slider_${idx}_desc`, ""),
      img: getSetting(`slider_${idx}_img`, ""),
      button: getSetting(`slider_${idx}_button`, ""),
      idx
    };
  }).filter(s => s.title && s.title.trim() !== "").sort((a, b) => a.idx - b.idx);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Slider Yönetimi</h1>
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowAddForm(f => !f)} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-700 transition">
          + Slider Ekle
        </button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col gap-4 max-w-md mx-auto">
          <input className="border rounded p-2 text-black" value={addData.title} onChange={e => setAddData({ ...addData, title: e.target.value })} placeholder="Başlık" required />
          <textarea className="border rounded p-2 text-black" value={addData.desc} onChange={e => setAddData({ ...addData, desc: e.target.value })} placeholder="Açıklama" required />
          <input className="border rounded p-2 text-black" value={addData.button} onChange={e => setAddData({ ...addData, button: e.target.value })} placeholder="Buton Yazısı (isteğe bağlı)" />
          <input className="border rounded p-2 text-black" value={addData.img} onChange={e => setAddData({ ...addData, img: e.target.value })} placeholder="Görsel URL" required />
          <input type="file" accept="image/*" onChange={async (e) => {
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
          }} className="mb-2" />
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
          <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map(slider => (
          <div key={slider.idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            {editIdx === slider.idx ? (
              <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="flex flex-col gap-2 w-full">
                <input className="border rounded p-2 text-black" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Başlık" required />
                <textarea className="border rounded p-2 text-black" value={editForm.desc} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))} placeholder="Açıklama" required />
                <input className="border rounded p-2 text-black" value={editForm.button} onChange={e => setEditForm(f => ({ ...f, button: e.target.value }))} placeholder="Buton Yazısı (isteğe bağlı)" />
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
                <img src={slider.img} alt={slider.title} className="rounded-lg mb-4 object-cover w-32 h-32" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{slider.title}</h3>
                <p className="text-blue-700 text-sm mb-2">{slider.desc}</p>
                {slider.button && <div className="text-orange-600 font-medium mb-2">{slider.button}</div>}
                <button onClick={() => handleEditOpen(slider)} className="text-blue-600">Düzenle</button>
                <button onClick={() => handleDelete(slider.idx)} className="text-red-600">Sil</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
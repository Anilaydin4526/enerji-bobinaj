"use client";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

// Yeni Slider tipi
interface Slider {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  order: number;
  buttonText?: string;
  buttonLink?: string;
}

export default function SliderAdmin() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addData, setAddData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    order: 0,
    buttonText: '',
    buttonLink: ''
  });
  const [editId, setEditId] = useState<number|null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    order: 0,
    buttonText: '',
    buttonLink: ''
  });

  useEffect(() => { fetchSliders(); }, []);

  const fetchSliders = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/slider");
    if (res.ok) {
      const data = await res.json();
      setSliders(data);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const order = sliders.length > 0 ? Math.max(...sliders.map(s => s.order)) + 1 : 1;
    const res = await fetch('/api/admin/slider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addData, order })
    });
    if (res.ok) {
      setShowAddForm(false);
      setAddData({ title: '', description: '', imageUrl: '', order: 0, buttonText: '', buttonLink: '' });
      fetchSliders();
    }
    setSaving(false);
  };

  const handleEditOpen = (slider: Slider) => {
    setEditId(slider.id);
    setEditForm({
      title: slider.title,
      description: slider.description || '',
      imageUrl: slider.imageUrl,
      order: slider.order,
      buttonText: slider.buttonText || '',
      buttonLink: slider.buttonLink || ''
    });
  };
  const handleEditSave = async () => {
    if (editId == null) return;
    setSaving(true);
    const res = await fetch('/api/admin/slider', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, ...editForm })
    });
    if (res.ok) {
      setEditId(null);
      setEditForm({ title: '', description: '', imageUrl: '', order: 0, buttonText: '', buttonLink: '' });
      fetchSliders();
    }
    setSaving(false);
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({ title: '', description: '', imageUrl: '', order: 0, buttonText: '', buttonLink: '' });
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Bu sliderı silmek istediğinizden emin misiniz?')) return;
    setSaving(true);
    const res = await fetch('/api/admin/slider', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchSliders();
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Slider Yönetimi</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-800">Birden fazla slider ekleyin, ana sayfada otomatik kayacak!</h2>
        <button onClick={() => setShowAddForm(f => !f)} className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-orange-700 transition">
          + Slider Ekle
        </button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col gap-4 max-w-md mx-auto">
          <input className="border rounded p-2 text-black" value={addData.title} onChange={e => setAddData({ ...addData, title: e.target.value })} placeholder="Başlık" required />
          <textarea className="border rounded p-2 text-black" value={addData.description} onChange={e => setAddData({ ...addData, description: e.target.value })} placeholder="Açıklama" required />
          <input className="border rounded p-2 text-black" value={addData.buttonText} onChange={e => setAddData({ ...addData, buttonText: e.target.value })} placeholder="Buton Yazısı (isteğe bağlı)" />
          <input className="border rounded p-2 text-black" value={addData.buttonLink} onChange={e => setAddData({ ...addData, buttonLink: e.target.value })} placeholder="Buton Linki (isteğe bağlı)" />
          <input className="border rounded p-2 text-black" value={addData.imageUrl} onChange={e => setAddData({ ...addData, imageUrl: e.target.value })} placeholder="Görsel URL" required />
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setSaving(true);
            try {
              const url = await uploadToCloudinary(file);
              setAddData(f => ({ ...f, imageUrl: url }));
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
          <div key={slider.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            {editId === slider.id ? (
              <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="flex flex-col gap-2 w-full">
                <input className="border rounded p-2 text-black" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Başlık" required />
                <textarea className="border rounded p-2 text-black" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="Açıklama" required />
                <input className="border rounded p-2 text-black" value={editForm.buttonText} onChange={e => setEditForm(f => ({ ...f, buttonText: e.target.value }))} placeholder="Buton Yazısı (isteğe bağlı)" />
                <input className="border rounded p-2 text-black" value={editForm.buttonLink} onChange={e => setEditForm(f => ({ ...f, buttonLink: e.target.value }))} placeholder="Buton Linki (isteğe bağlı)" />
                <input className="border rounded p-2 text-black" value={editForm.imageUrl} onChange={e => setEditForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="Görsel URL" required />
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setSaving(true);
                  try {
                    const url = await uploadToCloudinary(file);
                    setEditForm(f => ({ ...f, imageUrl: url }));
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
                <img src={slider.imageUrl} alt={slider.title} className="rounded-lg mb-4 object-cover w-32 h-32" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{slider.title}</h3>
                <p className="text-blue-700 text-sm mb-2">{slider.description}</p>
                {slider.buttonText && <div className="text-orange-600 font-medium mb-2">{slider.buttonText}</div>}
                {slider.buttonLink && <div className="text-blue-600 text-xs mb-2">{slider.buttonLink}</div>}
                <button onClick={() => handleEditOpen(slider)} className="text-blue-600">Düzenle</button>
                <button onClick={() => handleDelete(slider.id)} className="text-red-600">Sil</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
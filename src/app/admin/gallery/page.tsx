"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

interface GalleryImage {
  id: number
  title: string
  description: string | null
  imageUrl: string
  order: number
  createdAt: string
}

export default function GalleryManagement() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    order: 0
  })
  const [editId, setEditId] = useState<number|null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', imageUrl: '', order: 0 });

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/admin/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleryImages(data)
      }
    } catch (error) {
      console.error('Gallery fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({ title: '', description: '', imageUrl: '', order: 0 })
        fetchGalleryImages()
      }
    } catch (error) {
      console.error('Gallery create error:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu resmi silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchGalleryImages()
      }
    } catch (error) {
      console.error('Gallery delete error:', error)
    }
  }

  const handleEditOpen = (img: any) => {
    setEditId(img.id);
    setEditForm({ title: img.title, description: img.description || '', imageUrl: img.imageUrl, order: img.order });
  };
  const handleEditSave = async () => {
    if (editId == null) return;
    setLoading(true);
    await fetch(`/api/admin/gallery/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditId(null);
    setEditForm({ title: '', description: '', imageUrl: '', order: 0 });
    setLoading(false);
    fetchGalleryImages();
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({ title: '', description: '', imageUrl: '', order: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100 flex items-center justify-center">
        <div className="text-xl text-blue-900">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-orange-100">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-blue-900">Galeri Yönetimi</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {showForm ? 'İptal' : 'Yeni Resim'}
              </button>
              <Link
                href="/admin/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Geri Dön
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Yeni Galeri Resmi</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (opsiyonel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resim Yükle (veya URL girin)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadToCloudinary(file);
                      setFormData(f => ({ ...f, imageUrl: url }));
                    } catch (err) {
                      alert(err instanceof Error ? err.message : String(err));
                    }
                  }}
                  className="mb-2"
                />
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Resim URL"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıra
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-cover"
                />
              </div>
              {editId === image.id ? (
                <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="flex flex-col gap-2 w-full">
                  <input className="border rounded p-2" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Başlık" required />
                  <textarea className="border rounded p-2" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="Açıklama" />
                  <input className="border rounded p-2" value={editForm.imageUrl} onChange={e => setEditForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="Görsel URL" required />
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setLoading(true);
                    try {
                      const url = await uploadToCloudinary(file);
                      setEditForm(f => ({ ...f, imageUrl: url }));
                    } catch (err) {
                      alert(err instanceof Error ? err.message : String(err));
                    }
                    setLoading(false);
                  }} className="mb-2" />
                  <input type="number" className="border rounded p-2" value={editForm.order} onChange={e => setEditForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} placeholder="Sıra" />
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
                    <button type="button" onClick={handleEditCancel} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{image.title}</h3>
                  {image.description && (
                    <p className="text-gray-600 text-sm mb-3">{image.description}</p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <button onClick={() => handleEditOpen(image)} className="text-blue-600 mr-2">Düzenle</button>
                    <button onClick={() => handleDelete(image.id)} className="text-red-600">Sil</button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {galleryImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz galeri resmi eklenmemiş.</p>
          </div>
        )}
      </main>
    </div>
  )
} 
"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

interface BlogPost {
  id: number
  title: string
  slug: string
  published: boolean
  createdAt: string
}

export default function BlogManagement() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    image: '',
    published: false
  })
  const [editId, setEditId] = useState<number|null>(null);
  const [editForm, setEditForm] = useState({ title: '', slug: '', content: '', image: '', published: false });

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data)
      }
    } catch (error) {
      console.error('Blog fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({ title: '', content: '', slug: '', image: '', published: false })
        fetchBlogPosts()
      }
    } catch (error) {
      console.error('Blog create error:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBlogPosts()
      }
    } catch (error) {
      console.error('Blog delete error:', error)
    }
  }

  const handleEditOpen = (post: any) => {
    setEditId(post.id);
    setEditForm({ title: post.title, slug: post.slug, content: post.content || '', image: post.image || '', published: post.published });
  };
  const handleEditSave = async () => {
    if (editId == null) return;
    await fetch(`/api/admin/blog/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditId(null);
    setEditForm({ title: '', slug: '', content: '', image: '', published: false });
    fetchBlogPosts();
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({ title: '', slug: '', content: '', image: '', published: false });
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
            <h1 className="text-3xl font-bold text-blue-900">Blog Yönetimi</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {showForm ? 'İptal' : 'Yeni Yazı'}
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Yeni Blog Yazısı</h2>
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
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                      setFormData(f => ({ ...f, image: url }));
                    } catch (err) {
                      alert(err instanceof Error ? err.message : String(err));
                    }
                  }}
                  className="mb-2"
                />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Resim URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Yayınla
                </label>
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

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Blog Yazıları</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogPosts.map((post) => (
                  editId === post.id ? (
                    <tr key={post.id}>
                      <td colSpan={5} className="p-4 bg-gray-50">
                        <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="flex flex-col gap-2">
                          <input className="border rounded p-2 text-black" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Başlık" required />
                          <input className="border rounded p-2 text-black" value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} placeholder="Slug" required />
                          <textarea className="border rounded p-2 text-black" value={editForm.content} onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))} placeholder="İçerik" required />
                          <input className="border rounded p-2" value={editForm.image} onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))} placeholder="Görsel URL" />
                          <input type="file" accept="image/*" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadToCloudinary(file);
                              setEditForm(f => ({ ...f, image: url }));
                            } catch (err) {
                              alert(err instanceof Error ? err.message : String(err));
                            }
                          }} className="mb-2" />
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={editForm.published} onChange={e => setEditForm(f => ({ ...f, published: e.target.checked }))} /> Yayında
                          </label>
                          <div className="flex gap-2">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Kaydet</button>
                            <button type="button" onClick={handleEditCancel} className="bg-gray-400 text-white px-4 py-2 rounded">İptal</button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Yayında' : 'Taslak'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEditOpen(post)} className="text-blue-600 mr-2">Düzenle</button>
                        <button onClick={() => handleDelete(post.id)} className="text-red-600">Sil</button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
} 
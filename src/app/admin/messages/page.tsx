"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Messages fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number, read: boolean) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: !read }),
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Message update error:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Message delete error:', error)
    }
  }

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
            <h1 className="text-3xl font-bold text-blue-900">Mesajlar</h1>
            <Link
              href="/admin/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Geri Dön
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              İletişim Mesajları ({messages.length})
            </h2>
          </div>
          
          {messages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">Henüz mesaj bulunmuyor.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 ${!message.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {message.name}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          message.read
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {message.read ? 'Okundu' : 'Yeni'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{message.email}</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(message.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleMarkAsRead(message.id, message.read)}
                        className={`px-3 py-1 text-xs rounded ${
                          message.read
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {message.read ? 'Okunmadı Olarak İşaretle' : 'Okundu Olarak İşaretle'}
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 
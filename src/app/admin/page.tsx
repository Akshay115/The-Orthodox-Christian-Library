'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Translation {
  id: number
  book: { title: string }
  lang: string
  content: string
  status: string
}

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showAddTranslator, setShowAddTranslator] = useState(false)
  const [translatorEmail, setTranslatorEmail] = useState('')
  const [translatorPassword, setTranslatorPassword] = useState('')
  const [showAddBook, setShowAddBook] = useState(false)
  const [bookTitle, setBookTitle] = useState('')
  const [bookContent, setBookContent] = useState('')
  const [bookLang, setBookLang] = useState('ru')
  const [message, setMessage] = useState('')
  const [showViewTranslations, setShowViewTranslations] = useState(false)
  const [translations, setTranslations] = useState<Translation[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session || (session.user as any).role !== 'admin') {
      router.push('/login')
    }
  }, [session, status, router])

  useEffect(() => {
    if (showViewTranslations) {
      fetch('/api/admin/translations')
        .then(res => res.json())
        .then(data => setTranslations(data))
    }
  }, [showViewTranslations])

  const handleAddTranslator = async () => {
    const res = await fetch('/api/admin/add-translator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: translatorEmail, password: translatorPassword })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage('Translator added successfully')
      setShowAddTranslator(false)
      setTranslatorEmail('')
      setTranslatorPassword('')
    } else {
      setMessage(data.error || 'Failed to add translator')
    }
  }

  const handleAddBook = async () => {
    const res = await fetch('/api/admin/add-book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: bookTitle, content: bookContent, originalLang: bookLang })
    })
    const data = await res.json()
    if (res.ok) {
      setMessage('Book added successfully')
      setShowAddBook(false)
      setBookTitle('')
      setBookContent('')
    } else {
      setMessage(data.error || 'Failed to add book')
    }
  }

  const approveTranslation = async (id: number) => {
    await fetch('/api/admin/approve-translation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const data = await fetch('/api/admin/translations').then(res => res.json())
    setTranslations(data)
  }

  if (status === 'loading') return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!session || (session.user as any).role !== 'admin') return null

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <div className="space-y-4">
        <button onClick={() => setShowAddTranslator(true)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Translator</button>
        <button onClick={() => setShowAddBook(true)} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Add Book</button>
        <button onClick={() => setShowViewTranslations(true)} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600">View Translations</button>
      </div>
      {showAddTranslator && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl mb-4">Add Translator</h2>
          <input
            type="email"
            placeholder="Email"
            value={translatorEmail}
            onChange={(e) => setTranslatorEmail(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={translatorPassword}
            onChange={(e) => setTranslatorPassword(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button onClick={handleAddTranslator} className="bg-blue-500 text-white p-2 rounded mr-2">Add</button>
          <button onClick={() => setShowAddTranslator(false)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
        </div>
      )}
      {showAddBook && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl mb-4">Add Book</h2>
          <input
            type="text"
            placeholder="Title"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <select
            value={bookLang}
            onChange={(e) => setBookLang(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="ru">Russian</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
          <textarea
            placeholder="Content"
            value={bookContent}
            onChange={(e) => setBookContent(e.target.value)}
            className="border p-2 w-full mb-2 h-32"
          />
          <button onClick={handleAddBook} className="bg-green-500 text-white p-2 rounded mr-2">Add</button>
          <button onClick={() => setShowAddBook(false)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
        </div>
      )}
      {showViewTranslations && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl mb-4">Translations</h2>
          <div className="space-y-2">
            {translations.map(t => (
              <div key={t.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <p><strong>Book:</strong> {t.book.title}</p>
                  <p><strong>Lang:</strong> {t.lang}</p>
                  <p><strong>Status:</strong> {t.status}</p>
                </div>
                <div className="space-x-2">
                  {t.status !== 'approved' && (
                    <button onClick={() => approveTranslation(t.id)} className="bg-green-500 text-white p-1 rounded">Approve</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

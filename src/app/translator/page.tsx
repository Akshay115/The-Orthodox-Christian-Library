'use client'

import { useSession } from 'next-auth/react'

import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

interface Book {

  id: number

  title: string

}

export default function Translator() {

  const { data: session, status } = useSession()

  const router = useRouter()

  const [books, setBooks] = useState<Book[]>([])

  const [selectedBook, setSelectedBook] = useState('')

  const [lang, setLang] = useState('en')

  const [originalText, setOriginalText] = useState('')

  const [translatedText, setTranslatedText] = useState('')

  const [message, setMessage] = useState('')

  useEffect(() => {

    if (status === 'loading') return

    if (!session || (session.user as any).role !== 'translator') {

      router.push('/login')

    }

  }, [session, status, router])

  useEffect(() => {

    fetch('/api/books')

      .then(res => res.json())

      .then(data => setBooks(data))

  }, [])

  const handleTranslate = async () => {

    const res = await fetch('/api/translate', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ text: originalText, fromLang: 'ru', toLang: lang })

    })

    const data = await res.json()

    if (res.ok) {

      setTranslatedText(data.translated)

    } else {

      setMessage(data.error || 'Translation failed')

    }

  }

  const handleSubmit = async () => {

    const res = await fetch('/api/translator/submit-translation', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ bookId: selectedBook, lang, content: translatedText })

    })

    const data = await res.json()

    if (res.ok) {

      setMessage('Translation submitted successfully')

      setSelectedBook('')

      setOriginalText('')

      setTranslatedText('')

    } else {

      setMessage(data.error || 'Failed to submit')

    }

  }

  if (status === 'loading') return <div>Loading...</div>

  if (!session || (session.user as any).role !== 'translator') return null

  return (

    <div className="p-6">

      <h1 className="text-2xl mb-4">Translator Dashboard</h1>

      {message && <p className="mb-4 text-green-500">{message}</p>}

      <div className="space-y-4">

        <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} className="border p-2 w-full">

          <option value="">Select Book</option>

          {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}

        </select>

        <select value={lang} onChange={(e) => setLang(e.target.value)} className="border p-2 w-full">

          <option value="en">English</option>

          <option value="hi">Hindi</option>

          <option value="mr">Marathi</option>

        </select>

        <textarea

          placeholder="Original Text"

          value={originalText}

          onChange={(e) => setOriginalText(e.target.value)}

          className="border p-2 w-full h-32"

        />

        <button onClick={handleTranslate} className="bg-blue-500 text-white p-2 rounded">Translate</button>

        <textarea

          placeholder="Translated Text"

          value={translatedText}

          onChange={(e) => setTranslatedText(e.target.value)}

          className="border p-2 w-full h-32"

        />

        <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded">Submit Translation</button>

      </div>

    </div>

  )

}

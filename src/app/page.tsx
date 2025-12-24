'use client'

import { useEffect, useState } from 'react'

interface Translation {

  id: number

  book: { title: string }

  lang: string

  content: string

  status: string

}

export default function Home() {

  const [translations, setTranslations] = useState<Translation[]>([])

  useEffect(() => {

    fetch('/api/translations/approved')

      .then(res => res.json())

      .then(data => setTranslations(data))

  }, [])

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Orthodox Christian Library</h1>

      {translations.length === 0 ? (

        <p>No translations available yet.</p>

      ) : (

        <div className="space-y-4">

          {translations.map(t => (

            <div key={t.id} className="border p-4 rounded">

              <h2 className="text-xl font-semibold">{t.book.title} ({t.lang})</h2>

              <p className="mt-2">{t.content}</p>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}

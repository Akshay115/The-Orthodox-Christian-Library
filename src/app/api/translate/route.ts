import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

  const { text, fromLang, toLang } = await req.json()

  const prompt = `Translate the following ${fromLang} text to ${toLang}: ${text}`

  const res = await fetch('https://api.x.ai/v1/chat/completions', {

    method: 'POST',

    headers: {

      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,

      'Content-Type': 'application/json'

    },

    body: JSON.stringify({

      model: 'grok-beta',

      messages: [{ role: 'user', content: prompt }]

    })

  })

  const data = await res.json()

  if (res.ok) {

    const translated = data.choices[0].message.content

    return NextResponse.json({ translated })

  } else {

    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })

  }

}

import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../auth'

import { PrismaClient } from '@prisma/client'

export const runtime = 'nodejs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'admin') {

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  }

  const { title, content, originalLang } = await req.json()

  if (!title || !content) {

    return NextResponse.json({ error: 'Title and content required' }, { status: 400 })

  }

  try {

    const book = await prisma.book.create({

      data: {

        title,

        content,

        originalLang: originalLang || 'ru'

      }

    })

    return NextResponse.json({ book })

  } catch (error) {

    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })

  }

}

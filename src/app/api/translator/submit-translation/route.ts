import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../auth'

import { PrismaClient } from '@prisma/client'

export const runtime = 'nodejs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'translator') {

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  }

  const { bookId, lang, content } = await req.json()

  try {

    const translation = await prisma.translation.create({

      data: {

        bookId: parseInt(bookId),

        lang,

        content,

        translatorId: parseInt((session.user as any).id)

      }

    })

    return NextResponse.json({ translation })

  } catch (error) {

    return NextResponse.json({ error: 'Failed to submit translation' }, { status: 500 })

  }

}

import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../auth'

import { PrismaClient } from '@prisma/client'

export const runtime = 'nodejs'

const prisma = new PrismaClient()

export async function GET() {

  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'admin') {

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  }

  const translations = await prisma.translation.findMany({

    include: { book: true, translator: true }

  })

  return NextResponse.json(translations)

}

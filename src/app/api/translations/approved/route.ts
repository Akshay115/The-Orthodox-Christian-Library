import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

export const runtime = 'edge'

const prisma = new PrismaClient()

export async function GET() {

  const translations = await prisma.translation.findMany({

    where: { status: 'approved' },

    include: { book: true }

  })

  return NextResponse.json(translations)

}

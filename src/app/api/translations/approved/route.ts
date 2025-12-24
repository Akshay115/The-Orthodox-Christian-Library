import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {

  const translations = await prisma.translation.findMany({

    where: { status: 'approved' },

    include: { book: true }

  })

  return NextResponse.json(translations)

}

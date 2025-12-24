import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../auth'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'admin') {

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  }

  const { id } = await req.json()

  await prisma.translation.update({

    where: { id },

    data: { status: 'approved' }

  })

  return NextResponse.json({ success: true })

}

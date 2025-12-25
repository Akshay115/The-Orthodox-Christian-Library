import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../auth'

import { PrismaClient } from '@prisma/client'

import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'admin') {

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  }

  const { email, password } = await req.json()

  if (!email || !password) {

    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {

    const user = await prisma.user.create({

      data: {

        email,

        password: hashedPassword,

        role: 'translator'

      }

    })

    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } })

  } catch (error) {

    return NextResponse.json({ error: 'User already exists' }, { status: 400 })

  }

}

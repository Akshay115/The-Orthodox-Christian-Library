import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

export const runtime = 'edge'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-ignore
  if (!(global as any).prisma) {
    // @ts-ignore
    (global as any).prisma = new PrismaClient()
  }
  // @ts-ignore
  prisma = (global as any).prisma
}

export async function GET() {

  const books = await prisma.book.findMany()

  return NextResponse.json(books)

}

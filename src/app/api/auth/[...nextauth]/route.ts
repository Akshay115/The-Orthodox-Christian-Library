import NextAuth from 'next-auth'

import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaClient } from '@prisma/client'

import bcrypt from 'bcryptjs'

import type { JWT } from 'next-auth/jwt'

import type { Session, User } from 'next-auth'

const prisma = new PrismaClient()

export const authOptions = {

  providers: [

    CredentialsProvider({

      name: 'credentials',

      credentials: {

        email: { label: 'Email', type: 'email' },

        password: { label: 'Password', type: 'password' }

      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {

          return null

        }

        const user = await prisma.user.findUnique({

          where: { email: credentials.email }

        })

        if (!user) {

          return null

        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {

          return null

        }

        return {

          id: user.id.toString(),

          email: user.email,

          role: user.role

        }

      }

    })

  ],

  session: {

    strategy: 'jwt' as const

  },

  callbacks: {

    async jwt({ token, user }: { token: JWT, user?: User }) {

      if (user) {

        token.role = (user as any).role

      }

      return token

    },

    async session({ session, token }: { session: Session, token: JWT }) {

      if (token && session.user) {

        (session.user as any).id = token.sub ?? ''

        (session.user as any).role = token.role ?? ''

      }

      return session

    }

  },

  pages: {

    signIn: '/login'

  }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

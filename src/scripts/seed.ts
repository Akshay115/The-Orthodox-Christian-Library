import { PrismaClient } from '@prisma/client'

import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {

  const hashedPassword = await bcrypt.hash('adminpassword', 10)

  await prisma.user.upsert({

    where: { email: 'admin@example.com' },

    update: {},

    create: {

      email: 'admin@example.com',

      password: hashedPassword,

      role: 'admin'

    }

  })

  console.log('Admin user created')

}

main()

  .catch((e) => {

    console.error(e)

    process.exit(1)

  })

  .finally(async () => {

    await prisma.$disconnect()

  })

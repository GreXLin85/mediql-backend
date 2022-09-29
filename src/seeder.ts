import { Prisma, PrismaClient } from '@prisma/client'
import PasswordHashMiddleware from './helpers/Middleware/PasswordHash'

const prisma = new PrismaClient()

prisma.$use(PasswordHashMiddleware)

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    password: 'secret42',
    role: 'ADMIN',
    posts: {
      create: [
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    password: 'secret43',
    role: 'USER',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          published: true,
          viewCount: 42,
        },
      ],
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    password: 'secret44',
    role: 'CONTENT_CREATOR',
    posts: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          published: true,
          viewCount: 128,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
        },
      ],
    },
  },
  {
    name: 'Sarah',
    email: 'sarah@sarahssite.com',
    password: 'secret45',
    role: 'REVIEWER',
    posts: {
      create: [
        {
          title: 'Follow Sarah on Twitter',
          content: 'https://www.twitter.com/sarah',
          published: true,
          viewCount: 65,
        },
      ],
    },
  },
  {
    name: 'John',
    email: 'john@john.org',
    password: 'secret46',
    role: 'USER',
    isVerified: true,
    posts: {
      create: [
        {
          title: 'Follow John on Twitter',
          content: 'https://www.twitter.com/john',
          published: true,
          viewCount: 197,
        },
      ],
    },
  }
]

const postLikeData: Prisma.PostLikeCreateInput[] = [
  {
    post: {
      connect: {
        id: 1,
      },
    },
    user: {
      connect: {
        id: 1,
      },
    },
  },
  {
    post: {
      connect: {
        id: 1,
      },
    },
    user: {
      connect: {
        id: 2,
      },
    },
  }, {
    post: {
      connect: {
        id: 3,
      },
    },
    user: {
      connect: {
        id: 2,
      },
    },
  },{
    post: {
      connect: {
        id: 4,
      },
    },
    user: {
      connect: {
        id: 3,
      },
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    try {
      const user = await prisma.user.create({
        data: u,
      })
      console.log(`Created user with id: ${user.id}`)
    } catch (error) {
      console.error("Error Happened", error);
    }
  }
  for (const p of postLikeData) {
    try {
      const postLike = await prisma.postLike.create({
        data: p,
      })
      console.log(`Created postLike with id: ${postLike.id}`)
    } catch (error) {
      console.error("Error Happened", error);
    }
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
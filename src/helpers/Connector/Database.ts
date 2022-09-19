import { PrismaClient, Prisma } from '@prisma/client'
import PasswordHashMiddleware from '../Middleware/PasswordHash'
import PrismaCache from '../Middleware/PrismaCache'

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
})

prisma.$use(PasswordHashMiddleware)
prisma.$use(PrismaCache as Prisma.Middleware)

export default prisma
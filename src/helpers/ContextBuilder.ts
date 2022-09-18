import { PrismaClient } from '@prisma/client'
import HashHelper from './HashHelper'
import PasswordHashMiddleware from './PasswordHashMiddleware'

export interface Context {
    prisma: PrismaClient
}

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

prisma.$use(PasswordHashMiddleware)

export const context = ({ req }: { req: Request }): Context => {
    return { prisma: prisma }
}
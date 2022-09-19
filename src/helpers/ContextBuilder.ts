import { PrismaClient } from "@prisma/client"
import prisma from "./Connector/Database"
import redis from "./Connector/Redis"
import JWTHelper from "./JWTHelper"

export interface Context {
    prisma: PrismaClient
    redis: typeof redis
    jwt: typeof JWTHelper
}

export const context = ({ req }: { req: Request }): Context => {
    return { prisma: prisma, redis: redis, jwt: JWTHelper }
}
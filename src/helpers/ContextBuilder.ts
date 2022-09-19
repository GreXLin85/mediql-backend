import { PrismaClient } from "@prisma/client"
import JWTHelper from "./JWTHelper"
import prisma from "./Connector/Database"
import redis from "./Connector/Redis"
export interface Context {
    prisma: PrismaClient
    redis: typeof redis
    jwt: typeof JWTHelper
}

export interface ContextFunc { (): Context }

export const context = (): Context => {
    return { prisma: prisma, redis: redis, jwt: JWTHelper }
}
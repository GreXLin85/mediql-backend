import { PrismaClient, User } from "@prisma/client"
import JWTHelper from "./JWTHelper"
import SessionHelper from "./SessionHelper"
import prisma from "./Connector/Database"
import redis from "./Connector/Redis"
export interface Context {
    prisma: PrismaClient
    redis: typeof redis
    session: typeof SessionHelper
    jwt: typeof JWTHelper
    user: User | null
}

export interface ContextFunc { ({ req }: { req: any }): Promise<Context> }

export const context = async ({ req }: { req: any }): Promise<Context> => {
    // @ts-ignore
    let user = null
    if (req.body.operationName == 'IntrospectionQuery') {
        // @ts-ignore
        return {}
    }
    if (req.headers.authorization) {
        const authKey = req.headers.authorization.split(" ")[1]

        const userId = (await SessionHelper.verify(authKey))?.id

        if (userId) {
            user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
        }
    }

    return { prisma, redis, session: SessionHelper, jwt: JWTHelper, user }
}
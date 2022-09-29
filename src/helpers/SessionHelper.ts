import * as nanoid from 'nanoid';
import redis from './Connector/Redis';

const EXPIRE_TIME = 60 * 60 * 24 * 7; // 7 days

export default {
    sign: async (id: number) => {
        const isSigned = await redis.get(`user:${id}:authtoken`);
        if (isSigned !== null) {
            return isSigned;
        }

        const token = nanoid.nanoid(32);
        const setToken = await redis.pipeline()
            .set(`authtoken:${token}`, id, 'EX', EXPIRE_TIME)
            .set(`user:${id}:authtoken`, token, 'EX', EXPIRE_TIME)
            .exec() as Array<[Error, 'OK']>;

        if (setToken[0][1] === "OK" || setToken[1][1] === "OK") {
            return token;
        }
        throw setToken;
    },
    verify: async (token: string): Promise<{ id: number; } | null> => {
        const id = Number(await redis.get(`authtoken:${token}`));

        return { id }
    }
}
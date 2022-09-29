import * as nanoid from 'nanoid';
import redis from './Connector/Redis';

const EXPIRE_TIME = 60 * 60 * 24 * 7; // 7 days

export default {
    sign: async (id: number) => {
        const isSigned = await redis.get(`user:${id}:authtoken`);
        if (isSigned !== null){
            return isSigned;
        }

        const token = nanoid.nanoid(32);
        const setToken = await redis.set(`authtoken:${token}`, id, 'EX', EXPIRE_TIME);
        const addToken = await redis.set(`user:${id}:authtoken`, token, 'EX', EXPIRE_TIME);
        if (setToken === 'OK' && addToken === "OK") {
            return token;
        }
    },
    verify: async (token: string): Promise<{ id: number; } | null> => {
        const id = Number(await redis.get(`authtoken:${token}`));

        return { id }
    }
}
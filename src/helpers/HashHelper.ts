import bcrypt from 'bcrypt';

export default {
    hash: async (password: string) => {
        return await bcrypt.hash(password, 10);
    },
    compare: async (password: string, hash: string) => {
        return await bcrypt.compare(password, hash);
    }
}
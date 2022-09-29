import jwt from 'jsonwebtoken';

export default {
    sign: (id: number) => {
        return jwt.sign(
            { id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '24h',
            }
        );
    },
    verify: (token: string) => {
        return jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                return null;
            }
            return decoded;
        }) as unknown as { id: number } | null;
    }
}
import { jwtVerify, SignJWT } from 'jose';
import { NextRequest } from 'next/server';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error('The environment variable JWT_SECRET is not set.');
    }
    return secret;
};

export const verifyAuth = async (req: NextRequest) => {
    const token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.split(' ')[1];

    if (!token) return null;

    try {
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(getJwtSecretKey())
        );
        return verified.payload as { id: string; email: string; role: string };
    } catch (err) {
        return null;
    }
};

export const signToken = async (payload: { id: string; email: string; role: string }) => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24; // 24 hours

    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(getJwtSecretKey()));
};

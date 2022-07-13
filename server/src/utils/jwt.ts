import jwt from 'jsonwebtoken';

export function signJwt<P extends {}>(payload: P, options?: jwt.SignOptions): string {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        ...(options && options)
    });
}

export function verifyJwt(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { payload: decoded, expired: false };
    } catch (e: any) {
        return { payload: null, expired: true };
    }
}



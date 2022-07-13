import { Response, Request, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from '../utils/jwt';

const requireUser = (req: Request, res: Response<{}, { username: string | JwtPayload; }>, next: NextFunction) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) return res.status(401).send({ message: 'Unauthorized' });

    const { payload } = verifyJwt(accessToken);

    if(!payload) return res.status(400).send({ message: 'Invalid token' });

    if(typeof payload === "object") {
        res.locals.username = payload.username;
    }
    
    return next();
};

export default requireUser;
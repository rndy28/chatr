import type { Socket } from 'socket.io';
import { JwtPayload } from 'jsonwebtoken';

export declare interface ISocket extends Socket {
    user?: JwtPayload;
}
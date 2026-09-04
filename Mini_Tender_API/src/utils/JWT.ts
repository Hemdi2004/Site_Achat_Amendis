
import jwt from 'jsonwebtoken';
import {env} from '../config/env.js'
import { Role } from '../generated/prisma/enums.js';

export interface JwtPayload{
    userId: string;
    companyId?: string | undefined;
    role: Role;
}

export function generateToken(payload: JwtPayload): string{
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: '45min',
    });
}

export function verifyToken(token: string): JwtPayload{
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
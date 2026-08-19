
import jwt from 'jsonwebtoken';
import {env} from '../config/env.js'

export interface JwtPayload{
    userId: string;
    companyId?: string;
    role: 'COMPANY' | 'ADMIN';
}

export function generateToken(payload: JwtPayload): string{
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: '45min',
    });
}

export function verifyToken(token: string): JwtPayload{
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
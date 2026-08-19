import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  DATABASE_URL: process.env.DATABASE_URL,
};
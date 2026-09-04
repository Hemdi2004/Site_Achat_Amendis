import 'dotenv/config';

const port = Number(process.env.PORT ?? 3000);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}


export const env = {
  port: port,
  jwtSecret: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};
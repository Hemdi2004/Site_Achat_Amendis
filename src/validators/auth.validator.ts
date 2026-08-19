import { z } from 'zod';

export const registerSchema = z.object({// this is the registerSchema object that is exported from the auth.validator.ts file. It is used to validate the request body for the register route. The schema defines the expected structure and validation rules for the request body, which includes companyName, email, and password fields.
    body: z.object({
    companyName: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
});
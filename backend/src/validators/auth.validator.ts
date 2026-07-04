import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phone: z.string().optional(),
  roleName: z.enum(['ADMIN', 'COMPANY']), // Guests can only sign up as Admin or Company. SuperAdmin is seeded.
  
  // Optional Company fields - validated conditionally down below
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  companyPhone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
}).refine((data) => {
  // Strict Business Rule: If the role is COMPANY, company details are mandatory!
  if (data.roleName === 'COMPANY') {
    return (
      !!data.companyName &&
      !!data.registrationNumber &&
      !!data.taxNumber &&
      !!data.address &&
      !!data.city &&
      !!data.country &&
      !!data.companyPhone
    );
  }
  return true;
}, {
  message: "Company details are required when registering with the COMPANY role",
  path: ["companyName"],
});

// Add this at the bottom of the file
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
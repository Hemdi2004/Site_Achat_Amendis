import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import jwt from 'jsonwebtoken';

export class AuthService {
  async register(input: RegisterInput) {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    // 2. Fetch the role from database to get its true UUID
    const role = await prisma.role.findUnique({
      where: { name: input.roleName },
    });
    if (!role) {
      throw new Error(`Role ${input.roleName} does not exist in the system`);
    }

    // 3. Securely hash the plain-text password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // 4. Use a Prisma Transaction to ensure data integrity
    return await prisma.$transaction(async (tx) => {
      // Create the User record
      const user = await tx.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: hashedPassword,
          phone: input.phone,
          roleId: role.id,
        },
        include: {
          role: true,
        },
      });

      // If the user is a company, attach their profile record
      if (input.roleName === 'COMPANY') {
        await tx.company.create({
          data: {
            userId: user.id,
            companyName: input.companyName!,
            registrationNumber: input.registrationNumber!,
            taxNumber: input.taxNumber!,
            address: input.address!,
            city: input.city!,
            country: input.country!,
            phone: input.companyPhone!,
            website: input.website || null,
          },
        });
      }

      // Return user details safely without exposing the sensitive hashed password string
      const { password, ...safeUser } = user;
      return safeUser;
    });
  }

  async login(input: LoginInput) {
    // 1. Find user by email and pull their associated role
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid email or password');
    }

    // 2. Cryptographically verify the plain text password against the hashed database string
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // 3. Define token configuration payloads
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    // Pull secret keys from environment variables (fallback to safe defaults for local development)
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'super_secret_access_key';
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key';

    // 4. Mint tokens using standard expiration dates
    const accessToken = jwt.sign(tokenPayload, accessTokenSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user.id }, refreshTokenSecret, { expiresIn: '7d' });

    // Remove sensitive fields before sending user data down the pipeline
    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }
}


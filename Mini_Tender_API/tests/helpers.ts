import { prisma } from '../src/config/prisma';


export const TEST_USER = {
  companyName: 'Test Company LLC',
  email: 'automated-test@example.com',
  password: 'Password123!',
};

/**
 * Deletes test entities created during automated runs.
 */
export async function cleanTestUser(email: string) {
  try {
    // Delete orphaned users first
    await prisma.user.deleteMany({
      where: { email },
    });
    await prisma.company.deleteMany({
      where: { email },
    });
  } catch (error) {
    console.warn('Cleanup error:', error);
  }
}
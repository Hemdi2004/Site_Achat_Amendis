import { describe, expect, it, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma';
import { seedAdmin} from '../prisma/seed.js'


const COMPANY_USER = {
  companyName: 'Auth Test Company',
  email: 'company-rbac@example.com',
  password: 'Password123!',
};

const ADMIN_USER = {
  email: 'admin-rbac@example.com',
  password: 'Password123!',
};

describe('Role-Based Access Control (RBAC) API', () => {
  let companyToken: string;// alright so here we need 2 seperate token each token allows its bearer to do specific tasks.
  let adminToken: string;

  beforeEach(async () => {
    await prisma.tender.deleteMany({
      where: {title: 'RBAC Test Tender' }
    });
    // Clean up test users
    await prisma.user.deleteMany({
      where: { email: { in: [COMPANY_USER.email, ADMIN_USER.email] } },
    });
    await prisma.company.deleteMany({
      where: { email: { in: [COMPANY_USER.email, ADMIN_USER.email] } },
    });

    // 1. Register & Login Company User
    await request(app).post('/auth/register').send(COMPANY_USER);
    const companyLoginRes = await request(app).post('/auth/login').send({
      email: COMPANY_USER.email,
      password: COMPANY_USER.password,
    });
    companyToken = companyLoginRes.body.token || companyLoginRes.body.accessToken;

    // 2. Register/Seed Admin User (Update role directly in DB if register sets role to COMPANY)
   // Seed Admin directly using your exported helper
    await seedAdmin({
    adminEmail: ADMIN_USER.email,
    adminPassword: ADMIN_USER.password,
    });

    const adminLoginRes = await request(app).post('/auth/login').send({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });
    adminToken = adminLoginRes.body.token || adminLoginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.tender.deleteMany({  where: {title: 'RBAC Test Tender' }});
    await prisma.user.deleteMany({
      where: { email: { in: [COMPANY_USER.email, ADMIN_USER.email] } },
    });
    await prisma.company.deleteMany({
      where: { email: { in: [COMPANY_USER.email, ADMIN_USER.email] } },
    });
    await prisma.$disconnect();
  });

  describe('POST /tenders (Company Restricted Route)', () => {
    const tenderPayload = {
      title: 'RBAC Test Tender',
      description: 'Testing role authorization rules',
      budget: 50000,
      deadline: new Date(Date.now() + 86400000).toISOString(),
    };

    it('should reject unauthenticated requests with 401', async () => {
      const response = await request(app)
        .post('/tenders')
        .send(tenderPayload);

      expect(response.status).toBe(401);
    });

    it('should allow COMPANY user to create a tender with 201', async () => {
      const response = await request(app)
        .post('/tenders')
        .set('Authorization', `Bearer ${companyToken}`)
        .send(tenderPayload);

      expect([200, 201]).toContain(response.status);
    });

    it('should reject ADMIN user from creating a company tender with 403', async () => {
      const response = await request(app)
        .post('/tenders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tenderPayload);

      expect(response.status).toBe(403);
    });
  });
});
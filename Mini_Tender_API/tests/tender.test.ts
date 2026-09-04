import { describe, expect, it, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma';



const TEST_COMPANY = {
  companyName: 'Tender Test Corp',
  email: 'tender-owner@example.com',
  password: 'Password123!',
};

describe('Tenders API', () => {
  let companyToken: string;
  let createdTenderId: string;

  beforeEach(async () => {
    // Cleanup previous data
    await prisma.tender.deleteMany({ where: { title: { contains: 'Test Tender 101' } } });
    await prisma.user.deleteMany({ where: { email: TEST_COMPANY.email } });
    await prisma.company.deleteMany({where: {email: TEST_COMPANY.email }});
    // Register & obtain auth token
    await request(app).post('/auth/register').send(TEST_COMPANY);
    const loginRes = await request(app).post('/auth/login').send({
      email: TEST_COMPANY.email,
      password: TEST_COMPANY.password,
    });
    companyToken = loginRes.body.token || loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.tender.deleteMany({ where: { title: { contains: 'Test Tender 101' } } });
    await prisma.user.deleteMany({ where: { email: TEST_COMPANY.email } });
    await prisma.company.deleteMany({where: {email: TEST_COMPANY.email }});
    await prisma.$disconnect();
  });

  it('should allow a company to create a new tender', async () => {
    const response = await request(app)
      .post('/tenders')
      .set('Authorization', `Bearer ${companyToken}`)
      .send({
        title: 'Test Tender 101',
        description: 'Automated test tender description',
        budget: 15000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      });

    expect([200, 201]).toContain(response.status);
    const tender = response.body.data || response.body;
    expect(tender).toHaveProperty('id');
    createdTenderId = tender.id;
  });

  it('should retrieve public/published tenders', async () => {
    const response = await request(app).get('/tenders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data || response.body)).toBe(true);
  });
});
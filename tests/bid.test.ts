import { describe, expect, it, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma';


const BIDDER_COMPANY = {
  companyName: 'Bidder Corp LLC',
  email: 'bidder-test@example.com',
  password: 'Password123!',
};

const OWNER_COMPANY = {
  companyName: 'Owner Corp LLC',
  email: 'owner-test@example.com',
  password: 'Password123!',
};

describe('Bids API', () => {
  let bidderToken: string;
  let tenderId: string;

  beforeEach(async () => {
    // 1. Full Cleanup (Children -> Parents)
    await prisma.bid.deleteMany({});
    await prisma.tender.deleteMany({ where: { title: 'Bid Target Tender' } });
    await prisma.user.deleteMany({
      where: { email: { in: [BIDDER_COMPANY.email, OWNER_COMPANY.email] } },
    });
    await prisma.company.deleteMany({
      where: { email: { in: [BIDDER_COMPANY.email, OWNER_COMPANY.email] } },
    });

    // 2. Setup Owner + Create & Publish Tender
    await request(app).post('/auth/register').send(OWNER_COMPANY);
    const ownerLogin = await request(app).post('/auth/login').send({
      email: OWNER_COMPANY.email,
      password: OWNER_COMPANY.password,
    });
    const ownerToken = ownerLogin.body.token || ownerLogin.body.accessToken;

    const tenderRes = await request(app)
      .post('/tenders')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Bid Target Tender',
        description: 'Tender for receiving bids',
        budget: 25000,
        deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
      });

    
    const tender = tenderRes.body.data || tenderRes.body;
    tenderId = tender.id;
    console.log(tenderId);
    console.log(tender);
    await prisma.tender.update({
      where: { id: tenderId }, // 👈 Use the variable assigned on the line above
      data: { status: 'PUBLISHED' },});
    // 3. Setup Bidder Company
    await request(app).post('/auth/register').send(BIDDER_COMPANY);
    const bidderLogin = await request(app).post('/auth/login').send({
      email: BIDDER_COMPANY.email,
      password: BIDDER_COMPANY.password,
    });
    bidderToken = bidderLogin.body.token || bidderLogin.body.accessToken;
  });

  afterAll(async () => {
    await prisma.bid.deleteMany({});
    await prisma.tender.deleteMany({ where: { title: 'Bid Target Tender' } });
    await prisma.user.deleteMany({
      where: { email: { in: [BIDDER_COMPANY.email, OWNER_COMPANY.email] } },
    });
    await prisma.company.deleteMany({
      where: { email: { in: [BIDDER_COMPANY.email, OWNER_COMPANY.email] } },
    });
    await prisma.$disconnect();
  });

  it('should submit a valid bid for an open tender', async () => {
    const response = await request(app)
      .post(`/api/tenders/${tenderId}/bids`) // Template literal fix
      .set('Authorization', `Bearer ${bidderToken}`)
      .send({
        amount: 22000,
        technicalDocUrl: 'https://example.com/tech.pdf',
        financialDocUrl: 'https://example.com/fin.pdf',
      });
    console.log('API Response Body:', response.body);
    expect([200, 201]).toContain(response.status);
  });

  it('should reject duplicate bid submission from the same company', async () => {
    // First bid submission
    await request(app)
      .post(`/api/tenders/${tenderId}/bids`)
      .set('Authorization', `Bearer ${bidderToken}`)
      .send({
        amount: 22000,
        technicalDocUrl: 'https://example.com/tech1.pdf',
        financialDocUrl: 'https://example.com/fin1.pdf',
      });

    // Second bid submission attempt
    const duplicateResponse = await request(app)
      .post(`/api/tenders/${tenderId}/bids`)
      .set('Authorization', `Bearer ${bidderToken}`)
      .send({
        amount: 21000,
        technicalDocUrl: 'https://example.com/tech2.pdf',
        financialDocUrl: 'https://example.com/fin2.pdf',
      });
    console.log(duplicateResponse.body);
    expect([400, 409]).toContain(duplicateResponse.status);
  });
});
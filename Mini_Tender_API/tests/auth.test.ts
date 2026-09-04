import { describe, expect, it, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { TEST_USER, cleanTestUser } from './helpers.js';
import { prisma } from '../src/config/prisma';

describe('Authentication API', () => {
  // Ensure the email is free before running registration assertions
  beforeEach(async () => {
    await cleanTestUser(TEST_USER.email);
  });

  // Clean up after all tests in this file complete
  afterAll(async () => {
    await cleanTestUser(TEST_USER.email);
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should successfully register a new user/company', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(TEST_USER); 
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(TEST_USER.email);
      // Ensure raw passwords are never returned
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject registration if the email is already in use', async () => {
      // 1. First registration attempt
      await request(app)
        .post('/auth/register')
        .send(TEST_USER);

      // 2. Duplicate registration attempt with identical credentials
      const response = await request(app)
        .post('/auth/register')
        .send(TEST_USER);

      expect([400, 409]).toContain(response.status);
    });

    it('should fail validation when required fields are missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'incomplete@example.com',
          // Missing password and company name
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should reject invalid login credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'does-not-exist@example.com',
          password: 'wrong-password',
        });

      expect(response.status).toBe(401);
    });
  });
});
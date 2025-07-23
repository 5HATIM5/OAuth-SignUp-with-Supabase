import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module';

// Helper for protected route test (adjust if you have a different protected route)
const protectedRoute = '/auth/test';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true, 
        transform: true,
      }),
    );

    await app.init();
  });

  it('should register a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test',
        surname: 'User',
        dateOfBirth: '2000-01-01',
        phoneNo: '1234567890'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should not register with existing email', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test',
        surname: 'User',
        dateOfBirth: '2000-01-01',
        phoneNo: '1234567890'
      });
    expect(res.status).toBe(401);
  });

  it('should not register with missing required fields', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'missingfields@example.com' });
    expect(res.status).toBe(400);
  });

  it('should not register with invalid email', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'not-an-email',
        password: 'Password123!',
        name: 'Test',
        surname: 'User',
        dateOfBirth: '2000-01-01',
        phoneNo: '1234567891'
      });
    expect(res.status).toBe(400);
  });

  it('should not register with weak password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'weakpass@example.com',
        password: '123',
        name: 'Test',
        surname: 'User',
        dateOfBirth: '2000-01-01',
        phoneNo: '1234567892'
      });
    expect(res.status).toBe(400);
  });

  it('should not register with duplicate phone number', async () => {
    // First registration
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'uniquephone@example.com',
        password: 'Password123!',
        name: 'Test',
        surname: 'User',
        dateOfBirth: '2000-01-01',
        phoneNo: '9999999999'
      });
    // Duplicate phone
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'another@example.com',
        password: 'Password123!',
        name: 'Test',
        surname: 'User',
        dateOfBirth: '2000-01-01',
        phoneNo: '9999999999'
      });
    expect(res.status).toBe(401);
  });

  it('should not register with duplicate email (case-insensitive)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123!',
        name: 'Test',
        surname: 'User',
        dateOfBirth: '2000-01-01',
        phoneNo: '1234567893'
      });
    expect(res.status).toBe(401);
  });

  it('should login', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should not login with wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword!'
      });
    expect(res.status).toBe(401);
  });

  it('should not login with non-existent user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'notfound@example.com',
        password: 'Password123!'
      });
    expect(res.status).toBe(401);
  });

  it('should not login with missing fields', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
  });

  // it('should not access protected route without token', async () => {
  //   const res = await request(app.getHttpServer())
  //     .get(protectedRoute);
  //   expect(res.status).toBe(401);
  // });

  // it('should not access protected route with invalid token', async () => {
  //   const res = await request(app.getHttpServer())
  //     .get(protectedRoute)
  //     .set('Authorization', 'Bearer invalidtoken');
  //   expect(res.status).toBe(401);
  // });

  afterAll(async () => {
    await app.close();
  });
});
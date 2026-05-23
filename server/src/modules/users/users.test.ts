import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { config } from '../../config';
import { UserModel } from './users.model';

describe('Users API Endpoints (/api/v1/users)', () => {
  const validUserPayload = {
    email: 'test@example.com',
    name: 'Jane Doe',
    password: 'securePassword123',
  };

  beforeAll(async () => {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should create a new user and return sanitized user data', async () => {
    const res = await request(app).post('/api/v1/users').send(validUserPayload);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.id).toBeTypeOf('string');
    expect(res.body.data.user.email).toBe(validUserPayload.email);
    expect(res.body.data.user.name).toBe(validUserPayload.name);
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('should return 409 conflict when registering a duplicate email', async () => {
    await request(app).post('/api/v1/users').send(validUserPayload);

    const res = await request(app).post('/api/v1/users').send(validUserPayload);
    expect(res.status).toBe(409);
    expect(res.body.status).toBe('fail');
    expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('should return 400 validation failure for missing/incorrect field formats', async () => {
    const res = await request(app).post('/api/v1/users').send({
      email: 'invalid-email',
      name: 'J',
      password: 'short',
    });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toBeTypeOf('object');
    expect(res.body.error.details.length).toBe(3);
  });

  it('should list all registered users', async () => {
    await request(app).post('/api/v1/users').send(validUserPayload);

    const res = await request(app).get('/api/v1/users');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.users).toBeTypeOf('object');
    expect(res.body.data.users.length).toBeGreaterThan(0);
  });

  it('should fetch a single user by standard UUID', async () => {
    const createRes = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'findme@example.com',
        name: 'Find Me',
        password: 'securePassword123',
      });
    const createdUserId = createRes.body.data.user.id;

    const res = await request(app).get(`/api/v1/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.id).toBe(createdUserId);
    expect(res.body.data.user.email).toBe('findme@example.com');
  });

  it('should return 400 validation error for non-UUID user ID path param', async () => {
    const res = await request(app).get('/api/v1/users/not-a-valid-uuid');

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details[0].message).toContain('valid UUID format');
  });

  it('should return 404 for non-existent UUID user ID', async () => {
    const randomUuid = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/api/v1/users/${randomUuid}`);

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('fail');
    expect(res.body.error.message).toContain('could not be found');
  });
});

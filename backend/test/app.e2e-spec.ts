import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / (Health Check)', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer).get('/').expect(200);
  });

  it('POST /auth/register should return access_token', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const response = await request(httpServer)
      .post('/auth/register')
      .send({
        email: `test${Date.now()}@example.com`, // avoid duplicate email errors
        password: 'Password123!',
      })
      .expect(201);

    const body = response.body as { access_token?: string };
    expect(body.access_token).toBeDefined();
  });

  it('POST /auth/login should return access_token', async () => {
    const email = `login${Date.now()}@example.com`;
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer)
      .post('/auth/register')
      .send({
        email,
        password: 'Password123!',
      })
      .expect(201);

    const response = await request(httpServer)
      .post('/auth/login')
      .send({
        email,
        password: 'Password123!',
      })
      .expect(201);

    const body = response.body as { access_token?: string };
    expect(body.access_token).toBeDefined();
  });
});

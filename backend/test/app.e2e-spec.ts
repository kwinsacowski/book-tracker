import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  const password = 'Password123!';

  async function registerAndLogin(httpServer: Parameters<typeof request>[0]) {
    const email = `e2e${Date.now()}@example.com`;

    await request(httpServer)
      .post('/auth/register')
      .send({ email, password })
      .expect(201);

    const loginRes = await request(httpServer)
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    const body = loginRes.body as { access_token: string };
    return body.access_token;
  }

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

  it('GET /books should require auth', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    await request(httpServer).get('/books').expect(401);
  });

  it('Library flow: add -> list -> update -> delete', async () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const token = await registerAndLogin(httpServer);

    // Add to library
    const addRes = await request(httpServer)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        author: 'Test Author',
        pageCount: 300,
        genres: ['Fantasy'],
      })
      .expect(201);

    const added = addRes.body as { book?: { id?: string } };
    const bookId = added.book?.id;
    expect(bookId).toBeDefined();

    // List my library
    const listRes = await request(httpServer)
      .get('/books')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const list = listRes.body as Array<{
      book: { id: string; bookGenres?: Array<{ genre: { name: string } }> };
    }>;

    expect(Array.isArray(list)).toBe(true);
    expect(list.some((row) => row.book.id === bookId)).toBe(true);

    // Update status/progress
    await request(httpServer)
      .patch(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'READING',
        progressUnit: 'PERCENT',
        progress: 25,
      })
      .expect(200);

    // Remove from library
    await request(httpServer)
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Confirm removed
    const listRes2 = await request(httpServer)
      .get('/books')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const list2 = listRes2.body as Array<{ book: { id: string } }>;
    expect(list2.some((row) => row.book.id === bookId)).toBe(false);
  });
});

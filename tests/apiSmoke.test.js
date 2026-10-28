const request = require('supertest');
const app = require('../src/app');

describe('API smoke checks', () => {
  test('GET /api/v1/health reports the process as alive without requiring MongoDB', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        status: 'ok',
        service: 'todo-list-management-api',
        databaseConnected: false,
      },
    });
  });

  test('unknown routes return a consistent JSON 404', async () => {
    const response = await request(app).get('/api/v1/no-such-route');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
  });

  test('protected routes reject a request without a Bearer token', async () => {
    const response = await request(app).get('/api/v1/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
  });

  test('registration rejects a role field so users cannot self-promote', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Dafi User', email: 'dafi@example.test', password: 'safe-password-123', role: 'admin' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('UNKNOWN_FIELDS');
  });

  test('registration validates email and password before contacting MongoDB', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Dafi User', email: 'not-an-email', password: 'short' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('REQUEST_VALIDATION_ERROR');
    expect(response.body.error.details).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'email' }),
      expect.objectContaining({ field: 'password' }),
    ]));
  });

  test('malformed JSON returns HTTP 400', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send('{bad json');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('MALFORMED_JSON');
  });

  test('API-key endpoints report missing server configuration clearly', async () => {
    const response = await request(app).get('/api/v1/public/stats');

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe('API_KEY_NOT_CONFIGURED');
  });

  test('Swagger UI assets redirect to the pinned distribution files', async () => {
    const response = await request(app).get('/api-docs/swagger-ui-bundle.js');

    expect(response.status).toBe(302);
    expect(response.headers.location).toMatch(
      /^https:\/\/cdn\.jsdelivr\.net\/npm\/swagger-ui-dist@\d+\.\d+\.\d+\/swagger-ui-bundle\.js$/,
    );
  });
});

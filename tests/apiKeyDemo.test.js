describe('public demo API key', () => {
  const originalApiKey = process.env.API_KEY;
  const originalDemoKey = process.env.API_KEY_DEMO;
  const demoKey = 'demo-api-key-with-at-least-32-characters';
  const productionKey = 'production-api-key-with-at-least-32-characters';

  beforeEach(() => {
    jest.resetModules();
    process.env.API_KEY = productionKey;
    process.env.API_KEY_DEMO = demoKey;
  });

  afterAll(() => {
    if (originalApiKey === undefined) delete process.env.API_KEY;
    else process.env.API_KEY = originalApiKey;
    if (originalDemoKey === undefined) delete process.env.API_KEY_DEMO;
    else process.env.API_KEY_DEMO = originalDemoKey;
    jest.resetModules();
  });

  test.each([demoKey, productionKey])('accepts a configured key', (key) => {
    const requireApiKey = require('../src/middleware/requireApiKey');
    const next = jest.fn();

    requireApiKey({ get: () => key }, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  test('rejects a key that is not configured', () => {
    const requireApiKey = require('../src/middleware/requireApiKey');
    const next = jest.fn();

    requireApiKey({ get: () => 'incorrect-key' }, {}, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 'INVALID_API_KEY', statusCode: 403 }));
  });
});

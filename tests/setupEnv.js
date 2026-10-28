process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/todo_list_test';
process.env.JWT_SECRET = 'test-only-jwt-secret-value-with-at-least-32-characters';
process.env.JWT_EXPIRES_IN = '15m';
process.env.API_KEY = '';
process.env.BCRYPT_SALT_ROUNDS = '10';
process.env.CORS_ORIGINS = '*';

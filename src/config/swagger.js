const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
  description: 'MongoDB ObjectId.',
};

const pageParameters = [
  { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
  { name: 'sortBy', in: 'query', schema: { type: 'string' } },
  { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
];

const errorResponse = {
  description: 'Request gagal.',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
    },
  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Todo List Management',
    version: '1.0.0',
    description: 'REST API untuk Todo pribadi, kategori, autentikasi, audit aktivitas, dan ringkasan machine-to-machine.',
  },
  servers: [{ url: '/api/v1', description: 'API versi 1' }],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Categories' },
    { name: 'Todos' },
    { name: 'Activity Logs' },
    { name: 'Public API' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      apiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'REQUEST_VALIDATION_ERROR' },
              message: { type: 'string' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'] },
          archived: { type: 'boolean' },
          created_by: { type: 'string', nullable: true },
          updated_by: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'belajar' },
          description: { type: 'string' },
          color: { type: 'string', example: '#3366FF' },
          user: { type: 'string' },
          archived: { type: 'boolean' },
          created_by: { type: 'string', nullable: true },
          updated_by: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Todo: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          completed: { type: 'boolean' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          due_date: { type: 'string', format: 'date-time', nullable: true },
          user: { type: 'string' },
          category: { oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/Category' }] },
          archived: { type: 'boolean' },
          created_by: { type: 'string', nullable: true },
          updated_by: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          totalItems: { type: 'integer' },
          currentPage: { type: 'integer' },
          pageSize: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNextPage: { type: 'boolean' },
          hasPreviousPage: { type: 'boolean' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Periksa status proses API',
        responses: { 200: { description: 'Proses API berjalan.' } },
      },
    },
    '/health/ready': {
      get: {
        tags: ['Health'],
        summary: 'Periksa kesiapan koneksi database',
        responses: { 200: { description: 'Database siap.' }, 503: errorResponse },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Daftarkan akun user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 100 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8, maxLength: 72 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Akun dan access token berhasil dibuat.' }, 400: errorResponse, 409: errorResponse },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login dan dapatkan access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Login berhasil.' }, 401: errorResponse },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Lihat profil akun aktif',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Profil akun.' }, 401: errorResponse },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Daftar user (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [...pageParameters, { name: 'search', in: 'query', schema: { type: 'string' } }, { name: 'role', in: 'query', schema: { type: 'string', enum: ['user', 'admin'] } }],
        responses: { 200: { description: 'Daftar user dan pagination.' }, 403: errorResponse },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Lihat profil sendiri atau profil user (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [idParameter],
        responses: { 200: { description: 'Profil user.' }, 403: errorResponse, 404: errorResponse },
      },
      patch: {
        tags: ['Users'],
        summary: 'Perbarui profil; perubahan role hanya untuk admin',
        security: [{ bearerAuth: [] }],
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, role: { type: 'string', enum: ['user', 'admin'] } } },
            },
          },
        },
        responses: { 200: { description: 'Profil diperbarui.' }, 400: errorResponse, 403: errorResponse },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Daftar kategori milik akun',
        security: [{ bearerAuth: [] }],
        parameters: [...pageParameters, { name: 'search', in: 'query', schema: { type: 'string' } }],
        responses: { 200: { description: 'Kategori dan pagination.' }, 401: errorResponse },
      },
      post: {
        tags: ['Categories'],
        summary: 'Buat kategori',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, description: { type: 'string' }, color: { type: 'string', example: '#3366FF' } } },
            },
          },
        },
        responses: { 201: { description: 'Kategori dibuat.' }, 400: errorResponse, 409: errorResponse },
      },
    },
    '/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Lihat kategori',
        security: [{ bearerAuth: [] }],
        parameters: [idParameter],
        responses: { 200: { description: 'Detail kategori.' }, 404: errorResponse },
      },
      patch: {
        tags: ['Categories'],
        summary: 'Perbarui kategori',
        security: [{ bearerAuth: [] }],
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  color: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Kategori diperbarui.' }, 400: errorResponse, 404: errorResponse },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Arsipkan kategori',
        security: [{ bearerAuth: [] }],
        parameters: [idParameter],
        responses: { 200: { description: 'Kategori diarsipkan.' }, 404: errorResponse },
      },
    },
    '/todos': {
      get: {
        tags: ['Todos'],
        summary: 'Daftar todo milik akun',
        security: [{ bearerAuth: [] }],
        parameters: [
          ...pageParameters,
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'completed', in: 'query', schema: { type: 'boolean' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Todo dan pagination.' }, 400: errorResponse, 401: errorResponse },
      },
      post: {
        tags: ['Todos'],
        summary: 'Buat todo',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'category'],
                properties: {
                  title: { type: 'string', maxLength: 120 },
                  description: { type: 'string' },
                  completed: { type: 'boolean', default: false },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                  due_date: { type: 'string', format: 'date-time', nullable: true },
                  category: { type: 'string', description: 'ID kategori milik akun yang sedang login.' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Todo dibuat dan activity log dicatat.' }, 400: errorResponse, 404: errorResponse },
      },
    },
    '/todos/{id}': {
      get: {
        tags: ['Todos'],
        summary: 'Lihat todo',
        security: [{ bearerAuth: [] }],
        parameters: [idParameter],
        responses: { 200: { description: 'Detail todo.' }, 404: errorResponse },
      },
      patch: {
        tags: ['Todos'],
        summary: 'Perbarui todo',
        security: [{ bearerAuth: [] }],
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  completed: { type: 'boolean' },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                  due_date: { type: 'string', format: 'date-time', nullable: true },
                  category: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Todo diperbarui dan activity log dicatat.' }, 400: errorResponse, 404: errorResponse },
      },
      delete: {
        tags: ['Todos'],
        summary: 'Arsipkan todo',
        security: [{ bearerAuth: [] }],
        parameters: [idParameter],
        responses: { 200: { description: 'Todo diarsipkan dan activity log dicatat.' }, 404: errorResponse },
      },
    },
    '/activity-logs': {
      get: {
        tags: ['Activity Logs'],
        summary: 'Lihat riwayat aktivitas milik akun (admin dapat melihat semua)',
        security: [{ bearerAuth: [] }],
        parameters: [...pageParameters, { name: 'action', in: 'query', schema: { type: 'string', enum: ['TODO_CREATED', 'TODO_UPDATED', 'TODO_ARCHIVED'] } }],
        responses: { 200: { description: 'Activity log dan pagination.' }, 401: errorResponse },
      },
    },
    '/public/stats': {
      get: {
        tags: ['Public API'],
        summary: 'Ambil ringkasan resource untuk machine-to-machine',
        security: [{ apiKeyAuth: [] }],
        responses: { 200: { description: 'Ringkasan jumlah user, todo, kategori, dan aktivitas.' }, 401: errorResponse, 403: errorResponse },
      },
    },
    '/public/activity-logs': {
      get: {
        tags: ['Public API'],
        summary: 'Ambil activity log yang sudah disanitasi',
        security: [{ apiKeyAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'action', in: 'query', schema: { type: 'string', enum: ['TODO_CREATED', 'TODO_UPDATED', 'TODO_ARCHIVED'] } },
          { name: 'after', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: { 200: { description: 'Activity log ringkas tanpa ID user, judul todo, atau metadata internal.' }, 401: errorResponse, 403: errorResponse },
      },
    },
  },
};

module.exports = swaggerSpec;

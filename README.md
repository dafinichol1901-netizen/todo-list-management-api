# Todo List Management API

REST API untuk mengelola todo dan kategori milik pengguna. Project ini dibangun dengan Node.js, Express, dan MongoDB sebagai proyek pembelajaran backend.

## Fitur

- Registrasi dan login dengan password yang di-hash serta autentikasi JWT.
- Role user dan admin, dengan pembatasan akses sesuai hak pengguna.
- CRUD todo dan kategori, termasuk pemeriksaan kepemilikan data.
- Pagination, pencarian, filter, dan sorting pada daftar todo.
- Activity log untuk perubahan penting.
- Endpoint statistik dan activity log eksternal yang dilindungi API key, termasuk key demo publik terbatas untuk endpoint baca.
- Validasi request dan format error JSON yang konsisten.
- Dokumentasi interaktif Swagger UI.
- Automated smoke test dengan Jest dan Supertest.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Runtime dan framework | Node.js 22+, Express 5 |
| Database | MongoDB, Mongoose |
| Autentikasi dan keamanan | JSON Web Token, bcryptjs, Helmet, CORS, express-rate-limit |
| Validasi dan logging | express-validator, Morgan |
| Dokumentasi | Swagger UI Express |
| Pengujian | Jest, Supertest |

## Struktur project

~~~text
src/
|-- config/       # Konfigurasi environment, database, dan Swagger
|-- controllers/  # Penanganan request dan response HTTP
|-- middleware/   # Autentikasi, otorisasi, logging, dan error handler
|-- models/       # Schema MongoDB melalui Mongoose
|-- routes/       # Daftar endpoint API
|-- services/     # Logika bisnis
|-- utils/        # Helper dan custom error
|-- validators/   # Aturan validasi request
|-- app.js        # Konfigurasi aplikasi Express
`-- server.js     # Entry point server lokal
scripts/          # Script pembuatan admin dan data demo
tests/            # Automated test API
docs/             # Rancangan API, panduan, dan manual teknis
postman/          # Collection dan environment Postman
~~~

## Persyaratan

- Node.js versi 22 atau lebih baru dan npm.
- MongoDB lokal atau database MongoDB Atlas.

## Instalasi dan konfigurasi

Jalankan perintah berikut dari folder project. Di PowerShell, gunakan npm.cmd jika kebijakan sistem memblokir npm.ps1.

~~~powershell
npm.cmd install
Copy-Item .env.example .env
~~~

Buka file .env dan isi URI MongoDB serta secret yang kuat untuk JWT_SECRET dan API_KEY. Buat dua secret yang berbeda dengan menjalankan perintah ini dua kali:

~~~powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
~~~

Jangan unggah file .env, token JWT, password, atau nilai `API_KEY` production ke GitHub, Postman collection, maupun screenshot. `API_KEY_DEMO` yang dicantumkan di bawah memang publik dan hanya boleh digunakan untuk endpoint GET publik.

## Environment variables

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| NODE_ENV | Tidak | Mode aplikasi; default development. |
| PORT | Tidak | Port server; default 3000. |
| MONGODB_URI | Ya | URI koneksi MongoDB lokal atau Atlas. |
| JWT_SECRET | Ya | Secret acak minimal 32 karakter untuk token JWT. |
| JWT_EXPIRES_IN | Tidak | Masa berlaku token; default 15m. |
| API_KEY | Ya | Secret acak minimal 32 karakter untuk endpoint eksternal; jangan dipublikasikan. |
| API_KEY_DEMO | Tidak | Key demo publik terpisah untuk endpoint GET `/public/stats` dan `/public/activity-logs`; tidak memberi akses ke endpoint JWT. |
| BCRYPT_SALT_ROUNDS | Tidak | Work factor bcrypt antara 10-15; default 12. |
| CORS_ORIGINS | Tidak | Origin frontend yang diizinkan, dipisahkan koma; default *. Batasi nilainya saat production. |
| ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD | Opsional | Diisi di environment lokal saat menjalankan seed:admin. |
| SEED_USER_EMAIL | Opsional | Email pengguna terdaftar yang menerima data demo dari seed:demo. |

## Menjalankan aplikasi

~~~powershell
npm.cmd run dev
~~~

Untuk menjalankan mode biasa:

~~~powershell
npm.cmd start
~~~

Setelah server berjalan, buka:

- http://localhost:3000/api/v1/health untuk memeriksa status proses API.
- http://localhost:3000/api/v1/health/ready untuk memeriksa kesiapan koneksi database.
- http://localhost:3000/api-docs untuk membuka Swagger UI.

## Live deployment

- Production API: <https://todo-list-management-api-ox7d.vercel.app>
- Swagger UI: <https://todo-list-management-api-ox7d.vercel.app/api-docs>
- Health check: <https://todo-list-management-api-ox7d.vercel.app/api/v1/health>

## Pengujian dan script tambahan

~~~powershell
npm.cmd test
npm.cmd run test:watch
npm.cmd run test:coverage
~~~

Script opsional:

- npm.cmd run seed:admin membuat akun admin menggunakan ADMIN_NAME, ADMIN_EMAIL, dan ADMIN_PASSWORD.
- npm.cmd run seed:demo membuat data contoh untuk email pada SEED_USER_EMAIL.

## Ringkasan endpoint

Semua endpoint API menggunakan prefix /api/v1.

| Method | Endpoint | Akses | Keterangan |
| --- | --- | --- | --- |
| GET | /health | Publik | Status proses API. |
| GET | /health/ready | Publik | Kesiapan koneksi database. |
| POST | /auth/register | Publik | Registrasi pengguna. |
| POST | /auth/login | Publik | Login dan memperoleh JWT. |
| GET | /auth/me | JWT | Profil pengguna yang sedang login. |
| GET, POST, PATCH, DELETE | /todos | JWT | Daftar, tambah, ubah, dan arsipkan todo milik pengguna. |
| GET | /todos/:id | JWT | Melihat detail todo milik pengguna. |
| GET, POST, PATCH, DELETE | /categories | JWT | Daftar, tambah, ubah, dan arsipkan kategori milik pengguna. |
| GET | /categories/:id | JWT | Melihat detail kategori milik pengguna. |
| GET | /activity-logs | JWT | Melihat activity log akun. |
| GET | /users | JWT admin | Melihat daftar pengguna. |
| GET, PATCH | /users/:id | JWT | Melihat atau mengubah profil sesuai hak akses. |
| GET | /public/stats | API key | Statistik untuk integrasi eksternal. |
| GET | /public/activity-logs | API key | Activity log untuk integrasi eksternal. |

### API key demo untuk reviewer

Gunakan key publik berikut hanya untuk mencoba endpoint GET statistik dan activity log yang sudah disanitasi:

~~~text
5d0eb6cafa28120199610dc63986274a1202d144c952b35eefa89178d4d59bae
~~~

Kirim nilainya sebagai header `x-api-key`. Key demo ini bukan secret dan tidak boleh digunakan sebagai `API_KEY` production. Server membatasi endpoint publik dengan rate limit.

Dokumentasi endpoint dan skema request/response lengkap tersedia di Swagger UI setelah server lokal dijalankan.

## Dokumentasi project

- [Rancangan API](docs/API_PLAN.md)
- [Manual Book teknis](docs/MANUAL_BOOK.md)
- [Panduan Postman](docs/POSTMAN.md)
- [Panduan deployment Vercel](docs/DEPLOYMENT_VERCEL.md)
- [Daftar bukti screenshot](docs/SCREENSHOT_EVIDENCE.md)
- [Panduan setup MongoDB Atlas](docs/ATLAS_SETUP.md)

## Lisensi

Project ini dibuat untuk pembelajaran dan pengerjaan proyek magang.

# Deploy ke Vercel

Proyek mengekspor aplikasi Express dari `src/index.js`, lokasi yang dikenali Vercel untuk aplikasi Express. Fungsi serverless menghubungkan MongoDB saat menerima request yang memerlukan database; endpoint health liveness tetap dapat dipanggil tanpa membuka koneksi database.

**Status deployment:** sudah live dan diverifikasi pada 30 Oktober 2026.

## Hasil deployment

- Production API URL: <https://todo-list-management-api-ox7d.vercel.app>
- Health check: `GET /api/v1/health` merespons HTTP 200 dan database terhubung.
- Readiness check: `GET /api/v1/health/ready` merespons HTTP 200.
- Dokumentasi Swagger: <https://todo-list-management-api-ox7d.vercel.app/api-docs>
- Deployment berasal dari branch `master` pada commit `e6134c591b4e9807295fa31501a58c52d704ce46`.

Vercel Authentication dinonaktifkan agar API produksi dapat diakses publik. Endpoint aplikasi tetap menerapkan autentikasi JWT, role, dan API Key sesuai kebutuhannya.

## Persiapan

1. Buat database MongoDB Atlas atau siapkan MongoDB yang dapat dijangkau dari Vercel.
2. Repository source tersedia di [GitHub](https://github.com/dafinichol1901-netizen/todo-list-management-api). `.env` dan secret tidak boleh dimasukkan ke repository.
3. Import repository tersebut ke Vercel.

Vercel mendeteksi Express dari export aplikasi di `src/index.js`. Karena aset statis `swagger-ui-dist` tidak tersedia dari function pada deployment, JavaScript dan CSS Swagger UI diarahkan ke jsDelivr dengan versi paket yang dipatok.

## Environment variables

Tambahkan variabel berikut pada pengaturan project Vercel untuk environment yang akan dipakai:

| Variable | Nilai |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | URI database yang disediakan MongoDB. |
| `JWT_SECRET` | Secret acak minimal 32 karakter. |
| `JWT_EXPIRES_IN` | Contoh `15m`. |
| `API_KEY` | Secret acak terpisah, minimal 32 karakter. |
| `API_KEY_DEMO` | Key publik terpisah untuk menguji endpoint GET `/public/stats` dan `/public/activity-logs`. |
| `BCRYPT_SALT_ROUNDS` | `12`. |
| `CORS_ORIGINS` | Origin frontend yang diizinkan; pisahkan beberapa origin dengan koma. |

Jangan menaruh nilai rahasia di source code, repository, screenshot, atau dokumentasi publik. `API_KEY_DEMO` adalah pengecualian yang memang dipublikasikan di README dan hanya boleh mengakses endpoint GET publik yang dibatasi rate limit; jangan pernah menyamakan nilainya dengan `API_KEY`. Gunakan akun database dengan hak minimum yang diperlukan dan atur akses jaringan MongoDB sesuai model egress deployment.

## Pemeriksaan setelah deployment

1. Buka `https://<domain-vercel>/api/v1/health` untuk memeriksa proses.
2. Buka `https://<domain-vercel>/api/v1/health/ready` untuk memastikan koneksi MongoDB.
3. Buka `https://<domain-vercel>/api-docs` untuk menguji endpoint melalui Swagger UI.
4. Jalankan registrasi, login, CRUD kategori dan todo, pencarian/pagination, serta endpoint API Key melalui Postman.

Pemeriksaan pascadeploy di atas telah dilakukan untuk health, koneksi database, dan pemuatan halaman Swagger. Uji fungsional endpoint melalui Postman tetap perlu dilakukan sebelum URL dikirim untuk review.

## Referensi resmi

- [Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- [Vercel Node.js runtime](https://vercel.com/docs/functions/runtimes/node-js)

# Deploy ke Vercel

Proyek mengekspor aplikasi Express dari `src/index.js`, lokasi yang dikenali Vercel untuk aplikasi Express. Fungsi serverless menghubungkan MongoDB saat menerima request yang memerlukan database; endpoint health liveness tetap dapat dipanggil tanpa membuka koneksi database.

**Status deployment:** belum diverifikasi sebagai deployment produksi. Panduan ini menjelaskan langkah yang perlu dilakukan; jangan menganggap API sudah live sebelum URL deployment dan pemeriksaan pascadeploy berhasil.

## Persiapan

1. Buat database MongoDB Atlas atau siapkan MongoDB yang dapat dijangkau dari Vercel.
2. Repository source tersedia di [GitHub](https://github.com/dafinichol1901-netizen/todo-list-management-api). `.env` dan secret tidak boleh dimasukkan ke repository.
3. Import repository tersebut ke Vercel.

Vercel mendeteksi Express dari export aplikasi di `src/index.js`. File `vercel.json` menyertakan aset `swagger-ui-dist` ke dalam function agar file JavaScript dan CSS Swagger tersedia pada deployment.

## Environment variables

Tambahkan variabel berikut pada pengaturan project Vercel untuk environment yang akan dipakai:

| Variable | Nilai |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | URI database yang disediakan MongoDB. |
| `JWT_SECRET` | Secret acak minimal 32 karakter. |
| `JWT_EXPIRES_IN` | Contoh `15m`. |
| `API_KEY` | Secret acak terpisah, minimal 32 karakter. |
| `BCRYPT_SALT_ROUNDS` | `12`. |
| `CORS_ORIGINS` | Origin frontend yang diizinkan; pisahkan beberapa origin dengan koma. |

Jangan menaruh nilai rahasia di source code, repository, screenshot, atau dokumentasi publik. Gunakan akun database dengan hak minimum yang diperlukan dan atur akses jaringan MongoDB sesuai model egress deployment.

## Pemeriksaan setelah deployment

1. Buka `https://<domain-vercel>/api/v1/health` untuk memeriksa proses.
2. Buka `https://<domain-vercel>/api/v1/health/ready` untuk memastikan koneksi MongoDB.
3. Buka `https://<domain-vercel>/api-docs` untuk menguji endpoint melalui Swagger UI.
4. Jalankan registrasi, login, CRUD kategori dan todo, pencarian/pagination, serta endpoint API Key melalui Postman.

Deployment produksi tidak dilakukan dari lingkungan ini. Dafi perlu menghubungkan repository dan mengisi environment variables di akun Vercel sendiri.

## Referensi resmi

- [Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- [Vercel Node.js runtime](https://vercel.com/docs/functions/runtimes/node-js)

# MANUAL BOOK TEKNIS

## Todo List Management API

**Disusun oleh:** Muhamad Dafi Nanggala  
**Teknologi:** Node.js, Express.js, MongoDB, Mongoose  
**Versi API:** 1 (`/api/v1`)  
**Versi dokumen:** 1.1  
**Tanggal:** 30 Oktober 2026

**Status proyek saat pembaruan:** source dan revisi mentor sudah dipublikasikan di [repository GitHub](https://github.com/dafinichol1901-netizen/todo-list-management-api), README tampil di halaman repository, dan API sudah dideploy ke Vercel. Test terakhir lulus 17 dari 17. Menurut konfirmasi Dafi, PDF Manual Book sudah diunggah ke Drive; file tautan GitHub perlu diunggah terpisah ke folder Drive yang sama.

---

## Daftar Isi

1. [Tentang Proyek](#1-tentang-proyek)
2. [Teknologi dan Persyaratan](#2-teknologi-dan-persyaratan)
3. [Struktur Folder dan Relasi Data](#3-struktur-folder-dan-relasi-data)
4. [Instalasi dan Konfigurasi](#4-instalasi-dan-konfigurasi)
5. [Menjalankan Aplikasi](#5-menjalankan-aplikasi)
6. [Autentikasi dan Hak Akses](#6-autentikasi-dan-hak-akses)
7. [Penggunaan Endpoint](#7-penggunaan-endpoint)
8. [Filter, Pencarian, Pengurutan, dan Pagination](#8-filter-pencarian-pengurutan-dan-pagination)
9. [Activity Log dan API Key](#9-activity-log-dan-api-key)
10. [Validasi dan Penanganan Error](#10-validasi-dan-penanganan-error)
11. [Pengujian dengan Postman, Swagger, dan Jest](#11-pengujian-dengan-postman-swagger-dan-jest)
12. [Keamanan dan Deployment](#12-keamanan-dan-deployment)
13. [Bukti Penggunaan](#13-bukti-penggunaan)
14. [Pemecahan Masalah](#14-pemecahan-masalah)
15. [Ringkasan Perintah](#15-ringkasan-perintah)
16. [Referensi Proyek](#16-referensi-proyek)

## 1. Tentang Proyek

Todo List Management API adalah REST API untuk mengelola akun pengguna, kategori, todo, dan riwayat aktivitas. API dibangun dengan pola pemisahan route, controller, service, model, validator, middleware, dan utilitas. MongoDB menyimpan data, sedangkan Mongoose mengatur schema dan relasi antardokumen.

Pengguna mendaftar dan masuk menggunakan email serta password. Password disimpan dalam bentuk hash bcrypt. JWT melindungi endpoint pengguna. Role `user` hanya dapat mengakses data miliknya; role `admin` mendapat akses tambahan pada endpoint yang memang disediakan untuk admin. Endpoint statistik dan log publik memakai API Key.

## 2. Teknologi dan Persyaratan

| Komponen | Keterangan |
| --- | --- |
| Runtime | Node.js versi 22 atau lebih baru |
| Framework HTTP | Express.js 5 |
| Database | MongoDB lokal atau MongoDB Atlas |
| ODM | Mongoose |
| Autentikasi | JWT (`jsonwebtoken`) dan bcryptjs |
| Validasi | express-validator |
| Keamanan HTTP | Helmet, CORS, rate limiting |
| Dokumentasi API | Swagger UI |
| Pengujian | Jest dan Supertest |
| Klien uji manual | Postman |

Siapkan Node.js, npm, MongoDB yang dapat dijangkau aplikasi, serta Postman untuk mengikuti langkah manual. Swagger UI dapat dibuka lewat browser.

## 3. Struktur Folder dan Relasi Data

```text
src/
├── config/        # Konfigurasi environment, database, dan Swagger
├── controllers/   # Membentuk response HTTP dan memanggil service
├── middleware/    # Logger, autentikasi, API Key, dan error handler
├── models/        # Schema Mongoose User, Category, Todo, ActivityLog
├── routes/        # Route API versi 1
├── services/      # Aturan bisnis dan akses data
├── utils/         # AppError, asyncHandler, query, dan activity log
├── validators/    # Aturan input dan middleware validasi
├── app.js         # Menyatukan middleware, dokumentasi, dan route
└── server.js      # Memvalidasi konfigurasi, menghubungkan database, dan listen
scripts/           # Pembuatan admin dan data demo
tests/             # Automated smoke test
postman/           # Collection dan environment Postman
docs/              # Rencana API, panduan, dan bukti screenshot
```

Relasi utamanya: satu user memiliki banyak kategori dan todo. Todo boleh tanpa kategori; jika kategori dipilih, kategori itu harus aktif dan dimiliki user yang sama. ActivityLog menyimpan aktor, jenis aksi, ID todo, waktu, daftar field yang berubah, dan snapshot field todo yang aman ketika aksi terjadi. Dokumen menggunakan audit field `created_by`, `updated_by`, waktu pembuatan/perubahan, serta `archived`.

## 4. Instalasi dan Konfigurasi

Buka PowerShell di direktori proyek, lalu jalankan:

```powershell
npm.cmd install
Copy-Item .env.example .env
```

Buka `.env` lokal dan isi MongoDB URI serta secret. `.env` berisi kredensial dan tidak boleh diunggah ke GitHub. Gunakan secret yang berbeda untuk JWT dan API Key.

| Variabel | Wajib | Kegunaan |
| --- | --- | --- |
| `NODE_ENV` | Tidak | Mode aplikasi; default `development`. |
| `PORT` | Tidak | Port server; default `3000`. |
| `MONGODB_URI` | Ya | Connection string MongoDB. |
| `JWT_SECRET` | Ya | Secret acak minimal 32 karakter untuk JWT. |
| `JWT_EXPIRES_IN` | Tidak | Masa berlaku JWT; default `15m`. |
| `API_KEY` | Ya | Secret acak minimal 32 karakter untuk endpoint publik; jangan publikasikan nilainya. |
| `API_KEY_DEMO` | Tidak | Key demo publik terpisah untuk endpoint GET publik; jangan gunakan sebagai `API_KEY` production. |
| `BCRYPT_SALT_ROUNDS` | Tidak | Biaya hashing, angka 10 sampai 15; default `12`. |
| `CORS_ORIGINS` | Tidak | Daftar origin frontend dipisah koma; default `*`. |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Opsional | Dibutuhkan sementara untuk membuat admin. |
| `SEED_USER_EMAIL` | Opsional | Email user untuk membuat data demo. |

Konfigurasi diperiksa saat server mulai. Aplikasi berhenti dengan pesan yang menjelaskan variabel yang belum valid. Jangan menempelkan isi `.env`, password, JWT, atau API Key ke screenshot maupun dokumen yang dibagikan.

## 5. Menjalankan Aplikasi

```powershell
npm.cmd run dev
```

Server normalnya menampilkan bahwa API berjalan di port `3000`. Endpoint pemeriksaan:

| URL lokal | Fungsi |
| --- | --- |
| `http://localhost:3000/api/v1/health` | Status proses API. |
| `http://localhost:3000/api/v1/health/ready` | Memastikan koneksi database siap. |
| `http://localhost:3000/api-docs/` | Dokumentasi Swagger interaktif. |

`health` dapat menunjukkan status proses walaupun database belum siap. Untuk memastikan API siap melayani operasi data, periksa `health/ready`.

## 6. Autentikasi dan Hak Akses

### Registrasi

Kirim `POST /api/v1/auth/register` dengan Body → raw → JSON:

```json
{
  "name": "Nama Pengguna",
  "email": "user@example.com",
  "password": "contoh-password-aman"
}
```

Nama harus 2–100 karakter, email harus valid, dan password harus 8–72 karakter. Registrasi selalu membuat role `user`; request dengan field role ditolak.

### Login

Kirim `POST /api/v1/auth/login` dengan email dan password yang telah didaftarkan. Response sukses berisi data user dan `accessToken`. Di Postman, gunakan tab **Authorization → Bearer Token** lalu masukkan token. Untuk endpoint lain, header yang dikirim berbentuk:

```text
Authorization: Bearer <accessToken>
```

Token memiliki masa berlaku dari `JWT_EXPIRES_IN`. Jika kedaluwarsa, login kembali untuk memperoleh token baru. Jangan menaruh token asli dalam Manual Book.

### Hak akses

| Role | Hak akses utama |
| --- | --- |
| `user` | Mengelola profil sendiri, kategori sendiri, dan todo sendiri; melihat activity log miliknya. |
| `admin` | Memakai endpoint admin, termasuk daftar semua user dan akses lintas pengguna yang diizinkan service. |
| Machine-to-machine | Mengakses endpoint publik tertentu dengan header API Key. |

Untuk membuat admin secara lokal, isi sementara `ADMIN_NAME`, `ADMIN_EMAIL`, dan `ADMIN_PASSWORD` pada `.env`, lalu jalankan `npm.cmd run seed:admin`. Script membuat akun admin baru dan tidak mengubah role akun yang sudah ada. Setelah selesai, hapus nilai admin dari `.env`.

## 7. Penggunaan Endpoint

Semua path API di bawah menggunakan prefix `/api/v1`. `:id` berarti ObjectId MongoDB yang valid.

| Method | Endpoint | Hak akses | Kegunaan |
| --- | --- | --- | --- |
| GET | `/health` | Publik | Status proses. |
| GET | `/health/ready` | Publik | Status kesiapan database. |
| POST | `/auth/register` | Publik | Registrasi user. |
| POST | `/auth/login` | Publik | Login dan memperoleh JWT. |
| GET | `/auth/me` | JWT | Profil user aktif. |
| GET | `/users` | Admin | Daftar user, pencarian, dan pagination. |
| GET, PATCH | `/users/:id` | Pemilik/admin | Membaca atau memperbarui profil. Perubahan role hanya admin. |
| GET, POST | `/categories` | JWT | Daftar kategori atau membuat kategori. |
| GET, PATCH, DELETE | `/categories/:id` | JWT | Membaca, mengubah, atau mengarsipkan kategori milik akun. |
| GET, POST | `/todos` | JWT | Daftar todo atau membuat todo. |
| GET, PATCH, DELETE | `/todos/:id` | JWT | Membaca, mengubah, atau mengarsipkan todo milik akun. |
| GET | `/activity-logs` | JWT | Activity log akun; admin dapat melihat seluruh log. |
| GET | `/public/stats` | API Key | Statistik user, todo, kategori, dan aktivitas. |
| GET | `/public/activity-logs` | API Key | Log aktivitas publik yang telah disanitasi. |

### Membuat kategori

Kirim `POST /api/v1/categories` dengan Bearer Token:

```json
{
  "name": "Belajar",
  "description": "Tugas dan target belajar",
  "color": "#3366FF"
}
```

Simpan ID kategori dari response; ID tersebut dibutuhkan saat membuat todo.

### Membuat todo

Kirim `POST /api/v1/todos`. Kategori boleh tidak disertakan. Jika kategori disertakan, kategori harus aktif dan dimiliki user yang sedang login.

```json
{
  "title": "Menyelesaikan dokumentasi API",
  "description": "Menulis petunjuk penggunaan endpoint",
  "completed": false,
  "priority": "medium",
  "due_date": "2026-11-15T00:00:00.000Z",
  "category": "<ID_KATEGORI>"
}
```

`title` wajib, maksimal 120 karakter. `priority` dapat berupa `low`, `medium`, atau `high`. `due_date` memakai format tanggal ISO 8601. Field `description`, `completed`, `priority`, `due_date`, dan `category` bersifat opsional. Untuk menghapus kategori dari todo, kirim `"category": null` melalui `PATCH`.

### Memperbarui dan mengarsipkan

Gunakan `PATCH /api/v1/todos/:id` dengan satu atau beberapa field yang ingin diubah. `PATCH /api/v1/categories/:id` bekerja serupa. `DELETE` mengarsipkan data secara lunak dengan `archived: true`, sehingga data tidak muncul pada daftar aktif dan catatan audit tetap tersimpan.

## 8. Filter, Pencarian, Pengurutan, dan Pagination

Contoh mengambil halaman pertama, 20 item, mencari kata `API`, hanya todo belum selesai, dan mengurutkan terbaru:

```text
GET /api/v1/todos?page=1&limit=20&search=API&completed=false&sortBy=created_at&order=desc
```

Query todo yang tersedia: `page`, `limit`, `sortBy`, `order`, `search`, `completed`, dan `category`. `limit` maksimum 100. Sorting menerima `title`, `priority`, `due_date`, `completed`, `created_at`, atau `updated_at`. Category list mendukung `page`, `limit`, `sortBy`, `order`, dan `search`.

List response memiliki `items` dan metadata `pagination`, misalnya:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "totalItems": 0,
      "currentPage": 1,
      "pageSize": 20,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

## 9. Activity Log dan API Key

Pembuatan, perubahan, dan pengarsipan todo mencatat aksi `TODO_CREATED`, `TODO_UPDATED`, dan `TODO_ARCHIVED`. Setiap log baru menyimpan snapshot `title`, `description`, `completed`, `priority`, `due_date`, dan ID kategori saat aksi terjadi; snapshot arsip tetap mempertahankan judul setelah todo diarsipkan. Log yang dibuat sebelum perubahan ini tidak memiliki snapshot. `GET /api/v1/activity-logs` menampilkan log sesuai hak akses. Query yang tersedia mencakup pagination dan filter `action`.

Statistik tersedia melalui `GET /api/v1/public/stats`. Log publik tersedia melalui `GET /api/v1/public/activity-logs`; response publik hanya memuat informasi aman seperti action, entity, dan waktu aktivitas. Sertakan header:

```text
x-api-key: <API_KEY_ATAU_API_KEY_DEMO>
```

Endpoint publik membatasi request dan menerima `API_KEY` atau `API_KEY_DEMO` yang dikonfigurasi server. API key yang hilang menghasilkan 401, key salah 403, dan konfigurasi key server yang kosong menghasilkan 503. Gunakan hanya key demo publik yang tercantum di README saat melakukan verifikasi eksternal; jangan pernah mempublikasikan `API_KEY` production.

## 10. Validasi dan Penanganan Error

Input diperiksa oleh validator sebelum controller memprosesnya. Error diteruskan melalui `AppError` dan `asyncHandler`, lalu diformat oleh error handler global. Bentuk umumnya:

```json
{
  "success": false,
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "Data request tidak valid.",
    "details": [
      { "field": "name", "message": "Nama harus berisi 2 sampai 100 karakter." }
    ]
  }
}
```

| HTTP | Contoh pemakaian |
| --- | --- |
| 200 | Membaca atau memperbarui data berhasil. |
| 201 | User, kategori, atau todo berhasil dibuat. |
| 400 | JSON rusak, field tidak valid, atau format ID salah. |
| 401 | Token/API Key tidak disertakan atau token tidak valid/kedaluwarsa. |
| 403 | Role/akun tidak memiliki izin atau API Key salah. |
| 404 | Route atau resource yang diminta tidak ditemukan/di luar cakupan user. |
| 409 | Nilai unik seperti email telah digunakan. |
| 413 | Body request melebihi ukuran maksimum. |
| 422 | Data gagal validasi schema Mongoose. |
| 429 | Batas percobaan autentikasi atau endpoint publik tercapai. |
| 500 | Terjadi kesalahan tak terduga pada server. |
| 503 | Database atau konfigurasi server belum tersedia. |

## 11. Pengujian dengan Postman, Swagger, dan Jest

### Postman

1. Import `postman/Todo List Management API.postman_collection.json`.
2. Pilih environment `Todo API - Local`; pastikan `baseUrl` mengarah ke `http://localhost:3000`.
3. Jalankan request health untuk mengecek server dan MongoDB.
4. Register user uji, lalu login. Masukkan token di Bearer Token atau variable collection yang disediakan.
5. Buat kategori, salin ID kategori, lalu gunakan ID itu di body pembuatan todo.
6. Coba list/filter, detail, update, dan activity log. Simpan request archive untuk langkah terakhir karena data yang diarsipkan tidak lagi muncul di daftar aktif.
7. Isi API Key melalui variable Postman untuk mencoba endpoint statistik dan log publik.

Jangan melakukan Share atau Publish collection dengan token, password, API Key, atau credential asli.

### Swagger

Buka `http://localhost:3000/api-docs/`, pilih endpoint, lalu gunakan **Try it out**. Untuk endpoint JWT, klik **Authorize** dan masukkan token sesuai instruksi Swagger. Untuk endpoint publik, kirim API Key melalui skema/header yang didokumentasikan.

### Automated test

Jalankan di terminal:

```powershell
npm.cmd test
npm.cmd run test:coverage
```

Jest menjalankan smoke test API dan Supertest mengirim request ke aplikasi Express. Sebelum mencatat hasil pada Manual Book, jalankan test pada kondisi proyek saat ini dan masukkan hanya hasil yang benar-benar tampil di terminal.

**Hasil terakhir yang diverifikasi pada 28 Oktober 2026:** `npm.cmd test` lulus, 1 test suite dan 7 test. Ini adalah smoke test API, bukan klaim bahwa semua alur database sudah diuji integrasi.

## 12. Keamanan dan Deployment

- `.env`, password, token JWT, API Key, dan URI MongoDB berisi password tidak boleh masuk repository.
- Gunakan secret acak berbeda untuk `JWT_SECRET` dan `API_KEY`; jangan gunakan nilai contoh.
- Password user di-hash menggunakan bcrypt dan tidak dipilih pada query biasa.
- Registrasi publik tidak menerima role dari client.
- Akses todo/kategori dibatasi ke pemiliknya; relasi category todo juga harus dimiliki user yang sama.
- CORS sebaiknya dibatasi pada origin frontend yang dipakai.
- Jalankan admin seed hanya untuk membuat akun admin, lalu bersihkan credential sementara dari `.env`.

Untuk deployment Vercel, ikuti [panduan deployment proyek](DEPLOYMENT_VERCEL.md). Atur MongoDB Atlas dan environment variables dari pengaturan hosting, bukan dari file `.env` yang diunggah. Uji endpoint kesehatan, Swagger, autentikasi, CRUD, serta endpoint API Key pada URL deployment sebelum menyatakan deployment berhasil.

## 13. Bukti Penggunaan

Tambahkan screenshot asli yang telah disimpan di folder bukti tahap proyek. Letakkan gambar setelah keterangan terkait; jangan menampilkan nilai rahasia.

| Bagian manual | Screenshot yang dapat disisipkan |
| --- | --- |
| Server dan dokumentasi | Postman/Swagger menunjukkan health atau readiness berhasil dan halaman `/api-docs`. |
| Autentikasi | Register/login berhasil. Tutupi token, email pribadi, dan data sensitif. |
| Kategori dan todo | Create/list/update berhasil; tutupi data pribadi bila terlihat. |
| Filter dan pagination | Request query dan response yang menunjukkan hasil serta metadata pagination. |
| Activity log dan API Key | Log aktivitas atau statistik berhasil; jangan tampilkan nilai API Key. |
| Otomatisasi test | Output terminal setelah semua test yang relevan selesai. |
| GitHub | Halaman repository dengan README tampil. Jangan tampilkan secret di file atau terminal. |

Tempatkan caption singkat di bawah setiap gambar, contohnya: **Gambar 1. Pemeriksaan kesiapan database melalui Postman.** Screenshot bukti checklist disimpan terpisah di folder Drive tahap masing-masing sesuai `docs/SCREENSHOT_EVIDENCE.md`.

## 14. Pemecahan Masalah

| Gejala | Pemeriksaan |
| --- | --- |
| Server gagal `bad auth` MongoDB | Periksa username/password database Atlas, encoding karakter khusus pada URI, nama database, dan `authSource` jika diperlukan. Jangan kirim URI ke chat atau screenshot. |
| `health/ready` gagal | Pastikan MongoDB berjalan, IP/akses Atlas mengizinkan koneksi, dan `MONGODB_URI` benar. |
| 401 di endpoint Todo/Category | Login ulang, salin `accessToken` terbaru, lalu pastikan Postman memakai Bearer Token. |
| 403 pada endpoint admin | Pastikan login menggunakan akun dengan role admin; registrasi biasa selalu role user. |
| 404 ketika membuat todo | Pastikan ID kategori valid, aktif, dan dibuat oleh user yang sama. ID category berbeda dari ID todo. |
| Daftar todo kosong | Periksa apakah todo dibuat oleh akun yang sama, category/filter yang dikirim, dan apakah item telah diarsipkan. |
| 503 API Key belum dikonfigurasi | Pastikan `API_KEY` ada di `.env`, berisi secret valid, lalu restart server. |
| 404 endpoint tidak dikenal | Cek prefix `/api/v1` dan nama/HTTP method endpoint pada tabel atau Swagger. |

## 15. Ringkasan Perintah

```powershell
npm.cmd install             # memasang dependency
npm.cmd run dev             # menjalankan mode development
npm.cmd start               # menjalankan server biasa
npm.cmd test                # menjalankan automated test
npm.cmd run test:coverage   # menjalankan test dengan coverage
npm.cmd run seed:admin      # membuat akun admin dari variabel sementara
npm.cmd run seed:demo       # membuat contoh data untuk satu user
```

Alamat penting: API lokal `http://localhost:3000/api/v1`, dokumentasi `http://localhost:3000/api-docs/`, collection Postman `postman/Todo List Management API.postman_collection.json`.

## 16. Referensi Proyek

- [README proyek](../README.md) - gambaran singkat, setup, dan script.
- [Rancangan API](API_PLAN.md) - resource, endpoint, dan keputusan rancangan.
- [Panduan Postman](POSTMAN.md) - penggunaan collection dan environment.
- [Panduan Atlas](ATLAS_SETUP.md) - konfigurasi database MongoDB Atlas.
- [Panduan Vercel](DEPLOYMENT_VERCEL.md) - catatan deployment.
- [Checklist bukti screenshot](SCREENSHOT_EVIDENCE.md) - daftar bukti untuk tiap tahap.
- Dokumentasi interaktif lokal: `http://localhost:3000/api-docs/`.

---

**Akhir Manual Book Teknis Todo List Management API**

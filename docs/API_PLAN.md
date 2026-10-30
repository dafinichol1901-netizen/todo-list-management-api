# API Todo List Management: Rancangan dan Status Implementasi

Dokumen ini mencatat rancangan dan kondisi implementasi API saat ini. Semua endpoint berada di bawah `/api/v1`. Route, validasi, service, model, dan dokumentasi Swagger sudah tersedia di source project.

## Model data

Semua dokumen MongoDB memiliki `created_by`, `updated_by`, `created_at`, `updated_at`, dan `archived`.

| Model | Data utama | Relasi dan aturan |
| --- | --- | --- |
| User | `name`, `email`, `password`, `role` | Password selalu disimpan sebagai hash; registrasi publik hanya membuat role `user`. |
| Category | `name`, `description`, `color`, `user` | Kategori dimiliki user; nama unik per user selama belum diarsipkan. |
| Todo | `title`, `description`, `completed`, `priority`, `due_date`, `user`, `category` | Kategori opsional; jika dipilih harus aktif dan dimiliki user yang sama. Pemilik biasa hanya mengakses todo miliknya. |
| ActivityLog | `actor`, `action`, `entity`, `entity_id`, `metadata`, `snapshot` | Mencatat field yang berubah dan snapshot field todo yang aman saat aksi dibuat, diubah, atau diarsipkan; tanpa password atau secret. |

Penghapusan todo dan kategori menggunakan arsip melalui `archived: true`. Daftar biasa hanya menampilkan dokumen yang belum diarsipkan.

## Endpoint yang tersedia

| Method | Endpoint | Akses |
| --- | --- | --- |
| GET | `/health` | Publik; liveness. |
| GET | `/health/ready` | Publik; readiness database. |
| POST | `/auth/register` | Publik; role selalu `user`. |
| POST | `/auth/login` | Publik; menghasilkan access token JWT. |
| GET | `/auth/me` | JWT. |
| GET | `/users` | Admin. |
| GET, PATCH | `/users/:id` | Pemilik akun atau admin; perubahan role khusus admin. |
| GET, POST | `/categories` | JWT; user mengakses kategori sendiri, admin dapat melihat seluruh kategori. |
| GET, PATCH, DELETE | `/categories/:id` | JWT; akses mengikuti pemilik atau hak admin. |
| GET, POST | `/todos` | JWT; user mengakses todo sendiri, admin dapat melihat seluruh todo. |
| GET, PATCH, DELETE | `/todos/:id` | JWT; akses mengikuti pemilik atau hak admin. |
| GET | `/activity-logs` | JWT; user melihat log sendiri, admin dapat melihat seluruh log. |
| GET | `/public/stats` | API Key melalui header `x-api-key`. |
| GET | `/public/activity-logs` | API Key; hanya data aktivitas yang disanitasi. |

## Query daftar todo

`GET /todos` mendukung `page`, `limit`, `sortBy`, `order`, `search`, `completed`, dan `category`. Default halaman adalah 1 dengan 20 item; `limit` maksimum 100. Sorting divalidasi terhadap field `title`, `priority`, `due_date`, `completed`, `created_at`, dan `updated_at`.

## Bentuk respons

Respons sukses menggunakan `{ "success": true, "data": ... }`. Respons gagal menggunakan `{ "success": false, "error": { "code": ..., "message": ..., "details": ... } }` dengan HTTP status yang sesuai konteks.

## Keputusan implementasi

- User biasa hanya dapat membuat, membaca, memperbarui, dan mengarsipkan resource miliknya sendiri. Akses admin lintas pengguna diterapkan pada endpoint dan service yang mendukungnya.
- API Key tidak menggantikan JWT dan hanya melindungi endpoint machine-to-machine. `API_KEY_DEMO` opsional merupakan key publik terpisah untuk endpoint GET publik yang dibatasi rate limit.
- Snapshot activity log hanya menyimpan `title`, `description`, `completed`, `priority`, `due_date`, dan ID kategori; data historis sebelum fitur snapshot ditambahkan tidak otomatis memiliki snapshot.
- Password, token, API Key, dan nilai environment tidak dikembalikan di respons atau activity log.
- Validasi request memakai `express-validator`; model juga menerapkan validasi Mongoose. Respons sukses dan error menggunakan bentuk JSON konsisten.
- Swagger tersedia pada `/api-docs`; dokumentasi ini mengikuti route dan validator yang ada di source saat diperbarui.

# Rencana API Todo List Management

Dokumen ini menjadi peta awal implementasi dari Brief dan checklist Todos. Semua endpoint berada di bawah `/api/v1`.

## Model data

Semua dokumen MongoDB memiliki `created_by`, `updated_by`, `created_at`, `updated_at`, dan `archived`.

| Model | Data utama | Relasi dan aturan |
| --- | --- | --- |
| User | `name`, `email`, `password`, `role` | Password selalu disimpan sebagai hash; registrasi publik hanya membuat role `user`. |
| Category | `name`, `description`, `color`, `user` | Kategori dimiliki user; nama unik per user selama belum diarsipkan. |
| Todo | `title`, `description`, `completed`, `priority`, `due_date`, `user`, `category` | Terhubung ke pemilik dan kategori; pemilik biasa hanya mengakses todo miliknya. |
| ActivityLog | `actor`, `action`, `entity`, `entity_id`, `metadata` | Mencatat pembuatan, perubahan, dan pengarsipan todo tanpa menyimpan password atau secret. |

Penghapusan todo dan kategori menggunakan arsip melalui `archived: true`. Daftar biasa hanya menampilkan dokumen yang belum diarsipkan.

## Endpoint rencana

| Method | Endpoint | Akses |
| --- | --- | --- |
| GET | `/health` | Publik; liveness. |
| GET | `/health/ready` | Publik; readiness database. |
| POST | `/auth/register` | Publik; role selalu `user`. |
| POST | `/auth/login` | Publik; menghasilkan access token JWT. |
| GET | `/auth/me` | JWT. |
| GET | `/users` | Admin. |
| GET, PATCH | `/users/:id` | Pemilik akun atau admin; perubahan role khusus admin. |
| GET, POST | `/categories` | JWT; data dibatasi ke pemilik. |
| GET, PATCH, DELETE | `/categories/:id` | JWT; data dibatasi ke pemilik. |
| GET, POST | `/todos` | JWT; data dibatasi ke pemilik. |
| GET, PATCH, DELETE | `/todos/:id` | JWT; data dibatasi ke pemilik. |
| GET | `/activity-logs` | JWT; log milik sendiri, admin dapat melihat seluruh log. |
| GET | `/public/stats` | API Key melalui header `x-api-key`. |
| GET | `/public/activity-logs` | API Key; hanya data aktivitas yang disanitasi. |

## Query daftar todo

`GET /todos` mendukung `page`, `limit`, `sortBy`, `order`, `search`, `completed`, dan `category`. Server membatasi ukuran halaman dan hanya menerima nama field sorting yang diizinkan.

## Bentuk respons

Respons sukses menggunakan `{ "success": true, "data": ... }`. Respons gagal menggunakan `{ "success": false, "error": { "code": ..., "message": ..., "details": ... } }` dengan HTTP status yang sesuai konteks.

## Keputusan implementasi

- User biasa hanya dapat membuat, membaca, memperbarui, dan mengarsipkan resource miliknya sendiri.
- API Key tidak menggantikan JWT dan hanya melindungi endpoint machine-to-machine.
- Password, token, API Key, dan nilai environment tidak dikembalikan di respons atau activity log.
- Detail response, batas pagination, dan role admin akan didokumentasikan lagi di Swagger setelah route selesai.

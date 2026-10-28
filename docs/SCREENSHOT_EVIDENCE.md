# Checklist bukti screenshot

Brief meminta screenshot bukti untuk setiap Todo. Ambil screenshot setelah fitur benar-benar selesai, gunakan folder Drive dengan nama persis seperti di bawah, dan sembunyikan password, JWT, API Key, serta nilai `.env`.

Pola nama file singkat: `PP_XX-deskripsi.png` untuk Pre-Production, `PS1_XX-deskripsi.png` untuk Production Stage 1, `PS2_XX-deskripsi.png` untuk Production Stage 2, dan `POST_XX-deskripsi.png` untuk Post-Production. Contoh bukti pertama: `PP_01-setup-nodejs-dan-library.png`.

## Pre-Production

Folder Drive: `Pre-Production`

| Todo | Bukti yang disarankan |
| --- | --- |
| Setup Node.js dan library | Terminal berisi versi Node.js/npm serta `package.json` yang menampilkan dependensi proyek. |
| Konfigurasi MongoDB dan `.env` | Editor menampilkan `.env.example` dan konfigurasi koneksi; jangan tampilkan `.env` asli atau URI berisi password. |
| Uji koneksi database | Postman/Swagger menampilkan `GET /api/v1/health/ready` dengan status 200. Nama file: `PP_03-koneksi-atlas-berhasil.png`. |
| Tentukan struktur dokumen dan field | `docs/API_PLAN.md` beserta daftar field model. |
| Rancang schema dan relasi | File User, Category, Todo, ActivityLog yang memperlihatkan relasi user/category. |
| Rancang endpoint dan hak akses | Tabel endpoint di `docs/API_PLAN.md` atau Swagger UI. |
| Buat struktur folder | Tampilan Explorer/VS Code yang memperlihatkan struktur `src/`. |
| Upload bukti tahap | Isi folder Drive `Pre-Production` yang menampilkan file bukti. |
| Pelajari tutorial pada Brief | Halaman atau catatan tutorial yang selesai dipelajari; satu screenshot ringkasan boleh memuat daftar artikel. |

## Production Stage 1 Functional API

Folder Drive: `Production stage 1`

| Todo | Bukti yang disarankan |
| --- | --- |
| Middleware logger, notFound, error handler | Kode middleware dan satu contoh request 404/log request. |
| AppError dan async handler | File helper error serta contoh response error konsisten. |
| Hash password otomatis | Registrasi berhasil dan dokumen user menunjukkan password tersimpan sebagai hash; sembunyikan email jika perlu. |
| Model Todo dan Category | Schema dengan field audit serta relasi user/category. |
| Register, login, dan JWT | Response register/login dengan status benar; tutupi token penuh. |
| Middleware autentikasi | Request tanpa token menghasilkan 401 dan request ber-token berhasil; tutupi token. |
| Middleware role | User biasa ditolak pada endpoint admin, admin dapat mengaksesnya; jangan tampilkan token. |
| CRUD Todo dan kepemilikan | Postman menampilkan create/list/update/archive; tambahkan bukti akun lain tidak dapat mengakses todo tersebut. |
| CRUD Category | Postman menampilkan create/list/get/update/archive kategori. |
| Upload bukti tahap | Isi folder Drive `Production_Stage_1`. |

## Production Stage 2 API Features and Quality

Folder Drive: `Production stage 2`

| Todo | Bukti yang disarankan |
| --- | --- |
| Uji semua endpoint secara manual | Postman collection dan response tiap kelompok endpoint. Jalankan archive/delete paling akhir. |
| Filtering, search, sorting, pagination | Request query dan response yang menunjukkan hasil serta metadata pagination. |
| Response error dan HTTP status | Satu contoh input tidak valid (400/422), tanpa autentikasi (401), forbidden (403), dan resource tidak ada (404). |
| Validasi express-validator | Validator dan response detail field yang gagal. |
| Pagination pada list todo | Response `currentPage`, `pageSize`, `totalPages`, dan `totalItems`. |
| Filtering status/kategori | Query `completed` atau `category` dan hasil yang sesuai. |
| Sorting dan pencarian | Request `sortBy`, `order`, `search` beserta hasil terurut/terfilter. |
| Activity log | Buat, ubah, dan arsipkan todo; tampilkan log yang terbentuk. |
| Endpoint statistik dengan API Key | Response sukses dan contoh tanpa API Key; tutupi nilai key pada screenshot. |
| Automated test Jest/Supertest | Ringkasan terminal yang menunjukkan seluruh test lulus. |
| Dokumentasi Swagger | Swagger UI `/api-docs` dengan endpoint dapat diekspansi dan dicoba. |
| Upload bukti tahap | Isi folder Drive `Production_Stage_2`. |

## Post-Production

Folder Drive: `Post-Production`

| Todo | Bukti yang disarankan |
| --- | --- |
| Review `.env` dan `node_modules` | `.gitignore` serta `git status` yang menunjukkan secret/dependensi tidak akan di-commit; jangan tampilkan isi `.env`. |
| README lengkap | README lokal atau tampilan README di halaman utama GitHub. |
| Manual Book | PDF Manual Book yang sudah final dan siap diunggah. |
| Buat repository dan push ke GitHub | Halaman repository berisi source project yang sudah di-push. |
| Pastikan README tampil di beranda | Halaman utama repository yang menampilkan README dengan benar. |
| Upload Manual Book dan link GitHub | Folder Drive `Post-Production` berisi PDF dan catatan/link repository. |

Unggah screenshot asli setelah setiap checklist selesai. Jangan menyimpan token, password, API Key, atau secret environment yang terbaca di gambar.

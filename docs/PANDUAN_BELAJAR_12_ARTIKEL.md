# Panduan Belajar 12 Artikel Backend API

Panduan ini membantu Dafi mempelajari 12 artikel referensi secara bertahap dan menghubungkan materinya dengan proyek **Backend API Todo List Management**.

> **Cara memakai panduan:** baca PDF artikel aslinya terlebih dahulu, lalu gunakan catatan di bawah untuk mengingat konsep dan mengecek pemahaman. Ringkasan ini disusun dari judul artikel dan brief proyek; untuk detail atau contoh spesifik, ikuti isi PDF.

## Progres belajar

Status berikut adalah progres belajar pribadi yang terakhir dicatat, bukan status implementasi fitur. Perbarui setelah Dafi selesai membaca dan memahami artikel terkait.

- [x] Artikel 1 — sudah dirangkum Dafi.
- [ ] Artikel 2 — sedang dipelajari.
- [ ] Artikel 3
- [ ] Artikel 4
- [ ] Artikel 5
- [ ] Artikel 6
- [ ] Artikel 7
- [ ] Artikel 8
- [ ] Artikel 9
- [ ] Artikel 10
- [ ] Artikel 11
- [ ] Artikel 12

Ubah tanda `[ ]` menjadi `[x]` setelah selesai membaca dan bisa menjelaskan kembali inti materinya dengan kata-kata sendiri.

---

## 1. Restrukturisasi CRUD Node.js ke Controller-Service-Model

**Artikel:** *Cara Restrukturisasi CRUD Node.js: Dari Function ke Folder Controller-Service-Model*

### Inti materi

Pisahkan tanggung jawab aplikasi agar setiap bagian mudah ditemukan dan dirawat:

- **Route** memasangkan URL dan HTTP method dengan middleware serta controller.
- **Controller** membaca request dan menentukan response HTTP.
- **Service** menjalankan aturan atau proses bisnis.
- **Model** mendefinisikan bentuk data dan berinteraksi dengan MongoDB.

### Penerapan pada proyek

Endpoint Todo sebaiknya tidak menumpuk seluruh query database, validasi, dan response dalam satu file. Route meneruskan request ke controller; controller memanggil service; service menggunakan model `Todo`.

### Cek pemahaman

1. Jika aturan kepemilikan Todo berubah, bagian mana yang paling tepat untuk diperiksa?
2. Mengapa query MongoDB sebaiknya tidak ditulis berulang di semua route?

**Progres:** [x] Sudah dirangkum Dafi.

---

## 2. Middleware dan `.env` di Express.js

**Artikel:** *Middleware dan .env di Express.js: Cara Bikin API Lebih Aman dan Rapi*

### Inti materi

Middleware memproses request dalam urutan tertentu. Middleware dapat membaca `req`, mengirim response melalui `res`, meneruskan proses dengan `next()`, atau meneruskan error dengan `next(error)`. File `.env` menyimpan konfigurasi lokal dan rahasia di luar source code.

### Penerapan pada proyek

Autentikasi, validasi, API Key, pencatatan request, dan penanganan error adalah contoh pekerjaan middleware. Nilai seperti URI MongoDB, JWT secret, dan API key dibaca dari environment. `.env` tidak boleh masuk GitHub; `.env.example` hanya berisi nama variabel dan contoh aman.

Catatan proyek yang lebih lengkap tersedia di [TUTORIAL_02_MIDDLEWARE_DAN_ENV.md](TUTORIAL_02_MIDDLEWARE_DAN_ENV.md).

### Cek pemahaman

1. Apa yang terjadi jika middleware lupa memanggil `next()` dan tidak mengirim response?
2. Mengapa `.env.example` boleh diunggah, sedangkan `.env` tidak?

**Progres:** [ ] Sedang dipelajari (status terakhir yang dicatat).

---

## 3. Error Handling dan HTTP Status Code

**Artikel:** *Cara Menangani Error dan HTTP Status Code yang Benar di Express.js*

### Inti materi

API perlu mengembalikan status HTTP yang sesuai dan format error yang konsisten. Contoh umum: `400` untuk input tidak valid, `401` untuk belum terautentikasi, `403` untuk tidak punya izin, `404` untuk data tidak ditemukan, `409` untuk konflik, dan `500` untuk kesalahan server yang tidak terduga.

### Penerapan pada proyek

Kesalahan di controller atau service diteruskan ke error handler pusat. Response tidak boleh membocorkan stack trace atau secret kepada pengguna. Pesan teknis lengkap dicatat di log server.

### Cek pemahaman

1. Apa beda `401 Unauthorized` dengan `403 Forbidden`?
2. Status apa yang cocok saat email yang didaftarkan sudah digunakan?

**Progres:** [ ] Belum dimulai.

---

## 4. Autentikasi JWT dan Role-Based Access

**Artikel:** *Panduan Autentikasi JWT dan Role-Based Access di Node.js*

### Inti materi

Autentikasi memeriksa identitas pengguna; otorisasi memeriksa tindakan yang boleh dilakukan. Password disimpan dalam bentuk hash, lalu login yang berhasil memperoleh JWT dengan masa berlaku. Middleware memverifikasi token sebelum route privat dijalankan. Pemeriksaan role membatasi tindakan berdasarkan peran.

### Penerapan pada proyek

Route privat Todo memerlukan token JWT. Role admin dan user dapat memiliki izin berbeda. Selain role, setiap Todo tetap harus diperiksa kepemilikannya agar user tidak membaca atau mengubah Todo milik orang lain.

### Cek pemahaman

1. Mengapa password tidak boleh disimpan apa adanya?
2. Apakah role `user` saja cukup untuk membuktikan bahwa suatu Todo milik pengguna itu?

**Progres:** [ ] Belum dimulai.

---

## 5. Proteksi Endpoint dengan API Key

**Artikel:** *Cara Melindungi API dengan API Key: Proteksi Endpoint dari Akses Tidak Dikenal*

### Inti materi

API Key dapat membatasi akses sistem eksternal ke endpoint machine-to-machine. Key dikirim melalui header, dibandingkan dengan nilai rahasia di environment, dan tidak ditaruh di URL atau source code publik.

### Penerapan pada proyek

Endpoint statistik atau ringkasan publik yang ditentukan brief dapat memakai header `x-api-key`. Jika key hilang atau salah, request ditolak. Rate limiting dapat menjadi lapisan tambahan untuk mengurangi akses berlebihan.

### Cek pemahaman

1. Mengapa API Key lebih aman dikirim melalui header daripada query URL?
2. Apakah API Key menggantikan autentikasi JWT untuk semua pengguna?

**Progres:** [ ] Belum dimulai.

---

## 6. Validasi Input, Filtering, Search, Sorting, dan Pagination

**Artikel:** *Validasi Input dan Pagination API: Best Practice REST API di Express*

### Inti materi

Validasi memastikan parameter, body, dan query sesuai aturan sebelum diproses. Filtering, pencarian, pengurutan, dan pagination membantu client mengambil daftar data secara terarah dan dalam ukuran yang wajar.

### Penerapan pada proyek

Endpoint daftar Todo dapat menerima parameter seperti `page`, `limit`, `search`, `completed`, `category`, `sortBy`, dan `order`. Batasi nilai `limit` dan izinkan field pengurutan hanya dari daftar yang ditentukan agar query tetap aman dan terprediksi. Input tidak valid menghasilkan response yang jelas.

### Cek pemahaman

1. Mengapa nilai `sortBy` perlu dibatasi ke field yang diizinkan?
2. Apa manfaat pagination dibanding mengirim seluruh Todo sekaligus?

**Progres:** [ ] Belum dimulai.

---

## 7. Automated Testing dengan Jest dan Supertest

**Artikel:** *Automated Testing API Node.js dengan Jest dan Supertest*

### Inti materi

Jest menjalankan dan mengatur pengujian; Supertest mengirim request ke aplikasi Express untuk memeriksa status dan isi response. Tes dapat mencakup fungsi kecil maupun alur API yang melibatkan beberapa bagian sistem.

### Penerapan pada proyek

Uji skenario berhasil dan gagal untuk register/login, akses Todo, validasi, role, kepemilikan, API Key, dan status HTTP. Data tes perlu diisolasi agar tidak mengubah database produksi atau data pribadi.

### Cek pemahaman

1. Apa perbedaan unit test dan integration test?
2. Skenario apa yang membuktikan user tidak dapat mengubah Todo milik user lain?

**Progres:** [ ] Belum dimulai.

---

## 8. Pengujian dan Dokumentasi API dengan Postman dan Swagger

**Artikel:** *Testing dan Dokumentasi API dengan Postman dan Swagger untuk Pemula*

### Inti materi

Postman membantu mengirim request secara manual, menyimpan collection, dan mengatur environment seperti base URL atau token. Swagger/OpenAPI mendeskripsikan endpoint, parameter, skema request, dan response dalam dokumentasi interaktif.

### Penerapan pada proyek

Gunakan Postman untuk mencoba alur API dan menyimpan request yang dapat diulang. Gunakan Swagger untuk melihat kontrak endpoint serta mengirim request dari halaman dokumentasi. Jangan menyimpan token atau secret pribadi dalam collection yang akan dibagikan.

### Cek pemahaman

1. Bagaimana cara menguji endpoint privat setelah login di Postman?
2. Mengapa dokumentasi perlu mencantumkan kemungkinan response error?

**Progres:** [ ] Belum dimulai.

---

## 9. Struktur Project Node.js Siap Produksi

**Artikel:** *Struktur Project Node.js Siap Produksi: Boilerplate Backend dari Nol*

### Inti materi

Struktur project yang konsisten memisahkan konfigurasi, route, controller, service, model, middleware, validator, dan utilitas. Struktur harus membantu orang lain menemukan kode, bukan menambah folder tanpa tujuan.

### Penerapan pada proyek

Bandingkan struktur referensi dengan folder `src/` proyek. Pastikan setiap modul punya tanggung jawab jelas, konfigurasi tidak tersebar, dan entry point server mudah dikenali.

### Cek pemahaman

1. Di folder mana aturan validasi request sebaiknya diletakkan?
2. Bagaimana struktur folder membantu proses debugging dan penambahan fitur?

**Progres:** [ ] Belum dimulai.

---

## 10. Menulis README.md yang Profesional

**Artikel:** *Cara Menulis README.md yang Profesional untuk Project Backend Node.js*

### Inti materi

README menjelaskan tujuan project dan membantu orang lain menjalankannya. README backend umumnya berisi fitur, teknologi, prasyarat, instalasi, konfigurasi environment, perintah menjalankan aplikasi, cara menguji, dokumentasi API, dan informasi seed jika tersedia.

### Penerapan pada proyek

Berikan contoh `.env.example` tanpa nilai rahasia. Tulis langkah yang benar-benar cocok dengan project ini dan pastikan nama script serta URL dokumentasi sesuai implementasi.

### Cek pemahaman

1. Informasi minimum apa yang dibutuhkan orang lain untuk menjalankan API?
2. Bagaimana menjelaskan konfigurasi environment tanpa membocorkan kredensial?

**Progres:** [ ] Belum dimulai.

---

## 11. Push Project Node.js ke GitHub

**Artikel:** *Panduan Push Project Node.js ke GitHub: Git Init Sampai Repository Online*

### Inti materi

Git mencatat perubahan project; GitHub menyimpan repository jarak jauh. Sebelum push, periksa `.gitignore`, file yang akan di-commit, README, dan riwayat agar file rahasia atau `node_modules` tidak terunggah.

### Penerapan pada proyek

Saat masuk Post-Production, buat repository, commit project, hubungkan remote GitHub, lalu push. Pastikan `.env` diabaikan dan `.env.example` tidak memuat kredensial asli. Periksa halaman repository setelah push.

### Cek pemahaman

1. Apa fungsi `.gitignore`?
2. File mana yang tidak boleh masuk repository publik?

**Progres:** [ ] Belum dimulai.

---

## 12. Deployment Backend Node.js ke Vercel

**Artikel:** *Tutorial Deployment Proyek Backend Node.js ke Vercel*

### Inti materi

Deployment membuat API dapat diakses dari lingkungan hosting. Konfigurasi production seperti URI database, secret, API Key, dan CORS harus diatur pada environment hosting dengan nilai yang benar. Setelah deploy, periksa log dan coba endpoint dari URL production.

### Penerapan pada proyek

Pelajari langkah tutorial dan catat penyesuaian yang diperlukan untuk Express serta koneksi MongoDB Atlas. Deployment merupakan materi referensi; lakukan hanya jika diminta oleh checklist atau trainer. Jangan menaruh rahasia deployment di repository atau screenshot.

### Cek pemahaman

1. Mengapa aplikasi yang berjalan lokal belum tentu langsung berjalan di hosting?
2. Apa saja pemeriksaan yang perlu dilakukan setelah deployment?

**Progres:** [ ] Belum dimulai.

---

## Catatan belajar Dafi

Gunakan format singkat ini setelah membaca tiap artikel:

```text
Artikel nomor:
Hal baru yang kupahami:
Bagian yang masih membingungkan:
Contoh penerapannya di proyek:
```

Tidak perlu menghafal semua istilah. Targetnya adalah bisa menjelaskan fungsi konsep, menemukan bagian project yang terkait, dan memahami alasan penerapannya.

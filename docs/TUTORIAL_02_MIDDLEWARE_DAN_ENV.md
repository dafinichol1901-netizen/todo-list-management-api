# Ringkasan Tutorial: Middleware dan `.env` di Express.js

## Tujuan

Middleware membantu memproses request secara bertahap sebelum request mencapai endpoint dan sebelum response dikirim kembali. File `.env` menyimpan konfigurasi lokal atau rahasia agar tidak ditulis langsung di dalam source code.

## 1. Cara kerja middleware

Middleware Express umumnya menerima tiga parameter:

```js
function contohMiddleware(req, res, next) {
  // Proses request atau periksa kondisi tertentu.
  next();
}
```

- `req` berisi informasi request, seperti header, parameter URL, dan body.
- `res` digunakan untuk mengirim response. Middleware yang sudah mengirim response tidak perlu meneruskan request.
- `next()` meneruskan proses ke middleware atau handler berikutnya.
- `next(error)` meneruskan error ke middleware penanganan error.

Middleware sebaiknya memiliki satu tanggung jawab yang jelas. Contohnya: membaca JSON, mencatat request, memeriksa autentikasi, memvalidasi input, atau menangani error.

## 2. Urutan middleware

Urutan pemasangan middleware berpengaruh. Middleware umum biasanya dipasang sebelum route. Middleware khusus, seperti autentikasi atau validasi, dipasang pada route yang memerlukannya. Handler 404 dan error dipasang setelah route.

Contoh alur:

```text
Request
  -> parser dan middleware umum
  -> route
  -> autentikasi/validasi jika diperlukan
  -> controller
  -> response

Jika terjadi error:
  -> middleware penanganan error
  -> response error
```

## 3. Menyimpan konfigurasi di `.env`

Paket `dotenv` membaca pasangan nama dan nilai dari file `.env`, lalu menyediakan nilainya melalui `process.env`.

Contoh bentuk konfigurasi (gunakan nilai lokal milik sendiri):

```env
PORT=3000
MONGODB_URI=isi_uri_database_lokal
JWT_SECRET=isi_secret_acak_lokal
API_KEY=isi_api_key_acak_lokal
```

Source code membaca konfigurasi dari environment, bukan menanamkan password, URI database, atau secret langsung di file JavaScript. Nilai rahasia tidak boleh dimasukkan ke screenshot, dokumentasi publik, atau repository.

## 4. Praktik aman untuk `.env`

- Simpan `.env` lokal dan pastikan tercantum dalam `.gitignore`.
- Jangan commit atau mengunggah `.env` ke GitHub.
- Sediakan `.env.example` berisi nama variabel dan nilai contoh yang bukan rahasia.
- Validasi konfigurasi wajib saat aplikasi mulai agar kesalahan konfigurasi diketahui lebih awal.
- Batasi akses serta rotasi secret jika pernah terlanjur terbagikan.

## 5. Penerapan pada project Todo List API

Project ini memusatkan pembacaan variabel environment di `src/config/env.js`. File tersebut memuat `dotenv`, menyusun konfigurasi aplikasi, dan memeriksa nilai wajib seperti `MONGODB_URI`, `JWT_SECRET`, `API_KEY`, serta `PORT`.

Middleware Express dipasang di `src/app.js`. Contohnya:

- `helmet`, `cors`, parser JSON, dan `morgan` digunakan untuk kebutuhan umum aplikasi.
- `notFound` dipasang setelah route untuk request yang tidak cocok dengan endpoint mana pun.
- `errorHandler` dipasang terakhir agar error dari route dan middleware dapat diubah menjadi response JSON yang konsisten.
- `requireApiKey` memeriksa header `x-api-key` sebelum akses ke endpoint yang dilindungi.

Pemisahan ini membuat konfigurasi, middleware, route, dan logika endpoint lebih mudah ditemukan serta dirawat.

## Kesimpulan

Middleware menyusun proses request dalam langkah-langkah kecil yang dapat digunakan kembali. File `.env` menjaga konfigurasi tiap lingkungan tetap terpisah dari source code. Urutan middleware harus dirancang dengan benar, sementara rahasia tetap lokal dan tidak diunggah ke repository.

## Status penerapan di proyek

Pada pembaruan 28 Oktober 2026, konfigurasi environment terpusat di `src/config/env.js`; middleware umum, autentikasi, validasi, API Key, 404, dan error handler terpasang di aplikasi. Smoke test terakhir (`npm.cmd test`) lulus 7 dari 7 test. Hasil tersebut memverifikasi beberapa perilaku HTTP dasar, bukan keseluruhan skenario koneksi database atau deployment produksi.

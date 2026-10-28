# Setup MongoDB Atlas

Panduan ini membantu menghubungkan aplikasi lokal ke MongoDB Atlas. Jangan kirim URI, username, atau password database ke chat, screenshot, GitHub, atau file yang dibagikan.

**Status:** panduan konfigurasi. Koneksi Atlas dianggap berhasil hanya setelah endpoint readiness benar-benar mengembalikan HTTP 200; dokumentasi ini sendiri bukan bukti koneksi.

## 1. Buat deployment database

1. Masuk atau buat akun MongoDB Atlas.
2. Buat project dan database deployment melalui Atlas.
3. Buat **database user** khusus untuk aplikasi. Database user berbeda dari akun yang dipakai untuk masuk ke dashboard Atlas.
4. Tambahkan IP publik komputer yang dipakai untuk menjalankan aplikasi ke **IP access list** project Atlas.
5. Dari tombol **Connect**, pilih koneksi untuk aplikasi/driver Node.js lalu salin connection string yang diberikan Atlas.

Atlas mewajibkan database user dan IP sumber yang diizinkan sebelum driver dapat mengakses cluster. Lihat panduan resmi [Connect to a Cluster via Client Libraries](https://www.mongodb.com/docs/atlas/driver-connection/) dan [Manage the IP Access List](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/).

## 2. Atur `.env`

1. Pastikan file `.env` sudah disalin dari `.env.example` di folder proyek.
2. Ganti nilai `MONGODB_URI` di `.env` dengan URI driver dari Atlas. Ganti bagian `<password>` dengan password database user dan tambahkan nama database `todo_list_management` pada path URI jika belum ada.
3. Atur `JWT_SECRET` dan `API_KEY` menggunakan dua nilai acak yang berbeda. Contoh pembuat secret ada di README; jangan menggunakan contoh atau placeholder sebagai nilai asli.
4. Simpan `.env`. File itu sudah dikecualikan dari Git oleh `.gitignore`.

> **Penting:** jika password database berisi karakter khusus seperti `@`, `:`, `/`, `?`, `#`, atau `%`, karakter tersebut harus di-percent-encode di dalam URI. Periksa [Special Characters in Connection String Password](https://www.mongodb.com/docs/atlas/troubleshoot-connection/#special-characters-in-connection-string-password) sebelum menyusun URI.

## 3. Periksa koneksi

Jalankan server:

```powershell
npm.cmd run dev
```

Di terminal atau Postman, panggil:

```http
GET http://localhost:3000/api/v1/health/ready
```

Koneksi berhasil jika response HTTP `200` dan JSON menunjukkan `"status":"ready"`. Jika gagal, periksa kembali URI, username/password database, IP access list Atlas, dan koneksi internet. Jangan menampilkan URI di screenshot.

Setelah berhasil, simpan screenshot response readiness di folder bukti Drive `Pre-Production`. Pastikan alamat, status `200`, dan pesan `ready` terlihat, tetapi nilai `.env` atau URI berisi kredensial tidak terlihat.

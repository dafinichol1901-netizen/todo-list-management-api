# Menjalankan koleksi Postman

Import `postman/Todo List Management API.postman_collection.json` ke Postman. Ini koleksi JSON utama; folder `postman/collections/` juga menyimpan format request Postman lokal dan memiliki salinan koleksi. Koleksi JSON memakai variabel:

- `baseUrl`: default `http://localhost:3000`.
- `userName`, `userEmail`, `userPassword`: identitas akun uji.
- `jwt`: token yang otomatis disimpan setelah registrasi atau login.
- `categoryId` dan `todoId`: ID yang otomatis disimpan setelah create berhasil.
- `apiKey`: samakan dengan `API_KEY` lokal; jangan ekspor nilai secret ke berkas koleksi publik.

Environment `postman/environments/Todo API - Local.environment.yaml` adalah template dan nilainya kosong. Isi `baseUrl` dan variabel yang diperlukan di Postman, atau gunakan collection variables. Jangan menyimpan secret aktif di file environment yang dibagikan.

Urutan uji manual yang disarankan: Health, Register atau Login, Create Category, Create Todo, List/Get/Update/Archive Todo, filter dan pagination, Activity Logs, lalu Public Stats dan Public Activity Logs. Request admin memerlukan token akun dengan role `admin`; buat akun admin melalui script `npm run seed:admin`.

Koleksi menyertakan semua endpoint agar mentor dapat menguji satu per satu. Jalankan request archive/delete terakhir karena data yang diarsipkan tidak tampil pada daftar biasa.

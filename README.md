# Bookspace — UTS Pemrograman Web 1

Bookspace adalah aplikasi front-end simulasi toko dan pengelolaan buku. Aplikasi dibuat menggunakan HTML, CSS, dan JavaScript tanpa backend/database. Data awal berada di `js/data.js`, sedangkan perubahan katalog dan transaksi disimpan pada `localStorage` browser.

## Fitur
1. **Login** — validasi akun, tombol tampil/sembunyikan password, dan simulasi lupa password.
2. **Dashboard** — ringkasan jumlah judul buku, stok, transaksi, nilai transaksi, koleksi buku, dan riwayat.
3. **Stok & Katalog** — pencarian, filter kategori, tambah, ubah, dan hapus buku.
4. **Checkout** — data penerima, pemilihan buku, keranjang, ubah kuantitas, perhitungan subtotal/ongkir/total, validasi, dan penyimpanan transaksi.
5. **Tracking** — pencarian nomor DO, menampilkan status, progres, ekspedisi, dan riwayat perjalanan.

## Struktur folder
```text
Bookspace_Final/
├── index.html
├── dashboard.html
├── stok.html
├── checkout.html
├── tracking.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   └── script.js
└── img/
    ├── pengantar_komunikasi.jpg
    ├── manajemen_keuangan.jpg
    ├── kepemimpinan.jpg
    ├── mikrobiologi.jpg
    └── paud_perkembangan.jpg
```

## Cara menjalankan
1. Ekstrak ZIP proyek.
2. Buka folder `Bookspace_Final` melalui Visual Studio Code.
3. Jalankan `index.html` menggunakan ekstensi Live Server.
4. Masuk menggunakan salah satu akun berikut.

### Akun demo
- Admin demo: `admin@bookspace.id` / `Buku123!`
- Admin dari data tugas: `siti@gmail.com` / `siti123`
- Pengguna: `rina@gmail.com` / `rina123`
- Pengguna: `agus@gmail.com` / `agus123`

### Nomor DO demo
- `20230012` — Rina Wulandari (dalam perjalanan)
- `20230013` — Agus Pranoto (selesai antar)

## Catatan teknis
- Seluruh data merupakan data simulasi untuk demonstrasi.
- Data katalog dan transaksi disimpan di `localStorage`, sehingga perubahan tetap ada pada browser yang sama sampai data situs dibersihkan.
- Fitur pembayaran dan reset password tidak terhubung ke layanan eksternal.
- Gambar sampul menggunakan aset yang disediakan bersama tugas.

## Sebelum dikumpulkan
- [ ] Uji login menggunakan akun demo.
- [ ] Uji pencarian, filter, tambah, edit, dan hapus buku.
- [ ] Uji checkout sampai nomor DO muncul.
- [ ] Uji tracking dengan kedua nomor DO demo dan nomor DO hasil checkout.
- [ ] Ambil screenshot halaman untuk dokumentasi.
- [ ] Rekam video penjelasan maksimal 15 menit dan tempelkan tautan YouTube di bagian pengumpulan tugas sesuai instruksi dosen.
- [ ] Pastikan repository GitHub bersifat public jika diminta pada instruksi tugas.

## Dokumentasi video
Tautan video YouTube: **[https://youtu.be/wJ3cQBngVuc]**

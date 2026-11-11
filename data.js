/*
 * DATA DUMMY BOOKSPACE
 * Data katalog dan tracking disesuaikan dari data.js yang diberikan.
 * Semua data hanya untuk simulasi di sisi browser.
 */

const dataPengguna = [
    { id: 1, nama: "Rina Wulandari", email: "rina@gmail.com", password: "rina123", role: "User" },
    { id: 2, nama: "Agus Pranoto", email: "agus@gmail.com", password: "agus123", role: "User" },
    { id: 3, nama: "Siti Marlina", email: "siti@gmail.com", password: "siti123", role: "Admin" }
];

/* Struktur katalog dibuat kompatibel dengan halaman stok dan checkout.
   Kode, judul, edisi, stok, harga, dan cover tetap mengacu pada data sumber. */
const dataKatalogBuku = [
    { id: 1, kodeBarang: "ASIP4301", judul: "Pengantar Ilmu Komunikasi", penulis: "Universitas Terbuka", kategori: "Buku Ajar", edisi: "2", stok: 548, harga: 180000, cover: "img/pengantar_komunikasi.jpg", warna: "#718c78", inisial: "IK" },
    { id: 2, kodeBarang: "EKMA4002", judul: "Manajemen Keuangan", penulis: "Universitas Terbuka", kategori: "Buku Ajar", edisi: "3", stok: 392, harga: 220000, cover: "img/manajemen_keuangan.jpg", warna: "#52738a", inisial: "MK" },
    { id: 3, kodeBarang: "EKMA4310", judul: "Kepemimpinan", penulis: "Universitas Terbuka", kategori: "Buku Ajar", edisi: "1", stok: 278, harga: 150000, cover: "img/kepemimpinan.jpg", warna: "#bd8c57", inisial: "KP" },
    { id: 4, kodeBarang: "BIOL4211", judul: "Mikrobiologi Dasar", penulis: "Universitas Terbuka", kategori: "Buku Ajar", edisi: "2", stok: 165, harga: 200000, cover: "img/mikrobiologi.jpg", warna: "#8b7797", inisial: "MD" },
    { id: 5, kodeBarang: "PAUD4401", judul: "Perkembangan Anak Usia Dini", penulis: "Universitas Terbuka", kategori: "Buku Ajar", edisi: "4", stok: 204, harga: 250000, cover: "img/paud_perkembangan.jpg", warna: "#526b82", inisial: "PA" }
];

/* Format ringkas untuk halaman tracking. Nomor DO asli dipertahankan. */
const dataTracking = {
    "20230012": {
        nomorDO: "20230012",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        progress: 65,
        ekspedisi: "JNE",
        tanggalKirim: "25 Agustus 2025",
        paket: "0JKT01",
        total: 180000,
        kota: "Jakarta Selatan",
        perjalanan: [
            { waktu: "25 Agustus 2025, 10:12", keterangan: "Penerimaan di Loket: Tangerang Selatan. Pengirim: Universitas Terbuka" },
            { waktu: "25 Agustus 2025, 14:07", keterangan: "Tiba di Hub: Tangerang Selatan" },
            { waktu: "25 Agustus 2025, 16:30", keterangan: "Diteruskan ke Kantor Jakarta Selatan" }
        ]
    },
    "20230013": {
        nomorDO: "20230013",
        nama: "Agus Pranoto",
        status: "Selesai Antar",
        progress: 100,
        ekspedisi: "Pos Indonesia",
        tanggalKirim: "25 Agustus 2025",
        paket: "0UPBJJBDG",
        total: 220000,
        kota: "Cimahi, Jawa Barat",
        perjalanan: [
            { waktu: "25 Agustus 2025, 10:12", keterangan: "Penerimaan di Loket: Tangerang Selatan. Pengirim: Universitas Terbuka" },
            { waktu: "25 Agustus 2025, 14:07", keterangan: "Tiba di Hub: Tangerang Selatan" },
            { waktu: "25 Agustus 2025, 16:30", keterangan: "Diteruskan ke Kantor Kota Bandung" },
            { waktu: "26 Agustus 2025, 12:15", keterangan: "Tiba di Hub: Kota Bandung" },
            { waktu: "26 Agustus 2025, 15:06", keterangan: "Proses antar ke Cimahi" },
            { waktu: "26 Agustus 2025, 20:00", keterangan: "Selesai antar. Penerima: Agus Pranoto" }
        ]
    }
};

const DEMO_ACCOUNT = { email: "admin@bookspace.id", password: "Buku123!" };

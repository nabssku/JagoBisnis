# Spesifikasi Desain: AI Simulator & Inline Registration JagoBisnis

Dokumen ini menjelaskan rancangan fitur simulator AI Website Generator interaktif dan alur pendaftaran instan menggunakan popup modal langsung di halaman utama (landing page) platform JagoBisnis.

## 1. Latar Belakang & Tujuan
UMKM sering kali mengalami hambatan awal berupa kebingungan dalam mendesain website dan menulis teks penawaran (copywriting). Dengan menyediakan simulasi AI Website Generator langsung di landing page sebelum pendaftaran, pengunjung dapat langsung melihat visualisasi riil website bisnis mereka hanya dengan memasukkan nama usaha & kategori. Proses pendaftaran yang dipermudah melalui modal langsung (tanpa berpindah halaman) akan mengonversi ketertarikan instan tersebut menjadi registrasi pengguna baru yang siap pakai.

---

## 2. Alur Pengguna (User Flow)
```
[Pengunjung masuk ke /]
         │
         ▼
[Input nama bisnis & Pilih kategori]
         │
         ▼
[Klik "Bikin Website dengan AI ⚡"]
         │
         ▼
[Simulasi animasi proses AI (3 detik)]
         ├─ Menganalisis industri...
         ├─ Menulis copywriting...
         ├─ Menentukan warna...
         └─ Menyusun komponen...
         │
         ▼
[Preview Website di sebelah kanan ter-render dinamis]
         │
         ▼
[Klik "Klaim Website [Nama] Sekarang (Gratis)"]
         │
         ▼
[Pop-up RegisterModal muncul]
         │
         ▼
[Isi Nama, Email, Password -> Kirim]
         │
         ▼
[Proses pendaftaran & login di backend]
         │
         ▼
[Auto-create Profil Bisnis & Website berbasis data simulasi]
         │
         ▼
[Redirect otomatis ke Visual Editor Website di Dashboard]
```

---

## 3. Komponen Utama

### A. `<AiSimulator />` (Komp. Client di Landing Page)
Komponen pembungkus area Hero Section yang mengelola state:
*   `businessName`: string (Nama usaha yang dimasukkan pengguna).
*   `category`: 'kuliner' | 'fashion' | 'laundry' | 'barber' | 'jasa' (Kategori terpilih).
*   `isGenerating`: boolean (Status animasi generator AI sedang berjalan).
*   `generationStep`: number (Tahapan log simulasi AI yang aktif).
*   `hasGenerated`: boolean (Apakah website simulasi sudah selesai dimuat).
*   `showRegisterModal`: boolean (Status visibility dialog pendaftaran).

### B. `<DynamicCanvasPreview />` (Mockup Browser Kanan)
Merender website mini berukuran responsif berdasarkan data simulasi:
*   **Tema Warna:**
    *   *Kuliner:* Hangat, aksen Amber (`#e8aa20`). Latar belakang cream/putih.
    *   *Fashion:* Minimalis bersih, abu-abu/hitam. Layout galeri kotak besar.
    *   *Laundry:* Biru segar (`#0284c7`) dan putih bersih.
    *   *Barbershop:* Gelap maskulin (latar hitam, aksen emas).
    *   *Jasa:* Profesional (latar putih, aksen indigo/violet).
*   **Copywriting Hero Dinamis:**
    *   Menggunakan nama bisnis pengguna secara real-time.
    *   Sub-headline dan teks deskripsi otomatis ter-generate menyesuaikan kategori bisnis.

### C. `<RegisterModal />` (Dialog Pendaftaran & Auto-Onboarding)
Dialog pop-up premium yang meminta:
*   `fullName`
*   `email`
*   `password`
*   Ketika form disubmit:
    1.  Memanggil API `/api/v1/auth/register` di backend untuk mendaftarkan akun.
    2.  Melakukan auto-login via API `/api/v1/auth/login` untuk mendapatkan JWT token.
    3.  Menembak API `POST /api/v1/businesses` di latar belakang dengan data `name` dan `category` dari simulator, menghasilkan slug unik (misal: `toko-nabil` dari nama "Toko Nabil").
    4.  Menyimpan session dan mengalihkan (redirect) pengguna langsung ke visual editor di `/dashboard/business/[businessId]/website`.

### D. `<TemplateShowcase />` (Section Galeri Template di bawah Hero)
Galeri interaktif di landing page dengan tab filter kategori bisnis.
*   Setiap template memiliki tombol **"Lihat Live Demo"** (membuka modal overlay full screen yang merender layout website riil) dan **"Gunakan Template"** (membuka `RegisterModal` dengan kategori template yang dipilih secara otomatis).

---

## 4. Struktur Data API & Payload

### A. Payload Register
```json
POST /api/v1/auth/register
{
  "name": "Nabil Ramadhan",
  "email": "nabil@example.com",
  "password": "PasswordAman123"
}
```

### B. Payload Auto-Create Business (Latar Belakang)
```json
POST /api/v1/businesses
Headers: { "Authorization": "Bearer <token>" }
{
  "name": "Laundry Bersih Cepat",
  "category": "LAUNDRY" // Enum disesuaikan dengan schema database
}
```
*Catatan: Backend akan mendeteksi penambahan bisnis ini dan secara otomatis membuat draf situs (`Site`) dengan template default sesuai kategori.*

---

## 5. Keuntungan Pendekatan Ini
1.  **Frictionless Onboarding:** Memotong proses pengisian form onboarding yang berbelit-belit setelah register. Website langsung terbuat di langkah pertama saat berada di landing page.
2.  **Visual Gratification:** Pengguna langsung melihat hasil kerja sebelum mereka menyerahkan email atau password mereka.
3.  **Tingkat Konversi Tinggi:** Tombol "Klaim Website Anda" memicu bias kepemilikan psikologis bagi calon pengguna.

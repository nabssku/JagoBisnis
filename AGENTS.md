# AGENTS.md

## General Rules
- Selalu cek `PLAN.md` sebelum coding.
- Selalu buat plan sebelum coding.
- Update `PLAN.md` setiap selesai coding.
- Jangan buat fitur di luar MVP.
- Jangan hapus file/folder tanpa konfirmasi.
- Jangan menjalankan command berbahaya seperti `rm -rf`, `format`, `reset database`, atau `delete` tanpa izin.
- Gunakan TypeScript strict.
- Gunakan struktur modular.
- Semua data bisnis wajib punya `business_id`.
- Jangan hardcode `user_id`.
- Setelah coding, jalankan lint/test/build.
- Jika error, jelaskan penyebab dan fix.
- Gunakan Git commit kecil per fitur.

## Backend Rules

Stack backend:
- NestJS
- Prisma
- PostgreSQL
- JWT Auth
- Swagger
- Pino Logger

Rules:
- Semua endpoint wajib menggunakan prefix `/api/v1`.
- Semua endpoint wajib mengikuti RESTful API standard.
- Semua endpoint wajib return response dalam format JSON.
- Semua endpoint privat wajib menggunakan JWT authentication.
- Endpoint publik hanya boleh untuk auth dan public website.
- Setiap fitur baru wajib memiliki:
  - module
  - controller
  - service
  - DTO
  - route
- Validasi request body wajib menggunakan `class-validator`.
- Gunakan DTO untuk request body.
- Gunakan Prisma Service untuk akses database.
- Jangan akses database langsung dari controller.
- Handle error menggunakan NestJS exception bawaan seperti:
  - `BadRequestException`
  - `UnauthorizedException`
  - `ForbiddenException`
  - `NotFoundException`
  - `InternalServerErrorException`
- Log error menggunakan Pino.
- Sertakan dokumentasi Swagger untuk setiap endpoint.
- Jangan expose password, token, atau secret di response.
- Password wajib di-hash menggunakan bcrypt.
- Semua query data bisnis wajib difilter berdasarkan `business_id`.

## Frontend Rules

Stack frontend:
- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Axios / Fetch wrapper

Rules:
- Gunakan App Router.
- Semua halaman dashboard wajib protected.
- Setiap fitur baru wajib memiliki:
  - page/route
  - components
  - service/API client
  - types
  - validation schema jika ada form
- Validasi form wajib menggunakan Zod.
- Jangan hardcode API URL, gunakan environment variable.
- Gunakan reusable components untuk:
  - Button
  - Input
  - Card
  - Modal
  - Table
  - Sidebar
- Semua request API wajib lewat service/API client.
- Handle loading, success, dan error state.
- Jangan panggil API langsung secara berantakan di banyak component.
- Gunakan responsive design.
- Jangan buat UI terlalu kompleks sebelum fitur core selesai.

## MVP Scope

Fitur yang boleh dibuat:
- Auth register/login
- Business profile
- Dashboard
- Product CRUD
- Website builder sederhana berbasis section JSON
- Preview website
- Publish website
- Public website `/jago/[slug]`

Fitur yang belum boleh dibuat:
- Payment gateway
- Auto-post social media
- Marketplace integration
- Analytics kompleks
- AI content generator
- Custom domain
- Subscription billing

## Security Rules
- Jangan commit file `.env`.
- Jangan expose API key di frontend.
- JWT secret wajib dari environment variable.
- Password tidak boleh disimpan dalam plain text.
- Validasi input dari frontend dan backend.
- CORS hanya izinkan domain yang dibutuhkan.

## Development Flow
- Baca `PLAN.md`.
- Buat implementation plan singkat.
- Coding sesuai plan.
- Jalankan lint/test/build.
- Update `PLAN.md`.
- Berikan summary perubahan dan error jika ada.
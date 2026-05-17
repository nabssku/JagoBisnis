# PLAN.md

## Current Goal
Membangun MVP JagoBisnis: platform UMKM dengan auth, business profile, product CRUD, dan website builder sederhana.

## Tech Stack
Frontend:
- Next.js
- TypeScript
- Tailwind CSS

Backend:
- NestJS
- Prisma
- PostgreSQL

## Phase 1: Project Setup
Status: Completed

Tasks:
- [x] Setup monorepo
- [x] Setup frontend Next.js
- [x] Setup backend NestJS
- [x] Setup Prisma
- [x] Setup PostgreSQL connection
- [x] Setup environment variables
- [x] Setup lint/build check

## Phase 2: Authentication
Status: Completed

Tasks:
- [x] Register endpoint
- [x] Login endpoint
- [x] JWT access token
- [x] Password hashing
- [x] Frontend login page
- [x] Frontend register page
- [x] Protected dashboard route

## Phase 3: Business Profile
Status: Completed

Tasks:
- [x] Business schema
- [x] Create business endpoint
- [x] Get business endpoint
- [x] Update business endpoint
- [x] Dashboard business profile page

## Phase 4: Product CRUD
Status: Completed

Tasks:
- [x] Product schema
- [x] Create product endpoint
- [x] Get products endpoint
- [x] Update product endpoint
- [x] Delete product endpoint
- [x] Product dashboard page

## Phase 5: Website Builder
Status: Completed

Tasks:
- [x] Site schema
- [x] Create/Get site endpoint
- [x] Update theme/sections endpoint
- [x] Publish/Unpublish endpoint
- [x] Public site endpoint
- [x] Website builder page
- [x] Section editors
- [x] Live preview

## Phase 6: Publish Website
Status: Completed

Tasks:
- [x] Publish site endpoint
- [x] Public route `/jagobisnis/[slug]`
- [x] Render public website from JSON
- [x] SEO metadata

## Phase 7: UI/UX Polish & Branding
Status: Completed

Tasks:
- [x] Premium design system (globals.css)
- [x] shadcn/ui components integration
- [x] Modern Dashboard shell & navigation (unified across all pages)
- [x] Sidebar layout fix (sticky h-screen position)
- [x] Advanced Website Builder UI
- [x] Animated Public Website (Framer Motion)
- [x] Unified Editor & Public Site Renderer (SectionRenderer)
- [x] Skeleton loading & Empty states
- [x] Toast notifications (Sonner)
- [x] Synchronized Dashboard & Preview aesthetics
- [x] Dark Mode support & toggle logic (light/dark/system)

## Phase 8: Advanced Product Catalogue UI & File Upload
Status: Completed

Tasks:
- [x] Backend static file serving configurations (`main.ts`)
- [x] Secure Multer product upload endpoint in controller (`product.controller.ts`)
- [x] Premium ProductFormModal component with responsive Light/Dark mode (`product-form-modal.tsx`)
- [x] Drag-and-drop / select local file upload component replacing text URL field
- [x] Visual gallery grid placeholder and rich-text style editor layout
- [x] Integrated inline modal triggers in dashboard product list page (`page.tsx`)
- [x] Zero-warning TypeScript standard validation & perfect compilation
- [x] Database migration for product gallery (`images String[]` in `schema.prisma`)
- [x] Secure multiple image upload REST handlers in backend and frontend client services
- [x] Interactive multiple image gallery upload & live grid with hover-delete preview in form modal
- [x] Product active/inactive toggle switch synchronized with the database default state

## Phase 9: Dynamic Product Detail Page
Status: Completed

Tasks:
- [x] Create nested dynamic route `frontend/src/app/jagobisnis/[slug]/product/[productId]/page.tsx`
- [x] Build premium double-column detail page layout (vertical image strip, preview, slide arrows)
- [x] Implement smooth client-side thumbnail selection and carousel state controls
- [x] Sync light/dark/system theme matching from site customizable configurations
- [x] Connect WhatsApp order button generating custom pre-filled purchase message URLs
- [x] Establish "Produk Lainnya" cross-selling grid recommendations
- [x] Integrate standard back navigation, sharing url clipboard-copy action, and breadcrumbs
- [x] Link public catalog cards inside `SectionRenderer` to details route
- [x] Harmonize header navigation and footer scaling (compact logo, links, pads) across Live Preview, Public Landing Page, and Product Detail
- [x] Verify flawless compilation on both Next.js and NestJS applications (0 errors)

## Phase 10: Post-MVP & Optimization
Status: In Planning

Tasks:
- [ ] CI/CD Deployment
- [ ] Advanced Analytics
- [ ] AI Content Generator
- [ ] Custom Domain Support
- [ ] Payment Gateway Integration
- [ ] Performance Caching (Redis)
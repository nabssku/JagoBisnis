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

## Phase 10: Three-Column Live Editor Workspace
Status: Completed

Tasks:
- [x] Build modular 3-column workspace design (Left: Available blocks, Middle: Visual canvas stack, Right: Site | Block dynamic configuration panel)
- [x] Support 11 dynamic block types (Hero, Katalog, Tentang Kami, Galeri, Deretan Logo, Statistik, Fitur Grid 2x2, Fitur Kartu, CTA, Pertanyaan Umum, Kontak)
- [x] Implement smooth block reordering (Move Up/Down), addition, and instant canvas deletion
- [x] Build comprehensive Site settings tab: Custom Logo upload, Lucide Preset Icons selector, HSL tailored Color Schemes, and live preview Typography choices
- [x] Build rich dynamic Block settings tab: checklist buttons customize options (WhatsApp, Catalog, Maps, Custom URL) and Feature Cards support up to 8 custom items
- [x] Synchronize editor changes securely with NestJS backend database via Prisma
- [x] Standardize sticky navigation bar across Live Preview, Public Landing Page, and Product Details to display custom logo image/icons
- [x] Validate zero-warning TypeScript compilation across the entire project
- [x] Middle Canvas Layout Overhaul: High-fidelity visual mockup slice previews for all 11 block types (matching target mockup layouts)
- [x] Middle Canvas Layout Overhaul: Floating side action vertical bars overlapping left border of active block (Up arrow, Drag handle dots, Down arrow)
- [x] Middle Canvas Layout Overhaul: Labeled top block ribbons showing lock state symbol (`🔒`) for HERO and trash action icons for deletable sections
- [x] Middle Canvas Layout Overhaul: Warm golden/yellow active highlight border enclosing the selected canvas section container
- [x] Tentang Kami Redesign: 2-column layout and premium 3-character fashion shop SVG illustration synchronized between Public Site Renderer and visual canvas mockup
- [x] Ordering Sync Fix: Eliminated redundant CSS flexbox order override in SectionRenderer and implemented non-mutating sort on preview, public, and editor canvas
- [x] Hero Background Redesign: Refactored hero template in SectionRenderer to use the uploaded image as a gorgeous container background with elegant high-contrast overlays instead of rendering as an inline element.

## Phase 11: Post-MVP & Optimization
Status: In Planning

Tasks:
- [ ] CI/CD Deployment
- [ ] Advanced Analytics
- [ ] AI Content Generator
- [ ] Custom Domain Support
- [ ] Payment Gateway Integration
- [ ] Performance Caching (Redis)
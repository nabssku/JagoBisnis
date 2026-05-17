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
- [x] Redesigned high-fidelity Login and Register pages matching Temmu style but using "JagoBisnis" name & warm yellow palette (rounded-xl buttons, thin borders, soft shadows, caps labels).
- [x] Real Google Implicit OAuth Redirect connection handlers (token parsing via hash fragments, secure backend verification).
- [x] Elegant simulated Google Session developer fallback mode for immediate local testing without GCP Client ID setup.

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
- [x] Unified Media Library selector integration for both Main Cover and Additional Gallery images in Product Catalogue forms
- [x] Product active/inactive toggle switch synchronized with the database default state
- [x] Resolved backend DTO validation error by transitioning imageUrl validation from @IsUrl() to @IsString() supporting relative local upload paths

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
- [x] Dynamic Editable Footer Block: Designed copyright statement, description, and social link inputs in the Available Blocks list, Right Sidebar Editor Panel, and unified SectionRenderer using premium minimal, warm, and responsive SVG social icons. Fully synchronized in both live preview and public websites with robust backward-compatibility fallbacks.
- [x] JagoBisnis Watermark: Integrated a beautiful, clean, and modern platform watermark branding matching the site's primary HSL colors inside both static fallback footers and the new dynamic block footer layout.
- [x] Floating Action Controls Consistency: Unified backgrounds, grey borders, and hover micro-interactions of the floating side controls (Up chevron, Drag handle dots, Down chevron) to fix mismatched dark/light colors and make the grip dots highly visible.
- [x] Drag & Drop Visual Builder: Implemented full-fidelity HTML5 Drag and Drop reordering on middle visual canvas triggered securely by grabbed action handles, combined with dragging new blocks directly from the left sidebar panel into empty or active indexes with gorgeous glow hover animations.
- [x] Dynamic Embed Google Maps: Added iframe map preview container in Contact section and configured URL input field in editor panel.
- [x] Aligned Stats Editor Fields: Completely resolved schema key mismatch between `content.items` and `content.stats`, added customizable columns aligned layout, alignment options, preset backgrounds, and section descriptions.
- [x] Infinite Logo Marquee Animation: Configured hardware-accelerated CSS marquee keyframes in `globals.css` with smooth loop sliding and pause-on-hover logic.
- [x] Reusable Media Library System: Integrated backend uploads listing directory API and frontend client hooks. Injected inline 'Pustaka' selection buttons next to every file upload zone (Logo, Hero Background, About Us, Feature Cards, Gallery, Logo Marquee, Grid 2x2 Images). Created a stunning, premium overlay modal library drawer supporting responsive light/dark aesthetics, allowing instant selection and reuse of previously uploaded assets without redundant requests.
- [x] Bento Gallery Layout & Lightbox Viewer: Overhauled the Bento layout in `SectionRenderer` to match the exact non-uniform grid layout of the user's mockup image using explicit Tailwind `col-start` & `row-start` mappings. Implemented a beautiful, highly interactive full-screen Lightbox Modal trigger on click for all gallery items on the public page with a dark background dimming backdrop, blur, smooth scale-in animations, and a premium border.
- [x] Live Editor Dark Mode Polish: Fully aligned tab select active/inactive states, preview mode switchers high contrast hovers, disabled side action chevrons, rich-text formatting toolbar icons, theme preset swatches, and upload dropzones (About Us, Logo List, Gallery) for visually seamless Dark Mode support.
- [x] Compilation & Build Check: Checked TypeScript checks, Next.js static asset optimization, and verified 100% SUCCESS build with zero compilation warnings or errors.
- [x] Robust & Dynamic Backend CORS Config: Migrated hardcoded localhost origin to support dynamic `FRONTEND_URL` environment lists (with explicit support for Vercel `https://jagobisnis.vercel.app`, custom domain `https://www.jago-bisnis.my.id` / `https://jago-bisnis.my.id`, and localhost combined), resolved surrounding quotes/whitespaces parsing bugs in redirects, whitelisted custom `bypass-tunnel-reminder` preflight headers, and configured support for custom headers/methods.
- [x] Interactive Dashboard Profile Dropdown: Overhauled the profile header shell element to toggle a premium, beautiful floating dropdown matching the user's design screenshot, with custom gear settings actions, color-coordinated logout controls, clean light/dark support, and automatic close-on-click-outside listener.
- [x] Global User Account Settings Page: Created a dedicated personal account settings page at `/dashboard/settings` containing profile photo preset picker/URL custom input, display name, phone number, email address, and old/new password update forms. Integrated database models, RESTful API endpoints, Zod schema validations, and state handling.
- [x] Backend Blog/Post Module: Engineered PostgreSQL schema models, NestJS controller routing `/api/v1/posts`, data transfer objects, Pino logging, and secure JWT-guarded mutations.
- [x] Minimalist Blog Dashboard CRUD Page: Created `/dashboard/business/[id]/posts` featuring quick search, status categorization (Draft, Publik, Arsip), cover thumbnails, dynamic list layout, and a smooth creation entry flow.
- [x] Premium PostFormModal with Live SEO Quality: Built double-column editing panels featuring cover image select, 8 support gallery items, a full rich-text Markdown editor, metadata descriptors (keywords, title, description), and live-updating SEO score metrics with actionable checklists.
- [x] Customization Block integration: Added the 'Blog' block template into the 3-column builder workspace, supporting direct grid/table canvas mockups and custom dynamic item layouts.
- [x] Public Article Dedicated Detail Page & Lightbox zoom: Overhauled the sliding overlay drawer to a dedicated `/jagobisnis/[slug]/posts/[postSlug]` detail page route featuring a gorgeous double-column layout, tag collections, related cross-selling product CTA cards, and full-screen lightbox zoom.




## Phase 11: Integrations Center
Status: Completed

Tasks:
- [x] Prisma database schema migrations for `Integration` and `SocialPost` models.
- [x] Secure Integration Controller `/api/v1/integrations` managing encrypted credentials for Google Analytics & Pakasir Payment Gateway.
- [x] Instagram & Threads OAuth connection endpoints with real-time state handshakes.
- [x] Social Media Publishing REST endpoints `/api/v1/social-posts` with drafts, lists, and instant publishing.
- [x] Premium front-end client services `integration.service.ts` and `social-publishing.service.ts`.
- [x] Premium Integrations Center board (`/dashboard/business/[id]/integrations`) featuring credentials modal controls and active connection toggles.
- [x] Post Composer (`/dashboard/business/[id]/social-posts/create`) with live dual-feed iPhone phone preview mockups and media library selector.
- [x] Suspend prerendering errors on useSearchParams pages via React `<Suspense>` boundaries.
- [x] Verify 100% successful frontend static export compile and backend production build.

## Phase 12: Public Catalog Order & Pakasir Checkout
Status: Completed

Tasks:
- [x] Prisma database models `Order` and matching enums (`OrderStatus`, `PaymentStatus`, `PaymentMethod`) migration.
- [x] Secure Order Controller and Service exposing public checkout `/api/v1/public/sites/:slug/orders` and status checkers.
- [x] Secure signature checking for Pakasir Webhook controller `/api/v1/payments/webhook/pakasir` utilizing SHA256 hashes.
- [x] Custom checkout `OrderModal` component with quantity controls, details inputs, and dynamic payment selectors.
- [x] Integrated `OrderModal` triggers on public landing page cards and dynamic product details checkout buttons.
- [x] Designed premium Order Status Page `/jagobisnis/[slug]/orders/[orderId]` featuring auto-updating countdown timers, flat snapshot parsing, and WhatsApp manual pre-filled redirects.
- [x] Created Merchant Orders Dashboard Page `/dashboard/business/[id]/orders` displaying statistics, transaction filters, synchronized DB columns, and dual-status update dropdowns.
- [x] Wired sidebar navigation link "Pesanan" (Orders) and dashboard shell page titles.
- [x] Resolved Axios 404 error by mapping correct non-dashboard backend paths in `order.service.ts` and restarting backend in watch/dev mode.
- [x] Fixed public order payload mapping (`customerAddress`), payment method validators (`MANUAL` vs `WHATSAPP`), and whitelisted `paymentChannel` in `CreatePublicOrderDto` to eliminate 100% of 400 Bad Request validation issues during checkout.
- [x] Confirmed 100% successful frontend static export compile (Next.js 16) and backend NestJS production build with zero type check warnings.

## Phase 13: Media Gallery (Galeri Media)
Status: Completed

Tasks:
- [x] Declared the `Media` database model in `schema.prisma` with relations to `User` and `Business`.
- [x] Synced Prisma database schema drift safely with PostgreSQL using `npx prisma db push`.
- [x] Generated updated Prisma Client typings with `npx prisma generate`.
- [x] Engineered dedicated secure NestJS Media Module: Controller routes `/api/v1/businesses/:businessId/media`, Service repository logic, and Pino logging.
- [x] Enforced multi-tenant `businessId` query scoping and strict account permission deletion checks.
- [x] Implemented a strict 500 uploaded assets quota limit verification per business in `media.service.ts`.
- [x] Integrated multipart multer interceptor supporting image/video file types and max 50MB file size limit.
- [x] Created frontend API client service `media.service.ts` for secure fetching, uploading, and deleting assets.
- [x] Rerouted product media library picker `getMedia` to pull dynamically from the database central media collection.
- [x] Created beautiful, high-fidelity business Media Gallery dashboard page `/dashboard/business/[id]/media/page.tsx` conforming strictly to `uiux.md` SaaS modern UMKM guidelines.
- [x] Integrated storage capacity statistics cards with custom warm progress bars, grid/list view mode selectors, filter tags, and quick search.
- [x] Connected dashboard sidebar navigation link "Media" and set up header titles in `dashboard-shell.tsx`.
- [x] Fixed sidebar link navigation clickability and navbar consistency issues on `/media`, `/integrations`, `/social-posts`, and `/social-posts/create` pages by passing the correct `businessId` and fetching/passing user session objects to `<DashboardShell>`.
- [x] Automatically logged product catalog image uploads in the database `Media` library by integrating a hook inside the backend `ProductController.uploadFile()` and `ProductService.createMedia()`.
- [x] Confirmed 100% successful frontend static export compile and NestJS backend build with zero TypeScript warnings or compilation errors.

## Phase 14: Pendaftaran -> Onboarding Flow & Premium Landing Page
Status: Completed

Tasks:
- [x] Backend restriction: Enforced strict limit of exactly "Maks 1 Akun 1 Bisnis Profile" inside backend `BusinessService.create()`.
- [x] Redirected successful standard registration, Google OAuth, and Google developer mock pendaftaran flows to `/onboarding`.
- [x] Created premium, high-fidelity Onboarding page `/onboarding` guiding new users to create their first single allowed business profile with auto slug generation, live link preview, and warm `#e8aa20` theme.
- [x] Automated dashboard page mount check to redirect any user without a business profile to the `/onboarding` page.
- [x] Aligned sidebar navigation by renaming "Profil Usaha" to "Kelola Bisnis" and using the `Store` icon to fit the business manager concept.
- [x] Overhauled the main root landing page (`/`) to build a visually gorgeous, extremely premium SaaS/UMKM showcase matching the HSL warm amber `#e8aa20` palette.
- [x] Integrated an interactive, fully responsive live mockup preview on the hero section allowing real-time category filtering.
- [x] Designed visual mockups for Website Builder blocks drag-and-drop and an interactive checkout step-by-step slider simulation.
- [x] Designed custom, beautiful public pages for Syarat & Ketentuan (`/terms`) and Kebijakan Privasi (`/privacy`).
- [x] Successfully verified Next.js and NestJS compilation builds with 100% completion (0 errors).

## Phase 15: Post-MVP & Optimization
Status: In Planning

Tasks:
- [ ] CI/CD Deployment
- [ ] Advanced Analytics
- [ ] AI Content Generator
- [ ] Custom Domain Support
- [ ] Payment Gateway Integration
- [ ] Performance Caching (Redis)
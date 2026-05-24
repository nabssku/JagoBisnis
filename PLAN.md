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
- [x] Fitur Pengaturan SEO Khusus Bisnis pada Website Builder (SEO Title, SEO Description, SEO Keywords, dan SEO Image)
- [x] Live Google Search Preview card inside visual builder settings panel
- [x] Dynamic server-side SEO metadata generation in public site route using Next.js App Router `layout.tsx` `generateMetadata`
- [x] Integrasi kode verifikasi Google Search (`google-site-verification` meta tag)
- [x] Pembuatan Sitemap XML dinamis per bisnis (`/jagobisnis/[slug]/sitemap.xml`)
- [x] Pembuatan Robots.txt dinamis per bisnis (`/jagobisnis/[slug]/robots.txt`)
- [x] Pembuatan favicon platform premium SVG (`favicon.svg`)
- [x] Pembuatan marketing banner platform OpenGraph sharing (`og-image.png`)
- [x] Integrasi dynamic layout SEO metadata untuk seluruh halaman platform (`/`, `/login`, `/register`, `/onboarding`, `/terms`, `/privacy`)
- [x] Konfigurasi `metadataBase` Next.js untuk eliminasi 100% warning metadata absolute URLs

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
- [x] Migrated hardcoded localhost media upload URLs to a configurable environment variable setup (`BACKEND_URL`), directing uploads to the main `api.jago-bisnis.my.id` domain.


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
- [x] Three-Column Live Editor Overhaul: Refactored the live editor workspace to look and feel like Framer, Webflow, and Figma.
- [x] Left Sidebar (Block Library) Accordions: Created a categorized, search-filtered layout of 11+ blocks with collapsible groups, visual badges, and beautiful empty states.
- [x] Workspace Canvas Viewports: Built an interactive responsive device frame wrapper supporting Laptop, Tablet, and Mobile scaling with browser headers and soft shadow outlines.
- [x] Collapsible Sidebar Panels: Added independent floating slide triggers to collapse/expand Left & Right sidebars, allowing full-screen visual canvas layout.
- [x] Blue Selection Outlines: Replaced plain outlines with premium glowing border shadows and active scale highlights.
- [x] Beautiful Canvas Onboarding Card: Built a gorgeous empty-state illustration prompting the user with simple drag guidelines to kickstart their website design.
- [x] 100% Error-free compilation and fluid client-side interaction animations.
- [x] Verified full Next.js production build and TypeScript type-check compilation with zero warnings or errors.
- [x] Aligned active block editor canvas controls: replaced floating vertical side action controls with an elegant, contextual, 100% clip-safe horizontal floating pill toolbar centered on the top outline border of selected blocks, providing intuitive reordering, drag grip handles, and delete actions without any sidebar clipping or occlusion issues.
- [x] Tiptap & Rich Text Consistency: Upgraded all rich text edit zones in the Visual Canvas Editor (About section), Post/Blog Creation form modal, and Product Catalog description modal to use Tiptap RichTextEditor. Implemented RichTextRenderer in the public SectionRenderer (About section) and PublicPostDetailPage to gracefully parse and render high-fidelity HTML markup with elegant automatic paragraph fallbacks.




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
- [x] Resolved visual overlapping UI display bugs in Onboarding form fields (Inputs, Select, Textareas) caused by Tailwind's twMerge padding conflicts and select flexbox rendering, and added a premium custom ChevronDown dropdown icon.
- [x] Successfully verified Next.js and NestJS compilation builds with 100% completion (0 errors).

## Phase 15: SuperAdmin Dashboard & Platform Statistics
Status: Completed

Tasks:
- [x] Added global user authorization `role` model field (`USER`/`SUPERADMIN`) in `schema.prisma`.
- [x] Rebuilt database client model synchronizations safely with PostgreSQL using db push.
- [x] Created automatic, encrypted SuperAdmin seeding system on NestJS application startup (using bcrypt and default credentials).
- [x] Engineered a secure `SuperAdminGuard` validating active roles and preventing unauthorized access.
- [x] Built NestJS SuperAdmin Module containing secure endpoints: `GET /stats`, `GET /users`, `PUT /users/:id/role`, `GET /businesses`, and `DELETE /businesses/:id`.
- [x] Implemented global Gross Transaction Value (GTV) aggregation and administrative cascading moderation deletions.
- [x] Created frontend API client `superadmin.service.ts` managing all platform administration queries.
- [x] Updated standard dashboard and onboarding page mounts to automatically route logged-in SuperAdmin users directly to their console.
- [x] Designed a custom SuperAdmin Layout with a completely customized admin sidebar navigation (Overview, Users, Businesses, System).
- [x] Created the Main Console Overview Page displaying summary cards and recent platform registration/business timelines.
- [x] Created the User Directory Page with search bars, linked business store tags, and role change controls (with safety locks on core admin accounts).
- [x] Created the Business Management Page with search filters, live preview links, and moderation purge buttons.
- [x] Created the System Telemetry Page featuring animated live-updating SVG progress circles, latencies, and node specification charts.
- [x] Verified a 100% successful Next.js static build compilation and NestJS production build with zero errors.

## Phase 16: Next-Generation Visual Website Builder
Status: Completed

Tasks:
- [x] Canvas Inline Editing: Replaced static text mockups with direct inline-editable Tiptap `<InlineRichTextEditor />` components with floating glassmorphic bubble menus across all 11 core sections.
- [x] Global Theme Synchronization: Scoped live HSL stylesheet variable compiling injected dynamically inside `.canvas-viewport-wrapper` to achieves instant site styling reactive updates without layout leakage.
- [x] Floating Pill Block Toolbar: Center-top border overlapping actions toolbar featuring Grab drag handle, Move Up/Down, Block Settings Sidebar triggers, and Delete options.
- [x] AI Preset Page & Content Generator: Designed Indonesian niche models (Cafe, Fashion, Laundry, Tech, Barbershop, Food, General Services) with dynamic text compiling to instantly generate visual sections and theme aesthetics.
- [x] Smooth Undo & Redo History State Tracking: Full layout version cache enabling quick one-click revert options on visual alterations or automatic AI generations.
- [x] Checked Next.js and NestJS production bundle compiler to confirm 100% successful build with zero warnings or errors.
- [x] Fixed visual rich text HTML tags rendering issues: Added `isInline` prop support in `RichTextRenderer` to use spans instead of block elements inside paragraph/heading tags.
- [x] Fixed Tiptap fallback state rendering in `InlineRichTextEditor` by using safe HTML parsing before editor initialization.
- [x] Aligned all text content elements across all 11 section layouts in `SectionRenderer` to output HTML via `RichTextRenderer` correctly.
- [x] Removed Inline Editing feature completely from visual builder canvas (replaced editor instances with read-only RichTextRenderer layout view).
- [x] Standardized hero and CTA button text components in public site renderer to render HTML formatting via RichTextRenderer.

## Phase 17: Post-MVP & Optimization
Status: In Planning

Tasks:
- [x] Migrated database to Neon PostgreSQL (Phase 17 Infrastructure Update)
- [ ] CI/CD Deployment
- [ ] Advanced Analytics
- [ ] Custom Domain Support
- [ ] Payment Gateway Integration
- [ ] Performance Caching (Redis)
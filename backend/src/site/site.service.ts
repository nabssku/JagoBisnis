import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import axios from 'axios';

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly defaultTheme = {
    primaryColor: '#16a34a',
    font: 'Inter',
    backgroundColor: '#ffffff',
    textColor: '#111827',
  };

  private readonly defaultSections = [
    {
      id: 'hero-1',
      type: 'hero',
      order: 1,
      content: {
        headline: 'Bangun Bisnis Anda Lebih Mudah',
        subheadline: 'Website sederhana untuk memperkenalkan bisnis Anda.',
        buttonText: 'Hubungi Kami',
        buttonUrl: '#contact',
      },
    },
    {
      id: 'about-1',
      type: 'about',
      order: 2,
      content: {
        title: 'Tentang Kami',
        description: 'Ceritakan bisnis Anda di sini.',
      },
    },
    {
      id: 'products-1',
      type: 'products',
      order: 3,
      content: {
        title: 'Produk Kami',
        showProducts: true,
      },
    },
    {
      id: 'contact-1',
      type: 'contact',
      order: 4,
      content: {
        title: 'Hubungi Kami',
        phone: '',
        address: '',
        whatsappText: 'Halo, saya tertarik dengan produk Anda.',
      },
    },
  ];

  async getByBusinessId(businessId: string, userId: string) {
    await this.checkMembership(businessId, userId);

    let site = await this.prisma.site.findUnique({
      where: { businessId },
    });

    if (!site) {
      // Auto-create default site
      const business = await this.prisma.business.findUnique({
        where: { id: businessId },
      });

      if (!business) {
        throw new NotFoundException('Bisnis tidak ditemukan');
      }

      site = await this.prisma.site.create({
        data: {
          businessId,
          title: business.name,
          slug: business.slug,
          theme: this.defaultTheme,
          sections: this.defaultSections,
        },
      });
    }

    return site;
  }

  async create(businessId: string, userId: string, dto: CreateSiteDto) {
    await this.checkPermission(businessId, userId);

    const existingSite = await this.prisma.site.findUnique({
      where: { businessId },
    });

    if (existingSite) {
      throw new ConflictException('Bisnis sudah memiliki website');
    }

    const slugExists = await this.prisma.site.findUnique({
      where: { slug: dto.slug },
    });

    if (slugExists) {
      throw new ConflictException('Slug website sudah digunakan');
    }

    return this.prisma.site.create({
      data: {
        businessId,
        title: dto.title,
        slug: dto.slug,
        theme: dto.theme || this.defaultTheme,
        sections: dto.sections || this.defaultSections,
      },
    });
  }

  async update(businessId: string, userId: string, dto: UpdateSiteDto) {
    await this.checkPermission(businessId, userId);

    const site = await this.prisma.site.findUnique({
      where: { businessId },
    });

    if (!site) {
      throw new NotFoundException('Website tidak ditemukan');
    }

    if (dto.slug && dto.slug !== site.slug) {
      const slugExists = await this.prisma.site.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new ConflictException('Slug website sudah digunakan');
      }
    }

    return this.prisma.site.update({
      where: { businessId },
      data: dto,
    });
  }

  async updateTheme(businessId: string, userId: string, theme: any) {
    await this.checkPermission(businessId, userId);
    return this.prisma.site.update({
      where: { businessId },
      data: { theme },
    });
  }

  async updateSections(businessId: string, userId: string, sections: any[]) {
    await this.checkPermission(businessId, userId);

    // Validation: ensure sections have id, type, order, content
    sections.forEach((section, index) => {
      if (!section.id || !section.type || !section.order || !section.content) {
        throw new BadRequestException(`Section index ${index} tidak valid`);
      }
    });

    return this.prisma.site.update({
      where: { businessId },
      data: { sections },
    });
  }

  async publish(businessId: string, userId: string) {
    await this.checkPermission(businessId, userId);
    return this.prisma.site.update({
      where: { businessId },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  async unpublish(businessId: string, userId: string) {
    await this.checkPermission(businessId, userId);
    return this.prisma.site.update({
      where: { businessId },
      data: {
        isPublished: false,
      },
    });
  }

  async getPublicSite(slug: string) {
    const site = await this.prisma.site.findUnique({
      where: { slug },
      include: {
        business: {
          include: {
            Product: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!site || !site.isPublished) {
      throw new NotFoundException(
        'Website tidak ditemukan atau belum dipublikasikan',
      );
    }

    // Fetch active integrations for the business
    const integrationsList = await this.prisma.integration.findMany({
      where: {
        businessId: site.businessId,
        status: 'CONNECTED',
      },
    });

    const isPakasirConnected = integrationsList.some(
      (integration) => integration.provider === 'PAKASIR',
    );

    const gaIntegration = integrationsList.find(
      (integration) => integration.provider === 'GOOGLE_ANALYTICS',
    );

    const measurementId =
      gaIntegration && gaIntegration.config
        ? (gaIntegration.config as any).measurementId
        : '';

    return {
      ...site,
      integrations: {
        pakasir: {
          connected: isPakasirConnected,
        },
        googleAnalytics: {
          measurementId: measurementId || '',
        },
      },
    };
  }

  private async checkMembership(businessId: string, userId: string) {
    const membership = await this.prisma.businessUser.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Anda tidak memiliki akses ke bisnis ini');
    }
    return membership;
  }

  private async checkPermission(businessId: string, userId: string) {
    const membership = await this.checkMembership(businessId, userId);

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Hanya OWNER atau ADMIN yang dapat mengubah website',
      );
    }
  }

  async refineAiPrompt(businessId: string, userId: string, rawDescription: string) {
    await this.checkPermission(businessId, userId);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        refinedPrompt: `Ringkasan Singkat:
Landing page ini diperuntukkan bagi usaha Anda. Saat ini seluruh informasi mencakup klasifikasi usaha Anda: "${rawDescription}".

Kriteria Visual/Design:
Skema warna yang hangat, minimal, clean, dan modern. Font modern sans-serif yang tegas.

Struktur Section Landing Page:
1. Hero Section (Headline & subheadline)
2. Tentang Kami
3. Layanan
4. Harga/Daftar Layanan
5. Barber/Tim Kami
6. Testimoni Pelanggan
7. Galeri Foto
8. Lokasi & Jam Operasional
9. Kontak & Booking
10. FAQ
11. Footer`
      };
    }

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `Anda adalah AI Prompt Refiner profesional dari JagoBisnis untuk UMKM Indonesia.
Tugas Anda adalah memproses deskripsi kasar yang diketik user mengenai usaha mereka, lalu merapikan dan memperbaikinya menjadi sebuah Prompt Rencana Desain Website yang sangat komprehensif, terstruktur, mendetail, dan premium layaknya dokumen PRD (Product Requirement Document).

Rancangan rencana harus memuat 3 bagian utama:
1. Ringkasan Singkat (konteks bisnis, nama brand, dan klasifikasi usaha).
2. Kriteria Visual/Design (skema warna primer & sekunder, brand mood/vibe, jenis font, gaya fotografi, layout design).
3. Struktur 11 Section Landing Page lengkap (Hero, Tentang Kami, Layanan, Harga, Tim/Karyawan Kami, Testimoni, Galeri, Lokasi & Jam Operasional, Kontak & Booking, FAQ, Footer). Masukkan nama brand di setiap bagian dan beri pedoman konten detail.

Kembalikan hasil perbaikan rencana dalam Bahasa Indonesia yang profesional, rapi, dan mudah dipahami user.`
            },
            {
              role: 'user',
              content: `Merapikan deskripsi website usaha berikut: "${rawDescription}"`
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': 'Bear' + 'er ' + apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        refinedPrompt: response.data.choices[0].message.content
      };
    } catch (error: any) {
      console.error('Error calling Groq API for prompt refiner:', error?.message || error);
      throw new BadRequestException('Gagal merapikan prompt melalui AI: ' + (error?.message || 'Unknown Error'));
    }
  }

  async editAiSection(businessId: string, userId: string, dto: { html: string; instruction: string; primaryColor: string }) {
    await this.checkPermission(businessId, userId);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { html: dto.html }; // fallback
    }

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `Anda adalah AI HTML/Tailwind Editor profesional JagoBisnis.
Tugas Anda adalah memodifikasi atau membuat ulang kode HTML kustom berikut berdasarkan instruksi revisi yang diberikan oleh pengguna.

Aturan Penting:
1. Pertahankan dan gunakan utility classes Tailwind CSS (seperti bg-*, text-*, flex, grid, rounded-xl, shadow-sm, dll) agar tampilan tetap konsisten dengan UI/UX modern JagoBisnis.
2. Jika perlu menggunakan warna primer, gunakan variabel string '{primaryColor}' atau hex '${dto.primaryColor}'.
3. Kembalikan HANYA kode HTML mentah hasil revisi tanpa pembungkus penjelasan teks ataupun tag markdown (\`\`\`html).`
            },
            {
              role: 'user',
              content: `Kode HTML Saat Ini:
${dto.html}

Instruksi Revisi Pengguna:
${dto.instruction}`
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': 'Bear' + 'er ' + apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      let updatedHtml = response.data.choices[0].message.content.trim();
      if (updatedHtml.startsWith('```')) {
        updatedHtml = updatedHtml
          .replace(/^```(?:html)?\n?/i, '')
          .replace(/\n?```$/i, '')
          .trim();
      }

      updatedHtml = updatedHtml.replace(/{primaryColor}/g, dto.primaryColor);

      return { html: updatedHtml };
    } catch (error: any) {
      console.error('Error calling Groq API for section edit:', error?.message || error);
      throw new BadRequestException('Gagal mengubah kode HTML melalui AI');
    }
  }

  async generateAiSite(businessId: string, userId: string, dto: any) {
    await this.checkPermission(businessId, userId);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return this.localCompile(dto);
    }

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `Anda adalah AI Site Builder JagoBisnis berstandar internasional.
Tugas Anda adalah merancang landing page kustom dalam format JSON yang valid.

Desain halaman yang dihasilkan harus sangat premium, bersih, modern, dan penuh detail estetika mirip dengan hasil generate Lovable.dev, Vercel, dan Claude Artifacts.
Wajib menggunakan classes Tailwind CSS secara luas (seperti gradients, grid asimetris, cards, border tipis, bayangan sangat halus shadow-2xl/xl, serta inline styles untuk menyelaraskan visual dengan {primaryColor}).

Format JSON hasil rancangan Anda harus memiliki struktur persis seperti ini:
{
  "theme": {
    "primaryColor": "Hex warna utama kustom yang elegan sesuai kategori, contoh: #8D5B4C",
    "font": "Inter | Outfit | Playfair Display",
    "logoIcon": "coffee | sparkles | award | zap | globe | shopping-bag",
    "textColor": "#1e293b",
    "backgroundColor": "#fafaf9"
  },
  "sections": [
    {
      "id": "custom-hero-[timestamp]",
      "type": "custom-html",
      "order": 1,
      "content": {
        "html": "Masukkan kode HTML kustom untuk bagian Hero. Contoh struktur premium: <div class='relative py-20 lg:py-28 bg-slate-50/50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-900 overflow-hidden font-sans'><div class='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none'></div><div class='absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.08)_0%,transparent_100%)] rounded-full blur-3xl pointer-events-none' style='background: radial-gradient(circle, {primaryColor}0d 0%, transparent 100%)'></div><div class='max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10'><div class='lg:col-span-7 flex flex-col justify-center items-start text-left space-y-6'><div class='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest' style='background-color: {primaryColor}1a; color: {primaryColor}'>⚡ PREMIUM SERVICE</div><h1 class='text-4xl lg:text-[3.25rem] leading-[1.1] font-black text-slate-800 dark:text-white tracking-tight'>[Teks Judul Kustom]</h1><p class='text-sm text-slate-500 dark:text-zinc-400 font-semibold leading-relaxed max-w-xl'>[Sub text kustom]</p><div class='flex flex-wrap gap-4 pt-2'><a href='#products' class='px-7 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all text-center' style='background-color: {primaryColor}; shadow-color: {primaryColor}30'>[Booking button]</a><a href='#contact' class='px-7 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-bold text-xs uppercase tracking-wider hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-95 transition-all text-center'>Hubungi Kami</a></div></div><div class='lg:col-span-5 flex justify-center relative'><div class='w-full max-w-sm bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-850 shadow-2xl relative overflow-hidden flex flex-col justify-between h-48'><div class='flex items-center justify-between'><div class='w-10 h-10 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-500 font-black text-xl'>★</div><span class='text-[10px] font-extrabold uppercase tracking-widest text-[#primaryColor]' style='color: {primaryColor}'>AKTIF</span></div><div class='space-y-1.5'><div class='text-xs font-black text-slate-800 dark:text-white'>[Nama Bisnis]</div><div class='text-[10px] text-slate-400 font-bold leading-normal'>[Teks Pendek Slogan]</div></div></div></div></div></div>"
      }
    },
    {
      "id": "custom-about-[timestamp]",
      "type": "custom-html",
      "order": 2,
      "content": {
        "html": "Masukkan kode HTML kustom untuk Tentang Kami. Gunakan tata letak 2 kolom minimalis: kiri memuat bingkai visual (bisa menggunakan background berpola mesh atau box dengan rounded-3xl bergaris tipis), kanan berisikan teks dengan heading penanda angka kecil '02 / TENTANG KAMI', disusul paragraf penceritaan dengan quote tebal bergaya modern."
      }
    },
    {
      "id": "custom-features-[timestamp]",
      "type": "custom-html",
      "order": 3,
      "content": {
        "html": "Masukkan kode HTML Bento Grid modern untuk fitur keunggulan. Struktur bento grid: Kontainer besar memiliki 3 kartu (Card 1 menggunakan col-span-2 untuk menonjolkan fitur paling esensial, Card 2 dan 3 untuk fitur tambahan kecil). Setiap kartu wajib memiliki background putih solid dark:bg-zinc-900, border-zinc-200/60 dark:border-zinc-800/80 shadow-xs, rounded-3xl, padding lega (p-7), judul tebal, serta deskripsi yang di-style dengan warna teks redup."
      }
    },
    {
      "id": "products-[timestamp]",
      "type": "products",
      "order": 4,
      "content": {
        "title": "Produk & Layanan Pilihan",
        "showProducts": true
      }
    },
    {
      "id": "custom-faq-[timestamp]",
      "type": "custom-html",
      "order": 5,
      "content": {
        "html": "Masukkan kode HTML FAQ. Didesain bersih (Clean/Minimalis styling), dengan item interaktif yang memiliki border bawah saja border-b border-zinc-100 dark:border-zinc-900, memisahkan tanya-jawab secara renggang dan elegan."
      }
    },
    {
      "id": "custom-cta-[timestamp]",
      "type": "custom-html",
      "order": 6,
      "content": {
        "html": "Masukkan kode HTML Call-To-Action. Kerangka didesain luks: Container dengan background gelap arang bulat rounded-3xl p-12 text-center relative overflow-hidden, diselimuti gradasi warna primer tipis di latar, headline ajakan memikat, dan tombol WhatsApp dominan kencang yang memiliki bayangan melayang."
      }
    },
    {
      "id": "footer-[timestamp]",
      "type": "footer",
      "order": 7,
      "content": {
        "address": "Alamat lengkap fisik",
        "phone": "Nomor WhatsApp aktif",
        "copyright": "Teks hak cipta platform premium"
      }
    }
  ]
}

Aturan Penulisan HTML & CSS Premium:
1. Wajib ganti string '{primaryColor}' dengan nilai HEX warna primer dinamis di seluruh markup HTML kustom!
2. Jaga padding dan margin seimbang: Gunakan padding atas-bawah konsisten (py-12 sm:py-20) untuk memisahkan section.
3. Selalu bungkus elemen baris dalam wrapper kontainer lebar maksimal (max-w-6xl mx-auto w-full px-6) agar layout tidak melebar kaku dan berantakan.
4. Bagian KATALOG produk HARUS HANYA menggunakan tipe tipe standar "products" dengan isi content: { "title": "...", "showProducts": true } - JANGAN PERNAH dibuatkan custom-html untuk katalog!
5. Bagian FOOTER produk HARUS HANYA menggunakan tipe tipe standar "footer" dengan isi content: { "address": "...", "phone": "...", "copyright": "..." } - JANGAN PERNAH dibuatkan custom-html untuk footer!
6. Hilangkan pembatas string markdown (\`\`\`json) dan kembalikan hanya JSON murni.`
            },
            {
              role: 'user',
              content: `Instruksi PRD & Kriteria Visual Website:
${dto.refinedPrompt}`
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': 'Bear' + 'er ' + apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      let contentString = response.data.choices[0].message.content.trim();
      
      // Clean markdown code block wraps safely
      if (contentString.startsWith('```')) {
        contentString = contentString
          .replace(/^```(?:json)?\n?/i, '')
          .replace(/\n?```$/i, '')
          .trim();
      }

      const result = JSON.parse(contentString);
      const primaryColor = result.theme?.primaryColor || '#e8aa20';
      if (result.sections && Array.isArray(result.sections)) {
        result.sections = result.sections.map((s: any) => {
          if (s.type === 'custom-html' && s.content && s.content.html) {
            s.content.html = s.content.html.replace(/{primaryColor}/g, primaryColor);
          }
          return s;
        });
      }
      return result;
    } catch (error) {
      console.error('Error calling Groq API, falling back to local compile:', error);
      return this.localCompile(dto);
    }
  }

  private localCompile(dto: any) {
    const refinedPrompt = dto.refinedPrompt || '';
    
    const businessNameMatch = refinedPrompt.match(/nama brand \(([^)]+)\)/i) || refinedPrompt.match(/nama ([^\n]+)/i);
    const businessName = businessNameMatch ? businessNameMatch[1].trim() : 'Bisnis Anda';
    
    const categoryMatch = refinedPrompt.match(/klasifikasi usaha \(([^)]+)\)/i) || refinedPrompt.match(/usaha ([^\n]+)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : 'UMKM';

    const targetMatch = refinedPrompt.match(/target pelanggan ([^\n]+)/i) || refinedPrompt.match(/target pasar ([^\n]+)/i) || refinedPrompt.match(/pelanggan ([^\n]+)/i);
    const targetAudience = targetMatch ? targetMatch[1].trim() : 'Pelanggan Setia';

    const serviceMatch = refinedPrompt.match(/layanan unggulan ([^\n]+)/i) || refinedPrompt.match(/layanan ([^\n]+)/i);
    const keyService = serviceMatch ? serviceMatch[1].trim() : 'Layanan Premium';

    const visualStyle = refinedPrompt.toLowerCase().includes('mewah') ? 'Mewah' : 
                          refinedPrompt.toLowerCase().includes('hangat') ? 'Hangat' : 
                          refinedPrompt.toLowerCase().includes('bersih') ? 'Bersih' : 'Modern';

    let theme = {
      primaryColor: '#e8aa20',
      font: 'Outfit',
      logoIcon: 'globe',
      textColor: '#1f2937',
      backgroundColor: '#ffffff'
    };

    const styleKey = visualStyle.toLowerCase();
    
    if (styleKey.includes('hangat') || styleKey.includes('cozy')) {
      theme = {
        primaryColor: '#7c2d12',
        font: 'Outfit',
        logoIcon: 'coffee',
        textColor: '#1e293b',
        backgroundColor: '#fafaf9'
      };
    } else if (styleKey.includes('mewah') || styleKey.includes('elegan')) {
      theme = {
        primaryColor: '#b45309',
        font: 'Playfair Display',
        logoIcon: 'award',
        textColor: '#0f172a',
        backgroundColor: '#ffffff'
      };
    } else if (styleKey.includes('bersih') || styleKey.includes('segar')) {
      theme = {
        primaryColor: '#0284c7',
        font: 'Inter',
        logoIcon: 'sparkles',
        textColor: '#1f2937',
        backgroundColor: '#f8fafc'
      };
    } else if (styleKey.includes('modern') || styleKey.includes('cepat')) {
      theme = {
        primaryColor: '#6366f1',
        font: 'Outfit',
        logoIcon: 'zap',
        textColor: '#0f172a',
        backgroundColor: '#f8fafc'
      };
    }

    const isKateringOrFood = category.toLowerCase().search(/(makanan|kuliner|cafe|kopi|warkop|resto|katering)/i) !== -1;
    const isLaundryOrService = category.toLowerCase().search(/(laundry|cuci|servis|ac|laptop|bersih)/i) !== -1;

    const heroHeadline = isKateringOrFood 
      ? `Nikmati Menu Lezat & Kenikmatan Autentik dari ${businessName}`
      : isLaundryOrService 
        ? `Layanan ${category} Cepat & Bersih Eksklusif di Kota Anda`
        : `Solusi ${category} Profesional & Terpercaya di ${businessName}`;

    const heroSubheadline = `Dibuat khusus untuk memenuhi kepuasan ${targetAudience}. Kami menghadirkan kualitas terbaik pada layanan unggulan kami: ${keyService} dengan garansi kepuasan penuh.`;

    const sections = [
      {
        id: `hero-${Date.now()}`,
        type: 'hero',
        order: 1,
        content: {
          headline: heroHeadline,
          subheadline: heroSubheadline,
          buttonText: isKateringOrFood ? 'Lihat Daftar Menu' : 'Hubungi Kami Sekarang',
          buttonUrl: '#products',
          buttons: { custom: true, catalog: true, whatsapp: true, maps: false }
        }
      },
      {
        id: `about-${Date.now()}`,
        type: 'about',
        order: 2,
        content: {
          title: `Tentang ${businessName} — Komitmen Kualitas Terbaik`,
          description: `Didirikan atas landasan dedikasi kami untuk menyajikan layanan ${category} terbaik di kelasnya. Kami berfokus penuh untuk membantu ${targetAudience} mendapatkan kemudahan, kualitas, dan efisiensi melalui andalan kami, yaitu ${keyService}.`
        }
      },
      {
        id: `features-cards-${Date.now()}`,
        type: 'features-cards',
        order: 3,
        content: {
          title: `Kenapa Memilih ${businessName}?`,
          subtitle: `Kami bangga mempersembahkan standar pelayanan terbaik bagi ${targetAudience}.`,
          cards: [
            { title: 'Kualitas Premium', desc: `Diproses dengan bahan berkualitas tinggi serta presisi optimal.` },
            { title: 'Tepat & Cepat', desc: `Menghargai waktu berharga Anda dengan sistem selesainya pengerjaan terjadwal.` },
            { title: 'Layanan Personal', desc: `Menyesuaikan detail pengerjaan khusus mengikuti keinginan Anda: ${keyService}.` }
          ]
        }
      },
      {
        id: `products-${Date.now()}`,
        type: 'products',
        order: 4,
        content: {
          title: isKateringOrFood ? 'Daftar Menu & Katalog' : 'Pilihan Paket Layanan',
          showProducts: true
        }
      },
      {
        id: `faq-${Date.now()}`,
        type: 'faq',
        order: 5,
        content: {
          title: 'Pertanyaan yang Sering Ditanyakan',
          faqs: [
            { 
              q: `Apakah ${businessName} melayani pemesanan kustom?`, 
              a: `Tentu saja! Kami sangat fleksibel menyesuaikan layanan dengan permintaan spesial Anda terkait ${keyService}.` 
            },
            { 
              q: `Siapa saja yang biasanya menggunakan layanan ini?`, 
              a: `Layanan kami dirancang khusus memenuhi kenyamanan ${targetAudience}.` 
            },
            { 
              q: 'Bagaimana cara berkonsultasi atau melakukan pemesanan?', 
              a: 'Anda bisa langsung menekan tombol WhatsApp atau menu kontak di bawah ini. Tim admin responsif kami aktif membantu Anda.' 
            }
          ]
        }
      },
      {
        id: `cta-${Date.now()}`,
        type: 'cta',
        order: 6,
        content: {
          title: 'Siap Merasakan Kemudahan Bersama Kami?',
          subtitle: `Dapatkan konsultasi gratis dan potongan harga khusus pemesanan perdana minggu ini!`,
          buttonText: 'Mulai Chat WhatsApp',
          buttonUrl: '#contact'
        }
      },
      {
        id: `footer-${Date.now()}`,
        type: 'footer',
        order: 7,
        content: {
          address: 'Pusat Kawasan Niaga Utama, Blok A No. 10, Kota JagoBisnis',
          phone: '0812-9988-7766',
          copyright: `© 2026 ${businessName}. Seluruh Hak Cipta Dilindungi. Powered by JagoBisnis.`
        }
      }
    ];

    return { sections, theme };
  }
}

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
import { Role } from '@prisma/client';
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

    if (membership.role !== Role.OWNER && membership.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Hanya OWNER atau ADMIN yang dapat mengubah website',
      );
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

Anda bebas merancang layout dengan struktur HTML kustom menggunakan tipe section "custom-html". Namun, desain harus Strictly / Wajib mematuhi parameter UI/UX JagoBisnis berikut yang terinspirasi dari pustaka premium 21st.dev:
- Style: minimal, hangat, clean SaaS, modern UMKM.
- Tombol (Buttons): konsisten rounded-xl, padding seimbang (misal: px-6 py-3), teks berbobot tebal (font-bold).
- Kartu (Cards): subtle border tipis, soft shadow halus, padding konsisten, layout seimbang.
- Warna: Gunakan warna primer di dalam inline class/style inline CSS, contoh: style="background-color: {primaryColor}15; color: {primaryColor}"
- Arah Desain (Inspirasi 21st.dev):
  - Hero: Gunakan full layout dengan grid background overlay berpola garis/titik samar di background, teks asimetris dengan paduan badge dan subheadline modern.
  - Features: Gunakan list Bento Grid interaktif di mana ukuran kartu bervariasi (asimetris) dengan border yang membulat (rounded-3xl) dan bayangan super tipis.
  - FAQ: Gunakan susunan kustom accordion minimalis yang rapi bergaris tipis.

Format JSON hasil rancangan Anda harus memiliki struktur persis seperti ini:
{
  "theme": {
    "primaryColor": "Hex warna primer yang melambangkan identitas visual bisnis (warm & professional), contoh: #8D5B4C",
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
        "html": "Masukkan struktur HTML untuk opening banner terinspirasi 21st.dev. Gunakan container: <div class='relative py-24 bg-zinc-50/50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-900'><div class='absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,{primaryColor}0d,rgba(255,255,255,0))]pointer-events-none'></div><div class='max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10'>...</div></div>. Sediakan heading menarik, button w/ background {primaryColor}, dan ornamen kartu ringkas di bagian kanan."
      }
    },
    {
      "id": "custom-about-[timestamp]",
      "type": "custom-html",
      "order": 2,
      "content": {
        "html": "Masukkan struktur HTML Tentang Usaha (About) yang asimetris indah dengan split screen layout (kiri: deskripsi naratif tebal dengan quote statis, kanan: visual grid mini dengan border tipis)."
      }
    },
    {
      "id": "custom-features-[timestamp]",
      "type": "custom-html",
      "order": 3,
      "content": {
        "html": "Masukkan struktur HTML keunggulan bertipe Bento Grid (asimetris) dengan 3 kartu: satu kartu lebar (col-span-2) dan dua kartu kecil, semuanya dibalut border border-zinc-200/60 dark:border-zinc-800/80, shadow-xs, rounded-3xl, dan layout padding seimbang."
      }
    },
    {
      "id": "products-[timestamp]",
      "type": "products",
      "order": 4,
      "content": {
        "title": "Produk & Layanan Unggulan",
        "showProducts": true
      }
    },
    {
      "id": "custom-faq-[timestamp]",
      "type": "custom-html",
      "order": 5,
      "content": {
        "html": "Masukkan struktur HTML FAQ (Q&A) berupa daftar list minimalis berjarak lega border-b border-zinc-100 dark:border-zinc-900."
      }
    },
    {
      "id": "custom-cta-[timestamp]",
      "type": "custom-html",
      "order": 6,
      "content": {
        "html": "Masukkan struktur HTML Call-To-Action yang megah (background solid dark atau gradient {primaryColor}1a) dipadukan tombol WhatsApp bundar tebal (rounded-xl) dengan efek bayangan melayang."
      }
    },
    {
      "id": "footer-[timestamp]",
      "type": "footer",
      "order": 7,
      "content": {
        "address": "Alamat fisik lengkap",
        "phone": "Nomor WA",
        "copyright": "Teks hak cipta"
      }
    }
  ]
}

Aturan Penting HTML & Tailwind:
1. Ganti string '{primaryColor}' dengan nilai hex warna yang Anda tentukan di theme.primaryColor pada HTML pengerjaan pemicu warna dinamis.
2. Gunakan padding-x (\`px-4 sm:px-6 lg:px-8\`) dan batasan lebar kontainer (\`max-w-6xl mx-auto w-full\`) untuk seluruh section agar elemen tidak merapat ke ujung layar.
3. Jaga ukuran font tetap seimbang (misal judul hero maksimal \`text-3xl sm:text-5xl font-extrabold tracking-tight\`).
4. Semua copywriting teks harus menggunakan Bahasa Indonesia yang profesional dan persuasif untuk menarik prospek pembeli.
5. Kembalikan HANYA JSON murni tanpa pembatas string markdown.`
            },
            {
              role: 'user',
              content: `Nama Bisnis: ${dto.businessName}
Kategori/Bidang: ${dto.category}
Target Pelanggan Utama: ${dto.targetAudience}
Layanan/Produk Unggulan: ${dto.keyService}
Gaya Visual Pilihan: ${dto.visualStyle}`
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

      const result = JSON.parse(response.data.choices[0].message.content);
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
    const { businessName, category, targetAudience, keyService, visualStyle } = dto;
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

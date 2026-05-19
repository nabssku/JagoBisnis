import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jago-bisnis.my.id"),
  title: {
    default: "JagoBisnis | Solusi Website & POS Digital UMKM Terbaik",
    template: "%s | JagoBisnis"
  },
  description: "Bangun website portofolio, katalog produk, dan kelola kasir digital POS (Point of Sale) bisnis UMKM Anda dalam hitungan menit secara instan, aman, dan profesional.",
  keywords: ["website builder umkm", "aplikasi kasir gratis", "pos digital", "pembuat website instan", "jagobisnis", "website kasirku"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "JagoBisnis | Solusi Website & POS Digital UMKM Terbaik",
    description: "Bangun website portofolio, katalog produk, dan kelola kasir digital POS (Point of Sale) bisnis UMKM Anda dalam hitungan menit secara instan, aman, dan profesional.",
    type: "website",
    url: "https://jago-bisnis.my.id",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JagoBisnis - Solusi Digital UMKM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JagoBisnis | Solusi Website & POS Digital UMKM Terbaik",
    description: "Bangun website portofolio, katalog produk, dan kelola kasir digital POS (Point of Sale) bisnis UMKM Anda dalam hitungan menit secara instan, aman, dan profesional.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "EvS2na51FGrNH_Tkf2U8t42eYDjr0-iarbHjym6lFQ0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

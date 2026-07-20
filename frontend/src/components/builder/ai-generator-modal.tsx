"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { 
  Sparkles, 
  X, 
  Send, 
  BrainCircuit,
  MessageSquare,
  User,
  Bot
} from 'lucide-react';
import { Section, SiteTheme } from '@/types/site';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: { sections: Section[]; theme: SiteTheme }) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[]; // Quick action buttons for user selection
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ 
  isOpen, 
  onClose, 
  onGenerate 
}) => {
  const params = useParams();
  const businessId = params?.id as string;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [step, setStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  // Answers object to hold builder settings
  const [answers, setAnswers] = useState({
    businessName: '',
    category: '',
    targetAudience: '',
    keyService: '',
    visualStyle: ''
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initiate Chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: 'init',
            sender: 'ai',
            text: 'Halo! Saya AI Builder JagoBisnis. Saya akan memandu Anda merancang halaman website profesional secara kustom. Pertama-tama, **siapa nama bisnis/toko Anda?**'
          }
        ]);
        setIsTyping(false);
      }, 800);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const rawVal = textToSend || inputVal.trim();
    if (!rawVal) return;

    if (!textToSend) setInputVal(''); // Clear input

    // 1. Add user message
    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: rawVal }]);
    setIsTyping(true);

    // 2. Set answer data based on current step & initiate next step
    setTimeout(() => {
      let nextStep = step + 1;
      setStep(nextStep);

      const categoryOptions = ['Kafe Kopi', 'Pakaian & Fashion', 'Laundry Servis', 'Kuliner & F&B', 'Jasa / Servis Laptop', 'Lainnya'];
      const styleOptions = ['Hangat & Cozy ☕', 'Mewah & Elegan 👑', 'Bersih & Segar 🍃', 'Modern & Cepat ⚡'];

      if (step === 1) {
        setAnswers(prev => ({ ...prev, businessName: rawVal }));
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Nama yang bagus! Kategori bisnis apa yang dijalankan oleh **${rawVal}**? Anda bisa memilih opsi di bawah ini atau mengetik sendiri.`,
          options: categoryOptions
        }]);
      } else if (step === 2) {
        setAnswers(prev => ({ ...prev, category: rawVal }));
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Siapa **target pelanggan utama** Anda? (Contoh: Mahasiswa, pekerja kantoran, keluarga, ibu rumah tangga, dll)`
        }]);
      } else if (step === 3) {
        setAnswers(prev => ({ ...prev, targetAudience: rawVal }));
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Oke! Apa **layanan atau produk unggulan** yang paling ingin Anda tonjolkan di halaman utama website nanti?`
        }]);
      } else if (step === 4) {
        setAnswers(prev => ({ ...prev, keyService: rawVal }));
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Terakhir, **kesan visual & warna** seperti apa yang ingin Anda tampilkan pada website ini? Silakan pilih salah satu opsi preset di bawah:`,
          options: styleOptions
        }]);
      } else if (step === 5) {
        const visualChoice = rawVal.replace(/[^\w\s&]/gi, '').trim(); // clean emojis
        setAnswers(prev => ({ ...prev, visualStyle: visualChoice }));
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Luar biasa! Seluruh data kustom untuk **${answers.businessName}** sudah terkumpul. Saya akan merancang layout komponen, memilih tema warna, dan menulis teks penawaran personal untuk Anda.\n\nKlik **"Rancang Website Sekarang"** di bawah ini untuk melihat keajaibannya!`
        }]);
      }

      setIsTyping(false);
    }, 1000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);

    const loadingTexts = [
      'Menganalisis detail percakapan kita... 🧠',
      'Memformulasikan palet warna dinamis kustom... 🎨',
      'Mengarang copywriting pemasaran bahasa Indonesia... ✍️',
      'Merangkai layout grid komponen responsif... 🏗️',
      'Menyelesaikan struktur file visual builder... ✨'
    ];

    let textIdx = 0;
    setLoadingText(loadingTexts[0]);

    // Start loading progress indicator
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Hold at 90% until backend handles completion
        }
        const nextVal = prev + Math.floor(Math.random() * 4) + 2;
        const currentIdx = Math.min(Math.floor(nextVal / 20), loadingTexts.length - 1);
        setLoadingText(loadingTexts[currentIdx]);
        return nextVal;
      });
    }, 70);

    // Call backend API concurrently to save generation time
    siteService.generateAiSite(businessId, answers)
      .then((data) => {
        clearInterval(interval);
        setProgress(100);
        setLoadingText('Selesai merapikan visual builder... ✨');
        setTimeout(() => {
          onGenerate(data);
          setIsGenerating(false);
          onClose();
        }, 600);
      })
      .catch((error) => {
        console.error('Frontend error calling Ai site generator, using local fallback:', error);
        clearInterval(interval);
        // Instant local compile fallback in case of connection/API issues
        const localData = compileDynamicLayout(answers);
        setProgress(100);
        setLoadingText('Selesai merapikan visual builder... ✨');
        setTimeout(() => {
          onGenerate(localData);
          setIsGenerating(false);
          onClose();
        }, 600);
      });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl p-6 relative overflow-hidden flex flex-col h-[600px] max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">AI Chat Onboarding Builder</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Rancang website unik dari hasil ngobrol dengan AI</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isGenerating}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isGenerating ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin mb-4 flex flex-col">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%] text-xs font-semibold leading-relaxed p-3.5 rounded-2xl",
                    msg.sender === 'ai' 
                      ? "bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 self-start text-gray-900 dark:text-zinc-100" 
                      : "bg-amber-500 text-white self-end"
                  )}
                >
                  {msg.sender === 'ai' && (
                    <div className="h-6 w-6 shrink-0 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 mt-0.5">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <p className="whitespace-pre-line">{msg.text}</p>
                    
                    {/* Render Quick Options */}
                    {msg.options && msg.options.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSendMessage(opt)}
                            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 active:scale-95 transition-all cursor-pointer text-[10px]"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="h-6 w-6 shrink-0 rounded-lg bg-white/20 flex items-center justify-center text-white mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 p-3.5 rounded-2xl self-start max-w-[80%]">
                  <div className="h-6 w-6 shrink-0 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1 py-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input / Control Bar */}
            <div className="border-t border-zinc-100 dark:border-zinc-900 pt-3">
              {step > 5 ? (
                /* Completed Stage: Run Generator Button */
                <Button 
                  onClick={handleGenerate} 
                  className="w-full rounded-2xl h-12 text-sm font-extrabold text-white bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/15 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4.5 w-4.5 fill-white" />
                  Rancang Website Sekarang
                </Button>
              ) : (
                /* Text Typing Form */
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative flex items-center"
                >
                  <input
                    disabled={isTyping}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ketik tanggapan Anda di sini..."
                    className="w-full h-12 pl-4 pr-12 text-xs font-semibold rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-gray-905 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !inputVal.trim()}
                    className={cn(
                      "absolute right-2 h-8 w-8 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                      inputVal.trim() && !isTyping 
                        ? "bg-amber-500 text-white" 
                        : "bg-gray-100 dark:bg-zinc-900 text-muted-foreground"
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        ) : (
          /* High-Fidelity Generating State */
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 space-y-6">
            <div className="relative h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin" />
              <BrainCircuit className="h-8 w-8 text-amber-500 animate-pulse" />
            </div>

            <div className="space-y-2 text-center w-full max-w-sm">
              <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{loadingText}</div>
              <div className="h-2 w-full bg-gray-100 dark:bg-zinc-850 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-100 shadow-md shadow-amber-500/30" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground/80 font-bold">{progress}% Selesai</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Truly Dynamic Copier and Block Compositior based on Chat Answers
function compileDynamicLayout(answers: {
  businessName: string;
  category: string;
  targetAudience: string;
  keyService: string;
  visualStyle: string;
}): { sections: Section[]; theme: SiteTheme } {
  
  const { businessName, category, targetAudience, keyService, visualStyle } = answers;
  
  // 1. Pick Custom Colors & Font style based on visualStyle choice
  let theme: SiteTheme = {
    primaryColor: '#e8aa20',
    font: 'Outfit',
    logoIcon: 'globe',
    textColor: '#1f2937',
    backgroundColor: '#ffffff'
  };

  const styleKey = visualStyle.toLowerCase();
  
  if (styleKey.includes('hangat') || styleKey.includes('cozy')) {
    theme = {
      primaryColor: '#7c2d12', // Rust brown
      font: 'Outfit',
      logoIcon: 'coffee',
      textColor: '#1e293b',
      backgroundColor: '#fafaf9'
    };
  } else if (styleKey.includes('mewah') || styleKey.includes('elegan')) {
    theme = {
      primaryColor: '#b45309', // Deep Bronze/Gold
      font: 'Playfair Display',
      logoIcon: 'award',
      textColor: '#0f172a',
      backgroundColor: '#ffffff'
    };
  } else if (styleKey.includes('bersih') || styleKey.includes('segar')) {
    theme = {
      primaryColor: '#0284c7', // Sky Blue
      font: 'Inter',
      logoIcon: 'sparkles',
      textColor: '#1f2937',
      backgroundColor: '#f8fafc'
    };
  } else if (styleKey.includes('modern') || styleKey.includes('cepat')) {
    theme = {
      primaryColor: '#6366f1', // Indigo
      font: 'Outfit',
      logoIcon: 'zap',
      textColor: '#0f172a',
      backgroundColor: '#f8fafc'
    };
  }

  // Inject standard Tailwind/Builder extra metrics mapping safely
  theme = {
    ...theme,
    ...({
      secondaryColor: '#1e1b4b',
      accentColor: theme.primaryColor,
      headingFont: theme.font,
      bodyFont: 'Inter',
      borderRadius: '1rem',
      shadowStyle: 'lg',
      buttonStyle: 'pill',
      linkStyle: 'hover-underline',
      spacingSystem: 'cozy'
    } as any)
  };

  // 2. Generate customized copy incorporating variables dynamically
  const isKateringOrFood = category.toLowerCase().search(/(makanan|kuliner|cafe|kopi|warkop|resto|katering)/i) !== -1;
  const isLaundryOrService = category.toLowerCase().search(/(laundry|cuci|servis|ac|laptop|bersih)/i) !== -1;

  const heroHeadline = isKateringOrFood 
    ? `Nikmati Menu Lezat & Kenikmatan Autentik dari ${businessName}`
    : isLaundryOrService 
      ? `Layanan ${category} Cepat & Bersih Eksklusif di Kota Anda`
      : `Solusi ${category} Profesional & Terpercaya di ${businessName}`;

  const heroSubheadline = `Dibuat khusus untuk memenuhi kepuasan ${targetAudience}. Kami menghadirkan kualitas terbaik pada layanan unggulan kami: **${keyService}** dengan garansi kepuasan penuh.`;

  const aboutTitle = `Tentang ${businessName} — Komitmen Kualitas Terbaik`;
  
  const aboutDesc = `Didirikan atas landasan dedikasi kami untuk menyajikan layanan ${category} terbaik di kelasnya. Kami berfokus penuh untuk membantu ${targetAudience} mendapatkan kemudahan, kualitas, dan efisiensi melalui andalan kami, yaitu ${keyService}.`;

  const featuresTitle = `Kenapa Memilih ${businessName}?`;

  const sections: Section[] = [
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
        title: aboutTitle,
        description: aboutDesc
      }
    },
    {
      id: `features-cards-${Date.now()}`,
      type: 'features-cards',
      order: 3,
      content: {
        title: featuresTitle,
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

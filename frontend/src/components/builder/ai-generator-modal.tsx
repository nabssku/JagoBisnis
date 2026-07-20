"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { siteService } from '@/services/site.service';
import { 
  Sparkles, 
  X, 
  BrainCircuit,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  LayoutTemplate
} from 'lucide-react';
import { Section, SiteTheme } from '@/types/site';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: { sections: Section[]; theme: SiteTheme }) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ 
  isOpen, 
  onClose, 
  onGenerate 
}) => {
  const params = useParams();
  const businessId = params?.id as string;

  const [rawDesc, setRawDesc] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [phase, setPhase] = useState<'input' | 'refine' | 'loading'>('input');
  
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  if (!isOpen) return null;

  const handleRefinePrompt = async () => {
    if (!rawDesc.trim()) {
      toast.error('Masukkan deskripsi usaha Anda terlebih dahulu');
      return;
    }
    setIsRefining(true);
    try {
      const response = await siteService.refineAiPrompt(businessId, rawDesc);
      setRefinedPrompt(response.refinedPrompt);
      setPhase('refine');
    } catch (error) {
      console.error('Error refining prompt:', error);
      toast.error('Gagal memperhalus rencana dengan AI, silakan tulis lebih banyak kata kunci.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleBuildWebsite = () => {
    setPhase('loading');
    setProgress(0);

    const loadingTexts = [
      'Menganalisis blueprint rencana layout... 🧠',
      'Meracik kerangka visual komponen asimetris 21st.dev... 🎨',
      'Menyusun kerangka Tailwind CSS responsif... 🏗️',
      'Menulis copywriting bahasa Indonesia persuasif... ✍️',
      'Menyelesaikan struktur file visual builder di database... ✨'
    ];

    setLoadingText(loadingTexts[0]);

    // Start progress loader bar simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Hold at 90% until backend handles completion
        }
        const nextVal = prev + Math.floor(Math.random() * 4) + 1;
        const currentIdx = Math.min(Math.floor(nextVal / 20), loadingTexts.length - 1);
        setLoadingText(loadingTexts[currentIdx]);
        return nextVal;
      });
    }, 70);

    // Call site-generation backend API with refined prompt
    siteService.generateAiSite(businessId, { refinedPrompt })
      .then((data) => {
        clearInterval(interval);
        setProgress(100);
        setLoadingText('Selesai merapikan komponen visual... ✨');
        setTimeout(() => {
          onGenerate(data);
          onClose();
          // Reset states on success
          setPhase('input');
          setRawDesc('');
          setRefinedPrompt('');
        }, 500);
      })
      .catch((error) => {
        console.error('Error during AI website generation:', error);
        toast.error('Gagal melakukan perancangan via AI, silakan coba lagi.');
        clearInterval(interval);
        setPhase('refine');
      });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl p-6 relative overflow-hidden flex flex-col h-[520px] max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b border-zinc-100 dark:border-zinc-900 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">AI visual builder editor</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Rancang website unik dari PRD & kustom HTML Tailwind</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (phase !== 'loading') {
                onClose();
                setPhase('input');
                setRawDesc('');
                setRefinedPrompt('');
              }
            }} 
            disabled={phase === 'loading'}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Phase content */}
        {phase === 'input' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                  Apa ide atau deskripsi website bisnis Anda?
                </label>
                <textarea
                  value={rawDesc}
                  onChange={(e) => setRawDesc(e.target.value)}
                  placeholder="Contoh: Barbershop dengan nama Barberutas, target anak muda, layanannya potong rambut premium dan cukur..."
                  className="w-full h-44 p-4 text-xs font-semibold rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all scrollbar-thin"
                />
              </div>
              <p className="text-[9px] text-muted-foreground leading-normal">
                * Tuliskan nama brand, kategori usaha, layanan unggulan, pilihan gaya visual, atau target pasar secara bebas. AI akan merapikannya menjadi rencana PRD yang rapi dan megah.
              </p>
            </div>

            <Button
              onClick={handleRefinePrompt}
              disabled={isRefining || !rawDesc.trim()}
              className="w-full rounded-2xl h-12 text-xs font-extrabold text-white bg-amber-500 hover:bg-amber-600 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isRefining ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Menganalisis & Merumuskan PRD Rencana...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 fill-white" />
                  Analisis & Sempurnakan dengan AI
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {phase === 'refine' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
              <label className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-widest flex items-center gap-2 shrink-0">
                <LayoutTemplate className="h-3.5 w-3.5 text-amber-500" />
                Review PRD Rencana Desain (Kustomisasi Prompt Akhir)
              </label>
              
              <textarea
                value={refinedPrompt}
                onChange={(e) => setRefinedPrompt(e.target.value)}
                className="flex-1 w-full p-4 text-xs font-mono font-medium leading-relaxed rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none overflow-y-auto scrollbar-thin"
              />
              <p className="text-[9px] text-muted-foreground shrink-0 leading-normal">
                * Anda bisa langsung mengedit, menambah, atau mengurangi teks di atas sebelum dikirim ke mesin generator visual kustom HTML.
              </p>
            </div>

            <div className="flex gap-2.5 pt-4 shrink-0">
              <Button 
                variant="outline" 
                onClick={() => setPhase('input')}
                className="flex-1 rounded-xl h-11 text-xs font-bold"
              >
                Kembali
              </Button>
              <Button 
                onClick={handleBuildWebsite} 
                className="flex-[2] rounded-xl h-11 text-xs font-extrabold text-white bg-amber-500 hover:bg-amber-600 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all text-center"
              >
                <Sparkles className="h-4 w-4 fill-white" />
                Mulai Rancang Website Kustom
              </Button>
            </div>
          </div>
        )}

        {phase === 'loading' && (
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

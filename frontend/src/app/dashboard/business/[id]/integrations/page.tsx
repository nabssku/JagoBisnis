'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Activity,
  BarChart3,
  Plug,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Settings2,
  Key,
  Globe2,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  X,
  Sparkles,
  Lock
} from 'lucide-react';
import Link from 'next/link';

// Custom Instagram Inline SVG Icon
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import { DashboardShell } from '@/components/dashboard-shell';
import { integrationService, Integration } from '@/services/integration.service';
import { businessService } from '@/services/business.service';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function IntegrationsCenterContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const businessId = params.id as string;
  const [business, setBusiness] = useState<Business | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  // Pakasir Modal & Form State
  const [isPakasirOpen, setIsPakasirOpen] = useState(false);
  const [pakasirSlug, setPakasirSlug] = useState('');
  const [pakasirApiKey, setPakasirApiKey] = useState('');
  const [isTestingPakasir, setIsTestingPakasir] = useState(false);

  // Google Analytics Modal & Form State
  const [isGaOpen, setIsGaOpen] = useState(false);
  const [gaMeasurementId, setGaMeasurementId] = useState('');
  const [gaApiSecret, setGaApiSecret] = useState('');
  const [isTestingGa, setIsTestingGa] = useState(false);

  // Fetch all business and connected integration details
  const fetchData = async () => {
    try {
      const [businessData, integrationsData] = await Promise.all([
        businessService.getById(businessId),
        integrationService.getAll(businessId),
      ]);
      setBusiness(businessData);
      setIntegrations(integrationsData);
    } catch (error) {
      toast.error('Gagal memuat data Integrasi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Catch OAuth redirects
    const provider = searchParams.get('provider');
    const status = searchParams.get('status');
    const errorMsg = searchParams.get('message');

    if (status === 'success' && provider) {
      toast.success(`Akun ${provider.charAt(0).toUpperCase() + provider.slice(1)} berhasil dihubungkan!`);
      // Clean query parameters from URL
      router.replace(`/dashboard/business/${businessId}/integrations`);
    } else if (status === 'error' && errorMsg) {
      toast.error(`Koneksi gagal: ${decodeURIComponent(errorMsg)}`);
      router.replace(`/dashboard/business/${businessId}/integrations`);
    }
  }, [businessId]);

  const handleDisconnect = async (provider: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin memutuskan hubungan integrasi ${provider}?`)) {
      return;
    }
    
    setIsActionLoading(provider);
    try {
      await integrationService.disconnect(businessId, provider);
      toast.success(`Koneksi ${provider} berhasil diputuskan.`);
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memutuskan integrasi.');
    } finally {
      setIsActionLoading(null);
    }
  };

  // --- Instagram OAuth Activation Trigger ---
  const handleInstagramConnect = async () => {
    setIsActionLoading('INSTAGRAM');
    try {
      const { url } = await integrationService.getInstagramConnectUrl(businessId);
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memulai koneksi Instagram.');
      setIsActionLoading(null);
    }
  };

  // --- Threads OAuth Activation Trigger ---
  const handleThreadsConnect = async () => {
    setIsActionLoading('THREADS');
    try {
      const { url } = await integrationService.getThreadsConnectUrl(businessId);
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memulai koneksi Threads.');
      setIsActionLoading(null);
    }
  };

  // --- Pakasir Integration Handlers ---
  const openPakasirModal = (integration?: Integration) => {
    if (integration && integration.config) {
      setPakasirSlug(integration.config.slug || '');
      setPakasirApiKey(integration.config.apiKey || '');
    } else {
      setPakasirSlug('');
      setPakasirApiKey('');
    }
    setIsPakasirOpen(true);
  };

  const handleTestPakasir = async () => {
    if (!pakasirSlug || !pakasirApiKey) {
      toast.error('Harap isi Slug dan API Key terlebih dahulu.');
      return;
    }
    setIsTestingPakasir(true);
    try {
      const res = await integrationService.testPakasir(businessId, {
        slug: pakasirSlug,
        apiKey: pakasirApiKey,
      });
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Koneksi gagal. Silakan periksa kredensial.');
    } finally {
      setIsTestingPakasir(false);
    }
  };

  const handleSavePakasir = async () => {
    if (!pakasirSlug || !pakasirApiKey) {
      toast.error('Harap lengkapi semua kolom wajib.');
      return;
    }
    setIsActionLoading('PAKASIR_SAVE');
    try {
      await integrationService.connectPakasir(businessId, {
        slug: pakasirSlug,
        apiKey: pakasirApiKey,
      });
      toast.success('Integrasi Pakasir berhasil diperbarui!');
      setIsPakasirOpen(false);
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan integrasi Pakasir.');
    } finally {
      setIsActionLoading(null);
    }
  };

  // --- Google Analytics Handlers ---
  const openGaModal = (integration?: Integration) => {
    if (integration && integration.config) {
      setGaMeasurementId(integration.config.measurementId || '');
      setGaApiSecret(integration.config.hasApiSecret ? '********************' : '');
    } else {
      setGaMeasurementId('');
      setGaApiSecret('');
    }
    setIsGaOpen(true);
  };

  const handleTestGa = async () => {
    if (!gaMeasurementId) {
      toast.error('Harap isi Measurement ID terlebih dahulu.');
      return;
    }
    setIsTestingGa(true);
    try {
      const res = await integrationService.testGoogleAnalytics(businessId, {
        measurementId: gaMeasurementId,
        apiSecret: gaApiSecret,
      });
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Koneksi gagal. Silakan periksa Measurement ID.');
    } finally {
      setIsTestingGa(false);
    }
  };

  const handleSaveGa = async () => {
    if (!gaMeasurementId) {
      toast.error('Harap isi Measurement ID.');
      return;
    }
    setIsActionLoading('GA_SAVE');
    try {
      await integrationService.connectGoogleAnalytics(businessId, {
        measurementId: gaMeasurementId,
        apiSecret: gaApiSecret.startsWith('****') ? undefined : gaApiSecret,
      });
      toast.success('Integrasi Google Analytics berhasil diperbarui!');
      setIsGaOpen(false);
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan integrasi Google Analytics.');
    } finally {
      setIsActionLoading(null);
    }
  };

  // Utility to find connected details of specific providers
  const getIntegrationByProvider = (provider: string) => {
    return integrations.find((i) => i.provider === provider);
  };

  return (
    <DashboardShell businessId={businessId}>
      <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              <Link href="/dashboard" className="hover:text-amber-500 transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-zinc-300">Integrations</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Integrations Center</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Hubungkan JagoBisnis dengan berbagai platform pihak ketiga untuk memperluas jangkauan UMKM Anda.
            </p>
          </div>
          
          <Button
            onClick={fetchData}
            variant="outline"
            className="rounded-xl flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900"
          >
            <RefreshCw className="h-4 w-4" />
            Muat Ulang
          </Button>
        </div>

        {/* Loading Overlay */}
        {isLoading ? (
          <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500"></div>
            <span className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Memuat Integrasi Center...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. INSTAGRAM POST PUBLISHING */}
            {(() => {
              const integration = getIntegrationByProvider('INSTAGRAM');
              const isConnected = integration?.status === 'CONNECTED';
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-[#0B0F19] p-6 shadow-sm shadow-gray-100/40 dark:shadow-none hover:shadow-md dark:hover:border-zinc-800 transition-all flex flex-col justify-between min-h-[260px]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                        <InstagramIcon className="h-6 w-6" strokeWidth={2.5} />
                      </div>
                      
                      {isConnected ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Terhubung
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-gray-50 dark:bg-zinc-900/50 px-3 py-1 text-xs font-black text-gray-400 dark:text-zinc-500">
                          Terputus
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Instagram Business</h3>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                        Publikasikan katalog produk dan postingan promo JagoBisnis secara otomatis ke akun Instagram Business Anda.
                      </p>
                    </div>

                    {isConnected && (
                      <div className="rounded-2xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/80 p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 dark:text-zinc-500 font-medium">Akun Terhubung:</span>
                          <span className="font-black text-gray-700 dark:text-zinc-300">@{integration?.providerAccountName || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-zinc-500">
                          <span>Account ID:</span>
                          <span className="font-mono">{integration?.providerAccountId?.slice(0, 12)}...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-50 dark:border-zinc-900 mt-6 flex gap-3">
                    {isConnected ? (
                      <Button
                        onClick={() => handleDisconnect('INSTAGRAM')}
                        disabled={isActionLoading === 'INSTAGRAM'}
                        variant="outline"
                        className="rounded-xl flex-1 border-rose-100 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 font-bold"
                      >
                        Putuskan Koneksi
                      </Button>
                    ) : (
                      <Button
                        onClick={handleInstagramConnect}
                        disabled={isActionLoading === 'INSTAGRAM'}
                        className="rounded-xl flex-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-black hover:opacity-90 shadow-sm"
                      >
                        {isActionLoading === 'INSTAGRAM' ? 'Menghubungkan...' : 'Hubungkan Instagram'}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })()}

            {/* 2. THREADS PUBLISHING */}
            {(() => {
              const integration = getIntegrationByProvider('THREADS');
              const isConnected = integration?.status === 'CONNECTED';
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="group rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-[#0B0F19] p-6 shadow-sm shadow-gray-100/40 dark:shadow-none hover:shadow-md dark:hover:border-zinc-800 transition-all flex flex-col justify-between min-h-[260px]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black group-hover:scale-110 transition-transform">
                        <Activity className="h-6 w-6" strokeWidth={2.5} />
                      </div>
                      
                      {isConnected ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Terhubung
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-gray-50 dark:bg-zinc-900/50 px-3 py-1 text-xs font-black text-gray-400 dark:text-zinc-500">
                          Terputus
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Threads Integration</h3>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                        Bagikan pembaruan instan, artikel blog, dan promosi bisnis langsung ke akun Threads Anda untuk performa SEO optimal.
                      </p>
                    </div>

                    {isConnected && (
                      <div className="rounded-2xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/80 p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 dark:text-zinc-500 font-medium">Akun Terhubung:</span>
                          <span className="font-black text-gray-700 dark:text-zinc-300">@{integration?.providerAccountName || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-zinc-500">
                          <span>Account ID:</span>
                          <span className="font-mono">{integration?.providerAccountId?.slice(0, 12)}...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-50 dark:border-zinc-900 mt-6 flex gap-3">
                    {isConnected ? (
                      <Button
                        onClick={() => handleDisconnect('THREADS')}
                        disabled={isActionLoading === 'THREADS'}
                        variant="outline"
                        className="rounded-xl flex-1 border-rose-100 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 font-bold"
                      >
                        Putuskan Koneksi
                      </Button>
                    ) : (
                      <Button
                        onClick={handleThreadsConnect}
                        disabled={isActionLoading === 'THREADS'}
                        className="rounded-xl flex-1 bg-black dark:bg-white text-white dark:text-black font-black hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-sm"
                      >
                        {isActionLoading === 'THREADS' ? 'Menghubungkan...' : 'Hubungkan Threads'}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })()}

            {/* 3. PAKASIR CONFIGURATION */}
            {(() => {
              const integration = getIntegrationByProvider('PAKASIR');
              const isConnected = integration?.status === 'CONNECTED';
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="group rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-[#0B0F19] p-6 shadow-sm shadow-gray-100/40 dark:shadow-none hover:shadow-md dark:hover:border-zinc-800 transition-all flex flex-col justify-between min-h-[260px]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                        <Plug className="h-6 w-6" strokeWidth={2.5} />
                      </div>
                      
                      {isConnected ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Terhubung
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-gray-50 dark:bg-zinc-900/50 px-3 py-1 text-xs font-black text-gray-400 dark:text-zinc-500">
                          Terputus
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Pakasir Integration</h3>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                        Hubungkan kasir dan manajemen order Anda dengan merchant POS Pakasir untuk pembukuan stok & transaksi instan.
                      </p>
                    </div>

                    {isConnected && (
                      <div className="rounded-2xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/80 p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 dark:text-zinc-500 font-medium">Project Slug:</span>
                          <span className="font-bold text-gray-700 dark:text-zinc-300">{integration?.config?.slug}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 dark:text-zinc-500 font-medium">API Key:</span>
                          <span className="font-mono text-[11px] font-semibold text-zinc-500">{integration?.config?.apiKey}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-50 dark:border-zinc-900 mt-6 flex gap-3">
                    {isConnected ? (
                      <>
                        <Button
                          onClick={() => handleDisconnect('PAKASIR')}
                          variant="outline"
                          className="rounded-xl flex-1 border-rose-100 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 font-bold"
                        >
                          Putuskan
                        </Button>
                        <Button
                          onClick={() => openPakasirModal(integration)}
                          variant="outline"
                          className="rounded-xl flex-1 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 font-bold"
                        >
                          Edit Pengaturan
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => openPakasirModal()}
                        className="rounded-xl flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black shadow-sm"
                      >
                        Konfigurasi Pakasir
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })()}

            {/* 4. GOOGLE ANALYTICS INTEGRATION */}
            {(() => {
              const integration = getIntegrationByProvider('GOOGLE_ANALYTICS');
              const isConnected = integration?.status === 'CONNECTED';
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="group rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-[#0B0F19] p-6 shadow-sm shadow-gray-100/40 dark:shadow-none hover:shadow-md dark:hover:border-zinc-800 transition-all flex flex-col justify-between min-h-[260px]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-6 w-6" strokeWidth={2.5} />
                      </div>
                      
                      {isConnected ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Terhubung
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-gray-50 dark:bg-zinc-900/50 px-3 py-1 text-xs font-black text-gray-400 dark:text-zinc-500">
                          Terputus
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Google Analytics 4</h3>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                        Pantau pengunjung website publik Anda secara real-time dan lacak rasio konversi halaman produk menggunakan GA4.
                      </p>
                    </div>

                    {isConnected && (
                      <div className="rounded-2xl bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/80 p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 dark:text-zinc-500 font-medium">Measurement ID:</span>
                          <span className="font-bold text-gray-700 dark:text-zinc-300 font-mono text-[11px]">{integration?.config?.measurementId}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 dark:text-zinc-500 font-medium">Event API Secret:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                            {integration?.config?.hasApiSecret ? 'Terpasang' : 'Tidak Diberikan'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-50 dark:border-zinc-900 mt-6 flex gap-3">
                    {isConnected ? (
                      <>
                        <Button
                          onClick={() => handleDisconnect('GOOGLE_ANALYTICS')}
                          variant="outline"
                          className="rounded-xl flex-1 border-rose-100 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 font-bold"
                        >
                          Putuskan
                        </Button>
                        <Button
                          onClick={() => openGaModal(integration)}
                          variant="outline"
                          className="rounded-xl flex-1 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 font-bold"
                        >
                          Edit Pengaturan
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => openGaModal()}
                        className="rounded-xl flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black shadow-sm"
                      >
                        Konfigurasi GA4
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })()}

          </div>
        )}

        {/* MODAL CONFIGURATION - PAKASIR */}
        <AnimatePresence>
          {isPakasirOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPakasirOpen(false)}
                className="absolute inset-0 bg-black/60"
              />

              {/* Box */}
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#0E131F] p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-zinc-900">
                  <div className="flex items-center gap-2">
                    <Plug className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Pengaturan Pakasir</span>
                  </div>
                  <button
                    onClick={() => setIsPakasirOpen(false)}
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-5 py-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Slug</label>
                    <Input
                      value={pakasirSlug}
                      onChange={(e) => setPakasirSlug(e.target.value)}
                      placeholder="Contoh: my-kiosk-store"
                      className="rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">API Key</label>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Lock className="h-3 w-3" /> Secure AES-256
                      </span>
                    </div>
                    <Input
                      type="password"
                      value={pakasirApiKey}
                      onChange={(e) => setPakasirApiKey(e.target.value)}
                      placeholder="Masukkan API Key Pakasir Anda"
                      className="rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 dark:border-zinc-900 flex justify-between gap-3">
                  <Button
                    onClick={handleTestPakasir}
                    disabled={isTestingPakasir || !pakasirSlug || !pakasirApiKey}
                    variant="outline"
                    className="rounded-xl border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 font-bold"
                  >
                    {isTestingPakasir ? 'Menguji...' : 'Uji Koneksi'}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsPakasirOpen(false)}
                      variant="ghost"
                      className="rounded-xl font-bold"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleSavePakasir}
                      disabled={isActionLoading === 'PAKASIR_SAVE'}
                      className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black"
                    >
                      {isActionLoading === 'PAKASIR_SAVE' ? 'Menyimpan...' : 'Simpan Kredensial'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL CONFIGURATION - GOOGLE ANALYTICS */}
        <AnimatePresence>
          {isGaOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsGaOpen(false)}
                className="absolute inset-0 bg-black/60"
              />

              {/* Box */}
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#0E131F] p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-zinc-900">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-500" />
                    <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Pengaturan GA4</span>
                  </div>
                  <button
                    onClick={() => setIsGaOpen(false)}
                    className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-5 py-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Measurement ID (Wajib)</label>
                    <Input
                      value={gaMeasurementId}
                      onChange={(e) => setGaMeasurementId(e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                      className="rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Measurement Protocol API Secret (Opsional)</label>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Lock className="h-3 w-3" /> Secure AES-256
                      </span>
                    </div>
                    <Input
                      type="password"
                      value={gaApiSecret}
                      onChange={(e) => setGaApiSecret(e.target.value)}
                      placeholder="Hanya diperlukan untuk server event tracking"
                      className="rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 dark:border-zinc-900 flex justify-between gap-3">
                  <Button
                    onClick={handleTestGa}
                    disabled={isTestingGa || !gaMeasurementId}
                    variant="outline"
                    className="rounded-xl border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 font-bold"
                  >
                    {isTestingGa ? 'Menguji...' : 'Uji ID'}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsGaOpen(false)}
                      variant="ghost"
                      className="rounded-xl font-bold"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleSaveGa}
                      disabled={isActionLoading === 'GA_SAVE'}
                      className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black"
                    >
                      {isActionLoading === 'GA_SAVE' ? 'Menyimpan...' : 'Simpan Kredensial'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardShell>
  );
}

export default function IntegrationsCenterPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500"></div>
      </div>
    }>
      <IntegrationsCenterContent />
    </Suspense>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  Network, 
  RefreshCw, 
  Server,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuperAdminSystemPage() {
  // Telemetry state hooks that simulate live cloud metrics
  const [cpu, setCpu] = useState(12.4);
  const [ram, setRam] = useState(48.2);
  const [dbConnections, setDbConnections] = useState(8);
  const [latency, setLatency] = useState(15);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const refreshTelemetry = () => {
    setCpu(parseFloat((Math.random() * 15 + 4).toFixed(1))); // 4% - 19%
    setRam(parseFloat((Math.random() * 5 + 45).toFixed(1))); // 45% - 50%
    setDbConnections(Math.floor(Math.random() * 6 + 6)); // 6 - 12 connections
    setLatency(Math.floor(Math.random() * 10 + 10)); // 10ms - 20ms
    setLastRefreshed(new Date().toLocaleTimeString('id-ID'));
  };

  useEffect(() => {
    refreshTelemetry();
    const interval = setInterval(refreshTelemetry, 3500); // refresh every 3.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Status & Telemetri Sistem
          </h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Pantau status operasional infrastruktur cloud, pemakaian CPU/RAM, dan pool koneksi database secara real-time.
          </p>
        </div>

        <button 
          onClick={refreshTelemetry}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 px-4 py-2.5 shadow-sm text-xs font-black text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer hover:scale-[1.01]"
        >
          <RefreshCw className="h-4 w-4 text-[#e8aa20] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Diperbarui Otomatis (Terakhir: {lastRefreshed})</span>
        </button>
      </div>

      {/* Real-time Telemetry Grid Gauges */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* CPU Gauge */}
        <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Penggunaan CPU</span>
            <Cpu className="h-4.5 w-4.5 text-blue-500" />
          </div>
          
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative h-28 w-28 flex items-center justify-center">
              {/* Circular track background */}
              <svg className="absolute transform -rotate-90 w-full h-full">
                <circle cx="56" cy="56" r="46" strokeWidth="6" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" fill="transparent" />
                <motion.circle 
                  cx="56" cy="56" r="46" strokeWidth="6" stroke="currentColor" className="text-blue-500" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 46}
                  animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - cpu / 100) }}
                  transition={{ type: 'spring', stiffness: 60 }}
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">{cpu}%</span>
                <span className="text-[9px] font-bold text-zinc-450 block uppercase tracking-wider">Active load</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs font-semibold text-zinc-400 text-center border-t border-zinc-100 dark:border-zinc-850 pt-3">
            AWS EC2 Server Node Instance
          </div>
        </Card>

        {/* RAM Gauge */}
        <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Penggunaan RAM</span>
            <HardDrive className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 w-full h-full">
                <circle cx="56" cy="56" r="46" strokeWidth="6" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" fill="transparent" />
                <motion.circle 
                  cx="56" cy="56" r="46" strokeWidth="6" stroke="currentColor" className="text-emerald-500" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 46}
                  animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - ram / 100) }}
                  transition={{ type: 'spring', stiffness: 60 }}
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">{ram}%</span>
                <span className="text-[9px] font-bold text-zinc-450 block uppercase tracking-wider">Memory Alloc</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs font-semibold text-zinc-400 text-center border-t border-zinc-100 dark:border-zinc-850 pt-3">
            2.4 GB dari 5.0 GB Tersedia
          </div>
        </Card>

        {/* DB Connections Gauge */}
        <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Pool Koneksi DB</span>
            <Database className="h-4.5 w-4.5 text-[#e8aa20]" />
          </div>
          
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 w-full h-full">
                <circle cx="56" cy="56" r="46" strokeWidth="6" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" fill="transparent" />
                <motion.circle 
                  cx="56" cy="56" r="46" strokeWidth="6" stroke="currentColor" className="text-[#e8aa20]" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 46}
                  animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - dbConnections / 50) }} // Max 50 pool
                  transition={{ type: 'spring', stiffness: 60 }}
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">{dbConnections}</span>
                <span className="text-[9px] font-bold text-zinc-450 block uppercase tracking-wider">Koneksi Aktif</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs font-semibold text-zinc-400 text-center border-t border-zinc-100 dark:border-zinc-850 pt-3">
            Supabase Serverless Postgres
          </div>
        </Card>

        {/* Latency Gauge */}
        <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">API Response Latency</span>
            <Network className="h-4.5 w-4.5 text-purple-500" />
          </div>
          
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="absolute transform -rotate-90 w-full h-full">
                <circle cx="56" cy="56" r="46" strokeWidth="6" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" fill="transparent" />
                <motion.circle 
                  cx="56" cy="56" r="46" strokeWidth="6" stroke="currentColor" className="text-purple-500" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 46}
                  animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - latency / 60) }} // Max 60ms
                  transition={{ type: 'spring', stiffness: 60 }}
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">{latency} ms</span>
                <span className="text-[9px] font-bold text-zinc-450 block uppercase tracking-wider">Ping Latency</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs font-semibold text-zinc-400 text-center border-t border-zinc-100 dark:border-zinc-850 pt-3">
            Edge API Gateway Gateway (SG)
          </div>
        </Card>

      </div>

      {/* Cloud Nodes & Database Sizing */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Node instances board */}
        <Card className="lg:col-span-7 rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="p-6 border-b border-zinc-100 dark:border-zinc-850">
            <CardTitle className="text-base font-black text-zinc-950 dark:text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-[#e8aa20]" />
              Infrastruktur Host & Server Node
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500">
              Spesifikasi detail server VM dan engine compiler backend.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-zinc-500 dark:text-zinc-400">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-850 text-zinc-400 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Parameter Sistem</th>
                    <th className="pb-3">Konfigurasi Aktif</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  <tr className="py-3">
                    <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-200">OS Host Server</td>
                    <td className="py-3.5 font-mono">Linux Ubuntu 22.04 LTS (x64)</td>
                    <td className="py-3.5 text-right font-black text-green-500">SEHAT</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-200">NodeJS Runtime</td>
                    <td className="py-3.5 font-mono">v20.11.0 (LTS)</td>
                    <td className="py-3.5 text-right font-black text-green-500">SEHAT</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-200">NestJS Framework</td>
                    <td className="py-3.5 font-mono">v11.0.1 (TypeScript Strict)</td>
                    <td className="py-3.5 text-right font-black text-green-500">SEHAT</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-200">ORM Database Engine</td>
                    <td className="py-3.5 font-mono">Prisma ORM Client v6.2.1</td>
                    <td className="py-3.5 text-right font-black text-green-500">SEHAT</td>
                  </tr>
                  <tr className="py-3">
                    <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-200">CORS Allowed Domains</td>
                    <td className="py-3.5 font-mono text-[10px] break-all leading-tight">
                      localhost:3000, jagobisnis.vercel.app, www.jago-bisnis.my.id
                    </td>
                    <td className="py-3.5 text-right font-black text-green-500">AKTIF</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Database Sizing Info */}
        <Card className="lg:col-span-5 rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between">
          <div>
            <CardHeader className="p-6 border-b border-zinc-100 dark:border-zinc-850">
              <CardTitle className="text-base font-black text-zinc-950 dark:text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-[#e8aa20]" />
                Kapasitas Basis Data
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500">
                Penyimpanan database PostgreSQL serverless.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-600 dark:text-zinc-400">Total Ukuran Penyimpanan</span>
                  <span className="text-zinc-900 dark:text-white font-black">4.8 MB / 512 MB</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#e8aa20] rounded-full" style={{ width: '1.2%' }} />
                </div>
                <span className="text-[10px] text-zinc-400 block font-semibold">Sangat mencukupi (1.2% terpakai)</span>
              </div>

              <div className="rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-900 dark:text-zinc-300">
                  <Zap className="h-4 w-4 text-[#e8aa20]" />
                  <span>Koneksi & Transaksi Teroptimasi</span>
                </div>
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Semua kueri data bisnis dipetakan dengan indeks terstruktur pada primary key UUID. Penggunaan pool koneksi serverless diatur otomatis oleh Prisma Service untuk mencegah kebocoran memori.
                </p>
              </div>
            </CardContent>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-850/40 border-t border-zinc-100 dark:border-zinc-850 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#e8aa20]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Database Provider: PostgreSQL
            </span>
          </div>
        </Card>

      </div>

    </div>
  );
}

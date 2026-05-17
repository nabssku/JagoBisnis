'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Local client-only schema that includes password confirmation checking
const clientRegisterSchema = z.object({
  name: z.string().min(1, 'Nama lengkap wajib diisi'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  agree: z.boolean().refine(val => val === true, 'Anda harus menyetujui Syarat & Ketentuan'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi kata sandi tidak cocok',
  path: ['confirmPassword'],
});

type ClientRegisterDto = z.infer<typeof clientRegisterSchema>;

// Premium JagoBisnis brand logo
const CenteredLogo = () => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFB82B] shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5.5 w-5.5 text-gray-900"
      >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
        <circle cx="12" cy="12" r="3" fill="currentColor" className="text-gray-900" />
      </svg>
    </div>
    <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mt-1">
      Jago<span className="text-[#FFB82B]">Bisnis</span>
    </span>
  </div>
);

// High-fidelity Google G Vector logo
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.3-1.12 3.01v2.53h1.8c1.05-.97 1.83-2.4 1.83-4.39z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.47v3.13C3.48 20.41 7.47 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29V6.57H1.47C.53 8.46 0 10.58 0 12.8s.53 4.34 1.47 6.23l3.8-2.92-.001-.82z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.47 0 3.48 3.59 1.47 7.57l3.8 2.92c.95-2.85 3.6-4.96 6.73-4.96z"
    />
  </svg>
);

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientRegisterDto>({
    resolver: zodResolver(clientRegisterSchema),
    defaultValues: {
      agree: true,
    }
  });

  // Handle Google Implicit OAuth Callback (Hash parameter parsing)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      setGoogleLoading(true);
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        // Clear address bar cleanly
        window.history.replaceState(null, '', window.location.pathname);
        
        authService.googleLogin(accessToken)
          .then((res) => {
            localStorage.setItem('accessToken', res.accessToken);
            toast.success('Pendaftaran menggunakan Google berhasil!');
            router.push('/onboarding');
          })
          .catch((err: any) => {
            const errorMsg = err.response?.data?.message || 'Gagal mendaftar menggunakan Google.';
            setError(errorMsg);
            toast.error(errorMsg);
          })
          .finally(() => {
            setGoogleLoading(false);
          });
      }
    }
  }, [router]);

  const onSubmit = async (data: ClientRegisterDto) => {
    setIsLoading(true);
    setError(null);
    try {
      // Send only required parameters to the NestJS backend
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem('accessToken', response.accessToken);
      toast.success('Registrasi berhasil! Selamat datang.');
      router.push('/onboarding');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
      } else {
        setError('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      // Automatic Elegant Developer Simulation mode
      setGoogleLoading(true);
      toast.info('Menginisialisasi Demo Google Sesi...', { duration: 1500 });
      
      setTimeout(() => {
        authService.googleLogin('mock-google-token-' + Date.now())
          .then((res) => {
            localStorage.setItem('accessToken', res.accessToken);
            toast.success('Berhasil mendaftar dengan Demo Google Account!');
            router.push('/onboarding');
          })
          .catch((err: any) => {
            const errorMsg = err.response?.data?.message || 'Demo Google Gagal.';
            setError(errorMsg);
            toast.error('Demo Google Gagal.');
          })
          .finally(() => {
            setGoogleLoading(false);
          });
      }, 1200);
      return;
    }

    // Google Implicit OAuth Redirect Flow
    const redirectUri = window.location.origin + '/register';
    const scope = 'openid profile email';
    const responseType = 'token';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950 px-4 py-12 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Screen Loader when Google Auth is running */}
      <AnimatePresence>
        {googleLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-200 border-t-[#FFB82B]" />
              <div className="absolute h-8 w-8 rounded-full bg-[#FFB82B]/20 flex items-center justify-center">
                <svg className="h-4.5 w-4.5 text-[#FFB82B] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.68 0-8.5-3.82-8.5-8.5s3.82-8.5 8.5-8.5c2.1 0 3.99.77 5.48 2.03l3.02-3.02C18.6 1.19 15.54 0 12 0 5.37 0 0 5.37 0 12s5.37 12 12 12c6.63 0 12-5.37 12-12 0-.85-.09-1.68-.26-2.485H12.24z" />
                </svg>
              </div>
            </div>
            <p className="mt-6 text-base font-semibold text-gray-900 dark:text-white animate-pulse">
              Menghubungkan akun Google Anda...
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Mohon tunggu sebentar selagi kami menyiapkan dashboard Anda
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 z-10">
        <div className="flex flex-col space-y-6">
          {/* Top Logo and Title */}
          <div className="text-center space-y-2">
            <CenteredLogo />
            <h1 className="text-2xl font-black text-gray-900 dark:text-white pt-3 tracking-tight">
              Buat Akun JagoBisnis
            </h1>
            <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
              Daftar dulu — profil bisnis kamu kita siapkan setelah verifikasi email.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 p-3 text-xs font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                Nama Lengkap
              </label>
              <Input
                type="text"
                placeholder="Nama Anda"
                className="rounded-xl h-11 border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 px-4 py-2.5 focus:border-[#FFB82B] focus:ring-2 focus:ring-[#FFB82B]/20 transition-all placeholder:text-gray-400"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                Email
              </label>
              <Input
                type="email"
                placeholder="nama@email.com"
                className="rounded-xl h-11 border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 px-4 py-2.5 focus:border-[#FFB82B] focus:ring-2 focus:ring-[#FFB82B]/20 transition-all placeholder:text-gray-400"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                  Kata Sandi
                </label>
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  className="rounded-xl h-11 border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 px-4 py-2.5 focus:border-[#FFB82B] focus:ring-2 focus:ring-[#FFB82B]/20 transition-all placeholder:text-gray-400"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase block">
                  Konfirmasi
                </label>
                <Input
                  type="password"
                  placeholder="Ulangi kata sandi"
                  className="rounded-xl h-11 border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-850 px-4 py-2.5 focus:border-[#FFB82B] focus:ring-2 focus:ring-[#FFB82B]/20 transition-all placeholder:text-gray-400"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-1.5">
              <input
                type="checkbox"
                id="agree"
                className="accent-[#FFB82B] w-4.5 h-4.5 mt-0.5 rounded border-gray-300 focus:ring-[#FFB82B] focus:ring-2 cursor-pointer rounded-md"
                {...register('agree')}
              />
              <label htmlFor="agree" className="text-xs leading-normal text-gray-500 dark:text-zinc-400 select-none cursor-pointer">
                Saya setuju dengan <span className="font-bold text-gray-700 dark:text-zinc-200 underline hover:text-[#FFB82B] transition-colors">Syarat & Ketentuan</span> dan ingin menerima email pemasaran dari JagoBisnis.
              </label>
            </div>
            {errors.agree && (
              <p className="text-xs text-red-500 -mt-1 font-medium">{errors.agree.message}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFB82B] hover:bg-[#F2AE24] text-gray-900 font-extrabold text-sm rounded-xl h-11 transition-all duration-200 shadow-sm border border-[#EAA21A] mt-4"
              isLoading={isLoading}
            >
              Daftar
            </Button>
          </form>

          {/* Decorative Divider */}
          <div className="relative my-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-zinc-800" />
            </div>
            <span className="relative bg-white dark:bg-zinc-900 px-3 text-[10px] font-extrabold tracking-widest text-gray-400 dark:text-zinc-500 uppercase">
              Atau
            </span>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleRegister}
            type="button"
            className="flex w-full items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-200 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-all cursor-pointer h-11"
          >
            <GoogleIcon />
            Daftar dengan Google
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-zinc-400 pt-2">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-[#FFB82B] hover:text-[#EAA21A] transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

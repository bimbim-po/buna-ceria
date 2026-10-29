'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  KeyRound,
  LogIn,
  UserCheck,
  X,
} from 'lucide-react';
import { getDemoAccounts } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useFocusTrap } from '@/lib/useFocusTrap';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LoginDialog() {
  const { isLoginDialogOpen, closeLoginDialog, handleLogin } = useApp();
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = getDemoAccounts();

  useFocusTrap(dialogRef, isLoginDialogOpen, closeLoginDialog);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    window.setTimeout(() => {
      const result = handleLogin(identifier, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.error ?? 'Gagal masuk. Silakan periksa kembali.');
      } else {
        setIdentifier('');
        setPassword('');
      }
    }, 700);
  };

  const handleSelectDemoAccount = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <AnimatePresence>
      {isLoginDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-dialog-title"
          aria-describedby="login-dialog-desc"
        >
          {/* Overlay tanpa glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: CUSTOM_EASE }}
            onClick={closeLoginDialog}
            className="fixed inset-0 bg-ink/45"
            aria-hidden="true"
          />

          {/* Di HP naik dari bawah seperti sheet (y: 100% -> 0); di desktop fade dengan skala */}
          <motion.div
            ref={dialogRef}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 64, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 48, scale: 0.96 }
            }
            transition={{ duration: 0.32, ease: CUSTOM_EASE }}
            className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[28px] border border-pink-100 bg-surface p-6 shadow-pink-soft sm:rounded-[28px] sm:p-7"
          >
            {/* Pegangan kecil sheet di HP */}
            <div
              aria-hidden="true"
              className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-pink-100 sm:hidden"
            />

            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={closeLoginDialog}
              aria-label="Tutup dialog masuk"
              className="btn-pill absolute top-5 right-5 flex h-11 w-11 items-center justify-center border border-pink-100 bg-page text-ink-muted hover:text-ink cursor-pointer"
            >
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>

            {/* Loading Animasi Logo saat Login */}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[28px] bg-surface/95 backdrop-blur-xs p-6 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.12, 1],
                    rotate: [0, 4, -4, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 border-2 border-pink-200 p-3 shadow-pink-soft"
                >
                  <Image
                    src="/logo.png"
                    alt="Memuat Teman Kasih"
                    width={56}
                    height={56}
                    className="h-12 w-12 object-contain"
                  />
                </motion.div>
                <p className="mt-4 font-heading text-lg font-bold text-ink">
                  Menyiapkan Meja Belajar Ibu...
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Memuat data kehamilan dan materi bertahap
                </p>
              </div>
            )}

            {/* Kepala Dialog */}
            <div className="flex items-center gap-3 pr-10">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface border border-pink-100 p-1.5 shadow-2xs">
                <Image
                  src="/logo.png"
                  alt=""
                  width={38}
                  height={38}
                  className="h-9 w-9 object-contain"
                />
              </span>
              <div>
                <h2
                  id="login-dialog-title"
                  className="font-heading text-2xl font-bold text-ink"
                >
                  Masuk ke Teman Kasih
                </h2>
                <p id="login-dialog-desc" className="text-sm text-ink-muted">
                  Silakan masuk agar bacaan dan nilai Ibu tersimpan.
                </p>
              </div>
            </div>

            {/* Formulir Login */}
            <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-[20px] border border-pink-500 bg-pink-50 p-3.5 text-sm font-medium text-pink-700"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-pink-700"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-sm font-semibold text-ink"
                >
                  Email atau Nomor HP
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: nadia.contoh@temankasih.example"
                  required
                  className="mt-1.5 min-h-[48px] w-full rounded-[20px] border border-pink-100 bg-page px-4 py-2.5 text-base text-ink placeholder:text-ink-muted/70 focus:border-pink-700 focus:bg-surface"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-ink"
                >
                  Kata Sandi
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi Ibu"
                    required
                    className="min-h-[48px] w-full rounded-[20px] border border-pink-100 bg-page px-4 py-2.5 text-base text-ink placeholder:text-ink-muted/70 focus:border-pink-700 focus:bg-surface"
                  />
                  <KeyRound
                    className="pointer-events-none absolute top-3.5 right-4 h-4 w-4 text-ink-muted"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-pill flex min-h-[48px] w-full items-center justify-center gap-2 bg-pink-500 px-6 py-3 text-base font-bold text-ink shadow-pink-soft cursor-pointer"
              >
                <LogIn
                  className="h-5 w-5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>Masuk Sekarang</span>
              </button>
            </form>

            {/* Daftar 3 Akun Contoh (Data Tiruan) */}
            <div className="mt-6 rounded-[24px] border border-pink-100 bg-green-50/80 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-green-700">
                <UserCheck
                  className="h-4 w-4"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>3 Akun Contoh untuk Pengujian</span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                Ketuk salah satu akun di bawah ini untuk mengisi kolom otomatis:
              </p>

              <div className="mt-3 space-y-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() =>
                      handleSelectDemoAccount(acc.email, acc.password)
                    }
                    className="card-lift flex min-h-[48px] w-full flex-col items-start justify-center rounded-[20px] border border-pink-100 bg-surface px-4 py-2.5 text-left cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-bold text-ink">
                        {acc.name}
                      </span>
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-semibold text-green-700">
                        Sandi: {acc.password}
                      </span>
                    </div>
                    <span className="mt-0.5 text-sm text-ink-muted">
                      {acc.email} • {acc.phone}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

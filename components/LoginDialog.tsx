'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  KeyRound,
  LogIn,
  ShieldCheck,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { getAllUsers, getDemoAccounts } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useFocusTrap } from '@/lib/useFocusTrap';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LoginDialog() {
  const {
    isLoginDialogOpen,
    closeLoginDialog,
    handleLogin,
    handleRegister,
    setActiveSection,
  } = useApp();
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // State untuk form Daftar Akun Baru
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTrimester, setRegTrimester] = useState('Trimester 1');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = getDemoAccounts();

  useFocusTrap(dialogRef, isLoginDialogOpen, closeLoginDialog);

  const onSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const normalized = identifier.trim().toLowerCase();
    const matchedUser = getAllUsers().find(
      (u) =>
        u.email.toLowerCase() === normalized ||
        u.phone.replace(/[\s-]/g, '') === normalized.replace(/[\s-]/g, '')
    );

    if (mode === 'admin' && matchedUser && matchedUser.role !== 'admin') {
      setErrorMsg(
        'Akun ini tidak memiliki lisensi Admin. Hanya akun berlisensi Admin resmi yang dapat mengakses Panel Admin.'
      );
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      const result = handleLogin(identifier, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.error ?? 'Gagal masuk. Silakan periksa kembali.');
      } else {
        if (matchedUser?.role === 'admin') {
          setActiveSection('admin');
        } else {
          setActiveSection('beranda');
        }
        setIdentifier('');
        setPassword('');
      }
    }, 850);
  };

  const onSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    window.setTimeout(() => {
      const result = handleRegister({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        trimesterLabel: regTrimester,
      });
      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.error ?? 'Gagal mendaftar. Silakan periksa kembali.');
      } else {
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
      }
    }, 900);
  };

  const handleGoogleSignIn = () => {
    setErrorMsg(null);
    setIsLoading(true);
    window.setTimeout(() => {
      const firstUser =
        demoAccounts.find((a) => a.role !== 'admin') ?? demoAccounts[0];
      if (firstUser) {
        handleLogin(firstUser.email, firstUser.password);
      }
      setIsLoading(false);
    }, 850);
  };

  const handleSelectDemoAccount = (
    email: string,
    pass: string,
    role?: string
  ) => {
    setIdentifier(email);
    setPassword(pass);
    setErrorMsg(null);
    if (role === 'admin') {
      setMode('admin');
    } else if (mode === 'register') {
      setMode('login');
    }
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: CUSTOM_EASE }}
            onClick={closeLoginDialog}
            className="fixed inset-0 bg-black/45"
            aria-hidden="true"
          />

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
            className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[28px] border border-pink-100 bg-white p-6 shadow-xl sm:rounded-[28px] sm:p-7"
          >
            <div
              aria-hidden="true"
              className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-pink-100 sm:hidden"
            />

            <button
              type="button"
              onClick={closeLoginDialog}
              aria-label="Tutup dialog masuk"
              className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 bg-[#FAF8FC] text-[#6E6A6C] hover:text-[#2A2D22] cursor-pointer"
            >
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>

            {/* Layar Loading Animasi Logo Buna Ceria */}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[28px] bg-white/95 backdrop-blur-xs p-6 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.14, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FDF2F5] border-2 border-[#F5AFB9] p-3 shadow-md"
                >
                  <Image
                    src="/logo.png"
                    alt="Logo Buna Ceria"
                    width={56}
                    height={56}
                    className="h-12 w-12 object-contain"
                  />
                </motion.div>
                <p className="mt-4 font-heading text-lg font-bold text-[#2A2D22]">
                  Buna Ceria
                </p>
                <p className="mt-1 text-xs text-[#6E6A6C]">
                  Menyiapkan ruang belajar kehamilan Bunda...
                </p>
              </div>
            )}

            {/* Header Dialog */}
            <div className="flex items-center gap-3 pr-10">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FDF2F5] border border-pink-100 p-1.5 shadow-2xs">
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
                  className="font-heading text-xl sm:text-2xl font-bold text-[#2A2D22]"
                >
                  {mode === 'register'
                    ? 'Daftar Akun WebApp'
                    : mode === 'admin'
                    ? 'Login Khusus Admin'
                    : 'Masuk ke Buna Ceria'}
                </h2>
                <p id="login-dialog-desc" className="text-xs text-[#6E6A6C]">
                  WebApp Edukasi Kehamilan Buna Ceria
                </p>
              </div>
            </div>

            {/* 3 Tab Pilihan: Masuk | Daftar Akun | Admin */}
            <div className="mt-5 grid grid-cols-3 gap-1.5 rounded-2xl border border-[#ECE7F2] bg-[#FAF8FC] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#C84B71] text-white shadow-2xs'
                    : 'text-[#6E6A6C] hover:text-[#2A2D22]'
                }`}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#C84B71] text-white shadow-2xs'
                    : 'text-[#6E6A6C] hover:text-[#2A2D22]'
                }`}
              >
                Daftar Baru
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('admin');
                  setIdentifier('');
                  setPassword('');
                  setErrorMsg(null);
                }}
                className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                  mode === 'admin'
                    ? 'bg-[#56632A] text-white shadow-2xs'
                    : 'text-[#6E6A6C] hover:text-[#2A2D22]'
                }`}
              >
                Login Admin
              </button>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-2xl border border-pink-300 bg-pink-50 p-3.5 text-xs font-semibold text-[#C84B71]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* FORM DAFTAR AKUN BARU */}
            {mode === 'register' ? (
              <form
                onSubmit={onSubmitRegister}
                noValidate
                className="mt-4 space-y-3.5"
              >
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-xs font-bold text-[#2A2D22]"
                  >
                    Nama Lengkap Bunda
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Bunda Faiza"
                    className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2.5 text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-bold text-[#2A2D22]"
                    >
                      Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="bunda@email.com"
                      className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2.5 text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-phone"
                      className="block text-xs font-bold text-[#2A2D22]"
                    >
                      Nomor WhatsApp
                    </label>
                    <input
                      id="reg-phone"
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0857..."
                      className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2.5 text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="reg-trimester"
                      className="block text-xs font-bold text-[#2A2D22]"
                    >
                      Tahap Kehamilan
                    </label>
                    <select
                      id="reg-trimester"
                      value={regTrimester}
                      onChange={(e) => setRegTrimester(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3 py-2.5 text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                    >
                      <option value="Trimester 1">Trimester 1</option>
                      <option value="Trimester 2">Trimester 2</option>
                      <option value="Trimester 3">Trimester 3</option>
                      <option value="Ibu Nifas & Menyusui">
                        Ibu Nifas &amp; Menyusui
                      </option>
                      <option value="Keluarga Pendamping">
                        Keluarga Pendamping
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-xs font-bold text-[#2A2D22]"
                    >
                      Kata Sandi
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 4 karakter"
                      className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2.5 text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#C84B71] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#b23b60] cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar &amp; Masuk WebApp</span>
                </button>
              </form>
            ) : (
              /* FORM LOGIN (PENGGUNA TERDAFTAR / ADMIN) */
              <form
                onSubmit={onSubmitLogin}
                noValidate
                className="mt-4 space-y-3.5"
              >
                <div>
                  <label
                    htmlFor="login-identifier"
                    className="block text-xs font-bold text-[#2A2D22]"
                  >
                    {mode === 'admin'
                      ? 'Email Admin'
                      : 'Email atau Nomor WhatsApp'}
                  </label>
                  <input
                    id="login-identifier"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      mode === 'admin'
                        ? 'admin@bunaceria.id'
                        : 'Contoh: nadia@bunaceria.id'
                    }
                    required
                    className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2.5 text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold text-[#2A2D22]"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      required
                      className="w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2.5 text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                    />
                    <KeyRound
                      className="pointer-events-none absolute top-3 right-3.5 h-4 w-4 text-[#8C8896]"
                      strokeWidth={1.75}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md cursor-pointer ${
                    mode === 'admin'
                      ? 'bg-[#56632A] hover:bg-[#434e20]'
                      : 'bg-[#C84B71] hover:bg-[#b23b60]'
                  }`}
                >
                  {mode === 'admin' ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  <span>
                    {mode === 'admin'
                      ? 'Masuk sebagai Admin'
                      : 'Masuk ke WebApp'}
                  </span>
                </button>

                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-[#ECE7F2] bg-white px-5 py-2 text-xs font-bold text-[#2A2D22] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FDF2F5] text-[10px] font-black text-[#C84B71]">
                      G
                    </span>
                    <span>Masuk Cepat dengan Akun Google</span>
                  </button>
                )}
              </form>
            )}

            {/* Daftar Akun Contoh untuk Pengujian Cepat */}
            <div className="mt-5 rounded-[20px] border border-[#E4EAC9] bg-[#F7F9EE] p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#56632A]">
                <UserCheck className="h-4 w-4" strokeWidth={1.8} />
                <span>Akun Siap Pakai (Klik untuk Isi Otomatis)</span>
              </div>

              <div className="mt-2.5 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {demoAccounts
                  .filter((acc) =>
                    mode === 'admin' ? acc.role === 'admin' : acc.role !== 'admin'
                  )
                  .map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() =>
                        handleSelectDemoAccount(acc.email, acc.password, acc.role)
                      }
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#ECE7F2] bg-white px-3 py-2 text-left hover:border-pink-200 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <span className="block truncate text-xs font-bold text-[#2A2D22]">
                          {acc.name}
                        </span>
                        <span className="block truncate text-[11px] text-[#767A6E]">
                          {acc.email}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          acc.role === 'admin'
                            ? 'bg-[#56632A] text-white'
                            : 'bg-[#FDF2F5] text-[#C84B71]'
                        }`}
                      >
                        {acc.role === 'admin' ? 'Lisensi Admin' : `Sandi: ${acc.password}`}
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

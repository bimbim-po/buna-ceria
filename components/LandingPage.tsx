'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronUp,
  FileText,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { getReferences } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { Footer } from '@/components/Footer';
import { ReferenceList } from '@/components/ReferenceList';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LandingPage() {
  const { session, openLoginDialog, enterWebApp } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const references = getReferences();

  const navLinks = [
    { label: 'Beranda', href: '#top', active: true },
    { label: 'Tips Nifas', href: '#tips-nifas', active: false },
    { label: 'Fitur WebApp', href: '#fitur-webapp', active: false },
    { label: 'Daftar Pustaka', href: '#daftar-pustaka', active: false },
    { label: 'Narahubung', href: '#narahubung', active: false },
  ];

  const sectionRevealProps = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.4, ease: CUSTOM_EASE },
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = headerSearch.trim().toLowerCase();
    if (q.includes('pustaka')) {
      setShowReferences(true);
      document.getElementById('daftar-pustaka')?.scrollIntoView({ behavior: 'smooth' });
    } else if (q.includes('nifas') || q.includes('tips')) {
      document.getElementById('tips-nifas')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('fitur-webapp')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF4F7] via-[#FFF7FA] to-[#FFF5F8] text-[#2A2D22] selection:bg-[#FCE8EE] selection:text-[#C84B71]">
      {/* =====================================================================
          1. STICKY TOP NAVBAR (Selalu Muncul Saat Scroll ke Bawah maupun ke Atas)
         ===================================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-[#F5DCE4]/80 bg-[#FFF5F8]/92 backdrop-blur-md shadow-[0_4px_20px_rgba(200,75,113,0.05)]">
        <div className="mx-auto w-full max-w-[1480px] 2xl:max-w-[1680px] px-5 py-3.5 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between gap-3 xl:gap-6 whitespace-nowrap">
            {/* Left: Logo + Brand */}
            <a
              href="#top"
              className="flex items-center gap-2.5 shrink-0 group whitespace-nowrap transition-transform duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <Image
                src="/logo.png"
                alt="Buna Ceria"
                width={38}
                height={38}
                className="h-9 w-9 shrink-0 object-contain transition-transform group-hover:scale-105"
              />
              <div className="whitespace-nowrap text-left">
                <span className="block font-heading text-base sm:text-lg font-bold text-[#2A2D22] leading-tight">
                  Buna Ceria
                </span>
                <span className="block text-[11px] text-[#767A6E] leading-tight">
                  Edukasi Ibu Nifas
                </span>
              </div>
            </a>

            {/* Center: Navigation Links (Satu Baris Lurus, Tidak Pernah 2 Baris) */}
            <nav
              aria-label="Navigasi utama"
              className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8 shrink-0 whitespace-nowrap"
            >
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 text-[13.5px] whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:text-[#DF6B8D] ${
                    item.active
                      ? 'font-semibold text-[#2A2D22]'
                      : 'font-medium text-[#5C585A]'
                  }`}
                >
                  {item.label}
                  {item.active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#8E9B5E]" />
                  )}
                </a>
              ))}
            </nav>

            {/* Right: Search Input + Buka WebApp Button (Satu Baris) */}
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center gap-2 rounded-full border border-[#F5DCE4] bg-white/90 px-3.5 py-2 shadow-2xs transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#DF6B8D]/40 hover:shadow-sm shrink-0"
              >
                <Search className="h-3.5 w-3.5 text-[#7A7577] shrink-0" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Cari informasi..."
                  className="w-28 xl:w-40 bg-transparent text-xs text-[#2A2D22] placeholder:text-[#9E989A] outline-none"
                />
              </form>

              <button
                type="button"
                onClick={() => enterWebApp('beranda')}
                className="inline-flex min-h-[38px] shrink-0 whitespace-nowrap items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#E46C8E] to-[#F08BA8] px-4 sm:px-5 py-2 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(228,108,142,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(228,108,142,0.38)] active:scale-95 cursor-pointer"
              >
                <span>{session ? 'Ruang Belajar' : 'Buka WebApp'}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-label="Menu navigasi"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F5DCE4] bg-white text-[#2A2D22] shadow-2xs transition-all duration-200 active:scale-95 lg:hidden cursor-pointer"
              >
                {mobileNavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden rounded-[20px] border border-[#F5DCE4] bg-white p-4 shadow-[0_12px_32px_rgba(200,75,113,0.12)] lg:hidden"
              >
                <div className="flex flex-col items-center text-center space-y-1">
                  {navLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="w-full rounded-xl px-3 py-2 text-sm font-medium text-[#2A2D22] hover:bg-[#FFF5F8]"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="pt-2 mt-1 w-full border-t border-pink-100 flex flex-col gap-2">
                    {!session && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          openLoginDialog();
                        }}
                        className="w-full rounded-full border border-[#E46C8E]/40 py-2 text-xs font-semibold text-[#2A2D22] transition-all active:scale-95 cursor-pointer"
                      >
                        Masuk / Daftar Akun
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileNavOpen(false);
                        enterWebApp('beranda');
                      }}
                      className="w-full rounded-full bg-[#E46C8E] py-2 text-xs font-semibold text-white shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Buka WebApp
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="relative overflow-hidden">
        {/* Soft Organic Editorial Blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-[560px] w-[560px] rounded-full bg-[#FCDCE6]/55 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-40 -left-24 h-[420px] w-[420px] rounded-full bg-[#EFF4E3]/65 blur-3xl"
        />

        {/* Hero Banner: Full-Width Responsif, Ilustrasi Transparan, & Tombol Mobile Bersebelahan */}
        <section
          id="top"
          aria-labelledby="hero-clean-heading"
          className="relative z-20 mx-auto w-full max-w-[1480px] 2xl:max-w-[1680px] px-5 pt-4 pb-6 sm:px-8 sm:pt-8 lg:px-12 xl:px-16 lg:pt-10 lg:pb-8"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Editorial Serif Title + Copy + 2 Pill Buttons */}
            <div className="lg:col-span-5 relative z-20 flex flex-col items-center text-center sm:items-start sm:text-left">
              <h1
                id="hero-clean-heading"
                className="font-heading text-[2.45rem] font-normal leading-[1.1] tracking-[-0.02em] text-[#2A2D22] sm:text-[3.2rem] lg:text-[3.75rem] xl:text-[4.1rem]"
              >
                Pendamping ibu
                <br />
                <span className="text-[#E46C8E]">menjalani</span>
                <br />
                masa nifas
              </h1>

              <p className="mt-5 max-w-md lg:max-w-lg text-xs sm:text-[14.5px] leading-[1.75] text-[#6E6A6C]">
                <strong className="font-semibold text-[#2A2D22]">
                  Buna Ceria
                </strong>{' '}
                adalah webapp pembelajaran ibu masa nifas, meningkatkan
                pengetahuan tentang cara mengatasi kecemasan dan memahami
                kecukupan ASI agar ibu dapat menjalani masa pemulihan dan
                merawat bayi dengan lebih percaya.
              </p>

              {/* 2 Action Buttons: Selalu Bersebelahan 1 Baris di Mobile & Desktop */}
              <div className="mt-7 flex flex-row flex-nowrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => enterWebApp('beranda')}
                  className="inline-flex min-h-[42px] whitespace-nowrap items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-[#E46C8E] to-[#F08BA8] px-4 sm:px-6 py-2.5 text-xs sm:text-[13.5px] font-semibold text-white shadow-[0_8px_20px_rgba(228,108,142,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(228,108,142,0.4)] active:scale-95 cursor-pointer"
                >
                  <span>Buka WebApp</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </button>

                <a
                  href="#fitur-webapp"
                  className="inline-flex min-h-[42px] whitespace-nowrap items-center justify-center gap-2 rounded-full border border-[#B8C294] bg-white px-4 sm:px-5 py-2 text-xs sm:text-[13.5px] font-semibold text-[#2A2D22] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:bg-[#F6F8F0] hover:shadow-[0_10px_24px_rgba(142,155,94,0.18)] active:scale-95"
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8E9B5E] text-white">
                    <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                  </span>
                </a>
              </div>
            </div>

            {/* Right Column: Foto Ibu Hamil di Sofa (Utuh, Menyatu Halus dengan Latar Pink & Elemen Dekoratif Rapi) */}
            <div className="relative flex justify-center lg:col-span-7 lg:justify-end">
              <div className="relative w-full max-w-[540px] sm:max-w-[600px] lg:max-w-[680px] xl:max-w-[740px] px-2 sm:px-4 py-2 transition-transform duration-500 hover:scale-[1.01]">
                {/* Ambient Soft Pink & Sage Glow di Belakang Subjek agar Menyatu Sempurna */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-6 -z-10 rounded-full bg-gradient-to-tr from-[#FCE4EC]/75 via-[#FFF5F8]/60 to-[#EFF5E4]/70 blur-2xl"
                />

                {/* Floating Frosted Card: Posisi Aman di Dalam Kontainer agar Tidak Terpotong */}
                <div className="absolute right-3 sm:right-7 top-[14%] sm:top-[18%] z-20 rounded-[20px] border border-white/90 bg-white/88 px-3.5 py-3 sm:px-4 sm:py-3.5 shadow-[0_12px_32px_rgba(200,75,113,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(200,75,113,0.18)]">
                  <div className="flex items-start gap-2.5 text-left">
                    <Sparkles
                      className="mt-0.5 h-4 w-4 text-[#E46C8E] shrink-0"
                      strokeWidth={2}
                    />
                    <div>
                      <p className="font-heading text-xs sm:text-[13px] italic leading-snug text-[#4A4547]">
                        Sehatnya Ibu,
                        <br />
                        Bahagianya
                        <br />
                        Si Kecil
                      </p>
                      <Sparkles className="mt-1.5 h-3 w-3 text-[#F7C6D4]" />
                    </div>
                  </div>
                </div>

                <Image
                  src="/hero-landing-reference.webp"
                  alt="Ibu hamil Buna Ceria tersenyum tenang memegang perut di sofa"
                  width={1200}
                  height={896}
                  priority
                  className="hero-image-blend h-auto w-full object-contain object-center select-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            2. FLOATING 3-COLUMN CARD UNDER HERO
           =================================================================== */}
        <div className="relative z-30 mx-auto -mt-2 sm:-mt-5 w-full max-w-[1480px] 2xl:max-w-[1680px] px-5 pb-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="rounded-[26px] border border-[#F5DCE4] bg-white/95 p-6 sm:p-7 shadow-[0_12px_36px_rgba(200,75,113,0.06)] backdrop-blur-xs transition-all duration-300 hover:shadow-[0_16px_42px_rgba(200,75,113,0.11)]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[#F5E4EA]">
              {/* Col 1 */}
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-4 md:pr-6 lg:pr-8 transition-transform duration-300 hover:-translate-y-0.5">
                <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E] shadow-2xs">
                  <BookOpen className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22]">
                    Informasi Terpercaya
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#767A6E]">
                    Materi disusun dari sumber kesehatan yang jelas dan mudah dipahami.
                  </p>
                </div>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-4 md:px-6 lg:px-8 transition-transform duration-300 hover:-translate-y-0.5">
                <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#F2F5E8] text-[#8E9B5E] shadow-2xs">
                  <Sparkles className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22]">
                    Mudah Diakses
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#767A6E]">
                    Bisa dibaca kapan saja untuk menemani perjalanan nifas.
                  </p>
                </div>
              </div>

              {/* Col 3 */}
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-4 md:pl-6 lg:pl-8 transition-transform duration-300 hover:-translate-y-0.5">
                <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E] shadow-2xs">
                  <Users className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22]">
                    Pendamping Setia
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#767A6E]">
                    Membantu ibu memahami setiap tahap nifas dengan lebih tenang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN CONTENT AREA
         ===================================================================== */}
      <main className="mx-auto w-full max-w-[1480px] 2xl:max-w-[1680px] space-y-20 px-5 py-14 sm:space-y-24 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
        {/* =====================================================================
            3. SECTION "3 TIPS PENTING UNTUK IBU NIFAS"
           ===================================================================== */}
        <motion.section
          id="tips-nifas"
          aria-labelledby="tips-nifas-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Sisi Kiri (5 Kolom): Rata Tengah di Mobile, Rata Kiri di Tablet/Desktop */}
            <div className="lg:col-span-5 flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <span className="h-[1px] w-5 bg-[#8E9B5E]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8E9B5E]">
                  PANDUAN MASA NIFAS &amp; MENYUSUI
                </span>
              </div>

              <h2
                id="tips-nifas-heading"
                className="mt-3 font-heading text-3xl sm:text-[2.35rem] font-normal leading-[1.14] text-[#2A2D22]"
              >
                3 Tips Penting
                <br />
                <span className="text-[#E46C8E]">untuk Ibu Nifas</span>
              </h2>

              <p className="mt-4 text-xs sm:text-[13.5px] leading-[1.7] text-[#6E6A6C]">
                Langkah sederhana untuk mendukung menyusui dan menjaga kesehatan
                Bunda pascapersalinan agar masa pemulihan berjalan nyaman dan
                tenang.
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => enterWebApp('tips')}
                  className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full border border-[#F0B8C8] bg-white px-5 py-1.5 text-xs font-semibold text-[#E46C8E] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:bg-[#FCEBEF]/60 hover:shadow-[0_10px_24px_rgba(228,108,142,0.16)] active:scale-95 cursor-pointer"
                >
                  <span>Mulai Belajar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Sisi Kanan (7 Kolom): 3 Kartu Putih dengan Animasi Hover & Sentuh */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
              {/* Kartu Tip Nifas 1 */}
              <div
                onClick={() => enterWebApp('materi')}
                className="flex flex-col items-center text-center rounded-[22px] border border-[#F5DCE4] bg-white p-5 shadow-[0_6px_24px_rgba(200,75,113,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F0B8C8] hover:shadow-[0_14px_32px_rgba(228,108,142,0.15)] active:scale-[0.98] cursor-pointer"
              >
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src="/feature-tips.webp"
                    alt="Kenali dan kelola kecemasan masa nifas"
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
                <h3 className="mt-3.5 font-sans text-xs sm:text-[13.5px] font-bold text-[#2A2D22] leading-snug">
                  Kenali dan Kelola Kecemasan
                </h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#767A6E]">
                  Mengenali perubahan emosi, penyebab kecemasan, dan menemukan
                  cara sederhana agar Bunda lebih tenang selama masa nifas.
                </p>
              </div>

              {/* Kartu Tip Nifas 2 */}
              <div
                onClick={() => enterWebApp('tips')}
                className="flex flex-col items-center text-center rounded-[22px] border border-[#F5DCE4] bg-white p-5 shadow-[0_6px_24px_rgba(200,75,113,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F0B8C8] hover:shadow-[0_14px_32px_rgba(228,108,142,0.15)] active:scale-[0.98] cursor-pointer"
              >
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src="/feature-stages.webp"
                    alt="Tahapan menyusui dan istirahat cukup"
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
                <h3 className="mt-3.5 font-sans text-xs sm:text-[13.5px] font-bold text-[#2A2D22] leading-snug">
                  Tahapan Menyusui &amp; Istirahat
                </h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#767A6E]">
                  Susui Si Kecil secara berkala dan manfaatkan waktu tidur bayi
                  agar Bunda turut beristirahat dengan tenang.
                </p>
              </div>

              {/* Kartu Tip Nifas 3 */}
              <div
                onClick={() => enterWebApp('beranda')}
                className="flex flex-col items-center text-center rounded-[22px] border border-[#F5DCE4] bg-white p-5 shadow-[0_6px_24px_rgba(200,75,113,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F0B8C8] hover:shadow-[0_14px_32px_rgba(228,108,142,0.15)] active:scale-[0.98] cursor-pointer"
              >
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src="/feature-consult.webp"
                    alt="Belajar di BUNA CERIA!"
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
                <h3 className="mt-3.5 font-sans text-xs sm:text-[13.5px] font-bold text-[#2A2D22] leading-snug">
                  Belajar di BUNA CERIA!
                </h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#767A6E]">
                  Temukan informasi, edukasi, dan aktivitas menarik untuk
                  membantu Bunda lebih percaya diri menjalani masa nifas dan
                  menyusui.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =====================================================================
            4. FITUR LENGKAP PEMBELAJARAN
           ===================================================================== */}
        <motion.section
          id="fitur-webapp"
          aria-labelledby="fitur-webapp-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          {/* Editorial Heading: Rata Tengah di Mobile, Rata Kiri di Desktop */}
          <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="hidden sm:inline-block h-[1.5px] w-6 bg-[#8E9B5E]" />
              <h2
                id="fitur-webapp-heading"
                className="font-heading text-2xl sm:text-3xl font-bold text-[#2A2D22]"
              >
                Fitur Lengkap Pembelajaran
              </h2>
            </div>
            <p className="mt-1.5 sm:pl-9 text-xs sm:text-sm text-[#767A6E]">
              Belajar dengan mudah, lengkap, dan interaktif.
            </p>
          </div>

          {/* 4 Minimalist White Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {/* Card 1 */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group flex flex-col items-center text-center sm:items-start sm:text-left rounded-[24px] border border-[#F5DCE4] bg-white p-6 shadow-[0_8px_26px_rgba(200,75,113,0.05)] hover:border-[#F0B8C8] hover:shadow-[0_14px_34px_rgba(228,108,142,0.16)] hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E]">
                <BookOpen className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 truncate font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22] group-hover:text-[#E46C8E] transition-colors">
                3 Tingkatan Belajar
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#767A6E]">
                Materi berjenjang dari dasar, refleksi diri &amp; tips, hingga Kebun Bunga Delima serta evaluasi tahap akhir.
              </p>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group flex flex-col items-center text-center sm:items-start sm:text-left rounded-[24px] border border-[#F5DCE4] bg-white p-6 shadow-[0_8px_26px_rgba(200,75,113,0.05)] hover:border-[#F0B8C8] hover:shadow-[0_14px_34px_rgba(228,108,142,0.16)] hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E]">
                <FileText className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 truncate font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22] group-hover:text-[#E46C8E] transition-colors">
                Ruang Baca Fokus
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#767A6E]">
                Artikel dan modul pilihan untuk menambah wawasan dengan nyaman.
              </p>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group flex flex-col items-center text-center sm:items-start sm:text-left rounded-[24px] border border-[#F5DCE4] bg-white p-6 shadow-[0_8px_26px_rgba(200,75,113,0.05)] hover:border-[#B8C294] hover:shadow-[0_14px_34px_rgba(142,155,94,0.16)] hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F5E8] text-[#8E9B5E]">
                <CheckCircle2 className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 truncate font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22] group-hover:text-[#8E9B5E] transition-colors">
                Skrining PASS &amp; Kuis
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#767A6E]">
                Pre-Test awal dan Post-Test Tahap Akhir (Hari ke-7) untuk mengukur ketenangan dan pemahaman Bunda.
              </p>
            </div>

            {/* Card 4 */}
            <div
              onClick={() => enterWebApp('selfie')}
              className="group flex flex-col items-center text-center sm:items-start sm:text-left rounded-[24px] border border-[#F5DCE4] bg-white p-6 shadow-[0_8px_26px_rgba(200,75,113,0.05)] hover:border-[#F0B8C8] hover:shadow-[0_14px_34px_rgba(228,108,142,0.16)] hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E]">
                <Camera className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 truncate font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22] group-hover:text-[#E46C8E] transition-colors">
                Dukungan Suami &amp; Selfie
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#767A6E]">
                Abadikan momen nifas bersama pasangan dengan bingkai estetik dan siluet ramah.
              </p>
            </div>
          </div>
        </motion.section>

        {/* =====================================================================
            5. DAFTAR PUSTAKA (Poin 2: Proporsional, Berisi 3 Poin Ringkas & Tombol Utama Solid Pink)
           ===================================================================== */}
        <motion.section
          id="daftar-pustaka"
          aria-labelledby="pustaka-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          <div className="rounded-[28px] border border-[#F5DCE4] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_10px_36px_rgba(200,75,113,0.05)] transition-all duration-300 hover:shadow-[0_16px_42px_rgba(200,75,113,0.1)]">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Left Column: Ilustrasi Ibu & Bayi Daftar Pustaka */}
              <div className="lg:col-span-5">
                <div className="relative aspect-square max-w-[380px] mx-auto w-full overflow-hidden rounded-[24px] bg-[#C94444] shadow-sm">
                  <Image
                    src="/scan-1.webp"
                    alt="Ibu Masa Nifas Memeluk Buah Hati — Daftar Pustaka Buna Ceria"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Right Column: Vertically Centered, Enlarged Typography, 3 Highlight Points, & Large Solid Pink CTA */}
              <div className="lg:col-span-7 flex flex-col justify-center items-center text-center sm:items-start sm:text-left space-y-5">
                {/* Badge Jumlah Referensi Ilmiah */}
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FCEBEF] border border-[#F5DCE4] px-3.5 py-1 text-xs font-bold text-[#C84B71]">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{references.length} Referensi Medis &amp; Jurnal Terverifikasi</span>
                </span>

                <div>
                  <h2
                    id="pustaka-heading"
                    className="font-heading text-2xl sm:text-3xl lg:text-[2.15rem] font-bold text-[#2A2D22] leading-tight"
                  >
                    Daftar Pustaka &amp; Rujukan Medis
                  </h2>
                  <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#6E6A6C] max-w-xl">
                    Seluruh materi edukasi dan panduan di Buna Ceria disusun berdasarkan literatur kebidanan, pedoman kesehatan ibu dan anak, serta jurnal ilmiah yang kredibel.
                  </p>
                </div>

                {/* 3 Poin Ringkas dengan Ikon Pengisi Ruang agar Seimbang & Informatif */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 rounded-2xl border border-[#F5DCE4] bg-[#FFF8FA] p-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FCEBEF] text-[#E46C8E]">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-bold text-[#2A2D22]">
                        Sumber Medis Terpercaya
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#767A6E]">
                        Rujukan jurnal &amp; klinis kebidanan resmi
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 rounded-2xl border border-[#E4EAC9] bg-[#F8FAF2] p-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF0D5] text-[#56632A]">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-bold text-[#2A2D22]">
                        Pedoman Kesehatan KIA
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#767A6E]">
                        Selaras standar kesehatan ibu &amp; anak
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 rounded-2xl border border-[#F5DCE4] bg-[#FFF8FA] p-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FCEBEF] text-[#E46C8E]">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-bold text-[#2A2D22]">
                        Diperbarui Berkala
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#767A6E]">
                        Kurasi materi mudah dipahami Bunda
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tombol Utama "Lihat Daftar" Berukuran Lebih Besar & Solid Pink */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReferences((prev) => !prev)}
                    aria-expanded={showReferences}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#E46C8E] to-[#F08BA8] px-7 py-3 text-sm sm:text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(228,108,142,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(228,108,142,0.42)] active:scale-95 cursor-pointer"
                  >
                    <span>{showReferences ? 'Sembunyikan Daftar Pustaka' : 'Lihat Daftar Pustaka'}</span>
                    {showReferences ? (
                      <ChevronUp className="h-4 w-4 stroke-[2.4]" />
                    ) : (
                      <ArrowRight className="h-4 w-4 stroke-[2.4]" />
                    )}
                  </button>
                </div>

                {/* Poin Daftar Pustaka muncul tepat di bawah tombol "Lihat Daftar" */}
                <AnimatePresence>
                  {showReferences && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: CUSTOM_EASE }}
                      className="overflow-hidden pt-2 w-full text-left"
                    >
                      <ReferenceList references={references} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* =====================================================================
          6. FOOTER
         ===================================================================== */}
      <Footer />
    </div>
  );
}

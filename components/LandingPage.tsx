'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  ChevronUp,
  Clock,
  GraduationCap,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
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

  // Item 10: Navbar untuk langsung menuju halaman/section website tertentu
  const navLinks = [
    { label: 'Beranda', href: '#top' },
    { label: '3 Tips Nifas', href: '#tips-nifas' },
    { label: 'Fitur Pembelajaran', href: '#fitur-webapp' },
    { label: 'Daftar Pustaka', href: '#daftar-pustaka' },
    { label: 'Narahubung', href: '#narahubung' },
  ];

  const sectionRevealProps = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.42, ease: CUSTOM_EASE },
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim().toLowerCase().includes('pustaka')) {
      setShowReferences(true);
      document.getElementById('daftar-pustaka')?.scrollIntoView({ behavior: 'smooth' });
    } else if (
      headerSearch.trim().toLowerCase().includes('nifas') ||
      headerSearch.trim().toLowerCase().includes('tips')
    ) {
      document.getElementById('tips-nifas')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('fitur-webapp')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2A2D22] selection:bg-[#FCE8EE] selection:text-[#C84B71]">
      {/* =====================================================================
          1. HEADER & HERO BANNER (Items 1, 7, 8, 9, 10 & pdf_img_3.png)
         ===================================================================== */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FDF2F5] via-[#FDF2F5] to-[#FAF0F3]">
        {/* Item 9 & 10: Header berisi logo, nama webapp, navbar, dan tombol webapp */}
        <header className="relative z-30 mx-auto max-w-6xl px-5 pt-5 pb-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4 rounded-full border border-pink-100/80 bg-white/85 px-4 py-2.5 shadow-2xs backdrop-blur-md sm:px-6">
            {/* Left: Logo + Nama Webapp */}
            <a
              href="#top"
              className="flex items-center gap-3 group shrink-0"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FDF2F5] border border-pink-100 p-1.5 shadow-2xs transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Buna Ceria Teman Kasih"
                  width={34}
                  height={34}
                  className="h-7 w-7 object-contain"
                />
              </span>
              <div className="text-left">
                <span className="block font-heading text-base font-extrabold tracking-tight text-[#2A2D22] leading-none">
                  BUNA CERIA
                </span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#C84B71] leading-none">
                  TEMAN KASIH
                </span>
              </div>
            </a>

            {/* Center: Navbar Links (Desktop) */}
            <nav
              aria-label="Navigasi utama website"
              className="hidden lg:flex lg:items-center lg:gap-7"
            >
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[13px] font-semibold text-[#2A2D22]/85 transition-colors hover:text-[#C84B71]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right: Search + Masuk + Tombol Beralih ke Webapp */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-3">
              <form
                onSubmit={handleSearchSubmit}
                className="hidden xl:flex items-center gap-2 rounded-full bg-[#FAF8FC] border border-pink-100 px-3.5 py-1.5 focus-within:border-[#C84B71] focus-within:bg-white transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-[#8C8896] shrink-0" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Telusuri info..."
                  className="w-28 bg-transparent text-xs text-[#2A2D22] placeholder:text-[#A09CA8] outline-none"
                />
              </form>

              {!session ? (
                <button
                  type="button"
                  onClick={openLoginDialog}
                  className="hidden sm:inline-block text-xs font-bold text-[#2A2D22]/85 transition-colors hover:text-[#C84B71] cursor-pointer px-2"
                >
                  Masuk / Daftar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => enterWebApp('beranda')}
                  className="hidden sm:inline-block max-w-[130px] truncate text-xs font-bold text-[#C84B71] cursor-pointer px-2"
                >
                  Halo, {session.name.split(' ')[0]}
                </button>
              )}

              {/* Item 7 & 9: Tombol Beralih ke Webapp */}
              <button
                type="button"
                onClick={() => enterWebApp('beranda')}
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#C84B71] px-5 py-2 text-xs sm:text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(200,75,113,0.25)] transition-all hover:bg-[#b23b60] hover:shadow-[0_8px_22px_rgba(200,75,113,0.34)] cursor-pointer"
              >
                <span>Buka WebApp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-label="Menu navigasi"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8FC] border border-pink-100 text-[#2A2D22] lg:hidden cursor-pointer"
              >
                {mobileNavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Nav */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden rounded-[22px] border border-pink-100 bg-white p-4 shadow-lg lg:hidden"
              >
                <div className="flex flex-col space-y-1.5">
                  {navLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#2A2D22] hover:bg-[#FDF2F5]"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="pt-3 mt-1 border-t border-gray-100 flex flex-col gap-2">
                    {!session && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          openLoginDialog();
                        }}
                        className="w-full rounded-full border border-pink-200 py-2.5 text-xs font-bold text-[#2A2D22] cursor-pointer"
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
                      className="w-full rounded-full bg-[#C84B71] py-2.5 text-xs font-bold text-white cursor-pointer"
                    >
                      Buka WebApp Belajar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Item 1: Beranda Informasi Webapp (Hero Banner) */}
        <section
          id="top"
          aria-labelledby="hero-clean-heading"
          className="relative z-20 mx-auto max-w-6xl px-5 pt-6 pb-14 sm:px-8 sm:pt-10 sm:pb-16 lg:px-10 lg:pt-12 lg:pb-20"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Heading + Brief Intro + 2 Buttons (Items 7 & 8) */}
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-pink-200 px-3.5 py-1 text-xs font-bold text-[#C84B71] shadow-2xs mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>WebApp Edukasi Kehamilan Pertama • Buna Ceria</span>
              </span>

              <h1
                id="hero-clean-heading"
                className="font-sans text-[2.5rem] font-extrabold leading-[1.1] tracking-tight text-[#2A2D22] sm:text-[3.2rem] lg:text-[3.45rem]"
              >
                <span className="text-[#C84B71]">Pendamping</span> kehamilan
                <br />
                pertama
              </h1>

              <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-[#5C585A]">
                Buna Ceria • Teman Kasih adalah webapp pembelajaran kehamilan yang dirancang
                khusus untuk memandu Ibu melewati trimester pertama hingga masa nifas
                secara bertahap, tenang, dan bebas dari rasa cemas.
              </p>

              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-[#5C585A]">
                Dilengkapi 4 level pembelajaran bertahap, kuis pemahaman, sapa perasaan harian,
                studio foto <em>Take Selfie</em> bersama pasangan, serta kontak langsung ke bidan ahli.
              </p>

              {/* Action Buttons: Item 7 (Beralih ke Webapp) & Item 8 (Langsung ke Fitur Lengkap Pembelajaran) */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => enterWebApp('beranda')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#C84B71] px-7 py-3 text-[13.5px] font-bold text-white shadow-[0_10px_24px_rgba(200,75,113,0.28)] transition-all hover:bg-[#b23b60] hover:shadow-[0_12px_28px_rgba(200,75,113,0.38)] cursor-pointer"
                >
                  <span>Buka WebApp</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#fitur-webapp"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#E6D4DC] bg-white px-6 py-3 text-[13px] font-bold text-[#2A2D22] hover:bg-[#FDF2F5] hover:border-[#C84B71] transition-colors"
                >
                  <span>Fitur Lengkap Pembelajaran</span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Utama Ibu Hamil & Badge (Sesuai pdf_img_3.png) */}
            <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
              <div className="relative flex items-center justify-center">
                {/* Floating Badge (Sesuai pdf_img_3.png) */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/95 border border-pink-100 px-4 py-2 text-xs font-bold text-[#2A2D22] shadow-md backdrop-blur-xs">
                  <Heart className="h-3.5 w-3.5 fill-[#C84B71] text-[#C84B71] shrink-0" />
                  <span>Sehatnya Ibu, Bahagianya Si Kecil</span>
                </div>

                <div className="relative z-10 w-[320px] sm:w-[410px] lg:w-[450px] xl:w-[480px]">
                  <Image
                    src="/ibu-hamil-bunga.webp"
                    alt="Ibu hamil tersenyum tenang memegang perut dengan visualisasi janin sehat penuh kasih"
                    width={767}
                    height={759}
                    priority
                    className="mx-auto h-auto w-full object-contain drop-shadow-[0_20px_35px_rgba(200,75,113,0.14)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================================
          2. BAR BAWAH HERO BANNER (Item 2 & pdf_img_0.png)
          "Informasi Terpercaya | Mudah Diakses | Pendamping Setia"
         ===================================================================== */}
      <section
        aria-label="Keunggulan Utama Buna Ceria"
        className="relative z-20 bg-[#F5D0DC] border-y border-[#EBBBC9]"
      >
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[#DFABB9]">
            {/* Poin 1: Informasi Terpercaya */}
            <div className="flex items-start gap-4 md:pr-6 lg:pr-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-[#8E9B5E] shadow-2xs">
                <ShieldCheck className="h-6 w-6" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22] leading-snug">
                  Informasi Terpercaya
                </h2>
                <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-[#4A4547]">
                  Materi disusun dari sumber kesehatan yang jelas dan mudah dipahami.
                </p>
              </div>
            </div>

            {/* Poin 2: Mudah Diakses */}
            <div className="flex items-start gap-4 md:px-6 lg:px-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-[#8E9B5E] shadow-2xs">
                <Clock className="h-6 w-6" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22] leading-snug">
                  Mudah Diakses
                </h2>
                <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-[#4A4547]">
                  Bisa dibaca kapan saja untuk menemani perjalanan kehamilan.
                </p>
              </div>
            </div>

            {/* Poin 3: Pendamping Setia */}
            <div className="flex items-start gap-4 md:pl-6 lg:pl-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-[#C84B71] shadow-2xs">
                <Heart className="h-6 w-6 fill-[#C84B71]" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22] leading-snug">
                  Pendamping Setia
                </h2>
                <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-[#4A4547]">
                  Membantu ibu memahami setiap tahap kehamilan dengan lebih tenang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MAIN CONTENT AREA (Konsisten max-w-6xl & Vertical Rhythm Rapi)
         ===================================================================== */}
      <main className="mx-auto max-w-6xl space-y-20 px-5 py-16 sm:space-y-24 sm:px-8 sm:py-20 lg:px-10">
        {/* =====================================================================
            3. SECTION "3 TIPS PENTING UNTUK IBU NIFAS" (Item 3, pdf_img_1.png & pdf_img_3.png)
            Menggantikan bagian "Terdaftar & terkurasi" sesuai instruksi Client Brief!
           ===================================================================== */}
        <motion.section
          id="tips-nifas"
          aria-labelledby="tips-nifas-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          {/* Judul & Subjudul Sesuai Item 3 Client Brief */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4EAC9] bg-[#F5F8EB] px-4 py-1 text-xs font-bold text-[#56632A]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Edukasi Pascapersalinan &amp; Menyusui</span>
            </span>
            <h2
              id="tips-nifas-heading"
              className="mt-3.5 font-heading text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-[#2A2D22] tracking-tight leading-snug"
            >
              3 Tips Penting untuk Ibu Nifas
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#6E6A6C] max-w-2xl mx-auto leading-relaxed">
              Langkah sederhana untuk mendukung menyusui dan menjaga kesehatan Bunda
            </p>
          </div>

          {/* 3 Kolom Ilustrasi Equal-Height (Sesuai pdf_img_1.png & pdf_img_3.png) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-center items-stretch">
            {/* Tips Nifas 1 */}
            <div className="flex h-full flex-col items-center justify-between rounded-[24px] border border-[#F3E8EE] bg-[#FFFBFD] p-6 sm:p-7 shadow-2xs">
              <div className="flex flex-col items-center">
                <div className="relative aspect-square w-44 sm:w-48 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/feature-tips.webp"
                    alt="Penuhi nutrisi dan cairan harian Bunda selama masa nifas"
                    width={566}
                    height={566}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-4 rounded-full bg-[#FCE8EE] px-3.5 py-1 text-[11px] font-bold text-[#C84B71]">
                  Tips Nifas 01
                </span>
                <h3 className="mt-3 font-sans text-lg font-bold text-[#2A2D22] leading-snug">
                  Penuhi nutrisi &amp; cairan untuk kelancaran ASI
                </h3>
                <p className="mt-2 text-xs sm:text-[13.5px] leading-relaxed text-[#6E6A6C]">
                  Konsumsi makanan bergizi tinggi protein, sayur hijau, dan minum air putih hangat yang cukup setiap habis menyusui agar produksi ASI lancar dan pemulihan tubuh Bunda optimal.
                </p>
              </div>
            </div>

            {/* Tips Nifas 2 */}
            <div className="flex h-full flex-col items-center justify-between rounded-[24px] border border-[#EBF0D8] bg-[#FCFDF9] p-6 sm:p-7 shadow-2xs">
              <div className="flex flex-col items-center">
                <div className="relative aspect-square w-44 sm:w-48 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/feature-stages.webp"
                    alt="Istirahat cukup dan rawat kebersihan pemulihan masa nifas"
                    width={524}
                    height={524}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-4 rounded-full bg-[#F5F8EB] px-3.5 py-1 text-[11px] font-bold text-[#56632A]">
                  Tips Nifas 02
                </span>
                <h3 className="mt-3 font-sans text-lg font-bold text-[#2A2D22] leading-snug">
                  Istirahat selaras jadwal tidur Si Kecil
                </h3>
                <p className="mt-2 text-xs sm:text-[13.5px] leading-relaxed text-[#6E6A6C]">
                  Ikutlah beristirahat saat bayi tertidur, jaga kebersihan luka persalinan secara berkala, dan lakukan gerakan peregangan ringan bertahap agar tubuh Bunda kembali segar.
                </p>
              </div>
            </div>

            {/* Tips Nifas 3 */}
            <div className="flex h-full flex-col items-center justify-between rounded-[24px] border border-[#F3E8EE] bg-[#FFFBFD] p-6 sm:p-7 shadow-2xs">
              <div className="flex flex-col items-center">
                <div className="relative aspect-square w-44 sm:w-48 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/feature-consult.webp"
                    alt="Kenali perubahan emosi dan konsultasi langsung dengan bidan"
                    width={636}
                    height={636}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-4 rounded-full bg-[#FCE8EE] px-3.5 py-1 text-[11px] font-bold text-[#C84B71]">
                  Tips Nifas 03
                </span>
                <h3 className="mt-3 font-sans text-lg font-bold text-[#2A2D22] leading-snug">
                  Berbagi peran &amp; jangan ragu konsultasi ahli
                </h3>
                <p className="mt-2 text-xs sm:text-[13.5px] leading-relaxed text-[#6E6A6C]">
                  Libatkan pasangan dalam merawat bayi untuk mencegah kelelahan berlebih (<em>baby blues</em>), serta konsultasikan pelekatan menyusui bersama bidan pendamping kami.
                </p>
              </div>
            </div>
          </div>

          {/* Tombol CTA Tengah (Sesuai pdf_img_1.png & pdf_img_3.png) */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => enterWebApp('beranda')}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#E5536C] px-8 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(229,83,108,0.28)] hover:bg-[#d44059] hover:shadow-[0_12px_28px_rgba(229,83,108,0.36)] transition-all cursor-pointer"
            >
              <span>Buka WebApp Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.section>

        {/* =====================================================================
            4. FITUR LENGKAP PEMBELAJARAN (Item 4 & pdf_img_3.png)
           ===================================================================== */}
        <motion.section
          id="fitur-webapp"
          aria-labelledby="fitur-webapp-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-white px-4 py-1 text-xs font-bold text-[#C84B71] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Di Dalam WebApp Buna Ceria • Teman Kasih</span>
            </span>
            <h2
              id="fitur-webapp-heading"
              className="mt-3.5 font-heading text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-[#2A2D22] tracking-tight leading-snug"
            >
              Fitur Lengkap Pembelajaran
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#6E6A6C] max-w-xl mx-auto leading-relaxed">
              Dirancang dengan alur 4 level yang memandu langkah demi langkah agar Ibu
              tidak merasa lelah atau pusing dengan banjir informasi medis.
            </p>
          </div>

          {/* 4 Showcase Feature Cards Equal-Height (Sesuai pdf_img_3.png) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
            {/* CARD 1: 4 Level Tahapan Belajar */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group relative flex h-full flex-col justify-between rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(86,99,42,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F8EB] text-[#56632A] border border-[#E4EAC9] transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <GraduationCap className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#2A2D22] group-hover:text-[#56632A] transition-colors leading-snug">
                  4 Level Pembelajaran
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                  Level 1 Materi → Level 2 Quiz → Level 3 Refleksi → Level 4 Hasil Saya. Menggunakan elemen bulat &amp; garis penghubung bertahap.
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#F0ECF5] flex items-center justify-between text-xs font-bold text-[#56632A]">
                <span>Buka Alur 4 Level</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* CARD 2: Modul & Ruang Baca Fokus */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group relative flex h-full flex-col justify-between rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(200,75,113,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF2F5] text-[#C84B71] border border-pink-100 transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <BookOpen className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors leading-snug">
                  Ruang Baca &amp; Tips
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                  Modul kehamilan interaktif dengan pengaturan teks nyaman (Aa), ditambah kumpulan tips kehamilan harian terkurasi.
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#F0ECF5] flex items-center justify-between text-xs font-bold text-[#C84B71]">
                <span>Mulai Membaca</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* CARD 3: Kuis & Kuesioner Kecemasan */}
            <div
              onClick={() => enterWebApp('beranda')}
              className="group relative flex h-full flex-col justify-between rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(217,119,6,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF8EB] text-[#C26100] border border-amber-100 transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <Award className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#2A2D22] group-hover:text-[#C26100] transition-colors leading-snug">
                  Kuis &amp; Sapa Perasaan
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                  Pertanyaan perasaan harian beserta tipsnya, kuesioner kecemasan yang tersimpan otomatis, serta kuis pemahaman ramah.
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#F0ECF5] flex items-center justify-between text-xs font-bold text-[#C26100]">
                <span>Ikuti Kuis &amp; Sapa</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* CARD 4: Take Selfie Pasangan & Kontak Ahli */}
            <div
              onClick={() => enterWebApp('selfie')}
              className="group relative flex h-full flex-col justify-between rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(2,132,199,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF8FF] text-[#0284C7] border border-blue-100 transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <Camera className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#2A2D22] group-hover:text-[#0284C7] transition-colors leading-snug">
                  Take Selfie &amp; Kontak Ahli
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                  Foto bersama pasangan dengan panduan garis putus-putus, edit nama di bingkai foto, unduh hasil foto, &amp; konsultasi bidan.
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#F0ECF5] flex items-center justify-between text-xs font-bold text-[#0284C7]">
                <span>Coba Take Selfie</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Banner Ajakan Masuk WebApp (Sesuai pdf_img_3.png) */}
          <div className="mt-10 rounded-[24px] border border-[#ECE7F2] bg-[#FAF6F8] p-6 sm:p-8 shadow-[0_4px_24px_rgba(40,40,60,0.04)]">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-white px-3.5 py-1 text-xs font-bold text-[#C84B71]">
                  <Heart className="h-3.5 w-3.5 fill-[#C84B71]" />
                  <span>Ruang Belajar Interaktif</span>
                </span>
                <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#2A2D22] tracking-tight">
                  Siap memulai perjalanan kehamilan yang tenang?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#6E6A6C] leading-relaxed max-w-xl">
                  Buka WebApp Buna Ceria • Teman Kasih sekarang untuk mengikuti 4 level tahapan belajar, sapa perasaan harian, foto pasangan <em>Take Selfie</em>, dan dukungan bidan.
                </p>
              </div>

              <div className="hidden lg:flex lg:col-span-1 justify-center">
                <div className="h-16 w-px bg-[#E5DCE2]" />
              </div>

              <div className="flex lg:col-span-3 lg:justify-end">
                <button
                  type="button"
                  onClick={() => enterWebApp('beranda')}
                  className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#C84B71] hover:bg-[#b23b60] px-7 py-3 text-sm font-bold text-white shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Masuk ke WebApp</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =====================================================================
            5. DAFTAR PUSTAKA (Item 5 & pdf_img_3.png)
            "Daftar pustaka menggunakan poin, tapi poin muncul setelah pencet 'lihat daftar'"
           ===================================================================== */}
        <motion.section
          id="daftar-pustaka"
          aria-labelledby="pustaka-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          {/* Card 2 Kolom sesuai pdf_img_3.png: Gambar USG di kiri + Teks & Tombol "Lihat Daftar ->" di kanan */}
          <div className="rounded-[26px] border border-[#ECE7F2] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(40,40,60,0.04)]">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Left Image (/scan-1.jpg sesuai pdf_img_3.png) */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-pink-100 bg-[#FAF8FC] shadow-xs">
                  <Image
                    src="/scan-1.jpg"
                    alt="Pemeriksaan USG Kehamilan dan Referensi Medis Resmi"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Content: Heading + Explanation + Button "Lihat Daftar" */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F8EB] border border-[#E4EAC9] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Transparansi &amp; Referensi Ilmiah</span>
                </span>

                <h2
                  id="pustaka-heading"
                  className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#2A2D22]"
                >
                  Daftar Pustaka
                </h2>

                <p className="text-sm sm:text-[15px] leading-relaxed text-[#6E6A6C]">
                  Seluruh materi edukasi kehamilan, panduan masa nifas, kuis pemahaman, dan instrumen sapa perasaan di dalam WebApp Buna Ceria • Teman Kasih disusun berdasarkan literatur klinis resmi Kementerian Kesehatan RI, WHO, POGI, dan IBI.
                </p>

                <p className="text-xs sm:text-sm text-[#767A6E]">
                  Klik tombol <strong>Lihat Daftar</strong> di bawah ini untuk menampilkan daftar poin pustaka lengkap beserta tautan dokumen resminya.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReferences((prev) => !prev)}
                    aria-expanded={showReferences}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full bg-[#C84B71] hover:bg-[#b23b60] px-7 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(200,75,113,0.25)] transition-all cursor-pointer"
                  >
                    <span>{showReferences ? 'Sembunyikan Daftar' : 'Lihat Daftar'}</span>
                    {showReferences ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Poin-poin Daftar Pustaka yang BARU MUNCUL setelah tombol "Lihat Daftar" dipencet */}
            <AnimatePresence>
              {showReferences && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: CUSTOM_EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 pt-8 border-t border-[#ECE7F2]">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-heading text-lg font-bold text-[#2A2D22]">
                        Poin Referensi &amp; Literatur Medis ({references.length} Sumber Resmi)
                      </h3>
                      <span className="rounded-full bg-[#F5F8EB] px-3 py-1 text-xs font-bold text-[#56632A]">
                        Terverifikasi Klinis
                      </span>
                    </div>
                    <div className="rounded-[22px] border border-gray-100 bg-[#FAF8FC] p-5 sm:p-6">
                      <ReferenceList references={references} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>

      {/* =====================================================================
          6. FOOTER (Item 6 & pdf_img_3.png: Kalimat penutup & narahubung Kak Faiza)
         ===================================================================== */}
      <Footer />
    </div>
  );
}

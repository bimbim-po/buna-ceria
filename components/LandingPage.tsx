'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronUp,
  FileText,
  Heart,
  Menu,
  Play,
  Search,
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
    <div className="min-h-screen bg-[#FAF8F6] text-[#2A2D22] selection:bg-[#FCE8EE] selection:text-[#C84B71]">
      {/* =====================================================================
          1. HEADER & HERO SECTION (Sesuai Desain Editorial pdf_img_3.png)
         ===================================================================== */}
      <div className="relative overflow-hidden">
        {/* Soft Organic Editorial Blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-[#FCECEF]/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-40 -left-24 h-[380px] w-[380px] rounded-full bg-[#F1F4E6]/80 blur-3xl"
        />

        {/* Top Navbar (Clean, Unboxed, Editorial) */}
        <header className="relative z-30 mx-auto max-w-6xl px-5 pt-7 pb-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo + Brand */}
            <a href="#top" className="flex items-center gap-3 shrink-0 group">
              <Image
                src="/logo.png"
                alt="Buna Ceria Teman Kasih"
                width={38}
                height={38}
                className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
              />
              <div>
                <span className="block font-heading text-lg font-bold text-[#2A2D22] leading-tight">
                  Buna Ceria
                </span>
                <span className="block text-[11px] text-[#767A6E] leading-tight">
                  Teman Kasih • Edukasi Kehamilan
                </span>
              </div>
            </a>

            {/* Center: Navigation Links */}
            <nav
              aria-label="Navigasi utama"
              className="hidden lg:flex lg:items-center lg:gap-8"
            >
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 text-[13px] font-medium transition-colors hover:text-[#DF6B8D] ${
                    item.active ? 'font-semibold text-[#2A2D22]' : 'text-[#5C585A]'
                  }`}
                >
                  {item.label}
                  {item.active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#8E9B5E]" />
                  )}
                </a>
              ))}
            </nav>

            {/* Right: Search Input + Buka WebApp Button */}
            <div className="flex items-center gap-3">
              <form
                onSubmit={handleSearchSubmit}
                className="hidden sm:flex items-center gap-2 rounded-full bg-[#F3ECEE] px-4 py-2 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-[#DF6B8D]"
              >
                <Search className="h-3.5 w-3.5 text-[#8C8896] shrink-0" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Cari informasi..."
                  className="w-32 lg:w-36 bg-transparent text-xs text-[#2A2D22] placeholder:text-[#9E989A] outline-none"
                />
              </form>

              <button
                type="button"
                onClick={() => enterWebApp('beranda')}
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#E46C8E] to-[#F08BA8] px-5 py-2 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(228,108,142,0.28)] transition-all hover:opacity-95 cursor-pointer"
              >
                <span>{session ? 'Ruang Belajar' : 'Buka WebApp'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-label="Menu navigasi"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A2D22] shadow-2xs lg:hidden cursor-pointer"
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
                className="mt-3 overflow-hidden rounded-[20px] border border-[#ECE7E4] bg-white p-4 shadow-md lg:hidden"
              >
                <div className="flex flex-col space-y-1">
                  {navLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-[#2A2D22] hover:bg-[#FAF6F5]"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="pt-2 mt-1 border-t border-gray-100 flex flex-col gap-2">
                    {!session && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          openLoginDialog();
                        }}
                        className="w-full rounded-full border border-[#E46C8E]/40 py-2 text-xs font-semibold text-[#2A2D22] cursor-pointer"
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
                      className="w-full rounded-full bg-[#E46C8E] py-2 text-xs font-semibold text-white cursor-pointer"
                    >
                      Buka WebApp
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Hero Banner (Tanpa AI-slop badge, murni tipografi serif & komposisi foto) */}
        <section
          id="top"
          aria-labelledby="hero-clean-heading"
          className="relative z-20 mx-auto max-w-6xl px-5 pt-8 pb-10 sm:px-8 sm:pt-12 lg:px-10 lg:pt-14 lg:pb-12"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Serif Title + Copy + 2 Pill Buttons */}
            <div className="lg:col-span-6">
              <h1
                id="hero-clean-heading"
                className="font-heading text-[2.85rem] font-bold leading-[1.08] tracking-tight text-[#2A2D22] sm:text-[3.6rem] lg:text-[4rem]"
              >
                Pendamping
                <br />
                <span className="text-[#E46C8E]">kehamilan</span>
                <br />
                pertama
              </h1>

              <p className="mt-6 max-w-md text-sm sm:text-[15px] leading-relaxed text-[#6E6A6C]">
                <strong className="font-semibold text-[#2A2D22]">Buna Ceria • Teman Kasih</strong>{' '}
                adalah webapp pembelajaran kehamilan yang dirancang khusus untuk memandu
                ibu melewati trimester pertama hingga persalinan dengan lebih percaya diri.
              </p>

              {/* 2 Action Buttons (Sesuai pdf_img_3.png) */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => enterWebApp('beranda')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-[#E46C8E] to-[#F08BA8] px-6 py-2.5 text-xs sm:text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(228,108,142,0.3)] transition-all hover:opacity-95 cursor-pointer"
                >
                  <span>Buka WebApp</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <a
                  href="#fitur-webapp"
                  className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-[#B8C294] bg-white px-5 py-2 text-xs sm:text-[13px] font-semibold text-[#2A2D22] transition-colors hover:bg-[#F6F8F0]"
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8E9B5E] text-white">
                    <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                  </span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Ibu Hamil + Floating Frosted Card */}
            <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
              <div className="relative flex items-center justify-center">
                {/* Floating Frosted Card (Sesuai pdf_img_3.png) */}
                <div className="absolute right-0 top-1/3 z-20 hidden sm:block rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(40,30,35,0.06)] backdrop-blur-md">
                  <div className="flex items-start gap-2">
                    <Heart className="mt-0.5 h-4 w-4 text-[#E46C8E] shrink-0" />
                    <p className="font-heading text-xs italic leading-snug text-[#4A4547]">
                      Sehatnya Ibu,
                      <br />
                      Bahagianya
                      <br />
                      Si Kecil
                    </p>
                  </div>
                </div>

                <div className="relative z-10 w-[310px] sm:w-[400px] lg:w-[440px]">
                  <Image
                    src="/ibu-hamil-bunga.webp"
                    alt="Ibu hamil tersenyum tenang memegang perut"
                    width={767}
                    height={759}
                    priority
                    className="mx-auto h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            2. FLOATING 3-COLUMN CARD UNDER HERO (Sesuai pdf_img_3.png & pdf_img_0.png)
           =================================================================== */}
        <div className="relative z-20 mx-auto max-w-6xl px-5 pb-6 sm:px-8 lg:px-10">
          <div className="rounded-[26px] border border-[#F0EAE8] bg-white/95 p-6 sm:p-8 shadow-[0_12px_36px_rgba(40,30,35,0.04)] backdrop-blur-xs">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[#EFEAE8]">
              {/* Col 1 */}
              <div className="flex items-start gap-4 md:pr-6 lg:pr-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E]">
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
              <div className="flex items-start gap-4 md:px-6 lg:px-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F2F5E8] text-[#8E9B5E]">
                  <Heart className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22]">
                    Mudah Diakses
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#767A6E]">
                    Bisa dibaca kapan saja untuk menemani perjalanan kehamilan.
                  </p>
                </div>
              </div>

              {/* Col 3 */}
              <div className="flex items-start gap-4 md:pl-6 lg:pl-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E]">
                  <Users className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22]">
                    Pendamping Setia
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#767A6E]">
                    Membantu ibu memahami setiap tahap kehamilan dengan lebih tenang.
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
      <main className="mx-auto max-w-6xl space-y-20 px-5 py-14 sm:space-y-24 sm:px-8 sm:py-18 lg:px-10">
        {/* =====================================================================
            3. SECTION "3 TIPS PENTING UNTUK IBU NIFAS" (Sesuai pdf_img_1.png & Item 3)
            Tanpa border kotak-kotak kaku & tanpa badge AI slop!
           ===================================================================== */}
        <motion.section
          id="tips-nifas"
          aria-labelledby="tips-nifas-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2
              id="tips-nifas-heading"
              className="font-heading text-2xl sm:text-3xl lg:text-[2.25rem] font-normal text-[#2A2D22] tracking-tight leading-snug"
            >
              3 Tips Penting untuk Ibu Nifas
            </h2>
            <p className="mt-2.5 text-sm sm:text-[15px] text-[#6E6A6C] leading-relaxed">
              Langkah sederhana untuk mendukung menyusui dan menjaga kesehatan Bunda
            </p>
          </div>

          {/* 3 Clean Open Columns (Persis tata letak pdf_img_1.png) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 text-center items-start">
            {/* Kolom 1 */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-44 sm:w-52 flex items-center justify-center">
                <Image
                  src="/feature-tips.webp"
                  alt="Penuhi nutrisi dan cairan harian Bunda"
                  width={566}
                  height={566}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-6 font-sans text-base sm:text-lg font-bold text-[#2A2D22] leading-snug max-w-xs">
                Dapatkan tips harian tentang kesehatan Bunda &amp; masa nifas
              </h3>
              <p className="mt-2.5 text-xs sm:text-[13.5px] leading-relaxed text-[#767A6E] max-w-xs">
                Penuhi asupan nutrisi tinggi protein, cairan hangat yang cukup untuk mendukung kelancaran ASI, serta panduan perawatan pemulihan tubuh Bunda.
              </p>
            </div>

            {/* Kolom 2 */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-44 sm:w-52 flex items-center justify-center">
                <Image
                  src="/feature-stages.webp"
                  alt="Memandu dalam setiap tahapan"
                  width={524}
                  height={524}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-6 font-sans text-base sm:text-lg font-bold text-[#2A2D22] leading-snug max-w-xs">
                Memandu dalam setiap tahapan menyusui &amp; istirahat
              </h3>
              <p className="mt-2.5 text-xs sm:text-[13.5px] leading-relaxed text-[#767A6E] max-w-xs">
                Pantau terus perkembangan pemahaman Bunda mulai dari masa kehamilan, persiapan kelahiran, hingga menyusui Si Kecil secara bertahap.
              </p>
            </div>

            {/* Kolom 3 */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-44 sm:w-52 flex items-center justify-center">
                <Image
                  src="/feature-consult.webp"
                  alt="Nggak usah lagi tebak-tebakan"
                  width={636}
                  height={636}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-6 font-sans text-base sm:text-lg font-bold text-[#2A2D22] leading-snug max-w-xs">
                Nggak usah lagi tebak-tebakan soal perawatan Bunda
              </h3>
              <p className="mt-2.5 text-xs sm:text-[13.5px] leading-relaxed text-[#767A6E] max-w-xs">
                Nggak perlu bingung lagi mana mitos mana fakta, sekarang Bunda bisa langsung tanya-jawab dengan bidan dan konselor pendamping kami.
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => enterWebApp('beranda')}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#F06480] px-8 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_22px_rgba(240,100,128,0.28)] hover:bg-[#e0526e] transition-all cursor-pointer"
            >
              Mulai Belajar Sekarang
            </button>
          </div>
        </motion.section>

        {/* =====================================================================
            4. FITUR LENGKAP PEMBELAJARAN (Persis Desain pdf_img_3.png)
            Judul rata kiri dengan garis horizontal + 4 Kartu Putih Minimalis
           ===================================================================== */}
        <motion.section
          id="fitur-webapp"
          aria-labelledby="fitur-webapp-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          {/* Left-aligned Editorial Heading with Olive Line (Persis pdf_img_3.png) */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="h-[1.5px] w-6 bg-[#8E9B5E]" />
              <h2
                id="fitur-webapp-heading"
                className="font-heading text-2xl sm:text-3xl font-bold text-[#2A2D22]"
              >
                Fitur Lengkap Pembelajaran
              </h2>
            </div>
            <p className="mt-1.5 pl-9 text-xs sm:text-sm text-[#767A6E]">
              Belajar dengan mudah, lengkap, dan interaktif.
            </p>
          </div>

          {/* 4 Minimalist White Cards (Persis pdf_img_3.png) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {/* Card 1 */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group rounded-[24px] border border-[#F0EAE8] bg-white p-6 shadow-[0_8px_26px_rgba(40,30,35,0.03)] hover:shadow-[0_12px_32px_rgba(40,30,35,0.07)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E]">
                <BookOpen className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22] group-hover:text-[#E46C8E] transition-colors">
                4 Tingkatan Belajar
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#767A6E]">
                Materi berjenjang dari dasar hingga hasil belajar dengan elemen bulat &amp; garis penghubung.
              </p>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group rounded-[24px] border border-[#F0EAE8] bg-white p-6 shadow-[0_8px_26px_rgba(40,30,35,0.03)] hover:shadow-[0_12px_32px_rgba(40,30,35,0.07)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E]">
                <FileText className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22] group-hover:text-[#E46C8E] transition-colors">
                Ruang Baca Fokus
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#767A6E]">
                Artikel dan modul pilihan untuk menambah wawasan dengan nyaman.
              </p>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group rounded-[24px] border border-[#F0EAE8] bg-white p-6 shadow-[0_8px_26px_rgba(40,30,35,0.03)] hover:shadow-[0_12px_32px_rgba(40,30,35,0.07)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F5E8] text-[#8E9B5E]">
                <CheckCircle2 className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22] group-hover:text-[#8E9B5E] transition-colors">
                Kuis Pemahaman
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#767A6E]">
                Uji pengetahuanmu setelah belajar melalui soal interaktif ramah.
              </p>
            </div>

            {/* Card 4 */}
            <div
              onClick={() => enterWebApp('selfie')}
              className="group rounded-[24px] border border-[#F0EAE8] bg-white p-6 shadow-[0_8px_26px_rgba(40,30,35,0.03)] hover:shadow-[0_12px_32px_rgba(40,30,35,0.07)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCEBEF] text-[#E46C8E]">
                <Heart className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-sans text-sm sm:text-[15px] font-bold text-[#2A2D22] group-hover:text-[#E46C8E] transition-colors">
                Dampingan Bidan &amp; Selfie
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#767A6E]">
                Dukungan kesehatan fisik &amp; mental serta abadikan foto bersama pasangan.
              </p>
            </div>
          </div>
        </motion.section>

        {/* =====================================================================
            5. DAFTAR PUSTAKA (Persis Desain pdf_img_3.png & Item 5)
            "Daftar pustaka menggunakan poin, tapi poin muncul setelah pencet 'lihat daftar'"
           ===================================================================== */}
        <motion.section
          id="daftar-pustaka"
          aria-labelledby="pustaka-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          <div className="rounded-[28px] border border-[#F0EAE8] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_10px_36px_rgba(40,30,35,0.04)]">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              {/* Left Column: USG Photo */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#FAF6F5]">
                  <Image
                    src="/scan-1.jpg"
                    alt="Pemeriksaan USG Kehamilan"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Title, Subtitle, Outlined Button "Lihat Daftar ->", & Collapsible Points */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h2
                    id="pustaka-heading"
                    className="font-heading text-2xl sm:text-3xl font-bold text-[#2A2D22]"
                  >
                    Daftar Pustaka
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#767A6E] max-w-md">
                    Sumber informasi yang kami gunakan dalam pengembangan WebApp ini.
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowReferences((prev) => !prev)}
                    aria-expanded={showReferences}
                    className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full border border-[#F0B8C8] bg-white px-5 py-1.5 text-xs font-semibold text-[#E46C8E] transition-colors hover:bg-[#FCEBEF]/50 cursor-pointer"
                  >
                    <span>{showReferences ? 'Sembunyikan Daftar' : 'Lihat Daftar'}</span>
                    {showReferences ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Poin Daftar Pustaka muncul tepat di bawah tombol "Lihat Daftar" (Persis pdf_img_3.png) */}
                <AnimatePresence>
                  {showReferences && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: CUSTOM_EASE }}
                      className="overflow-hidden pt-2"
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
          6. FOOTER (Persis pdf_img_3.png)
         ===================================================================== */}
      <Footer />
    </div>
  );
}

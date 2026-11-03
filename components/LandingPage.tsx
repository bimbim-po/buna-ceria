'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Heart,
  Building2,
  CheckCircle2,
  HeartHandshake,
  Layers,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import { getReferences } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { Footer } from '@/components/Footer';
import { ReferenceList } from '@/components/ReferenceList';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const REGULATED_INSTITUTIONS = [
  {
    code: 'Kemenkes RI',
    sub: 'Pedoman Buku KIA',
    icon: ShieldCheck,
  },
  {
    code: 'WHO',
    sub: 'Antenatal Care Guidelines',
    icon: Building2,
  },
  {
    code: 'POGI',
    sub: 'Obstetri & Ginekologi',
    icon: Stethoscope,
  },
  {
    code: 'IBI',
    sub: 'Ikatan Bidan Indonesia',
    icon: HeartHandshake,
  },
  {
    code: 'ACOG',
    sub: 'Clinical Maternal Guide',
    icon: Award,
  },
  {
    code: 'HIMPSI',
    sub: 'Psikologi Maternal',
    icon: CheckCircle2,
  },
];

export function LandingPage() {
  const { session, openLoginDialog, enterWebApp } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const references = getReferences();

  const navLinks = [
    { label: 'Beranda', href: '#top' },
    { label: 'Fitur WebApp', href: '#pengenalan-bunda' },
    { label: 'Daftar Pustaka', href: '#daftar-pustaka' },
    { label: 'Narahubung', href: '#narahubung' },
  ];

  const sectionRevealProps = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.42, ease: CUSTOM_EASE },
  };

  return (
    <div className="min-h-screen bg-white text-[#2A2D22] selection:bg-[#FCE8EE] selection:text-[#C84B71]">
      {/* =====================================================================
          1. BERANDA (PENGENALAN SINGKAT WEBAPP)
          Header & Hero Section (Sesuai diagram arsitektur)
         ===================================================================== */}
      <div className="relative overflow-hidden bg-[#FDF2F5]">
        {/* Top Navbar */}
        <header className="relative z-30 mx-auto max-w-6xl px-5 pt-6 pb-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Left Links (Desktop) */}
            <nav
              aria-label="Navigasi utama landing page"
              className="hidden lg:flex lg:w-[38%] lg:items-center lg:gap-7"
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

            {/* Centered Brand Logo */}
            <a
              href="#top"
              className="flex flex-col items-center text-center group"
            >
              <Image
                src="/logo.png"
                alt="Teman Kasih"
                width={38}
                height={38}
                className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
              />
              <span className="mt-1 font-sans text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#2A2D22]">
                TEMAN KASIH
              </span>
              <span className="text-[7.5px] font-semibold uppercase tracking-[0.22em] text-[#767A6E]">
                EDUKASI KEHAMILAN
              </span>
            </a>

            {/* Right Links + Pill CTA */}
            <div className="flex items-center justify-end gap-5 lg:w-[38%]">
              {!session ? (
                <button
                  type="button"
                  onClick={openLoginDialog}
                  className="hidden sm:inline-block text-[13px] font-semibold text-[#2A2D22]/85 transition-colors hover:text-[#C84B71] cursor-pointer"
                >
                  Masuk Akun
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => enterWebApp('beranda')}
                  className="hidden sm:inline-block max-w-[120px] truncate text-[13px] font-bold text-[#C84B71] cursor-pointer"
                >
                  {session.name}
                </button>
              )}

              <button
                type="button"
                onClick={() => enterWebApp('beranda')}
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#C84B71] px-6 py-2 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(200,75,113,0.25)] transition-all hover:bg-[#b23b60] hover:shadow-[0_10px_24px_rgba(200,75,113,0.34)] cursor-pointer"
              >
                <span>Buka WebApp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-label="Menu navigasi"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#2A2D22] shadow-2xs lg:hidden cursor-pointer"
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
                className="mt-3 overflow-hidden rounded-[20px] bg-white p-4 shadow-lg lg:hidden"
              >
                <div className="flex flex-col space-y-2">
                  {navLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-[#2A2D22] hover:bg-[#FDF2F5]"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                    {!session && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          openLoginDialog();
                        }}
                        className="w-full rounded-full border border-pink-200 py-2.5 text-xs font-bold text-[#2A2D22] cursor-pointer"
                      >
                        Masuk Akun
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

        {/* Hero Content */}
        <section
          id="top"
          aria-labelledby="hero-clean-heading"
          className="relative z-20 mx-auto max-w-6xl px-5 pt-6 pb-20 sm:px-8 sm:pt-12 sm:pb-28 lg:px-12 lg:pt-14 lg:pb-32"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Heading + Brief Intro + CTA */}
            <div className="lg:col-span-6">
              <h1
                id="hero-clean-heading"
                className="font-sans text-[2.65rem] font-extrabold leading-[1.08] tracking-tight text-[#2A2D22] sm:text-[3.4rem] lg:text-[3.65rem]"
              >
                <span className="text-[#C84B71]">Pendamping</span> kehamilan
                <br />
                pertama
              </h1>

              <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-[#6E6A6C]">
                Teman Kasih adalah webapp pembelajaran kehamilan yang dirancang
                khusus untuk memandu Ibu melewati trimester pertama hingga persalinan
                secara bertahap, tenang, dan bebas dari rasa cemas.
              </p>

              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[#6E6A6C]">
                Dilengkapi ruang baca fokus layar penuh, kuis pemahaman, sapa perasaan harian,
                serta kontak langsung ke bidan dan konselor berpengalaman.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => enterWebApp('beranda')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#C84B71] px-7 py-3 text-[13.5px] font-bold text-white shadow-[0_10px_24px_rgba(200,75,113,0.28)] transition-all hover:bg-[#b23b60] hover:shadow-[0_12px_28px_rgba(200,75,113,0.38)] cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Buka WebApp Sekarang</span>
                </button>

                <a
                  href="#fitur-webapp"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-[13px] font-bold text-[#2A2D22] hover:bg-gray-50 transition-colors"
                >
                  <span>Pelajari Fitur WebApp</span>
                  <ArrowRight className="h-4 w-4 text-[#C84B71]" />
                </a>
              </div>
            </div>

            {/* Right Column: Visual Utama Ibu Hamil & Janin Sehat (Sesuai Desain Klien) */}
            <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
              <div className="relative flex items-center justify-center">
                <div className="relative z-10 w-[350px] sm:w-[440px] lg:w-[480px] xl:w-[510px]">
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

        {/* Sweeping Bottom Curve */}
        <svg
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-20 h-14 w-full sm:h-20 lg:h-28"
        >
          <path
            d="M0,35 C430,145 980,125 1440,10 L1440,130 L0,130 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* =====================================================================
          MAIN CONTENT AREA (CLEAN & ELEGANT)
         ===================================================================== */}
      <main className="mx-auto max-w-6xl space-y-24 px-5 py-16 sm:space-y-32 sm:px-8 sm:py-24 lg:px-12">
        {/* =====================================================================
            1.5 PENGENALAN INTI WEBAPP (ALA DIARY BUNDA)
            "Semua yang Bunda perlukan di kehamilan pertama"
           ===================================================================== */}
        <motion.section
          id="pengenalan-bunda"
          aria-labelledby="pengenalan-bunda-heading"
          {...sectionRevealProps}
          className="scroll-mt-24 pt-2 pb-6"
        >
          {/* Judul Utama Serif Khas Diary Bunda */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2
              id="pengenalan-bunda-heading"
              className="font-heading text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#2A2D22] tracking-tight leading-snug"
            >
              Semua yang Bunda perlukan di kehamilan pertama
            </h2>
          </div>

          {/* 3 Kolom Ilustrasi Khas Diary Bunda */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 text-center items-start">
            {/* Kolom 1: Tips Harian */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-48 sm:w-56 overflow-hidden flex items-center justify-center">
                <Image
                  src="/feature-tips.webp"
                  alt="Dapatkan tips harian tentang kesehatan Bunda"
                  width={566}
                  height={566}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-6 font-sans text-lg sm:text-xl font-bold text-[#2A2D22] leading-snug">
                Dapatkan tips harian tentang kesehatan Bunda
              </h3>
              <p className="mt-2.5 text-xs sm:text-[13.5px] leading-relaxed text-[#6E6A6C] max-w-xs mx-auto">
                Nikmati ribuan artikel dan tips terkait kehamilan serta tumbuh kembang janin yang telah ditinjau langsung oleh bidan dan dokter spesialis.
              </p>
            </div>

            {/* Kolom 2: Memandu Setiap Tahapan */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-48 sm:w-56 overflow-hidden flex items-center justify-center">
                <Image
                  src="/feature-stages.webp"
                  alt="Memandu dalam setiap tahapan"
                  width={524}
                  height={524}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-6 font-sans text-lg sm:text-xl font-bold text-[#2A2D22] leading-snug">
                Memandu dalam setiap tahapan
              </h3>
              <p className="mt-2.5 text-xs sm:text-[13.5px] leading-relaxed text-[#6E6A6C] max-w-xs mx-auto">
                Pantau terus perkembangan dan pemahaman materi Bunda melalui alur 5 tahapan bertahap mulai dari kehamilan hingga persiapan kelahiran.
              </p>
            </div>

            {/* Kolom 3: Nggak Usah Lagi Tebak-tebakan */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-48 sm:w-56 overflow-hidden flex items-center justify-center">
                <Image
                  src="/feature-consult.webp"
                  alt="Nggak usah lagi tebak-tebakan"
                  width={636}
                  height={636}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-6 font-sans text-lg sm:text-xl font-bold text-[#2A2D22] leading-snug">
                Nggak usah lagi tebak-tebakan
              </h3>
              <p className="mt-2.5 text-xs sm:text-[13.5px] leading-relaxed text-[#6E6A6C] max-w-xs mx-auto">
                Nggak perlu bingung lagi mana mitos mana fakta, sekarang Bunda bisa langsung tanya-jawab dengan bidan dan dokter spesialis kami via WhatsApp.
              </p>
            </div>
          </div>

          {/* Tombol CTA Tengah Khas Diary Bunda */}
          <div className="mt-12 sm:mt-14 flex justify-center">
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

        {/* Acuan Kredibilitas Singkat */}
        <motion.section
          aria-label="Acuan Kredibilitas Literatur"
          {...sectionRevealProps}
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                Standar Kesehatan Maternal
              </span>
              <h2 className="mt-1 font-sans text-[1.85rem] font-extrabold leading-[1.15] tracking-tight text-[#2A2D22]">
                Terdaftar &amp; <span className="text-[#A8B371]">terkurasi</span>
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[#6E6A6C]">
                Seluruh materi di dalam WebApp disusun berdasarkan pedoman resmi
                Kementerian Kesehatan RI dan literatur obstetri internasional.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 overflow-hidden rounded-[16px] border border-gray-100 bg-white sm:grid-cols-3">
                {REGULATED_INSTITUTIONS.map((inst, index) => {
                  const IconComponent = inst.icon;
                  const isMatcha = index % 2 === 1;
                  return (
                    <div
                      key={inst.code}
                      className="flex items-center gap-3 px-4 py-5 sm:px-5 sm:py-6"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isMatcha
                            ? 'bg-[#F5F7EA] text-[#56632A]'
                            : 'bg-[#FDF2F5] text-[#C84B71]'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0">
                        <span className="block font-sans text-[13.5px] font-bold tracking-tight text-[#2A2D22]">
                          {inst.code}
                        </span>
                        <span className="block truncate text-[11px] font-medium text-[#767A6E]">
                          {inst.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* =====================================================================
            2. PENJELASAN FITUR YANG ADA DI DALAM WEBAPP (ALA SHOWCASE CARD)
            (Sesuai diagram arsitektur bagian WEBSITE: Penjelasan Fitur & Mockup Referensi)
           ===================================================================== */}
        <motion.section
          id="fitur-webapp"
          aria-labelledby="fitur-webapp-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          {/* Section Header with Gradient Pill Badge */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-white px-4 py-1 text-xs font-bold text-[#C84B71] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Di Dalam WebApp Teman Kasih</span>
            </span>
            <h2
              id="fitur-webapp-heading"
              className="mt-4 font-heading text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#2A2D22] tracking-tight leading-snug"
            >
              Fitur Lengkap Pembelajaran
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6E6A6C] max-w-xl mx-auto leading-relaxed">
              Dirancang dengan alur yang memandu langkah demi langkah agar Ibu
              tidak merasa lelah atau pusing dengan banjir informasi medis.
            </p>
          </div>

          {/* 4 Showcase Feature Cards - Simple, Elegant & Clean White (Sesuai Referensi Gambar) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD 1: 5 Tingkatan Belajar (Alur Sage Green) */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group relative flex flex-col justify-between rounded-[22px] sm:rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(86,99,42,0.08)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer min-h-[240px]"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F8EB] text-[#56632A] border border-[#E4EAC9] transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <GraduationCap className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#2A2D22] group-hover:text-[#56632A] transition-colors leading-snug">
                  5 Tingkatan Belajar
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                  Materi → Kuis → Refleksi → Evaluasi → Hasil Saya. Dibuka bertahap agar tidak kewalahan.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F0ECF5] flex items-center justify-between text-xs font-semibold text-[#56632A]">
                <span>Buka Alur Belajar</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* CARD 2: Ruang Baca Fokus (Rose Cherry Blossom) */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group relative flex flex-col justify-between rounded-[22px] sm:rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(200,75,113,0.08)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer min-h-[240px]"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF2F5] text-[#C84B71] border border-pink-100 transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <BookOpen className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors leading-snug">
                  Ruang Baca Fokus
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                  Mode kelas layar penuh dengan silabus materi terstruktur, ukuran teks (Aa), dan bebas distraksi.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F0ECF5] flex items-center justify-between text-xs font-semibold text-[#C84B71]">
                <span>Mulai Membaca</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* CARD 3: Kuis Pemahaman (Warm Amber/Honey) */}
            <div
              onClick={() => enterWebApp('materi')}
              className="group relative flex flex-col justify-between rounded-[22px] sm:rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(217,119,6,0.08)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer min-h-[240px]"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF8EB] text-[#C26100] border border-amber-100 transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <Award className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#2A2D22] group-hover:text-[#C26100] transition-colors leading-snug">
                  Kuis Pemahaman
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                  Pertanyaan reflektif interaktif tanpa tekanan nilai dengan ulasan pembahasan menenangkan.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F0ECF5] flex items-center justify-between text-xs font-semibold text-[#C26100]">
                <span>Ikuti Kuis</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* CARD 4: Dampingan Bidan & Emosi (Calm Sky Blue) */}
            <div
              onClick={() => enterWebApp('kontak-ahli')}
              className="group relative flex flex-col justify-between rounded-[22px] sm:rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs hover:shadow-[0_12px_28px_rgba(2,132,199,0.08)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer min-h-[240px]"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF8FF] text-[#0284C7] border border-blue-100 transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <HeartHandshake className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#2A2D22] group-hover:text-[#0284C7] transition-colors leading-snug">
                  Dampingan Bidan &amp; Emosi
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                  Tersambung langsung via WhatsApp dengan bidan terverifikasi dan fitur sapa perasaan harian.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#F0ECF5] flex items-center justify-between text-xs font-semibold text-[#0284C7]">
                <span>Konsultasi Bidan</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* ===================================================================
              NUMBERS SECTION (KHAS BAGIAN BAWAH MOCKUP REFERENSI)
              "Numbers that power our story"
             =================================================================== */}
          <div className="mt-20 pt-16 border-t border-gray-100 text-center">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#2A2D22] tracking-tight">
              Kredibilitas &amp; Standar Teman Kasih
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#767A6E] max-w-xl mx-auto leading-relaxed">
              Mendampingi perjalanan kehamilan pertama Ibu secara tenang, teruji secara klinis, dan mudah diakses kapan saja.
            </p>

            {/* 4 Metrics with Colored Squares */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-4xl mx-auto">
              {/* Metric 1: Purple Square */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-sm bg-purple-600 shrink-0" />
                  <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#2A2D22] tracking-tight">
                    5 Tahap
                  </span>
                </div>
                <span className="mt-1 text-xs font-semibold text-[#767A6E]">
                  Alur Belajar Terstruktur
                </span>
              </div>

              {/* Metric 2: Amber Square */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-sm bg-amber-500 shrink-0" />
                  <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#2A2D22] tracking-tight">
                    100%
                  </span>
                </div>
                <span className="mt-1 text-xs font-semibold text-[#767A6E]">
                  Buku KIA Kemenkes RI
                </span>
              </div>

              {/* Metric 3: Rose Square */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-sm bg-[#C84B71] shrink-0" />
                  <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#2A2D22] tracking-tight">
                    60+
                  </span>
                </div>
                <span className="mt-1 text-xs font-semibold text-[#767A6E]">
                  Ibu Hamil Terdampingi
                </span>
              </div>

              {/* Metric 4: Matcha Sage Green Square */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-sm bg-[#A8B371] shrink-0" />
                  <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#2A2D22] tracking-tight">
                    24/7
                  </span>
                </div>
                <span className="mt-1 text-xs font-semibold text-[#767A6E]">
                  Akses Mandiri &amp; Bidan
                </span>
              </div>
            </div>
          </div>

          {/* Banner Ajakan Masuk WebApp - Clean, Light & Airy (Sesuai Referensi Gambar) */}
          <div className="mt-12 rounded-[24px] border border-[#ECE7F2] bg-white/95 p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(40,40,60,0.04)] backdrop-blur-xs">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-[#FDF2F5] px-3.5 py-1 text-xs font-bold text-[#C84B71]">
                  <Heart className="h-3.5 w-3.5 fill-[#C84B71]" />
                  <span>Ruang Belajar Interaktif</span>
                </span>
                <h3 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#2A2D22] tracking-tight">
                  Siap memulai perjalanan kehamilan yang tenang?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#6E6A6C] leading-relaxed max-w-xl">
                  Buka WebApp Teman Kasih sekarang untuk menikmati alur 5 tahapan belajar, ruang baca layar penuh tanpa iklan, kuis mandiri, dan dukungan bidan.
                </p>
              </div>

              <div className="hidden lg:flex lg:col-span-1 justify-center">
                <div className="h-16 w-px bg-[#EAE6EE]" />
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
            3. DAFTAR PUSTAKA (ACUAN MEDIS RESMI)
            (Sesuai diagram arsitektur bagian WEBSITE: Daftar Pustaka)
           ===================================================================== */}
        <motion.section
          id="daftar-pustaka"
          aria-labelledby="pustaka-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                Transparansi &amp; Kredibilitas
              </span>
              <h2
                id="pustaka-heading"
                className="mt-1 font-sans text-[2.2rem] font-extrabold tracking-tight text-[#2A2D22] sm:text-[2.6rem]"
              >
                Daftar <span className="text-[#A8B371]">pustaka</span>
              </h2>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-[#6E6A6C]">
              Teman Kasih berlandaskan pedoman klinis resmi kesehatan ibu dan anak
              dari institusi medis tepercaya.
            </p>
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-[#FAF8FC] p-6 sm:p-8 shadow-2xs">
            <ReferenceList references={references} />
          </div>
        </motion.section>
      </main>

      {/* =====================================================================
          4. DI FOOTER (TERTERA NARAHUBUNG)
          (Sesuai diagram arsitektur bagian WEBSITE: Di footer tertera narahubung)
         ===================================================================== */}
      <Footer />
    </div>
  );
}

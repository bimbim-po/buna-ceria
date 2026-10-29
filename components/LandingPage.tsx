'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  HeartHandshake,
  HelpCircle,
  Layers,
  Maximize2,
  Menu,
  MessageCircle,
  ShieldCheck,
  Smile,
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

const WEBAPP_FEATURES = [
  {
    number: '01',
    title: '5 Tingkatan Belajar Bertahap',
    subtitle: 'Materi → Quiz → Refleksi → Evaluasi → Hasil Saya',
    description:
      'Setiap tahap dibuka berurutan setelah tahap sebelumnya selesai. Alur ini dirancang khusus agar Ibu hamil tidak merasa kewalahan menyerap informasi.',
    icon: Layers,
    badge: 'Alur Terstruktur',
    color: 'from-pink-500/10 to-rose-500/5',
    iconColor: 'text-[#C84B71]',
    targetSection: 'materi',
  },
  {
    number: '02',
    title: 'Ruang Baca Fokus Layar Penuh',
    subtitle: 'Membaca nyaman 3–4 menit tanpa distraksi',
    description:
      'Mode layar penuh dengan tipografi yang lembut di mata. Disusun dalam bahasa santun tanpa istilah medis yang membingungkan.',
    icon: Maximize2,
    badge: 'Focus Mode',
    color: 'from-purple-500/10 to-indigo-500/5',
    iconColor: 'text-purple-600',
    targetSection: 'materi',
  },
  {
    number: '03',
    title: 'Kuis Pemahaman Ringan',
    subtitle: 'Evaluasi instan tanpa tekanan nilai',
    description:
      'Pertanyaan reflektif interaktif untuk memastikan poin-poin penting kehamilan terserap dengan baik, lengkap dengan pembahasan yang menenangkan.',
    icon: Brain,
    badge: 'Uji Pemahaman',
    color: 'from-amber-500/10 to-yellow-500/5',
    iconColor: 'text-amber-600',
    targetSection: 'materi',
  },
  {
    number: '04',
    title: 'Sapa Perasaan & Skrining Mandiri',
    subtitle: 'Ruang aman untuk memvalidasi emosi Ibu',
    description:
      'Pertanyaan perasaan harian dan kuesioner kecemasan yang muncul saat login untuk mendeteksi rasa cemas lebih dini dengan privasi penuh.',
    icon: Smile,
    badge: 'Kesehatan Emosional',
    color: 'from-emerald-500/10 to-teal-500/5',
    iconColor: 'text-emerald-600',
    targetSection: 'beranda',
  },
  {
    number: '05',
    title: 'Kontak Langsung Bidan & Konselor',
    subtitle: 'Tersambung via WhatsApp dengan tenaga ahli',
    description:
      'Bila ada keluhan atau rasa bingung, Ibu dapat langsung menghubungi bidan dan psikolog terverifikasi tanpa birokrasi rumit.',
    icon: MessageCircle,
    badge: 'Akses Ahli',
    color: 'from-blue-500/10 to-cyan-500/5',
    iconColor: 'text-blue-600',
    targetSection: 'kontak-ahli',
  },
];

export function LandingPage() {
  const { session, openLoginDialog, enterWebApp } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const references = getReferences();

  const navLinks = [
    { label: 'Beranda', href: '#top' },
    { label: 'Fitur WebApp', href: '#fitur-webapp' },
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
        {/* Concentric Pink Circles Backdrop */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 800"
          className="pointer-events-none absolute -top-24 -right-24 h-[520px] w-[520px] sm:h-[680px] sm:w-[680px] lg:-top-32 lg:right-[2%] lg:h-[760px] lg:w-[760px]"
        >
          <circle cx="400" cy="400" r="370" fill="#FBE5EC" />
          <circle cx="400" cy="400" r="285" fill="#FDF2F5" />
          <circle cx="400" cy="400" r="205" fill="#F9DCE6" />
          <circle cx="400" cy="400" r="125" fill="#FDF2F5" />
        </svg>

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
            {/* Left Column: Heading + Brief Intro + Badges & CTA */}
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-pink-100 px-3.5 py-1 text-xs font-bold text-[#C84B71] shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>WebApp Edukasi Kehamilan Pertama</span>
              </span>

              <h1
                id="hero-clean-heading"
                className="mt-4 font-sans text-[2.65rem] font-extrabold leading-[1.08] tracking-tight text-[#2A2D22] sm:text-[3.4rem] lg:text-[3.65rem]"
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

              {/* 2 White Floating Pill Cards */}
              <div className="mt-8 flex flex-wrap items-stretch gap-4">
                <div className="flex items-center gap-3.5 rounded-[16px] bg-white px-5 py-3 text-left shadow-[0_10px_24px_rgba(200,75,113,0.06)] border border-pink-50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCE8EE] text-[#C84B71]">
                    <Layers className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <span className="block text-[13px] font-extrabold leading-tight text-[#2A2D22]">
                      5 Tingkatan Belajar
                    </span>
                    <span className="block text-[11.5px] font-medium leading-tight text-[#767A6E]">
                      Materi, Kuis, Refleksi, Evaluasi
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-[16px] bg-white px-5 py-3 text-left shadow-[0_10px_24px_rgba(200,75,113,0.06)] border border-pink-50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EE] text-green-700">
                    <HeartHandshake className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <span className="block text-[13px] font-extrabold leading-tight text-[#2A2D22]">
                      Didampingi Bidan
                    </span>
                    <span className="block text-[11.5px] font-medium leading-tight text-[#767A6E]">
                      Konsultasi langsung via WhatsApp
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Cutout Mother Portrait */}
            <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
              <div className="relative w-[280px] sm:w-[340px] lg:w-[380px] lg:translate-y-6">
                <Image
                  src="/ibu-hamil-cutout.png"
                  alt="Ibu hamil tersenyum tenang memegang perut"
                  width={585}
                  height={982}
                  priority
                  className="mx-auto h-auto w-full object-contain drop-shadow-[0_16px_28px_rgba(200,75,113,0.12)]"
                />
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
        {/* Acuan Kredibilitas Singkat */}
        <motion.section
          aria-label="Acuan Kredibilitas Literatur"
          {...sectionRevealProps}
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                Standar Kesehatan Maternal
              </span>
              <h2 className="mt-1 font-sans text-[1.85rem] font-extrabold leading-[1.15] tracking-tight text-[#2A2D22]">
                Terdaftar &amp; <span className="text-[#C84B71]">terkurasi</span>
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[#6E6A6C]">
                Seluruh materi di dalam WebApp disusun berdasarkan pedoman resmi
                Kementerian Kesehatan RI dan literatur obstetri internasional.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 overflow-hidden rounded-[16px] border border-gray-100 bg-white sm:grid-cols-3">
                {REGULATED_INSTITUTIONS.map((inst) => {
                  const IconComponent = inst.icon;
                  return (
                    <div
                      key={inst.code}
                      className="flex items-center gap-3 px-4 py-5 sm:px-5 sm:py-6"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F5] text-[#C84B71]">
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
            2. PENJELASAN FITUR YANG ADA DI DALAM WEBAPP
            (Sesuai diagram arsitektur bagian WEBSITE: Penjelasan Fitur)
           ===================================================================== */}
        <motion.section
          id="fitur-webapp"
          aria-labelledby="fitur-webapp-heading"
          {...sectionRevealProps}
          className="scroll-mt-24"
        >
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                Di Dalam WebApp Teman Kasih
              </span>
              <h2
                id="fitur-webapp-heading"
                className="mt-1 font-sans text-[2.2rem] font-extrabold tracking-tight text-[#2A2D22] sm:text-[2.6rem]"
              >
                Fitur lengkap <span className="text-[#C84B71]">pembelajaran</span>
              </h2>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-[#6E6A6C]">
              Dirancang dengan alur yang memandu langkah demi langkah agar Ibu
              tidak merasa lelah atau pusing dengan banjir informasi medis.
            </p>
          </div>

          {/* 6 Visual Feature Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WEBAPP_FEATURES.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={feat.number}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-gray-100 bg-white p-7 shadow-[0_10px_30px_rgba(42,45,34,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_16px_36px_rgba(200,75,113,0.1)]"
                >
                  <div>
                    {/* Top row: Number and Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-black tracking-widest text-gray-300 group-hover:text-[#C84B71] transition-colors">
                        {feat.number}
                      </span>
                      <span className="rounded-full bg-[#FAF8FC] border border-gray-100 px-3 py-0.5 text-[10px] font-bold text-[#6E6A6C]">
                        {feat.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mt-5">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF2F5] text-[#C84B71] transition-transform duration-300 group-hover:scale-110">
                        <IconComp className="h-6 w-6" strokeWidth={1.8} />
                      </span>
                    </div>

                    {/* Titles */}
                    <h3 className="mt-5 font-sans text-lg font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#C84B71]">
                      {feat.subtitle}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-[#6E6A6C]">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#767A6E]">
                      Tersedia di WebApp
                    </span>
                    <button
                      type="button"
                      onClick={() => enterWebApp(feat.targetSection)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#C84B71] group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>Coba Fitur</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Ajakan Masuk WebApp */}
          <div className="mt-12 rounded-[28px] bg-gradient-to-r from-[#C84B71] via-[#B23E63] to-[#883654] p-8 sm:p-10 text-white shadow-[0_16px_40px_rgba(200,75,113,0.22)]">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Ruang Belajar Interaktif</span>
                </span>
                <h3 className="mt-4 font-sans text-2xl font-bold sm:text-3xl">
                  Siap memulai perjalanan kehamilan yang tenang?
                </h3>
                <p className="mt-2 max-w-xl text-xs sm:text-sm text-white/90 leading-relaxed">
                  Buka WebApp Teman Kasih sekarang untuk menikmati alur 5 tahapan belajar,
                  ruang baca layar penuh tanpa iklan, kuis mandiri, dan dukungan bidan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:col-span-4 lg:justify-end">
                <button
                  type="button"
                  onClick={() => enterWebApp('beranda')}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-bold text-[#C84B71] shadow-md hover:bg-[#FDF2F5] transition-all cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Masuk ke WebApp</span>
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                Transparansi &amp; Kredibilitas
              </span>
              <h2
                id="pustaka-heading"
                className="mt-1 font-sans text-[2.2rem] font-extrabold tracking-tight text-[#2A2D22] sm:text-[2.6rem]"
              >
                Daftar <span className="text-[#C84B71]">pustaka</span>
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

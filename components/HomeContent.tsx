'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  Clock,
  Heart,
  HeartHandshake,
  Mail,
  Maximize2,
  MessageCircle,
  Phone,
  Settings,
  Sparkles,
  Sun,
  UserCheck,
} from 'lucide-react';
import {
  getExperts,
  getFooterContact,
  getModules,
  getTips,
} from '@/lib/api';
import { AppMode, useApp } from '@/context/AppContext';
import { SplashScreen } from '@/components/SplashScreen';
import { LandingPage } from '@/components/LandingPage';
import { Header } from '@/components/Header';
import { SidebarNav } from '@/components/SidebarNav';
import { StageTracker } from '@/components/StageTracker';
import { StagePanel } from '@/components/StagePanel';
import { ModuleReader } from '@/components/ModuleReader';
import { FeelingSelector } from '@/components/FeelingSelector';
import { TipCard } from '@/components/TipCard';

const LoginDialog = dynamic(
  () => import('@/components/LoginDialog').then((mod) => mod.LoginDialog),
  { ssr: false }
);

const AnxietyDialog = dynamic(
  () => import('@/components/AnxietyDialog').then((mod) => mod.AnxietyDialog),
  { ssr: false }
);

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MODULE_PREVIEW_IMAGES: Record<number, string> = {
  1: '/scan-1.jpg',
  2: '/scan-2.jpg',
  3: '/scan-3.jpg',
  4: '/scan-4.jpg',
};

export function HomeContent({ initialMode }: { initialMode?: AppMode }) {
  const {
    appMode,
    activeSection,
    setActiveSection,
    enterWebApp,
    session,
    progress,
    moduleStatuses,
    activeModuleId,
    openLoginDialog,
    openAnxietyDialog,
    openModuleReader,
    closeModuleReader,
    handleCompleteModule,
  } = useApp();

  const prefersReducedMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [savedTipIds, setSavedTipIds] = useState<string[]>([]);

  const modules = getModules();
  const tips = getTips();
  const experts = getExperts();
  const footerContact = getFooterContact();

  // Sinkronkan initialMode bila dibuka langsung dari rute /belajar
  React.useEffect(() => {
    if (initialMode === 'webapp') {
      enterWebApp();
    }
  }, [initialMode, enterWebApp]);

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSaveTip = (tipId: string) => {
    setSavedTipIds((prev) =>
      prev.includes(tipId)
        ? prev.filter((id) => id !== tipId)
        : [...prev, tipId]
    );
  };

  const completedModules = progress?.completedModuleIds.length ?? 0;
  const completedStages = progress?.completedStageIds.length ?? 0;

  // Filter pencarian sederhana untuk materi dan tips
  const filteredModules = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTips = tips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewTransitionProps = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: 0.25, ease: CUSTOM_EASE },
  };

  return (
    <>
      <SplashScreen />

      {appMode === 'landing' ? (
        <LandingPage />
      ) : (
        /* =====================================================================
           WEBAPP PEMBELAJARAN (FULL SCREEN EDGE-TO-EDGE)
           Tata letak sesuai instruksi klien:
           - Beranda: Sapa perasaan pengguna & pintasan ke fitur utama
           - Materi Kehamilan: Tingkatan materi belajar (stepper) & 4 modul materi
           - Tips Kehamilan: Tips harian dengan fitur bookmark
           - Kontak Ahli: Daftar bidan & konselor via WhatsApp
           - Pengaturan: Profil pengguna & kuesioner perasaan
           ===================================================================== */
        <div className="flex h-screen w-full overflow-hidden bg-white text-[#2A2D22]">
          {/* 1. NAVBAR DI KIRI */}
          <aside
            aria-label="Sidebar WebApp"
            className="hidden lg:block lg:w-64 lg:shrink-0 h-full border-r border-[#F0ECF5] bg-white select-none"
          >
            <SidebarNav
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
            />
          </aside>

          {/* 2. AREA UTAMA DASHBOARD */}
          <div className="flex min-w-0 flex-1 flex-col h-full bg-white">
            {/* Top Bar Bersih */}
            <Header
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Viewport Konten Scrollable */}
            <main
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-12 w-full bg-white"
            >
              <div className="mx-auto max-w-6xl space-y-8 pb-16">
                <AnimatePresence mode="wait">
                  {/* =========================================================
                      1. BERANDA WEBAPP (Sapa Perasaan & Pintasan Fitur)
                     ========================================================= */}
                  {activeSection === 'beranda' && (
                    <motion.div
                      key="view-beranda"
                      {...viewTransitionProps}
                      className="space-y-8"
                    >
                      {/* Top Header Card: Ringkas & Hangat */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[22px] bg-[#FAF8FC] border border-[#F0ECF5] p-5 sm:p-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FCE8EE] px-2.5 py-0.5 text-[11px] font-bold text-[#C84B71]">
                              <Sparkles className="h-3 w-3" />
                              <span>Ruang Belajar Tenang</span>
                            </span>
                            <span className="text-xs text-[#767A6E]">
                              {session?.trimesterLabel ?? 'Trimester Pertama'}
                            </span>
                          </div>
                          <h1 className="mt-1.5 font-heading text-xl sm:text-2xl font-bold text-[#2A2D22]">
                            Selamat datang, {session ? session.name : 'Ibu Kasih'}
                          </h1>
                          <p className="mt-0.5 text-xs text-[#6E6A6C]">
                            Lanjutkan pembelajaran kehamilan hari ini secara perlahan dan menenangkan.
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (!session) openLoginDialog();
                              else openAnxietyDialog();
                            }}
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-pink-200 bg-white px-4 py-1.5 text-xs font-bold text-[#C84B71] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
                          >
                            <Heart className="h-3.5 w-3.5" />
                            <span>Kuesioner Perasaan</span>
                          </button>
                        </div>
                      </div>

                      {/* A. PERTANYAAN PERASAAN USER */}
                      <section aria-labelledby="perasaan-heading">
                        <FeelingSelector />
                      </section>

                      {/* B. KARTU PINTAS MENU FITUR UTAMA */}
                      <section aria-labelledby="fitur-pintas-heading">
                        <div className="flex items-center justify-between mb-3">
                          <h2
                            id="fitur-pintas-heading"
                            className="font-heading text-base font-bold text-[#2A2D22]"
                          >
                            Fitur Pembelajaran Teman Kasih
                          </h2>
                          <span className="text-xs text-[#767A6E]">
                            Pilih menu untuk memulai
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          {/* Tile 1: Materi Kehamilan (Alur Belajar & Modul) */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('materi')}
                            className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-pink-200 hover:shadow-[0_10px_24px_rgba(200,75,113,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF2F5] text-[#C84B71] transition-transform group-hover:scale-105">
                                <BookOpen className="h-5 w-5" />
                              </span>
                              <h3 className="mt-3.5 font-heading text-sm font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors">
                                Materi Kehamilan
                              </h3>
                              <p className="mt-1 text-xs text-[#767A6E]">
                                Tingkatan alur belajar 5 tahap &amp; 4 modul kehamilan fokus layar penuh.
                              </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-[#C84B71]">
                              <span>{completedStages}/5 Tahap Selesai</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>

                          {/* Tile 2: Tips Kehamilan */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('tips')}
                            className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-green-200 hover:shadow-[0_10px_24px_rgba(80,110,50,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF7EE] text-green-700 transition-transform group-hover:scale-105">
                                <Sun className="h-5 w-5" />
                              </span>
                              <h3 className="mt-3.5 font-heading text-sm font-bold text-[#2A2D22] group-hover:text-green-700 transition-colors">
                                Tips Kehamilan
                              </h3>
                              <p className="mt-1 text-xs text-[#767A6E]">
                                Langkah kecil harian merawat tubuh dan ketenangan pikiran.
                              </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-green-700">
                              <span>{savedTipIds.length} Tersimpan</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>

                          {/* Tile 3: Kontak Ahli */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('kontak-ahli')}
                            className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-blue-200 hover:shadow-[0_10px_24px_rgba(50,80,160,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-105">
                                <HeartHandshake className="h-5 w-5" />
                              </span>
                              <h3 className="mt-3.5 font-heading text-sm font-bold text-[#2A2D22] group-hover:text-blue-600 transition-colors">
                                Kontak Ahli
                              </h3>
                              <p className="mt-1 text-xs text-[#767A6E]">
                                Konsultasi langsung via WhatsApp dengan bidan &amp; konselor.
                              </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-blue-600">
                              <span>4 Tenaga Medis</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>
                        </div>
                      </section>

                      {/* Footer WebApp Narahubung */}
                      <footer className="rounded-[24px] border border-[#ECE7F2] bg-[#FAF8FC] p-6 sm:p-7">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 items-center">
                          <div className="lg:col-span-7">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                              Narahubung Program Teman Kasih
                            </span>
                            <h3 className="font-heading text-base font-bold text-[#2A2D22] mt-0.5">
                              {footerContact.personInCharge}
                            </h3>
                            <p className="text-xs text-[#767A6E]">
                              {footerContact.role}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-[#767A6E]">
                              {footerContact.disclaimerText}
                            </p>
                          </div>

                          <div className="lg:col-span-5 flex flex-col gap-2.5 sm:items-end">
                            <a
                              href={`mailto:${footerContact.email}`}
                              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#ECE7F2] px-4 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-gray-50 transition-colors"
                            >
                              <Mail className="h-3.5 w-3.5 text-[#C84B71]" />
                              <span>{footerContact.email}</span>
                            </a>

                            <a
                              href={`https://wa.me/${footerContact.whatsappNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-[#EBF7EE] border border-green-200 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-100 transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              <span>WhatsApp: {footerContact.displayWhatsapp}</span>
                            </a>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-[#ECE7F2] pt-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A09CA8]">
                          <span>{footerContact.copyrightText}</span>
                          <span>Teman Kasih • Edukasi Kehamilan</span>
                        </div>
                      </footer>
                    </motion.div>
                  )}

                  {/* =========================================================
                      2. HALAMAN KHUSUS: MATERI KEHAMILAN
                         (Memuat Tingkatan Materi Belajar + 4 Modul Materi)
                     ========================================================= */}
                  {activeSection === 'materi' && (
                    <motion.div
                      key="view-materi"
                      {...viewTransitionProps}
                      className="space-y-8"
                    >
                      {/* Header Halaman Materi */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] bg-[#FAF8FC] border border-[#ECE7F2] p-6 sm:p-7">
                        <div>
                          <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-[#C84B71]">
                            Kurikulum &amp; Alur Belajar
                          </span>
                          <h1 className="mt-2.5 font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                            Materi Kehamilan
                          </h1>
                          <p className="mt-1 text-xs sm:text-sm text-[#767A6E]">
                            Selesaikan alur 5 tahapan belajar secara bertahap dan pelajari 4 modul kehamilan dalam mode fokus layar penuh.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="rounded-full bg-white border border-[#ECE7F2] px-3.5 py-1.5 text-xs font-bold text-[#C84B71]">
                            {completedStages}/5 Tahap Selesai
                          </span>
                          <span className="rounded-full bg-white border border-[#ECE7F2] px-3.5 py-1.5 text-xs font-bold text-[#2A2D22]">
                            {completedModules}/4 Modul
                          </span>
                        </div>
                      </div>

                      {/* -----------------------------------------------------
                          A. TINGKATAN MATERI BELAJAR (STEPPER 5 BULATAN)
                          Sesuai tangkapan layar pengguna:
                          Materi -> Quiz -> Refleksi -> Evaluasi Akhir -> Hasil Saya
                         ----------------------------------------------------- */}
                      <section
                        id="tingkatan-materi-section"
                        aria-labelledby="tingkatan-heading"
                        className="rounded-[24px] border border-[#F0ECF5] bg-[#FAF8FC] p-5 sm:p-7 shadow-2xs"
                      >
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center border-b border-[#ECE7F2] pb-4 mb-6">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                              Alur Pembelajaran Bertahap
                            </span>
                            <h2
                              id="tingkatan-heading"
                              className="font-heading text-lg sm:text-xl font-bold text-[#2A2D22]"
                            >
                              Tingkatan Materi Belajar
                            </h2>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6A6C]">
                            <span className="rounded-full bg-white border border-[#ECE7F2] px-3 py-1 text-[#C84B71]">
                              {completedStages}/5 Tahap Selesai
                            </span>
                            <span className="hidden sm:inline text-[#8C8896]">
                              • Dibuka satu per satu
                            </span>
                          </div>
                        </div>

                        {/* Stepper Bulatan Interaktif */}
                        <StageTracker previewLockedOnly={!session} />

                        {/* Stage Panel Terbuka Saat Tahap Dipilih */}
                        {session && (
                          <div id="stage-panel-anchor" className="mt-6 border-t border-[#ECE7F2] pt-6">
                            <StagePanel />
                          </div>
                        )}
                      </section>

                      {/* -----------------------------------------------------
                          B. 4 MODUL MATERI KEHAMILAN (MODE FOKUS LAYAR PENUH)
                         ----------------------------------------------------- */}
                      <section aria-labelledby="modul-kehamilan-heading">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2
                              id="modul-kehamilan-heading"
                              className="font-heading text-xl font-bold text-[#2A2D22]"
                            >
                              4 Modul Kehamilan
                            </h2>
                            <p className="text-xs text-[#767A6E]">
                              3–4 menit baca ringkas, santun, dan fokus layar penuh
                            </p>
                          </div>
                          <span className="rounded-full bg-[#FAF8FC] border border-[#ECE7F2] px-3 py-1 text-xs font-semibold text-[#6E6A6C]">
                            {completedModules}/4 Selesai
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                          {filteredModules.map((mod) => {
                            const st = moduleStatuses[mod.id];
                            const isDone = st === 'selesai';
                            const isLocked = st === 'terkunci';
                            const previewImg =
                              MODULE_PREVIEW_IMAGES[mod.order] ?? '/scan-1.jpg';

                            return (
                              <button
                                key={mod.id}
                                type="button"
                                onClick={() => openModuleReader(mod.id)}
                                className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-3.5 shadow-2xs hover:shadow-[0_12px_28px_rgba(80,50,110,0.08)] hover:-translate-y-1 transition-all text-left cursor-pointer"
                              >
                                <div>
                                  <div className="relative aspect-[1.35/1] w-full overflow-hidden rounded-[16px] bg-[#FAF8FC]">
                                    <Image
                                      src={previewImg}
                                      alt={mod.title}
                                      fill
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-[#2A2D22]">
                                      Materi 0{mod.order}
                                    </span>
                                    {isDone && (
                                      <span className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-xs">
                                        <Check className="h-3.5 w-3.5" />
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-3.5 px-1">
                                    <h3 className="font-heading text-sm font-bold text-[#2A2D22] line-clamp-2 group-hover:text-[#C84B71] transition-colors">
                                      {mod.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-[#767A6E] line-clamp-2">
                                      {mod.summary}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-[#F0ECF5] pt-3 px-1 text-xs">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#767A6E]">
                                    <Clock className="h-3 w-3" />
                                    {mod.readingTimeMinutes} mnt
                                  </span>
                                  <span className="font-bold text-[#C84B71] group-hover:translate-x-0.5 transition-transform">
                                    {isDone
                                      ? 'Baca Ulang →'
                                      : isLocked
                                      ? 'Terkunci'
                                      : 'Mulai Baca →'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      {/* -----------------------------------------------------
                          C. TIPS KEHAMILAN DI BAWAH 4 MATERI
                          (Sesuai instruksi klien: Di bawah 4 materi dikasih tips)
                         ----------------------------------------------------- */}
                      <section aria-labelledby="tips-bawah-materi-heading" className="pt-6 border-t border-[#F0ECF5]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                              Panduan Praktis Harian
                            </span>
                            <h2
                              id="tips-bawah-materi-heading"
                              className="font-heading text-xl font-bold text-[#2A2D22]"
                            >
                              Tips untuk Kehamilan
                            </h2>
                            <p className="text-xs text-[#767A6E]">
                              Langkah kecil merawat kenyamanan dan ketenangan sehari-hari
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectSection('tips')}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-white px-4 py-1.5 text-xs font-bold text-[#C84B71] hover:bg-[#FDF2F5] transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <span>Lihat Semua Tips</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                          {tips.slice(0, 3).map((tip) => (
                            <TipCard
                              key={tip.id}
                              tip={tip}
                              isSaved={savedTipIds.includes(tip.id)}
                              onToggleSave={toggleSaveTip}
                            />
                          ))}
                        </div>
                      </section>

                      {/* -----------------------------------------------------
                          D. KONTAK AHLI DI BAWAH TIPS KEHAMILAN
                          (Sesuai instruksi klien: Di taru kontak ahli di bawah tips)
                         ----------------------------------------------------- */}
                      <section aria-labelledby="kontak-bawah-tips-heading" className="pt-6 border-t border-[#F0ECF5]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                              Dukungan Bidan Terverifikasi
                            </span>
                            <h2
                              id="kontak-bawah-tips-heading"
                              className="font-heading text-xl font-bold text-[#2A2D22]"
                            >
                              Kontak Ahli Pendamping
                            </h2>
                            <p className="text-xs text-[#767A6E]">
                              Tersambung langsung via WhatsApp untuk konsultasi keluhan
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectSection('kontak-ahli')}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-white px-4 py-1.5 text-xs font-bold text-[#C84B71] hover:bg-[#FDF2F5] transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <span>Daftar Ahli Lengkap</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {experts.slice(0, 4).map((exp) => {
                            const photoSrc =
                              exp.avatarUrl ||
                              `/expert-${exp.id.replace('exp-', '')}.webp`;
                            return (
                              <div
                                key={exp.id}
                                className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-3.5 shadow-2xs hover:shadow-md transition-all"
                              >
                                <div>
                                  <div className="relative aspect-[1.15/1] w-full overflow-hidden rounded-[16px] bg-[#FAF8FC]">
                                    <Image
                                      src={photoSrc}
                                      alt={exp.name}
                                      fill
                                      sizes="(max-width: 640px) 100vw, 25vw"
                                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute top-2 left-2 rounded-full bg-green-500/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white">
                                      Tersedia
                                    </span>
                                  </div>
                                  <div className="mt-3 px-1">
                                    <h3 className="font-heading text-sm font-bold text-[#2A2D22] line-clamp-1">
                                      {exp.name}
                                    </h3>
                                    <p className="text-[11px] font-semibold text-[#C84B71]">
                                      {exp.role}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3 pt-2.5 border-t border-[#F0ECF5] px-1">
                                  <a
                                    href={`https://wa.me/${exp.whatsappNumber}?text=Halo%20${encodeURIComponent(exp.name)},%20saya%20ingin%20konsultasi%20mengenai%20kehamilan%20saya.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 transition-colors shadow-2xs"
                                  >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    <span>Konsultasi WA</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {/* =========================================================
                      3. HALAMAN KHUSUS: TIPS KEHAMILAN
                     ========================================================= */}
                  {activeSection === 'tips' && (
                    <motion.div
                      key="view-tips"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] bg-[#FAF8FC] border border-[#ECE7F2] p-6 sm:p-7">
                        <div>
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            Panduan Praktis
                          </span>
                          <h1 className="mt-2.5 font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                            Tips Kehamilan Hari Ini
                          </h1>
                          <p className="mt-1 text-xs sm:text-sm text-[#767A6E]">
                            Langkah kecil untuk merawat kenyamanan tubuh dan ketenangan pikiran sehari-hari.
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#C84B71] rounded-full bg-white border border-[#ECE7F2] px-4 py-1.5 self-start sm:self-auto">
                          {savedTipIds.length} Tips Tersimpan
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {filteredTips.map((tip) => (
                          <TipCard
                            key={tip.id}
                            tip={tip}
                            isSaved={savedTipIds.includes(tip.id)}
                            onToggleSave={toggleSaveTip}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* =========================================================
                      4. HALAMAN KHUSUS: KONTAK AHLI
                     ========================================================= */}
                  {activeSection === 'kontak-ahli' && (
                    <motion.div
                      key="view-kontak-ahli"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <div className="rounded-[24px] bg-[#FAF8FC] border border-[#ECE7F2] p-6 sm:p-7">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          Pendamping Terverifikasi
                        </span>
                        <h1 className="mt-2.5 font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                          Kontak Ahli Pendamping
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#767A6E]">
                          Bidan dan konselor berlisensi yang siap mendampingi dan menjawab pertanyaan Ibu secara personal via WhatsApp.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {experts.map((exp, idx) => {
                          const waUrl = `https://wa.me/${exp.whatsappNumber}?text=${encodeURIComponent(
                            `Halo ${exp.name}, saya ${
                              session?.name ?? 'Ibu hamil pengguna Teman Kasih'
                            }. Saya ingin berkonsultasi mengenai kehamilan saya.`
                          )}`;
                          const photoSrc =
                            exp.avatarUrl || `/expert-${(idx % 4) + 1}.jpg`;

                          return (
                            <div
                              key={exp.id}
                              className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-3.5 shadow-2xs hover:shadow-[0_12px_28px_rgba(80,50,110,0.08)] hover:-translate-y-1 transition-all"
                            >
                              <div>
                                <div className="relative aspect-[1.15/1] w-full overflow-hidden rounded-[16px] bg-[#FAF8FC]">
                                  <Image
                                    src={photoSrc}
                                    alt={exp.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>

                                <div className="mt-3.5 px-1">
                                  <h3 className="font-heading text-sm font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors">
                                    {exp.name}
                                  </h3>
                                  <p className="mt-0.5 text-xs font-medium text-[#767A6E]">
                                    {exp.role}
                                  </p>
                                  <p className="mt-1 text-[11px] text-[#A09CA8]">
                                    {exp.experienceLabel ?? exp.scheduleNote}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-[#F0ECF5]">
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-full bg-[#EBF7EE] px-3 text-xs font-bold text-green-700 hover:bg-green-100 transition-colors"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  <span>Konsultasi WhatsApp</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* =========================================================
                      5. HALAMAN: PENGATURAN & AKUN IBU
                     ========================================================= */}
                  {activeSection === 'pengaturan' && (
                    <motion.div
                      key="view-pengaturan"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <div className="rounded-[24px] bg-[#FAF8FC] border border-[#ECE7F2] p-6 sm:p-7">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-[#2A2D22]">
                          Preferensi Belajar
                        </span>
                        <h1 className="mt-2.5 font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                          Pengaturan Akun &amp; Profil
                        </h1>
                      </div>

                      <div className="rounded-[22px] border border-[#ECE7F2] bg-white p-6 shadow-2xs space-y-5">
                        <div>
                          <h2 className="font-heading text-base font-bold text-[#2A2D22]">
                            Status Akun Pengguna
                          </h2>
                          <p className="text-xs text-[#767A6E] mt-0.5">
                            {session
                              ? `Masuk sebagai ${session.name} (${session.email})`
                              : 'Saat ini Ibu menggunakan mode tamu tanpa login.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-xl border border-[#ECE7F2] p-3.5 bg-[#FAF8FC]">
                            <span className="text-[11px] font-semibold text-[#8C8896]">
                              Kategori Kehamilan
                            </span>
                            <p className="text-sm font-bold text-[#2A2D22] mt-0.5">
                              {session?.trimesterLabel ?? 'Trimester Awal'}
                            </p>
                          </div>

                          <div className="rounded-xl border border-[#ECE7F2] p-3.5 bg-[#FAF8FC]">
                            <span className="text-[11px] font-semibold text-[#8C8896]">
                              Status Akses
                            </span>
                            <p className="text-sm font-bold text-[#2A2D22] mt-0.5">
                              Akses Lengkap &amp; Terverifikasi
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#F0ECF5] flex flex-wrap items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (!session) openLoginDialog();
                              else openAnxietyDialog();
                            }}
                            className="btn-pill inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-5 py-2 text-xs font-bold text-[#C84B71] hover:bg-pink-100 transition-colors cursor-pointer"
                          >
                            <Heart className="h-3.5 w-3.5" />
                            <span>Ulang Kuesioner Perasaan</span>
                          </button>

                          {!session ? (
                            <button
                              type="button"
                              onClick={openLoginDialog}
                              className="btn-pill inline-flex items-center gap-2 rounded-full bg-[#C84B71] px-6 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] cursor-pointer"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span>Masuk Akun</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectSection('beranda')}
                              className="btn-pill inline-flex items-center gap-2 rounded-full bg-[#C84B71] px-6 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] cursor-pointer"
                            >
                              <span>Simpan &amp; Lanjut Belajar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Reader Modul Fullscreen Focus Mode */}
      {activeModuleId && (
        (() => {
          const mod = modules.find((m) => m.id === activeModuleId);
          if (!mod) return null;
          return (
            <ModuleReader
              module={mod}
              totalModules={modules.length}
              isCompleted={moduleStatuses[activeModuleId] === 'selesai'}
              onComplete={handleCompleteModule}
              onBackToOverview={closeModuleReader}
            />
          );
        })()
      )}

      {/* Dialog Autentikasi Masuk */}
      <LoginDialog />

      {/* Dialog Kuesioner Kecemasan / Sapa Perasaan */}
      <AnxietyDialog />
    </>
  );
}

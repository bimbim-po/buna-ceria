'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  Flower2,
  ListTree,
  Lock,
  Maximize2,
  Minimize2,
  Palette,
  ShieldCheck,
  Type,
  X,
} from 'lucide-react';
import { getModules } from '@/lib/api';
import { uiContent } from '@/data/uiContent';
import { useApp } from '@/context/AppContext';
import { ModuleItem } from '@/types';

interface ModuleReaderProps {
  module: ModuleItem;
  totalModules: number;
  isCompleted: boolean;
  onComplete: (moduleId: string) => void;
  onBackToOverview: () => void;
}

type ReaderTheme = 'surface' | 'cream' | 'sage';

export function ModuleReader({
  module,
  totalModules,
  isCompleted,
  onComplete,
  onBackToOverview,
}: ModuleReaderProps) {
  const { moduleStatuses, openModuleReader, selectStage } = useApp();
  const [largeText, setLargeText] = useState(false);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('surface');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const allModules = getModules();
  const completedCount = allModules.filter(
    (m) => moduleStatuses[m.id] === 'selesai'
  ).length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  // Sinkronkan riwayat browser agar terasa seperti halaman baru (bisa tombol Back browser)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('modul', module.id);
      window.history.pushState({ moduleId: module.id }, '', currentUrl.toString());

      const handlePopState = () => {
        onBackToOverview();
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [module.id, onBackToOverview]);

  const cycleTheme = () => {
    setReaderTheme((prev) =>
      prev === 'surface' ? 'cream' : prev === 'cream' ? 'sage' : 'surface'
    );
  };

  const themeLabel =
    readerTheme === 'surface'
      ? 'Tema: Putih'
      : readerTheme === 'cream'
      ? 'Tema: Krem'
      : 'Tema: Teduh';

  const themeContainerBg =
    readerTheme === 'surface'
      ? 'bg-white'
      : readerTheme === 'cream'
      ? 'bg-[#FFFBF5]'
      : 'bg-[#F7F9EE]';

  const textSizeClass = largeText
    ? 'text-lg leading-[1.95]'
    : 'text-base leading-[1.8]';

  // Cari modul sebelum dan sesudah
  const currentIndex = allModules.findIndex((m) => m.id === module.id);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule =
    currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

  const handleNextAction = () => {
    onComplete(module.id);
    if (nextModule) {
      openModuleReader(nextModule.id);
      const articleEl = document.getElementById('reading-article-scroll');
      if (articleEl) {
        articleEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Jika modul terakhir selesai, arahkan ke tahap Kuis
      selectStage('quiz');
      onBackToOverview();
    }
  };

  return (
    <div
      role="region"
      aria-label="Ruang Baca Kelas Pembelajaran Dicoding Style"
      className="fixed inset-0 z-50 flex flex-col h-screen w-screen overflow-hidden bg-white text-[#2A2D22] select-none"
    >
      {/* =====================================================================
          1. TOP NAVBAR KELAS (KHAS DICODING ACADEMY)
         ===================================================================== */}
      <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-[#ECE7F2] bg-white px-4 sm:px-6 shadow-2xs">
        {/* Kiri: Tombol Kembali + Judul Modul */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToOverview}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-1.5 text-xs font-bold text-[#2A2D22] hover:bg-[#FDF2F5] hover:text-[#C84B71] transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Daftar Modul</span>
          </button>

          <span className="hidden md:inline h-4 w-px bg-gray-200" />

          <div className="min-w-0">
            <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-[#C84B71]">
              Buna Ceria • Modul {module.order} dari {totalModules}
            </span>
            <h1 className="font-heading text-sm sm:text-base font-bold text-[#2A2D22] truncate max-w-xs sm:max-w-md lg:max-w-xl">
              {module.title}
            </h1>
          </div>
        </div>

        {/* Kanan: Alat Baca (Silabus, Ukuran Teks, Tema, Tutup) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Tombol Toggle Silabus Kiri */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title="Buka / Tutup Silabus Modul"
            aria-label="Toggle Silabus"
            className={`hidden md:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              isSidebarOpen
                ? 'border-pink-200 bg-[#FDF2F5] text-[#C84B71]'
                : 'border-[#ECE7F2] bg-[#FAF8FC] text-[#6E6A6C] hover:bg-gray-100'
            }`}
          >
            <ListTree className="h-3.5 w-3.5" />
            <span>Silabus</span>
          </button>

          {/* Tombol Ukuran Teks */}
          <button
            type="button"
            onClick={() => setLargeText((prev) => !prev)}
            aria-pressed={largeText}
            title="Ubah ukuran teks bacaan"
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              largeText
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-[#ECE7F2] bg-[#FAF8FC] text-[#6E6A6C] hover:bg-gray-100'
            }`}
          >
            <Type className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{largeText ? 'Teks Besar' : 'Perbesar'}</span>
          </button>

          {/* Tombol Tema Baca */}
          <button
            type="button"
            onClick={cycleTheme}
            title="Ganti warna latar ruang baca"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-[#FAF8FC] px-3 py-1.5 text-xs font-bold text-[#6E6A6C] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Palette className="h-3.5 w-3.5 text-[#C84B71]" />
            <span className="hidden lg:inline">{themeLabel}</span>
          </button>

          {/* Tombol Tutup Halaman */}
          <button
            type="button"
            onClick={onBackToOverview}
            aria-label="Tutup halaman materi"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ECE7F2] bg-[#FAF8FC] text-[#6E6A6C] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer ml-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* =====================================================================
          2. KONTEN DUA KOLOM: SILABUS DI KIRI + ARTIKEL BACA DI TENGAH
         ===================================================================== */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden bg-white">
        {/* A. SIDEBAR SILABUS / DAFTAR ISI MODUL (KHAS DICODING) */}
        {isSidebarOpen && (
          <aside
            aria-label="Silabus Kurikulum Modul"
            className="hidden md:flex md:w-80 md:shrink-0 flex-col justify-between border-r border-[#ECE7F2] bg-[#FAF8FC] select-none h-full overflow-y-auto p-5"
          >
            <div>
              {/* Progres Silabus Kursus */}
              <div className="pb-4 border-b border-[#ECE7F2]">
                <div className="flex items-center justify-between text-xs font-bold text-[#2A2D22]">
                  <span>Progres Kurikulum</span>
                  <span className="text-[#C84B71]">{progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#ECE7F2]">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#767A6E]">
                  {completedCount} dari {totalModules} materi terselesaikan
                </p>
              </div>

              {/* Daftar 4 Modul Silabus */}
              <nav aria-label="Daftar Modul Belajar" className="mt-4 space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8C8896] mb-2 px-1">
                  Modul Pembelajaran
                </span>

                {allModules.map((item) => {
                  const status = moduleStatuses[item.id];
                  const isCurrent = item.id === module.id;
                  const isDone = status === 'selesai';
                  const isLocked = status === 'terkunci';

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (!isLocked) {
                          openModuleReader(item.id);
                          const articleEl = document.getElementById(
                            'reading-article-scroll'
                          );
                          if (articleEl) {
                            articleEl.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }
                      }}
                      disabled={isLocked}
                      className={`group flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-all ${
                        isCurrent
                          ? 'border border-pink-200 bg-white font-bold text-[#C84B71] shadow-2xs'
                          : isDone
                          ? 'border border-transparent bg-green-50/50 hover:bg-green-50 text-[#2A2D22] cursor-pointer'
                          : isLocked
                          ? 'border border-transparent bg-gray-50/70 text-gray-400 cursor-not-allowed opacity-60'
                          : 'border border-transparent hover:bg-white hover:text-[#2A2D22] text-[#6E6A6C] cursor-pointer'
                      }`}
                    >
                      {/* Icon Status */}
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isDone
                            ? 'bg-green-100 text-green-700'
                            : isCurrent
                            ? 'bg-[#FCE8EE] text-[#C84B71]'
                            : isLocked
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white border border-[#ECE7F2] text-gray-500'
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        ) : isLocked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          item.order
                        )}
                      </span>

                      {/* Detail Judul & Durasi */}
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold leading-snug line-clamp-2">
                          {item.title}
                        </span>
                        <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#8C8896]">
                          <Clock className="h-3 w-3" />
                          <span>{item.readingTimeMinutes} menit</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Info Bidan Pendamping Silabus */}
            <div className="rounded-2xl border border-pink-100 bg-white p-3.5 mt-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EBF7EE] text-green-700">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <span className="block text-xs font-bold text-[#2A2D22]">
                    Tinjauan Medis Resmi
                  </span>
                  <span className="block text-[10px] text-[#767A6E]">
                    Buku KIA Kemenkes RI
                  </span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* B. MAIN READING CANVAS (HALAMAN ARTIKEL UTAMA ALA DICODING) */}
        <main
          id="reading-article-scroll"
          className={`flex-1 overflow-y-auto ${themeContainerBg} select-text transition-colors duration-200`}
        >
          <div className="mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-12 space-y-8 pb-24">
            {/* Breadcrumb Navigasi Halaman */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs font-semibold text-[#8C8896]"
            >
              <button
                type="button"
                onClick={onBackToOverview}
                className="hover:text-[#C84B71] transition-colors cursor-pointer"
              >
                Materi Kehamilan
              </button>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-[#C84B71] font-bold">
                Modul 0{module.order}
              </span>
            </nav>

            {/* Header Artikel Modul */}
            <header className="border-b border-[#ECE7F2] pb-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 border border-pink-100 px-3 py-0.5 text-xs font-bold text-[#C84B71]">
                  <span>{module.category}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-3 py-0.5 text-xs font-semibold text-[#6E6A6C]">
                  <Clock className="h-3 w-3" />
                  <span>{module.readingTimeMinutes} menit baca</span>
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-0.5 text-xs font-bold text-green-700">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    <span>Selesai Dibaca</span>
                  </span>
                )}
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-[2.2rem] font-bold leading-tight text-[#2A2D22]">
                {module.title}
              </h1>

              {/* Kotak Intisari / Highlight Overview Khas Dicoding */}
              <div className="rounded-2xl border border-pink-100 bg-[#FAF8FC] p-4 sm:p-5">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#C84B71] mb-1">
                  Intisari Pembahasan
                </span>
                <p className="text-sm sm:text-base font-medium leading-relaxed text-[#6E6A6C]">
                  {module.summary}
                </p>
              </div>
            </header>

            {/* Isi Konten Modul (Blok-Blok Artikel Terstruktur) */}
            <article className={`space-y-6 text-[#2A2D22] ${textSizeClass}`}>
              {module.content.map((block, index) => {
                switch (block.type) {
                  case 'paragraph':
                    return (
                      <p
                        key={index}
                        className={`text-[#2A2D22] ${textSizeClass}`}
                      >
                        {block.text}
                      </p>
                    );

                  case 'subheading':
                    return (
                      <h2
                        key={index}
                        className="pt-4 font-heading text-xl sm:text-2xl font-bold text-[#2A2D22] border-b border-[#ECE7F2] pb-2"
                      >
                        {block.text}
                      </h2>
                    );

                  case 'list':
                    return (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#ECE7F2] bg-white p-5 sm:p-6 shadow-2xs space-y-3"
                      >
                        {block.title && (
                          <h3 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                            {block.title}
                          </h3>
                        )}
                        <ul className="space-y-2.5">
                          {block.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EBF7EE] text-green-700">
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                              </span>
                              <span className={`text-[#2A2D22] ${textSizeClass}`}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );

                  case 'callout':
                    return (
                      <aside
                        key={index}
                        className="flex items-start gap-4 rounded-2xl border border-pink-200 bg-[#FDF2F5] p-5 sm:p-6"
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#C84B71] shadow-2xs">
                          <Flower2 className="h-5 w-5" strokeWidth={1.8} />
                        </span>
                        <div>
                          <h4 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                            {block.title}
                          </h4>
                          <p className={`mt-1 text-[#6E6A6C] ${textSizeClass}`}>
                            {block.text}
                          </p>
                        </div>
                      </aside>
                    );

                  case 'image':
                    return (
                      <figure
                        key={index}
                        className="overflow-hidden rounded-2xl border border-[#ECE7F2] bg-white p-3 shadow-2xs"
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                          <Image
                            src={block.src}
                            alt={block.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2 text-center text-xs text-[#767A6E]">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );

                  default:
                    return null;
                }
              })}
            </article>

            {/* ===============================================================
                3. FOOTER NAVIGASI MODUL KELAS (KHAS DICODING)
               =============================================================== */}
            <div className="pt-8 border-t border-[#ECE7F2] flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Tombol Materi Sebelumnya */}
              <div>
                {prevModule ? (
                  <button
                    type="button"
                    onClick={() => {
                      openModuleReader(prevModule.id);
                      const articleEl = document.getElementById(
                        'reading-article-scroll'
                      );
                      if (articleEl) {
                        articleEl.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#ECE7F2] bg-white px-5 py-2.5 text-xs font-bold text-[#2A2D22] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Modul 0{prevModule.order}: Sebelumnya</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onBackToOverview}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#ECE7F2] bg-white px-5 py-2.5 text-xs font-semibold text-[#8C8896] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali ke Ringkasan</span>
                  </button>
                )}
              </div>

              {/* Tombol Aksi Utama: Selesai & Lanjut */}
              <button
                type="button"
                onClick={handleNextAction}
                className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:bg-green-700 hover:shadow-[0_10px_24px_rgba(34,197,94,0.4)] transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {nextModule
                    ? isCompleted
                      ? `Lanjut ke Modul 0${nextModule.order} →`
                      : `Tandai Selesai & Lanjut ke Modul 0${nextModule.order} →`
                    : isCompleted
                    ? 'Lanjut ke Kuis Pemahaman →'
                    : 'Tandai Selesai & Lanjut ke Kuis →'}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

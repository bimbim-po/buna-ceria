'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Menu3DIcon, Menu3DIconName } from '@/components/Menu3DIcon';

interface TourStep {
  id: string;
  targetTourId: string;
  section: string;
  stepNumber: number;
  badge: string;
  title: string;
  description: string;
  iconName: Menu3DIconName;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-pretest',
    targetTourId: 'tour-pretest-card',
    section: 'beranda',
    stepNumber: 1,
    badge: 'Langkah 1 dari 7 • Mulai dari Sini',
    title: '1. Kerjakan Pre-Test Awal (1x)',
    description:
      'Halo Bunda, selamat datang di Buna Ceria! 🥰 Langkah pertama: kerjakan Pre-Test Awal (31 pernyataan PASS & 20 soal pemahaman) untuk mengenali kondisi awal Bunda sebelum memulai materi.',
    iconName: 'beranda',
  },
  {
    id: 'step-feeling',
    targetTourId: 'tour-feeling-selector',
    section: 'beranda',
    stepNumber: 2,
    badge: 'Langkah 2 dari 7 • Sapa Perasaan',
    title: '2. Pilih Perasaan & Baca Saran Praktis',
    description:
      'Pilih topik perasaan yang sedang Bunda alami hari ini untuk mendapatkan saran singkat yang menenangkan serta rekomendasi modul bacaan.',
    iconName: 'beranda',
  },
  {
    id: 'step-calendar',
    targetTourId: 'tour-mood-calendar',
    section: 'beranda',
    stepNumber: 3,
    badge: 'Langkah 3 dari 7 • Jurnal Emosi',
    title: '3. Catat Kalender Emot Harian',
    description:
      'Sentuh salah satu dari 8 emotikon perasaan setiap harinya pada Kalender Emot Harian untuk merekam pola suasana hati Bunda selama masa nifas.',
    iconName: 'beranda',
  },
  {
    id: 'step-tracker',
    targetTourId: 'tour-stage-tracker',
    section: 'beranda',
    stepNumber: 4,
    badge: 'Langkah 4 dari 7 • 3 Level Belajar',
    title: '4. Ikuti 3 Level Pembelajaran Bertahap',
    description:
      'Pelajari Level 1 (4 Modul Masa Nifas & ASI) secara berurutan, lanjutkan ke Level 2 (Refleksi Diri & Tips Menghadapi Kecemasan), hingga membuka Level 3 (Bunga Delima).',
    iconName: 'materi',
  },
  {
    id: 'step-delima',
    targetTourId: 'tour-shortcut-tips',
    section: 'beranda',
    stepNumber: 5,
    badge: 'Langkah 5 dari 7 • Kebun Bunga Delima',
    title: '5. Siram Benih di Kebun Bunga Delima',
    description:
      'Kunjungi Kebun Bunga Delima untuk menonton video edukasi, mendengarkan audio relaksasi, dan bermain game tebak gambar ASI hingga Bunga Delima mekar sempurna (100 Poin)! 🌺',
    iconName: 'tips',
  },
  {
    id: 'step-selfie',
    targetTourId: 'tour-shortcut-selfie',
    section: 'beranda',
    stepNumber: 6,
    badge: 'Langkah 6 dari 7 • Dukungan Suami',
    title: '6. Abadikan Momen di Take Selfie',
    description:
      'Buka fitur Take Selfie untuk berfoto bersama pasangan menggunakan bingkai khusus masa nifas Buna Ceria yang dapat langsung disimpan ke galeri.',
    iconName: 'selfie',
  },
  {
    id: 'step-hasil',
    targetTourId: 'tour-shortcut-hasil',
    section: 'beranda',
    stepNumber: 7,
    badge: 'Langkah 7 dari 7 • Rapor & Evaluasi',
    title: '7. Pantau Hasil Saya & Post-Test Hari ke-7',
    description:
      'Pantau skor Pre-Test, progres belajar, serta kerjakan Post-Test Akhir pada Hari ke-7 di menu Hasil Saya. Yuk, kita mulai dari Langkah Pertama sekarang!',
    iconName: 'hasil',
  },
];

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function OnboardingTourBubbles() {
  const {
    isOnboardingTourOpen,
    completeOnboardingTour,
    activeSection,
    setActiveSection,
  } = useApp();

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({
    w: 1200,
    h: 800,
  });

  const currentStep = TOUR_STEPS[currentStepIdx] ?? TOUR_STEPS[0];

  const measureTarget = useCallback((tourId: string) => {
    if (typeof window === 'undefined') return;
    setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    const el = document.querySelector(
      `[data-tour-id="${tourId}"]`
    ) as HTMLElement | null;
    if (!el) {
      setTargetRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setTargetRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      bottom: r.bottom,
      right: r.right,
    });
  }, []);

  // Pastikan berada di section target & scroll ke elemen yang ditunjuk oleh bubble
  useEffect(() => {
    if (!isOnboardingTourOpen) return;

    if (activeSection !== currentStep.section) {
      setActiveSection(currentStep.section);
    }

    const scrollTimer = window.setTimeout(() => {
      const el = document.querySelector(
        `[data-tour-id="${currentStep.targetTourId}"]`
      ) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      measureTarget(currentStep.targetTourId);
    }, 90);

    const settleTimer = window.setTimeout(() => {
      measureTarget(currentStep.targetTourId);
    }, 420);

    const handleReposition = () => {
      measureTarget(currentStep.targetTourId);
    };

    window.addEventListener('resize', handleReposition, { passive: true });
    window.addEventListener('scroll', handleReposition, {
      passive: true,
      capture: true,
    });

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(settleTimer);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [
    isOnboardingTourOpen,
    currentStep.section,
    currentStep.targetTourId,
    activeSection,
    setActiveSection,
    measureTarget,
  ]);

  if (!isOnboardingTourOpen) {
    return null;
  }

  const isLastStep = currentStepIdx === TOUR_STEPS.length - 1;

  // Hitung posisi Bubble Petunjuk agar selalu menempel dekat elemen target & tidak keluar layar
  const bubbleMaxWidth = Math.min(370, viewportSize.w - 24);
  const bubbleEstimatedHeight = 250;
  let bubbleTop = Math.max(16, (viewportSize.h - bubbleEstimatedHeight) / 2);
  let bubbleLeft = Math.max(12, (viewportSize.w - bubbleMaxWidth) / 2);
  let arrowPosition: 'top' | 'bottom' | 'none' = 'none';
  let arrowLeftOffset = bubbleMaxWidth / 2;

  if (targetRect) {
    const targetCenterX = targetRect.left + targetRect.width / 2;
    bubbleLeft = Math.min(
      Math.max(12, targetCenterX - bubbleMaxWidth / 2),
      viewportSize.w - bubbleMaxWidth - 12
    );
    arrowLeftOffset = Math.min(
      Math.max(28, targetCenterX - bubbleLeft),
      bubbleMaxWidth - 28
    );

    const spaceBelow = viewportSize.h - targetRect.bottom;
    const spaceAbove = targetRect.top;

    if (spaceBelow >= bubbleEstimatedHeight + 24 || spaceBelow >= spaceAbove) {
      bubbleTop = Math.min(
        targetRect.bottom + 16,
        viewportSize.h - bubbleEstimatedHeight - 16
      );
      arrowPosition = 'top';
    } else {
      bubbleTop = Math.max(16, targetRect.top - bubbleEstimatedHeight - 16);
      arrowPosition = 'bottom';
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-bubble-title"
    >
      {/* Backdrop Gelap Lembut */}
      <div
        className="fixed inset-0 bg-[#2A1820]/50 backdrop-blur-[1.5px] transition-opacity duration-300"
        onClick={() => completeOnboardingTour(true)}
        aria-hidden="true"
      />

      {/* Sorotan (Spotlight Ring) pada Elemen Target yang Sedang Ditunjuk Bubble */}
      {targetRect && (
        <motion.div
          key={`spotlight-${currentStep.id}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          style={{
            top: Math.max(4, targetRect.top - 6),
            left: Math.max(4, targetRect.left - 6),
            width: Math.min(viewportSize.w - 8, targetRect.width + 12),
            height: targetRect.height + 12,
          }}
          className="fixed z-[71] pointer-events-none rounded-[24px] border-[3px] border-[#FF5E8E] bg-white/10 shadow-[0_0_0_6px_rgba(255,94,142,0.28),0_12px_32px_rgba(200,75,113,0.35)]"
        >
          {/* Lencana Denyut Nomor Langkah di Pojok Kiri Atas Elemen Target */}
          <span className="absolute -top-3.5 -left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B98] to-[#D92B5E] text-xs font-extrabold text-white shadow-md ring-2 ring-white">
            {currentStep.stepNumber}
          </span>
        </motion.div>
      )}

      {/* BUBBLE PETUNJUK INTERAKTIF (SPEECH BUBBLE COACHMARK) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.24 }}
          style={{
            top: bubbleTop,
            left: bubbleLeft,
            width: bubbleMaxWidth,
          }}
          className="fixed z-[72] rounded-[26px] border-2 border-[#F8C4D4] bg-white p-5 shadow-[0_20px_50px_rgba(78,30,47,0.28)]"
        >
          {/* Ekor Segitiga Bubble (Pointer Tail) yang Menunjuk ke Elemen */}
          {arrowPosition === 'top' && (
            <span
              style={{ left: arrowLeftOffset - 10 }}
              className="pointer-events-none absolute -top-[11px] h-5 w-5 rotate-45 rounded-tl-[4px] border-t-2 border-l-2 border-[#F8C4D4] bg-white"
              aria-hidden="true"
            />
          )}
          {arrowPosition === 'bottom' && (
            <span
              style={{ left: arrowLeftOffset - 10 }}
              className="pointer-events-none absolute -bottom-[11px] h-5 w-5 rotate-45 rounded-br-[4px] border-r-2 border-b-2 border-[#F8C4D4] bg-white"
              aria-hidden="true"
            />
          )}

          {/* Header Bubble: Badge Langkah & Tombol Lewati */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF2F5] border border-pink-200 px-3 py-1 text-[11px] font-bold text-[#C84B71]">
              <Sparkles className="h-3 w-3" />
              <span>{currentStep.badge}</span>
            </span>

            <button
              type="button"
              onClick={() => completeOnboardingTour(true)}
              aria-label="Lewati petunjuk"
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-[#767A6E] hover:bg-gray-100 hover:text-[#2A2D22] transition-colors cursor-pointer"
            >
              <span>Lewati</span>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Konten Utama Bubble: Ikon 3D + Judul + Deskripsi */}
          <div className="mt-3.5 flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F5] border border-pink-100 p-2 shadow-2xs">
              <Menu3DIcon name={currentStep.iconName} className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <h3
                id="onboarding-bubble-title"
                className="font-heading text-base font-bold text-[#2A2D22] leading-snug"
              >
                {currentStep.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#5F5B5D]">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Indikator Titik Langkah & Tombol Navigasi Bubble */}
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F5DCE4] pt-3.5">
            {/* Dots Progress */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {TOUR_STEPS.map((st, idx) => (
                <span
                  key={st.id}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStepIdx
                      ? 'w-5 bg-[#E55381]'
                      : idx < currentStepIdx
                      ? 'w-2 bg-[#F5A3BC]'
                      : 'w-2 bg-[#EFE9F2]'
                  }`}
                />
              ))}
            </div>

            {/* Tombol Sebelumnya & Selanjutnya / Mulai */}
            <div className="flex items-center gap-2">
              {currentStepIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-full border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 text-xs font-bold text-[#5E5A5C] hover:bg-pink-50 hover:text-[#C84B71] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Kembali</span>
                </button>
              )}

              {!isLastStep ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentStepIdx((prev) =>
                      Math.min(TOUR_STEPS.length - 1, prev + 1)
                    )
                  }
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#F06292] to-[#E55381] px-4 text-xs font-bold text-white shadow-xs hover:from-[#E55381] hover:to-[#C84B71] transition-all cursor-pointer"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => completeOnboardingTour(true)}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#56632A] to-[#6B7B36] px-4 text-xs font-bold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mulai Pre-Test</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  PhoneCall,
  ShieldCheck,
  X,
} from 'lucide-react';
import { getAnxietyConfig } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { AnxietySubmission } from '@/types';
import { CountUpNumber } from '@/components/AnimatedMetric';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function AnxietyDialog() {
  const {
    session,
    isAnxietyDialogOpen,
    closeAnxietyDialog,
    handleSubmitAnxiety,
    enterWebApp,
  } = useApp();

  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { questions, scaleOptions, introDisclaimer, closingMessages } = useMemo(
    () => getAnxietyConfig(),
    []
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, 0 | 1 | 2 | 3>>({});
  const [completedResult, setCompletedResult] =
    useState<AnxietySubmission | null>(null);

  useFocusTrap(dialogRef, isAnxietyDialogOpen, closeAnxietyDialog);

  const currentQuestion = questions[currentStep];
  const totalQuestions = questions.length;
  const selectedValue = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const handleSelectOption = (val: 0 | 1 | 2 | 3) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const handleNext = () => {
    if (selectedValue === undefined) return;
    if (currentStep < totalQuestions - 1) {
      setSlideDir(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      const submission = handleSubmitAnxiety(answers);
      if (submission) {
        setCompletedResult(submission);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setSlideDir(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinishAndClose = (scrollToId?: string) => {
    setCompletedResult(null);
    setCurrentStep(0);
    setAnswers({});
    closeAnxietyDialog();

    if (scrollToId) {
      enterWebApp(scrollToId);
    }
  };

  const progressRatio = (currentStep + 1) / totalQuestions;
  const progressPercentage = Math.round(progressRatio * 100);

  return (
    <AnimatePresence>
      {isAnxietyDialogOpen && session && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="anxiety-dialog-title"
          aria-describedby="anxiety-dialog-disclaimer"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: CUSTOM_EASE }}
            onClick={() => handleFinishAndClose()}
            className="fixed inset-0 bg-ink/45"
            aria-hidden="true"
          />

          {/* Dialog Container: Header & Footer shrink-0, Body scrollable tanpa memotong konten */}
          <motion.div
            ref={dialogRef}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 40, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 30, scale: 0.97 }
            }
            transition={{ duration: 0.3, ease: CUSTOM_EASE }}
            className="relative z-10 flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white sm:max-h-[90vh] sm:max-w-lg sm:rounded-[28px] sm:border sm:border-pink-100 shadow-xl"
          >
            {/* 1. Bagian Atas (Shrink-0): Judul & Keterangan Wajib */}
            <div className="shrink-0 border-b border-pink-50 px-5 pt-5 pb-3.5 sm:px-6 sm:pt-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700">
                    <HeartHandshake
                      className="h-5 w-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0">
                    <h2
                      id="anxiety-dialog-title"
                      className="font-heading text-xl sm:text-2xl font-bold text-ink leading-tight"
                    >
                      Menyapa Perasaan Ibu
                    </h2>
                    <p className="text-xs sm:text-sm text-ink-muted truncate">
                      Halo {session.name}, mari luangkan waktu sebentar
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleFinishAndClose()}
                  aria-label="Tutup dialog sapaan perasaan"
                  className="btn-pill flex h-10 w-10 shrink-0 items-center justify-center border border-pink-100 bg-surface text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>

              {/* Keterangan wajib di awal */}
              <div
                id="anxiety-dialog-disclaimer"
                className="mt-3 flex items-start gap-2.5 rounded-[16px] border border-green-100 bg-green-50/90 px-3.5 py-2.5 text-xs leading-relaxed font-medium text-green-800"
              >
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-700"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>{introDisclaimer}</span>
              </div>
            </div>

            {/* 2. Bagian Tengah (Scrollable penuh tanpa justify-center/overflow-hidden yang memotong teks) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 sm:px-6 sm:py-5">
              {!completedResult ? (
                <div>
                  {/* Indikator langkah & Bar progres */}
                  <div className="mb-3.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-ink-muted leading-normal py-0.5">
                      <span>
                        Pernyataan {currentStep + 1} dari {totalQuestions}
                      </span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div
                      className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-pink-50 border border-pink-100"
                      role="progressbar"
                      aria-valuenow={currentStep + 1}
                      aria-valuemin={1}
                      aria-valuemax={totalQuestions}
                      aria-label={`Langkah ${currentStep + 1} dari ${totalQuestions}`}
                    >
                      <motion.div
                        initial={false}
                        animate={{ scaleX: progressRatio }}
                        transition={{ duration: 0.35, ease: CUSTOM_EASE }}
                        className="h-full w-full origin-left rounded-full bg-pink-500"
                      />
                    </div>
                  </div>

                  {/* Kartu Pernyataan Aktif */}
                  <AnimatePresence mode="wait" initial={false}>
                    {currentQuestion && (
                      <motion.div
                        key={currentQuestion.id}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: slideDir * 24 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: slideDir * -24 }
                        }
                        transition={{ duration: 0.24, ease: CUSTOM_EASE }}
                        className="rounded-[22px] border border-pink-100 bg-surface p-4 sm:p-5 shadow-2xs"
                      >
                        <p className="font-heading text-lg sm:text-xl font-bold leading-snug text-ink">
                          {currentQuestion.statement}
                        </p>

                        <fieldset className="mt-4">
                          <legend className="sr-only">
                            Pilih seberapa sering Ibu merasakan hal ini
                          </legend>
                          <div className="space-y-2">
                            {scaleOptions.map((option) => {
                              const isSelected = selectedValue === option.value;
                              return (
                                <button
                                  key={option.label}
                                  type="button"
                                  role="radio"
                                  aria-checked={isSelected}
                                  onClick={() => handleSelectOption(option.value)}
                                  className={`btn-pill flex min-h-[44px] w-full items-center justify-between border px-4 py-2.5 text-left text-sm sm:text-base font-semibold transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'border-pink-700 bg-pink-500 text-ink shadow-2xs'
                                      : 'border-pink-100 bg-page text-ink hover:bg-pink-50'
                                  }`}
                                >
                                  <span>{option.label}</span>
                                  <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                      isSelected
                                        ? 'border-ink bg-ink'
                                        : 'border-ink-muted bg-surface'
                                    }`}
                                    aria-hidden="true"
                                  >
                                    {isSelected && (
                                      <span className="h-2 w-2 rounded-full bg-surface" />
                                    )}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </fieldset>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Layar Penutup yang Menenangkan */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: CUSTOM_EASE }}
                >
                  <div className="rounded-[22px] border border-green-100 bg-surface p-5 text-center shadow-2xs">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <CheckCircle2
                        className="h-7 w-7"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-3 font-heading text-xl sm:text-2xl font-bold text-ink">
                      {closingMessages[completedResult.level].title}
                    </h3>

                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-ink-muted">
                      {closingMessages[completedResult.level].message}
                    </p>

                    <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-1.5 text-xs sm:text-sm font-bold text-ink">
                      <span>
                        Skor Catatan Perasaan:{' '}
                        <CountUpNumber value={completedResult.totalScore} /> dari{' '}
                        {completedResult.maxScore}
                      </span>
                    </div>

                    {(completedResult.level === 'tinggi' ||
                      completedResult.level === 'sedang') && (
                      <div className="mt-4 rounded-[18px] border border-pink-100 bg-pink-50 p-3.5 text-left">
                        <p className="text-xs sm:text-sm font-semibold text-pink-700">
                          {completedResult.level === 'tinggi'
                            ? 'Ibu tidak harus memendamnya sendiri. Bidan dan konselor kami siap mendengarkan cerita Ibu.'
                            : 'Bila Ibu ingin teman berbincang, kontak ahli kami selalu siap dihubungi.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleFinishAndClose('kontak-ahli')}
                          className="btn-pill mt-2.5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 bg-pink-500 px-4 py-2 text-xs sm:text-sm font-bold text-ink cursor-pointer"
                        >
                          <PhoneCall
                            className="h-4 w-4"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          <span>Lihat &amp; Hubungi Kontak Ahli</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* 3. Bagian Bawah (Shrink-0): Navigasi Langkah */}
            <div className="shrink-0 border-t border-pink-100 bg-white px-5 py-3.5 sm:px-6 sm:py-4">
              {!completedResult ? (
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="btn-pill inline-flex min-h-[44px] items-center justify-center gap-2 border border-pink-100 bg-surface px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <ArrowLeft
                      className="h-4 w-4"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span>Sebelumnya</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={selectedValue === undefined}
                    className="btn-pill inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center gap-2 bg-pink-500 px-6 py-2 text-sm font-bold text-ink shadow-2xs disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                  >
                    <span>
                      {currentStep === totalQuestions - 1
                        ? 'Simpan Jawaban'
                        : 'Lanjut'}
                    </span>
                    <ArrowRight
                      className="h-4 w-4"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleFinishAndClose('materi')}
                  className="btn-pill flex min-h-[44px] w-full items-center justify-center gap-2 bg-green-500 px-6 py-2.5 text-sm font-bold text-ink shadow-2xs cursor-pointer"
                >
                  <span>Lanjut ke Ruang Belajar</span>
                  <ArrowRight
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

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
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="anxiety-dialog-title"
          aria-describedby="anxiety-dialog-disclaimer"
        >
          {/* Overlay tanpa glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: CUSTOM_EASE }}
            className="fixed inset-0 bg-ink/45"
            aria-hidden="true"
          />

          {/* Di HP layar penuh naik dari bawah seperti sheet; di desktop fade dengan skala */}
          <motion.div
            ref={dialogRef}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 72, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 48, scale: 0.96 }
            }
            transition={{ duration: 0.35, ease: CUSTOM_EASE }}
            className="relative z-10 flex h-full w-full flex-col justify-between overflow-y-auto bg-page p-5 sm:h-auto sm:max-h-[92vh] sm:max-w-lg sm:rounded-[28px] sm:border sm:border-pink-100 sm:bg-surface sm:p-7 sm:shadow-pink-soft"
          >
            {/* Bagian Atas: Judul & Keterangan Wajib */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700">
                    <HeartHandshake
                      className="h-6 w-6"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h2
                      id="anxiety-dialog-title"
                      className="font-heading text-2xl font-bold text-ink"
                    >
                      Menyapa Perasaan Ibu
                    </h2>
                    <p className="text-sm text-ink-muted">
                      Halo {session.name}, mari luangkan waktu sebentar
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleFinishAndClose()}
                  aria-label="Tutup dialog sapaan perasaan"
                  className="btn-pill flex h-11 w-11 shrink-0 items-center justify-center border border-pink-100 bg-surface text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>

              {/* Keterangan wajib di awal */}
              <div
                id="anxiety-dialog-disclaimer"
                className="mt-4 flex items-start gap-2.5 rounded-[20px] border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700"
              >
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-700"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>{introDisclaimer}</span>
              </div>
            </div>

            {/* Bagian Tengah: Pertanyaan Satu per Layar (Bergeser Horizontal) ATAU Pesan Penutup */}
            {!completedResult ? (
              <div className="my-6 flex flex-1 flex-col justify-center overflow-hidden">
                {/* Indikator langkah & Bar langkah yang terisi halus dengan transform scaleX */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-ink-muted">
                    <span>
                      Pernyataan {currentStep + 1} dari {totalQuestions}
                    </span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div
                    className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-pink-50 border border-pink-100"
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

                {/* Kartu Pernyataan Aktif dengan Transisi Geser Horizontal */}
                <AnimatePresence mode="wait" initial={false}>
                  {currentQuestion && (
                    <motion.div
                      key={currentQuestion.id}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: slideDir * 32 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: slideDir * -32 }
                      }
                      transition={{ duration: 0.28, ease: CUSTOM_EASE }}
                      className="rounded-[24px] border border-pink-100 bg-surface p-5 shadow-pink-soft"
                    >
                      <p className="font-heading text-xl font-bold leading-snug text-ink sm:text-2xl">
                        {currentQuestion.statement}
                      </p>

                      <fieldset className="mt-5">
                        <legend className="sr-only">
                          Pilih seberapa sering Ibu merasakan hal ini
                        </legend>
                        <div className="space-y-2.5">
                          {scaleOptions.map((option) => {
                            const isSelected = selectedValue === option.value;
                            return (
                              <button
                                key={option.label}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => handleSelectOption(option.value)}
                                className={`btn-pill flex min-h-[48px] w-full items-center justify-between border px-5 py-3 text-left text-base font-semibold cursor-pointer ${
                                  isSelected
                                    ? 'border-pink-700 bg-pink-500 text-ink shadow-pink-soft'
                                    : 'border-pink-100 bg-page text-ink hover:bg-pink-50'
                                }`}
                              >
                                <span>{option.label}</span>
                                <span
                                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
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
                transition={{ duration: 0.32, ease: CUSTOM_EASE }}
                className="my-6 flex flex-1 flex-col justify-center"
              >
                <div className="rounded-[24px] border border-green-100 bg-surface p-6 text-center shadow-green-soft">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2
                      className="h-8 w-8"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-4 font-heading text-2xl font-bold text-ink">
                    {closingMessages[completedResult.level].title}
                  </h3>

                  <p className="mt-2.5 text-base leading-relaxed text-ink-muted">
                    {closingMessages[completedResult.level].message}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-1.5 text-sm font-bold text-ink">
                    <span>
                      Skor Catatan Perasaan:{' '}
                      <CountUpNumber value={completedResult.totalScore} /> dari{' '}
                      {completedResult.maxScore}
                    </span>
                  </div>

                  {/* Arahkan ke tombol Kontak Ahli jika skor tinggi (atau sedang) */}
                  {(completedResult.level === 'tinggi' ||
                    completedResult.level === 'sedang') && (
                    <div className="mt-5 rounded-[20px] border border-pink-100 bg-pink-50 p-4 text-left">
                      <p className="text-sm font-semibold text-pink-700">
                        {completedResult.level === 'tinggi'
                          ? 'Ibu tidak harus memendamnya sendiri. Bidan dan konselor kami siap mendengarkan cerita Ibu.'
                          : 'Bila Ibu ingin teman berbincang, kontak ahli kami selalu siap dihubungi.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleFinishAndClose('kontak-ahli')}
                        className="btn-pill mt-3 inline-flex min-h-[46px] w-full items-center justify-center gap-2 bg-pink-500 px-5 py-2.5 text-sm font-bold text-ink cursor-pointer"
                      >
                        <PhoneCall
                          className="h-4 w-4"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        <span>Lihat & Hubungi Kontak Ahli</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Bagian Bawah: Navigasi Langkah */}
            <div className="border-t border-pink-100 pt-4">
              {!completedResult ? (
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="btn-pill inline-flex min-h-[48px] items-center justify-center gap-2 border border-pink-100 bg-surface px-5 py-2.5 text-base font-semibold text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
                    className="btn-pill inline-flex min-h-[48px] flex-1 sm:flex-initial items-center justify-center gap-2 bg-pink-500 px-6 py-2.5 text-base font-bold text-ink shadow-pink-soft disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
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
                  onClick={() => handleFinishAndClose('ruang-belajar')}
                  className="btn-pill flex min-h-[48px] w-full items-center justify-center gap-2 bg-green-500 px-6 py-3 text-base font-bold text-ink shadow-green-soft cursor-pointer"
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

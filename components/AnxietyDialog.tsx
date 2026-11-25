'use client';

import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  LayoutList,
  Lock,
  Sparkles,
  X,
} from 'lucide-react';
import { getAnxietyConfig, getQuizQuestions } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { useFocusTrap } from '@/lib/useFocusTrap';
import {
  anxietyInstructions,
  anxietyIntroDescription,
  anxietyIntroSubtitle,
  evaluatePassScore,
  passCutOffValue,
  passImportantNote,
  passMaxScore,
} from '@/data/anxiety';
import { quizReminderMaterial } from '@/data/quiz';
import { CountUpNumber } from '@/components/AnimatedMetric';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const OPTION_LETTERS = ['a', 'b', 'c', 'd'] as const;

export function AnxietyDialog() {
  const {
    session,
    progress,
    isAnxietyDialogOpen,
    anxietyDialogPhase,
    closeAnxietyDialog,
    handleSubmitAnxiety,
    handleSaveQuizScore,
    enterWebApp,
  } = useApp();

  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { questions: passQuestions, scaleOptions } = useMemo(
    () => getAnxietyConfig(),
    []
  );
  const quizQuestions = useMemo(() => getQuizQuestions(), []);

  // Cek apakah Pre-Test atau Post-Test sudah pernah diselesaikan (Hanya bisa dikerjakan 1x)
  const existingPassRecord =
    anxietyDialogPhase === 'posttest'
      ? progress?.posttestAnxiety
      : progress?.initialPretestAnxiety;

  const existingQuizRecord =
    anxietyDialogPhase === 'posttest'
      ? progress?.posttestQuiz
      : progress?.initialPretestQuiz;

  // Sub-tahap aktif dihitung secara deterministik dari status penyelesaian (tanpa cascading setState di useEffect):
  // 'pass' (31 pertanyaan kecemasan PASS) -> 'quiz' (20 pertanyaan pemahaman) -> 'summary' (hasil akhir 1x pengerjaan)
  const activeSubStage: 'pass' | 'quiz' | 'summary' =
    existingPassRecord && existingQuizRecord
      ? 'summary'
      : existingPassRecord && !existingQuizRecord
      ? 'quiz'
      : 'pass';

  // State pengerjaan PASS (31 pernyataan)
  const [passStep, setPassStep] = useState(0);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [passAnswers, setPassAnswers] = useState<Record<string, 0 | 1 | 2 | 3>>(
    {}
  );
  const [viewMode, setViewMode] = useState<'step' | 'list'>('step');

  // State pengerjaan Pemahaman (20 pertanyaan pilihan ganda)
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showPosttestReminder, setShowPosttestReminder] = useState(true);

  useFocusTrap(dialogRef, isAnxietyDialogOpen, closeAnxietyDialog);

  const scrollBodyToTop = () => {
    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- LOGIKA BAGIAN 1: SKRINING PASS (31 PERNYATAAN) ---
  const currentPassQuestion = passQuestions[passStep];
  const totalPassQuestions = passQuestions.length;
  const selectedPassValue = currentPassQuestion
    ? passAnswers[currentPassQuestion.id]
    : undefined;
  const passAnsweredCount = Object.keys(passAnswers).length;
  const allPassAnswered = passAnsweredCount === totalPassQuestions;

  const handleSelectPassOption = (questionId: string, val: 0 | 1 | 2 | 3) => {
    setPassAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handlePassNext = () => {
    if (viewMode === 'list') {
      if (!allPassAnswered) return;
      handleSubmitAnxiety(passAnswers, anxietyDialogPhase);
      setQuizStep(0);
      scrollBodyToTop();
      return;
    }

    if (selectedPassValue === undefined) return;
    if (passStep < totalPassQuestions - 1) {
      setSlideDir(1);
      setPassStep((prev) => prev + 1);
    } else {
      handleSubmitAnxiety(passAnswers, anxietyDialogPhase);
      setQuizStep(0);
      scrollBodyToTop();
    }
  };

  const handlePassPrev = () => {
    if (passStep > 0) {
      setSlideDir(-1);
      setPassStep((prev) => prev - 1);
    }
  };

  // --- LOGIKA BAGIAN 2: TES PEMAHAMAN (20 PERTANYAAN) ---
  const currentQuizQuestion = quizQuestions[quizStep];
  const totalQuizQuestions = quizQuestions.length;
  const selectedQuizValue = currentQuizQuestion
    ? quizAnswers[currentQuizQuestion.id]
    : undefined;
  const quizAnsweredCount = Object.keys(quizAnswers).length;
  const allQuizAnswered = quizAnsweredCount === totalQuizQuestions;

  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const submitAllQuizAnswers = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct += 1;
      }
    });
    handleSaveQuizScore(
      correct,
      totalQuizQuestions,
      anxietyDialogPhase === 'pretest'
    );
    scrollBodyToTop();
  };

  const handleQuizNext = () => {
    if (viewMode === 'list') {
      if (!allQuizAnswered) return;
      submitAllQuizAnswers();
      return;
    }

    if (selectedQuizValue === undefined) return;
    if (quizStep < totalQuizQuestions - 1) {
      setSlideDir(1);
      setQuizStep((prev) => prev + 1);
    } else {
      submitAllQuizAnswers();
    }
  };

  const handleQuizPrev = () => {
    if (quizStep > 0) {
      setSlideDir(-1);
      setQuizStep((prev) => prev - 1);
    }
  };

  const handleFinishAndClose = (scrollToSection?: string) => {
    setPassStep(0);
    setQuizStep(0);
    closeAnxietyDialog();
    if (scrollToSection) {
      enterWebApp(scrollToSection);
    }
  };

  const passResultMeta = useMemo(() => {
    if (!existingPassRecord) return null;
    return evaluatePassScore(
      existingPassRecord.totalScore,
      existingPassRecord.maxScore
    );
  }, [existingPassRecord]);

  const getVisualTheme = (level?: string) => {
    switch (level) {
      case 'minimal':
      case 'rendah':
        return {
          badgeBg: 'bg-[#F5F8EB] border-[#C5D49B] text-[#56632A]',
          boxBg: 'bg-[#F7F9F0] border-[#9EB369] text-[#2A2D22]',
          barColor: 'bg-gradient-to-r from-[#8CA04B] to-[#56632A]',
          circleBg: 'bg-[#F5F8EB] border-[#C5D49B] text-[#56632A]',
          emoji: '😊',
        };
      case 'ringan-sedang-bawah':
      case 'sedang':
        return {
          badgeBg: 'bg-[#FFF6EC] border-[#F3CFA6] text-[#9C5718]',
          boxBg: 'bg-[#FFF9F2] border-[#E8B478] text-[#4A3219]',
          barColor: 'bg-gradient-to-r from-[#F0A860] to-[#D97F2B]',
          circleBg: 'bg-[#FFF6EC] border-[#F3CFA6] text-[#9C5718]',
          emoji: '🙂',
        };
      case 'ringan-sedang-atas':
        return {
          badgeBg: 'bg-[#FDF2F5] border-[#F3C1D0] text-[#C84B71]',
          boxBg: 'bg-[#FFF5F8] border-[#E48CA7] text-[#5E2135]',
          barColor: 'bg-gradient-to-r from-[#E46C8E] to-[#C84B71]',
          circleBg: 'bg-[#FDF2F5] border-[#F3C1D0] text-[#C84B71]',
          emoji: '😟',
        };
      case 'berat':
      case 'tinggi':
      default:
        return {
          badgeBg: 'bg-[#FBEDF1] border-[#E48CA7] text-[#9E2A4D]',
          boxBg: 'bg-[#FFF2F6] border-[#C84B71] text-[#5E192E]',
          barColor: 'bg-gradient-to-r from-[#C84B71] to-[#9E2A4D]',
          circleBg: 'bg-[#FBEDF1] border-[#E48CA7] text-[#9E2A4D]',
          emoji: '😣',
        };
    }
  };

  const isPosttestMode = anxietyDialogPhase === 'posttest';
  const phaseLabel = isPosttestMode
    ? 'Post-Test Tahap Akhir (Hari ke-7)'
    : 'Pre-Test Awal';

  const progressRatio =
    activeSubStage === 'pass'
      ? viewMode === 'list'
        ? passAnsweredCount / totalPassQuestions
        : (passStep + 1) / totalPassQuestions
      : viewMode === 'list'
      ? quizAnsweredCount / totalQuizQuestions
      : (quizStep + 1) / totalQuizQuestions;
  const progressPercentage = Math.round(progressRatio * 100);

  return (
    <AnimatePresence>
      {isAnxietyDialogOpen && session && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="anxiety-dialog-title"
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

          {/* Dialog Container */}
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
            className={`relative z-10 flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white sm:max-h-[92vh] ${
              activeSubStage === 'summary' || viewMode === 'list'
                ? 'sm:max-w-3xl'
                : 'sm:max-w-xl'
            } sm:rounded-[28px] sm:border sm:border-pink-100 shadow-xl transition-all`}
          >
            {/* 1. Header Ringkas (Shrink-0): Tanpa Toggle Post-Test Berdampingan & Tanpa Petunjuk Statis */}
            <div className="shrink-0 border-b border-pink-100 px-5 py-3.5 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-[#C84B71]">
                    {isPosttestMode ? (
                      <Award className="h-5 w-5" strokeWidth={1.8} />
                    ) : (
                      <Sparkles className="h-5 w-5" strokeWidth={1.8} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#FBEDF1] px-2.5 py-0.5 text-[10px] font-bold text-[#C84B71]">
                        {phaseLabel} &bull; Hanya 1x Pengerjaan
                      </span>
                      {activeSubStage !== 'summary' && (
                        <span className="rounded-full bg-[#F5F8EB] px-2.5 py-0.5 text-[10px] font-bold text-[#56632A]">
                          {activeSubStage === 'pass'
                            ? 'Bagian 1/2: PASS (31 Pertanyaan)'
                            : 'Bagian 2/2: Pemahaman (20 Pertanyaan)'}
                        </span>
                      )}
                    </div>
                    <h2
                      id="anxiety-dialog-title"
                      className="font-heading text-base sm:text-lg font-bold text-ink leading-tight mt-0.5 truncate"
                    >
                      {activeSubStage === 'pass'
                        ? `${isPosttestMode ? 'Post-Test' : 'Pre-Test'} Skrining Kecemasan PASS`
                        : activeSubStage === 'quiz'
                        ? `${isPosttestMode ? 'Post-Test' : 'Pre-Test'} Pemahaman Materi (20 Soal)`
                        : `Hasil ${isPosttestMode ? 'Post-Test (Hari ke-7)' : 'Pre-Test Awal'} Bunda`}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeSubStage !== 'summary' && (
                    <button
                      type="button"
                      onClick={() =>
                        setViewMode((prev) =>
                          prev === 'step' ? 'list' : 'step'
                        )
                      }
                      className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-[#FFF7F9] px-3 py-1 text-[11px] font-bold text-[#C84B71] hover:bg-pink-100/70 transition-colors cursor-pointer"
                    >
                      <LayoutList className="h-3.5 w-3.5" />
                      <span>
                        {viewMode === 'step' ? 'Semua Soal' : 'Per Soal'}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleFinishAndClose()}
                    aria-label="Tutup dialog"
                    className="btn-pill flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pink-100 bg-surface text-ink-muted hover:text-ink cursor-pointer"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Bagian Tengah (Scrollable Penuh: Petunjuk ikut ter-scroll ke atas saat scroll ke bawah) */}
            <div
              ref={scrollBodyRef}
              className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 sm:px-6 sm:py-5 space-y-4"
            >
              {/* Indikator Tahapan Pre-Test / Post-Test (Bagian 1 PASS 31 Soal + Bagian 2 Pemahaman 20 Soal) */}
              {activeSubStage !== 'summary' && (
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-pink-100 bg-[#FFF9FB] p-2">
                  <div
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                      activeSubStage === 'pass'
                        ? 'bg-[#C84B71] text-white shadow-2xs'
                        : 'bg-[#F5F8EB] text-[#56632A]'
                    }`}
                  >
                    <ClipboardCheck className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      1. Skrining PASS (31 Pertanyaan)
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                      activeSubStage === 'quiz'
                        ? 'bg-[#C84B71] text-white shadow-2xs'
                        : 'bg-white text-[#767A6E] border border-pink-100'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      2. Tes Pemahaman (20 Pertanyaan)
                    </span>
                  </div>
                </div>
              )}

              {/* =============================================================
                  SUB-STAGE 1: SKRINING KECEMASAN PASS (31 PERNYATAAN)
                 ============================================================= */}
              {activeSubStage === 'pass' && (
                <div className="space-y-4">
                  {/* Kotak Petunjuk Pengisian di Dalam Area Scrollable agar Ikut Ter-scroll */}
                  <div className="rounded-[18px] border border-pink-100 bg-[#FFF9FB] px-4 py-3 text-xs leading-relaxed text-[#4A4D40]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-[#C84B71]">
                        {anxietyIntroSubtitle}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setViewMode((prev) =>
                            prev === 'step' ? 'list' : 'step'
                          )
                        }
                        className="sm:hidden inline-flex items-center gap-1 rounded-full border border-pink-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#C84B71]"
                      >
                        <LayoutList className="h-3 w-3" />
                        <span>
                          {viewMode === 'step' ? 'Semua 31 Soal' : 'Per Soal'}
                        </span>
                      </button>
                    </div>
                    <p className="font-medium text-[#2A2D22]">
                      {anxietyIntroDescription}
                    </p>
                    <div className="mt-2 border-t border-pink-100 pt-2">
                      <p className="font-bold text-[#C84B71] mb-1">
                        Petunjuk Pengisian:
                      </p>
                      <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-[#5F5B5D]">
                        {anxietyInstructions.map((inst, idx) => (
                          <li key={idx}>{inst}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Bar Progres PASS */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-ink-muted py-0.5">
                      <span>
                        {viewMode === 'list'
                          ? `Terjawab ${passAnsweredCount} dari ${totalPassQuestions} Pernyataan PASS`
                          : `Pernyataan ${passStep + 1} dari ${totalPassQuestions}`}
                      </span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-pink-50 border border-pink-100">
                      <motion.div
                        initial={false}
                        animate={{ scaleX: progressRatio }}
                        transition={{ duration: 0.35, ease: CUSTOM_EASE }}
                        className="h-full w-full origin-left rounded-full bg-pink-500"
                      />
                    </div>
                  </div>

                  {viewMode === 'step' ? (
                    <AnimatePresence mode="wait" initial={false}>
                      {currentPassQuestion && (
                        <motion.div
                          key={currentPassQuestion.id}
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
                          transition={{ duration: 0.22, ease: CUSTOM_EASE }}
                          className="rounded-[22px] border border-pink-100 bg-surface p-4 sm:p-5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center rounded-full bg-[#FBEDF1] px-2.5 py-0.5 text-[11px] font-bold text-[#C84B71]">
                              Pernyataan {currentPassQuestion.order} /{' '}
                              {totalPassQuestions}
                            </span>
                            <span className="text-[11px] text-ink-muted">
                              Instrumen PASS
                            </span>
                          </div>

                          <p className="font-heading text-lg sm:text-xl font-bold leading-snug text-ink">
                            {currentPassQuestion.statement}
                          </p>

                          {/* Pilihan Ganda TANPA Tulisan Skor */}
                          <fieldset className="mt-4">
                            <legend className="sr-only">
                              Pilih jawaban yang paling sesuai dengan kondisi Bunda saat ini
                            </legend>
                            <div className="space-y-2">
                              {scaleOptions.map((option) => {
                                const isSelected =
                                  selectedPassValue === option.value;
                                return (
                                  <button
                                    key={option.label}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    onClick={() =>
                                      handleSelectPassOption(
                                        currentPassQuestion.id,
                                        option.value
                                      )
                                    }
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
                  ) : (
                    /* Mode Daftar Semua 31 Pernyataan PASS (Tanpa Tulisan Skor) */
                    <div className="space-y-3">
                      {passQuestions.map((q) => {
                        const val = passAnswers[q.id];
                        return (
                          <div
                            key={q.id}
                            className={`rounded-[18px] border p-3.5 transition-colors ${
                              val !== undefined
                                ? 'border-pink-200 bg-[#FFF9FB]'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <p className="text-sm font-bold text-[#2A2D22]">
                              <span className="text-[#C84B71] mr-1.5">
                                {q.order}.
                              </span>
                              {q.statement}
                            </p>
                            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {scaleOptions.map((opt) => {
                                const active = val === opt.value;
                                return (
                                  <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() =>
                                      handleSelectPassOption(q.id, opt.value)
                                    }
                                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                                      active
                                        ? 'border-[#C84B71] bg-[#C84B71] text-white shadow-2xs'
                                        : 'border-pink-100 bg-white text-[#4A4D40] hover:bg-pink-50'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================
                  SUB-STAGE 2: TES PEMAHAMAN MATERI (20 PERTANYAAN YANG SAMA)
                 ============================================================= */}
              {activeSubStage === 'quiz' && (
                <div className="space-y-4">
                  {/* Petunjuk & Materi Pengingat (Ikut Ter-scroll) */}
                  <div className="rounded-[18px] border border-[#E4EAC9] bg-[#F7F9F0] px-4 py-3 text-xs leading-relaxed text-[#4A4D40]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-[#56632A]">
                        Bagian 2: {isPosttestMode ? 'Post-Test' : 'Pre-Test'}{' '}
                        Pemahaman Materi Masa Nifas &amp; Kecukupan ASI (20 Pertanyaan)
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setViewMode((prev) =>
                            prev === 'step' ? 'list' : 'step'
                          )
                        }
                        className="sm:hidden inline-flex items-center gap-1 rounded-full border border-[#C5D49B] bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#56632A]"
                      >
                        <LayoutList className="h-3 w-3" />
                        <span>
                          {viewMode === 'step' ? 'Semua 20 Soal' : 'Per Soal'}
                        </span>
                      </button>
                    </div>
                    <p className="mt-1 text-[11.5px] text-[#5F5B5D]">
                      Pilih satu jawaban yang paling tepat pada 20 pertanyaan berikut. Tes ini hanya dapat dikerjakan 1 kali.
                    </p>

                    {isPosttestMode && (
                      <div className="mt-2.5 border-t border-[#E4EAC9] pt-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            setShowPosttestReminder((prev) => !prev)
                          }
                          className="text-xs font-bold text-[#C84B71] underline cursor-pointer"
                        >
                          {showPosttestReminder
                            ? 'Sembunyikan Materi Pengingat'
                            : 'Baca Materi Pengingat Sebelum Post-Test'}
                        </button>
                        {showPosttestReminder && (
                          <div className="mt-2 space-y-2 rounded-xl bg-white p-3 border border-[#E4EAC9]">
                            <p className="font-bold text-[#2A2D22] text-xs">
                              {quizReminderMaterial.title} —{' '}
                              {quizReminderMaterial.subtitle}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {quizReminderMaterial.sections.map((sec) => (
                                <div
                                  key={sec.number}
                                  className="rounded-lg border border-pink-50 bg-[#FFF9FB] p-2.5 text-[11px]"
                                >
                                  <p className="font-bold text-[#C84B71]">
                                    {sec.number}. {sec.title}
                                  </p>
                                  <p className="mt-0.5 text-[#5F5B5D]">
                                    {sec.points[0]}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bar Progres 20 Soal Pemahaman */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-ink-muted py-0.5">
                      <span>
                        {viewMode === 'list'
                          ? `Terjawab ${quizAnsweredCount} dari ${totalQuizQuestions} Pertanyaan Pemahaman`
                          : `Pertanyaan ${quizStep + 1} dari ${totalQuizQuestions}`}
                      </span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-pink-50 border border-pink-100">
                      <motion.div
                        initial={false}
                        animate={{ scaleX: progressRatio }}
                        transition={{ duration: 0.35, ease: CUSTOM_EASE }}
                        className="h-full w-full origin-left rounded-full bg-[#56632A]"
                      />
                    </div>
                  </div>

                  {viewMode === 'step' ? (
                    <AnimatePresence mode="wait" initial={false}>
                      {currentQuizQuestion && (
                        <motion.div
                          key={currentQuizQuestion.id}
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
                          transition={{ duration: 0.22, ease: CUSTOM_EASE }}
                          className="rounded-[22px] border border-pink-100 bg-surface p-4 sm:p-5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center rounded-full bg-[#F5F8EB] px-2.5 py-0.5 text-[11px] font-bold text-[#56632A]">
                              Soal {currentQuizQuestion.order} /{' '}
                              {totalQuizQuestions}
                            </span>
                            <span className="text-[11px] text-ink-muted">
                              Tes Pemahaman Materi
                            </span>
                          </div>

                          <p className="font-heading text-base sm:text-lg font-bold leading-snug text-ink">
                            {currentQuizQuestion.question}
                          </p>

                          <div className="mt-4 space-y-2">
                            {currentQuizQuestion.options.map((optText, idx) => {
                              const isSelected = selectedQuizValue === idx;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() =>
                                    handleSelectQuizOption(
                                      currentQuizQuestion.id,
                                      idx
                                    )
                                  }
                                  className={`btn-pill flex min-h-[44px] w-full items-center justify-between border px-4 py-2.5 text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'border-pink-700 bg-pink-500 text-ink shadow-2xs'
                                      : 'border-pink-100 bg-page text-ink hover:bg-pink-50'
                                  }`}
                                >
                                  <span className="pr-2">
                                    <strong className="mr-1.5 uppercase">
                                      {OPTION_LETTERS[idx]}.
                                    </strong>
                                    {optText}
                                  </span>
                                  <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                      isSelected
                                        ? 'border-ink bg-ink'
                                        : 'border-ink-muted bg-surface'
                                    }`}
                                  >
                                    {isSelected && (
                                      <span className="h-2 w-2 rounded-full bg-surface" />
                                    )}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ) : (
                    /* Mode Daftar Semua 20 Soal Pemahaman */
                    <div className="space-y-3">
                      {quizQuestions.map((q) => {
                        const val = quizAnswers[q.id];
                        return (
                          <div
                            key={q.id}
                            className={`rounded-[18px] border p-3.5 transition-colors ${
                              val !== undefined
                                ? 'border-[#C5D49B] bg-[#F9FBF4]'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <p className="text-sm font-bold text-[#2A2D22]">
                              <span className="text-[#56632A] mr-1.5">
                                {q.order}.
                              </span>
                              {q.question}
                            </p>
                            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((optText, idx) => {
                                const active = val === idx;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() =>
                                      handleSelectQuizOption(q.id, idx)
                                    }
                                    className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                                      active
                                        ? 'border-[#56632A] bg-[#56632A] text-white font-bold shadow-2xs'
                                        : 'border-pink-100 bg-white text-[#4A4D40] hover:bg-pink-50'
                                    }`}
                                  >
                                    <strong className="mr-1 uppercase">
                                      {OPTION_LETTERS[idx]}.
                                    </strong>{' '}
                                    {optText}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================
                  SUB-STAGE 3: RINGKASAN HASIL (HANYA BISA DIKERJAKAN 1 KALI, TANPA TABEL RUJUKAN)
                 ============================================================= */}
              {activeSubStage === 'summary' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: CUSTOM_EASE }}
                  className="space-y-4"
                >
                  {/* Pemberitahuan 1x Pengerjaan Selesai */}
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#C5D49B] bg-[#F5F8EB] px-4 py-3 text-xs font-bold text-[#56632A]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        {isPosttestMode
                          ? 'Post-Test Tahap Akhir (Hari ke-7) telah selesai dikerjakan (1x pengerjaan).'
                          : 'Pre-Test Awal (PASS 31 Pertanyaan & Pemahaman 20 Pertanyaan) telah selesai dikerjakan (1x pengerjaan).'}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] text-[#56632A] border border-[#C5D49B] shrink-0">
                      <Lock className="h-3 w-3" /> Terkunci (1x)
                    </span>
                  </div>

                  {/* Ringkasan Skor Pemahaman 20 Pertanyaan */}
                  {existingQuizRecord && (
                    <div className="rounded-[22px] border border-[#E4EAC9] bg-[#F9FBF4] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#56632A]">
                          Hasil {isPosttestMode ? 'Post-Test' : 'Pre-Test'}{' '}
                          Pemahaman Materi (20 Pertanyaan)
                        </span>
                        <h4 className="font-heading text-lg font-bold text-[#2A2D22] mt-0.5">
                          Skor Benar: {existingQuizRecord.score} dari{' '}
                          {existingQuizRecord.maxScore} Soal (
                          {existingQuizRecord.percentage}%)
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#C5D49B] px-4 py-1.5 text-xs font-extrabold text-[#56632A] self-start sm:self-auto">
                        <Award className="h-4 w-4" />
                        <span>Nilai: {existingQuizRecord.percentage}%</span>
                      </span>
                    </div>
                  )}

                  {/* Kartu Hasil Skrining PASS 2 Kolom (Tanpa Tabel Rujukan Nilai) */}
                  {existingPassRecord &&
                    passResultMeta &&
                    (() => {
                      const theme = getVisualTheme(passResultMeta.level);
                      const scoreRatioPct = Math.min(
                        100,
                        Math.round(
                          (existingPassRecord.totalScore / passMaxScore) * 100
                        )
                      );
                      const cutOffPct = Math.round(
                        (passCutOffValue / passMaxScore) * 100
                      );

                      return (
                        <>
                          <div className="rounded-[24px] border-2 border-[#F5DCE4] bg-[#FFFDFE] p-5 sm:p-6 shadow-[0_6px_24px_rgba(200,75,113,0.06)]">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                              <div className="md:col-span-5 flex flex-col items-center text-center md:border-r md:border-pink-100 md:pr-5">
                                <div
                                  className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${theme.circleBg} text-4xl shadow-inner`}
                                  aria-hidden="true"
                                >
                                  {theme.emoji}
                                </div>

                                <span className="mt-3 text-[11px] font-extrabold uppercase tracking-widest text-[#C84B71]">
                                  SKOR ASESMEN PASS
                                </span>

                                <div className="mt-1 flex items-baseline justify-center gap-1">
                                  <span className="font-heading text-4xl sm:text-5xl font-black text-[#2A2D22]">
                                    <CountUpNumber
                                      value={existingPassRecord.totalScore}
                                    />
                                  </span>
                                  <span className="text-lg font-bold text-[#8C8896]">
                                    / {passMaxScore}
                                  </span>
                                </div>

                                <div
                                  className={`mt-2.5 inline-flex flex-col items-center rounded-full border px-4 py-1 text-xs font-extrabold ${theme.badgeBg}`}
                                >
                                  <span>{passResultMeta.categoryLabel}</span>
                                </div>
                              </div>

                              <div className="md:col-span-7 space-y-3.5 text-left">
                                <div>
                                  <h3 className="font-heading text-base sm:text-lg font-extrabold text-[#2A2D22]">
                                    Analisa Hasil:
                                  </h3>
                                  <p className="mt-0.5 text-xs font-bold text-[#C84B71]">
                                    {passResultMeta.heading}
                                  </p>
                                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#4A4D40]">
                                    {passResultMeta.analysis}
                                  </p>
                                </div>

                                <div
                                  className={`rounded-[18px] border-2 p-3.5 ${theme.boxBg}`}
                                >
                                  <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider mb-1 text-[#C84B71]">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <span>REKOMENDASI TINDAKAN:</span>
                                  </div>
                                  <p className="text-xs sm:text-sm leading-relaxed font-medium">
                                    {passResultMeta.recommendation}
                                  </p>
                                </div>

                                <div className="rounded-[16px] border border-pink-200 bg-[#FFF7F9] p-3 text-xs leading-relaxed text-[#5F5B5D]">
                                  <p className="font-bold text-[#C84B71] mb-0.5">
                                    Informasi Penting:
                                  </p>
                                  <p>{passImportantNote}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bar Horizontal TINGKAT KECEMASAN (Tema Warna Buna Ceria) */}
                          <div className="rounded-[22px] border border-[#F5DCE4] bg-gradient-to-r from-[#FFF5F8] via-[#FFF9FB] to-[#F5F8EB] p-4 sm:p-5 text-[#2A2D22] shadow-[0_6px_20px_rgba(200,75,113,0.06)]">
                            <div className="flex items-center justify-between gap-2 mb-2.5">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C84B71]">
                                TINGKAT KECEMASAN
                              </span>
                              <span className="rounded-full bg-white border border-pink-200 px-3 py-0.5 text-xs font-extrabold text-[#2A2D22] shadow-2xs">
                                {existingPassRecord.totalScore}/{passMaxScore}
                              </span>
                            </div>
                            <div className="relative h-4 w-full overflow-hidden rounded-full bg-[#FBEDF1] border border-[#F3D1DC] shadow-inner">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${theme.barColor}`}
                                style={{
                                  width: `${Math.max(4, scoreRatioPct)}%`,
                                }}
                              />
                              <div
                                className="absolute top-0 bottom-0 w-0.5 bg-[#56632A]"
                                style={{ left: `${cutOffPct}%` }}
                                title={`Cut-off PASS: ${passCutOffValue}`}
                              />
                            </div>
                            <div className="mt-2.5 flex flex-wrap justify-between gap-2 text-[10px] sm:text-[11px] font-semibold text-[#5F5B5D]">
                              <span
                                className={
                                  passResultMeta.level === 'minimal'
                                    ? 'text-[#56632A] font-extrabold'
                                    : ''
                                }
                              >
                                0-20: Minimal
                              </span>
                              <span
                                className={
                                  passResultMeta.level === 'ringan-sedang-bawah'
                                    ? 'text-[#9C5718] font-extrabold'
                                    : ''
                                }
                              >
                                21-25: Ringan-Sedang
                              </span>
                              <span
                                className={
                                  passResultMeta.level === 'ringan-sedang-atas'
                                    ? 'text-[#C84B71] font-extrabold'
                                    : ''
                                }
                              >
                                26-41: Ringan-Sedang (≥Cut-off 26)
                              </span>
                              <span
                                className={
                                  passResultMeta.level === 'berat'
                                    ? 'text-[#9E2A4D] font-extrabold'
                                    : ''
                                }
                              >
                                42-93: Berat
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                </motion.div>
              )}
            </div>

            {/* 3. Bagian Bawah (Shrink-0): Navigasi Langkah */}
            <div className="shrink-0 border-t border-pink-100 bg-white px-5 py-3.5 sm:px-6 sm:py-4">
              {activeSubStage === 'pass' ? (
                viewMode === 'step' ? (
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handlePassPrev}
                      disabled={passStep === 0}
                      className="btn-pill inline-flex min-h-[44px] items-center justify-center gap-2 border border-pink-100 bg-surface px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                      <span>Sebelumnya</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePassNext}
                      disabled={selectedPassValue === undefined}
                      className="btn-pill inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center gap-2 bg-pink-500 px-6 py-2 text-sm font-bold text-ink shadow-2xs disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>
                        {passStep === totalPassQuestions - 1
                          ? 'Lanjut ke Tes Pemahaman (20 Soal)'
                          : 'Lanjut'}
                      </span>
                      <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#5F5B5D]">
                      {allPassAnswered
                        ? 'Semua 31 pernyataan PASS telah dijawab!'
                        : `Masih ada ${totalPassQuestions - passAnsweredCount} pernyataan belum dijawab`}
                    </span>
                    <button
                      type="button"
                      onClick={handlePassNext}
                      disabled={!allPassAnswered}
                      className="btn-pill inline-flex min-h-[44px] items-center justify-center gap-2 bg-pink-500 px-6 py-2 text-sm font-bold text-ink shadow-2xs disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>Simpan PASS &amp; Lanjut ke 20 Soal Pemahaman</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )
              ) : activeSubStage === 'quiz' ? (
                viewMode === 'step' ? (
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleQuizPrev}
                      disabled={quizStep === 0}
                      className="btn-pill inline-flex min-h-[44px] items-center justify-center gap-2 border border-pink-100 bg-surface px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                      <span>Sebelumnya</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleQuizNext}
                      disabled={selectedQuizValue === undefined}
                      className="btn-pill inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center gap-2 bg-[#C84B71] text-white px-6 py-2 text-sm font-bold shadow-2xs disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>
                        {quizStep === totalQuizQuestions - 1
                          ? 'Selesai & Lihat Hasil'
                          : 'Soal Berikutnya'}
                      </span>
                      <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#5F5B5D]">
                      {allQuizAnswered
                        ? 'Semua 20 soal pemahaman telah dijawab!'
                        : `Masih ada ${totalQuizQuestions - quizAnsweredCount} soal belum dijawab`}
                    </span>
                    <button
                      type="button"
                      onClick={handleQuizNext}
                      disabled={!allQuizAnswered}
                      className="btn-pill inline-flex min-h-[44px] items-center justify-center gap-2 bg-[#C84B71] text-white px-6 py-2 text-sm font-bold shadow-2xs disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>Simpan &amp; Lihat Hasil Akhir</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleFinishAndClose('hasil')}
                    className="btn-pill flex min-h-[44px] w-full sm:flex-1 items-center justify-center gap-2 border border-pink-200 bg-[#FFF7F9] px-5 py-2.5 text-sm font-bold text-[#C84B71] cursor-pointer"
                  >
                    <Award className="h-4 w-4" />
                    <span>Buka Halaman Hasil Saya</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFinishAndClose('materi')}
                    className="btn-pill flex min-h-[44px] w-full sm:flex-1 items-center justify-center gap-2 bg-green-500 px-6 py-2.5 text-sm font-bold text-ink shadow-2xs cursor-pointer"
                  >
                    <span>Lanjut ke Materi Pembelajaran</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

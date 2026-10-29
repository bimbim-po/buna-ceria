'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Flower2,
  Keyboard,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { getQuizQuestions } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { CountUpNumber, ProgressRing } from '@/components/AnimatedMetric';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function QuizRunner() {
  const { progress, handleSaveQuizScore, selectStage } = useApp();
  const prefersReducedMotion = useReducedMotion();

  const questions = useMemo(() => getQuizQuestions(), []);
  const totalQuestions = questions.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<
    Record<number, 'correct' | 'wrong'>
  >({});
  const [isFinished, setIsFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentQuestion = questions[currentIdx];

  const toggleFullscreen = useCallback(async () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    if (typeof document !== 'undefined') {
      try {
        if (nextState && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen?.();
        } else if (!nextState && document.fullscreenElement) {
          await document.exitFullscreen?.();
        }
      } catch {
        // Abaikan jika browser memblokir native fullscreen, overlay fixed tetap berjalan
      }
    }
  }, [isFullscreen]);

  const exitFullscreenIfActive = useCallback(async () => {
    setIsFullscreen(false);
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      try {
        await document.exitFullscreen?.();
      } catch {
        // Abaikan
      }
    }
  }, []);

  const handleCheckAnswer = useCallback(() => {
    if (selectedOption === null || isSubmitted || !currentQuestion) return;
    setIsSubmitted(true);
    const isRight = selectedOption === currentQuestion.correctIndex;
    if (isRight) {
      setCorrectCount((prev) => prev + 1);
    }
    setAnswerHistory((prev) => ({
      ...prev,
      [currentIdx]: isRight ? 'correct' : 'wrong',
    }));
  }, [selectedOption, isSubmitted, currentQuestion, currentIdx]);

  const handleNextQuestion = useCallback(() => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      handleSaveQuizScore(correctCount, totalQuestions);
      setIsFinished(true);
    }
  }, [currentIdx, totalQuestions, handleSaveQuizScore, correctCount]);

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectCount(0);
    setAnswerHistory({});
    setIsFinished(false);
  };

  // Dukungan Pintasan Keyboard (A/B/C/D atau 1/2/3/4, Enter untuk Periksa/Lanjut, Esc untuk keluar fullscreen)
  useEffect(() => {
    if (isFinished) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      const key = e.key.toUpperCase();
      if (!isSubmitted) {
        if (key === 'A' || key === '1') setSelectedOption(0);
        if (key === 'B' || key === '2') setSelectedOption(1);
        if (key === 'C' || key === '3') setSelectedOption(2);
        if (key === 'D' || key === '4') setSelectedOption(3);
        if (e.key === 'Enter' && selectedOption !== null) {
          e.preventDefault();
          handleCheckAnswer();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNextQuestion();
      }
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreenIfActive();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isFinished,
    isSubmitted,
    selectedOption,
    isFullscreen,
    handleCheckAnswer,
    handleNextQuestion,
    exitFullscreenIfActive,
  ]);

  const wrapperClass = isFullscreen
    ? 'fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-page p-4 sm:p-8'
    : 'rounded-[28px] border border-pink-100 bg-surface p-5 shadow-pink-soft sm:p-8';

  if (isFinished) {
    const currentScorePct = Math.round((correctCount / totalQuestions) * 100);
    const bestScorePct = progress?.bestQuizScore ?? currentScorePct;

    return (
      <div className={wrapperClass}>
        <div className="mx-auto my-auto w-full max-w-2xl rounded-[28px] border border-pink-100 bg-surface p-6 text-center shadow-green-soft sm:p-10">
          {isFullscreen && (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={exitFullscreenIfActive}
                className="btn-pill inline-flex items-center gap-1.5 border border-pink-100 bg-page px-4 py-1.5 text-xs font-bold text-ink cursor-pointer"
              >
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Keluar Layar Penuh</span>
              </button>
            </div>
          )}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Award className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-100 px-3.5 py-1 text-xs font-bold text-pink-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Evaluasi Pemahaman Selesai</span>
          </span>

          <h3 className="mt-3 font-heading text-2xl font-bold text-ink sm:text-3xl">
            Terima kasih sudah menyelesaikan kuis, Ibu
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-base text-ink-muted">
            Berikut adalah catatan hasil latihan Ibu hari ini. Ibu boleh
            mengulang kapan saja jika ingin mengulas kembali.
          </p>

          {/* Kotak Skor dengan Angka Menghitung Naik */}
          <div className="mx-auto mt-6 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-[24px] border border-pink-100 bg-page p-5 text-left">
              <div>
                <span className="text-sm font-semibold text-ink-muted">
                  Skor Kali Ini
                </span>
                <p className="mt-1 font-heading text-3xl font-bold text-ink">
                  <CountUpNumber value={currentScorePct} suffix="%" />
                </p>
                <span className="text-sm text-ink-muted">
                  {correctCount} dari {totalQuestions} soal tepat
                </span>
              </div>
              <ProgressRing
                percentage={currentScorePct}
                trackColor="#FBDDE3"
                progressColor="#A8435A"
              />
            </div>

            <div className="flex items-center justify-between rounded-[24px] border border-green-100 bg-green-50 p-5 text-left">
              <div>
                <span className="text-sm font-semibold text-green-700">
                  Skor Terbaik Ibu
                </span>
                <p className="mt-1 font-heading text-3xl font-bold text-ink">
                  <CountUpNumber value={bestScorePct} suffix="%" />
                </p>
                <span className="text-sm text-green-700">
                  Tersimpan otomatis
                </span>
              </div>
              <ProgressRing
                percentage={bestScorePct}
                trackColor="#E4EAC9"
                progressColor="#56632A"
              />
            </div>
          </div>

          {/* Tombol Ulangi atau Lanjut ke Tahap 3 */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestartQuiz}
              className="btn-pill inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 border border-pink-100 bg-surface px-6 py-3 text-base font-bold text-ink cursor-pointer"
            >
              <RotateCcw
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>Ulangi Quiz</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await exitFullscreenIfActive();
                selectStage('tahap-3');
              }}
              className="btn-pill inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 bg-pink-500 px-7 py-3 text-base font-bold text-ink shadow-pink-soft cursor-pointer"
            >
              <span>Lanjut ke Tahap Refleksi</span>
              <ArrowRight
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isChoiceCorrect =
    isSubmitted && selectedOption === currentQuestion.correctIndex;

  return (
    <div className={wrapperClass}>
      {/* =====================================================================
          TOP BAR APLIKASI QUIZ (Progress Segmen + Mode Layar Penuh)
         ===================================================================== */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-pink-50 border border-pink-100 px-3.5 py-1 text-xs font-bold text-pink-700 sm:text-sm">
              Soal {currentIdx + 1} / {totalQuestions}
            </span>
            <span className="rounded-full bg-green-50 border border-green-100 px-3.5 py-1 text-xs font-bold text-green-700 sm:text-sm">
              Benar: {correctCount}
            </span>
            {progress?.bestQuizScore !== null &&
              progress?.bestQuizScore !== undefined && (
                <span className="hidden sm:inline-block rounded-full bg-page border border-pink-100 px-3 py-1 text-xs font-semibold text-ink-muted">
                  Rekor: {progress.bestQuizScore}%
                </span>
              )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`btn-pill inline-flex min-h-[38px] items-center gap-1.5 border px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                isFullscreen
                  ? 'border-green-700 bg-green-100 text-green-700'
                  : 'border-pink-100 bg-page text-ink hover:bg-pink-50'
              }`}
              title={
                isFullscreen
                  ? 'Keluar dari Mode Fokus Layar Penuh'
                  : 'Buka Quiz dalam Mode Fokus Layar Penuh'
              }
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Kecilkan Layar</span>
                </>
              ) : (
                <>
                  <Maximize2
                    className="h-3.5 w-3.5 text-pink-700"
                    strokeWidth={2}
                  />
                  <span>Mode Fokus Layar Penuh</span>
                </>
              )}
            </button>

            {isFullscreen && (
              <button
                type="button"
                onClick={exitFullscreenIfActive}
                aria-label="Tutup layar penuh"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-100 bg-surface text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* Bar Progres 8 Segmen Interaktif (Gaya WebApp Modern) */}
        <div
          className="mt-3.5 grid grid-cols-8 gap-1.5"
          role="progressbar"
          aria-valuenow={currentIdx + 1}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          aria-label={`Progres soal ${currentIdx + 1} dari ${totalQuestions}`}
        >
          {questions.map((q, idx) => {
            const historyStatus = answerHistory[idx];
            const isCurrent = idx === currentIdx;
            return (
              <div
                key={q.id}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  historyStatus === 'correct'
                    ? 'bg-green-500'
                    : historyStatus === 'wrong'
                    ? 'bg-pink-500'
                    : isCurrent
                    ? 'bg-pink-700 ring-2 ring-pink-100'
                    : 'bg-pink-100/70'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          PANGGUNG UTAMA PERTANYAAN QUIZ
         ===================================================================== */}
      <div className="mx-auto my-auto w-full max-w-3xl py-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentQuestion.id}
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }
            }
            transition={{ duration: 0.25, ease: CUSTOM_EASE }}
            className={
              isFullscreen
                ? 'rounded-[28px] border border-pink-100 bg-surface p-6 shadow-pink-soft sm:p-9'
                : ''
            }
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
                Pertanyaan Pemahaman 0{currentIdx + 1}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-ink-muted">
                <Keyboard className="h-3.5 w-3.5" />
                <span>Pintasan: Tombol A–D & Enter</span>
              </span>
            </div>

            <h3 className="mt-2 font-heading text-xl font-bold leading-snug text-ink sm:text-2xl lg:text-[26px]">
              {currentQuestion.question}
            </h3>

            <fieldset className="mt-6">
              <legend className="sr-only">Pilih salah satu jawaban</legend>
              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === currentQuestion.correctIndex;
                  const optionLetter = String.fromCharCode(65 + idx);

                  let buttonStyle =
                    'border-pink-100 bg-page text-ink hover:bg-pink-50/70';
                  if (isSubmitted) {
                    if (isCorrectOption) {
                      buttonStyle =
                        'border-green-700 bg-green-100 text-ink font-bold shadow-green-soft';
                    } else if (isSelected && !isCorrectOption) {
                      buttonStyle =
                        'border-pink-700 bg-pink-100 text-ink font-semibold';
                    } else {
                      buttonStyle =
                        'border-pink-100 bg-page/50 text-ink-muted opacity-75';
                    }
                  } else if (isSelected) {
                    buttonStyle =
                      'border-pink-700 bg-pink-500 text-ink font-bold shadow-pink-soft';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`card-lift flex min-h-[56px] w-full items-center gap-3.5 rounded-[20px] border p-4 text-left text-base transition-colors duration-200 ${buttonStyle} ${
                        isSubmitted ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                          isSubmitted && isCorrectOption
                            ? 'border-green-700 bg-green-500 text-ink'
                            : isSelected
                            ? 'border-ink bg-surface text-ink'
                            : 'border-pink-100 bg-surface text-ink-muted'
                        }`}
                      >
                        {isSubmitted && isCorrectOption ? (
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                          optionLetter
                        )}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Umpan Balik Setelah Menjawab */}
            <AnimatePresence initial={false}>
              {isSubmitted && (
                <motion.div
                  key="quiz-explanation"
                  role="status"
                  aria-live="polite"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, height: 0, marginTop: 0 }
                  }
                  animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.32, ease: CUSTOM_EASE }}
                  className="overflow-hidden"
                >
                  <div
                    className={`flex items-start gap-3.5 rounded-[24px] border p-5 ${
                      isChoiceCorrect
                        ? 'border-green-100 bg-green-50 text-ink'
                        : 'border-pink-100 bg-pink-50 text-ink'
                    }`}
                  >
                    {isChoiceCorrect ? (
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-green-700"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    ) : (
                      <Flower2
                        className="mt-0.5 h-5 w-5 shrink-0 text-pink-700"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    )}
                    <div>
                      <p className="font-heading text-lg font-bold text-ink">
                        {isChoiceCorrect
                          ? 'Jawaban Ibu tepat'
                          : 'Belum tepat, tidak apa-apa Ibu'}
                      </p>
                      <p className="mt-1 text-base leading-relaxed text-ink-muted">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =====================================================================
          BOTTOM ACTION BAR APLIKASI QUIZ
         ===================================================================== */}
      <div className="mx-auto w-full max-w-3xl border-t border-pink-100 pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-medium text-ink-muted">
            {!isSubmitted
              ? 'Pilih salah satu opsi lalu tekan Periksa Jawaban'
              : 'Baca penjelasan singkat di atas sebelum lanjut'}
          </span>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="btn-pill inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 bg-pink-500 px-8 py-3 text-base font-bold text-ink shadow-pink-soft disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
            >
              <CheckCircle2
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>Periksa Jawaban</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="btn-pill inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 bg-green-500 px-8 py-3 text-base font-bold text-ink shadow-green-soft cursor-pointer"
            >
              <span>
                {currentIdx < totalQuestions - 1
                  ? 'Soal Berikutnya'
                  : 'Simpan Skor & Lihat Hasil'}
              </span>
              <ArrowRight
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

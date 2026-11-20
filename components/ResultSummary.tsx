'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  History,
  Lock,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { getStages, getUserDayInfo } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import {
  evaluatePassScore,
  passCutOffValue,
  passImportantNote,
  passMaxScore,
} from '@/data/anxiety';
import { CountUpNumber, ProgressRing } from '@/components/AnimatedMetric';

export function ResultSummary() {
  const {
    session,
    progress,
    anxietySubmission,
    openAnxietyDialog,
    enterWebApp,
  } = useApp();

  const stages = getStages();

  const completedStagesCount = progress?.completedStageIds.length ?? 0;
  const totalStagesCount = stages.length; // 3 Level
  const stageProgressPct = Math.round(
    (completedStagesCount / Math.max(1, totalStagesCount)) * 100
  );

  const dayInfo = useMemo(() => {
    return getUserDayInfo(session?.id ?? 'guest');
  }, [session?.id, progress?.simulatedDayOffset, progress?.firstLoginAt]);

  // Pre-test & Post-test Data (Masing-masing hanya 1x pengerjaan)
  const initialPretestAnxiety = progress?.initialPretestAnxiety;
  const initialPretestQuiz = progress?.initialPretestQuiz;
  const posttestAnxiety = progress?.posttestAnxiety;
  const posttestQuiz = progress?.posttestQuiz;
  const testHistory = progress?.testHistory || [];

  const isPretestComplete = Boolean(initialPretestAnxiety && initialPretestQuiz);
  const isPosttestComplete = Boolean(posttestAnxiety && posttestQuiz);

  const [selectedPassView, setSelectedPassView] = useState<
    'latest' | 'pretest' | 'posttest'
  >('latest');

  const activeAnxietyRecord =
    selectedPassView === 'pretest'
      ? initialPretestAnxiety || anxietySubmission
      : selectedPassView === 'posttest'
      ? posttestAnxiety || anxietySubmission
      : posttestAnxiety || initialPretestAnxiety || anxietySubmission;

  const activePassMeta = activeAnxietyRecord
    ? evaluatePassScore(
        activeAnxietyRecord.totalScore,
        activeAnxietyRecord.maxScore
      )
    : null;

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

  const formatLevelBadge = (level?: string) => {
    switch (level) {
      case 'minimal':
      case 'rendah':
        return {
          label: 'Gejala Kecemasan Minimal (0-20)',
          cls: 'bg-[#F5F8EB] text-[#56632A]',
        };
      case 'ringan-sedang-bawah':
      case 'sedang':
        return {
          label: 'Kecemasan Ringan-Sedang (21-25)',
          cls: 'bg-[#FFF6EC] text-[#9C5718]',
        };
      case 'ringan-sedang-atas':
        return {
          label: 'Kecemasan Ringan-Sedang (26-41)',
          cls: 'bg-[#FDF2F5] text-[#C84B71]',
        };
      case 'berat':
      case 'tinggi':
        return {
          label: 'Kecemasan Berat (42-93)',
          cls: 'bg-[#FBEDF1] text-[#9E2A4D]',
        };
      default:
        return {
          label: level || 'Tercatat',
          cls: 'bg-pink-100 text-[#C84B71]',
        };
    }
  };

  return (
    <div className="space-y-6 rounded-[28px] border border-pink-100 bg-surface p-5 shadow-pink-soft sm:p-8">
      {/* Header Hasil Saya di Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FBEDF1] px-3 py-1 text-xs font-bold text-[#C84B71] mb-1.5">
            <Award className="h-3.5 w-3.5" />
            <span>Rapor Evaluasi &bull; Hasil Saya</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
            Hasil Saya — {session?.name ?? 'Ibu'}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted leading-relaxed">
            Ringkasan hasil Pre-Test awal (PASS 31 Pertanyaan &amp; Pemahaman 20 Pertanyaan) serta Post-Test Tahap Akhir (Hari ke-7).
          </p>
        </div>

        <div className="flex items-center gap-3.5 rounded-[24px] border border-green-100 bg-green-50 px-5 py-3">
          <ProgressRing
            percentage={stageProgressPct}
            size={54}
            trackColor="#E4EAC9"
            progressColor="#56632A"
            label={`Total progres ${stageProgressPct}%`}
          />
          <div>
            <span className="block text-xs font-semibold text-green-700">
              Progres 3 Level
            </span>
            <span className="font-heading text-2xl font-bold text-ink">
              <CountUpNumber value={stageProgressPct} suffix="%" />
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          0. KARTU ASESMEN SKRINING KECEMASAN PASS (Tanpa Tabel Rujukan Nilai)
         ===================================================================== */}
      <section aria-labelledby="pass-result-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4
            id="pass-result-heading"
            className="font-heading text-base sm:text-lg font-bold text-[#2A2D22] flex items-center gap-2"
          >
            <ClipboardCheck className="h-5 w-5 text-[#C84B71]" />
            <span>Hasil Skrining Kecemasan Menggunakan PASS</span>
          </h4>

          <div className="flex flex-wrap items-center gap-2">
            {(initialPretestAnxiety || posttestAnxiety) && (
              <div className="flex items-center gap-1 rounded-full bg-[#FAF4F6] p-1 text-xs">
                {initialPretestAnxiety && (
                  <button
                    type="button"
                    onClick={() => setSelectedPassView('pretest')}
                    className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
                      selectedPassView === 'pretest' ||
                      (selectedPassView === 'latest' && !posttestAnxiety)
                        ? 'bg-white text-[#C84B71] shadow-2xs'
                        : 'text-[#767A6E] hover:text-[#2A2D22]'
                    }`}
                  >
                    Pre-Test Awal
                  </button>
                )}
                {posttestAnxiety && (
                  <button
                    type="button"
                    onClick={() => setSelectedPassView('posttest')}
                    className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
                      selectedPassView === 'posttest' ||
                      (selectedPassView === 'latest' && Boolean(posttestAnxiety))
                        ? 'bg-white text-[#C84B71] shadow-2xs'
                        : 'text-[#767A6E] hover:text-[#2A2D22]'
                    }`}
                  >
                    Post-Test (Hari ke-7)
                  </button>
                )}
              </div>
            )}

            {!isPretestComplete && (
              <button
                type="button"
                onClick={() => openAnxietyDialog('pretest')}
                className="btn-pill inline-flex items-center gap-1.5 rounded-full bg-[#C84B71] hover:bg-[#b23b60] px-4 py-1.5 text-xs font-bold text-white shadow-2xs cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Kerjakan Pre-Test Awal</span>
              </button>
            )}
          </div>
        </div>

        {activeAnxietyRecord && activePassMeta ? (
          (() => {
            const theme = getVisualTheme(activePassMeta.level);
            const normalizedTotal =
              activeAnxietyRecord.maxScore <= 21
                ? Math.round(
                    (activeAnxietyRecord.totalScore /
                      Math.max(1, activeAnxietyRecord.maxScore)) *
                      passMaxScore
                  )
                : activeAnxietyRecord.totalScore;
            const scoreRatioPct = Math.min(
              100,
              Math.round((normalizedTotal / passMaxScore) * 100)
            );
            const cutOffPct = Math.round((passCutOffValue / passMaxScore) * 100);

            return (
              <div className="space-y-4">
                {/* Kartu 2 Kolom dengan Tema Warna Buna Ceria */}
                <div className="rounded-[24px] border-2 border-[#F5DCE4] bg-[#FFFDFE] p-5 sm:p-6 shadow-[0_6px_24px_rgba(200,75,113,0.06)]">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Kolom Kiri */}
                    <div className="md:col-span-4 flex flex-col items-center text-center md:border-r md:border-pink-100 md:pr-5">
                      <div
                        className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${theme.circleBg} text-5xl shadow-inner`}
                        aria-hidden="true"
                      >
                        {theme.emoji}
                      </div>

                      <span className="mt-4 text-[11px] font-extrabold uppercase tracking-widest text-[#C84B71]">
                        SKOR ASESMEN
                      </span>

                      <div className="mt-1 flex items-baseline justify-center gap-1">
                        <span className="font-heading text-5xl font-black text-[#2A2D22]">
                          {normalizedTotal}
                        </span>
                        <span className="text-xl font-bold text-[#8C8896]">
                          / {passMaxScore}
                        </span>
                      </div>

                      <div
                        className={`mt-3 inline-flex flex-col items-center rounded-full border px-4 py-1.5 text-xs font-extrabold ${theme.badgeBg}`}
                      >
                        <span>{activePassMeta.categoryLabel}</span>
                      </div>

                      {activePassMeta.badgeSubLabel && (
                        <span className="mt-1.5 text-[11px] font-semibold text-[#6E6A6C]">
                          {activePassMeta.badgeSubLabel}
                        </span>
                      )}
                    </div>

                    {/* Kolom Kanan */}
                    <div className="md:col-span-8 space-y-4 text-left">
                      <div>
                        <h5 className="font-heading text-lg font-extrabold text-[#2A2D22]">
                          Analisa Hasil:
                        </h5>
                        <p className="mt-0.5 text-xs font-bold text-[#C84B71]">
                          {activePassMeta.heading}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[#4A4D40]">
                          {activePassMeta.analysis}
                        </p>
                      </div>

                      {/* Kotak Rekomendasi Tindakan */}
                      <div
                        className={`rounded-[18px] border-2 p-4 ${theme.boxBg}`}
                      >
                        <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider mb-1.5 text-[#C84B71]">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>REKOMENDASI TINDAKAN:</span>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed font-medium">
                          {activePassMeta.recommendation}
                        </p>
                      </div>

                      {/* Informasi Penting */}
                      <div className="rounded-[16px] border border-pink-200 bg-[#FFF7F9] p-3.5 text-xs leading-relaxed text-[#5F5B5D]">
                        <p className="font-bold text-[#C84B71] mb-0.5">
                          Informasi Penting:
                        </p>
                        <p>{passImportantNote}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bar Horizontal TINGKAT KECEMASAN (Mengikuti Tema Warna Buna Ceria) */}
                <div className="rounded-[22px] border border-[#F5DCE4] bg-gradient-to-r from-[#FFF5F8] via-[#FFF9FB] to-[#F5F8EB] p-4 sm:p-5 text-[#2A2D22] shadow-[0_6px_20px_rgba(200,75,113,0.06)]">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#C84B71]">
                      TINGKAT KECEMASAN
                    </span>
                    <span className="rounded-full bg-white border border-pink-200 px-3 py-0.5 text-xs font-extrabold text-[#2A2D22] shadow-2xs">
                      {normalizedTotal}/{passMaxScore}
                    </span>
                  </div>
                  <div className="relative h-4 w-full overflow-hidden rounded-full bg-[#FBEDF1] border border-[#F3D1DC] shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${theme.barColor}`}
                      style={{ width: `${Math.max(4, scoreRatioPct)}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#56632A]"
                      style={{ left: `${cutOffPct}%` }}
                      title={`Cut-off PASS: ${passCutOffValue}`}
                    />
                  </div>
                  <div className="mt-2.5 flex flex-wrap justify-between gap-2 text-[11px] font-semibold text-[#5F5B5D]">
                    <span
                      className={
                        activePassMeta.level === 'minimal'
                          ? 'text-[#56632A] font-extrabold'
                          : ''
                      }
                    >
                      0-20: Minimal
                    </span>
                    <span
                      className={
                        activePassMeta.level === 'ringan-sedang-bawah'
                          ? 'text-[#9C5718] font-extrabold'
                          : ''
                      }
                    >
                      21-25: Ringan-Sedang
                    </span>
                    <span
                      className={
                        activePassMeta.level === 'ringan-sedang-atas'
                          ? 'text-[#C84B71] font-extrabold'
                          : ''
                      }
                    >
                      26-41: Ringan-Sedang (≥Cut-off 26)
                    </span>
                    <span
                      className={
                        activePassMeta.level === 'berat'
                          ? 'text-[#9E2A4D] font-extrabold'
                          : ''
                      }
                    >
                      42-93: Berat
                    </span>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="rounded-[22px] border border-dashed border-pink-200 bg-[#FFF9FB] p-6 text-center space-y-3">
            <p className="text-sm font-bold text-[#2A2D22]">
              Yuk, Kerjakan Pre-Test Awal (PASS 31 Pertanyaan &amp; Pemahaman 20 Pertanyaan)! ❤️
            </p>
            <p className="text-xs text-[#5F5B5D] max-w-xl mx-auto">
              Pre-Test dilakukan 1 kali di awal sebelum memulai pembelajaran untuk mengenali kondisi perasaan dan pemahaman awal Bunda.
            </p>
            <button
              type="button"
              onClick={() => openAnxietyDialog('pretest')}
              className="btn-pill inline-flex items-center gap-2 bg-[#C84B71] hover:bg-[#b23b60] px-5 py-2.5 text-xs font-bold text-white shadow-2xs cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Mulai Pre-Test Awal Sekarang</span>
            </button>
          </div>
        )}
      </section>

      {/* =====================================================================
          1. HASIL PRE-TEST AWAL (PASS 31 PERTANYAAN + PEMAHAMAN 20 PERTANYAAN — 1X PENGERJAAN)
         ===================================================================== */}
      <section aria-labelledby="pretest-heading" className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4
            id="pretest-heading"
            className="font-heading text-base font-bold text-[#2A2D22] flex items-center gap-2"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FBEDF1] text-[#C84B71] text-xs">
              1
            </span>
            <span>Hasil Pre-Test Awal (1 Kali Pengerjaan)</span>
          </h4>
          {isPretestComplete && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F8EB] border border-[#C5D49B] px-3 py-0.5 text-[11px] font-bold text-[#56632A]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Selesai Dikerjakan (1x)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* A. Pre-Test Kecemasan PASS (31 Pertanyaan) */}
          <div className="rounded-[22px] border border-pink-100 bg-[#FFF7F9] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                  Pre-Test PASS (31 Pertanyaan)
                </span>
                {initialPretestAnxiety && (
                  <span className="rounded-full bg-white border border-pink-200 px-2.5 py-0.5 text-[10px] font-bold text-[#C84B71]">
                    {
                      evaluatePassScore(
                        initialPretestAnxiety.totalScore,
                        initialPretestAnxiety.maxScore
                      ).categoryLabel
                    }
                  </span>
                )}
              </div>

              {initialPretestAnxiety ? (
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-bold text-[#2A2D22]">
                      {initialPretestAnxiety.totalScore}
                    </span>
                    <span className="text-sm text-[#767A6E]">
                      / {initialPretestAnxiety.maxScore} Poin PASS
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#5F5B5D]">
                    Selesai pada:{' '}
                    {new Date(
                      initialPretestAnxiety.completedAt
                    ).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#767A6E] leading-relaxed">
                  Belum dikerjakan. Isi 31 pernyataan skrining PASS awal (hanya 1 kali pengerjaan).
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-pink-100">
              {initialPretestAnxiety ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56632A]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sudah Dikerjakan (1x Pengerjaan)</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => openAnxietyDialog('pretest')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C84B71] hover:underline cursor-pointer"
                >
                  <span>Mulai Pre-Test PASS Sekarang</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* B. Pre-Test Pemahaman Materi (20 Pertanyaan) */}
          <div className="rounded-[22px] border border-[#E8ECE0] bg-[#F7F9F2] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                  Pre-Test Pemahaman (20 Pertanyaan)
                </span>
                {initialPretestQuiz && (
                  <span className="rounded-full bg-white border border-[#D5DFC4] px-2.5 py-0.5 text-[10px] font-bold text-[#56632A]">
                    {initialPretestQuiz.percentage}% Tepat
                  </span>
                )}
              </div>

              {initialPretestQuiz ? (
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-bold text-[#2A2D22]">
                      {initialPretestQuiz.score}
                    </span>
                    <span className="text-sm text-[#767A6E]">
                      / {initialPretestQuiz.maxScore} Soal Benar
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#5F5B5D]">
                    Selesai pada:{' '}
                    {new Date(initialPretestQuiz.completedAt).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#767A6E] leading-relaxed">
                  Belum dikerjakan. Kerjakan 20 soal pemahaman materi masa nifas &amp; ASI pada Pre-Test awal (hanya 1 kali pengerjaan).
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8ECE0]">
              {initialPretestQuiz ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56632A]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sudah Dikerjakan (1x Pengerjaan)</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => openAnxietyDialog('pretest')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56632A] hover:underline cursor-pointer"
                >
                  <span>Mulai Pre-Test Pemahaman (20 Soal)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. HASIL POST-TEST TAHAP AKHIR HARI KE-7 (PASS 31 PERTANYAAN + PEMAHAMAN 20 PERTANYAAN — 1X PENGERJAAN)
         ===================================================================== */}
      <section aria-labelledby="posttest-heading" className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4
            id="posttest-heading"
            className="font-heading text-base font-bold text-[#2A2D22] flex items-center gap-2"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F5F8EB] text-[#56632A] text-xs">
              2
            </span>
            <span>
              Hasil Tahap Akhir (Hari ke-7): Post-Test PASS &amp; Quiz Pemahaman (1 Kali Pengerjaan)
            </span>
          </h4>
          {isPosttestComplete ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F8EB] border border-[#C5D49B] px-3 py-0.5 text-[11px] font-bold text-[#56632A]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Selesai Dikerjakan (1x)
            </span>
          ) : dayInfo.unlocked.posttestAnxiety ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FCE8EE] px-3 py-0.5 text-[11px] font-bold text-[#C84B71]">
              Terbuka Hari ke-7
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-0.5 text-[11px] font-semibold text-gray-600">
              <Lock className="h-3 w-3" /> Terbuka pada Hari ke-7 (Saat ini Hari ke-{dayInfo.dayNumber})
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* A. Post-Test Kecemasan PASS (31 Pertanyaan) */}
          <div className="rounded-[22px] border border-pink-100 bg-[#FFF7F9] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                  Post-Test PASS (31 Pertanyaan)
                </span>
                {posttestAnxiety && (
                  <span className="rounded-full bg-white border border-pink-200 px-2.5 py-0.5 text-[10px] font-bold text-[#C84B71]">
                    {
                      evaluatePassScore(
                        posttestAnxiety.totalScore,
                        posttestAnxiety.maxScore
                      ).categoryLabel
                    }
                  </span>
                )}
              </div>

              {posttestAnxiety ? (
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-bold text-[#2A2D22]">
                      {posttestAnxiety.totalScore}
                    </span>
                    <span className="text-sm text-[#767A6E]">
                      / {posttestAnxiety.maxScore} Poin PASS
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#5F5B5D]">
                    Selesai pada:{' '}
                    {new Date(posttestAnxiety.completedAt).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#767A6E] leading-relaxed">
                  Terbuka di Hari ke-7 untuk mengukur kembali tingkat ketenangan Bunda (31 pernyataan PASS, hanya 1x pengerjaan).
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-pink-100">
              {posttestAnxiety ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56632A]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sudah Dikerjakan (1x Pengerjaan)</span>
                </span>
              ) : dayInfo.unlocked.posttestAnxiety ? (
                <button
                  type="button"
                  onClick={() => openAnxietyDialog('posttest')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C84B71] hover:underline cursor-pointer"
                >
                  <span>Kerjakan Post-Test Hari ke-7</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Terbuka pada Hari ke-7</span>
                </span>
              )}
            </div>
          </div>

          {/* B. Post-Test Quiz Pemahaman Materi (20 Pertanyaan) */}
          <div className="rounded-[22px] border border-[#E8ECE0] bg-[#F7F9F2] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                  Post-Test Quiz Pemahaman (20 Pertanyaan)
                </span>
                {posttestQuiz && (
                  <span className="rounded-full bg-white border border-[#D5DFC4] px-2.5 py-0.5 text-[10px] font-bold text-[#56632A]">
                    {posttestQuiz.percentage}% Tepat
                  </span>
                )}
              </div>

              {posttestQuiz ? (
                <div className="mt-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-bold text-[#2A2D22]">
                      {posttestQuiz.score}
                    </span>
                    <span className="text-sm text-[#767A6E]">
                      / {posttestQuiz.maxScore} Soal Benar
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#5F5B5D]">
                    Selesai pada:{' '}
                    {new Date(posttestQuiz.completedAt).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#767A6E] leading-relaxed">
                  Terbuka di Hari ke-7 bersamaan dengan Post-Test Tingkat Kecemasan PASS (20 soal pemahaman yang sama, hanya 1x pengerjaan).
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8ECE0]">
              {posttestQuiz ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56632A]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sudah Dikerjakan (1x Pengerjaan)</span>
                </span>
              ) : dayInfo.unlocked.posttestAnxiety ? (
                <button
                  type="button"
                  onClick={() => openAnxietyDialog('posttest')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56632A] hover:underline cursor-pointer"
                >
                  <span>Kerjakan Quiz Post-Test Hari ke-7</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Terbuka pada Hari ke-7</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. PERBANDINGAN PRE-TEST VS POST-TEST (JIKA KEDUANYA SUDAH SELESAI)
         ===================================================================== */}
      {posttestAnxiety && initialPretestAnxiety && (
        <div className="rounded-[22px] border border-[#F5DCE4] bg-gradient-to-r from-[#FFF5F8] via-[#FFF9FB] to-[#F5F8EB] p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#FCE8EE] px-2.5 py-0.5 text-[10px] font-bold text-[#C84B71]">
              Evaluasi Perkembangan Hari ke-7
            </span>
          </div>
          <h4 className="font-heading text-base font-bold text-[#2A2D22]">
            Perbandingan Ketenangan &amp; Pemahaman Bunda (Pre-Test vs Post-Test)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-xl bg-white border border-pink-100 p-3">
              <span className="text-[11px] text-[#6E6A6C]">Skor PASS Awal:</span>
              <p className="text-lg font-bold text-[#2A2D22]">
                {initialPretestAnxiety.totalScore} /{' '}
                {initialPretestAnxiety.maxScore}
              </p>
              <span className="text-[10px] font-semibold text-[#C84B71]">
                {
                  evaluatePassScore(
                    initialPretestAnxiety.totalScore,
                    initialPretestAnxiety.maxScore
                  ).categoryLabel
                }
              </span>
            </div>

            <div className="rounded-xl bg-white border border-pink-100 p-3">
              <span className="text-[11px] text-[#6E6A6C]">
                Skor PASS Hari ke-7:
              </span>
              <p className="text-lg font-bold text-[#2A2D22]">
                {posttestAnxiety.totalScore} / {posttestAnxiety.maxScore}
              </p>
              <span className="text-[10px] font-semibold text-[#56632A]">
                {
                  evaluatePassScore(
                    posttestAnxiety.totalScore,
                    posttestAnxiety.maxScore
                  ).categoryLabel
                }
              </span>
            </div>

            <div className="rounded-xl bg-white border border-pink-100 p-3 sm:col-span-2 flex flex-col justify-center">
              <span className="text-[11px] text-[#6E6A6C]">
                Perubahan Ketenangan:
              </span>
              <p className="text-sm font-bold text-[#56632A] flex items-center gap-1.5 mt-0.5">
                {posttestAnxiety.totalScore <=
                initialPretestAnxiety.totalScore ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-[#56632A]" />
                    <span>
                      Skor kecemasan berkurang{' '}
                      {initialPretestAnxiety.totalScore -
                        posttestAnxiety.totalScore}{' '}
                      poin!
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-[#9C5718]" />
                    <span>
                      Tetap jaga waktu istirahat, latihan relaksasi napas, dan
                      minta dukungan pasangan
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. RIWAYAT PENGERJAAN TEST
         ===================================================================== */}
      {testHistory.length > 0 && (
        <section aria-labelledby="history-heading" className="space-y-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <h4
              id="history-heading"
              className="font-heading text-base font-bold text-[#2A2D22] flex items-center gap-2"
            >
              <History className="h-4 w-4 text-[#C84B71]" />
              <span>Catatan Waktu Pengerjaan Evaluasi</span>
            </h4>
            <span className="text-xs text-[#767A6E]">
              {testHistory.length} evaluasi tercatat
            </span>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-pink-100 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8FC] border-b border-[#ECE7F2] text-[#4A4D40] font-bold">
                  <tr>
                    <th className="py-3 px-4">Waktu Pengerjaan</th>
                    <th className="py-3 px-4">Jenis Evaluasi</th>
                    <th className="py-3 px-4 text-center">Skor / Nilai</th>
                    <th className="py-3 px-4 text-right">Hasil / Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EBF0]">
                  {testHistory.map((item) => {
                    const dateFormatted = new Date(
                      item.completedAt
                    ).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    const isAnxiety =
                      item.category === 'pretest-kecemasan' ||
                      item.category === 'posttest-kecemasan';

                    const badgeInfo = isAnxiety
                      ? formatLevelBadge(item.level)
                      : null;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-[#FFF9FB] transition-colors"
                      >
                        <td className="py-3 px-4 text-[#6E6A6C] whitespace-nowrap">
                          {dateFormatted}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#2A2D22]">
                          {item.title}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-[#2A2D22]">
                          {item.score} / {item.maxScore}{' '}
                          <span className="text-[10px] font-normal text-[#767A6E]">
                            ({item.percentage}%)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isAnxiety && badgeInfo ? (
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badgeInfo.cls}`}
                            >
                              {badgeInfo.label}
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-[#F5F8EB] text-[#56632A] px-2.5 py-0.5 text-[10px] font-bold">
                              {item.percentage >= 75
                                ? 'Sangat Baik'
                                : 'Cukup Baik'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Ringkasan Refleksi & Langkah Pilihan Ibu (Level 2) */}
      {progress?.reflectionSelectedItems?.length ||
      progress?.reflectionNote ||
      progress?.evaluationCheckedItems?.length ? (
        <div className="rounded-[24px] border border-pink-100 bg-green-50/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-heading text-lg font-bold text-ink">
              Catatan Refleksi Diri &amp; Rencana Langkah Bunda (Level 2)
            </h4>
            <button
              type="button"
              onClick={() => enterWebApp('tips')}
              className="text-xs font-bold text-[#56632A] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Kunjungi Kebun Bunga Delima (Level 3)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {progress.reflectionNote && (
            <p className="mt-2 rounded-[20px] border border-pink-100 bg-surface p-4 text-base italic text-ink">
              &ldquo;{progress.reflectionNote}&rdquo;
            </p>
          )}
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {[
              ...(progress.reflectionSelectedItems ?? []),
              ...(progress.evaluationCheckedItems ?? []),
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-[20px] border border-pink-100 bg-surface p-3.5 text-sm text-ink"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-700"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

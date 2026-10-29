'use client';

import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  PhoneCall,
  RotateCcw,
} from 'lucide-react';
import { getAnxietyConfig, getModules, getStages } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { CountUpNumber, ProgressRing } from '@/components/AnimatedMetric';

export function ResultSummary() {
  const {
    session,
    progress,
    anxietySubmission,
    openAnxietyDialog,
    selectStage,
    enterWebApp,
  } = useApp();

  const stages = getStages();
  const modules = getModules();
  const { closingMessages } = getAnxietyConfig();

  const completedStagesCount = progress?.completedStageIds.length ?? 0;
  const totalStagesCount = stages.length;
  const stageProgressPct = Math.round(
    (completedStagesCount / totalStagesCount) * 100
  );

  const completedModulesCount = progress?.completedModuleIds.length ?? 0;
  const totalModulesCount = modules.length;

  const bestQuizScore = progress?.bestQuizScore;
  const bestQuizCorrect = progress?.bestQuizCorrectCount;

  const anxietyPct = anxietySubmission
    ? Math.round(
        (anxietySubmission.totalScore / anxietySubmission.maxScore) * 100
      )
    : 0;

  return (
    <div className="space-y-6 rounded-[28px] border border-pink-100 bg-surface p-5 shadow-pink-soft sm:p-8">
      {/* Header Hasil Saya */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3.5 py-1 text-sm font-bold text-green-700">
            <Award className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span>Rangkuman Perjalanan Belajar</span>
          </span>
          <h3 className="mt-2 font-heading text-2xl font-bold text-ink sm:text-3xl">
            Hasil Saya — {session?.name ?? 'Ibu'}
          </h3>
          <p className="mt-1 text-base text-ink-muted">
            Catatan bacaan, skor kuis terbaik, dan sapaan perasaan Ibu dalam
            satu halaman yang tenang.
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
            <span className="block text-sm font-semibold text-green-700">
              Progres Tahap
            </span>
            <span className="font-heading text-2xl font-bold text-ink">
              <CountUpNumber value={stageProgressPct} suffix="%" />
            </span>
          </div>
        </div>
      </div>

      {/* 3 Kartu Ringkasan Utama */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 1. Progres Tahapan & Materi */}
        <div className="card-lift flex flex-col justify-between rounded-[24px] border border-pink-100 bg-page p-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-green-700">
                <BookOpen
                  className="h-5 w-5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h4 className="font-heading text-lg font-bold text-ink">
                  Progres Belajar
                </h4>
              </div>
              <ProgressRing
                percentage={stageProgressPct}
                size={48}
                trackColor="#E4EAC9"
                progressColor="#56632A"
              />
            </div>

            <p className="mt-3 font-heading text-3xl font-bold text-ink">
              <CountUpNumber value={stageProgressPct} suffix="%" />
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {completedStagesCount} dari {totalStagesCount} tahap selesai •{' '}
              {completedModulesCount}/{totalModulesCount} materi dibaca
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => selectStage('materi')}
              className="btn-pill inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 border border-pink-100 bg-surface px-4 py-2 text-sm font-bold text-ink cursor-pointer"
            >
              <span>Baca Ulang Materi</span>
            </button>
          </div>
        </div>

        {/* 2. Skor Quiz Terbaik */}
        <div className="card-lift flex flex-col justify-between rounded-[24px] border border-pink-100 bg-page p-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-pink-700">
                <Award
                  className="h-5 w-5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h4 className="font-heading text-lg font-bold text-ink">
                  Skor Quiz Terbaik
                </h4>
              </div>
              <ProgressRing
                percentage={bestQuizScore ?? 0}
                size={48}
                trackColor="#FBDDE3"
                progressColor="#A8435A"
              />
            </div>

            <p className="mt-3 font-heading text-3xl font-bold text-ink">
              {bestQuizScore !== null && bestQuizScore !== undefined ? (
                <CountUpNumber value={bestQuizScore} suffix="%" />
              ) : (
                'Belum ada'
              )}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {bestQuizCorrect !== null && bestQuizCorrect !== undefined
                ? `${bestQuizCorrect} dari 8 soal tepat (${
                    progress?.quizAttempts ?? 1
                  }x percobaan)`
                : 'Kerjakan tahap Quiz untuk menyimpan skor Ibu.'}
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => selectStage('quiz')}
              className="btn-pill inline-flex min-h-[44px] w-full items-center justify-center gap-2 border border-pink-100 bg-surface px-4 py-2 text-sm font-bold text-ink cursor-pointer"
            >
              <RotateCcw
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>Coba Quiz Lagi</span>
            </button>
          </div>
        </div>

        {/* 3. Catatan Perasaan (Hasil Kuesioner Kecemasan) */}
        <div className="card-lift flex flex-col justify-between rounded-[24px] border border-pink-100 bg-pink-50/70 p-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-pink-700">
                <HeartHandshake
                  className="h-5 w-5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h4 className="font-heading text-lg font-bold text-ink">
                  Catatan Perasaan
                </h4>
              </div>
              {anxietySubmission && (
                <ProgressRing
                  percentage={anxietyPct}
                  size={48}
                  trackColor="#FBDDE3"
                  progressColor="#A8435A"
                />
              )}
            </div>

            {anxietySubmission ? (
              <>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-bold text-ink">
                    <CountUpNumber value={anxietySubmission.totalScore} />
                    <span className="text-lg font-normal text-ink-muted">
                      /{anxietySubmission.maxScore}
                    </span>
                  </span>
                  <span className="rounded-full bg-surface border border-pink-100 px-3 py-0.5 text-sm font-bold capitalize text-pink-700">
                    Tingkat {anxietySubmission.level}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {closingMessages[anxietySubmission.level].message}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Ibu belum mengisi catatan perasaan awal. Luangkan 1 menit untuk
                mengenali perasaan hari ini.
              </p>
            )}
          </div>

          <div className="mt-5">
            {!anxietySubmission ? (
              <button
                type="button"
                onClick={openAnxietyDialog}
                className="btn-pill inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 bg-pink-500 px-4 py-2 text-sm font-bold text-ink cursor-pointer"
              >
                <span>Isi Sapaan Perasaan</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => enterWebApp('kontak-ahli')}
                className="btn-pill inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-pink-500 px-4 py-2 text-sm font-bold text-ink cursor-pointer"
              >
                <PhoneCall
                  className="h-4 w-4"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>Hubungi Kontak Ahli</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ringkasan Refleksi & Langkah Pilihan Ibu */}
      {progress?.reflectionSelectedItems?.length ||
      progress?.reflectionNote ||
      progress?.evaluationCheckedItems?.length ? (
        <div className="rounded-[24px] border border-pink-100 bg-green-50/60 p-5">
          <h4 className="font-heading text-lg font-bold text-ink">
            Catatan Refleksi & Rencana Pilihan Ibu
          </h4>
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

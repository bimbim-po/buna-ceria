'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  CircleDot,
  Lock,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { getModules, getStages } from '@/lib/api';
import { uiContent } from '@/data/uiContent';
import { useApp } from '@/context/AppContext';
import { QuizRunner } from '@/components/QuizRunner';
import { ResultSummary } from '@/components/ResultSummary';
import { StageId } from '@/types';

export function StagePanel() {
  const {
    progress,
    moduleStatuses,
    openModuleReader,
    handleCompleteModule,
    handleCompleteStage,
    selectStage,
  } = useApp();

  const stages = getStages();
  const modules = getModules();

  const activeStageId = progress?.activeStageId ?? 'materi';
  const currentStage =
    stages.find((s) => s.id === activeStageId) ?? stages[0];

  const [reflectionItems, setReflectionItems] = useState<string[]>(
    progress?.reflectionSelectedItems ?? []
  );
  const [reflectionNote, setReflectionNote] = useState<string>(
    progress?.reflectionNote ?? ''
  );
  const [evaluationItems, setEvaluationItems] = useState<string[]>(
    progress?.evaluationCheckedItems ?? []
  );
  const [isFullscreenStage, setIsFullscreenStage] = useState(false);

  const toggleItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const scrollToTrackerAndAdvance = (targetStageId: StageId) => {
    setIsFullscreenStage(false);
    selectStage(targetStageId);
    const trackerEl = document.getElementById('ruang-belajar');
    if (trackerEl) {
      trackerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --------------------------------------------------------------------------
  // TAHAP 1: MATERI
  // --------------------------------------------------------------------------
  if (activeStageId === 'materi') {
    const completedModulesCount = progress?.completedModuleIds.length ?? 0;
    const allModulesDone = completedModulesCount === modules.length;

    return (
      <div
        id="stage-panel-anchor"
        className="scroll-mt-24 rounded-[28px] border border-pink-100 bg-surface p-5 shadow-pink-soft sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-5">
          <div>
            <h3 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
              {currentStage.title}
            </h3>
            <p className="mt-1 text-base text-ink-muted">
              Pilih bacaan untuk mulai membaca di Ruang Baca Fokus (mendukung
              Mode Layar Penuh).
            </p>
          </div>

          <div className="shrink-0 rounded-[20px] border border-pink-100 bg-page px-5 py-2.5 text-center">
            <span className="font-heading text-xl font-bold text-ink">
              {completedModulesCount} / {modules.length} Selesai
            </span>
          </div>
        </div>

        {/* Daftar Berbaris 4 Materi di dalam Panel */}
        <div className="mt-5 space-y-3">
          {modules.map((mod) => {
            const status = moduleStatuses[mod.id];
            const isLocked = status === 'terkunci';
            const isCompleted = status === 'selesai';

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => openModuleReader(mod.id)}
                className={`card-lift flex min-h-[68px] w-full flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] border p-4 text-left cursor-pointer ${
                  isCompleted
                    ? 'border-pink-100 bg-green-50/70'
                    : isLocked
                    ? 'border-locked-border bg-locked-bg/60 text-ink-muted'
                    : 'border-pink-100 bg-pink-50/60'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-ink-muted">
                      Materi {mod.order} • {mod.readingTimeMinutes}{' '}
                      {uiContent.modulesSection.readTimeUnit}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-sm font-bold ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : isLocked
                          ? 'bg-locked-bg text-ink-muted'
                          : 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span>Selesai</span>
                        </>
                      ) : isLocked ? (
                        <>
                          <Lock
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          <span>Terkunci</span>
                        </>
                      ) : (
                        <>
                          <CircleDot
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span>Aktif</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="mt-1 font-heading text-lg font-bold text-ink">
                    {mod.title}
                  </p>
                </div>

                <span
                  className={`btn-pill inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 px-4 py-1.5 text-sm font-bold ${
                    isCompleted
                      ? 'bg-surface border border-pink-100 text-green-700'
                      : isLocked
                      ? 'bg-locked-bg text-ink-muted'
                      : 'bg-pink-500 text-ink'
                  }`}
                >
                  <BookOpen
                    className="h-4 w-4"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>
                    {isCompleted
                      ? 'Baca Ulang'
                      : isLocked
                      ? 'Terkunci'
                      : 'Buka Ruang Baca'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Jika keempat materi sudah selesai, tampilkan tombol lanjut ke Quiz */}
        {allModulesDone && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[24px] border border-green-100 bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className="h-6 w-6 shrink-0 text-green-700"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <div>
                <p className="font-heading text-lg font-bold text-ink">
                  Keempat materi telah selesai dibaca
                </p>
                <p className="text-sm text-ink-muted">
                  Tahap Quiz kini sudah terbuka untuk Ibu.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => scrollToTrackerAndAdvance('quiz')}
              className="btn-pill inline-flex min-h-[48px] w-full sm:w-auto shrink-0 items-center justify-center gap-2 bg-pink-500 px-6 py-3 text-base font-bold text-ink shadow-pink-soft cursor-pointer"
            >
              <span>Lanjut ke Tahap Quiz</span>
              <ArrowRight
                className="h-4 w-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TAHAP 2: QUIZ
  // --------------------------------------------------------------------------
  if (activeStageId === 'quiz') {
    return (
      <div id="stage-panel-anchor" className="scroll-mt-24">
        <QuizRunner />
      </div>
    );
  }

  const stageModalClass = isFullscreenStage
    ? 'fixed inset-0 z-50 overflow-y-auto bg-page p-4 sm:p-8'
    : 'scroll-mt-24 rounded-[28px] border border-pink-100 bg-surface p-5 shadow-pink-soft sm:p-8';

  // --------------------------------------------------------------------------
  // TAHAP 3: REFLEKSI
  // --------------------------------------------------------------------------
  if (activeStageId === 'tahap-3') {
    const prompts = currentStage.prompts ?? [];

    return (
      <div id="stage-panel-anchor" className={stageModalClass}>
        <div
          className={
            isFullscreenStage
              ? 'mx-auto max-w-3xl rounded-[28px] border border-pink-100 bg-surface p-6 shadow-pink-soft sm:p-9'
              : ''
          }
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-pink-100 pb-4">
            <div>
              <h3 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
                {currentStage.title}
              </h3>
              <p className="mt-1 text-base text-ink-muted">
                {currentStage.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreenStage((prev) => !prev)}
                className="btn-pill inline-flex min-h-[38px] items-center gap-1.5 border border-pink-100 bg-page px-3.5 py-1 text-xs font-bold text-ink hover:bg-pink-50 cursor-pointer"
              >
                {isFullscreenStage ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Kecilkan</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5 text-pink-700" />
                    <span>Mode Fokus</span>
                  </>
                )}
              </button>
              {isFullscreenStage && (
                <button
                  type="button"
                  onClick={() => setIsFullscreenStage(false)}
                  aria-label="Tutup mode layar penuh"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-100 bg-surface text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className="text-base font-bold text-ink">
              Pilih satu atau beberapa hal yang Ibu rasakan hari ini:
            </legend>
            <div className="mt-3 space-y-3">
              {prompts.map((prompt) => {
                const checked = reflectionItems.includes(prompt);
                return (
                  <button
                    key={prompt}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() =>
                      toggleItem(reflectionItems, setReflectionItems, prompt)
                    }
                    className={`card-lift flex min-h-[52px] w-full items-start gap-3.5 rounded-[20px] border p-4 text-left text-base cursor-pointer ${
                      checked
                        ? 'border-green-700 bg-green-50 text-ink font-semibold'
                        : 'border-pink-100 bg-page text-ink hover:bg-pink-50/60'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        checked
                          ? 'border-green-700 bg-green-500 text-ink'
                          : 'border-pink-100 bg-surface'
                      }`}
                      aria-hidden="true"
                    >
                      {checked && (
                        <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                      )}
                    </span>
                    <span>{prompt}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5">
            <label
              htmlFor="reflection-note-input"
              className="block text-base font-bold text-ink"
            >
              Catatan Kecil untuk Diri Sendiri (Opsional)
            </label>
            <textarea
              id="reflection-note-input"
              rows={3}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="Tuliskan satu kalimat hangat untuk diri Ibu hari ini..."
              className="mt-2 w-full rounded-[20px] border border-pink-100 bg-page p-4 text-base text-ink placeholder:text-ink-muted/70 focus:border-pink-700 focus:bg-surface"
            />
          </div>

          <div className="mt-6 flex justify-end border-t border-pink-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsFullscreenStage(false);
                handleCompleteStage('tahap-3', {
                  reflectionNote,
                  reflectionSelectedItems:
                    reflectionItems.length > 0
                      ? reflectionItems
                      : prompts.slice(0, 1),
                  advanceToNext: true,
                });
              }}
              className="btn-pill inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 bg-pink-500 px-7 py-3 text-base font-bold text-ink shadow-pink-soft cursor-pointer"
            >
              <span>{currentStage.actionLabel ?? 'Selesaikan Tahap 3'}</span>
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

  // --------------------------------------------------------------------------
  // TAHAP 4: EVALUASI AKHIR
  // --------------------------------------------------------------------------
  if (activeStageId === 'tahap-4') {
    const prompts = currentStage.prompts ?? [];

    return (
      <div id="stage-panel-anchor" className={stageModalClass}>
        <div
          className={
            isFullscreenStage
              ? 'mx-auto max-w-3xl rounded-[28px] border border-pink-100 bg-surface p-6 shadow-pink-soft sm:p-9'
              : ''
          }
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-pink-100 pb-4">
            <div>
              <h3 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
                {currentStage.title}
              </h3>
              <p className="mt-1 text-base text-ink-muted">
                {currentStage.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreenStage((prev) => !prev)}
                className="btn-pill inline-flex min-h-[38px] items-center gap-1.5 border border-pink-100 bg-page px-3.5 py-1 text-xs font-bold text-ink hover:bg-pink-50 cursor-pointer"
              >
                {isFullscreenStage ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Kecilkan</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5 text-pink-700" />
                    <span>Mode Fokus</span>
                  </>
                )}
              </button>
              {isFullscreenStage && (
                <button
                  type="button"
                  onClick={() => setIsFullscreenStage(false)}
                  aria-label="Tutup mode layar penuh"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-100 bg-surface text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className="text-base font-bold text-ink">
              Pilih kebiasaan kecil yang ingin Ibu jalankan minggu ini:
            </legend>
            <div className="mt-3 space-y-3">
              {prompts.map((prompt) => {
                const checked = evaluationItems.includes(prompt);
                return (
                  <button
                    key={prompt}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() =>
                      toggleItem(evaluationItems, setEvaluationItems, prompt)
                    }
                    className={`card-lift flex min-h-[52px] w-full items-start gap-3.5 rounded-[20px] border p-4 text-left text-base cursor-pointer ${
                      checked
                        ? 'border-green-700 bg-green-50 text-ink font-semibold'
                        : 'border-pink-100 bg-page text-ink hover:bg-pink-50/60'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        checked
                          ? 'border-green-700 bg-green-500 text-ink'
                          : 'border-pink-100 bg-surface'
                      }`}
                      aria-hidden="true"
                    >
                      {checked && (
                        <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                      )}
                    </span>
                    <span>{prompt}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 flex justify-end border-t border-pink-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsFullscreenStage(false);
                handleCompleteStage('tahap-4', {
                  evaluationCheckedItems:
                    evaluationItems.length > 0
                      ? evaluationItems
                      : prompts.slice(0, 1),
                  advanceToNext: true,
                });
              }}
              className="btn-pill inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 bg-green-500 px-7 py-3 text-base font-bold text-ink shadow-green-soft cursor-pointer"
            >
              <CheckCircle2
                className="h-5 w-5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>
                {currentStage.actionLabel ?? 'Selesaikan & Lihat Hasil Saya'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TAHAP 5: HASIL SAYA
  // --------------------------------------------------------------------------
  return (
    <div id="stage-panel-anchor" className="scroll-mt-24">
      <ResultSummary />
    </div>
  );
}

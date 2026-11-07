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
  // LEVEL 1: MATERI (4 Modul Bertahap)
  // --------------------------------------------------------------------------
  if (activeStageId === 'materi') {
    const completedModulesCount = progress?.completedModuleIds.length ?? 0;
    const allModulesDone = completedModulesCount >= modules.length;

    return (
      <div
        id="stage-panel-anchor"
        className="scroll-mt-24 rounded-[26px] border border-[#ECE7F2] bg-white p-5 shadow-2xs sm:p-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECF5] pb-5">
          <div>
            <h3 className="font-heading text-xl font-bold text-[#2A2D22] sm:text-2xl">
              {currentStage.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#6E6A6C]">
              Pilih modul yang terbuka untuk membaca di Ruang Baca Fokus. Modul
              berikutnya terbuka otomatis setelah modul sebelumnya selesai.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#E4EAC9] bg-[#F7F9EE] px-4 py-2.5 text-center">
            <span className="font-heading text-base sm:text-lg font-bold text-[#56632A]">
              {completedModulesCount} / {modules.length} Modul Selesai
            </span>
          </div>
        </div>

        {/* Daftar Berbaris Modul di dalam Panel Level 1 */}
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
                className={`flex min-h-[68px] w-full flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-[#E4EAC9] bg-[#F7F9EE]/80'
                    : isLocked
                    ? 'border-gray-200 bg-gray-50/70 text-[#8C8896]'
                    : 'border-pink-200 bg-[#FFF5F7]/70 hover:border-[#C84B71]'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#6E6A6C]">
                      Modul {mod.order} • {mod.readingTimeMinutes}{' '}
                      {uiContent.modulesSection.readTimeUnit}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isCompleted
                          ? 'bg-[#EBF3D8] text-[#56632A]'
                          : isLocked
                          ? 'bg-gray-200/70 text-[#8C8896]'
                          : 'bg-[#FDF2F5] text-[#C84B71]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="h-3 w-3" strokeWidth={2.2} />
                          <span>Selesai</span>
                        </>
                      ) : isLocked ? (
                        <>
                          <Lock className="h-3 w-3" strokeWidth={1.8} />
                          <span>Terkunci</span>
                        </>
                      ) : (
                        <>
                          <CircleDot className="h-3 w-3" strokeWidth={2} />
                          <span>Terbuka</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="mt-1 font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                    {mod.title}
                  </p>
                </div>

                <span
                  className={`inline-flex min-h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold ${
                    isCompleted
                      ? 'bg-white border border-[#E4EAC9] text-[#56632A]'
                      : isLocked
                      ? 'bg-gray-100 text-[#8C8896]'
                      : 'bg-[#C84B71] text-white shadow-2xs'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
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

        {/* Jika semua modul selesai, tampilkan tombol lanjut ke Level 2: Quiz */}
        {allModulesDone && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#E4EAC9] bg-[#F7F9EE] p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-[#56632A]" />
              <div>
                <p className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                  Semua modul pada Level 1 telah selesai dibaca!
                </p>
                <p className="text-xs sm:text-sm text-[#6E6A6C]">
                  Level 2 (Quiz Pemahaman) kini sudah terbuka untuk Bunda.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => scrollToTrackerAndAdvance('quiz')}
              className="inline-flex min-h-[44px] w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#C84B71] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#b23b60] cursor-pointer"
            >
              <span>Lanjut ke Level 2: Quiz</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // LEVEL 2: QUIZ PEMAHAMAN
  // --------------------------------------------------------------------------
  if (activeStageId === 'quiz') {
    return (
      <div id="stage-panel-anchor" className="scroll-mt-24">
        <QuizRunner />
      </div>
    );
  }

  const stageModalClass = isFullscreenStage
    ? 'fixed inset-0 z-50 overflow-y-auto bg-[#FFFAF0] p-4 sm:p-8'
    : 'scroll-mt-24 rounded-[26px] border border-[#ECE7F2] bg-white p-5 shadow-2xs sm:p-7';

  // --------------------------------------------------------------------------
  // LEVEL 3: TAHAP 3 (REFLEKSI & RENCANA HARIAN)
  // --------------------------------------------------------------------------
  if (activeStageId === 'tahap-3') {
    const prompts = currentStage.prompts ?? [];
    const evalPrompts = currentStage.evaluationPrompts ?? [];

    return (
      <div id="stage-panel-anchor" className={stageModalClass}>
        <div
          className={
            isFullscreenStage
              ? 'mx-auto max-w-3xl rounded-[28px] border border-pink-100 bg-white p-6 shadow-md sm:p-9'
              : ''
          }
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0ECF5] pb-4">
            <div>
              <h3 className="font-heading text-xl font-bold text-[#2A2D22] sm:text-2xl">
                {currentStage.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#6E6A6C]">
                {currentStage.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreenStage((prev) => !prev)}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-1 text-xs font-bold text-[#2A2D22] hover:bg-pink-50 cursor-pointer"
              >
                {isFullscreenStage ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Kecilkan</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5 text-[#C84B71]" />
                    <span>Mode Fokus</span>
                  </>
                )}
              </button>
              {isFullscreenStage && (
                <button
                  type="button"
                  onClick={() => setIsFullscreenStage(false)}
                  aria-label="Tutup mode layar penuh"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Bagian A: Poin Refleksi Perasaan */}
          <fieldset className="mt-5">
            <legend className="text-sm font-bold text-[#2A2D22]">
              1. Pilih hal baik yang Bunda rasakan hari ini:
            </legend>
            <div className="mt-2.5 space-y-2.5">
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
                    className={`flex min-h-[48px] w-full items-start gap-3 rounded-2xl border p-3.5 text-left text-xs sm:text-sm transition-all cursor-pointer ${
                      checked
                        ? 'border-[#56632A] bg-[#F7F9EE] text-[#2A2D22] font-semibold'
                        : 'border-[#ECE7F2] bg-[#FAF8FC] text-[#2A2D22] hover:bg-white'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        checked
                          ? 'border-[#56632A] bg-[#A8B371] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                    </span>
                    <span>{prompt}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Bagian B: Rencana Kebiasaan Kecil */}
          {evalPrompts.length > 0 && (
            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-[#2A2D22]">
                2. Pilih kebiasaan kecil yang ingin Bunda jalankan minggu ini:
              </legend>
              <div className="mt-2.5 space-y-2.5">
                {evalPrompts.map((prompt) => {
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
                      className={`flex min-h-[48px] w-full items-start gap-3 rounded-2xl border p-3.5 text-left text-xs sm:text-sm transition-all cursor-pointer ${
                        checked
                          ? 'border-[#C84B71] bg-[#FFF5F7] text-[#2A2D22] font-semibold'
                          : 'border-[#ECE7F2] bg-[#FAF8FC] text-[#2A2D22] hover:bg-white'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          checked
                            ? 'border-[#C84B71] bg-[#C84B71] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {checked && (
                          <Check className="h-3 w-3" strokeWidth={2.5} />
                        )}
                      </span>
                      <span>{prompt}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Bagian C: Catatan Pribadi */}
          <div className="mt-5">
            <label
              htmlFor="reflection-note-input"
              className="block text-sm font-bold text-[#2A2D22]"
            >
              3. Catatan Hangat untuk Diri Sendiri &amp; Buah Hati (Opsional)
            </label>
            <textarea
              id="reflection-note-input"
              rows={3}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="Tuliskan satu kalimat penyemangat untuk diri Bunda hari ini..."
              className="mt-2 w-full rounded-2xl border border-[#ECE7F2] bg-[#FAF8FC] p-3.5 text-xs sm:text-sm text-[#2A2D22] placeholder:text-[#8C8896] focus:border-[#C84B71] focus:bg-white outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end border-t border-[#F0ECF5] pt-4">
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
                  evaluationCheckedItems:
                    evaluationItems.length > 0
                      ? evaluationItems
                      : evalPrompts.slice(0, 1),
                  advanceToNext: true,
                });
              }}
              className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#C84B71] px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-[#b23b60] cursor-pointer"
            >
              <span>
                {currentStage.actionLabel ??
                  'Simpan Tahap 3 & Buka Hasil Saya'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // LEVEL 4: HASIL SAYA
  // --------------------------------------------------------------------------
  return (
    <div id="stage-panel-anchor" className="scroll-mt-24">
      <ResultSummary />
    </div>
  );
}

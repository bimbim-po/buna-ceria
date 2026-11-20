'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  CircleDot,
  Heart,
  Headphones,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Sparkles,
  Users,
  Wind,
  X,
} from 'lucide-react';
import { getModules, getStages, getUserDayInfo } from '@/lib/api';
import { uiContent } from '@/data/uiContent';
import { useApp } from '@/context/AppContext';
import { StageId } from '@/types';

const START_TIME_OPTIONS = [
  'Hari ini',
  'Besok',
  'Dalam beberapa hari ke depan',
];

const BREATHING_STEPS = [
  'Duduk atau berbaring dalam posisi yang nyaman.',
  'Letakkan satu tangan di dada dan tangan lainnya di perut.',
  'Tarik napas perlahan melalui hidung.',
  'Rasakan perut mengembang secara perlahan.',
  'Keluarkan napas melalui mulut secara perlahan.',
  'Ulangi selama beberapa menit sesuai kenyamanan Bunda.',
];

const POSITIVE_AFFIRMATIONS = [
  'Aku adalah ibu yang hebat dan terus belajar.',
  'Aku mampu melewati masa nifas dengan baik.',
  'Aku tidak harus menjadi ibu yang sempurna.',
  'Aku boleh beristirahat ketika merasa lelah.',
  'Aku berhak mendapatkan bantuan dan dukungan.',
  'Aku dan bayiku sedang belajar untuk saling beradaptasi. Aku adalah ibu yang hebat dan terus belajar.',
];

const AUDIO_GUIDE_STEPS = [
  'Pilih tempat yang nyaman dan tidak terlalu bising.',
  'Atur posisi tubuh agar Bunda merasa rileks.',
  'Gunakan volume yang nyaman.',
  'Fokuskan perhatian pada suara yang didengarkan.',
  'Berikan waktu kepada diri sendiri tanpa terburu-buru.',
];

export function StagePanel() {
  const {
    session,
    progress,
    moduleStatuses,
    openModuleReader,
    openLoginDialog,
    openAnxietyDialog,
    handleCompleteStage,
    selectStage,
    enterWebApp,
  } = useApp();

  const stages = getStages();
  const modules = getModules();

  const dayInfo = useMemo(() => {
    return getUserDayInfo(session?.id ?? 'guest');
  }, [session?.id, progress?.simulatedDayOffset, progress?.firstLoginAt]);

  const isPosttestCompleted = Boolean(
    progress?.posttestAnxiety && progress?.posttestQuiz
  );

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
  const [startTimeChoice, setStartTimeChoice] = useState<string>(
    progress?.reflectionStartTimeChoice ?? 'Hari ini'
  );
  const [isFullscreenStage, setIsFullscreenStage] = useState(false);

  // Interactive Audio Relaksasi Kecemasan di Level 2
  const [isRelaxAudioPlaying, setIsRelaxAudioPlaying] = useState(false);
  const [relaxAudioSeconds, setRelaxAudioSeconds] = useState(0);
  const RELAX_AUDIO_DURATION = 60;
  const relaxTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRelaxAudioPlaying) {
      relaxTimerRef.current = setInterval(() => {
        setRelaxAudioSeconds((prev) => {
          if (prev + 1 >= RELAX_AUDIO_DURATION) {
            clearInterval(relaxTimerRef.current as NodeJS.Timeout);
            setIsRelaxAudioPlaying(false);
            return RELAX_AUDIO_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (relaxTimerRef.current) {
      clearInterval(relaxTimerRef.current);
    }
    return () => {
      if (relaxTimerRef.current) clearInterval(relaxTimerRef.current);
    };
  }, [isRelaxAudioPlaying]);

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
    const trackerEl = document.getElementById('stage-tracker-section');
    if (trackerEl) {
      trackerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --------------------------------------------------------------------------
  // LEVEL 1: MATERI (4 Modul Masa Nifas Bertahap)
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
              {completedModulesCount} / {modules.length} Materi Selesai
            </span>
          </div>
        </div>

        {/* Daftar Berbaris 4 Materi di dalam Panel Level 1 */}
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
                      Materi {mod.order} • {mod.readingTimeMinutes}{' '}
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
                  <p className="mt-0.5 text-xs text-[#6E6A6C] line-clamp-2">
                    {mod.summary}
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

        {/* Jika semua 4 materi selesai, tampilkan tombol lanjut ke Level 2: Refleksi Diri dan Tips */}
        {allModulesDone && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#E4EAC9] bg-[#F7F9EE] p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-[#56632A]" />
              <div>
                <p className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                  Semua 4 materi pada Level 1 telah selesai dibaca!
                </p>
                <p className="text-xs sm:text-sm text-[#6E6A6C]">
                  Level 2 (Refleksi Diri dan Tips) kini sudah terbuka untuk Bunda.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => scrollToTrackerAndAdvance('tahap-3')}
              className="inline-flex min-h-[44px] w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#C84B71] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#b23b60] cursor-pointer"
            >
              <span>Lanjut ke Level 2: Refleksi Diri &amp; Tips</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  const stageModalClass = isFullscreenStage
    ? 'fixed inset-0 z-50 overflow-y-auto bg-[#FFFAF0] p-4 sm:p-8'
    : 'scroll-mt-24 rounded-[26px] border border-[#ECE7F2] bg-white p-5 shadow-2xs sm:p-7';

  // --------------------------------------------------------------------------
  // LEVEL 2: REFLEKSI DIRI DAN TIPS MENGHADAPI KECEMASAN ('tahap-3')
  // --------------------------------------------------------------------------
  if (activeStageId === 'tahap-3') {
    const prompts = currentStage.prompts ?? [];
    const evalPrompts = currentStage.evaluationPrompts ?? [];

    return (
      <div id="stage-panel-anchor" className={stageModalClass}>
        <div
          className={
            isFullscreenStage
              ? 'mx-auto max-w-4xl rounded-[28px] border border-pink-100 bg-white p-6 shadow-md sm:p-9 space-y-7'
              : 'space-y-7'
          }
        >
          {/* Header Level 2 */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0ECF5] pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE8EE] px-3.5 py-1 text-xs font-bold text-[#C84B71] mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>LEVEL 2 • REFLEKSI DIRI DAN TIPS</span>
              </span>
              <h3 className="font-heading text-xl font-bold text-[#2A2D22] sm:text-2xl">
                YUK, KENALI PERASAANMU! 🌷
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-[#C84B71]">
                Refleksi diri dan tips menghadapi kecemasan
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

          {/* =================================================================
              BAGIAN 1: REFLEKSI DIRI (CHECKLIST USAHA & RENCANA LANGKAH BUNDA)
             ================================================================= */}
          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#E4EAC9] bg-[#FBFDF7] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                    Refleksi Diri • Bagian 1
                  </span>
                  <h4 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                    Checklist usaha Bunda
                  </h4>
                </div>
                <span className="rounded-full bg-[#EBF3D8] px-3 py-1 text-xs font-bold text-[#56632A]">
                  {reflectionItems.length} / {prompts.length} dicentang
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5F5B5D] mb-3.5">
                Centang hal-hal yang pernah Bunda lakukan. Bunda tidak harus melakukan semuanya:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
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
                      className={`flex min-h-[48px] w-full items-start gap-3 rounded-2xl border p-3.5 text-left text-xs sm:text-[13px] transition-all cursor-pointer ${
                        checked
                          ? 'border-[#56632A] bg-[#F2F7E4] text-[#2A2D22] font-semibold shadow-2xs'
                          : 'border-[#E6EBE0] bg-white text-[#2A2D22] hover:bg-[#F7F9EE]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          checked
                            ? 'border-[#56632A] bg-[#56632A] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                      </span>
                      <span className="leading-relaxed">{prompt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rencana langkah Bunda */}
            {evalPrompts.length > 0 && (
              <div className="rounded-[24px] border border-[#F5DCE4] bg-[#FFF9FB] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                      Refleksi Diri • Bagian 2
                    </span>
                    <h4 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                      Rencana langkah Bunda
                    </h4>
                  </div>
                  <span className="rounded-full bg-[#FCE8EE] px-3 py-1 text-xs font-bold text-[#C84B71]">
                    {evaluationItems.length}/{evalPrompts.length} dipilih
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5F5B5D] mb-3.5">
                  Pilih rencana yang ingin Bunda coba. Mulailah dari langkah kecil yang paling mungkin dilakukan.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
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
                        className={`flex min-h-[48px] w-full items-start gap-3 rounded-2xl border p-3.5 text-left text-xs sm:text-[13px] transition-all cursor-pointer ${
                          checked
                            ? 'border-[#C84B71] bg-[#FDF0F4] text-[#2A2D22] font-semibold shadow-2xs'
                            : 'border-[#F2E2E8] bg-white text-[#2A2D22] hover:bg-[#FFF5F8]'
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
                        <span className="leading-relaxed">{prompt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Kapan Bunda ingin mulai melakukannya? */}
                <div className="mt-5 pt-4 border-t border-[#F5DCE4]">
                  <p className="text-xs sm:text-sm font-bold text-[#2A2D22] mb-2.5">
                    Kapan Bunda ingin mulai melakukannya?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {START_TIME_OPTIONS.map((opt) => {
                      const active = startTimeChoice === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setStartTimeChoice(opt)}
                          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            active
                              ? 'border-[#C84B71] bg-[#C84B71] text-white shadow-xs'
                              : 'border-[#ECE7F2] bg-white text-[#4A4748] hover:border-[#F0B8C8]'
                          }`}
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =================================================================
              BAGIAN 2: TIPS MENGHADAPI KECEMASAN
             ================================================================= */}
          <div className="space-y-5 pt-2">
            <div className="border-b border-[#F0ECF5] pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                Panduan Praktis Harian
              </span>
              <h4 className="font-heading text-lg sm:text-xl font-bold text-[#2A2D22]">
                Tips Menghadapi Kecemasan
              </h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* 1. Teknik Relaksasi: Pernapasan Dalam */}
              <div className="rounded-[24px] border border-[#E4EAC9] bg-[#F9FBF4] p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EBF3D8] text-[#56632A]">
                    <Wind className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                      Teknik Relaksasi 1
                    </span>
                    <h5 className="font-heading text-base font-bold text-[#2A2D22]">
                      Pernapasan Dalam
                    </h5>
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] text-[#5F5B5D] leading-relaxed">
                  Luangkan beberapa menit setiap hari untuk menenangkan pikiran dan tubuh Bunda.
                </p>
                <div className="rounded-2xl bg-white border border-[#E6EBE0] p-4 space-y-2">
                  <p className="text-xs font-bold text-[#2A2D22]">Cara melakukannya:</p>
                  <ol className="space-y-1.5 text-xs text-[#4A4748]">
                    {BREATHING_STEPS.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EBF3D8] text-[11px] font-bold text-[#56632A]">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* 2. Teknik Relaksasi: Afirmasi Positif */}
              <div className="rounded-[24px] border border-[#F5DCE4] bg-[#FFF8FA] p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FCE8EE] text-[#C84B71]">
                    <Heart className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                      Teknik Relaksasi 2
                    </span>
                    <h5 className="font-heading text-base font-bold text-[#2A2D22]">
                      Afirmasi Positif
                    </h5>
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] text-[#5F5B5D] leading-relaxed">
                  Bunda juga dapat menenangkan pikiran dengan mengucapkan kalimat positif kepada diri sendiri. Coba ucapkan perlahan:
                </p>
                <div className="space-y-2">
                  {POSITIVE_AFFIRMATIONS.map((sentence, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl bg-white border border-[#F5DCE4] px-3.5 py-2.5 text-xs font-semibold text-[#2A2D22]"
                    >
                      <span className="text-[#C84B71] shrink-0">🌷</span>
                      <span className="italic leading-relaxed">&ldquo;{sentence}&rdquo;</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Audio Relaksasi Kecemasan */}
            <div className="rounded-[24px] border border-amber-200/90 bg-gradient-to-br from-[#FFFDF7] via-[#FFF9EB] to-[#FEF3C7]/60 p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-[#B45309]">
                    <Headphones className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                      Teknik Relaksasi 3 • Audio Relaksasi
                    </span>
                    <h5 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                      Audio Relaksasi Kecemasan
                    </h5>
                    <p className="text-xs font-medium text-[#92400E]">
                      Dengarkan, tenangkan pikiran, dan berikan waktu untuk diri sendiri
                    </p>
                  </div>
                </div>

                {/* Tombol Putar Audio Relaksasi */}
                <button
                  type="button"
                  onClick={() => {
                    if (relaxAudioSeconds >= RELAX_AUDIO_DURATION) {
                      setRelaxAudioSeconds(0);
                      setIsRelaxAudioPlaying(true);
                    } else {
                      setIsRelaxAudioPlaying((p) => !p);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#B45309] hover:bg-[#92400E] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  {isRelaxAudioPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Jeda Audio ({relaxAudioSeconds}s / {RELAX_AUDIO_DURATION}s)</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 ml-0.5" />
                      <span>
                        {relaxAudioSeconds > 0
                          ? `Lanjutkan Audio (${relaxAudioSeconds}s)`
                          : 'Putar Audio Relaksasi'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-[13px] text-[#5F5B5D] leading-relaxed">
                Terkadang, Bunda hanya membutuhkan waktu sejenak untuk beristirahat dari berbagai pikiran dan aktivitas. Bunda dapat mendengarkan audio ketika bayi sedang tidur, saat beristirahat, atau ketika mulai merasa khawatir.
              </p>

              <div className="rounded-2xl bg-white/90 border border-amber-200/80 p-4 space-y-2">
                <p className="text-xs font-bold text-[#78350F]">
                  Panduan singkat sebelum mendengarkan audio:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4A4748]">
                  {AUDIO_GUIDE_STEPS.map((guide, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-[#B45309] mt-0.5">
                        {i + 1}
                      </span>
                      <span>{guide}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Dukungan Suami (Dilengkapi Take Selfie) & 5. Kapan Bunda Perlu Meminta Bantuan? */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Dukungan Suami + Take Selfie ("Abadikan Momen Nifas Bersama Pasangan") */}
              <div className="rounded-[24px] border border-[#ECE7F2] bg-[#FAF8FC] p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FCE8EE] text-[#C84B71]">
                      <Users className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                        Dukungan Suami
                      </span>
                      <h5 className="font-heading text-base font-bold text-[#2A2D22]">
                        Bunda tidak sendirian, ada Ayah yang siap mendampingi!
                      </h5>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#5F5B5D] leading-relaxed">
                    Dukungan suami memiliki peran penting dalam membantu ibu menjalani masa nifas. Setelah melahirkan, Bunda membutuhkan dukungan emosional, perhatian, dan bantuan dalam merawat bayi. Kehadiran suami dapat membuat Bunda merasa lebih dihargai, didengarkan, dan tidak menghadapi berbagai perubahan seorang diri.
                  </p>
                </div>

                {/* Take Selfie Dicantumkan di Dukungan Suami */}
                <div className="rounded-2xl border border-pink-200 bg-gradient-to-r from-[#FDF2F5] via-[#FFF6F9] to-[#F5F8EB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C84B71] text-white shadow-2xs">
                      <Camera className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading text-sm font-bold text-[#2A2D22]">
                        Abadikan Momen Nifas Bersama Pasangan
                      </p>
                      <p className="text-[11px] text-[#6E6A6C]">
                        Gunakan fitur Take Selfie dengan bingkai khusus &amp; panduan pose berdua.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullscreenStage(false);
                      enterWebApp('selfie');
                    }}
                    className="inline-flex min-h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#C84B71] hover:bg-[#b23b60] px-4 py-2 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Take Selfie</span>
                  </button>
                </div>
              </div>

              {/* Kapan Bunda Perlu Meminta Bantuan? */}
              <div className="rounded-[24px] border border-rose-200 bg-[#FFF5F7] p-5 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-[#C84B71]">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                      Tanda Perlu Konsultasi
                    </span>
                    <h5 className="font-heading text-base font-bold text-[#2A2D22]">
                      Kapan Bunda Perlu Meminta Bantuan?
                    </h5>
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] text-[#5F5B5D] leading-relaxed">
                  Jika rasa cemas terus berlangsung, semakin berat, sulit dikendalikan, atau mulai mengganggu tidur, aktivitas sehari-hari, dan kemampuan merawat bayi, jangan ragu berkonsultasi dengan bidan atau tenaga kesehatan.
                </p>
                <p className="text-xs sm:text-[13px] font-semibold text-[#9F1239] leading-relaxed">
                  Jika Bunda mengalami pikiran untuk menyakiti diri sendiri atau bayi, halusinasi, maupun kebingungan berat, segera minta bantuan orang terdekat dan cari pertolongan medis darurat.
                </p>
                <div className="rounded-xl bg-white border border-rose-200/80 p-3 text-xs font-semibold text-[#C84B71]">
                  Bunda tidak sendirian. Meminta bantuan bukan tanda kelemahan, melainkan bentuk kepedulian terhadap diri sendiri dan buah hati. 💗
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Pribadi Bunda */}
          <div>
            <label
              htmlFor="reflection-note-input"
              className="block text-sm font-bold text-[#2A2D22]"
            >
              Catatan Hangat untuk Diri Sendiri &amp; Buah Hati (Opsional)
            </label>
            <textarea
              id="reflection-note-input"
              rows={2}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="Tuliskan satu kalimat penyemangat untuk diri Bunda hari ini..."
              className="mt-2 w-full rounded-2xl border border-[#ECE7F2] bg-[#FAF8FC] p-3.5 text-xs sm:text-sm text-[#2A2D22] placeholder:text-[#8C8896] focus:border-[#C84B71] focus:bg-white outline-none"
            />
          </div>

          <div className="flex justify-end border-t border-[#F0ECF5] pt-4">
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
                  reflectionStartTimeChoice: startTimeChoice,
                  advanceToNext: true,
                });
              }}
              className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#C84B71] px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-[#b23b60] cursor-pointer"
            >
              <span>
                {currentStage.actionLabel ??
                  'Simpan Refleksi & Buka Bunga Delima (Level 3)'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // LEVEL 3: BUNGA DELIMA ('bunga-delima') -> Menuju Menu Bunga Delima
  // --------------------------------------------------------------------------
  return (
    <div id="stage-panel-anchor" className="scroll-mt-24 space-y-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[26px] border border-[#F2D7E0] bg-gradient-to-r from-[#FFF5F8] via-white to-[#F5F8EB] p-6 shadow-2xs">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C84B71] text-white text-xl shadow-xs">
            🌺
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
              Level 3 &bull; Bunga Delima
            </span>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-[#2A2D22]">
              Kebun Bunga Delima Buna Ceria
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-[#5F5B5D] max-w-2xl">
              Tumbuhkan benih menjadi Bunga Delima mekar sempurna melalui kegiatan menonton video edukasi, mendengarkan audio relaksasi, dan bermain game tebak gambar kecukupan ASI.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => enterWebApp('tips')}
          className="inline-flex min-h-[44px] w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[#C84B71] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#b23b60] cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Buka Menu Bunga Delima</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Tahap Akhir (Hari ke-7): Post-Test Tingkat Kecemasan PASS + Quiz Pemahaman (20 Soal) */}
      <div
        className={`rounded-[26px] border p-6 transition-all ${
          dayInfo.unlocked.posttestAnxiety
            ? 'border-[#F0C9D5] bg-gradient-to-r from-[#FFF5F8] via-white to-[#FDF4F7] shadow-2xs'
            : 'border-gray-200 bg-gray-50/80'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                dayInfo.unlocked.posttestAnxiety
                  ? 'bg-[#56632A] text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Award className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="rounded-full bg-[#F5F8EB] px-3 py-0.5 text-[11px] font-bold text-[#56632A]">
                  Tahap Akhir &bull; Hari ke-7
                </span>
                {isPosttestCompleted ? (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold text-green-800">
                    Selesai Dikerjakan (1x)
                  </span>
                ) : dayInfo.unlocked.posttestAnxiety ? (
                  <span className="rounded-full bg-[#FCE8EE] px-2.5 py-0.5 text-[11px] font-bold text-[#C84B71]">
                    Terbuka Hari Ini
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">
                    <Lock className="h-3 w-3" /> Terbuka di Hari ke-7
                  </span>
                )}
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                Post-Test Tingkat Kecemasan PASS (31 Pertanyaan) &amp; Quiz Pemahaman (20 Pertanyaan)
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-[#5F5B5D]">
                Pada tahap akhir (Hari ke-7), Bunda mengerjakan Post-Test Skrining Kecemasan PASS beserta 20 soal Quiz Pemahaman (hanya dapat dikerjakan 1 kali).
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isPosttestCompleted ? (
              <button
                type="button"
                onClick={() => enterWebApp('hasil')}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#F5F8EB] border border-[#C5D49B] px-5 text-xs font-bold text-[#56632A] cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Buka Halaman Hasil Saya</span>
              </button>
            ) : dayInfo.unlocked.posttestAnxiety ? (
              <button
                type="button"
                onClick={() => {
                  if (!session) openLoginDialog();
                  else openAnxietyDialog('posttest');
                }}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#C84B71] px-6 text-xs font-bold text-white hover:bg-[#B23B60] shadow-xs transition-colors cursor-pointer"
              >
                <span>Mulai Post-Test &amp; Quiz Hari ke-7</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-gray-200 px-5 text-xs font-bold text-gray-500 cursor-not-allowed"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Terbuka di Hari ke-7</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

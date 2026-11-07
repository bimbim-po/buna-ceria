'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Lock, Sparkles } from 'lucide-react';
import { getStages } from '@/lib/api';
import { uiContent } from '@/data/uiContent';
import { useApp } from '@/context/AppContext';
import { StageId } from '@/types';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PETAL_VECTORS = [
  { x: -22, y: -18, rot: -25 },
  { x: 0, y: -26, rot: 10 },
  { x: 22, y: -18, rot: 35 },
  { x: -24, y: 12, rot: -45 },
  { x: 24, y: 12, rot: 45 },
  { x: 0, y: 24, rot: 15 },
];

interface StageTrackerProps {
  previewLockedOnly?: boolean;
  onAfterSelectStage?: (stageId: StageId) => void;
}

// Item 13 & User Flow No. 5-6:
// Fitur tahapan pembelajaran bertahap (4 level menggunakan elemen bulat untuk setiap level
// dan menggunakan garis penghubung: Materi -> Quiz -> Tahap 3 -> Hasil Saya).
export function StageTracker({
  previewLockedOnly = false,
  onAfterSelectStage,
}: StageTrackerProps) {
  const {
    progress,
    stageStatuses,
    selectStage,
    lockedNotice,
    triggerLockedNotice,
  } = useApp();

  const prefersReducedMotion = useReducedMotion();
  const [shakingStageId, setShakingStageId] = useState<StageId | null>(null);

  const stages = getStages();
  const activeStageId = progress?.activeStageId ?? 'materi';

  const handleStageClick = (stageId: StageId, isLocked: boolean) => {
    if (previewLockedOnly) return;
    if (isLocked) {
      setShakingStageId(stageId);
      window.setTimeout(() => setShakingStageId(null), 260);
      triggerLockedNotice(uiContent.learningSection.lockedStageHint);
      return;
    }
    const changed = selectStage(stageId);
    if (changed) {
      onAfterSelectStage?.(stageId);
      const panelEl = document.getElementById('stage-panel-anchor');
      if (panelEl) {
        panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-2">
        <ol
          aria-label="4 Level Tahapan Pembelajaran Buna Ceria"
          className="mx-auto flex min-w-[320px] max-w-3xl items-start justify-between gap-2 px-2 pt-3 sm:gap-4"
        >
          {stages.map((stage, idx) => {
            const status = previewLockedOnly
              ? idx === 0
                ? 'terbuka'
                : 'terkunci'
              : stageStatuses[stage.id];
            const isLocked = status === 'terkunci';
            const isCompleted = status === 'selesai';
            const isOpen = status === 'terbuka';
            const isActive = !previewLockedOnly && activeStageId === stage.id;
            const isShaking = shakingStageId === stage.id;

            return (
              <li
                key={stage.id}
                className="relative flex flex-1 flex-col items-center text-center"
              >
                {/* GARIS PENGHUBUNG ANTAR ELEMEN BULAT LEVEL (Item 13) */}
                {idx < stages.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-7 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-1.5 overflow-hidden rounded-full bg-[#EAE6EE]"
                  >
                    <motion.div
                      initial={false}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: CUSTOM_EASE }}
                      className="h-full w-full origin-left bg-[#A8B371]"
                    />
                  </div>
                )}

                {/* WADAH ELEMEN BULAT LEVEL */}
                <div className="relative flex items-center justify-center">
                  {isCompleted && !prefersReducedMotion && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                      {PETAL_VECTORS.map((vec, pIdx) => (
                        <motion.span
                          key={pIdx}
                          initial={{ opacity: 0.95, x: 0, y: 0, scale: 0.4 }}
                          animate={{
                            opacity: 0,
                            x: vec.x,
                            y: vec.y,
                            scale: 1,
                            rotate: vec.rot,
                          }}
                          transition={{ duration: 0.75, ease: CUSTOM_EASE }}
                          className="absolute h-2.5 w-2 rounded-full bg-[#F5AFB9] border border-[#C84B71]/40"
                        />
                      ))}
                    </div>
                  )}

                  {/* TOMBOL BULATAN LEVEL */}
                  <motion.button
                    type="button"
                    onClick={() => handleStageClick(stage.id, isLocked)}
                    aria-disabled={isLocked || previewLockedOnly}
                    aria-current={isActive ? 'step' : undefined}
                    whileHover={
                      !isLocked && !previewLockedOnly
                        ? {
                            scale: 1.08,
                            transition: {
                              type: 'spring',
                              stiffness: 450,
                              damping: 20,
                            },
                          }
                        : {}
                    }
                    whileTap={
                      !isLocked && !previewLockedOnly ? { scale: 0.94 } : {}
                    }
                    animate={
                      isShaking && !prefersReducedMotion
                        ? { x: [0, -6, 6, -4, 4, 0] }
                        : { x: 0 }
                    }
                    transition={{ duration: 0.2 }}
                    title={
                      isLocked
                        ? uiContent.learningSection.lockedStageHint
                        : `Level ${stage.order}: ${stage.shortTitle} — ${
                            isCompleted
                              ? 'Selesai'
                              : isOpen
                              ? 'Terbuka'
                              : 'Terkunci'
                          }`
                    }
                    className={`relative z-10 flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-full border-2 font-heading text-base font-extrabold transition-all duration-300 ${
                      isCompleted
                        ? 'border-[#56632A] bg-[#A8B371] text-white shadow-sm cursor-pointer'
                        : isOpen
                        ? 'border-[#C84B71] bg-[#F5AFB9] text-[#2A2D22] shadow-sm cursor-pointer'
                        : 'border-[#E0DCE6] bg-[#F5F3F7] text-[#9E9AA8] cursor-not-allowed'
                    } ${
                      isActive
                        ? 'ring-4 ring-[#F5AFB9]/45 ring-offset-2 ring-offset-white scale-105'
                        : ''
                    }`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isCompleted ? (
                        <motion.span
                          key="completed"
                          initial={
                            prefersReducedMotion
                              ? { opacity: 0 }
                              : { scale: 0.4, opacity: 0 }
                          }
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Check
                            className="h-6 w-6 text-white"
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                        </motion.span>
                      ) : isLocked ? (
                        <motion.span
                          key="locked"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center"
                        >
                          <Lock
                            className="h-4 w-4 text-[#9E9AA8]"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="open"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-heading text-lg font-extrabold text-[#2A2D22]"
                        >
                          {stage.order}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Label Level & Nama Tahap */}
                <span className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-[#8C8896]">
                  Level {stage.order}
                </span>
                <span
                  className={`mt-0.5 px-1 font-heading text-xs sm:text-sm font-bold leading-tight ${
                    isActive
                      ? 'text-[#C84B71]'
                      : isCompleted
                      ? 'text-[#56632A]'
                      : isOpen
                      ? 'text-[#2A2D22]'
                      : 'text-[#8C8896]'
                  }`}
                >
                  {stage.shortTitle}
                </span>

                {/* Status Badge */}
                <span
                  className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    isCompleted
                      ? 'bg-[#EBF3D8] text-[#56632A]'
                      : isOpen
                      ? 'bg-[#FDF2F5] text-[#C84B71]'
                      : 'bg-gray-100 text-[#8C8896]'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Check className="h-3 w-3" strokeWidth={2.2} />
                      <span>Selesai</span>
                    </>
                  ) : isOpen ? (
                    <span>Terbuka</span>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" strokeWidth={2} />
                      <span>Terkunci</span>
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Pemberitahuan lembut ketika menekan bulatan level yang masih terkunci */}
      <AnimatePresence>
        {lockedNotice && !previewLockedOnly && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: CUSTOM_EASE }}
            className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 rounded-full border border-pink-200 bg-[#FDF2F5] px-5 py-2 text-center text-xs sm:text-sm font-bold text-[#C84B71] shadow-2xs"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-[#C84B71]" />
            <span>{lockedNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

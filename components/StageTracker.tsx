'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, CircleDot, Lock, Sparkles } from 'lucide-react';
import { getStages } from '@/lib/api';
import { uiContent } from '@/data/uiContent';
import { useApp } from '@/context/AppContext';
import { StageId } from '@/types';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Koordinat 6 kelopak bunga sakura kecil saat bulatan selesai (< 1 detik)
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
}

export function StageTracker({ previewLockedOnly = false }: StageTrackerProps) {
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
      window.setTimeout(() => setShakingStageId(null), 240);
      triggerLockedNotice(uiContent.learningSection.lockedStageHint);
      return;
    }
    const changed = selectStage(stageId);
    if (changed) {
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
          aria-label="Tahapan belajar Teman Kasih"
          className="mx-auto flex min-w-[320px] max-w-3xl items-start justify-between gap-1 px-2 pt-3 sm:gap-2"
        >
          {stages.map((stage, idx) => {
            const status = previewLockedOnly
              ? 'terkunci'
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
                {/* Garis Penghubung Antar Bulatan (Terisi Halus Saat Tahap Selesai) */}
                {idx < stages.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-6 left-[calc(50%+26px)] right-[calc(-50%+26px)] h-1 overflow-hidden rounded-full bg-locked-border"
                  >
                    <motion.div
                      initial={false}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: CUSTOM_EASE }}
                      className="h-full w-full origin-left bg-green-500"
                    />
                  </div>
                )}

                {/* Wadah Bulatan + Percikan Kelopak Pink Saat Selesai */}
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
                          className="absolute h-2.5 w-2 rounded-full bg-pink-500 border border-pink-700/40"
                        />
                      ))}
                    </div>
                  )}

                  {/* Tombol Bulatan Tahap */}
                  <motion.button
                    type="button"
                    onClick={() => handleStageClick(stage.id, isLocked)}
                    aria-disabled={isLocked || previewLockedOnly}
                    aria-current={isActive ? 'step' : undefined}
                    whileHover={
                      !isLocked && !previewLockedOnly
                        ? { scale: 1.08, transition: { type: 'spring', stiffness: 450, damping: 20 } }
                        : {}
                    }
                    whileTap={
                      !isLocked && !previewLockedOnly
                        ? { scale: 0.94 }
                        : {}
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
                        : `${stage.title} — ${
                            isCompleted
                              ? 'Selesai'
                              : isOpen
                              ? 'Aktif'
                              : 'Terkunci'
                          }`
                    }
                    className={`relative z-10 flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-2 font-heading text-base font-bold transition-colors duration-300 ${
                      isCompleted
                        ? 'border-green-700 bg-green-500 text-ink shadow-green-soft cursor-pointer'
                        : isOpen
                        ? 'stage-active-ring border-pink-700 bg-pink-500 text-ink shadow-pink-soft cursor-pointer'
                        : 'border-locked-border bg-locked-bg text-locked-text cursor-not-allowed'
                    } ${
                      isActive
                        ? 'ring-4 ring-pink-100 ring-offset-2 ring-offset-surface'
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
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 18,
                          }}
                        >
                          <Check
                            className="h-5 w-5 text-ink"
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        </motion.span>
                      ) : isLocked ? (
                        <motion.span
                          key="locked"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            prefersReducedMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: -10 }
                          }
                          transition={{ duration: 0.25, ease: CUSTOM_EASE }}
                        >
                          <Lock
                            className="h-4 w-4 text-locked-text"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="open"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, ease: CUSTOM_EASE }}
                        >
                          <CircleDot
                            className="h-5 w-5 text-ink"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Label Nama Tahap */}
                <span
                  className={`mt-2.5 px-1 font-heading text-sm font-bold leading-tight ${
                    isActive
                      ? 'text-pink-700'
                      : isCompleted
                      ? 'text-green-700'
                      : isOpen
                      ? 'text-ink'
                      : 'text-ink-muted'
                  }`}
                >
                  {stage.shortTitle}
                </span>

                {/* Status selalu menyertakan ikon + label teks (minimal 14px / text-xs-sm) */}
                <span
                  className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isCompleted
                      ? 'bg-green-100 text-green-700'
                      : isOpen
                      ? 'bg-pink-100 text-pink-700'
                      : 'bg-locked-bg text-ink-muted'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Check
                        className="h-3 w-3"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>Selesai</span>
                    </>
                  ) : isOpen ? (
                    <>
                      <CircleDot
                        className="h-3 w-3"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>Aktif</span>
                    </>
                  ) : (
                    <>
                      <Lock
                        className="h-3 w-3"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>Terkunci</span>
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Petunjuk ketika pengguna menekan bulatan yang masih terkunci */}
      <AnimatePresence>
        {lockedNotice && !previewLockedOnly && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: CUSTOM_EASE }}
            className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-5 py-2.5 text-center text-sm font-semibold text-pink-700 shadow-pink-soft"
          >
            <Sparkles
              className="h-4 w-4 shrink-0 text-pink-700"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>{lockedNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

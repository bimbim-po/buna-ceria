'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookMarked, ChevronDown } from 'lucide-react';
import { ReferenceItem } from '@/types';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ReferenceListProps {
  references: ReferenceItem[];
}

export function ReferenceList({ references }: ReferenceListProps) {
  const [openIds, setOpenIds] = useState<string[]>([references[0]?.id ?? '']);
  const prefersReducedMotion = useReducedMotion();

  const toggleReference = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-3">
      {references.map((ref, index) => {
        const isOpen = openIds.includes(ref.id);
        const panelId = `reference-panel-${ref.id}`;
        const buttonId = `reference-btn-${ref.id}`;

        return (
          <div
            key={ref.id}
            className="card-lift overflow-hidden rounded-[24px] border border-pink-100 bg-surface"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleReference(ref.id)}
                className="flex min-h-[60px] w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-pink-50/50 cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-pink-100 bg-pink-50 font-heading text-sm font-bold text-pink-700">
                    {index + 1}
                  </span>
                  <div>
                    <span className="block font-heading text-lg font-bold text-ink">
                      {ref.title}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium text-ink-muted">
                      {ref.author} ({ref.year})
                    </span>
                  </div>
                </div>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-pink-700' : ''
                  }`}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, height: 0 }
                  }
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, height: 0 }
                  }
                  transition={{ duration: 0.28, ease: CUSTOM_EASE }}
                  className="overflow-hidden border-t border-pink-100 bg-page"
                >
                  <div className="flex items-start gap-3 px-5 py-4 text-sm leading-relaxed text-ink-muted">
                    <BookMarked
                      className="mt-0.5 h-4 w-4 shrink-0 text-green-700"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-ink">
                        Sumber: <span className="font-normal">{ref.source}</span>
                      </p>
                      <p className="mt-1.5 text-ink-muted">
                        {ref.summaryNote}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ReferenceItem } from '@/types';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ReferenceListProps {
  references: ReferenceItem[];
}

export function ReferenceList({ references }: ReferenceListProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const toggleReference = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-2.5">
      {references.map((ref, index) => {
        const isOpen = openIds.includes(ref.id);
        const panelId = `reference-panel-${ref.id}`;
        const buttonId = `reference-btn-${ref.id}`;

        return (
          <div
            key={ref.id}
            className="overflow-hidden rounded-2xl border border-[#F5E4EA] bg-[#FFFDFD] transition-colors hover:border-[#EBB8C8]"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleReference(ref.id)}
                className="flex min-h-[46px] w-full items-center justify-between gap-3 px-4 py-2.5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FCEBEF] font-sans text-xs font-bold text-[#E46C8E]">
                    {index + 1}
                  </span>
                  <span className="truncate font-sans text-xs sm:text-[13px] font-medium text-[#2A2D22]">
                    {ref.title}
                  </span>
                </div>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[#9E989A] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#E46C8E]' : ''
                  }`}
                  strokeWidth={1.8}
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
                  transition={{ duration: 0.24, ease: CUSTOM_EASE }}
                  className="overflow-hidden border-t border-[#F5E4EA] bg-[#FAF7F8]"
                >
                  <div className="px-4 py-3 text-xs leading-relaxed text-[#6E6A6C] space-y-1">
                    <p className="font-semibold text-[#2A2D22]">
                      {ref.author} ({ref.year}) — <span className="font-normal">{ref.source}</span>
                    </p>
                    <p>{ref.summaryNote}</p>
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

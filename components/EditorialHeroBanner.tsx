'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface EditorialHeroBannerProps {
  /** The huge uppercase background typography that sits behind the character */
  bgText: string;
  /** Cutout transparent image source of the centered character */
  characterSrc: string;
  characterAlt: string;
  /** Micro-badge pill on the left side of the character */
  leftBadge?: {
    icon: React.ReactNode;
    label: string;
  };
  /** Micro-badge pill on the right side of the character */
  rightBadge?: {
    icon: React.ReactNode;
    label: string;
  };
  /** Uppercase mission/subheading text on the bottom-left */
  subtitle: string;
  /** Interactive button pill on the bottom-right */
  actionButton?: {
    label: string;
    onClick?: () => void;
  };
  /** Tailwind gradient or background classes */
  bgGradientClass: string;
  /** Custom shadow class for depth */
  shadowClass?: string;
  /** Optional container height */
  containerHeightClass?: string;
}

export function EditorialHeroBanner({
  bgText,
  characterSrc,
  characterAlt,
  leftBadge,
  rightBadge,
  subtitle,
  actionButton,
  bgGradientClass,
  shadowClass = 'shadow-[0_16px_40px_rgba(0,0,0,0.18)]',
  containerHeightClass = 'min-h-[220px] sm:min-h-[260px] lg:min-h-[290px]',
}: EditorialHeroBannerProps) {
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-[26px] sm:rounded-[32px] ${bgGradientClass} p-5 sm:p-7 lg:p-8 text-white ${shadowClass} ${containerHeightClass}`}
    >
      {/* 1. HUGE BACKGROUND TYPOGRAPHY (Sitting deeply behind the character) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span className="font-sans font-black tracking-tighter uppercase text-white/16 whitespace-nowrap text-[2.8rem] xs:text-[3.6rem] sm:text-[5.4rem] md:text-[6.8rem] lg:text-[8.5rem] leading-none transition-all">
          {bgText}
        </span>
      </div>

      {/* 2. FLOATING MICRO-BADGES (Left & Right of character) */}
      <div className="relative z-20 flex items-center justify-between pointer-events-none">
        {leftBadge ? (
          <div className="pointer-events-auto hidden sm:inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/20 shadow-sm transition-transform hover:scale-105">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-white">
              {leftBadge.icon}
            </span>
            <span>{leftBadge.label}</span>
          </div>
        ) : (
          <div />
        )}

        {rightBadge ? (
          <div className="pointer-events-auto hidden sm:inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/20 shadow-sm transition-transform hover:scale-105">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-white">
              {rightBadge.icon}
            </span>
            <span>{rightBadge.label}</span>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* 3. CENTER OVERLAPPING CHARACTER (Waist-up cutout with soft natural shadow) */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 flex items-end justify-center h-[82%] sm:h-[90%] lg:h-[96%] w-auto">
        <Image
          src={characterSrc}
          alt={characterAlt}
          width={600}
          height={600}
          priority
          className="h-full w-auto max-h-full object-contain object-bottom drop-shadow-[0_14px_30px_rgba(0,0,0,0.38)]"
        />
      </div>

      {/* 4. BOTTOM AREA: Subtitle & Action Button */}
      <div className="relative z-20 mt-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-4">
        <p className="max-w-[270px] sm:max-w-[360px] text-[10.5px] sm:text-xs font-medium uppercase tracking-wider text-white/85 leading-relaxed drop-shadow-xs">
          {subtitle}
        </p>

        {actionButton && (
          <button
            type="button"
            onClick={actionButton.onClick}
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#2A2D22] shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:bg-[#FDF8FA] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>{actionButton.label}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2A2D22] text-white">
              <ArrowRight className="h-3 w-3" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface EditorialHeroBannerProps {
  /** The huge uppercase background typography that sits behind the character */
  bgText: string;
  /** Cutout transparent image source of the centered character (fallback) */
  characterSrc?: string;
  characterAlt?: string;
  /** Pre-rendered full photographic landscape banner asset (from client) */
  bannerImageSrc?: string;
  /** Micro-badge pill on the left side of the character */
  leftBadge?: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  };
  /** Micro-badge pill on the right side of the character */
  rightBadge?: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  };
  /** Uppercase mission/subheading text on the bottom-left */
  subtitle: string;
  /** Render live subtitle overlay on bottom-left of photographic banner */
  showLiveSubtitle?: boolean;
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
  /** Warna aksen tombol aksi (teks tombol putih) — mengikuti palet tiap banner */
  accentColor?: string;
}

export function EditorialHeroBanner({
  bgText,
  characterSrc,
  characterAlt,
  bannerImageSrc,
  leftBadge,
  rightBadge,
  subtitle,
  showLiveSubtitle = false,
  actionButton,
  bgGradientClass,
  shadowClass = 'shadow-[0_6px_20px_rgba(40,40,60,0.06),0_1px_4px_rgba(40,40,60,0.03)]',
  containerHeightClass = 'min-h-[220px] sm:min-h-[260px] lg:min-h-[290px]',
  accentColor = '#2A2D22',
}: EditorialHeroBannerProps) {
  if (bannerImageSrc) {
    // Banner fotografi sudah bersih dari tombol/badge raster bawaan gambar.
    // Seluruh badge & tombol aksi dirender sebagai elemen HTML/CSS vektor asli
    // agar tajam di semua resolusi, interaktif, dan menampilkan data secara live.
    return (
      <div className="w-full">
        <div
          className={`page-hero relative w-full overflow-hidden rounded-[12px] sm:rounded-[18px] md:rounded-[22px] lg:rounded-[28px] ${shadowClass} select-none`}
        >
          <Image
            src={bannerImageSrc}
            alt={characterAlt || bgText}
            width={1415}
            height={420}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1480px"
            priority
            className="block h-auto w-full object-contain object-center"
          />

          {/* Top-left badge (Tablet & Desktop) */}
          {leftBadge && (
            <span className="absolute left-[3.2%] top-[7.5%] hidden sm:inline-flex items-center gap-2 rounded-full bg-white/14 px-3.5 py-1.5 text-[11px] md:text-xs font-medium tracking-wide text-white/95 ring-1 ring-white/22 backdrop-blur-md">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-white">
                {leftBadge.icon}
              </span>
              <span>{leftBadge.label}</span>
            </span>
          )}

          {/* Top-right live status badge (Tablet & Desktop) */}
          {rightBadge && (
            <span className="absolute right-[2.6%] top-[7.5%] hidden sm:inline-flex items-center gap-2 rounded-full bg-black/22 px-3.5 py-1.5 text-[11px] md:text-xs font-medium tracking-wide text-white/95 ring-1 ring-white/20 backdrop-blur-md">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-white">
                {rightBadge.icon}
              </span>
              <span>{rightBadge.label}</span>
            </span>
          )}

          {/* Bottom-left live subtitle overlay (when raster text is cleaned) */}
          {showLiveSubtitle && subtitle && (
            <p className="pointer-events-none absolute left-[3.2%] bottom-[6.5%] hidden sm:block max-w-[38%] md:max-w-[40%] text-[10px] md:text-[11.5px] lg:text-[12.5px] font-semibold uppercase tracking-[0.04em] text-white/95 leading-[1.35] drop-shadow-[0_2px_6px_rgba(40,10,20,0.35)]">
              {subtitle}
            </p>
          )}

          {/* Bottom-right tactile editorial CTA button (Tablet & Desktop) */}
          {actionButton && (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="group/cta absolute right-[2.4%] bottom-[7.5%] hidden sm:inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-4 pr-1.5 md:py-2 md:pl-5 md:pr-2 text-xs md:text-[13.5px] font-bold tracking-[-0.01em] text-[#2A2D22] shadow-[0_8px_24px_rgba(0,0,0,0.2)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.26)] active:translate-y-0 active:scale-[0.99] cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
            >
              <span style={{ color: accentColor }}>{actionButton.label}</span>
              <span
                className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover/cta:translate-x-0.5"
                style={{ backgroundColor: accentColor }}
              >
                <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={2.2} />
              </span>
            </button>
          )}
        </div>

        {/* Baris aksi khusus Mobile (< 640px): tidak menutupi foto/teks banner */}
        {(rightBadge || actionButton || (showLiveSubtitle && subtitle)) && (
          <div className="mt-2.5 flex items-center justify-between gap-2.5 rounded-2xl border border-[#F2DCE4] bg-white px-3.5 py-2.5 shadow-[0_4px_14px_rgba(78,30,47,0.04)] sm:hidden">
            {rightBadge ? (
              <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-[#5F5B5D]">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FBEDF1]"
                  style={{ color: accentColor }}
                >
                  {rightBadge.icon}
                </span>
                <span className="truncate">{rightBadge.label}</span>
              </span>
            ) : showLiveSubtitle && subtitle ? (
              <p className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-[#4E3B42]">
                {subtitle}
              </p>
            ) : (
              <span />
            )}
            {actionButton && (
              <button
                type="button"
                onClick={actionButton.onClick}
                className="inline-flex shrink-0 items-center gap-2 rounded-full py-1 pl-3.5 pr-1 text-xs font-semibold text-white shadow-2xs active:scale-[0.98] transition-transform cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                <span>{actionButton.label}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

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
      {characterSrc && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 flex items-end justify-center h-[82%] sm:h-[90%] lg:h-[96%] w-auto">
          <Image
            src={characterSrc}
            alt={characterAlt || ''}
            width={600}
            height={600}
            priority
            className="h-full w-auto max-h-full object-contain object-bottom drop-shadow-[0_14px_30px_rgba(0,0,0,0.38)]"
          />
        </div>
      )}

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

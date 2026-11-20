'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Bookmark,
  Check,
  Copy,
} from 'lucide-react';
import { PregnancyTip } from '@/types';

interface TipCardProps {
  tip: PregnancyTip;
  isSaved: boolean;
  onToggleSave: (tipId: string) => void;
  orderNumber?: number;
}

const TIP_THEMES: Record<
  number,
  {
    stageBg: string;
    accentText: string;
    imageSrc: string;
    imageAlt: string;
  }
> = {
  1: {
    stageBg: 'bg-[#FDF4E5]',
    accentText: 'text-[#9A6418]',
    imageSrc: '/tip-3d-1.webp',
    imageAlt: 'Ilustrasi Matahari Pagi dan Teh Hangat',
  },
  2: {
    stageBg: 'bg-[#EBF4F1]',
    accentText: 'text-[#2D6A5E]',
    imageSrc: '/tip-3d-2.webp',
    imageAlt: 'Ilustrasi Air Lemon Mint Segar',
  },
  3: {
    stageBg: 'bg-[#FBEDF1]',
    accentText: 'text-[#A83A5E]',
    imageSrc: '/tip-3d-3.webp',
    imageAlt: 'Ilustrasi Ibu Hamil Istirahat Nyaman',
  },
  4: {
    stageBg: 'bg-[#FCEEF2]',
    accentText: 'text-[#A83A5E]',
    imageSrc: '/tip-3d-4.webp',
    imageAlt: 'Ilustrasi Obrolan Hangat dengan Pasangan',
  },
  5: {
    stageBg: 'bg-[#F1F4E6]',
    accentText: 'text-[#4F5E24]',
    imageSrc: '/tip-3d-5.webp',
    imageAlt: 'Ilustrasi Buku KIA dan Panduan Medis',
  },
  6: {
    stageBg: 'bg-[#F5EFFB]',
    accentText: 'text-[#6B468A]',
    imageSrc: '/tip-3d-6.webp',
    imageAlt: 'Ilustrasi Jurnal Rasa Syukur dan Afirmasi',
  },
};

export function TipCard({ tip, isSaved, onToggleSave, orderNumber }: TipCardProps) {
  const [copied, setCopied] = useState(false);

  const tipNum = orderNumber ?? (parseInt(tip.id.replace('tip-', ''), 10) || 1);
  const theme = TIP_THEMES[tipNum] || TIP_THEMES[1];
  const tags = tip.tags ?? ['Harian', 'Kesehatan'];

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${tip.title} — ${tip.description}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      aria-label={`Tips: ${tip.title}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[#F0DCE3] bg-white p-4 sm:p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(78,30,47,0.07)]"
    >
      {/* 1. ILLUSTRATION STAGE */}
      <div
        className={`relative flex h-36 w-full items-center justify-center overflow-hidden rounded-[16px] ${theme.stageBg}`}
      >
        <span className="absolute left-3 top-2.5 text-[11px] font-semibold tracking-wide text-[#2A2D22]/55">
          0{tipNum}
        </span>

        <div className="relative h-28 w-28 transition-transform duration-300 group-hover:scale-105">
          <Image
            src={theme.imageSrc}
            alt={theme.imageAlt}
            fill
            sizes="(max-width: 640px) 120px, 150px"
            className="object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.1)]"
            priority={tipNum <= 2}
          />
        </div>

        <button
          type="button"
          onClick={() => onToggleSave(tip.id)}
          aria-label={isSaved ? 'Hapus dari simpanan' : 'Simpan tips kehamilan'}
          title={isSaved ? 'Tersimpan' : 'Simpan tips'}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
            isSaved
              ? 'bg-[#C84B71] text-white shadow-2xs'
              : 'bg-white/85 text-[#6E6A6C] hover:bg-white hover:text-[#C84B71]'
          }`}
        >
          <Bookmark
            className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* 2. CATEGORY & TITLE */}
      <div className="mt-4 flex-1">
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${theme.accentText}`}>
          {tip.category ?? tags[0] ?? 'Tips Harian'}
        </span>
        <h3 className="mt-1 font-heading text-base font-bold leading-snug text-[#2A2D22] line-clamp-2">
          {tip.title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-[#5F5B5D] line-clamp-3">
          {tip.description}
        </p>
      </div>

      {/* 3. QUIET FOOTER */}
      <div className="mt-4 flex items-center justify-between border-t border-[#F4E4EA] pt-3">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex shrink-0 items-center rounded-full bg-[#FAF4F6] px-2.5 py-0.5 text-[10.5px] font-medium text-[#6E6A6C]"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1 text-[11.5px] font-medium text-[#767A6E] hover:text-[#2A2D22] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[#4F5E24]" />
              <span className="text-[#4F5E24] font-semibold">Disalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

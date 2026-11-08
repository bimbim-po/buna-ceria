'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Bookmark,
  Check,
  Copy,
  MoreVertical,
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
    bannerBg: string;
    bannerBorder: string;
    pillBg: string;
    pillText: string;
    imageSrc: string;
    imageAlt: string;
  }
> = {
  1: {
    bannerBg: 'bg-gradient-to-r from-[#F0F7FF] via-[#E8F2FF] to-[#DDEEFF]',
    bannerBorder: 'border-blue-100',
    pillBg: 'bg-[#EBF3FF]',
    pillText: 'text-[#1D4ED8]',
    imageSrc: '/tip-3d-1.webp',
    imageAlt: 'Ilustrasi 3D Matahari Ceria dan Cangkir Teh Hangat Pagi Hari',
  },
  2: {
    bannerBg: 'bg-gradient-to-r from-[#EAF9F6] via-[#E0F6F2] to-[#D6F2EC]',
    bannerBorder: 'border-teal-100',
    pillBg: 'bg-[#E6F8F2]',
    pillText: 'text-[#0F766E]',
    imageSrc: '/tip-3d-2.webp',
    imageAlt: 'Ilustrasi Teko Kaca Air Lemon Mint Segar dan Gelas Dingin',
  },
  3: {
    bannerBg: 'bg-gradient-to-r from-[#FAF5FF] via-[#F3EBFD] to-[#ECE1FA]',
    bannerBorder: 'border-purple-100',
    pillBg: 'bg-[#F4EBFE]',
    pillText: 'text-[#7E22CE]',
    imageSrc: '/tip-3d-3.webp',
    imageAlt: 'Ilustrasi Ibu Hamil Tidur Tenang Nyaman di Bantal Lounger Lembut',
  },
  4: {
    bannerBg: 'bg-gradient-to-r from-[#FFF2F5] via-[#FFE8ED] to-[#FFDEE5]',
    bannerBorder: 'border-pink-100',
    pillBg: 'bg-[#FFEBF0]',
    pillText: 'text-[#BE123C]',
    imageSrc: '/tip-3d-4.webp',
    imageAlt: 'Ilustrasi 3D Obrolan Hangat dengan Pasangan',
  },
  5: {
    bannerBg: 'bg-gradient-to-r from-[#F6FAF0] via-[#EFF6E5] to-[#E8F2DA]',
    bannerBorder: 'border-[#E0E8D0]',
    pillBg: 'bg-[#F2F7EB]',
    pillText: 'text-[#56632A]',
    imageSrc: '/tip-3d-5.webp',
    imageAlt: 'Ilustrasi 3D Informasi Tepercaya dan Buku KIA',
  },
  6: {
    bannerBg: 'bg-gradient-to-r from-[#FFF9ED] via-[#FEF3DC] to-[#FDECCA]',
    bannerBorder: 'border-amber-100',
    pillBg: 'bg-[#FEF5E0]',
    pillText: 'text-[#B45309]',
    imageSrc: '/tip-3d-6.webp',
    imageAlt: 'Ilustrasi 3D Jurnal Rasa Syukur dan Afirmasi Positif',
  },
};

export function TipCard({ tip, isSaved, onToggleSave, orderNumber }: TipCardProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const tipNum = orderNumber ?? (parseInt(tip.id.replace('tip-', ''), 10) || 1);
  const theme = TIP_THEMES[tipNum] || TIP_THEMES[1];
  const tags = tip.tags ?? ['Tips Praktis', 'Harian', 'Kesehatan'];

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${tip.title} - ${tip.description}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setMenuOpen(false);
    }
  };

  return (
    <article
      aria-label={`Tips: ${tip.title}`}
      className="group relative flex h-full flex-col rounded-[22px] border border-[#F5DCE4] bg-white p-5 shadow-[0_6px_22px_rgba(200,75,113,0.05)] hover:border-pink-300 hover:shadow-[0_14px_32px_rgba(200,75,113,0.15)] hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300"
    >
      {/* ===================================================================
          1. TOP ROW: Numbered Title (1 Line Fixed Height) + Bookmark & Actions
         =================================================================== */}
      <div className="flex h-7 items-center justify-between gap-2">
        <h3
          title={`${tipNum}. ${tip.title}`}
          className="min-w-0 flex-1 truncate font-heading text-[15px] font-bold tracking-[-0.01em] text-[#2A2D22] group-hover:text-[#C84B71] transition-colors leading-snug"
        >
          {tipNum}. {tip.title}
        </h3>

        <div className="relative flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onToggleSave(tip.id)}
            aria-label={isSaved ? 'Hapus dari simpanan' : 'Simpan tips kehamilan'}
            title={isSaved ? 'Tersimpan di bookmark' : 'Simpan tips'}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors cursor-pointer ${
              isSaved
                ? 'bg-pink-100 text-[#C84B71]'
                : 'bg-[#FAF8FC] text-[#8C8896] hover:bg-[#FDF2F5] hover:text-[#C84B71]'
            }`}
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`}
              strokeWidth={2}
            />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="Menu opsi tips"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8FC] text-[#8C8896] hover:bg-gray-100 hover:text-[#2A2D22] transition-colors cursor-pointer"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-8 z-30 w-36 overflow-hidden rounded-2xl border border-[#ECE7F2] bg-white p-1.5 shadow-lg select-none"
            >
              <button
                type="button"
                onClick={handleCopy}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-[#FAF8FC] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-700 font-bold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-gray-400" />
                    <span>Salin Tips</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          2. DESCRIPTION ROW: Full-width, Exact 2-Line Height (38px)
         =================================================================== */}
      <p className="mt-1.5 h-[38px] w-full text-xs leading-[1.58] text-[#6E6A6C] line-clamp-2">
        {tip.description}
      </p>

      {/* ===================================================================
          3. MIDDLE ROW: HORIZONTAL ILLUSTRATION BANNER (Exact Same Y-Offset)
         =================================================================== */}
      <div className="mt-3.5">
        <div
          className={`w-full h-36 rounded-[16px] border ${theme.bannerBorder} ${theme.bannerBg} flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:shadow-inner`}
        >
          <div className="relative h-28 w-28 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={theme.imageSrc}
              alt={theme.imageAlt}
              fill
              sizes="(max-width: 640px) 120px, 150px"
              className="object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.12)]"
              priority={tipNum <= 2}
            />
          </div>
        </div>
      </div>

      {/* ===================================================================
          4. CARD BOTTOM: Single-Line Aligned Tags + Category (No Wrapping)
         =================================================================== */}
      <div className="mt-4 pt-3 border-t border-[#F0ECF5] flex h-8 items-center justify-between gap-2 whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          {tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                idx === 0
                  ? theme.pillBg + ' ' + theme.pillText
                  : 'bg-[#FAF8FC] text-[#6E6A6C] border border-[#ECE7F2]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <span className="shrink-0 text-[11px] font-semibold text-[#8C8896]">
          {tip.category ?? 'Tips Kehamilan'}
        </span>
      </div>
    </article>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  Check,
  Droplets,
  Heart,
  Moon,
  MoreVertical,
  ShieldCheck,
  Smile,
  Sun,
} from 'lucide-react';
import { PregnancyTip } from '@/types';

interface TipCardProps {
  tip: PregnancyTip;
  isSaved: boolean;
  onToggleSave: (tipId: string) => void;
}

const iconMap = {
  Sun,
  Droplets,
  Moon,
  Heart,
  ShieldCheck,
  Smile,
};

const iconThemeMap: Record<
  PregnancyTip['iconName'],
  { bg: string; text: string; border: string }
> = {
  Sun: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
  },
  Droplets: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-100',
  },
  Moon: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
  },
  Heart: {
    bg: 'bg-pink-50',
    text: 'text-[#C84B71]',
    border: 'border-pink-100',
  },
  ShieldCheck: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  Smile: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
  },
};

export function TipCard({ tip, isSaved, onToggleSave }: TipCardProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const IconComponent = iconMap[tip.iconName] || Sun;
  const theme = iconThemeMap[tip.iconName] || iconThemeMap.Sun;

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
      className="group relative flex flex-col justify-between rounded-[24px] border border-[#ECE7F2] bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(42,45,34,0.03)] hover:shadow-[0_12px_28px_rgba(200,75,113,0.08)] hover:-translate-y-1 transition-all duration-300"
    >
      <div>
        {/* ===================================================================
            1. TOP ROW: Pastel Icon Squircle (Left) + Actions (Right)
           =================================================================== */}
        <div className="flex items-center justify-between">
          {/* Pastel Squircle Icon */}
          <div
            className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border ${theme.bg} ${theme.text} ${theme.border} transition-transform duration-300 group-hover:scale-105`}
          >
            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
          </div>

          {/* Action Buttons: Bookmark & More */}
          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleSave(tip.id)}
              aria-label={isSaved ? 'Hapus dari simpanan' : 'Simpan tips kehamilan'}
              title={isSaved ? 'Tersimpan di bookmark' : 'Simpan tips'}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-pink-100 text-[#C84B71]'
                  : 'bg-[#FAF8FC] text-[#8C8896] hover:bg-[#FDF2F5] hover:text-[#C84B71]'
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label="Menu opsi tips"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF8FC] text-[#8C8896] hover:bg-gray-100 hover:text-[#2A2D22] transition-colors cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-2xl border border-[#ECE7F2] bg-white p-1.5 shadow-lg select-none"
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
                    <span>Salin Tips</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleSave(tip.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-[#FAF8FC] transition-colors cursor-pointer"
                >
                  <span>{isSaved ? 'Hapus Simpanan' : 'Simpan Tips'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================
            2. CARD CONTENT: Title + Subtitle/Description
           =================================================================== */}
        <div className="mt-4">
          <h3 className="font-heading text-[15px] sm:text-base font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors leading-snug">
            {tip.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#6E6A6C] line-clamp-3 min-h-[50px]">
            {tip.description}
          </p>
        </div>
      </div>

      {/* =====================================================================
          3. CARD BOTTOM: 3 Cute Pastel Pill Badges (Khas Mockup)
          Pill 1: Mint/Green  |  Pill 2: Lilac/Purple  |  Pill 3: Peach/Amber
         ===================================================================== */}
      <div className="mt-5 pt-3.5 border-t border-[#F0ECF5] flex flex-wrap items-center gap-1.5">
        {/* Pill 1: Mint Green */}
        <span className="inline-flex items-center rounded-full bg-[#EBF7EE] border border-[#C8E6C9] px-2.5 py-0.5 text-[10.5px] font-bold text-[#2E7D32]">
          {tags[0]}
        </span>

        {/* Pill 2: Lilac Purple */}
        <span className="inline-flex items-center rounded-full bg-[#F3E8FF] border border-[#E9D5FF] px-2.5 py-0.5 text-[10.5px] font-bold text-[#7E22CE]">
          {tags[1]}
        </span>

        {/* Pill 3: Peach Amber */}
        <span className="inline-flex items-center rounded-full bg-[#FFF4E5] border border-[#FFE0B2] px-2.5 py-0.5 text-[10.5px] font-bold text-[#B76E00]">
          {tags[2]}
        </span>
      </div>
    </article>
  );
}

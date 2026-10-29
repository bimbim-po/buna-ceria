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
    bannerBg: 'bg-gradient-to-r from-[#EBF5FF] via-[#E1F0FF] to-[#D5E9FA]',
    bannerBorder: 'border-blue-100/80',
    pillBg: 'bg-[#E3EFFF]',
    pillText: 'text-[#1D4ED8]',
    imageSrc: '/tip-3d-1.webp',
    imageAlt: 'Ilustrasi 3D Jeda Napas Pagi Hari dan Ketenangan',
  },
  2: {
    bannerBg: 'bg-gradient-to-r from-[#E0F8F6] via-[#D5F4F1] to-[#C8F0EC]',
    bannerBorder: 'border-teal-100/80',
    pillBg: 'bg-[#DCFCE7]',
    pillText: 'text-[#0F766E]',
    imageSrc: '/tip-3d-2.webp',
    imageAlt: 'Ilustrasi 3D Minum Air Berkala dan Hidrasi Janin',
  },
  3: {
    bannerBg: 'bg-gradient-to-r from-[#F4EDFC] via-[#ECE1FA] to-[#E3D4F7]',
    bannerBorder: 'border-purple-100/80',
    pillBg: 'bg-[#F3E8FF]',
    pillText: 'text-[#7E22CE]',
    imageSrc: '/tip-3d-3.webp',
    imageAlt: 'Ilustrasi 3D Istirahat Nyaman dan Bantal Kehamilan',
  },
  4: {
    bannerBg: 'bg-gradient-to-r from-[#FFEBEF] via-[#FEDFE5] to-[#FDD3DD]',
    bannerBorder: 'border-pink-100/80',
    pillBg: 'bg-[#FFE4E6]',
    pillText: 'text-[#BE123C]',
    imageSrc: '/tip-3d-4.webp',
    imageAlt: 'Ilustrasi 3D Obrolan Hangat dengan Pasangan',
  },
  5: {
    bannerBg: 'bg-gradient-to-r from-[#F2F8EA] via-[#E9F4DC] to-[#DFEFCD]',
    bannerBorder: 'border-[#D5DCB6]/80',
    pillBg: 'bg-[#F5F7EA]',
    pillText: 'text-[#56632A]',
    imageSrc: '/tip-3d-5.webp',
    imageAlt: 'Ilustrasi 3D Informasi Tepercaya dan Buku KIA',
  },
  6: {
    bannerBg: 'bg-gradient-to-r from-[#FFF6E5] via-[#FEEDCF] to-[#FEE3B8]',
    bannerBorder: 'border-amber-100/80',
    pillBg: 'bg-[#FEF3C7]',
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
      className="group relative flex flex-col justify-between rounded-[28px] sm:rounded-[30px] border border-[#ECE7F2] bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(42,45,34,0.03)] hover:shadow-[0_14px_32px_rgba(40,40,60,0.08)] hover:-translate-y-1 transition-all duration-300"
    >
      <div>
        {/* ===================================================================
            1. TOP ROW: Numbered Title (Left) + Bookmark & Actions (Right)
            Sesuai tangkapan layar referensi: "1. Judul Tips" + Deskripsi
           =================================================================== */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 pr-2">
            <h3 className="font-heading text-base sm:text-[17px] font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors leading-snug">
              {tipNum}. {tip.title}
            </h3>
            <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C] line-clamp-2">
              {tip.description}
            </p>
          </div>

          <div className="relative flex items-center gap-1 shrink-0 pt-0.5">
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

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-9 z-30 w-36 overflow-hidden rounded-2xl border border-[#ECE7F2] bg-white p-1.5 shadow-lg select-none"
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
            2. MIDDLE ROW: HORIZONTAL ILLUSTRATION BANNER
            Sesuai referensi gambar klien (Wadah Banner Persegi Panjang Horizontal
            dengan latar pastel lembut dan ilustrasi 3D di dalamnya)
           =================================================================== */}
        <div className="mt-4">
          <div
            className={`w-full h-36 sm:h-40 rounded-[20px] sm:rounded-[22px] border ${theme.bannerBorder} ${theme.bannerBg} flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:shadow-inner`}
          >
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 transition-transform duration-300 group-hover:scale-110">
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
      </div>

      {/* =====================================================================
          3. CARD BOTTOM: Cute Pastel Pill Badges (Tags & Kategori)
         ===================================================================== */}
      <div className="mt-4 pt-3 border-t border-[#F0ECF5] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                idx === 0
                  ? theme.pillBg + ' ' + theme.pillText
                  : 'bg-[#FAF8FC] text-[#6E6A6C] border border-[#ECE7F2]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <span className="text-[11px] font-semibold text-[#8C8896]">
          {tip.category ?? 'Tips Kehamilan'}
        </span>
      </div>
    </article>
  );
}

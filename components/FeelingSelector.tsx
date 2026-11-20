'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BatteryLow,
  ClipboardCheck,
  CloudRain,
  Heart,
  Moon,
  Smile,
  Users,
} from 'lucide-react';
import { getFeelingTopics } from '@/lib/api';
import { uiContent } from '@/data/uiContent';
import { useApp } from '@/context/AppContext';
import { FeelingTopic } from '@/types';

const topicIconMap = {
  keluarga: Users,
  kecemasan: CloudRain,
  stres: BatteryLow,
  mood: Smile,
  persalinan: Heart,
  tidur: Moon,
} as const;

const TOPIC_VISUAL_MAP: Record<
  FeelingTopic['id'],
  { src: string; tint: string }
> = {
  keluarga: { src: '/modul-3d-3.webp', tint: 'bg-[#FBEDF1]' },
  kecemasan: { src: '/modul-3d-1.webp', tint: 'bg-[#F2F5E8]' },
  stres: { src: '/tip-3d-1.webp', tint: 'bg-[#FDF4E5]' },
  mood: { src: '/tip-3d-6.webp', tint: 'bg-[#F5EFFB]' },
  persalinan: { src: '/modul-3d-4.webp', tint: 'bg-[#EBF4F1]' },
  tidur: { src: '/modul-3d-2.webp', tint: 'bg-[#FDF2EA]' },
};

export function FeelingSelector() {
  const {
    session,
    openLoginDialog,
    openAnxietyDialog,
  } = useApp();
  const topics = getFeelingTopics();
  const [selectedId, setSelectedId] = useState<FeelingTopic['id']>(
    topics[0]?.id ?? 'keluarga'
  );

  const activeTopic =
    topics.find((t) => t.id === selectedId) ?? topics[0];

  const handleOpenAnxietyCheck = () => {
    if (!session) {
      openLoginDialog();
      return;
    }
    openAnxietyDialog();
  };

  const visual = TOPIC_VISUAL_MAP[activeTopic?.id ?? 'keluarga'] ?? TOPIC_VISUAL_MAP.keluarga;

  return (
    <section
      aria-labelledby="feelings-heading"
      className="space-y-3.5"
    >
      {/* Kepala Bagian — rata kiri yang tenang & editorial */}
      <div className="max-w-2xl">
        <h2
          id="feelings-heading"
          className="font-heading text-lg font-bold tracking-tight text-[#2A2D22] sm:text-xl"
        >
          {uiContent.feelingsSection.sectionTitle}
        </h2>
        <p className="mt-1 text-xs sm:text-[13.5px] leading-relaxed text-[#6E6A6C]">
          {uiContent.feelingsSection.sectionSubtitle}
        </p>
      </div>

      {/* Kontainer Utama: Tab Perasaan di Kiri & Panel Panduan di Kanan */}
      <div className="overflow-hidden rounded-[22px] border border-[#F0DCE3] bg-white p-3 sm:p-4 shadow-[0_4px_20px_rgba(78,30,47,0.04)]">
        <div className="flex flex-col md:flex-row gap-3.5 sm:gap-4 items-stretch">
          {/* Kolom Kiri: Daftar Pilihan Perasaan */}
          <div
            role="tablist"
            aria-label="Pilih perasaan yang sedang Ibu hadapi"
            className="grid grid-cols-2 gap-1.5 md:flex md:w-56 md:shrink-0 md:flex-col md:justify-between md:gap-1 p-1.5 bg-[#FAF4F6] rounded-[16px]"
          >
            {topics.map((topic) => {
              const isSelected = topic.id === activeTopic.id;
              const Icon = topicIconMap[topic.id] ?? Heart;
              return (
                <button
                  key={topic.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`feeling-panel-${topic.id}`}
                  id={`feeling-tab-${topic.id}`}
                  onClick={() => setSelectedId(topic.id)}
                  className={`group relative flex min-h-[40px] items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-white font-semibold text-[#2A2D22] shadow-[0_2px_8px_rgba(78,30,47,0.06)] ring-1 ring-[#EED8E0]'
                      : 'font-medium text-[#6E6A6C] hover:bg-white/60 hover:text-[#2A2D22]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isSelected
                        ? 'text-[#C84B71]'
                        : 'text-[#8C8896] group-hover:text-[#2A2D22]'
                    }`}
                    strokeWidth={isSelected ? 2 : 1.75}
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-[13px] leading-snug">{topic.label}</span>
                </button>
              );
            })}
          </div>

          {/* Kolom Kanan: Kanvas Panduan & Langkah Praktis */}
          {activeTopic && (
            <div
              role="tabpanel"
              id={`feeling-panel-${activeTopic.id}`}
              aria-labelledby={`feeling-tab-${activeTopic.id}`}
              className="flex flex-1 flex-col justify-between rounded-[16px] bg-[#FFFCFD] p-4 sm:p-6 border border-[#F4E4EA]"
            >
              {/* Bagian Atas: Ilustrasi 3D + Judul + Saran Bidan */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                <div
                  className={`relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl ${visual.tint} p-2.5`}
                >
                  <Image
                    src={visual.src}
                    alt={activeTopic.title}
                    fill
                    sizes="96px"
                    className="object-contain p-2 drop-shadow-[0_6px_12px_rgba(0,0,0,0.08)]"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A83A5E]">
                    Saran Pendampingan
                  </span>
                  <h3 className="mt-0.5 font-heading text-base font-bold text-[#2A2D22] sm:text-xl">
                    {activeTopic.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13.5px] leading-relaxed text-[#5F5B5D]">
                    {activeTopic.advice}
                  </p>
                </div>
              </div>

              {/* Bagian Bawah: Aksi Tenang Kuesioner Kecemasan */}
              <div className="mt-5 flex flex-col gap-3 border-t border-[#F4E4EA] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-[#767A6E]">
                  Ingin mengenali kondisi emosi lebih dalam?
                </div>

                <button
                  type="button"
                  onClick={handleOpenAnxietyCheck}
                  className="inline-flex h-9 items-center justify-center gap-1.5 self-start sm:self-auto rounded-full bg-[#C84B71] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#B23B60] active:scale-[0.98] cursor-pointer"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" strokeWidth={1.9} />
                  <span>{uiContent.feelingsSection.checkAnxietyButton}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

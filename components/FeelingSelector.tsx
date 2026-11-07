'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  BatteryLow,
  BookOpen,
  ClipboardCheck,
  CloudRain,
  Heart,
  HeartHandshake,
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

function FeelingIllustration({ id }: { id: FeelingTopic['id'] }) {
  switch (id) {
    case 'keluarga':
      return (
        <svg
          viewBox="0 0 96 84"
          className="h-20 w-24 shrink-0"
          aria-hidden="true"
        >
          <circle cx="48" cy="44" r="30" fill="#FEF3F5" />
          <path d="M 24 72 C 24 54, 46 54, 46 72 Z" fill="#A8B371" />
          <circle
            cx="35"
            cy="40"
            r="9"
            fill="#FBDDE3"
            stroke="#2A2D22"
            strokeWidth="1.6"
          />
          <path d="M 27 38 C 28 30, 42 30, 43 38" fill="#2A2D22" />

          <path d="M 46 72 C 46 54, 70 54, 70 72 Z" fill="#F5AFB9" />
          <circle
            cx="58"
            cy="42"
            r="8.5"
            fill="#FFF9F7"
            stroke="#2A2D22"
            strokeWidth="1.6"
          />
          <path d="M 50 42 C 50 32, 66 32, 66 44" fill="#2A2D22" />
          <path
            d="M 48 26 C 48 26, 42 21, 42 17 C 42 14.5, 44 13, 46 13 C 47.2 13, 48 14, 48 15 C 48 14, 48.8 13, 50 13 C 52 13, 54 14.5, 54 17 C 54 21, 48 26, 48 26 Z"
            fill="#A8435A"
          />
        </svg>
      );
    case 'kecemasan':
      return (
        <svg
          viewBox="0 0 96 84"
          className="h-20 w-24 shrink-0"
          aria-hidden="true"
        >
          <circle cx="48" cy="44" r="30" fill="#F5F7EA" />
          <path
            d="M 34 20 C 38 14, 46 16, 44 22 C 42 26, 52 14, 58 20"
            fill="none"
            stroke="#A8435A"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path d="M 32 72 C 32 52, 64 52, 64 72 Z" fill="#F5AFB9" />
          <circle
            cx="48"
            cy="41"
            r="10"
            fill="#FFF9F7"
            stroke="#2A2D22"
            strokeWidth="1.6"
          />
          <path d="M 38 42 C 38 29, 58 29, 58 42" fill="#2A2D22" />
          <path
            d="M 42 62 L 45 47"
            stroke="#2A2D22"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'stres':
      return (
        <svg
          viewBox="0 0 96 84"
          className="h-20 w-24 shrink-0"
          aria-hidden="true"
        >
          <circle cx="48" cy="44" r="30" fill="#FEF3F5" />
          <path
            d="M 24 28 L 29 32 L 26 35"
            fill="none"
            stroke="#A8435A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 72 28 L 67 32 L 70 35"
            fill="none"
            stroke="#A8435A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M 30 72 C 30 52, 66 52, 66 72 Z" fill="#A8B371" />
          <circle
            cx="48"
            cy="41"
            r="10"
            fill="#FFF9F7"
            stroke="#2A2D22"
            strokeWidth="1.6"
          />
          <path d="M 38 40 C 38 28, 58 28, 58 40" fill="#2A2D22" />
          <path
            d="M 34 56 L 39 42 M 62 56 L 57 42"
            stroke="#2A2D22"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'mood':
      return (
        <svg
          viewBox="0 0 96 84"
          className="h-20 w-24 shrink-0"
          aria-hidden="true"
        >
          <circle cx="48" cy="44" r="30" fill="#F5F7EA" />
          <circle cx="25" cy="34" r="6" fill="#FBDDE3" />
          <circle cx="71" cy="34" r="6" fill="#E4EAC9" />
          <path d="M 32 72 C 32 52, 64 52, 64 72 Z" fill="#F5AFB9" />
          <circle
            cx="48"
            cy="41"
            r="10"
            fill="#FFF9F7"
            stroke="#2A2D22"
            strokeWidth="1.6"
          />
          <path d="M 38 41 C 38 28, 58 28, 58 41" fill="#2A2D22" />
          <path
            d="M 45 45 Q 48 43 51 45"
            fill="none"
            stroke="#2A2D22"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'persalinan':
      return (
        <svg
          viewBox="0 0 96 84"
          className="h-20 w-24 shrink-0"
          aria-hidden="true"
        >
          <circle cx="48" cy="44" r="30" fill="#FEF3F5" />
          <path d="M 30 72 C 30 50, 66 50, 66 72 Z" fill="#F5AFB9" />
          <circle
            cx="48"
            cy="38"
            r="9.5"
            fill="#FFF9F7"
            stroke="#2A2D22"
            strokeWidth="1.6"
          />
          <path d="M 38 38 C 38 26, 58 26, 58 38" fill="#2A2D22" />
          <path
            d="M 48 65 C 48 65, 41 60, 41 56 C 41 53.5, 43 52, 45 52 C 46.5 52, 47.5 53, 48 54 C 48.5 53, 49.5 52, 51 52 C 53 52, 55 53.5, 55 56 C 55 60, 48 65, 48 65 Z"
            fill="#FFFFFF"
            stroke="#A8435A"
            strokeWidth="1.5"
          />
        </svg>
      );
    case 'tidur':
      return (
        <svg
          viewBox="0 0 96 84"
          className="h-20 w-24 shrink-0"
          aria-hidden="true"
        >
          <circle cx="48" cy="44" r="30" fill="#F5F7EA" />
          <path
            d="M 66 22 C 62 24, 62 31, 67 33 C 63 34, 58 30, 60 24 C 61 21, 64 21, 66 22 Z"
            fill="#56632A"
          />
          <path d="M 32 72 C 32 52, 64 52, 64 72 Z" fill="#A8B371" />
          <circle
            cx="48"
            cy="42"
            r="10"
            fill="#FFF9F7"
            stroke="#2A2D22"
            strokeWidth="1.6"
          />
          <path d="M 38 41 C 38 29, 58 29, 58 41" fill="#2A2D22" />
          <path
            d="M 43 42 Q 45 44 47 42 M 49 42 Q 51 44 53 42"
            fill="none"
            stroke="#2A2D22"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export function FeelingSelector() {
  const {
    session,
    appMode,
    openLoginDialog,
    openAnxietyDialog,
    openModuleReader,
    enterWebApp,
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

  const handleContactExpert = () => {
    if (appMode === 'landing') {
      const el = document.getElementById('landing-experts');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    enterWebApp('kontak-ahli');
  };

  return (
    <section
      aria-labelledby="feelings-heading"
      className="space-y-3.5"
    >
      {/* Kepala Bagian */}
      <div className="max-w-2xl">
        <h2
          id="feelings-heading"
          className="font-heading text-lg font-bold tracking-tight text-[#2A2D22] sm:text-xl"
        >
          {uiContent.feelingsSection.sectionTitle}
        </h2>
        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#6E6A6C]">
          {uiContent.feelingsSection.sectionSubtitle}
        </p>
      </div>

      {/* Kontainer: Menu Perasaan di Kiri & Kanvas Putih di Kanan */}
      <div className="overflow-hidden rounded-[24px] border border-[#ECE7F2] bg-white p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {/* Kolom Kiri: Daftar Pilihan Perasaan dengan Pill Tab yang Rapi */}
          <div
            role="tablist"
            aria-label="Pilih perasaan yang sedang Ibu hadapi"
            className="grid grid-cols-2 gap-1.5 md:flex md:w-60 md:shrink-0 md:flex-col md:justify-between md:gap-1.5 p-2 bg-[#FAF9FB] rounded-[18px] border border-[#F0ECF5]"
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
                  className={`group relative flex min-h-[42px] items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white font-bold text-[#2A2D22] shadow-2xs border border-pink-200/80'
                      : 'font-medium text-[#6E6A6C] hover:bg-white/80 hover:text-[#2A2D22]'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-[#FDF2F5] text-[#C84B71]'
                        : 'bg-white text-[#8C8896] group-hover:text-[#2A2D22]'
                    }`}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-xs sm:text-[13px] leading-snug">{topic.label}</span>
                </button>
              );
            })}
          </div>

          {/* Kolom Kanan: Kanvas Putih Panduan & Bantuan */}
          {activeTopic && (
            <div
              role="tabpanel"
              id={`feeling-panel-${activeTopic.id}`}
              aria-labelledby={`feeling-tab-${activeTopic.id}`}
              className="flex flex-1 flex-col justify-between rounded-[18px] bg-white p-5 sm:p-6 border border-[#F0ECF5]"
            >
              {/* Bagian Atas: Ilustrasi + Judul + Saran Bidan */}
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-pink-100 bg-[#FDF9FA] p-2 shadow-2xs">
                  <FeelingIllustration id={activeTopic.id} />
                </div>

                <div className="flex-1">
                  <span className="inline-flex items-center rounded-full border border-pink-200 bg-[#FDF2F5] px-3 py-0.5 text-[11px] font-bold text-[#C84B71]">
                    {activeTopic.label}
                  </span>

                  <h3 className="mt-2 font-heading text-lg font-bold text-[#2A2D22] sm:text-xl">
                    {activeTopic.title}
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-[13.5px] leading-relaxed text-[#6E6A6C]">
                    {activeTopic.advice}
                  </p>
                </div>
              </div>

              {/* Bagian Bawah: Baris Tombol Aksi yang Rapi & Proporsional */}
              <div className="mt-6 flex flex-col gap-3 border-t border-[#F0ECF5] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() =>
                    openModuleReader(activeTopic.recommendedModuleId)
                  }
                  className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-[#ECE7F2] bg-[#FAF8FC] px-4 py-2 text-xs font-bold text-[#2A2D22] hover:bg-white hover:border-pink-200 hover:text-[#C84B71] transition-all cursor-pointer shadow-2xs"
                >
                  <BookOpen
                    className="h-3.5 w-3.5 text-[#C84B71]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <span>{activeTopic.recommendedModuleLabel}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-[#C84B71]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenAnxietyCheck}
                    className="inline-flex min-h-[40px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-full bg-[#C84B71] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] transition-all cursor-pointer"
                  >
                    <ClipboardCheck
                      className="h-3.5 w-3.5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <span>{uiContent.feelingsSection.checkAnxietyButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleContactExpert}
                    className="inline-flex min-h-[40px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-full bg-[#EBF7EE] border border-green-200 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-100 transition-all cursor-pointer"
                  >
                    <HeartHandshake
                      className="h-3.5 w-3.5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <span>{uiContent.feelingsSection.contactExpertButton}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

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
      className="space-y-5"
    >
      {/* Kepala Bagian */}
      <div className="max-w-2xl">
        <h2
          id="feelings-heading"
          className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          {uiContent.feelingsSection.sectionTitle}
        </h2>
        <p className="mt-1.5 text-base leading-relaxed text-ink-muted">
          {uiContent.feelingsSection.sectionSubtitle}
        </p>
      </div>

      {/* Kontainer: Menu Perasaan di Kiri & Kanvas Putih di Kanan */}
      <div className="overflow-hidden rounded-[28px] border border-pink-100 bg-green-500 p-3 shadow-green-soft sm:p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Kolom Kiri: Daftar Pilihan Perasaan dengan Pill Tab yang Rapi */}
          <div
            role="tablist"
            aria-label="Pilih perasaan yang sedang Ibu hadapi"
            className="grid grid-cols-2 gap-2 pb-2 md:flex md:w-60 md:shrink-0 md:flex-col md:justify-center md:gap-2 md:py-2"
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
                  className={`group relative flex min-h-[46px] items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-surface font-bold text-ink shadow-sm'
                      : 'font-semibold text-ink/80 hover:bg-surface/30 hover:text-ink'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-surface/60 text-ink group-hover:bg-surface'
                    }`}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm leading-snug">{topic.label}</span>
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
              className="flex flex-1 flex-col justify-between rounded-[24px] bg-surface p-6 sm:p-8"
            >
              {/* Bagian Atas: Ilustrasi + Judul + Saran Bidan */}
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[24px] border border-pink-100 bg-page p-2 shadow-2xs">
                  <FeelingIllustration id={activeTopic.id} />
                </div>

                <div className="flex-1">
                  <span className="inline-flex items-center rounded-full border border-pink-100 bg-pink-50 px-3.5 py-1 text-xs font-bold text-pink-700">
                    {activeTopic.label}
                  </span>

                  <h3 className="mt-2.5 font-heading text-xl font-bold text-ink sm:text-2xl">
                    {activeTopic.title}
                  </h3>

                  <p className="mt-2 text-base leading-relaxed text-ink-muted">
                    {activeTopic.advice}
                  </p>
                </div>
              </div>

              {/* Bagian Bawah: Baris Tombol Aksi yang Rapi */}
              <div className="mt-7 flex flex-col gap-3 border-t border-pink-100 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() =>
                    openModuleReader(activeTopic.recommendedModuleId)
                  }
                  className="btn-pill inline-flex min-h-[46px] items-center justify-center gap-2.5 border border-pink-100 bg-page px-5 py-2.5 text-sm font-bold text-ink hover:bg-pink-50 cursor-pointer"
                >
                  <BookOpen
                    className="h-4 w-4 shrink-0 text-pink-700"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>{activeTopic.recommendedModuleLabel}</span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-pink-700"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenAnxietyCheck}
                    className="btn-pill inline-flex min-h-[46px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full bg-[#C84B71] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#b23b60] transition-colors cursor-pointer"
                  >
                    <ClipboardCheck
                      className="h-4 w-4 shrink-0"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span>{uiContent.feelingsSection.checkAnxietyButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleContactExpert}
                    className="btn-pill inline-flex min-h-[46px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-bold text-ink shadow-green-soft hover:bg-green-600 transition-colors cursor-pointer"
                  >
                    <HeartHandshake
                      className="h-4 w-4 shrink-0"
                      strokeWidth={1.75}
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

'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Smile,
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DailyMoodEntry, DailyMoodType } from '@/types';

export const MOOD_DEFINITIONS: {
  type: DailyMoodType;
  emoji: string;
  label: string;
  description: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
}[] = [
  {
    type: 'happy',
    emoji: '🥰',
    label: 'Bahagia',
    description: 'Hati tenang, penuh kasih & bersyukur',
    bgLight: 'bg-[#FFF0F5]',
    textColor: 'text-[#C84B71]',
    borderColor: 'border-[#F8D2DF]',
  },
  {
    type: 'antusias',
    emoji: '🤩',
    label: 'Antusias',
    description: 'Bersemangat & penuh harapan hari ini',
    bgLight: 'bg-[#FFFBEB]',
    textColor: 'text-[#B45309]',
    borderColor: 'border-[#FDE68A]',
  },
  {
    type: 'soso',
    emoji: '🙂',
    label: 'Biasa Saja',
    description: 'Hari mengalir santai & stabil',
    bgLight: 'bg-[#F4F8EC]',
    textColor: 'text-[#56632A]',
    borderColor: 'border-[#E2ECD0]',
  },
  {
    type: 'khawatir',
    emoji: '😟',
    label: 'Khawatir',
    description: 'Merasa cemas atau memikirkan si Kecil',
    bgLight: 'bg-[#FFF7ED]',
    textColor: 'text-[#9A3412]',
    borderColor: 'border-[#FED7AA]',
  },
  {
    type: 'sedih',
    emoji: '😞',
    label: 'Sedih',
    description: 'Merasa murung atau kurang bersemangat',
    bgLight: 'bg-[#EFF6FB]',
    textColor: 'text-[#2D5670]',
    borderColor: 'border-[#D4E5F2]',
  },
  {
    type: 'menangis',
    emoji: '😖',
    label: 'Menangis',
    description: 'Lelah, sensitif, ingin meluapkan emosi',
    bgLight: 'bg-[#F9F0FD]',
    textColor: 'text-[#7B3FA0]',
    borderColor: 'border-[#EAD5F7]',
  },
  {
    type: 'marah',
    emoji: '😤',
    label: 'Marah',
    description: 'Ada rasa kesal atau jengkel hari ini',
    bgLight: 'bg-[#FFF2EE]',
    textColor: 'text-[#C2410C]',
    borderColor: 'border-[#FED7AA]',
  },
  {
    type: 'sebel',
    emoji: '🤯',
    label: 'Sebel / Pusing',
    description: 'Kewalahan dengan beban pikiran',
    bgLight: 'bg-[#FEFCE8]',
    textColor: 'text-[#A16207]',
    borderColor: 'border-[#FEF08A]',
  },
];

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function DailyMoodCalendar() {
  const { session, progress, handleSaveDailyMood, openLoginDialog } = useApp();

  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  const todayKey = useMemo(
    () => formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );

  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [noteInput, setNoteInput] = useState<string>('');
  const [savedSuccessNotice, setSavedSuccessNotice] = useState<boolean>(false);

  const dailyMoods = progress?.dailyMoods || {};
  const currentSelectedMood = dailyMoods[selectedDateKey];

  // Hitung kalender bulan aktif
  const { calendarDays, prevMonthDaysCount } = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      day: number;
      isCurrentMonth: boolean;
      dateKey: string;
      isToday: boolean;
    }[] = [];

    // Hari dari bulan sebelumnya
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({
        day: dayNum,
        isCurrentMonth: false,
        dateKey: formatDateKey(prevY, prevM, dayNum),
        isToday: false,
      });
    }

    // Hari bulan saat ini
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dKey = formatDateKey(currentYear, currentMonth, dayNum);
      days.push({
        day: dayNum,
        isCurrentMonth: true,
        dateKey: dKey,
        isToday: dKey === todayKey,
      });
    }

    // Sisa grid hingga kelipatan 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({
        day: dayNum,
        isCurrentMonth: false,
        dateKey: formatDateKey(nextY, nextM, dayNum),
        isToday: false,
      });
    }

    return { calendarDays: days, prevMonthDaysCount: firstDayIndex };
  }, [currentYear, currentMonth, todayKey]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectMood = (def: (typeof MOOD_DEFINITIONS)[number]) => {
    if (!session) {
      openLoginDialog();
      return;
    }
    handleSaveDailyMood({
      dateKey: selectedDateKey,
      mood: def.type,
      emoji: def.emoji,
      label: def.label,
      note: noteInput.trim() || currentSelectedMood?.note,
    });
    setSavedSuccessNotice(true);
    setTimeout(() => setSavedSuccessNotice(false), 2400);
  };

  const formattedSelectedDate = useMemo(() => {
    const [y, m, d] = selectedDateKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][
      dateObj.getDay()
    ];
    return `${dayName}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
  }, [selectedDateKey]);

  // Statistik bulan ini
  const monthMoodStats = useMemo(() => {
    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    let totalFilled = 0;
    const counts: Record<DailyMoodType, number> = {
      happy: 0,
      antusias: 0,
      soso: 0,
      khawatir: 0,
      sedih: 0,
      menangis: 0,
      marah: 0,
      sebel: 0,
    };
    Object.entries(dailyMoods).forEach(([dKey, val]) => {
      if (dKey.startsWith(prefix) && val?.mood) {
        counts[val.mood] = (counts[val.mood] || 0) + 1;
        totalFilled++;
      }
    });
    return { totalFilled, counts };
  }, [dailyMoods, currentYear, currentMonth]);

  return (
    <section
      aria-labelledby="mood-calendar-heading"
      className="rounded-[24px] border border-[#F5DCE4] bg-white p-5 sm:p-7 shadow-[0_6px_24px_rgba(200,75,113,0.06)]"
    >
      {/* Header Kalender Perasaan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7E7EC] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FBEDF1] px-3 py-1 text-xs font-bold text-[#C84B71] mb-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Kalender Emot Harian Bunda</span>
          </div>
          <h2
            id="mood-calendar-heading"
            className="font-heading text-lg sm:text-xl font-bold text-[#2A2D22]"
          >
            Catatan Suasana Hati Harian
          </h2>
          <p className="text-xs text-[#767A6E] mt-0.5">
            Pilih tanggal dan sentuh emotikon yang mewakili perasaan Bunda hari ini.
          </p>
        </div>

        {/* Navigasi Bulan */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Bulan sebelumnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ECE7F2] bg-[#FAF8FC] text-[#6E6A6C] hover:bg-[#FDF2F5] hover:text-[#C84B71] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[130px] text-center font-heading text-sm font-bold text-[#2A2D22]">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Bulan berikutnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ECE7F2] bg-[#FAF8FC] text-[#6E6A6C] hover:bg-[#FDF2F5] hover:text-[#C84B71] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Kolom Kiri: Grid Kalender Interaktif (7 Kolom) */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {DAY_LABELS.map((dayName, idx) => (
              <div
                key={dayName}
                className={`py-1 text-[11px] font-bold ${
                  idx === 0 ? 'text-[#C84B71]' : 'text-[#767A6E]'
                }`}
              >
                {dayName}
              </div>
            ))}

            {calendarDays.map((item, idx) => {
              const entry = dailyMoods[item.dateKey];
              const isSelected = item.dateKey === selectedDateKey;

              return (
                <button
                  key={`${item.dateKey}-${idx}`}
                  type="button"
                  onClick={() => {
                    setSelectedDateKey(item.dateKey);
                    setNoteInput(dailyMoods[item.dateKey]?.note || '');
                  }}
                  className={`group relative flex min-h-[52px] sm:min-h-[58px] flex-col items-center justify-between rounded-2xl p-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#C84B71] text-white shadow-[0_4px_12px_rgba(200,75,113,0.35)] scale-[1.03] z-10'
                      : item.isToday
                      ? 'bg-[#FBEDF1] border-2 border-[#C84B71] text-[#C84B71]'
                      : item.isCurrentMonth
                      ? 'bg-[#FAF8FC] hover:bg-[#F5EFF7] text-[#2A2D22]'
                      : 'bg-transparent text-[#B8B4C0] hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold self-start pl-1 ${
                      isSelected
                        ? 'text-white'
                        : item.isToday
                        ? 'text-[#C84B71]'
                        : item.isCurrentMonth
                        ? 'text-[#4A4D40]'
                        : 'text-[#B8B4C0]'
                    }`}
                  >
                    {item.day}
                  </span>

                  {entry ? (
                    <span
                      className={`text-lg sm:text-xl leading-none transition-transform group-hover:scale-115 ${
                        isSelected ? 'drop-shadow-sm' : ''
                      }`}
                      title={`${item.dateKey}: ${entry.label}`}
                    >
                      {entry.emoji}
                    </span>
                  ) : (
                    <span
                      className={`h-1.5 w-1.5 rounded-full mb-1 ${
                        isSelected
                          ? 'bg-white/40'
                          : item.isToday
                          ? 'bg-[#C84B71]/40'
                          : 'bg-transparent'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Rangkuman Singkat Bulan Ini */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#FFF9FA] border border-[#FBE3EA] px-3.5 py-2.5 text-xs text-[#6E6A6C]">
            <span className="font-semibold text-[#2A2D22]">
              {monthMoodStats.totalFilled > 0
                ? `${monthMoodStats.totalFilled} hari tercatat di ${MONTH_NAMES[currentMonth]}`
                : `Belum ada catatan di ${MONTH_NAMES[currentMonth]}`}
            </span>
            <div className="flex items-center gap-2">
              {MOOD_DEFINITIONS.map((def) => {
                const count = monthMoodStats.counts[def.type] || 0;
                if (count === 0) return null;
                return (
                  <span
                    key={def.type}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#2A2D22] border border-[#F0DCE3]"
                    title={`${def.label}: ${count} hari`}
                  >
                    <span>{def.emoji}</span>
                    <span>{count}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Emotikon & Detail Catatan Hari Terpilih */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-[20px] bg-[#FAF8FC] border border-[#F0ECF5] p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between border-b border-[#ECE7F2] pb-3 mb-3.5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                  {selectedDateKey === todayKey ? 'Hari Ini' : 'Tanggal Terpilih'}
                </span>
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#2A2D22]">
                  {formattedSelectedDate}
                </h3>
              </div>
              {currentSelectedMood && (
                <div className="flex items-center gap-1.5 rounded-full bg-white border border-[#E8DFEC] px-3 py-1 shadow-2xs">
                  <span className="text-xl leading-none">
                    {currentSelectedMood.emoji}
                  </span>
                  <span className="text-xs font-bold text-[#2A2D22]">
                    {currentSelectedMood.label}
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-[#6E6A6C] mb-3">
              Bagaimana perasaan Bunda pada tanggal ini?
            </p>

            {/* 8 Pilihan Emotikon Sesuai Request Klien:
                Happy: 🥰 | Antusias: 🤩 | So-so: 🙂 | Khawatir: 😟 | Sedih: 😞 | Menangis: 😖 | Marah: 😤 | Sebel: 🤯 */}
            <div className="grid grid-cols-4 gap-2">
              {MOOD_DEFINITIONS.map((def) => {
                const isSelectedMood = currentSelectedMood?.mood === def.type;
                return (
                  <button
                    key={def.type}
                    type="button"
                    onClick={() => handleSelectMood(def)}
                    className={`flex flex-col items-center justify-center rounded-2xl p-2.5 transition-all cursor-pointer ${
                      isSelectedMood
                        ? `${def.bgLight} ${def.borderColor} border-2 shadow-xs scale-[1.02]`
                        : 'bg-white hover:bg-gray-50 border border-[#F0ECF5]'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl leading-none">
                      {def.emoji}
                    </span>
                    <span
                      className={`mt-1 text-[11px] font-bold leading-tight ${
                        isSelectedMood ? def.textColor : 'text-[#2A2D22]'
                      }`}
                    >
                      {def.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Notifikasi Tersimpan */}
            {savedSuccessNotice && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs font-semibold text-green-800 animate-fadeIn">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                <span>Emotikon perasaan Bunda berhasil disimpan!</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#ECE7F2]">
            <p className="text-[11px] leading-relaxed text-[#767A6E]">
              Catatan emosi harian membantu Bunda mengenali pola perubahan suasana hati
              selama nifas dengan penuh welas asih.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
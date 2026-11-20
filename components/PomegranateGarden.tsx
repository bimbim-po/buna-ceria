'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Award,
  CheckCircle,
  Clock,
  ExternalLink,
  Flame,
  Gamepad2,
  Headphones,
  HelpCircle,
  Lock,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Video,
  Volume2,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getUserDayInfo } from '@/lib/api';

// 5 Pertanyaan Tebak Gambar / Materi Kecukupan ASI
const ASI_GAME_QUESTIONS = [
  {
    id: 1,
    title: 'Tanda Popok Basah (Buang Air Kecil)',
    clueImage: '/modul-3d-4.webp',
    imageAlt: 'Popok Bayi dan Kebersihan',
    question:
      'Berapa jumlah minimal popok basah (BAK) bayi dalam 24 jam setelah usia 5 hari sebagai tanda ASI cukup?',
    options: [
      { text: '1 – 2 kali sehari', isCorrect: false },
      { text: 'Minimal 6 kali sehari dengan urin jernih/kekuningan', isCorrect: true },
      { text: 'Hanya 1 kali saat pagi hari', isCorrect: false },
      { text: 'Lebih dari 20 kali', isCorrect: false },
    ],
    explanation:
      'Bayi yang mendapatkan cukup ASI umumnya buang air kecil minimal 6 kali dalam 24 jam dengan warna urin bening atau kuning muda.',
  },
  {
    id: 2,
    title: 'Pelekatan Menyusui yang Benar (LATCH)',
    clueImage: '/modul-3d-1.webp',
    imageAlt: 'Ibu Menyusui dengan Pelekatan Tenang',
    question:
      'Bagaimana posisi pelekatan mulut bayi yang benar pada payudara Bunda?',
    options: [
      { text: 'Hanya puting susu saja yang masuk ke mulut', isCorrect: false },
      {
        text: 'Mulut terbuka lebar, dagu menempel payudara, sebagian besar areola bawah masuk',
        isCorrect: true,
      },
      { text: 'Bibir bawah terlipat ke dalam mengisap kencang', isCorrect: false },
      { text: 'Hidung bayi tertutup rapat oleh payudara', isCorrect: false },
    ],
    explanation:
      'Pelekatan yang baik: mulut terbuka lebar, bibir bawah terlipat keluar (dower), dan dagu menempel pada payudara tanpa menimbulkan rasa sakit pada puting.',
  },
  {
    id: 3,
    title: 'Frekuensi Menyusu Harian',
    clueImage: '/tip-3d-1.webp',
    imageAlt: 'Rutinitas Menyusu Teratur',
    question:
      'Berapa frekuensi ideal menyusui bayi baru lahir dalam rentang 24 jam?',
    options: [
      { text: 'Hanya 3 kali sehari mengikuti jam makan dewasa', isCorrect: false },
      { text: '8 – 12 kali per 24 jam (sesuai permintaan / on demand)', isCorrect: true },
      { text: 'Tepat setiap 6 jam sekali tidak boleh kurang', isCorrect: false },
      { text: 'Hanya saat bayi menangis keras', isCorrect: false },
    ],
    explanation:
      'Bayi baru lahir memiliki lambung kecil sehingga butuh menyusu sekitar 8–12 kali dalam 24 jam, atau setiap 2–3 jam sesuai kebutuhan bayi.',
  },
  {
    id: 4,
    title: 'Kondisi Bayi Setelah Menyusu',
    clueImage: '/modul-3d-2.webp',
    imageAlt: 'Bayi Tidur Pulas Nyenyak',
    question:
      'Apa ciri utama bayi merasa puas dan kenyang setelah selesai menyusu?',
    options: [
      { text: 'Bayi tampak gelisah dan tangan mengepal kuat', isCorrect: false },
      {
        text: 'Bayi rileks, tangan terbuka santai, melepaskan puting sendiri & tertidur tenang',
        isCorrect: true,
      },
      { text: 'Bayi terus menghisap jemari tanpa henti', isCorrect: false },
      { text: 'Perut bayi tampak kempes', isCorrect: false },
    ],
    explanation:
      'Bayi yang kenyang akan melepaskan puting dengan sendirinya, tubuh dan jari-jarinya rileks terbuka, serta tampak tenang atau tertidur pulas.',
  },
  {
    id: 5,
    title: 'Kenaikan Berat Badan Bayi',
    clueImage: '/modul-3d-5.webp',
    imageAlt: 'Timbangan dan Buku Kesehatan Ibu Anak',
    question:
      'Bagaimana pola kenaikan berat badan bayi yang mendapatkan kecukupan ASI setelah melewati minggu ke-2?',
    options: [
      { text: 'Berat badan turun drastis setiap minggu', isCorrect: false },
      {
        text: 'Berat badan naik teratur sesuai kurva pertumbuhan buku KMS / KIA',
        isCorrect: true,
      },
      { text: 'Berat badan tidak mengalami perubahan hingga usia 6 bulan', isCorrect: false },
      { text: 'Hanya diukur setahun sekali', isCorrect: false },
    ],
    explanation:
      'Kenaikan berat badan yang stabil dan sesuai grafik di buku KIA/KMS adalah indikator klinis paling akurat bahwa asupan ASI bayi tercukupi dengan sangat baik.',
  },
];

export function PomegranateGarden() {
  const {
    session,
    progress,
    openLoginDialog,
    openAnxietyDialog,
    handleCompleteGardenActivity,
    handleSetSimulatedDay,
  } = useApp();

  const dayInfo = useMemo(() => {
    return getUserDayInfo(session?.id ?? 'guest');
  }, [session?.id, progress?.simulatedDayOffset, progress?.firstLoginAt]);

  const gardenState = progress?.pomegranateGarden || {
    points: 0,
    completedActivities: {},
    activityLogs: [],
    lastUpdatedAt: new Date().toISOString(),
  };

  const points = gardenState.points || 0;
  const isVideoDone = Boolean(gardenState.completedActivities?.video);
  const isAudioDone = Boolean(gardenState.completedActivities?.audio);
  const isGameDone = Boolean(gardenState.completedActivities?.game);

  // Status Bunga Delima berdasarkan poin (0–100)
  const plantStage = useMemo(() => {
    if (points >= 100) {
      return {
        level: 5,
        title: 'Bunga Delima Mekar Sempurna',
        desc: 'Selamat Bunda! Bunga Delima mekar merah merona merekah indah melambangkan kesuburan, kesehatan, dan kecukupan ASI si kecil.',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        stageIcon: '🌺',
      };
    }
    if (points >= 75) {
      return {
        level: 4,
        title: 'Kuncup Bunga Delima Merah',
        desc: 'Kuncup bunga merah delima sudah terbentuk indah, bersiap mekar menjadi mahkota penuh kebahagiaan!',
        badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
        stageIcon: '🌸',
      };
    }
    if (points >= 50) {
      return {
        level: 3,
        title: 'Tanaman Muda Berdaun Rimbun',
        desc: 'Batang delima bertambah kokoh dengan dedaunan hijau segar yang menyerap setiap nutrisi positif Bunda.',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        stageIcon: '🌿',
      };
    }
    if (points >= 25) {
      return {
        level: 2,
        title: 'Tunas Hijau Mungil',
        desc: 'Tunas pertama telah menyembul dari tanah yang subur, menandai langkah awal kepedulian Bunda.',
        badgeColor: 'bg-lime-100 text-lime-800 border-lime-200',
        stageIcon: '🌱',
      };
    }
    return {
      level: 1,
      title: 'Benih Bunga Delima',
      desc: 'Benih delima tertanam hangat di dalam tanah gembur, menantikan siraman pengetahuan dari video, audio, dan game.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      stageIcon: '🌰',
    };
  }, [points]);

  // Modal Video Edukasi
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoSecondsWatched, setVideoSecondsWatched] = useState(0);
  const VIDEO_TOTAL_SECONDS = 25; // Durasi pemutaran penuh video edukasi sebelum klaim poin
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Modal Audio Relaksasi
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioSecondsElapsed, setAudioSecondsElapsed] = useState(0);
  const AUDIO_TOTAL_SECONDS = 30; // 30 detik untuk demo interaktif (atau 180 dtk)
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Modal Game Tebak Gambar ASI
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Video Timer Effect (Poin hanya bisa diklaim bila video sudah diputar hingga akhir)
  useEffect(() => {
    if (isVideoPlaying) {
      videoIntervalRef.current = setInterval(() => {
        setVideoSecondsWatched((prev) => {
          if (prev + 1 >= VIDEO_TOTAL_SECONDS) {
            clearInterval(videoIntervalRef.current as NodeJS.Timeout);
            setIsVideoPlaying(false);
            return VIDEO_TOTAL_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    }
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isVideoPlaying]);

  // Audio Timer Effect
  useEffect(() => {
    if (isAudioPlaying) {
      audioIntervalRef.current = setInterval(() => {
        setAudioSecondsElapsed((prev) => {
          if (prev + 1 >= AUDIO_TOTAL_SECONDS) {
            clearInterval(audioIntervalRef.current as NodeJS.Timeout);
            setIsAudioPlaying(false);
            return AUDIO_TOTAL_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isAudioPlaying]);

  const handleClaimVideoPoints = () => {
    if (!session) {
      openLoginDialog();
      return;
    }
    handleCompleteGardenActivity(
      'video',
      25,
      'Menonton Video Edukasi Pelekatan & Perawatan Bayi'
    );
    setIsVideoModalOpen(false);
  };

  const handleClaimAudioPoints = () => {
    if (!session) {
      openLoginDialog();
      return;
    }
    handleCompleteGardenActivity(
      'audio',
      25,
      'Mendengarkan Audio Relaksasi & Afirmasi Bunda'
    );
    setIsAudioModalOpen(false);
  };

  const handleAnswerGameOption = (optionIndex: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(optionIndex);
  };

  const handleSubmitGameAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setIsAnswerSubmitted(true);
    const q = ASI_GAME_QUESTIONS[currentGameIndex];
    if (q.options[selectedAnswerIndex].isCorrect) {
      setCorrectAnswersCount((c) => c + 1);
    }
  };

  const handleNextGameQuestion = () => {
    if (currentGameIndex + 1 < ASI_GAME_QUESTIONS.length) {
      setCurrentGameIndex((idx) => idx + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsGameFinished(true);
      if (!isGameDone && session) {
        handleCompleteGardenActivity(
          'game',
          50,
          'Menyelesaikan Game Tebak Gambar: Kecukupan ASI'
        );
      }
    }
  };

  const handleResetGame = () => {
    setCurrentGameIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setIsGameFinished(false);
  };

  return (
    <div className="space-y-7">
      {/* 1. BAR SIMULASI WAKTU / HARI (Khusus Pengujian Klien & Evaluator) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] border border-[#F5DCE4] bg-white p-3.5 sm:px-5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FBEDF1] text-[#C84B71] text-xs font-bold">
            <Clock className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#2A2D22]">
              Jadwal Pengerjaan Per 2 Hari &bull;{' '}
              <span className="text-[#C84B71]">Hari ke-{dayInfo.dayNumber} Aktif</span>
            </h4>
            <p className="text-[11px] text-[#767A6E]">
              Kegiatan terbuka bertahap: Video (Hari 1), Audio (Hari 3), Game ASI (Hari 5), Post-Test (Hari 7).
            </p>
          </div>
        </div>

        {/* Tombol Simulasi Hari */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-[#767A6E] mr-1 hidden md:inline">
            Uji Coba Hari:
          </span>
          {[
            { day: 1, label: 'Hari 1 (Video)' },
            { day: 3, label: 'Hari 3 (Audio)' },
            { day: 5, label: 'Hari 5 (Game)' },
            { day: 7, label: 'Hari 7 (Post-Test)' },
          ].map((item) => (
            <button
              key={item.day}
              type="button"
              onClick={() => handleSetSimulatedDay(item.day as 1 | 3 | 5 | 7)}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                dayInfo.dayNumber >= item.day &&
                (item.day === 7
                  ? dayInfo.dayNumber >= 7
                  : dayInfo.dayNumber < item.day + 2)
                  ? 'bg-[#C84B71] text-white shadow-xs'
                  : 'bg-[#FAF8FC] border border-[#ECE7F2] text-[#4A4D40] hover:bg-[#FDF2F5] hover:text-[#C84B71]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CARD UTAMA: KEBUN TANAMAN BUNGA DELIMA */}
      <div className="relative overflow-hidden rounded-[28px] border border-[#F2D7E0] bg-gradient-to-b from-white via-[#FFF8FA] to-[#FFF0F4] p-6 sm:p-8 shadow-[0_10px_32px_rgba(200,75,113,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Kolom Kiri: Visual Tanaman Bunga Delima SVG yang Tumbuh */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            <div className="relative h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center">
              {/* Lingkaran aura latar belakang */}
              <div
                className={`absolute inset-4 rounded-full filter blur-xl opacity-60 transition-colors duration-700 ${
                  points >= 100
                    ? 'bg-rose-300'
                    : points >= 75
                    ? 'bg-pink-200'
                    : points >= 50
                    ? 'bg-emerald-200'
                    : points >= 25
                    ? 'bg-lime-200'
                    : 'bg-amber-100'
                }`}
              />

              {/* Ilustrasi SVG Tanaman Sesuai Level Poin */}
              <svg
                viewBox="0 0 200 200"
                className="relative z-10 h-full w-full drop-shadow-md transition-all duration-700"
              >
                {/* Tanah Pot / Gundukan Tanah */}
                <ellipse cx="100" cy="170" rx="65" ry="16" fill="#8B5A2B" opacity="0.8" />
                <ellipse cx="100" cy="166" rx="55" ry="12" fill="#5C3A21" />

                {/* Level 1: Benih (0 - 24 Poin) */}
                {points < 25 && (
                  <g className="animate-pulse">
                    <ellipse
                      cx="100"
                      cy="158"
                      rx="12"
                      ry="8"
                      fill="#C84B71"
                      stroke="#8E3556"
                      strokeWidth="2"
                    />
                    <circle cx="98" cy="156" r="3" fill="#FFE4EC" opacity="0.7" />
                    {/* Tunas sangat kecil */}
                    <path
                      d="M 100 152 Q 102 144 105 142"
                      stroke="#65A30D"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </g>
                )}

                {/* Level 2: Tunas Hijau (25 - 49 Poin) */}
                {points >= 25 && points < 50 && (
                  <g className="transition-all duration-500">
                    <path
                      d="M 100 166 Q 99 140 100 120"
                      stroke="#4D7C0F"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Daun kiri */}
                    <path
                      d="M 100 140 Q 85 135 84 125 Q 92 125 100 135"
                      fill="#84CC16"
                      stroke="#4D7C0F"
                      strokeWidth="1.5"
                    />
                    {/* Daun kanan */}
                    <path
                      d="M 100 130 Q 115 125 116 115 Q 108 115 100 125"
                      fill="#65A30D"
                      stroke="#3F6212"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Level 3: Tanaman Berdaun Subur (50 - 74 Poin) */}
                {points >= 50 && points < 75 && (
                  <g className="transition-all duration-500">
                    <path
                      d="M 100 166 Q 98 135 100 95"
                      stroke="#3F6212"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Ranting kiri */}
                    <path
                      d="M 99 130 Q 82 122 75 108"
                      stroke="#3F6212"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <ellipse cx="72" cy="106" rx="9" ry="6" fill="#84CC16" transform="rotate(-30 72 106)" />
                    {/* Ranting kanan */}
                    <path
                      d="M 100 120 Q 118 112 125 98"
                      stroke="#3F6212"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <ellipse cx="128" cy="96" rx="9" ry="6" fill="#65A30D" transform="rotate(30 128 96)" />
                    {/* Daun pucuk atas */}
                    <ellipse cx="94" cy="90" rx="8" ry="5" fill="#84CC16" transform="rotate(-40 94 90)" />
                    <ellipse cx="106" cy="90" rx="8" ry="5" fill="#4D7C0F" transform="rotate(40 106 90)" />
                  </g>
                )}

                {/* Level 4: Kuncup Bunga Delima Merah (75 - 99 Poin) */}
                {points >= 75 && points < 100 && (
                  <g className="transition-all duration-500">
                    {/* Batang */}
                    <path
                      d="M 100 166 Q 98 125 100 85"
                      stroke="#3F6212"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Ranting samping */}
                    <path d="M 99 125 Q 78 115 72 98" stroke="#3F6212" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M 100 115 Q 122 105 128 88" stroke="#3F6212" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <ellipse cx="70" cy="95" rx="10" ry="6" fill="#65A30D" transform="rotate(-35 70 95)" />
                    <ellipse cx="130" cy="85" rx="10" ry="6" fill="#84CC16" transform="rotate(35 130 85)" />

                    {/* Kuncup Bunga Delima Merah di Pucuk */}
                    <ellipse cx="100" cy="74" rx="12" ry="16" fill="#BE123C" />
                    <ellipse cx="100" cy="72" rx="9" ry="14" fill="#E11D48" />
                    {/* Kelopak penutup kuncup */}
                    <path d="M 94 85 L 100 70 L 106 85 Z" fill="#4D7C0F" />
                    <circle cx="100" cy="62" r="3" fill="#FDA4AF" />
                  </g>
                )}

                {/* Level 5: Bunga Delima Mekar Merah Sempurna (100 Poin) */}
                {points >= 100 && (
                  <g className="animate-float">
                    {/* Batang Kokoh */}
                    <path
                      d="M 100 166 Q 98 120 100 85"
                      stroke="#3F6212"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Daun-daun Segar */}
                    <path d="M 99 130 Q 75 118 68 100" stroke="#3F6212" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M 100 118 Q 125 108 132 90" stroke="#3F6212" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <ellipse cx="65" cy="98" rx="12" ry="7" fill="#65A30D" transform="rotate(-35 65 98)" />
                    <ellipse cx="135" cy="88" rx="12" ry="7" fill="#84CC16" transform="rotate(35 135 88)" />

                    {/* Bunga Delima Merah Mekar Megah (Pomegranate Blossom) */}
                    {/* Kelopak Luar Merah Terang */}
                    <circle cx="100" cy="62" r="22" fill="#9F1239" opacity="0.3" />
                    <circle cx="85" cy="60" r="14" fill="#BE123C" />
                    <circle cx="115" cy="60" r="14" fill="#BE123C" />
                    <circle cx="100" cy="46" r="14" fill="#BE123C" />
                    <circle cx="100" cy="74" r="14" fill="#BE123C" />
                    <circle cx="90" cy="50" r="13" fill="#E11D48" />
                    <circle cx="110" cy="50" r="13" fill="#E11D48" />
                    <circle cx="90" cy="70" r="13" fill="#E11D48" />
                    <circle cx="110" cy="70" r="13" fill="#E11D48" />

                    {/* Mahkota Bunga Pusat & Putik Sari Emas Delima */}
                    <circle cx="100" cy="60" r="10" fill="#F43F5E" />
                    <circle cx="100" cy="60" r="6" fill="#FBBF24" />
                    <circle cx="97" cy="58" r="1.5" fill="#FFFBEB" />
                    <circle cx="103" cy="58" r="1.5" fill="#FFFBEB" />
                    <circle cx="100" cy="62" r="1.5" fill="#FFFBEB" />

                    {/* Kilauan Partikel Bintang (Sparkles) */}
                    <path d="M 74 38 L 76 43 L 81 45 L 76 47 L 74 52 L 72 47 L 67 45 L 72 43 Z" fill="#F59E0B" />
                    <path d="M 126 34 L 128 39 L 133 41 L 128 43 L 126 48 L 124 43 L 119 41 L 124 39 Z" fill="#F59E0B" />
                    <circle cx="130" cy="64" r="2" fill="#FBBF24" />
                    <circle cx="70" cy="68" r="2" fill="#FBBF24" />
                  </g>
                )}
              </svg>
            </div>

            {/* Badge Tahap Bunga */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold shadow-2xs ${plantStage.badgeColor}`}>
                <span className="text-sm">{plantStage.stageIcon}</span>
                <span>{plantStage.title}</span>
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Rincian Poin & Edukasi Pertumbuhan */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FBEDF1] px-3 py-1 text-xs font-bold text-[#C84B71] mb-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Taman Edukasi Ibu Nifas Buna Ceria</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#2A2D22]">
                Kebun Buah Delima Bunda
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#5F5B5D] leading-relaxed">
                {plantStage.desc}
              </p>
            </div>

            {/* Progress Bar Poin Menuju 100 */}
            <div className="rounded-2xl bg-white border border-[#F4E1E8] p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#2A2D22]">Akumulasi Poin Pertumbuhan</span>
                <span className="text-[#C84B71] text-sm">{points} / 100 Poin</span>
              </div>

              <div className="h-3.5 w-full rounded-full bg-[#FCE8EE] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E11D48] via-[#C84B71] to-[#BE123C] transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${Math.min(100, points)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#767A6E] pt-0.5">
                <span>0 Poin (Benih)</span>
                <span>50 Poin (Tanaman)</span>
                <span>100 Poin (Bunga Mekar Purna)</span>
              </div>
            </div>

            {/* Riwayat Poin Didapat */}
            {gardenState.activityLogs && gardenState.activityLogs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-[#767A6E]">Poin terkumpul dari:</span>
                {gardenState.activityLogs.map((log, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-full bg-[#F5F8EB] border border-[#E0E9C2] px-2.5 py-0.5 text-[11px] font-bold text-[#4D7C0F]"
                  >
                    <CheckCircle className="h-3 w-3" />
                    <span>+{log.pointsEarned} Poin: {log.title.split(':')[0]}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. DAFTAR 3 KEGIATAN PER 2 HARI (Video Hari 1, Audio Hari 3, Game ASI Hari 5) */}
      <section aria-labelledby="kegiatan-bunga-heading" className="space-y-4">
        <div>
          <h3
            id="kegiatan-bunga-heading"
            className="font-heading text-lg sm:text-xl font-bold text-[#2A2D22]"
          >
            3 Kegiatan Penambah Poin Bunga Delima
          </h3>
          <p className="text-xs text-[#767A6E]">
            Selesaikan kegiatan berkala per 2 hari untuk menyiram dan menumbuhkan Bunga Delima Bunda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* KEGIATAN 1: VIDEO (HARI 1, +25 POIN) */}
          <div
            className={`flex flex-col justify-between rounded-[24px] border p-5 transition-all ${
              isVideoDone
                ? 'bg-[#F9FCF4] border-green-200'
                : dayInfo.unlocked.video
                ? 'bg-white border-[#F5DCE4] shadow-xs hover:border-[#D9A7B8]'
                : 'bg-gray-50 border-gray-200 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FBEDF1] px-2.5 py-0.5 text-[11px] font-bold text-[#C84B71]">
                  Hari ke-1 &bull; +25 Poin
                </span>
                {isVideoDone ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                    <CheckCircle className="h-3 w-3" /> Selesai
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[#65A30D]">Terbuka</span>
                )}
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F4] text-[#C84B71]">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#2A2D22] leading-snug">
                    Nonton Video Edukasi
                  </h4>
                  <p className="text-[11px] text-[#767A6E]">Perawatan Masa Nifas &amp; Bayi</p>
                </div>
              </div>

              <p className="text-xs text-[#5F5B5D] leading-relaxed mt-2">
                Saksikan video interaktif panduan relaksasi pernapasan dan pelekatan menyusui yang nyaman.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
                  isVideoDone
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    : 'bg-[#C84B71] text-white hover:bg-[#B23B60] shadow-xs'
                }`}
              >
                <Play className="h-3.5 w-3.5" />
                <span>{isVideoDone ? 'Tonton Ulang Video' : 'Tonton & Dapatkan 25 Poin'}</span>
              </button>
            </div>
          </div>

          {/* KEGIATAN 2: AUDIO (HARI 3, +25 POIN) */}
          <div
            className={`flex flex-col justify-between rounded-[24px] border p-5 transition-all ${
              isAudioDone
                ? 'bg-[#F9FCF4] border-green-200'
                : dayInfo.unlocked.audio
                ? 'bg-white border-[#F5DCE4] shadow-xs hover:border-[#D9A7B8]'
                : 'bg-gray-50 border-gray-200 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-[11px] font-bold text-[#B45309]">
                  Hari ke-3 &bull; +25 Poin
                </span>
                {isAudioDone ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                    <CheckCircle className="h-3 w-3" /> Selesai
                  </span>
                ) : dayInfo.unlocked.audio ? (
                  <span className="text-[11px] font-semibold text-[#65A30D]">Terbuka</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                    <Lock className="h-3 w-3" /> Terbuka Hari ke-3
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#D97706]">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#2A2D22] leading-snug">
                    Dengarkan Audio Afirmasi
                  </h4>
                  <p className="text-[11px] text-[#767A6E]">Ketenangan Jiwa &amp; Napas Bunda</p>
                </div>
              </div>

              <p className="text-xs text-[#5F5B5D] leading-relaxed mt-2">
                Dengarkan audio panduan afirmasi positif dan ketenangan batin sampai selesai untuk menambah nutrisi bunga.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100">
              {dayInfo.unlocked.audio ? (
                <button
                  type="button"
                  onClick={() => setIsAudioModalOpen(true)}
                  className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
                    isAudioDone
                      ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      : 'bg-[#D97706] text-white hover:bg-[#B45309] shadow-xs'
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{isAudioDone ? 'Dengarkan Ulang Audio' : 'Dengarkan & Dapatkan 25 Poin'}</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Terbuka di Hari ke-3</span>
                </div>
              )}
            </div>
          </div>

          {/* KEGIATAN 3: GAME TEBAK GAMBAR ASI (HARI 5, +50 POIN) */}
          <div
            className={`flex flex-col justify-between rounded-[24px] border p-5 transition-all ${
              isGameDone
                ? 'bg-[#F9FCF4] border-green-200'
                : dayInfo.unlocked.game
                ? 'bg-white border-[#F5DCE4] shadow-xs hover:border-[#D9A7B8]'
                : 'bg-gray-50 border-gray-200 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EDE9FE] px-2.5 py-0.5 text-[11px] font-bold text-[#6D28D9]">
                  Hari ke-5 &bull; +50 Poin
                </span>
                {isGameDone ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                    <CheckCircle className="h-3 w-3" /> Selesai
                  </span>
                ) : dayInfo.unlocked.game ? (
                  <span className="text-[11px] font-semibold text-[#65A30D]">Terbuka</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                    <Lock className="h-3 w-3" /> Terbuka Hari ke-5
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#2A2D22] leading-snug">
                    Game Tebak Gambar ASI
                  </h4>
                  <p className="text-[11px] text-[#767A6E]">5 Soal Visual Tanda Kecukupan ASI</p>
                </div>
              </div>

              <p className="text-xs text-[#5F5B5D] leading-relaxed mt-2">
                Bermain tebak gambar interaktif tentang tanda kecukupan asupan ASI bayi. Menangkan 50 poin untuk memekarkan Bunga Delima!
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100">
              {dayInfo.unlocked.game ? (
                <button
                  type="button"
                  onClick={() => {
                    handleResetGame();
                    setIsGameModalOpen(true);
                  }}
                  className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold transition-all cursor-pointer ${
                    isGameDone
                      ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      : 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-xs'
                  }`}
                >
                  <Trophy className="h-3.5 w-3.5" />
                  <span>{isGameDone ? 'Mainkan Ulang Game' : 'Mulai Game & Raih 50 Poin'}</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Terbuka di Hari ke-5</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TAHAP AKHIR HARI KE-7: POST-TEST TINGKAT KECEMASAN PASS (31 SOAL) & QUIZ PEMAHAMAN (20 SOAL) */}
      <div
        className={`rounded-[26px] border p-6 sm:p-7 transition-all ${
          dayInfo.unlocked.posttestAnxiety
            ? 'border-[#F0C9D5] bg-gradient-to-r from-[#FFF5F8] via-white to-[#FDF4F7] shadow-sm'
            : 'border-gray-200 bg-gray-50/80 opacity-80'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                dayInfo.unlocked.posttestAnxiety
                  ? 'bg-[#C84B71] text-white shadow-xs'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Award className="h-6 w-6" />
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="rounded-full bg-[#FCE8EE] px-3 py-0.5 text-xs font-bold text-[#C84B71]">
                  Tahap Akhir &bull; Hari ke-7 (1x Pengerjaan)
                </span>
                {progress?.posttestAnxiety && progress?.posttestQuiz ? (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                    Selesai Dikerjakan (1x)
                  </span>
                ) : dayInfo.unlocked.posttestAnxiety ? (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                    Terbuka Hari Ini
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Terbuka di Hari ke-7
                  </span>
                )}
              </div>

              <h3 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                Post-Test Tingkat Kecemasan PASS (31 Soal) &amp; Quiz Pemahaman (20 Soal)
              </h3>
              <p className="text-xs sm:text-[13px] text-[#5F5B5D] max-w-2xl mt-1 leading-relaxed">
                Pada tahap akhir (Hari ke-7 setelah login pertama), Bunda mengerjakan Post-Test Skrining Kecemasan PASS (31 pertanyaan) bersamaan dengan Quiz Post-Test Pemahaman (20 pertanyaan dengan soal yang sama). Evaluasi akhir ini hanya dapat dikerjakan 1 kali.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 px-3 py-1 text-[11.5px] font-bold text-emerald-800">
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Nomor WA Terdaftar: <strong>{session?.phone || '0857-0130-8514'}</strong></span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center shrink-0">
            {progress?.posttestAnxiety && progress?.posttestQuiz ? (
              <span className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#F5F8EB] border border-[#C5D49B] px-5 text-xs font-bold text-[#56632A]">
                <CheckCircle className="h-4 w-4" />
                <span>Sudah Selesai (1x Pengerjaan)</span>
              </span>
            ) : dayInfo.unlocked.posttestAnxiety ? (
              <button
                type="button"
                onClick={() => {
                  if (!session) openLoginDialog();
                  else openAnxietyDialog('posttest');
                }}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#C84B71] px-6 text-xs font-bold text-white hover:bg-[#B23B60] shadow-xs transition-colors cursor-pointer"
              >
                <span>Kerjakan Post-Test &amp; Quiz Hari ke-7</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-gray-200 px-6 text-xs font-bold text-gray-500 cursor-not-allowed"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Terbuka di Hari ke-7</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================
          MODAL VIDEO EDUKASI (Hari ke-1)
         =================================================================== */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[28px] bg-white p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-[#C84B71]">
                  <Video className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#2A2D22]">
                    Video Edukasi: Pelekatan Menyusui &amp; Ketenangan Ibu
                  </h3>
                  <p className="text-[11px] text-[#767A6E]">Hari ke-1 &bull; Hadiah 25 Poin Bunga Delima</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsVideoPlaying(false);
                  setIsVideoModalOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Video Player Interaktif (Harus Diputar Hingga Akhir untuk Klaim Poin) */}
            <div className="relative aspect-video w-full rounded-2xl bg-neutral-900 overflow-hidden flex flex-col items-center justify-between text-white p-5 sm:p-6 shadow-inner">
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                  isVideoPlaying ? 'opacity-45 scale-105' : 'opacity-30 scale-100'
                }`}
                style={{ backgroundImage: "url('/hero-banner-beranda.webp')" }}
              />
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isVideoPlaying
                        ? 'bg-rose-500 animate-ping'
                        : videoSecondsWatched >= VIDEO_TOTAL_SECONDS
                        ? 'bg-emerald-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {videoSecondsWatched >= VIDEO_TOTAL_SECONDS
                      ? 'Video Selesai Diputar'
                      : isVideoPlaying
                      ? 'Sedang Memutar Video Edukasi...'
                      : 'Siap Diputar'}
                  </span>
                </span>
                <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-mono text-white/90">
                  00:{String(videoSecondsWatched).padStart(2, '0')} / 00:{String(VIDEO_TOTAL_SECONDS).padStart(2, '0')}
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-2.5 max-w-md my-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (videoSecondsWatched >= VIDEO_TOTAL_SECONDS) {
                      setVideoSecondsWatched(0);
                      setIsVideoPlaying(true);
                    } else {
                      setIsVideoPlaying((prev) => !prev);
                    }
                  }}
                  aria-label={isVideoPlaying ? 'Jeda video' : 'Putar video'}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C84B71]/90 hover:bg-[#C84B71] backdrop-blur-md text-white border-2 border-white/60 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {isVideoPlaying ? (
                    <Pause className="h-7 w-7" />
                  ) : (
                    <Play className="h-7 w-7 ml-1" />
                  )}
                </button>
                <p className="font-heading text-sm sm:text-base font-bold drop-shadow">
                  Tutorial Posisi Menyusui Ergonomis &amp; Pelekatan Efektif Masa Nifas
                </p>
                <p className="text-[11px] sm:text-xs text-white/85">
                  {videoSecondsWatched < 8
                    ? 'Bagian 1: Menyiapkan posisi duduk nyaman & menopang tubuh bayi...'
                    : videoSecondsWatched < 17
                    ? 'Bagian 2: Memastikan mulut bayi terbuka lebar & dagu menempel payudara...'
                    : videoSecondsWatched < VIDEO_TOTAL_SECONDS
                    ? 'Bagian 3: Mengenali hisapan efektif & refleks oksitosin yang tenang...'
                    : 'Selesai! Bunda kini dapat mengklaim 25 poin pertumbuhan Bunga Delima.'}
                </p>
              </div>

              {/* Progress Bar Video */}
              <div className="relative z-10 w-full space-y-1.5">
                <div className="h-2 w-full rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F08BA8] to-[#C84B71] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((videoSecondsWatched / VIDEO_TOTAL_SECONDS) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs text-[#5F5B5D] leading-relaxed">
                Catatan: Putar dan tonton video edukasi ini hingga selesai ({VIDEO_TOTAL_SECONDS} detik) untuk membuka tombol klaim 25 poin pertumbuhan Bunga Delima.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsVideoPlaying(false);
                  setIsVideoModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={videoSecondsWatched < VIDEO_TOTAL_SECONDS}
                onClick={handleClaimVideoPoints}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold shadow-xs transition-all ${
                  videoSecondsWatched >= VIDEO_TOTAL_SECONDS
                    ? 'bg-[#C84B71] hover:bg-[#B23B60] text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>
                  {videoSecondsWatched >= VIDEO_TOTAL_SECONDS
                    ? 'Klaim 25 Poin Tanaman'
                    : `Putar Video Hingga Akhir (${videoSecondsWatched}/${VIDEO_TOTAL_SECONDS} dtk)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL AUDIO RELAKSASI (Hari ke-3)
         =================================================================== */}
      {isAudioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-[28px] bg-white p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-[#D97706]">
                  <Headphones className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#2A2D22]">
                    Audio Afirmasi &amp; Relaksasi Napas
                  </h3>
                  <p className="text-[11px] text-[#767A6E]">Hari ke-3 &bull; Dengarkan hingga selesai (+25 Poin)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAudioPlaying(false);
                  setIsAudioModalOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Visual Gelombang Audio Interaktif */}
            <div className="rounded-2xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-6 text-center space-y-4 border border-amber-200 shadow-inner">
              <div className="flex justify-center items-end gap-1.5 h-16">
                {[12, 24, 40, 28, 52, 38, 48, 20, 34, 56, 30, 16].map((h, i) => (
                  <div
                    key={i}
                    className={`w-2.5 rounded-full transition-all duration-300 ${
                      isAudioPlaying
                        ? 'bg-[#B45309] animate-pulse'
                        : 'bg-amber-400'
                    }`}
                    style={{
                      height: isAudioPlaying ? `${Math.min(60, h * 1.2)}px` : `${h * 0.5}px`,
                    }}
                  />
                ))}
              </div>

              <div>
                <p className="font-heading text-sm font-bold text-[#78350F]">
                  &ldquo;Napas tenang, pikiran damai, tubuhku siap mengasihi si kecil.&rdquo;
                </p>
                <p className="text-xs text-[#92400E] mt-1">
                  Waktu: {audioSecondsElapsed} / {AUDIO_TOTAL_SECONDS} detik
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAudioPlaying((p) => !p)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B45309] text-white hover:bg-[#92400E] shadow-md transition-all cursor-pointer"
                >
                  {isAudioPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#5F5B5D] leading-relaxed">
              Catatan: Dengarkan audio hingga selesai ({AUDIO_TOTAL_SECONDS} detik) untuk dapat mengklaim tambahan 25 poin bagi pertumbuhan Bunga Delima.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsAudioPlaying(false);
                  setIsAudioModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full"
              >
                Tutup
              </button>

              <button
                type="button"
                disabled={audioSecondsElapsed < AUDIO_TOTAL_SECONDS}
                onClick={handleClaimAudioPoints}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold shadow-xs transition-all ${
                  audioSecondsElapsed >= AUDIO_TOTAL_SECONDS
                    ? 'bg-[#B45309] hover:bg-[#92400E] text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Klaim 25 Poin Bunga Delima</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL GAME TEBAK GAMBAR KECUKUPAN ASI (Hari ke-5)
         =================================================================== */}
      {isGameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[28px] bg-white p-5 sm:p-7 shadow-2xl border border-gray-100 my-auto space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-[#7C3AED]">
                  <Gamepad2 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#2A2D22]">
                    Game Tebak Gambar: Materi Kecukupan ASI
                  </h3>
                  <p className="text-[11px] text-[#767A6E]">
                    Soal {currentGameIndex + 1} dari {ASI_GAME_QUESTIONS.length} &bull; Hadiah 50 Poin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGameModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!isGameFinished ? (
              (() => {
                const currentQ = ASI_GAME_QUESTIONS[currentGameIndex];
                return (
                  <div className="space-y-4">
                    {/* Clue Visual & Pertanyaan */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-[#FAF8FC] border border-[#ECE7F2] p-4">
                      <div className="relative h-28 w-28 shrink-0 rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-2xs">
                        <Image
                          src={currentQ.clueImage}
                          alt={currentQ.imageAlt}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED]">
                          Petunjuk Visual: {currentQ.title}
                        </span>
                        <h4 className="font-heading text-sm sm:text-base font-bold text-[#2A2D22] leading-snug">
                          {currentQ.question}
                        </h4>
                      </div>
                    </div>

                    {/* Opsi Jawaban */}
                    <div className="space-y-2">
                      {currentQ.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswerIndex === optIdx;
                        let optionStyle = 'bg-white border-gray-200 hover:border-purple-300';
                        if (isAnswerSubmitted) {
                          if (opt.isCorrect) {
                            optionStyle = 'bg-green-50 border-green-500 text-green-900 font-bold';
                          } else if (isSelected && !opt.isCorrect) {
                            optionStyle = 'bg-red-50 border-red-400 text-red-900 font-bold';
                          } else {
                            optionStyle = 'bg-gray-50 border-gray-200 opacity-60';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-purple-50 border-purple-500 text-purple-900 font-bold ring-1 ring-purple-400';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswerSubmitted}
                            onClick={() => handleAnswerGameOption(optIdx)}
                            className={`w-full flex items-center justify-between rounded-xl p-3.5 border text-left text-xs sm:text-[13px] transition-all cursor-pointer ${optionStyle}`}
                          >
                            <span>{opt.text}</span>
                            {isAnswerSubmitted && opt.isCorrect && (
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Penjelasan jika sudah dijawab */}
                    {isAnswerSubmitted && (
                      <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-xs text-[#5B21B6] leading-relaxed animate-fadeIn">
                        <strong>Ulasan Bidan:</strong> {currentQ.explanation}
                      </div>
                    )}

                    {/* Tombol Navigasi Soal */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-[#767A6E]">
                        Benar: {correctAnswersCount} / {ASI_GAME_QUESTIONS.length}
                      </span>

                      {!isAnswerSubmitted ? (
                        <button
                          type="button"
                          disabled={selectedAnswerIndex === null}
                          onClick={handleSubmitGameAnswer}
                          className={`rounded-full px-5 py-2.5 text-xs font-bold shadow-xs transition-all ${
                            selectedAnswerIndex !== null
                              ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Kunci Jawaban
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleNextGameQuestion}
                          className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 text-xs font-bold shadow-xs cursor-pointer"
                        >
                          {currentGameIndex + 1 < ASI_GAME_QUESTIONS.length
                            ? 'Soal Berikutnya'
                            : 'Lihat Hasil Game'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Tampilan Selesai Game */
              <div className="text-center py-6 space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-700 mx-auto text-3xl">
                  🏆
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-[#2A2D22]">
                    Luar Biasa, Bunda Hebat!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5F5B5D] max-w-md mx-auto mt-1 leading-relaxed">
                    Bunda berhasil menjawab benar {correctAnswersCount} dari {ASI_GAME_QUESTIONS.length} pertanyaan seputar kecukupan ASI si kecil.
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 p-4 max-w-sm mx-auto">
                  <span className="text-xs font-bold text-purple-800">
                    +50 Poin Pertumbuhan Berhasil Ditambahkan!
                  </span>
                  <p className="text-[11px] text-[#6D28D9] mt-0.5">
                    Bunga Delima Bunda kini bertumbuh mekar sempurna!
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleResetGame}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Main Lagi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGameModalOpen(false)}
                    className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Tutup &amp; Lihat Bunga Delima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
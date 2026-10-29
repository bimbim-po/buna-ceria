'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle,
  Clock,
  Heart,
  HeartHandshake,
  HelpCircle,
  Mail,
  Maximize2,
  MessageCircle,
  Phone,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCheck,
  X,
} from 'lucide-react';
import {
  getExperts,
  getFooterContact,
  getModules,
  getTips,
} from '@/lib/api';
import { AppMode, useApp } from '@/context/AppContext';
import { SplashScreen } from '@/components/SplashScreen';
import { LandingPage } from '@/components/LandingPage';
import { Header } from '@/components/Header';
import { SidebarNav } from '@/components/SidebarNav';
import { StageTracker } from '@/components/StageTracker';
import { StagePanel } from '@/components/StagePanel';
import { ModuleReader } from '@/components/ModuleReader';
import { FeelingSelector } from '@/components/FeelingSelector';
import { TipCard } from '@/components/TipCard';

const LoginDialog = dynamic(
  () => import('@/components/LoginDialog').then((mod) => mod.LoginDialog),
  { ssr: false }
);

const AnxietyDialog = dynamic(
  () => import('@/components/AnxietyDialog').then((mod) => mod.AnxietyDialog),
  { ssr: false }
);

const QuizRunner = dynamic(
  () => import('@/components/QuizRunner').then((mod) => mod.QuizRunner),
  { ssr: false }
);

const ResultSummary = dynamic(
  () => import('@/components/ResultSummary').then((mod) => mod.ResultSummary),
  { ssr: false }
);

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface UnifiedCard {
  id: string;
  orderNumber: string;
  title: string;
  category: string;
  description: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  cardGradient: string;
  cardBorder: string;
  imageSrc: string;
  imageAlt: string;
  type: 'module' | 'quiz' | 'reflection';
  moduleId?: string;
  readingTime: string;
  infoOverview: string;
  infoKeyPoints: string[];
}

const UNIFIED_LEARNING_CARDS: UnifiedCard[] = [
  {
    id: 'modul-1',
    orderNumber: '01',
    title: 'Mengenali Perubahan & Ketenangan Diri',
    category: 'Tahap Awal Kehamilan',
    description: 'Memahami perubahan hormon dan rutinitas relaksasi 4 menit untuk menenangkan pikiran.',
    badgeText: 'Modul 01',
    badgeBg: 'bg-[#FCE8EE]',
    badgeTextColor: 'text-[#C84B71]',
    cardGradient: 'bg-gradient-to-br from-[#FFF0F4] via-[#FCE9EE] to-[#FCE4EC]',
    cardBorder: 'border-pink-200/80 hover:border-pink-300',
    imageSrc: '/modul-3d-1.webp',
    imageAlt: 'Ilustrasi 3D Ketenangan Diri dan Meditasi Ibu Hamil',
    type: 'module',
    moduleId: 'materi-1',
    readingTime: '4 mnt baca',
    infoOverview: 'Modul pengantar ramah untuk membantu Ibu beradaptasi dengan perubahan hormonal, fisik, dan suasana hati di masa kehamilan secara tenang.',
    infoKeyPoints: [
      'Memahami bahwa perubahan emosi adalah hal fisiologis yang wajar',
      'Teknik pernapasan relaksasi 5 menit di pagi hari untuk meredakan ketegangan',
      'Mencatat hal-hal kecil yang disyukuri setiap hari',
    ],
  },
  {
    id: 'modul-2',
    orderNumber: '02',
    title: 'Kenyamanan Harian & Istirahat Berkualitas',
    category: 'Keseharian & Relaksasi',
    description: 'Menata posisi tidur nyaman dengan bantal hamil dan menjaga kesegaran tubuh Ibu.',
    badgeText: 'Modul 02',
    badgeBg: 'bg-[#FFEADA]',
    badgeTextColor: 'text-[#D97706]',
    cardGradient: 'bg-gradient-to-br from-[#FFF5EC] via-[#FFEEDF] to-[#FFE7D4]',
    cardBorder: 'border-orange-200/80 hover:border-orange-300',
    imageSrc: '/modul-3d-2.webp',
    imageAlt: 'Ilustrasi 3D Bantal Hamil dan Istirahat Nyaman',
    type: 'module',
    moduleId: 'materi-2',
    readingTime: '5 mnt baca',
    infoOverview: 'Kualitas tidur yang baik sangat penting bagi kebugaran Ibu dan pertumbuhan janin. Modul ini mengulas posisi tidur ergonomis dan kebiasaan santai sebelum tidur.',
    infoKeyPoints: [
      'Posisi tidur miring ke kiri untuk sirkulasi darah optimal',
      'Manfaat penggunaan bantal penyangga perut dan panggul',
      'Rutinitas tanpa layar gawai 30 menit sebelum istirahat',
    ],
  },
  {
    id: 'modul-3',
    orderNumber: '03',
    title: 'Komunikasi Hangat Bersama Pasangan',
    category: 'Dukungan Sosial & Keluarga',
    description: 'Cara santun berbagi rasa dan menyampaikan kebutuhan bersama pasangan tercinta.',
    badgeText: 'Modul 03',
    badgeBg: 'bg-[#F5F7EA]',
    badgeTextColor: 'text-[#56632A]',
    cardGradient: 'bg-gradient-to-br from-[#F5F8EB] via-[#EDF3DC] to-[#E5ECD0]',
    cardBorder: 'border-[#D5DCB6] hover:border-[#A8B371]',
    imageSrc: '/modul-3d-3.webp',
    imageAlt: 'Ilustrasi 3D Dukungan Pasangan dan Kasih Sayang',
    type: 'module',
    moduleId: 'materi-3',
    readingTime: '4 mnt baca',
    infoOverview: 'Kehamilan adalah perjalanan tim antara Ibu dan pasangan. Temukan panduan praktis untuk berdiskusi terbuka tentang perasaan dan pembagian peran.',
    infoKeyPoints: [
      'Mengungkapkan kebutuhan tanpa rasa bersalah atau menuntut',
      'Melibatkan pasangan dalam persiapan kelahiran dan perawatan diri',
      'Membangun ikatan batin hangat bersama janin',
    ],
  },
  {
    id: 'modul-4',
    orderNumber: '04',
    title: 'Kesiapan Menjelang Persalinan',
    category: 'Persiapan & Hari Kelahiran',
    description: 'Daftar perlengkapan tas rumah sakit dan langkah tenang menyambut kelahiran bayi.',
    badgeText: 'Modul 04',
    badgeBg: 'bg-[#E6F7F3]',
    badgeTextColor: 'text-[#0D9488]',
    cardGradient: 'bg-gradient-to-br from-[#EDF9F6] via-[#E0F4EF] to-[#D5EFE8]',
    cardBorder: 'border-teal-200/80 hover:border-teal-300',
    imageSrc: '/modul-3d-4.webp',
    imageAlt: 'Ilustrasi 3D Tas Persalinan Rumah Sakit dan Perlengkapan Bayi',
    type: 'module',
    moduleId: 'materi-4',
    readingTime: '5 mnt baca',
    infoOverview: 'Persiapan yang matang memberikan ketenangan batin. Pelajari checklist barang bawaan ke faskes dan tanda awal persalinan yang harus dipahami.',
    infoKeyPoints: [
      'Checklist tas bersalin untuk Ibu, bayi, dan dokumen penting',
      'Mengenali tanda-tanda awal persalinan dan kontraksi',
      'Menyiapkan rute transportasi darurat dan kontak bidan',
    ],
  },
  {
    id: 'kuis-evaluasi',
    orderNumber: '05',
    title: 'Kuis Pemahaman Kehamilan',
    category: 'Evaluasi Pembelajaran',
    description: '8 soal interaktif dengan ulasan lembut untuk memperkuat pemahaman materi.',
    badgeText: 'Tahap 05',
    badgeBg: 'bg-[#FEF3C7]',
    badgeTextColor: 'text-[#B45309]',
    cardGradient: 'bg-gradient-to-br from-[#FFFBEB] via-[#FEF5D0] to-[#FEF0C7]',
    cardBorder: 'border-amber-200/80 hover:border-amber-300',
    imageSrc: '/modul-3d-5.webp',
    imageAlt: 'Ilustrasi 3D Piala Kuis dan Lembar Centang Hijau',
    type: 'quiz',
    readingTime: '8 Soal Kuis',
    infoOverview: 'Uji pemahaman santai tanpa rasa cemas. Terdapat 8 pertanyaan pilihan ganda yang disertai pembahasan ramah di setiap jawaban.',
    infoKeyPoints: [
      '8 soal pilihan ganda dari intisari 4 modul kehamilan',
      'Penjelasan langsung untuk setiap jawaban benar maupun salah',
      'Dapat diulang kapan saja dan tersimpan di riwayat belajar',
    ],
  },
  {
    id: 'refleksi-hasil',
    orderNumber: '06',
    title: 'Refleksi Diri & Hasil Belajar',
    category: 'Rangkuman & Pencapaian',
    description: 'Tandai langkah kecil kesiapan dan lihat rangkuman pencapaian belajar Ibu.',
    badgeText: 'Tahap 06',
    badgeBg: 'bg-[#EDE9FE]',
    badgeTextColor: 'text-[#6D28D9]',
    cardGradient: 'bg-gradient-to-br from-[#F5F0FF] via-[#EFE6FD] to-[#EAE0FA]',
    cardBorder: 'border-purple-200/80 hover:border-purple-300',
    imageSrc: '/modul-3d-6.webp',
    imageAlt: 'Ilustrasi 3D Jurnal Refleksi dan Permata Kasih',
    type: 'reflection',
    readingTime: 'Hasil & Jurnal',
    infoOverview: 'Ruang jeda penuh makna untuk mengevaluasi komitmen harian merawat diri dan melihat rangkuman capaian belajar Ibu Kasih.',
    infoKeyPoints: [
      'Refleksi afirmasi positif untuk ketenangan pikiran',
      'Daftar komitmen langkah kecil merawat tubuh',
      'Rangkuman lengkap perjalanan belajar Teman Kasih',
    ],
  },
];

const MODULE_PREVIEW_IMAGES: Record<number, string> = {
  1: '/scan-1.jpg',
  2: '/scan-2.jpg',
  3: '/scan-3.jpg',
  4: '/scan-4.jpg',
};

export function HomeContent({ initialMode }: { initialMode?: AppMode }) {
  const {
    appMode,
    activeSection,
    setActiveSection,
    enterWebApp,
    session,
    progress,
    moduleStatuses,
    activeModuleId,
    openLoginDialog,
    openAnxietyDialog,
    openModuleReader,
    closeModuleReader,
    handleCompleteModule,
  } = useApp();

  const prefersReducedMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [savedTipIds, setSavedTipIds] = useState<string[]>([]);
  const [selectedInfoCard, setSelectedInfoCard] = useState<UnifiedCard | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);

  const modules = getModules();
  const tips = getTips();
  const experts = getExperts();
  const footerContact = getFooterContact();

  const handleCardClick = (card: UnifiedCard) => {
    if (card.type === 'module' && card.moduleId) {
      openModuleReader(card.moduleId);
    } else if (card.type === 'quiz') {
      if (!session) {
        openLoginDialog();
      } else {
        setIsQuizModalOpen(true);
      }
    } else if (card.type === 'reflection') {
      if (!session) {
        openLoginDialog();
      } else {
        setIsReflectionModalOpen(true);
      }
    }
  };

  // Sinkronkan initialMode bila dibuka langsung dari rute /belajar
  React.useEffect(() => {
    if (initialMode === 'webapp') {
      enterWebApp();
    }
  }, [initialMode, enterWebApp]);

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSaveTip = (tipId: string) => {
    setSavedTipIds((prev) =>
      prev.includes(tipId)
        ? prev.filter((id) => id !== tipId)
        : [...prev, tipId]
    );
  };

  const completedModules = progress?.completedModuleIds.length ?? 0;
  const completedStages = progress?.completedStageIds.length ?? 0;

  const totalCompletedActivities =
    (moduleStatuses['materi-1'] === 'selesai' ? 1 : 0) +
    (moduleStatuses['materi-2'] === 'selesai' ? 1 : 0) +
    (moduleStatuses['materi-3'] === 'selesai' ? 1 : 0) +
    (moduleStatuses['materi-4'] === 'selesai' ? 1 : 0) +
    ((progress?.bestQuizScore ?? 0) > 0 || progress?.completedStageIds.includes('quiz') ? 1 : 0) +
    (progress?.completedStageIds.includes('hasil-saya') || (progress?.reflectionSelectedItems?.length ?? 0) > 0 ? 1 : 0);

  // Filter pencarian sederhana untuk materi dan tips
  const filteredModules = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTips = tips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewTransitionProps = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: 0.25, ease: CUSTOM_EASE },
  };

  return (
    <>
      <SplashScreen />

      {appMode === 'landing' ? (
        <LandingPage />
      ) : (
        /* =====================================================================
           WEBAPP PEMBELAJARAN (FULL SCREEN EDGE-TO-EDGE)
           Tata letak sesuai instruksi klien:
           - Beranda: Sapa perasaan pengguna & pintasan ke fitur utama
           - Materi Kehamilan: Tingkatan materi belajar (stepper) & 4 modul materi
           - Tips Kehamilan: Tips harian dengan fitur bookmark
           - Kontak Ahli: Daftar bidan & konselor via WhatsApp
           - Pengaturan: Profil pengguna & kuesioner perasaan
           ===================================================================== */
        <div className="flex h-screen w-full overflow-hidden bg-white text-[#2A2D22]">
          {/* 1. NAVBAR DI KIRI */}
          <aside
            aria-label="Sidebar WebApp"
            className="hidden lg:block lg:w-64 lg:shrink-0 h-full border-r border-[#F0ECF5] bg-white select-none"
          >
            <SidebarNav
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
            />
          </aside>

          {/* 2. AREA UTAMA DASHBOARD */}
          <div className="flex min-w-0 flex-1 flex-col h-full bg-white">
            {/* Top Bar Bersih */}
            <Header
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Viewport Konten Scrollable */}
            <main
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-12 w-full bg-white"
            >
              <div className="mx-auto max-w-6xl space-y-8 pb-16">
                <AnimatePresence mode="wait">
                  {/* =========================================================
                      1. BERANDA WEBAPP (Sapa Perasaan & Pintasan Fitur)
                     ========================================================= */}
                  {activeSection === 'beranda' && (
                    <motion.div
                      key="view-beranda"
                      {...viewTransitionProps}
                      className="space-y-8"
                    >
                      {/* Top Header Card: Ringkas & Hangat */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[22px] bg-[#FAF8FC] border border-[#F0ECF5] p-5 sm:p-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FCE8EE] px-2.5 py-0.5 text-[11px] font-bold text-[#C84B71]">
                              <Sparkles className="h-3 w-3" />
                              <span>Ruang Belajar Tenang</span>
                            </span>
                            <span className="text-xs text-[#767A6E]">
                              {session?.trimesterLabel ?? 'Trimester Pertama'}
                            </span>
                          </div>
                          <h1 className="mt-1.5 font-heading text-xl sm:text-2xl font-bold text-[#2A2D22]">
                            Selamat datang, {session ? session.name : 'Ibu Kasih'}
                          </h1>
                          <p className="mt-0.5 text-xs text-[#6E6A6C]">
                            Lanjutkan pembelajaran kehamilan hari ini secara perlahan dan menenangkan.
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (!session) openLoginDialog();
                              else openAnxietyDialog();
                            }}
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-pink-200 bg-white px-4 py-1.5 text-xs font-bold text-[#C84B71] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
                          >
                            <Heart className="h-3.5 w-3.5" />
                            <span>Kuesioner Perasaan</span>
                          </button>
                        </div>
                      </div>

                      {/* A. PERTANYAAN PERASAAN USER */}
                      <section aria-labelledby="perasaan-heading">
                        <FeelingSelector />
                      </section>

                      {/* B. KARTU PINTAS MENU FITUR UTAMA */}
                      <section aria-labelledby="fitur-pintas-heading">
                        <div className="flex items-center justify-between mb-3">
                          <h2
                            id="fitur-pintas-heading"
                            className="font-heading text-base font-bold text-[#2A2D22]"
                          >
                            Fitur Pembelajaran Teman Kasih
                          </h2>
                          <span className="text-xs text-[#767A6E]">
                            Pilih menu untuk memulai
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          {/* Tile 1: Materi Kehamilan (Alur Belajar & Modul) */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('materi')}
                            className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-pink-200 hover:shadow-[0_10px_24px_rgba(200,75,113,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF2F5] text-[#C84B71] transition-transform group-hover:scale-105">
                                <BookOpen className="h-5 w-5" />
                              </span>
                              <h3 className="mt-3.5 font-heading text-sm font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors">
                                Materi Kehamilan
                              </h3>
                              <p className="mt-1 text-xs text-[#767A6E]">
                                Tingkatan alur belajar 5 tahap &amp; 4 modul kehamilan fokus layar penuh.
                              </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-[#C84B71]">
                              <span>{completedStages}/5 Tahap Selesai</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>

                          {/* Tile 2: Tips Kehamilan */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('tips')}
                            className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-green-200 hover:shadow-[0_10px_24px_rgba(80,110,50,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF7EE] text-green-700 transition-transform group-hover:scale-105">
                                <Sun className="h-5 w-5" />
                              </span>
                              <h3 className="mt-3.5 font-heading text-sm font-bold text-[#2A2D22] group-hover:text-green-700 transition-colors">
                                Tips Kehamilan
                              </h3>
                              <p className="mt-1 text-xs text-[#767A6E]">
                                Langkah kecil harian merawat tubuh dan ketenangan pikiran.
                              </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-green-700">
                              <span>{savedTipIds.length} Tersimpan</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>

                          {/* Tile 3: Kontak Ahli */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('kontak-ahli')}
                            className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-blue-200 hover:shadow-[0_10px_24px_rgba(50,80,160,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-105">
                                <HeartHandshake className="h-5 w-5" />
                              </span>
                              <h3 className="mt-3.5 font-heading text-sm font-bold text-[#2A2D22] group-hover:text-blue-600 transition-colors">
                                Kontak Ahli
                              </h3>
                              <p className="mt-1 text-xs text-[#767A6E]">
                                Konsultasi langsung via WhatsApp dengan bidan &amp; konselor.
                              </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-blue-600">
                              <span>4 Tenaga Medis</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>
                        </div>
                      </section>

                      {/* Footer WebApp Narahubung */}
                      <footer className="rounded-[24px] border border-[#ECE7F2] bg-[#FAF8FC] p-6 sm:p-7">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 items-center">
                          <div className="lg:col-span-7">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                              Narahubung Program Teman Kasih
                            </span>
                            <h3 className="font-heading text-base font-bold text-[#2A2D22] mt-0.5">
                              {footerContact.personInCharge}
                            </h3>
                            <p className="text-xs text-[#767A6E]">
                              {footerContact.role}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-[#767A6E]">
                              {footerContact.disclaimerText}
                            </p>
                          </div>

                          <div className="lg:col-span-5 flex flex-col gap-2.5 sm:items-end">
                            <a
                              href={`mailto:${footerContact.email}`}
                              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#ECE7F2] px-4 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-gray-50 transition-colors"
                            >
                              <Mail className="h-3.5 w-3.5 text-[#C84B71]" />
                              <span>{footerContact.email}</span>
                            </a>

                            <a
                              href={`https://wa.me/${footerContact.whatsappNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-[#EBF7EE] border border-green-200 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-100 transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              <span>WhatsApp: {footerContact.displayWhatsapp}</span>
                            </a>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-[#ECE7F2] pt-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A09CA8]">
                          <span>{footerContact.copyrightText}</span>
                          <span>Teman Kasih • Edukasi Kehamilan</span>
                        </div>
                      </footer>
                    </motion.div>
                  )}

                  {/* =========================================================
                      2. HALAMAN KHUSUS: MATERI KEHAMILAN
                         (Memuat Tingkatan Materi Belajar + 4 Modul Materi)
                     ========================================================= */}
                  {activeSection === 'materi' && (
                    <motion.div
                      key="view-materi"
                      {...viewTransitionProps}
                      className="space-y-8"
                    >
                      {/* Header Halaman Materi */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] bg-[#FAF8FC] border border-[#ECE7F2] p-6 sm:p-7">
                        <div>
                          <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-[#C84B71]">
                            Kurikulum Terpadu Teman Kasih
                          </span>
                          <h1 className="mt-2.5 font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                            Modul &amp; Materi Kehamilan
                          </h1>
                          <p className="mt-1 text-xs sm:text-sm text-[#767A6E]">
                            Pelajari 4 modul kehamilan interaktif, ulas pemahaman dengan kuis ramah, dan catat refleksi diri dalam satu kurikulum terpadu.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="rounded-full bg-white border border-[#ECE7F2] px-3.5 py-1.5 text-xs font-bold text-[#C84B71]">
                            {totalCompletedActivities}/6 Aktivitas Selesai
                          </span>
                          <span className="rounded-full bg-white border border-[#ECE7F2] px-3.5 py-1.5 text-xs font-bold text-[#56632A]">
                            {completedModules}/4 Modul
                          </span>
                        </div>
                      </div>

                      {/* =====================================================================
                          KURIKULUM 6 KARTU MODUL & MATERI (1 JADI 1 SAJA)
                          Desain Card Modern dengan Ilustrasi 3D yang "Menjulang Keluar",
                          Pastel Gradient Menenangkan, dan Tombol Info "?" Interaktif
                          ===================================================================== */}
                      <section aria-labelledby="kurikulum-materi-heading" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                              Pilihan Pembelajaran Interaktif
                            </span>
                            <h2
                              id="kurikulum-materi-heading"
                              className="font-heading text-xl font-bold text-[#2A2D22]"
                            >
                              Jelajahi Modul &amp; Evaluasi
                            </h2>
                          </div>
                          <span className="text-xs text-[#767A6E]">
                            Klik kartu untuk membuka &bull; Klik &ldquo;?&rdquo; untuk ringkasan
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 overflow-visible pt-1">
                          {UNIFIED_LEARNING_CARDS.map((card) => {
                            let isDone = false;
                            if (card.type === 'module' && card.moduleId) {
                              isDone = moduleStatuses[card.moduleId] === 'selesai';
                            } else if (card.type === 'quiz') {
                              isDone =
                                (progress?.bestQuizScore ?? 0) > 0 ||
                                (progress?.completedStageIds.includes('quiz') ?? false);
                            } else if (card.type === 'reflection') {
                              isDone =
                                (progress?.completedStageIds.includes('hasil-saya') ?? false) ||
                                ((progress?.reflectionSelectedItems?.length ?? 0) > 0);
                            }

                            return (
                              <div
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                className={`group relative overflow-visible rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border ${card.cardBorder} ${card.cardGradient} shadow-2xs hover:shadow-[0_16px_36px_rgba(40,40,60,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer min-h-[220px] sm:min-h-[235px] flex flex-col justify-between`}
                              >
                                {/* Top Row: Badge + Category on Left, "?" Button on Right */}
                                <div className="flex items-center justify-between gap-3 relative z-10">
                                  <div className="inline-flex items-center gap-2">
                                    <span
                                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${card.badgeBg} ${card.badgeTextColor} shadow-2xs`}
                                    >
                                      <Sparkles className="h-3 w-3" />
                                      <span>{card.badgeText}</span>
                                    </span>
                                    <span className="text-[11px] font-semibold text-[#767A6E]">
                                      {card.category}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedInfoCard(card);
                                    }}
                                    title={`Lihat ringkasan ${card.title}`}
                                    aria-label={`Informasi ${card.title}`}
                                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white text-[#4A4D40] hover:text-[#111] text-xs font-black shadow-2xs hover:shadow-xs transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
                                  >
                                    ?
                                  </button>
                                </div>

                                {/* Content: Title, Description, and Action CTA */}
                                <div className="mt-3.5 relative z-10 max-w-[62%] sm:max-w-[65%] space-y-1.5">
                                  <h3 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22] leading-snug group-hover:text-[#C84B71] transition-colors">
                                    {card.title}
                                  </h3>
                                  <p className="text-xs text-[#555] leading-relaxed line-clamp-2">
                                    {card.description}
                                  </p>

                                  <div className="pt-2 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#767A6E]">
                                      <Clock className="h-3 w-3" />
                                      <span>{card.readingTime}</span>
                                    </span>
                                    <span className="text-[#8C8896] text-[10px]">&bull;</span>
                                    {isDone ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100/90 rounded-full px-2.5 py-0.5">
                                        <Check className="h-3 w-3" />
                                        <span>Selesai</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C84B71] group-hover:translate-x-0.5 transition-transform">
                                        <span>
                                          {card.type === 'module'
                                            ? 'Mulai Baca'
                                            : card.type === 'quiz'
                                            ? 'Mulai Kuis'
                                            : 'Mulai Refleksi'}
                                        </span>
                                        <ArrowRight className="h-3 w-3" />
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* 3D Illustration yang "menjulang keluar" (Pop-Out Effect) */}
                                <div className="absolute -bottom-2.5 -right-2 sm:-bottom-3.5 sm:-right-3 md:-bottom-4 md:-right-4 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 pointer-events-none transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2 group-hover:translate-x-1 z-20">
                                  <Image
                                    src={card.imageSrc}
                                    alt={card.imageAlt}
                                    fill
                                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 170px, 190px"
                                    className="object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.12)]"
                                    priority={card.orderNumber === '01' || card.orderNumber === '02'}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {/* -----------------------------------------------------
                          C. TIPS KEHAMILAN DI BAWAH 4 MATERI
                          (Sesuai instruksi klien: Di bawah 4 materi dikasih tips)
                         ----------------------------------------------------- */}
                      <section aria-labelledby="tips-bawah-materi-heading" className="pt-6 border-t border-[#F0ECF5]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                              Panduan Praktis Harian
                            </span>
                            <h2
                              id="tips-bawah-materi-heading"
                              className="font-heading text-xl font-bold text-[#2A2D22]"
                            >
                              Tips untuk Kehamilan
                            </h2>
                            <p className="text-xs text-[#767A6E]">
                              Langkah kecil merawat kenyamanan dan ketenangan sehari-hari
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectSection('tips')}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-white px-4 py-1.5 text-xs font-bold text-[#C84B71] hover:bg-[#FDF2F5] transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <span>Lihat Semua Tips</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {tips.slice(0, 3).map((tip, idx) => (
                            <TipCard
                              key={tip.id}
                              tip={tip}
                              orderNumber={idx + 1}
                              isSaved={savedTipIds.includes(tip.id)}
                              onToggleSave={toggleSaveTip}
                            />
                          ))}
                        </div>
                      </section>

                      {/* -----------------------------------------------------
                          D. KONTAK AHLI DI BAWAH TIPS KEHAMILAN
                          (Sesuai instruksi klien: Di taru kontak ahli di bawah tips)
                         ----------------------------------------------------- */}
                      <section aria-labelledby="kontak-bawah-tips-heading" className="pt-6 border-t border-[#F0ECF5]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                              Dukungan Bidan Terverifikasi
                            </span>
                            <h2
                              id="kontak-bawah-tips-heading"
                              className="font-heading text-xl font-bold text-[#2A2D22]"
                            >
                              Kontak Ahli Pendamping
                            </h2>
                            <p className="text-xs text-[#767A6E]">
                              Tersambung langsung via WhatsApp untuk konsultasi keluhan
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectSection('kontak-ahli')}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-white px-4 py-1.5 text-xs font-bold text-[#C84B71] hover:bg-[#FDF2F5] transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <span>Daftar Ahli Lengkap</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {experts.slice(0, 4).map((exp) => {
                            const photoSrc =
                              exp.avatarUrl ||
                              `/expert-${exp.id.replace('exp-', '')}.webp`;
                            return (
                              <div
                                key={exp.id}
                                className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-3.5 shadow-2xs hover:shadow-md transition-all"
                              >
                                <div>
                                  <div className="relative aspect-[1.15/1] w-full overflow-hidden rounded-[16px] bg-[#FAF8FC]">
                                    <Image
                                      src={photoSrc}
                                      alt={exp.name}
                                      fill
                                      sizes="(max-width: 640px) 100vw, 25vw"
                                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute top-2 left-2 rounded-full bg-green-500/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white">
                                      Tersedia
                                    </span>
                                  </div>
                                  <div className="mt-3 px-1">
                                    <h3 className="font-heading text-sm font-bold text-[#2A2D22] line-clamp-1">
                                      {exp.name}
                                    </h3>
                                    <p className="text-[11px] font-semibold text-[#C84B71]">
                                      {exp.role}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3 pt-2.5 border-t border-[#F0ECF5] px-1">
                                  <a
                                    href={`https://wa.me/${exp.whatsappNumber}?text=Halo%20${encodeURIComponent(exp.name)},%20saya%20ingin%20konsultasi%20mengenai%20kehamilan%20saya.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 transition-colors shadow-2xs"
                                  >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    <span>Konsultasi WA</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {/* =========================================================
                      3. HALAMAN KHUSUS: TIPS KEHAMILAN
                     ========================================================= */}
                  {activeSection === 'tips' && (
                    <motion.div
                      key="view-tips"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] bg-[#FAF8FC] border border-[#ECE7F2] p-6 sm:p-7">
                        <div>
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            Panduan Praktis
                          </span>
                          <h1 className="mt-2.5 font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                            Tips Kehamilan Hari Ini
                          </h1>
                          <p className="mt-1 text-xs sm:text-sm text-[#767A6E]">
                            Langkah kecil untuk merawat kenyamanan tubuh dan ketenangan pikiran sehari-hari.
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#C84B71] rounded-full bg-white border border-[#ECE7F2] px-4 py-1.5 self-start sm:self-auto">
                          {savedTipIds.length} Tips Tersimpan
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredTips.map((tip, idx) => (
                          <TipCard
                            key={tip.id}
                            tip={tip}
                            orderNumber={idx + 1}
                            isSaved={savedTipIds.includes(tip.id)}
                            onToggleSave={toggleSaveTip}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* =========================================================
                      4. HALAMAN KHUSUS: KONTAK AHLI
                     ========================================================= */}
                  {activeSection === 'kontak-ahli' && (
                    <motion.div
                      key="view-kontak-ahli"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <div className="rounded-[24px] bg-[#FAF8FC] border border-[#ECE7F2] p-6 sm:p-7">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          Pendamping Terverifikasi
                        </span>
                        <h1 className="mt-2.5 font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                          Kontak Ahli Pendamping
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#767A6E]">
                          Bidan dan konselor berlisensi yang siap mendampingi dan menjawab pertanyaan Ibu secara personal via WhatsApp.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {experts.map((exp, idx) => {
                          const waUrl = `https://wa.me/${exp.whatsappNumber}?text=${encodeURIComponent(
                            `Halo ${exp.name}, saya ${
                              session?.name ?? 'Ibu hamil pengguna Teman Kasih'
                            }. Saya ingin berkonsultasi mengenai kehamilan saya.`
                          )}`;
                          const photoSrc =
                            exp.avatarUrl || `/expert-${(idx % 4) + 1}.jpg`;

                          return (
                            <div
                              key={exp.id}
                              className="group flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-3.5 shadow-2xs hover:shadow-[0_12px_28px_rgba(80,50,110,0.08)] hover:-translate-y-1 transition-all"
                            >
                              <div>
                                <div className="relative aspect-[1.15/1] w-full overflow-hidden rounded-[16px] bg-[#FAF8FC]">
                                  <Image
                                    src={photoSrc}
                                    alt={exp.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>

                                <div className="mt-3.5 px-1">
                                  <h3 className="font-heading text-sm font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors">
                                    {exp.name}
                                  </h3>
                                  <p className="mt-0.5 text-xs font-medium text-[#767A6E]">
                                    {exp.role}
                                  </p>
                                  <p className="mt-1 text-[11px] text-[#A09CA8]">
                                    {exp.experienceLabel ?? exp.scheduleNote}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-[#F0ECF5]">
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-full bg-[#EBF7EE] px-3 text-xs font-bold text-green-700 hover:bg-green-100 transition-colors"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  <span>Konsultasi WhatsApp</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* =========================================================
                      5. HALAMAN: PENGATURAN & AKUN IBU
                     ========================================================= */}
                  {activeSection === 'pengaturan' && (
                    <motion.div
                      key="view-pengaturan"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <div className="rounded-[24px] bg-[#FAF8FC] border border-[#ECE7F2] p-6 sm:p-7">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-[#2A2D22]">
                          Preferensi Belajar
                        </span>
                        <h1 className="mt-2.5 font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                          Pengaturan Akun &amp; Profil
                        </h1>
                      </div>

                      <div className="rounded-[22px] border border-[#ECE7F2] bg-white p-6 shadow-2xs space-y-5">
                        <div>
                          <h2 className="font-heading text-base font-bold text-[#2A2D22]">
                            Status Akun Pengguna
                          </h2>
                          <p className="text-xs text-[#767A6E] mt-0.5">
                            {session
                              ? `Masuk sebagai ${session.name} (${session.email})`
                              : 'Saat ini Ibu menggunakan mode tamu tanpa login.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-xl border border-[#ECE7F2] p-3.5 bg-[#FAF8FC]">
                            <span className="text-[11px] font-semibold text-[#8C8896]">
                              Kategori Kehamilan
                            </span>
                            <p className="text-sm font-bold text-[#2A2D22] mt-0.5">
                              {session?.trimesterLabel ?? 'Trimester Awal'}
                            </p>
                          </div>

                          <div className="rounded-xl border border-[#ECE7F2] p-3.5 bg-[#FAF8FC]">
                            <span className="text-[11px] font-semibold text-[#8C8896]">
                              Status Akses
                            </span>
                            <p className="text-sm font-bold text-[#2A2D22] mt-0.5">
                              Akses Lengkap &amp; Terverifikasi
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#F0ECF5] flex flex-wrap items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (!session) openLoginDialog();
                              else openAnxietyDialog();
                            }}
                            className="btn-pill inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-5 py-2 text-xs font-bold text-[#C84B71] hover:bg-pink-100 transition-colors cursor-pointer"
                          >
                            <Heart className="h-3.5 w-3.5" />
                            <span>Ulang Kuesioner Perasaan</span>
                          </button>

                          {!session ? (
                            <button
                              type="button"
                              onClick={openLoginDialog}
                              className="btn-pill inline-flex items-center gap-2 rounded-full bg-[#C84B71] px-6 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] cursor-pointer"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span>Masuk Akun</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectSection('beranda')}
                              className="btn-pill inline-flex items-center gap-2 rounded-full bg-[#C84B71] px-6 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] cursor-pointer"
                            >
                              <span>Simpan &amp; Lanjut Belajar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Reader Modul Fullscreen Focus Mode */}
      {activeModuleId && (
        (() => {
          const mod = modules.find((m) => m.id === activeModuleId);
          if (!mod) return null;
          return (
            <ModuleReader
              module={mod}
              totalModules={modules.length}
              isCompleted={moduleStatuses[activeModuleId] === 'selesai'}
              onComplete={handleCompleteModule}
              onBackToOverview={closeModuleReader}
            />
          );
        })()
      )}

      {/* Modal Detail Info "?" Interaktif */}
      {selectedInfoCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 sm:p-6"
          onClick={() => setSelectedInfoCard(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${selectedInfoCard.badgeBg} ${selectedInfoCard.badgeTextColor}`}
                >
                  {selectedInfoCard.badgeText}
                </span>
                <span className="text-xs text-[#767A6E]">
                  {selectedInfoCard.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInfoCard(null)}
                aria-label="Tutup informasi"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-[#FAF8FC] border border-gray-100 overflow-hidden">
                <Image
                  src={selectedInfoCard.imageSrc}
                  alt={selectedInfoCard.imageAlt}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3
                  id="info-modal-title"
                  className="font-heading text-lg font-bold text-[#2A2D22]"
                >
                  {selectedInfoCard.title}
                </h3>
                <p className="text-xs text-[#767A6E] mt-0.5">
                  Durasi: {selectedInfoCard.readingTime} &bull; Standar Kemenkes &amp; POGI
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                  Ringkasan Pembelajaran
                </span>
                <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-[#555]">
                  {selectedInfoCard.infoOverview}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#56632A]">
                  Poin Penting yang Didapat
                </span>
                <ul className="mt-1.5 space-y-1.5 text-xs text-[#555]">
                  {selectedInfoCard.infoKeyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 mt-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedInfoCard(null)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const cardToOpen = selectedInfoCard;
                  setSelectedInfoCard(null);
                  handleCardClick(cardToOpen);
                }}
                className="rounded-full bg-[#C84B71] hover:bg-[#b23b60] text-white px-5 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Quiz Interaktif */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-[28px] bg-white p-4 sm:p-6 shadow-2xl border border-gray-100 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Award className="h-4 w-4" />
                </span>
                <h3 className="font-heading text-lg font-bold text-[#2A2D22]">
                  Kuis Pemahaman Kehamilan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuizModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <QuizRunner />
          </div>
        </div>
      )}

      {/* Modal Refleksi & Hasil Belajar */}
      {isReflectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-[28px] bg-white p-4 sm:p-6 shadow-2xl border border-gray-100 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                </span>
                <h3 className="font-heading text-lg font-bold text-[#2A2D22]">
                  Refleksi &amp; Rangkuman Hasil Belajar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReflectionModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ResultSummary />
          </div>
        </div>
      )}

      {/* Dialog Autentikasi Masuk */}
      <LoginDialog />

      {/* Dialog Kuesioner Kecemasan / Sapa Perasaan */}
      <AnxietyDialog />
    </>
  );
}

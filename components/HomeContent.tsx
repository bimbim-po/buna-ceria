'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Camera,
  Check,
  CheckCircle,
  Clock,
  Globe,
  Heart,
  HeartHandshake,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
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
import { EditorialHeroBanner } from '@/components/EditorialHeroBanner';

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

const SelfieStudio = dynamic(
  () => import('@/components/SelfieStudio').then((mod) => mod.SelfieStudio),
  { ssr: false }
);

const AdminDashboard = dynamic(
  () => import('@/components/AdminDashboard').then((mod) => mod.AdminDashboard),
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
    category: 'Level 1 • Materi 01',
    description: 'Memahami perubahan hormon dan rutinitas relaksasi 4 menit untuk menenangkan pikiran.',
    badgeText: 'Modul 01',
    badgeBg: 'bg-[#FCE8EE]',
    badgeTextColor: 'text-[#C84B71]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#FFF5F8]',
    cardBorder: 'border-[#F0E6EC] hover:border-pink-300',
    imageSrc: '/modul-3d-1.webp',
    imageAlt: 'Ilustrasi Ibu Hamil Duduk Bersila Meditasi dan Relaksasi Tenang',
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
    category: 'Level 1 • Materi 02',
    description: 'Menata posisi tidur nyaman dengan bantal hamil dan menjaga kesegaran tubuh Ibu.',
    badgeText: 'Modul 02',
    badgeBg: 'bg-[#FFEADA]',
    badgeTextColor: 'text-[#D97706]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#FFF8F3]',
    cardBorder: 'border-[#F2EAE0] hover:border-amber-300',
    imageSrc: '/modul-3d-2.webp',
    imageAlt: 'Ilustrasi Bantal Hamil U-Shape Peach dengan Boneka Bintang Ramah',
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
    category: 'Level 1 • Materi 03',
    description: 'Cara santun berbagi rasa dan menyampaikan kebutuhan bersama pasangan tercinta.',
    badgeText: 'Modul 03',
    badgeBg: 'bg-[#F5F7EA]',
    badgeTextColor: 'text-[#56632A]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#F8FAF2]',
    cardBorder: 'border-[#E6EBE0] hover:border-lime-300',
    imageSrc: '/modul-3d-3.webp',
    imageAlt: 'Ilustrasi Dua Tangan Saling Merangkul Lembut Hati Pink',
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
    category: 'Level 1 • Materi 04',
    description: 'Daftar perlengkapan tas rumah sakit dan langkah tenang menyambut kelahiran bayi.',
    badgeText: 'Modul 04',
    badgeBg: 'bg-[#E6F7F3]',
    badgeTextColor: 'text-[#0D9488]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#F3FAF8]',
    cardBorder: 'border-[#E0EFEA] hover:border-teal-300',
    imageSrc: '/modul-3d-4.webp',
    imageAlt: 'Ilustrasi Tas Bersalin Rumah Sakit Hijau Sage dan Perlengkapan Bayi',
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
    category: 'Level 2 • Evaluasi',
    description: '8 soal interaktif dengan ulasan lembut untuk memperkuat pemahaman materi.',
    badgeText: 'Level 02',
    badgeBg: 'bg-[#FEF3C7]',
    badgeTextColor: 'text-[#B45309]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#FFFDF2]',
    cardBorder: 'border-[#F2EED8] hover:border-yellow-300',
    imageSrc: '/modul-3d-5.webp',
    imageAlt: 'Ilustrasi Piala Emas Juara dan Buku Catatan Checklist Kehamilan',
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
    title: 'Refleksi Diri & Hasil Saya',
    category: 'Level 3 & 4 • Pencapaian',
    description: 'Tandai langkah kecil kesiapan dan lihat rangkuman pencapaian belajar Ibu.',
    badgeText: 'Level 03–04',
    badgeBg: 'bg-[#EDE9FE]',
    badgeTextColor: 'text-[#6D28D9]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#FAF6FF]',
    cardBorder: 'border-[#EDE5F8] hover:border-purple-300',
    imageSrc: '/modul-3d-6.webp',
    imageAlt: 'Ilustrasi Buku Jurnal Ungu Self Care dan Big Dreams dengan Pulpen',
    type: 'reflection',
    readingTime: 'Hasil & Jurnal',
    infoOverview: 'Ruang jeda penuh makna untuk mengevaluasi komitmen harian merawat diri dan melihat rangkuman capaian belajar 4 level.',
    infoKeyPoints: [
      'Refleksi afirmasi positif untuk ketenangan pikiran',
      'Daftar komitmen langkah kecil merawat tubuh',
      'Rangkuman lengkap perjalanan belajar Buna Ceria • Teman Kasih',
    ],
  },
];

export function HomeContent({ initialMode }: { initialMode?: AppMode }) {
  const {
    appMode,
    activeSection,
    setActiveSection,
    enterWebApp,
    enterLandingPage,
    session,
    progress,
    anxietySubmission,
    moduleStatuses,
    activeModuleId,
    openLoginDialog,
    openAnxietyDialog,
    openModuleReader,
    closeModuleReader,
    handleCompleteModule,
    handleUpdateProfile,
    handleLogout,
    selectStage,
    dataVersion,
  } = useApp();

  const prefersReducedMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [savedTipIds, setSavedTipIds] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedInfoCard, setSelectedInfoCard] = useState<UnifiedCard | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);

  // State Form Edit Profil di halaman Pengaturan (Item 20)
  const [profileName, setProfileName] = useState(session?.name ?? '');
  const [profileEmail, setProfileEmail] = useState(session?.email ?? '');
  const [profilePhone, setProfilePhone] = useState(session?.phone ?? '');
  const [profileTrimester, setProfileTrimester] = useState(
    session?.trimesterLabel ?? 'Trimester Pertama'
  );
  const [profilePassword, setProfilePassword] = useState('');
  const [profileSavedNotice, setProfileSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setProfileName(session.name);
      setProfileEmail(session.email);
      setProfilePhone(session.phone);
      setProfileTrimester(session.trimesterLabel ?? 'Trimester Pertama');
    }
  }, [session]);

  // Re-fetch dynamic data when dataVersion changes (e.g., Admin edits modules)
  const modules = React.useMemo(() => getModules(), [dataVersion]);
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
        selectStage('quiz');
        setIsQuizModalOpen(true);
      }
    } else if (card.type === 'reflection') {
      if (!session) {
        openLoginDialog();
      } else {
        selectStage('hasil-saya');
        setIsReflectionModalOpen(true);
      }
    }
  };

  // Sinkronkan initialMode bila dibuka langsung dari rute /belajar
  useEffect(() => {
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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      openLoginDialog();
      return;
    }
    handleUpdateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone || session.phone || '0857-0130-8514',
      trimesterLabel: profileTrimester,
      ...(profilePassword.trim() ? { password: profilePassword.trim() } : {}),
    });
    setProfilePassword('');
    setProfileSavedNotice('Profil Ibu berhasil diperbarui dan disimpan!');
    setTimeout(() => setProfileSavedNotice(null), 3500);
  };

  const completedModules = progress?.completedModuleIds.length ?? 0;
  const completedStages = progress?.completedStageIds.length ?? 0;

  // Filter pencarian sederhana untuk tips
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
      {/* Item 24: Animasi Logo saat Loading */}
      <SplashScreen />

      {appMode === 'landing' ? (
        <LandingPage />
      ) : (
        /* =====================================================================
           WEBAPP PEMBELAJARAN (BUNA CERIA • TEMAN KASIH)
           Sesuai Client Brief Items 11-24 & User Flow 1-10:
           - Beranda: Sapa perasaan + tips, Kuesioner Kecemasan, 4 Bulatan Level, & Tombol Cepat
           - Tahapan & Materi: 4 Level Bulatan & Garis Penghubung + Modul, Quiz, Refleksi, Hasil
           - Tips Kehamilan: Tips harian dengan fitur bookmark
           - Kontak Ahli: Daftar bidan & konselor via WhatsApp
           - Take Selfie: Foto bersama pasangan dengan garis putus-putus, edit nama, download
           - Pengaturan: Informasi akun, ubah profil, kembali ke website, ganti/keluar akun
           - Admin: Kelola pengguna terdaftar & edit/tambah modul pembelajaran
           ===================================================================== */
        <div className="flex h-screen w-full overflow-hidden bg-white text-[#2A2D22]">
          {/* 1. NAVBAR DI KIRI (COLLAPSIBLE FLOATING PILL) */}
          <aside
            aria-label="Sidebar WebApp"
            className={`hidden lg:flex flex-col h-screen py-4 pl-4 shrink-0 transition-all duration-300 ease-in-out select-none ${
              isSidebarCollapsed ? 'w-[90px]' : 'w-[255px]'
            }`}
          >
            <SidebarNav
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
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
                      1. BERANDA WEBAPP (Item 12 & Alur User 4–5)
                         - Pertanyaan perasaan + tipsnya
                         - Kuesioner kecemasan (jawaban disimpan)
                         - 4 Bulatan tingkatan dengan garis penghubung
                         - Tombol cepat menuju fitur lain dalam webapp
                     ========================================================= */}
                  {activeSection === 'beranda' && (
                    <motion.div
                      key="view-beranda"
                      {...viewTransitionProps}
                      className="space-y-8"
                    >
                      {/* Editorial Hero Banner: Beranda Buna Ceria • Teman Kasih */}
                      <EditorialHeroBanner
                        bannerImageSrc="/hero-banner-beranda.webp"
                        bgText="BUNA CERIA"
                        characterSrc="/hero-beranda-ibu.webp"
                        characterAlt="Ibu Hamil Bahagia Buna Ceria Teman Kasih"
                        bgGradientClass="bg-gradient-to-r from-[#4E1E2F] via-[#66283F] to-[#4E1E2F]"
                        shadowClass="shadow-[0_8px_24px_rgba(78,30,47,0.08),0_2px_6px_rgba(0,0,0,0.03)]"
                        leftBadge={{
                          icon: <Sparkles className="h-3 w-3 text-pink-200" />,
                          label: "WebApp Buna Ceria • Teman Kasih",
                        }}
                        rightBadge={{
                          icon: <Heart className="h-3 w-3 text-pink-200" />,
                          label: session?.trimesterLabel ?? "Trimester Pertama",
                        }}
                        subtitle={`Selamat datang, ${session ? session.name : 'Ibu Kasih'}. Mari kenali perasaan hari ini dan ikuti 4 tahapan belajar dengan tenang.`}
                        actionButton={{
                          label: "Isi Kuesioner Kecemasan",
                          onClick: () => {
                            if (!session) openLoginDialog();
                            else openAnxietyDialog();
                          },
                        }}
                      />

                      {/* A. PERTANYAAN PERASAAN USER BESERTA TIPSNYA & KUESIONER KECEMASAN */}
                      <section aria-labelledby="perasaan-heading" className="space-y-4">
                        <FeelingSelector />

                        {/* Status Kuesioner Kecemasan yang Tersimpan (Alur Langkah 4) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[22px] border border-pink-100 bg-[#FDF2F5]/70 px-5 py-4">
                          <div className="flex items-start gap-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#C84B71] border border-pink-100 shadow-2xs">
                              <Heart className="h-5 w-5 fill-[#C84B71]" />
                            </span>
                            <div>
                              <h3 className="font-heading text-sm sm:text-base font-bold text-[#2A2D22]">
                                {anxietySubmission
                                  ? `Kuesioner Kecemasan Tersimpan: Skor ${anxietySubmission.totalScore}/${anxietySubmission.maxScore} (Tingkat ${anxietySubmission.level.toUpperCase()})`
                                  : 'Kuesioner Kecemasan Kehamilan (Belum Diisi)'}
                              </h3>
                              <p className="text-xs text-[#6E6A6C] mt-0.5">
                                {anxietySubmission
                                  ? 'Jawaban kuesioner kecemasan Ibu telah disimpan otomatis di sistem dan dapat dilihat pada Level 4 (Hasil Saya).'
                                  : 'Yuk isi 9 pertanyaan singkat untuk mengenali tingkat ketenangan emosi Ibu hari ini. Jawaban akan disimpan otomatis.'}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!session) openLoginDialog();
                              else openAnxietyDialog();
                            }}
                            className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#C84B71] hover:bg-[#b23b60] px-5 py-2 text-xs font-bold text-white shadow-2xs transition-colors cursor-pointer"
                          >
                            <Heart className="h-3.5 w-3.5" />
                            <span>
                              {anxietySubmission ? 'Perbarui Kuesioner' : 'Isi Kuesioner Sekarang'}
                            </span>
                          </button>
                        </div>
                      </section>

                      {/* B. 4 BULATAN TINGKATAN PEMBELAJARAN BERTAHAP (Item 12 & 13, Alur Langkah 4–5) */}
                      <section aria-labelledby="tahapan-beranda-heading" className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h2
                              id="tahapan-beranda-heading"
                              className="font-heading text-lg font-bold text-[#2A2D22]"
                            >
                              Alur 4 Level Pembelajaran Bertahap
                            </h2>
                            <p className="text-xs text-[#767A6E]">
                              Ikuti secara berurutan mulai dari Level 1 (Materi) hingga Level 4 (Hasil Saya).
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectSection('materi')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C84B71] hover:underline cursor-pointer"
                          >
                            <span>Buka Halaman Materi Lengkap</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div onClick={() => handleSelectSection('materi')} className="cursor-pointer">
                          <StageTracker />
                        </div>
                      </section>

                      {/* C. TOMBOL CEPAT MENUJU FITUR LAIN DALAM WEBAPP (Item 12) */}
                      <section aria-labelledby="fitur-pintas-heading">
                        <div className="flex items-center justify-between mb-3">
                          <h2
                            id="fitur-pintas-heading"
                            className="font-heading text-base font-bold text-[#2A2D22]"
                          >
                            Tombol Cepat Fitur WebApp
                          </h2>
                          <span className="text-xs text-[#767A6E]">
                            Pilih fitur untuk mengakses langsung
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
                          {/* Tile 1: Tahapan & Materi (4 Level) */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('materi')}
                            className="group flex h-full flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-pink-200 hover:shadow-[0_10px_24px_rgba(200,75,113,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F5] text-[#C84B71] transition-transform group-hover:scale-105">
                                  <BookOpen className="h-5 w-5" />
                                </span>
                                <h3 className="font-heading text-base font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors">
                                  Tahapan &amp; Materi
                                </h3>
                              </div>
                              <p className="mt-2.5 text-xs leading-relaxed text-[#767A6E]">
                                Ikuti 4 level pembelajaran bertahap, baca modul kehamilan, &amp; kerjakan kuis.
                              </p>
                            </div>
                            <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-[#C84B71]">
                              <span>{completedStages}/4 Level Selesai</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>

                          {/* Tile 2: Tips Kehamilan */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('tips')}
                            className="group flex h-full flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-green-200 hover:shadow-[0_10px_24px_rgba(80,110,50,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F8EB] text-[#56632A] transition-transform group-hover:scale-105">
                                  <Sun className="h-5 w-5" />
                                </span>
                                <h3 className="font-heading text-base font-bold text-[#2A2D22] group-hover:text-[#56632A] transition-colors">
                                  Tips Kehamilan
                                </h3>
                              </div>
                              <p className="mt-2.5 text-xs leading-relaxed text-[#767A6E]">
                                Langkah kecil harian merawat tubuh, nutrisi, dan ketenangan pikiran.
                              </p>
                            </div>
                            <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-[#56632A]">
                              <span>{savedTipIds.length} Tersimpan</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>

                          {/* Tile 3: Kontak Ahli */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('kontak-ahli')}
                            className="group flex h-full flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-blue-200 hover:shadow-[0_10px_24px_rgba(50,80,160,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-105">
                                  <HeartHandshake className="h-5 w-5" />
                                </span>
                                <h3 className="font-heading text-base font-bold text-[#2A2D22] group-hover:text-blue-600 transition-colors">
                                  Kontak Ahli
                                </h3>
                              </div>
                              <p className="mt-2.5 text-xs leading-relaxed text-[#767A6E]">
                                Konsultasi langsung via WhatsApp dengan bidan &amp; konselor ahli.
                              </p>
                            </div>
                            <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-blue-600">
                              <span>4 Tenaga Ahli</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>

                          {/* Tile 4: Take Selfie Pasangan */}
                          <button
                            type="button"
                            onClick={() => handleSelectSection('selfie')}
                            className="group flex h-full flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 text-left shadow-2xs hover:border-pink-300 hover:shadow-[0_10px_24px_rgba(200,75,113,0.1)] hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F5] text-[#C84B71] transition-transform group-hover:scale-105">
                                  <Camera className="h-5 w-5" />
                                </span>
                                <h3 className="font-heading text-base font-bold text-[#2A2D22] group-hover:text-[#C84B71] transition-colors">
                                  Take Selfie
                                </h3>
                              </div>
                              <p className="mt-2.5 text-xs leading-relaxed text-[#767A6E]">
                                Foto bersama pasangan dengan siluet garis putus-putus, edit nama, &amp; unduh.
                              </p>
                            </div>
                            <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#F0ECF5] text-xs font-bold text-[#C84B71]">
                              <span>Buka Studio Foto</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </button>
                        </div>
                      </section>

                      {/* Footer WebApp Narahubung (Kak Faiza 085701308514) */}
                      <footer className="rounded-[22px] border border-[#ECE7F2] bg-[#FAFAF9] p-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 items-center">
                          <div className="lg:col-span-7">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B71]">
                              Narahubung Program Buna Ceria • Teman Kasih
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
                          <span>Team Buna Ceria • Kak Faiza (085701308514)</span>
                        </div>
                      </footer>
                    </motion.div>
                  )}

                  {/* =========================================================
                      2. HALAMAN: TAHAPAN & MATERI KEHAMILAN (4 LEVEL)
                         (Items 13 & 14: 4 Bulatan Level + Garis Penghubung + Modul, Quiz, Refleksi, Hasil)
                     ========================================================= */}
                  {activeSection === 'materi' && (
                    <motion.div
                      key="view-materi"
                      {...viewTransitionProps}
                      className="space-y-8"
                    >
                      {/* Editorial Hero Banner: Kurikulum 4 Level */}
                      <EditorialHeroBanner
                        bannerImageSrc="/hero-banner-materi.webp"
                        bgText="4 LEVEL BELAJAR"
                        characterSrc="/hero-materi-mentor.webp"
                        characterAlt="Mentor Edukasi Materi Kehamilan"
                        bgGradientClass="bg-gradient-to-r from-[#243315] via-[#33461E] to-[#243315]"
                        shadowClass="shadow-[0_8px_24px_rgba(36,51,21,0.08),0_2px_6px_rgba(0,0,0,0.03)]"
                        leftBadge={{
                          icon: <BookOpen className="h-3 w-3 text-lime-200" />,
                          label: "Alur 4 Level Bertahap",
                        }}
                        rightBadge={{
                          icon: <CheckCircle className="h-3 w-3 text-lime-200" />,
                          label: `${completedModules}/${modules.length} Modul Selesai`,
                        }}
                        subtitle="Selesaikan setiap level secara berurutan: Level 1 Materi, Level 2 Quiz, Level 3 Refleksi, dan Level 4 Hasil Saya."
                        actionButton={{
                          label: "Mulai Level 1",
                          onClick: () => {
                            selectStage('materi');
                            const el = document.getElementById('stage-tracker-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          },
                        }}
                      />

                      {/* 4 BULATAN LEVEL DENGAN GARIS PENGHUBUNG + PANEL LEVEL AKTIF (Items 13 & 14) */}
                      <div id="stage-tracker-section" className="space-y-6">
                        <StageTracker />
                        <StagePanel />
                      </div>

                      {/* KARTU VISUAL 3D MODUL & EVALUASI */}
                      <section aria-labelledby="kurikulum-materi-heading" className="space-y-4 pt-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h2
                            id="kurikulum-materi-heading"
                            className="font-heading text-xl font-bold text-[#2A2D22]"
                          >
                            Modul &amp; Evaluasi Pembelajaran
                          </h2>
                          <span className="text-xs text-[#767A6E]">
                            Klik kartu untuk membuka &bull; Klik &ldquo;?&rdquo; untuk ringkasan
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-1 items-stretch">
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
                                className={`group relative overflow-hidden rounded-[24px] p-5 sm:p-6 border ${card.cardBorder} ${card.cardGradient} shadow-2xs hover:shadow-[0_12px_28px_rgba(40,40,60,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer min-h-[215px] sm:min-h-[225px] flex flex-col justify-between`}
                              >
                                <div className="flex items-center justify-between gap-3 relative z-10">
                                  <div className="inline-flex items-center gap-2 min-w-0">
                                    <span
                                      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${card.badgeBg} ${card.badgeTextColor}`}
                                    >
                                      {card.badgeText}
                                    </span>
                                    <span className="truncate text-[11px] font-medium text-[#767A6E]">
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
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/95 border border-[#ECE7F2] text-[#4A4D40] hover:bg-white hover:text-black hover:border-gray-300 text-xs font-black shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                  >
                                    ?
                                  </button>
                                </div>

                                <div className="mt-4 relative z-10 max-w-[64%] space-y-1.5">
                                  <h3 className="font-heading text-base sm:text-lg font-bold text-[#2A2D22] leading-snug group-hover:text-[#C84B71] transition-colors">
                                    {card.title}
                                  </h3>
                                  <p className="text-xs text-[#555] leading-relaxed line-clamp-2">
                                    {card.description}
                                  </p>

                                  <div className="pt-2.5 flex flex-wrap items-center gap-2">
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
                                            : 'Lihat Hasil'}
                                        </span>
                                        <ArrowRight className="h-3 w-3" />
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="absolute bottom-1.5 right-1.5 w-28 h-28 sm:w-32 sm:h-32 pointer-events-none transition-transform duration-300 group-hover:scale-105 z-10">
                                  <Image
                                    src={card.imageSrc}
                                    alt={card.imageAlt}
                                    fill
                                    sizes="(max-width: 640px) 128px, 144px"
                                    className="object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.12)]"
                                    priority={card.orderNumber === '01' || card.orderNumber === '02'}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {/* =========================================================
                      3. HALAMAN KHUSUS: TIPS KEHAMILAN (Item 15)
                     ========================================================= */}
                  {activeSection === 'tips' && (
                    <motion.div
                      key="view-tips"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <EditorialHeroBanner
                        bannerImageSrc="/hero-banner-tips.webp"
                        bgText="TIPS KEHAMILAN HARI INI"
                        characterSrc="/hero-tips-kaka.webp"
                        characterAlt="Kaka Tenaga Kesehatan Pendamping Tips Kehamilan"
                        bgGradientClass="bg-gradient-to-r from-[#1E204E] via-[#282B61] to-[#1E204E]"
                        shadowClass="shadow-[0_8px_24px_rgba(30,32,78,0.08),0_2px_6px_rgba(0,0,0,0.03)]"
                        leftBadge={{
                          icon: <Sparkles className="h-3 w-3 text-pink-200" />,
                          label: "Terkurasi Medis",
                        }}
                        rightBadge={{
                          icon: <Bookmark className="h-3 w-3 text-green-200" />,
                          label: `${savedTipIds.length} Tips Tersimpan`,
                        }}
                        subtitle="Langkah kecil teruji dari bidan & pakar untuk menjaga kenyamanan tubuh serta ketenangan pikiran Ibu."
                        actionButton={{
                          label: "Eksplorasi Tips",
                          onClick: () => {
                            const grid = document.getElementById('tips-grid');
                            grid?.scrollIntoView({ behavior: 'smooth' });
                          },
                        }}
                      />

                      <div id="tips-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                      4. HALAMAN KHUSUS: KONTAK AHLI (Item 16)
                     ========================================================= */}
                  {activeSection === 'kontak-ahli' && (
                    <motion.div
                      key="view-kontak-ahli"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <EditorialHeroBanner
                        bannerImageSrc="/hero-banner-kontak.webp"
                        bgText="KONTAK AHLI"
                        characterSrc="/hero-kontak-bidan.webp"
                        characterAlt="Bidan & Konselor Kehamilan Berlisensi"
                        bgGradientClass="bg-gradient-to-r from-[#143242] via-[#1E4357] to-[#143242]"
                        shadowClass="shadow-[0_8px_24px_rgba(20,50,66,0.08),0_2px_6px_rgba(0,0,0,0.03)]"
                        leftBadge={{
                          icon: <HeartHandshake className="h-3 w-3 text-cyan-200" />,
                          label: "Pendamping Berlisensi",
                        }}
                        rightBadge={{
                          icon: <MessageCircle className="h-3 w-3 text-cyan-200" />,
                          label: "Siap Konsultasi WhatsApp",
                        }}
                        subtitle="Bidan dan konselor profesional terverifikasi siap mendampingi serta menjawab setiap keluhan Ibu secara personal."
                        actionButton={{
                          label: "Tanya Bidan Sekarang",
                          onClick: () => {
                            const firstExp = experts[0];
                            const num = firstExp?.whatsappNumber || '6285701308514';
                            window.open(
                              `https://wa.me/${num}?text=${encodeURIComponent(
                                `Halo Bidan, saya ${session?.name ?? 'Ibu hamil pengguna Buna Ceria'}. Saya ingin berkonsultasi mengenai kehamilan saya.`
                              )}`,
                              '_blank'
                            );
                          },
                        }}
                      />

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {experts.map((exp, idx) => {
                          const waUrl = `https://wa.me/${exp.whatsappNumber}?text=${encodeURIComponent(
                            `Halo ${exp.name}, saya ${
                              session?.name ?? 'Ibu hamil pengguna Buna Ceria • Teman Kasih'
                            }. Saya ingin berkonsultasi mengenai kehamilan saya.`
                          )}`;
                          const photoSrc =
                            exp.avatarUrl || `/expert-${(idx % 4) + 1}.jpg`;

                          return (
                            <div
                              key={exp.id}
                              className="group flex flex-col justify-between rounded-[20px] border border-[#ECE7F2] bg-white p-4 shadow-2xs hover:shadow-[0_10px_24px_rgba(80,50,110,0.06)] hover:-translate-y-0.5 transition-all"
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
                      5. HALAMAN KHUSUS: TAKE SELFIE PASANGAN (Items 17, 18, 19)
                     ========================================================= */}
                  {activeSection === 'selfie' && (
                    <motion.div
                      key="view-selfie"
                      {...viewTransitionProps}
                    >
                      <SelfieStudio />
                    </motion.div>
                  )}

                  {/* =========================================================
                      6. HALAMAN: PENGATURAN & UBAH PROFIL (Items 20, 22, 23)
                     ========================================================= */}
                  {activeSection === 'pengaturan' && (
                    <motion.div
                      key="view-pengaturan"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[24px] bg-[#FAF8F6] border border-[#ECE7F2] p-6 sm:p-7">
                        <div>
                          <h1 className="font-heading text-2xl font-bold text-[#2A2D22] sm:text-3xl">
                            Informasi Akun &amp; Ubah Profil
                          </h1>
                          <p className="mt-1 text-xs sm:text-sm text-[#6E6A6C]">
                            Kelola nama panggilan, email, usia trimester kehamilan, atau beralih akun dengan mudah.
                          </p>
                        </div>

                        {/* Item 22: Tombol Kembali ke Website */}
                        <button
                          type="button"
                          onClick={enterLandingPage}
                          className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-full border border-[#ECE7F2] bg-white px-5 py-2 text-xs font-bold text-[#2A2D22] hover:bg-[#FAF8FC] shadow-2xs transition-colors cursor-pointer"
                        >
                          <Globe className="h-4 w-4 text-[#C84B71]" />
                          <span>Kembali ke Website</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Kolom Kiri: Form Ubah Profil (Item 20) */}
                        <form
                          onSubmit={handleProfileSave}
                          className="lg:col-span-7 rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-[#F0ECF5] pb-3">
                            <div>
                              <h2 className="font-heading text-lg font-bold text-[#2A2D22]">
                                Ubah Profil Ibu
                              </h2>
                              <p className="text-xs text-[#767A6E]">
                                Perubahan nama juga otomatis tampil di sertifikat &amp; bingkai <em>Take Selfie</em>.
                              </p>
                            </div>
                            <span className="rounded-full bg-[#F5F8EB] px-3 py-1 text-[11px] font-bold text-[#56632A]">
                              {session?.role === 'admin' ? 'Akun Admin' : 'Pengguna Terdaftar'}
                            </span>
                          </div>

                          {profileSavedNotice && (
                            <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-bold text-green-800">
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                              <span>{profileSavedNotice}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-bold text-[#2A2D22] mb-1.5">
                                Nama Lengkap Ibu
                              </label>
                              <input
                                type="text"
                                required
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                placeholder="Contoh: Ibu Sinta Rahmawati"
                                className="w-full rounded-xl border border-pink-200 bg-[#FAF8FC] px-3.5 py-2.5 text-sm font-semibold text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#2A2D22] mb-1.5">
                                Alamat Email
                              </label>
                              <input
                                type="email"
                                required
                                value={profileEmail}
                                onChange={(e) => setProfileEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className="w-full rounded-xl border border-pink-200 bg-[#FAF8FC] px-3.5 py-2.5 text-sm font-semibold text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#2A2D22] mb-1.5">
                                Nomor WhatsApp Aktif
                              </label>
                              <input
                                type="tel"
                                value={profilePhone}
                                onChange={(e) => setProfilePhone(e.target.value)}
                                placeholder="0857-xxxx-xxxx"
                                className="w-full rounded-xl border border-pink-200 bg-[#FAF8FC] px-3.5 py-2.5 text-sm font-semibold text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#2A2D22] mb-1.5">
                                Fase / Trimester Kehamilan
                              </label>
                              <select
                                value={profileTrimester}
                                onChange={(e) => setProfileTrimester(e.target.value)}
                                className="w-full rounded-xl border border-pink-200 bg-[#FAF8FC] px-3.5 py-2.5 text-sm font-semibold text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                              >
                                <option value="Trimester Pertama (Minggu 1–12)">
                                  Trimester Pertama (Minggu 1–12)
                                </option>
                                <option value="Trimester Kedua (Minggu 13–27)">
                                  Trimester Kedua (Minggu 13–27)
                                </option>
                                <option value="Trimester Ketiga (Minggu 28–40)">
                                  Trimester Ketiga (Minggu 28–40)
                                </option>
                                <option value="Masa Nifas & Menyusui">
                                  Masa Nifas &amp; Menyusui
                                </option>
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold text-[#2A2D22] mb-1.5">
                                Kata Sandi Baru (Opsional)
                              </label>
                              <input
                                type="password"
                                value={profilePassword}
                                onChange={(e) => setProfilePassword(e.target.value)}
                                placeholder="Kosongkan bila tidak ingin mengubah kata sandi"
                                className="w-full rounded-xl border border-pink-200 bg-[#FAF8FC] px-3.5 py-2.5 text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#F0ECF5] flex flex-wrap items-center justify-between gap-3">
                            <button
                              type="submit"
                              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#C84B71] hover:bg-[#b23b60] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                            >
                              <Save className="h-4 w-4" />
                              <span>Simpan Perubahan Profil</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (!session) openLoginDialog();
                                else openAnxietyDialog();
                              }}
                              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-pink-200 bg-[#FDF2F5] px-4 py-2 text-xs font-bold text-[#C84B71] hover:bg-pink-100 transition-colors cursor-pointer"
                            >
                              <Heart className="h-3.5 w-3.5" />
                              <span>Isi Ulang Kuesioner Kecemasan</span>
                            </button>
                          </div>
                        </form>

                        {/* Kolom Kanan: Aksi Akun, Ganti Akun, Keluar Akun, & Mode Admin (Items 22 & 23) */}
                        <div className="lg:col-span-5 space-y-4">
                          <div className="rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs space-y-4">
                            <h2 className="font-heading text-lg font-bold text-[#2A2D22]">
                              Kelola Sesi &amp; Peran Akun
                            </h2>
                            <p className="text-xs leading-relaxed text-[#6E6A6C]">
                              Ibu dapat berganti akun pengguna terdaftar, beralih ke akun Admin (untuk mengelola user &amp; modul), atau kembali ke halaman Website utama.
                            </p>

                            <div className="space-y-2.5 pt-1">
                              {/* Item 23: Tombol Ganti Akun */}
                              <button
                                type="button"
                                onClick={openLoginDialog}
                                className="flex w-full items-center justify-between rounded-2xl border border-[#E4EAC9] bg-[#F5F8EB] px-4 py-3 text-left text-xs font-bold text-[#56632A] hover:bg-[#ebf0d8] transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2.5">
                                  <RefreshCw className="h-4 w-4" />
                                  <span>Ganti Akun (User / Google / Admin)</span>
                                </span>
                                <ArrowRight className="h-4 w-4" />
                              </button>

                              {/* Pintasan Panel Admin */}
                              <button
                                type="button"
                                onClick={() => handleSelectSection('admin')}
                                className="flex w-full items-center justify-between rounded-2xl border border-pink-200 bg-[#FDF2F5] px-4 py-3 text-left text-xs font-bold text-[#C84B71] hover:bg-[#FCE8EE] transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2.5">
                                  <ShieldCheck className="h-4 w-4" />
                                  <span>Buka Panel Admin (Kelola User &amp; Modul)</span>
                                </span>
                                <ArrowRight className="h-4 w-4" />
                              </button>

                              {/* Item 22: Tombol Kembali ke Website */}
                              <button
                                type="button"
                                onClick={enterLandingPage}
                                className="flex w-full items-center justify-between rounded-2xl border border-[#ECE7F2] bg-[#FAF8FC] px-4 py-3 text-left text-xs font-bold text-[#2A2D22] hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2.5">
                                  <Globe className="h-4 w-4 text-[#8C8896]" />
                                  <span>Kembali ke Website Utama</span>
                                </span>
                                <ArrowRight className="h-4 w-4" />
                              </button>

                              {/* Item 23: Tombol Keluar Akun */}
                              {session && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleLogout();
                                    enterLandingPage();
                                  }}
                                  className="flex w-full items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-xs font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                                >
                                  <span className="flex items-center gap-2.5">
                                    <LogOut className="h-4 w-4" />
                                    <span>Keluar Akun (Logout)</span>
                                  </span>
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* =========================================================
                      7. HALAMAN KHUSUS: PANEL ADMIN (Role #3 Admin)
                         Mengelola pengguna terdaftar dan mengedit/menambah modul pembelajaran
                     ========================================================= */}
                  {activeSection === 'admin' && (
                    <motion.div
                      key="view-admin"
                      {...viewTransitionProps}
                    >
                      <AdminDashboard />
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
            className="relative w-full max-w-lg rounded-[22px] bg-white p-5 sm:p-6 shadow-xl border border-[#ECE7F2] space-y-4"
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
                  Level 2 • Kuis Pemahaman Kehamilan
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
                  Level 4 • Rangkuman Hasil Belajar
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

      {/* Dialog Autentikasi Masuk / Daftar / Admin */}
      <LoginDialog />

      {/* Dialog Kuesioner Kecemasan / Sapa Perasaan */}
      <AnxietyDialog />
    </>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  Check,
  CheckCircle,
  Clock,
  Globe,
  Home,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  getFooterContact,
  getModules,
  getUserDayInfo,
} from '@/lib/api';
import { AppMode, useApp } from '@/context/AppContext';
import { LandingPage } from '@/components/LandingPage';
import { Header } from '@/components/Header';
import { SidebarNav } from '@/components/SidebarNav';
import { StageTracker } from '@/components/StageTracker';
import { FeelingSelector } from '@/components/FeelingSelector';
import { EditorialHeroBanner } from '@/components/EditorialHeroBanner';

const StagePanel = dynamic(
  () => import('@/components/StagePanel').then((mod) => mod.StagePanel),
  { ssr: false }
);

const ModuleReader = dynamic(
  () => import('@/components/ModuleReader').then((mod) => mod.ModuleReader),
  { ssr: false }
);

const LoginDialog = dynamic(
  () => import('@/components/LoginDialog').then((mod) => mod.LoginDialog),
  { ssr: false }
);

const AnxietyDialog = dynamic(
  () => import('@/components/AnxietyDialog').then((mod) => mod.AnxietyDialog),
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

const DailyMoodCalendar = dynamic(
  () =>
    import('@/components/DailyMoodCalendar').then(
      (mod) => mod.DailyMoodCalendar
    ),
  { ssr: false }
);

const PomegranateGarden = dynamic(
  () =>
    import('@/components/PomegranateGarden').then(
      (mod) => mod.PomegranateGarden
    ),
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
    title: 'Mengenali Perubahan Perasaan di Masa Nifas',
    category: 'Adaptasi Masa Nifas',
    description:
      'Memahami masa nifas, perubahan emosional setelah melahirkan, dan mengenali berbagai perasaan yang dapat muncul.',
    badgeText: 'Materi 01',
    badgeBg: 'bg-[#FCE8EE]',
    badgeTextColor: 'text-[#C84B71]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#FFF5F8]',
    cardBorder: 'border-[#F0E6EC] hover:border-[#D9A7B8]',
    imageSrc: '/modul-3d-1.webp',
    imageAlt: 'Ilustrasi Adaptasi Perasaan di Masa Nifas',
    type: 'module',
    moduleId: 'materi-1',
    readingTime: '5 mnt baca',
    infoOverview:
      'Memahami masa nifas (hingga sekitar 42 hari pascapersalinan), perubahan emosional setelah melahirkan, dan mengenali berbagai perasaan yang dapat muncul selama masa nifas.',
    infoKeyPoints: [
      'Memahami masa nifas sebagai pemulihan fisik dan adaptasi emosional selama 42 hari',
      'Mengenali perubahan suasana hati akibat hormon, kurang tidur, dan peran baru',
      'Pentingnya mengenali perasaan untuk menentukan langkah merawat diri',
    ],
  },
  {
    id: 'modul-2',
    orderNumber: '02',
    title: 'Mengenali Kecemasan dan Menjaga Ketenangan Diri',
    category: 'Ketenangan Emosi',
    description:
      'Mengenali kecemasan, memahami pemicunya, dan mengetahui kapan kekhawatiran perlu mendapatkan perhatian lebih.',
    badgeText: 'Materi 02',
    badgeBg: 'bg-[#FFEADA]',
    badgeTextColor: 'text-[#D97706]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#FFF8F3]',
    cardBorder: 'border-[#F2EAE0] hover:border-[#DEC29B]',
    imageSrc: '/modul-3d-2.webp',
    imageAlt: 'Ilustrasi Mengenali Kecemasan dan Ketenangan Diri',
    type: 'module',
    moduleId: 'materi-2',
    readingTime: '6 mnt baca',
    infoOverview:
      'Mengenali tanda-tanda kecemasan pada perasaan, pikiran, fisik, dan perilaku, serta memahami 4 tingkat kecemasan (ringan, sedang, berat, panik).',
    infoKeyPoints: [
      'Mengenali tanda kecemasan pada perasaan, pikiran, fisik, dan perilaku',
      'Memahami 4 tingkat kecemasan: ringan, sedang, berat, hingga panik',
      'Mengidentifikasi pemicu kekhawatiran Bunda selama merawat bayi',
    ],
  },
  {
    id: 'modul-3',
    orderNumber: '03',
    title: 'Gangguan Psikologis Masa Nifas',
    category: 'Kesehatan Psikologis',
    description:
      'Mengenali perbedaan baby blues, depresi postpartum, dan psikosis postpartum serta kapan perlu pertolongan.',
    badgeText: 'Materi 03',
    badgeBg: 'bg-[#F5F7EA]',
    badgeTextColor: 'text-[#56632A]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#F8FAF2]',
    cardBorder: 'border-[#E6EBE0] hover:border-[#C2CFA3]',
    imageSrc: '/modul-3d-3.webp',
    imageAlt: 'Ilustrasi Edukasi Baby Blues, Depresi Postpartum, dan Psikosis',
    type: 'module',
    moduleId: 'materi-3',
    readingTime: '6 mnt baca',
    infoOverview:
      'Dilengkapi ilustrasi visual untuk mengenali perbedaan antara Baby Blues, Depresi Postpartum (DPP), dan Psikosis Postpartum, serta tanda bahaya yang membutuhkan bantuan tenaga kesehatan.',
    infoKeyPoints: [
      'Baby Blues: muncul di hari-hari awal dan membaik dalam 1–2 minggu',
      'Depresi Postpartum (DPP): kesedihan berkepanjangan yang butuh bantuan nakes',
      'Psikosis Postpartum: kondisi serius darurat medis yang perlu penanganan segera',
    ],
  },
  {
    id: 'modul-4',
    orderNumber: '04',
    title: 'Mengenal ASI dan Proses Produksinya',
    category: 'Edukasi Laktasi & ASI',
    description:
      'Memahami manfaat ASI, hormon prolaktin & oksitosin, serta indikator tanda bayi cukup ASI.',
    badgeText: 'Materi 04',
    badgeBg: 'bg-[#E6F7F3]',
    badgeTextColor: 'text-[#0D9488]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#F3FAF8]',
    cardBorder: 'border-[#E0EFEA] hover:border-[#B2D1C7]',
    imageSrc: '/modul-3d-4.webp',
    imageAlt: 'Ilustrasi Edukasi Kecukupan ASI dan Laktasi',
    type: 'module',
    moduleId: 'materi-4',
    readingTime: '6 mnt baca',
    infoOverview:
      'Memahami cara kerja hormon Prolaktin dan Oksitosin, hubungan kecemasan (kortisol) dengan pengeluaran ASI, serta indikator objektif kecukupan ASI pada bayi.',
    infoKeyPoints: [
      'Peran hormon Prolaktin (produksi ASI) & Oksitosin (refleks pengeluaran ASI)',
      'Indikator cukup ASI: menyusu 8–12x/hari, BAK ≥6 popok basah, BAB & BB bertambah',
      'Pengaruh stres/kecemasan terhadap refleks pengeluaran ASI',
    ],
  },
  {
    id: 'refleksi-hasil',
    orderNumber: '05',
    title: 'Refleksi Diri dan Tips & Bunga Delima',
    category: 'Level 2 & Level 3',
    description:
      'Checklist usaha Bunda, rencana langkah kecil, teknik relaksasi, dukungan suami (Take Selfie), dan Kebun Bunga Delima.',
    badgeText: 'Level 02–03',
    badgeBg: 'bg-[#EDE9FE]',
    badgeTextColor: 'text-[#6D28D9]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#FAF6FF]',
    cardBorder: 'border-[#EDE5F8] hover:border-[#CBB8DC]',
    imageSrc: '/modul-3d-6.webp',
    imageAlt: 'Ilustrasi Jurnal Refleksi Diri dan Tips Menghadapi Kecemasan',
    type: 'reflection',
    readingTime: 'Refleksi & Bunga Delima',
    infoOverview:
      'Ruang refleksi diri (10 checklist usaha & 10 rencana langkah Bunda), panduan teknik relaksasi napas dalam, afirmasi positif, audio relaksasi, dukungan suami (Take Selfie), serta Kebun Bunga Delima.',
    infoKeyPoints: [
      'Checklist 10 usaha Bunda & 10 rencana langkah menghadapi kecemasan',
      'Panduan pernapasan dalam, afirmasi positif, audio relaksasi, & dukungan suami',
      'Menuju Level 3: Kebun Bunga Delima interaktif',
    ],
  },
  {
    id: 'kuis-evaluasi',
    orderNumber: '06',
    title: 'Tahap Akhir (Hari ke-7): Post-Test PASS & Quiz',
    category: 'Tahap Akhir • Hari ke-7',
    description:
      'Post-Test Skrining Kecemasan PASS (31 pertanyaan) bersamaan dengan Quiz Pemahaman (20 pertanyaan). Hanya 1x pengerjaan.',
    badgeText: 'Hari ke-7',
    badgeBg: 'bg-[#FEF3C7]',
    badgeTextColor: 'text-[#B45309]',
    cardGradient: 'bg-gradient-to-b from-white via-white to-[#FFFDF2]',
    cardBorder: 'border-[#F2EED8] hover:border-[#DEC29B]',
    imageSrc: '/modul-3d-5.webp',
    imageAlt: 'Ilustrasi Evaluasi Tahap Akhir Hari ke-7',
    type: 'quiz',
    readingTime: 'PASS 31 + Quiz 20 Soal',
    infoOverview:
      'Terbuka pada Hari ke-7 setelah login pertama: mencakup Post-Test Skrining Kecemasan PASS (31 pertanyaan) dan Quiz Post-Test Pemahaman (20 pertanyaan dengan soal yang sama). Hanya dapat dikerjakan 1 kali.',
    infoKeyPoints: [
      'Bagian 1: Post-Test Skrining Kecemasan PASS (31 pertanyaan)',
      'Bagian 2: Materi pengingat + 20 soal Quiz Pemahaman masa nifas & ASI',
      'Hanya dapat dikerjakan 1 kali dan hasilnya tercatat di Hasil Saya pada Dashboard',
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
  const profileSavedTimerRef = useRef<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedInfoCard, setSelectedInfoCard] = useState<UnifiedCard | null>(null);

  // State Form Edit Profil di halaman Pengaturan (tanpa cascading setState di useEffect)
  const [profileNameDraft, setProfileNameDraft] = useState<string | null>(null);
  const [profileEmailDraft, setProfileEmailDraft] = useState<string | null>(null);
  const [profilePhoneDraft, setProfilePhoneDraft] = useState<string | null>(null);
  const [profileTrimesterDraft, setProfileTrimesterDraft] = useState<string | null>(null);
  const [profilePassword, setProfilePassword] = useState('');
  const [profileSavedNotice, setProfileSavedNotice] = useState<string | null>(null);

  const profileName = profileNameDraft ?? session?.name ?? '';
  const profileEmail = profileEmailDraft ?? session?.email ?? '';
  const profilePhone = profilePhoneDraft ?? session?.phone ?? '';
  const profileTrimester =
    profileTrimesterDraft ?? session?.trimesterLabel ?? 'Nifas Hari ke 1-2 Hari';

  const setProfileName = (v: string) => setProfileNameDraft(v);
  const setProfileEmail = (v: string) => setProfileEmailDraft(v);
  const setProfilePhone = (v: string) => setProfilePhoneDraft(v);
  const setProfileTrimester = (v: string) => setProfileTrimesterDraft(v);

  useEffect(() => {
    return () => {
      if (profileSavedTimerRef.current !== null) {
        window.clearTimeout(profileSavedTimerRef.current);
      }
    };
  }, []);

  // Re-fetch dynamic data when dataVersion changes (e.g., Admin edits modules)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const modules = React.useMemo(() => getModules(), [dataVersion]);
  const footerContact = getFooterContact();

  const dayInfo = React.useMemo(() => {
    return getUserDayInfo(session?.id ?? 'guest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id, progress]);

  const isPretestCompleted = Boolean(
    progress?.initialPretestAnxiety && progress?.initialPretestQuiz
  );
  const isPosttestCompleted = Boolean(
    progress?.posttestAnxiety && progress?.posttestQuiz
  );

  const handleCardClick = (card: UnifiedCard) => {
    if (card.type === 'module' && card.moduleId) {
      openModuleReader(card.moduleId);
    } else if (card.type === 'quiz') {
      if (!session) {
        openLoginDialog();
      } else if (dayInfo.unlocked.posttestAnxiety) {
        openAnxietyDialog('posttest');
      } else {
        setActiveSection('tips');
      }
    } else if (card.type === 'reflection') {
      if (!session) {
        openLoginDialog();
      } else {
        selectStage('tahap-3');
      }
    }
  };

  // Sinkronkan initialMode bila dibuka langsung dari rute /belajar
  useEffect(() => {
    if (initialMode === 'webapp') {
      enterWebApp();
    }
  }, [initialMode, enterWebApp]);

  // Proteksi halaman Admin: hanya akun berlisensi Admin (role === 'admin') yang boleh mengakses
  useEffect(() => {
    if (activeSection === 'admin' && session?.role !== 'admin') {
      setActiveSection('beranda');
    }
  }, [activeSection, session?.role, setActiveSection]);

  const handleSelectSection = (sectionId: string) => {
    if (sectionId === 'admin' && session?.role !== 'admin') {
      return;
    }
    setActiveSection(sectionId);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    if (profileSavedTimerRef.current !== null) {
      window.clearTimeout(profileSavedTimerRef.current);
    }
    profileSavedTimerRef.current = window.setTimeout(() => {
      setProfileSavedNotice(null);
      profileSavedTimerRef.current = null;
    }, 3500);
  };

  const completedModules = progress?.completedModuleIds.length ?? 0;
  const completedStages = progress?.completedStageIds.length ?? 0;

  const viewTransitionProps = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: 0.25, ease: CUSTOM_EASE },
  };

  return (
    <>
      {appMode === 'landing' ? (
        <LandingPage />
      ) : (
        /* =====================================================================
           WEBAPP PEMBELAJARAN (BUNA CERIA)
           Sesuai Client Brief Items 11-24 & User Flow 1-10:
           - Beranda: Sapa perasaan + tips, Kuesioner Kecemasan, 4 Bulatan Level, & Tombol Cepat
           - Tahapan & Materi: 4 Level Bulatan & Garis Penghubung + Modul, Quiz, Refleksi, Hasil
           - Tips Kehamilan: Tips harian dengan fitur bookmark
           - Kontak Ahli: Daftar bidan & konselor via WhatsApp
           - Take Selfie: Foto bersama pasangan dengan garis putus-putus, edit nama, download
           - Pengaturan: Informasi akun, ubah profil, kembali ke website, ganti/keluar akun
           - Admin: Kelola pengguna terdaftar & edit/tambah modul pembelajaran
           ===================================================================== */
        <div className="flex h-[100dvh] w-full overflow-hidden bg-[#FFF5F8] text-[#2A2D22]">
          {/* 1. NAVBAR DI KIRI (COLLAPSIBLE FLOATING PILL) */}
          <aside
            aria-label="Sidebar WebApp"
            className={`hidden lg:flex flex-col h-[100dvh] py-4 pl-4 shrink-0 transition-all duration-300 ease-in-out select-none ${
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
          <div className="flex min-w-0 flex-1 flex-col h-full bg-[#FFF5F8]">
            {/* Top Bar Bersih (Selalu Sticky di Atas) */}
            <Header
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Viewport Konten Scrollable */}
            <main
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-8 lg:px-10 xl:px-14 w-full bg-[#FFF5F8]"
            >
              <div className="mx-auto w-full max-w-[1480px] 2xl:max-w-[1680px] space-y-7 sm:space-y-8 pb-28 lg:pb-16">
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
                      {/* Editorial Hero Banner: Beranda Buna Ceria */}
                      <EditorialHeroBanner
                        bannerImageSrc="/hero-banner-beranda.webp"
                        bgText="BUNA CERIA"
                        characterSrc="/hero-beranda-ibu.webp"
                        characterAlt="Ibu Masa Nifas Bahagia Buna Ceria"
                        bgGradientClass="bg-gradient-to-r from-[#4E1E2F] via-[#66283F] to-[#4E1E2F]"
                        shadowClass="shadow-[0_8px_24px_rgba(78,30,47,0.08),0_2px_6px_rgba(0,0,0,0.03)]"
                        accentColor="#8E3556"
                        leftBadge={{
                          icon: <Sparkles className="h-3 w-3 text-pink-200" />,
                          label: 'WebApp Buna Ceria',
                        }}
                        showLiveSubtitle={true}
                        subtitle={`Selamat datang Ibu ${
                          session
                            ? session.name
                                .replace(/^Bunda\s+/i, '')
                                .replace(/^Ibu\s+/i, '')
                            : 'Nadia Pratiwi'
                        }, lanjutkan perjalanan nifas yang tenang, nyaman dan terarah`}
                        actionButton={{
                          label: isPretestCompleted
                            ? 'Buka Hasil Saya'
                            : 'Kerjakan Pre-Test',
                          onClick: () => {
                            if (!session) openLoginDialog();
                            else if (isPretestCompleted) {
                              handleSelectSection('hasil');
                            } else {
                              openAnxietyDialog('pretest');
                            }
                          },
                        }}
                      />

                      {/* A. PERTANYAAN PERASAAN USER BESERTA TIPSNYA & STATUS PRE-TEST AWAL */}
                      <section aria-labelledby="perasaan-heading" className="space-y-4">
                        <FeelingSelector />

                        {/* Status Pre-Test Awal (PASS 31 Pertanyaan & Pemahaman 20 Pertanyaan — 1x Pengerjaan) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[20px] border border-[#F5DCE4] bg-white px-4 py-4 sm:px-5">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBEDF1] text-[#C84B71]">
                              <CheckCircle className="h-4 w-4" />
                            </span>
                            <div>
                              <h3 className="font-heading text-sm sm:text-base font-bold text-[#2A2D22]">
                                {isPretestCompleted
                                  ? `Pre-Test Awal Selesai: PASS ${progress?.initialPretestAnxiety?.totalScore}/${progress?.initialPretestAnxiety?.maxScore} • Pemahaman ${progress?.initialPretestQuiz?.score}/${progress?.initialPretestQuiz?.maxScore} Soal`
                                  : 'Pre-Test Awal: Skrining PASS (31 Pertanyaan) & Tes Pemahaman (20 Pertanyaan)'}
                              </h3>
                              <p className="text-xs text-[#6E6A6C] mt-0.5">
                                {isPretestCompleted
                                  ? 'Pre-Test hanya dapat dikerjakan 1 kali. Lihat analisis lengkapnya pada menu Hasil Saya.'
                                  : 'Kerjakan Pre-Test awal (1 kali pengerjaan) sebelum memulai pembelajaran.'}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!session) openLoginDialog();
                              else if (isPretestCompleted) handleSelectSection('hasil');
                              else openAnxietyDialog('pretest');
                            }}
                            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 self-stretch sm:self-auto rounded-full bg-[#C84B71] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#B23B60] active:scale-[0.98] cursor-pointer"
                          >
                            <span>
                              {isPretestCompleted
                                ? 'Buka Menu Hasil Saya'
                                : 'Mulai Pre-Test Awal'}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </section>

                      {/* B. KALENDER EMOTIKON HARIAN (Item 8 Client Brief: 🥰 🙂 😞 😖 😤 🤯) */}
                      <DailyMoodCalendar />

                      {/* C. 3 BULATAN TINGKATAN PEMBELAJARAN BERTAHAP */}
                      <section aria-labelledby="tahapan-beranda-heading" className="space-y-3">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <h2
                              id="tahapan-beranda-heading"
                              className="font-heading text-lg font-bold text-[#2A2D22]"
                            >
                              Perjalanan belajar Bunda (3 Level)
                            </h2>
                            <p className="text-xs text-[#767A6E]">
                              Level 1 Materi, Level 2 Refleksi &amp; Tips, dan Level 3 Bunga Delima.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectSection('materi')}
                            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#C84B71] underline-offset-4 hover:underline cursor-pointer"
                          >
                            <span>Lihat semua</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <StageTracker />
                      </section>

                      {/* D. PINTASAN FITUR */}
                      <section aria-labelledby="fitur-pintas-heading">
                        <h2
                          id="fitur-pintas-heading"
                          className="mb-3.5 font-heading text-lg font-bold text-[#2A2D22]"
                        >
                          Lanjutkan dari sini
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            {
                              id: 'materi',
                              title: 'Tahapan & Materi',
                              desc: 'Tiga level belajar bertahap masa nifas.',
                              meta: `${completedStages} dari 3 level`,
                              img: '/modul-3d-1.webp',
                              tint: 'bg-[#F1F4E6]',
                              ring: 'hover:ring-[#C9D3A8]',
                              accent: 'text-[#4F5E24]',
                            },
                            {
                              id: 'tips',
                              title: 'Kebun Bunga Delima',
                              desc: 'Siram benih dengan video, audio, dan game ASI.',
                              meta: `${progress?.pomegranateGarden?.points ?? 0}/100 Poin`,
                              img: '/tip-3d-1.webp',
                              tint: 'bg-[#FFF2F6]',
                              ring: 'hover:ring-[#F8C8D7]',
                              accent: 'text-[#C84B71]',
                            },
                            {
                              id: 'hasil',
                              title: 'Hasil Saya',
                              desc: 'Lihat skor PASS, Pre-Test, Post-Test & progres Bunda.',
                              meta: 'Rapor Evaluasi',
                              img: '/modul-3d-6.webp',
                              tint: 'bg-[#F1F4E6]',
                              ring: 'hover:ring-[#C9D3A8]',
                              accent: 'text-[#4F5E24]',
                            },
                            {
                              id: 'selfie',
                              title: 'Take Selfie',
                              desc: 'Abadikan momen nifas bersama pasangan.',
                              meta: 'Dukungan Suami',
                              img: '/modul-3d-3.webp',
                              tint: 'bg-[#FBEDF1]',
                              ring: 'hover:ring-[#F0C9D5]',
                              accent: 'text-[#A83A5E]',
                            },
                          ].map((tile) => (
                            <button
                              key={tile.id}
                              type="button"
                              onClick={() => handleSelectSection(tile.id)}
                              className={`group relative flex min-h-[176px] sm:min-h-[188px] flex-col overflow-hidden rounded-[20px] ${tile.tint} p-4 sm:p-5 text-left ring-1 ring-black/4 ${tile.ring} transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(60,40,50,0.08)] active:translate-y-0 cursor-pointer`}
                            >
                              <span className={`text-[11px] font-semibold ${tile.accent}`}>
                                {tile.meta}
                              </span>
                              <h3 className="mt-1 font-heading text-[15px] sm:text-[17px] font-bold leading-snug text-[#2A2D22]">
                                {tile.title}
                              </h3>
                              <p className="mt-1 hidden max-w-[62%] text-[12.5px] leading-snug text-[#5F5B5D] sm:block">
                                {tile.desc}
                              </p>
                              <span
                                className={`relative z-10 mt-auto inline-flex items-center gap-1 text-xs font-semibold ${tile.accent}`}
                              >
                                Buka
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                              </span>

                              <span className="pointer-events-none absolute -bottom-2 -right-2 h-[92px] w-[92px] sm:h-[118px] sm:w-[118px] transition-transform duration-300 group-hover:scale-[1.04]">
                                <Image
                                  src={tile.img}
                                  alt=""
                                  fill
                                  sizes="120px"
                                  className="object-contain object-bottom"
                                />
                              </span>
                            </button>
                          ))}
                        </div>
                      </section>

                      {/* Footer WebApp — tenang, tanpa kartu & tanpa pill berlebihan */}
                      <footer className="border-t border-[#F0DCE3] pt-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                          <div className="max-w-xl">
                            <h3 className="font-heading text-base font-bold text-[#2A2D22]">
                              Ada pertanyaan soal program?
                            </h3>
                            <p className="mt-1 text-[13px] leading-relaxed text-[#6E6A6C]">
                              Hubungi {footerContact.personInCharge.replace(/\s*\(.*\)\s*/, '')},{' '}
                              {footerContact.role.toLowerCase()}.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                            <a
                              href={`mailto:${footerContact.email}`}
                              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2A2D22] underline-offset-4 hover:underline"
                            >
                              <Mail className="h-4 w-4 text-[#A83A5E]" />
                              {footerContact.email}
                            </a>
                            <a
                              href={`https://wa.me/${footerContact.whatsappNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#2F6B43] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#275a38]"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              {footerContact.displayWhatsapp}
                            </a>
                          </div>
                        </div>

                        <p className="mt-6 max-w-3xl text-[11.5px] leading-relaxed text-[#9A96A0]">
                          {footerContact.disclaimerText}
                        </p>
                        <p className="mt-2 text-[11.5px] text-[#9A96A0]">
                          {footerContact.copyrightText}
                        </p>
                      </footer>
                    </motion.div>
                  )}

                  {/* =========================================================
                      2. HALAMAN: TAHAPAN & MATERI MASA NIFAS (3 LEVEL + TAHAP AKHIR HARI KE-7)
                     ========================================================= */}
                  {activeSection === 'materi' && (
                    <motion.div
                      key="view-materi"
                      {...viewTransitionProps}
                      className="space-y-8"
                    >
                      {/* Editorial Hero Banner: Kurikulum 3 Level */}
                      <EditorialHeroBanner
                        bannerImageSrc="/hero-banner-materi.webp"
                        bgText="3 LEVEL BELAJAR"
                        characterSrc="/hero-materi-mentor.webp"
                        characterAlt="Mentor Edukasi Materi Masa Nifas"
                        bgGradientClass="bg-gradient-to-r from-[#243315] via-[#33461E] to-[#243315]"
                        shadowClass="shadow-[0_8px_24px_rgba(36,51,21,0.08),0_2px_6px_rgba(0,0,0,0.03)]"
                        accentColor="#3F5222"
                        leftBadge={{
                          icon: <BookOpen className="h-3 w-3 text-lime-200" />,
                          label: "Alur 3 Level Bertahap",
                        }}
                        rightBadge={{
                          icon: <CheckCircle className="h-3 w-3 text-lime-200" />,
                          label: `${completedModules} dari ${modules.length} modul selesai`,
                        }}
                        subtitle="Pelajari 4 modul interaktif, uji pemahaman mandiri melalui kuis ramah, dan rekam refleksi harian."
                        actionButton={{
                          label: "Mulai belajar",
                          onClick: () => {
                            selectStage('materi');
                            const el = document.getElementById('stage-tracker-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          },
                        }}
                      />

                      {/* 3 BULATAN LEVEL DENGAN GARIS PENGHUBUNG + PANEL LEVEL AKTIF */}
                      <div id="stage-tracker-section" className="space-y-6">
                        <StageTracker />
                        <StagePanel />
                      </div>

                      {/* TAHAP AKHIR (HARI KE-7): POST-TEST TINGKAT KECEMASAN PASS (31 SOAL) & QUIZ PEMAHAMAN (20 SOAL) */}
                      <section aria-labelledby="tahap-akhir-hari-7-heading">
                        <div className="rounded-[26px] border border-[#F0C9D5] bg-gradient-to-r from-[#FFF5F8] via-white to-[#F5F8EB] p-6 sm:p-7 shadow-2xs">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                            <div className="flex items-start gap-4">
                              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C84B71] text-white shadow-xs">
                                <Award className="h-6 w-6" />
                              </span>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="rounded-full bg-[#FCE8EE] px-3 py-0.5 text-xs font-bold text-[#C84B71]">
                                    Tahap Akhir &bull; Hari ke-7 (1x Pengerjaan)
                                  </span>
                                  {isPosttestCompleted ? (
                                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                                      Sudah Selesai Dikerjakan (1x)
                                    </span>
                                  ) : dayInfo.unlocked.posttestAnxiety ? (
                                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                                      Terbuka Hari Ini
                                    </span>
                                  ) : (
                                    <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                                      Terbuka pada Hari ke-7 (Saat ini Hari ke-{dayInfo.dayNumber})
                                    </span>
                                  )}
                                </div>
                                <h3
                                  id="tahap-akhir-hari-7-heading"
                                  className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]"
                                >
                                  Tahap Akhir (Hari ke-7): Post-Test Tingkat Kecemasan PASS (31 Pertanyaan) &amp; Quiz Pemahaman (20 Pertanyaan)
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-[#5F5B5D] max-w-3xl leading-relaxed">
                                  Pada tahap akhir (Hari ke-7), bagian Quiz Pemahaman (20 pertanyaan) dikerjakan bersamaan dengan Post-Test Tingkat Kecemasan PASS (31 pertanyaan). Evaluasi ini hanya dapat dikerjakan 1 kali dan hasilnya tercatat di halaman menu Hasil Saya.
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isPosttestCompleted ? (
                                <button
                                  type="button"
                                  onClick={() => handleSelectSection('hasil')}
                                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#F5F8EB] border border-[#C5D49B] px-5 text-xs font-bold text-[#56632A] cursor-pointer"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Lihat di Hasil Saya</span>
                                </button>
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
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSelectSection('tips')}
                                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-5 text-xs font-bold text-[#C84B71] hover:bg-pink-50 cursor-pointer"
                                >
                                  <span>Buka Kebun Bunga Delima</span>
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* KARTU VISUAL 3D MODUL & EVALUASI */}
                      <section aria-labelledby="kurikulum-materi-heading" className="space-y-4 pt-2">
                        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left justify-between gap-2">
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
                              isDone = isPosttestCompleted;
                            } else if (card.type === 'reflection') {
                              isDone =
                                (progress?.completedStageIds.includes('tahap-3') ?? false) ||
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

                                <div className="mt-4 relative z-10 max-w-[64%] flex flex-col justify-between flex-1">
                                  <div>
                                    <h3 className="font-heading text-base font-bold text-[#2A2D22] leading-snug line-clamp-2 h-[44px] group-hover:text-[#C84B71] transition-colors">
                                      {card.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-[#555] leading-relaxed line-clamp-2 h-[38px]">
                                      {card.description}
                                    </p>
                                  </div>

                                  <div className="pt-3 flex items-center gap-2 whitespace-nowrap">
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
                      3. HALAMAN KHUSUS: KEBUN BUAH DELIMA (Item 5 & 6 Client Brief)
                         - Tanaman bertumbuh dari benih -> tunas -> kuncup -> bunga delima mekar (0–100 poin)
                         - Poin dari: Video Edukasi (Hari 1), Audio Afirmasi (Hari 3), Game Tebak Gambar ASI (Hari 5)
                         - Post-Test Kecemasan Hari ke-7 & WhatsApp reminder notification
                     ========================================================= */}
                  {activeSection === 'tips' && (
                    <motion.div
                      key="view-tips"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <EditorialHeroBanner
                        bannerImageSrc="/hero-banner-tips.webp"
                        bgText="KEBUN BUAH DELIMA"
                        characterSrc="/hero-tips-kaka.webp"
                        characterAlt="Pendamping Kebun Buah Delima Buna Ceria"
                        bgGradientClass="bg-gradient-to-r from-[#4E1E2F] via-[#66283F] to-[#4E1E2F]"
                        shadowClass="shadow-[0_8px_24px_rgba(78,30,47,0.08),0_2px_6px_rgba(0,0,0,0.03)]"
                        accentColor="#8E3556"
                        leftBadge={{
                          icon: <Sparkles className="h-3 w-3 text-pink-200" />,
                          label: "Gamifikasi Poin & Tanaman",
                        }}
                        rightBadge={{
                          icon: <Sparkles className="h-3 w-3 text-pink-200" />,
                          label: `${progress?.pomegranateGarden?.points ?? 0}/100 Poin`,
                        }}
                        subtitle="Kumpulkan poin dari menonton video, mendengar audio, dan bermain game tebak gambar materi kecukupan ASI tiap 2 hari untuk memekarkan Bunga Delima Bunda."
                        actionButton={{
                          label: "Buka kebun",
                          onClick: () => {
                            const grid = document.getElementById('garden-container');
                            grid?.scrollIntoView({ behavior: 'smooth' });
                          },
                        }}
                      />

                      <div id="garden-container">
                        <PomegranateGarden />
                      </div>
                    </motion.div>
                  )}

                  {/* =========================================================
                      4. HALAMAN KHUSUS: HASIL SAYA (MENU MANDIRI DI WEBAPP)
                     ========================================================= */}
                  {activeSection === 'hasil' && (
                    <motion.div
                      key="view-hasil"
                      {...viewTransitionProps}
                      className="space-y-6"
                    >
                      <ResultSummary />
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
                            Kelola nama panggilan, email, fase masa nifas, atau beralih akun dengan mudah.
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
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-[#2A2D22]">
                                  Nomor WhatsApp Aktif
                                </label>
                                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  Notifikasi Post-Test
                                </span>
                              </div>
                              <input
                                type="tel"
                                required
                                value={profilePhone}
                                onChange={(e) => setProfilePhone(e.target.value)}
                                placeholder="0857-xxxx-xxxx"
                                className="w-full rounded-xl border border-pink-200 bg-[#FAF8FC] px-3.5 py-2.5 text-sm font-semibold text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                              />
                              <p className="mt-1 text-[11px] text-[#6E6A6C]">
                                Nomor ini menerima pengingat WhatsApp otomatis di hari ke-7 untuk evaluasi Post-Test.
                              </p>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#2A2D22] mb-1.5">
                                Fase Nifas
                              </label>
                              <select
                                value={profileTrimester}
                                onChange={(e) => setProfileTrimester(e.target.value)}
                                className="w-full rounded-xl border border-pink-200 bg-[#FAF8FC] px-3.5 py-2.5 text-sm font-semibold text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                              >
                                <option value="Nifas Hari ke 1-2 Hari">
                                  Nifas Hari ke 1-2 Hari
                                </option>
                                <option value="Nifas Hari ke 3-7 Hari">
                                  Nifas Hari ke 3-7 Hari
                                </option>
                                <option value="Nifas Hari ke 8-28 Hari">
                                  Nifas Hari ke 8-28 Hari
                                </option>
                                <option value="Nifas Hari ke 29-42 Hari">
                                  Nifas Hari ke 29-42 Hari
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

                            {!isPretestCompleted && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!session) openLoginDialog();
                                  else openAnxietyDialog('pretest');
                                }}
                                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-pink-200 bg-[#FDF2F5] px-4 py-2 text-xs font-bold text-[#C84B71] hover:bg-pink-100 transition-colors cursor-pointer"
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Kerjakan Pre-Test Awal</span>
                              </button>
                            )}
                          </div>
                        </form>

                        {/* Kolom Kanan: Aksi Akun, Ganti Akun, Keluar Akun, & Mode Admin (Items 22 & 23) */}
                        <div className="lg:col-span-5 space-y-4">
                          <div className="rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-2xs space-y-4">
                            <h2 className="font-heading text-lg font-bold text-[#2A2D22]">
                              Kelola Sesi Akun
                            </h2>
                            <p className="text-xs leading-relaxed text-[#6E6A6C]">
                              {session?.role === 'admin'
                                ? 'Akun Anda memiliki lisensi Admin. Anda dapat mengelola pengguna terdaftar dan materi pembelajaran, berganti akun, atau kembali ke halaman Website utama.'
                                : 'Ibu dapat berganti akun pengguna terdaftar atau kembali ke halaman Website utama kapan saja.'}
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
                                  <span>Ganti Akun Pengguna</span>
                                </span>
                                <ArrowRight className="h-4 w-4" />
                              </button>

                              {/* Pintasan Panel Admin: HANYA MUNCUL JIKA MEMILIKI LISENSI ADMIN */}
                              {session?.role === 'admin' && (
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
                              )}

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
                      7. HALAMAN KHUSUS: PANEL ADMIN (Hanya untuk akun berlisensi Admin)
                     ========================================================= */}
                  {activeSection === 'admin' && session?.role === 'admin' && (
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

            {/* Bottom Navigation Bar untuk Mobile Phone (< 1024px) — FIXED agar selalu muncul saat scroll ke bawah maupun ke atas */}
            <nav
              aria-label="Navigasi Bawah Mobile"
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#F5DCE4] bg-white/95 backdrop-blur-md px-2 py-2 shadow-[0_-6px_26px_rgba(200,75,113,0.12)]"
            >
              <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
                {[
                  { id: 'beranda', label: 'Beranda', icon: Home },
                  { id: 'materi', label: 'Materi', icon: BookOpen },
                  { id: 'tips', label: 'Delima', icon: Sparkles },
                  { id: 'hasil', label: 'Hasil Saya', icon: Award },
                  { id: 'selfie', label: 'Selfie', icon: Camera },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSection(item.id)}
                      className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                        active
                          ? 'bg-[#FDF2F5] text-[#C84B71] font-bold shadow-2xs'
                          : 'text-[#767A6E] hover:text-[#2A2D22] font-medium'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={active ? 2.2 : 1.8} />
                      <span className="mt-0.5 text-[10px] leading-tight truncate">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
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

      {/* Dialog Autentikasi Masuk / Daftar / Admin */}
      <LoginDialog />

      {/* Dialog Kuesioner Kecemasan / Sapa Perasaan */}
      <AnxietyDialog />
    </>
  );
}

// Definisi tipe data utama untuk aplikasi Buna Ceria (Teman Kasih)

export type CompletionStatus = 'terkunci' | 'terbuka' | 'selesai';

export type UserRole = 'user' | 'admin';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  trimesterLabel?: string;
  role?: UserRole;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  trimesterLabel?: string;
  role?: UserRole;
  loggedInAt: string;
}

// Blok konten materi dirancang fleksibel agar ke depannya bisa memuat
// paragraf, subjudul, daftar, kutipan tenang, gambar, maupun video tanpa mengubah komponen.
export type ModuleContentBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'subheading';
      text: string;
    }
  | {
      type: 'list';
      title?: string;
      items: string[];
    }
  | {
      type: 'callout';
      title: string;
      text: string;
    }
  | {
      type: 'image';
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: 'video';
      url: string;
      title: string;
      caption?: string;
    };

export interface ModuleItem {
  id: string;
  order: number;
  title: string;
  summary: string;
  readingTimeMinutes: number;
  category: string;
  content: ModuleContentBlock[];
}

export interface QuizQuestion {
  id: string;
  order: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0 sampai 3
  explanation: string;
}

export interface AnxietyOption {
  label: 'Tidak pernah' | 'Kadang-Kadang' | 'Sering' | 'Selalu';
  value: 0 | 1 | 2 | 3;
}

export interface AnxietyQuestion {
  id: string;
  order: number;
  statement: string;
}

export type AnxietySeverityLevel =
  | 'minimal'
  | 'ringan-sedang-bawah'
  | 'ringan-sedang-atas'
  | 'berat'
  | 'rendah'
  | 'sedang'
  | 'tinggi';

export interface AnxietySubmission {
  userId: string;
  answers: Record<string, 0 | 1 | 2 | 3>;
  totalScore: number;
  maxScore: number;
  level: AnxietySeverityLevel;
  categoryLabel?: string;
  phase?: 'pretest' | 'posttest';
  attemptNumber?: number;
  completedAt: string;
}

export type TestAttemptCategory =
  | 'pretest-materi'
  | 'pretest-kecemasan'
  | 'kuis-materi'
  | 'posttest-kecemasan';

export interface TestAttemptRecord {
  id: string;
  category: TestAttemptCategory;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  level?: AnxietySeverityLevel;
  categoryLabel?: string;
  attemptNumber: number;
  completedAt: string;
}

export type DailyMoodType =
  | 'happy'
  | 'antusias'
  | 'soso'
  | 'khawatir'
  | 'sedih'
  | 'menangis'
  | 'marah'
  | 'sebel';

export interface DailyMoodEntry {
  dateKey: string; // YYYY-MM-DD
  mood: DailyMoodType;
  emoji: string;
  label: string;
  note?: string;
  updatedAt: string;
}

export interface PomegranateActivityLog {
  activityId: 'video' | 'audio' | 'game';
  title: string;
  pointsEarned: number;
  completedAt: string;
  dayNumber: number;
}

export interface PomegranateGardenState {
  points: number;
  completedActivities: Record<string, boolean>; // e.g., 'video': true, 'audio': true, 'game': true
  activityLogs: PomegranateActivityLog[];
  lastUpdatedAt: string;
}

// 3 Level Tahapan Pembelajaran sesuai pembaruan terbaru:
// Level 1: Materi -> Level 2: Refleksi Diri & Tips ('tahap-3') -> Level 3: Bunga Delima ('bunga-delima')
export type StageId = 'materi' | 'tahap-3' | 'bunga-delima';

export interface StageDefinition {
  id: StageId;
  order: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  prompts?: string[];
  evaluationPrompts?: string[];
  actionLabel?: string;
}

export interface PregnancyTip {
  id: string;
  title: string;
  description: string;
  iconName: 'Heart' | 'Sun' | 'Moon' | 'Droplets' | 'Smile' | 'ShieldCheck';
  tags?: [string, string, string];
  category?: string;
}

export interface FeelingTopic {
  id:
    | 'keluarga'
    | 'kecemasan'
    | 'stres'
    | 'mood'
    | 'persalinan'
    | 'tidur';
  label: string;
  title: string;
  advice: string;
  recommendedModuleId: string;
  recommendedModuleLabel: string;
}

export interface PregnancyPillar {
  id: 'tips-harian' | 'tahapan' | 'konsultasi';
  title: string;
  description: string;
  targetHref: string;
}

export interface ExpertContact {
  id: string;
  name: string;
  role: string;
  whatsappNumber: string;
  displayPhone: string;
  initials: string;
  scheduleNote: string;
  experienceLabel?: string;
  rating?: string;
  reviewsCount?: number;
  avatarUrl?: string;
}

export interface ReferenceItem {
  id: string;
  author: string;
  year: string;
  title: string;
  source: string;
  summaryNote: string;
}

export interface FooterContactInfo {
  personInCharge: string;
  role: string;
  email: string;
  whatsappNumber: string;
  displayWhatsapp: string;
  copyrightText: string;
  disclaimerText: string;
}

export interface UserProgress {
  userId: string;
  completedModuleIds: string[];
  completedStageIds: StageId[];
  activeStageId: StageId;
  bestQuizScore: number | null; // Persentase 0-100
  bestQuizCorrectCount: number | null; // Jumlah benar dari total soal
  quizAttempts: number;
  firstLoginAt?: string;
  initialPretestQuiz?: {
    score: number;
    maxScore: number;
    percentage: number;
    completedAt: string;
  };
  posttestQuiz?: {
    score: number;
    maxScore: number;
    percentage: number;
    completedAt: string;
  };
  initialPretestAnxiety?: {
    totalScore: number;
    maxScore: number;
    level: AnxietySeverityLevel;
    categoryLabel?: string;
    completedAt: string;
  };
  posttestAnxiety?: {
    totalScore: number;
    maxScore: number;
    level: AnxietySeverityLevel;
    categoryLabel?: string;
    completedAt: string;
  };
  testHistory?: TestAttemptRecord[];
  dailyMoods?: Record<string, DailyMoodEntry>;
  pomegranateGarden?: PomegranateGardenState;
  simulatedDayOffset?: number; // Hari offset simulasi: 0 (default/Hari 1), 2 (Hari 3), 4 (Hari 5), 6 (Hari 7)
  reflectionNote?: string;
  reflectionSelectedItems?: string[];
  evaluationCheckedItems?: string[];
  reflectionStartTimeChoice?: string;
  updatedAt: string;
}

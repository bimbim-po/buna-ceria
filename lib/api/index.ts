// Lapisan data terpusat (Mock API) untuk Teman Kasih.
// Semua komponen membaca dan menulis data hanya melalui fungsi di berkas ini.
// Nantinya fungsi-fungsi ini dapat diganti dengan pemanggilan REST API / backend sungguhan.

import { mockUsers } from '@/data/users';
import { mockModules } from '@/data/modules';
import { mockQuizQuestions } from '@/data/quiz';
import {
  anxietyClosingMessages,
  anxietyIntroDisclaimer,
  anxietyScaleOptions,
  mockAnxietyQuestions,
} from '@/data/anxiety';
import { mockStages } from '@/data/stages';
import { mockPregnancyTips } from '@/data/tips';
import { mockFeelingTopics, mockPregnancyPillars } from '@/data/feelings';
import { mockExperts } from '@/data/experts';
import { mockReferences } from '@/data/references';
import { mockFooterContact } from '@/data/footer';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import {
  AnxietyOption,
  AnxietyQuestion,
  AnxietySubmission,
  CompletionStatus,
  ExpertContact,
  FeelingTopic,
  FooterContactInfo,
  MockUser,
  ModuleItem,
  PregnancyPillar,
  PregnancyTip,
  QuizQuestion,
  ReferenceItem,
  StageDefinition,
  StageId,
  UserProgress,
  UserSession,
} from '@/types';

const STAGE_ORDER: StageId[] = [
  'materi',
  'quiz',
  'tahap-3',
  'tahap-4',
  'hasil-saya',
];

function createDefaultProgress(userId: string): UserProgress {
  return {
    userId,
    completedModuleIds: [],
    completedStageIds: [],
    activeStageId: 'materi',
    bestQuizScore: null,
    bestQuizCorrectCount: null,
    quizAttempts: 0,
    reflectionNote: '',
    reflectionSelectedItems: [],
    evaluationCheckedItems: [],
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 1. AUTENTIKASI & SESI
// ============================================================================

export function getDemoAccounts(): Pick<
  MockUser,
  'name' | 'email' | 'phone' | 'password' | 'trimesterLabel'
>[] {
  return mockUsers.map(({ name, email, phone, password, trimesterLabel }) => ({
    name,
    email,
    phone,
    password,
    trimesterLabel,
  }));
}

export function getSession(): UserSession | null {
  return storage.getItem<UserSession | null>(STORAGE_KEYS.SESSION, null);
}

export function login(
  identifier: string,
  password: string
): { success: true; session: UserSession } | { success: false; error: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPhone = identifier.replace(/[\s\-]/g, '').trim();

  if (!cleanId) {
    return {
      success: false,
      error: 'Mohon isi alamat email atau nomor HP Ibu terlebih dahulu.',
    };
  }

  if (!password.trim()) {
    return {
      success: false,
      error: 'Mohon isi kata sandi Ibu terlebih dahulu.',
    };
  }

  const matchedUser = mockUsers.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.phone.replace(/[\s\-]/g, '') === cleanPhone
  );

  if (!matchedUser) {
    return {
      success: false,
      error:
        'Maaf Ibu, email atau nomor HP tersebut belum terdaftar. Silakan gunakan salah satu dari 3 akun contoh yang tersedia.',
    };
  }

  if (matchedUser.password !== password) {
    return {
      success: false,
      error:
        'Kata sandi yang dimasukkan belum sesuai. Silakan periksa kembali dengan tenang.',
    };
  }

  const session: UserSession = {
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    phone: matchedUser.phone,
    trimesterLabel: matchedUser.trimesterLabel,
    loggedInAt: new Date().toISOString(),
  };

  storage.setItem(STORAGE_KEYS.SESSION, session);
  return { success: true, session };
}

export function logout(): void {
  storage.removeItem(STORAGE_KEYS.SESSION);
}

// ============================================================================
// 2. DATA KONTEN STATIS (MATERI, QUIZ, TIPS, AHLI, PUSTAKA, FOOTER)
// ============================================================================

export function getModules(): ModuleItem[] {
  return [...mockModules].sort((a, b) => a.order - b.order);
}

export function getQuizQuestions(): QuizQuestion[] {
  return [...mockQuizQuestions].sort((a, b) => a.order - b.order);
}

export function getAnxietyConfig(): {
  questions: AnxietyQuestion[];
  scaleOptions: AnxietyOption[];
  introDisclaimer: string;
  closingMessages: typeof anxietyClosingMessages;
} {
  return {
    questions: [...mockAnxietyQuestions].sort((a, b) => a.order - b.order),
    scaleOptions: anxietyScaleOptions,
    introDisclaimer: anxietyIntroDisclaimer,
    closingMessages: anxietyClosingMessages,
  };
}

export function getStages(): StageDefinition[] {
  return [...mockStages].sort((a, b) => a.order - b.order);
}

export function getTips(): PregnancyTip[] {
  return mockPregnancyTips;
}

export function getPregnancyPillars(): PregnancyPillar[] {
  return mockPregnancyPillars;
}

export function getFeelingTopics(): FeelingTopic[] {
  return mockFeelingTopics;
}

export function getExperts(): ExpertContact[] {
  return mockExperts;
}

export function getReferences(): ReferenceItem[] {
  return mockReferences;
}

export function getFooterContact(): FooterContactInfo {
  return mockFooterContact;
}

// ============================================================================
// 3. KUESIONER KECEMASAN (SEKALI TAMPIL PER AKUN)
// ============================================================================

export function getAnxietySubmission(userId: string): AnxietySubmission | null {
  const allSubmissions = storage.getItem<Record<string, AnxietySubmission>>(
    STORAGE_KEYS.ANXIETY_BY_USER,
    {}
  );
  return allSubmissions[userId] ?? null;
}

export function saveAnxietyAnswers(
  userId: string,
  answers: Record<string, 0 | 1 | 2 | 3>
): AnxietySubmission {
  const questions = getAnxietyConfig().questions;
  const maxScore = questions.length * 3; // 7 * 3 = 21
  const totalScore = Object.values(answers).reduce<number>(
    (acc, val) => acc + val,
    0
  );

  // Klasifikasi tingkat kecemasan secara lembut untuk menyesuaikan pesan pendampingan
  let level: 'rendah' | 'sedang' | 'tinggi' = 'rendah';
  if (totalScore >= 13) {
    level = 'tinggi';
  } else if (totalScore >= 7) {
    level = 'sedang';
  }

  const submission: AnxietySubmission = {
    userId,
    answers,
    totalScore,
    maxScore,
    level,
    completedAt: new Date().toISOString(),
  };

  const allSubmissions = storage.getItem<Record<string, AnxietySubmission>>(
    STORAGE_KEYS.ANXIETY_BY_USER,
    {}
  );
  allSubmissions[userId] = submission;
  storage.setItem(STORAGE_KEYS.ANXIETY_BY_USER, allSubmissions);

  return submission;
}

// ============================================================================
// 4. PROGRES BELAJAR, ATURAN KUNCI TAHAPAN, DAN SKOR QUIZ
// ============================================================================

export function getUserProgress(userId: string): UserProgress {
  const allProgress = storage.getItem<Record<string, UserProgress>>(
    STORAGE_KEYS.PROGRESS_BY_USER,
    {}
  );
  return allProgress[userId] ?? createDefaultProgress(userId);
}

function saveUserProgress(progress: UserProgress): UserProgress {
  const allProgress = storage.getItem<Record<string, UserProgress>>(
    STORAGE_KEYS.PROGRESS_BY_USER,
    {}
  );
  const updated: UserProgress = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  allProgress[progress.userId] = updated;
  storage.setItem(STORAGE_KEYS.PROGRESS_BY_USER, allProgress);
  return updated;
}

/**
 * Menghitung status tiap materi (terkunci, terbuka, selesai).
 * Materi terbuka secara bertahap: Materi 1 terbuka saat sudah login,
 * Materi berikutnya terbuka setelah materi sebelumnya selesai dibaca.
 */
export function getModuleStatuses(
  progress: UserProgress | null
): Record<string, CompletionStatus> {
  const modules = getModules();
  const statuses: Record<string, CompletionStatus> = {};

  if (!progress) {
    modules.forEach((mod) => {
      statuses[mod.id] = 'terkunci';
    });
    return statuses;
  }

  modules.forEach((mod, index) => {
    const isDone = progress.completedModuleIds.includes(mod.id);
    if (isDone) {
      statuses[mod.id] = 'selesai';
    } else if (index === 0) {
      statuses[mod.id] = 'terbuka';
    } else {
      const prevModule = modules[index - 1];
      const isPrevDone = progress.completedModuleIds.includes(prevModule.id);
      statuses[mod.id] = isPrevDone ? 'terbuka' : 'terkunci';
    }
  });

  return statuses;
}

/**
 * Menghitung status tiap bulatan tahapan (terkunci, terbuka, selesai).
 * Aturan kunci: Hanya tahap pertama yang terbuka di awal.
 * Tahap berikutnya terbuka hanya setelah tahap sebelumnya ditandai selesai.
 */
export function getStageStatuses(
  progress: UserProgress | null
): Record<StageId, CompletionStatus> {
  const statuses: Record<StageId, CompletionStatus> = {
    materi: 'terkunci',
    quiz: 'terkunci',
    'tahap-3': 'terkunci',
    'tahap-4': 'terkunci',
    'hasil-saya': 'terkunci',
  };

  if (!progress) {
    return statuses;
  }

  STAGE_ORDER.forEach((stageId, index) => {
    const isCompleted = progress.completedStageIds.includes(stageId);
    if (isCompleted) {
      statuses[stageId] = 'selesai';
    } else if (index === 0) {
      statuses[stageId] = 'terbuka';
    } else {
      const prevStageId = STAGE_ORDER[index - 1];
      const isPrevCompleted = progress.completedStageIds.includes(prevStageId);
      statuses[stageId] = isPrevCompleted ? 'terbuka' : 'terkunci';
    }
  });

  return statuses;
}

export function setActiveStage(userId: string, stageId: StageId): UserProgress {
  const current = getUserProgress(userId);
  const statuses = getStageStatuses(current);
  // Cegah berpindah ke tahap yang masih terkunci
  if (statuses[stageId] === 'terkunci') {
    return current;
  }
  return saveUserProgress({
    ...current,
    activeStageId: stageId,
  });
}

/**
 * Menandai satu materi selesai dibaca.
 * Bila keempat materi sudah selesai dibaca, tahap 'materi' otomatis ditandai selesai.
 */
export function completeModule(userId: string, moduleId: string): UserProgress {
  const current = getUserProgress(userId);
  const allModules = getModules();

  const updatedModules = current.completedModuleIds.includes(moduleId)
    ? current.completedModuleIds
    : [...current.completedModuleIds, moduleId];

  const allFourCompleted = allModules.every((m) =>
    updatedModules.includes(m.id)
  );

  const updatedStages: StageId[] = [...current.completedStageIds];
  if (allFourCompleted && !updatedStages.includes('materi')) {
    updatedStages.push('materi');
  }

  return saveUserProgress({
    ...current,
    completedModuleIds: updatedModules,
    completedStageIds: updatedStages,
  });
}

/**
 * Menyimpan skor quiz. Menyimpan skor terbaik jika pengguna mengulang.
 * Setelah skor tersimpan, tahap 'quiz' otomatis ditandai selesai.
 */
export function saveQuizScore(
  userId: string,
  correctCount: number,
  totalQuestions: number
): UserProgress {
  const current = getUserProgress(userId);
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const bestQuizScore =
    current.bestQuizScore === null
      ? percentage
      : Math.max(current.bestQuizScore, percentage);

  const bestQuizCorrectCount =
    current.bestQuizCorrectCount === null
      ? correctCount
      : Math.max(current.bestQuizCorrectCount, correctCount);

  const updatedStages: StageId[] = current.completedStageIds.includes('quiz')
    ? current.completedStageIds
    : [...current.completedStageIds, 'quiz'];

  return saveUserProgress({
    ...current,
    bestQuizScore,
    bestQuizCorrectCount,
    quizAttempts: current.quizAttempts + 1,
    completedStageIds: updatedStages,
  });
}

/**
 * Menandai suatu tahap selesai dan membuka tahap berikutnya.
 */
export function completeStage(
  userId: string,
  stageId: StageId,
  extraData?: {
    reflectionNote?: string;
    reflectionSelectedItems?: string[];
    evaluationCheckedItems?: string[];
    advanceToNext?: boolean;
  }
): UserProgress {
  const current = getUserProgress(userId);
  const updatedStages: StageId[] = current.completedStageIds.includes(stageId)
    ? [...current.completedStageIds]
    : [...current.completedStageIds, stageId];

  const currentIdx = STAGE_ORDER.indexOf(stageId);
  const nextStageId =
    extraData?.advanceToNext !== false &&
    currentIdx >= 0 &&
    currentIdx < STAGE_ORDER.length - 1
      ? STAGE_ORDER[currentIdx + 1]
      : current.activeStageId;

  // Jika tahap berikutnya adalah 'hasil-saya' dan semua tahap sebelumnya selesai,
  // tandai 'hasil-saya' selesai saat dibuka agar progres mencapai 100%.
  if (nextStageId === 'hasil-saya' && !updatedStages.includes('hasil-saya')) {
    updatedStages.push('hasil-saya');
  }

  return saveUserProgress({
    ...current,
    completedStageIds: updatedStages,
    activeStageId: nextStageId,
    reflectionNote: extraData?.reflectionNote ?? current.reflectionNote,
    reflectionSelectedItems:
      extraData?.reflectionSelectedItems ?? current.reflectionSelectedItems,
    evaluationCheckedItems:
      extraData?.evaluationCheckedItems ?? current.evaluationCheckedItems,
  });
}

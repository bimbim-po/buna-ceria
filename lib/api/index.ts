// Lapisan data terpusat (Mock API + LocalStorage Persistence) untuk Buna Ceria (Teman Kasih).
// Mendukung 3 Role sesuai Client Brief: Pengunjung Umum, Pengguna Terdaftar, dan Admin.

import { mockUsers } from '@/data/users';
import { mockModules } from '@/data/modules';
import { mockQuizQuestions } from '@/data/quiz';
import {
  anxietyClosingMessages,
  anxietyIntroDisclaimer,
  anxietyScaleOptions,
  evaluatePassScore,
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
  syncAnxietyToSupabase,
  syncProgressToSupabase,
  syncUserToSupabase,
} from '@/lib/supabase';
import {
  AnxietyOption,
  AnxietyQuestion,
  AnxietySubmission,
  CompletionStatus,
  DailyMoodType,
  ExpertContact,
  FeelingTopic,
  FooterContactInfo,
  MockUser,
  ModuleItem,
  PomegranateGardenState,
  PregnancyPillar,
  PregnancyTip,
  QuizQuestion,
  ReferenceItem,
  StageDefinition,
  StageId,
  TestAttemptCategory,
  TestAttemptRecord,
  UserProgress,
  UserSession,
} from '@/types';

// 3 Level Tahapan Pembelajaran Masa Nifas:
// Level 1: Materi -> Level 2: Refleksi Diri & Tips ('tahap-3') -> Level 3: Bunga Delima ('bunga-delima')
const STAGE_ORDER: StageId[] = ['materi', 'tahap-3', 'bunga-delima'];

function normalizeNifasLabel(label?: string): string {
  if (!label || label.startsWith('Trimester')) {
    return 'Nifas Hari ke 1-2 Hari';
  }
  return label;
}

function createDefaultProgress(userId: string): UserProgress {
  return {
    userId,
    completedModuleIds: [],
    completedStageIds: [],
    activeStageId: 'materi',
    bestQuizScore: null,
    bestQuizCorrectCount: null,
    quizAttempts: 0,
    firstLoginAt: new Date().toISOString(),
    testHistory: [],
    dailyMoods: {},
    pomegranateGarden: {
      points: 0,
      completedActivities: {},
      activityLogs: [],
      lastUpdatedAt: new Date().toISOString(),
    },
    simulatedDayOffset: 0,
    reflectionNote: '',
    reflectionSelectedItems: [],
    evaluationCheckedItems: [],
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 1. MANAJEMEN PENGGUNA, REGISTRASI, LOGIN, PROFIL, & ADMIN USER CRUD
// ============================================================================

export function getAllUsers(): MockUser[] {
  const saved = storage.getItem<MockUser[] | null>(STORAGE_KEYS.USERS_LIST, null);
  const raw = !saved || saved.length === 0 ? [...mockUsers] : saved;
  return raw.map((u) => ({
    ...u,
    trimesterLabel:
      u.role === 'admin' ? u.trimesterLabel : normalizeNifasLabel(u.trimesterLabel),
  }));
}

function saveAllUsers(users: MockUser[]): void {
  storage.setItem(STORAGE_KEYS.USERS_LIST, users);
}

export function getDemoAccounts(): Pick<
  MockUser,
  'name' | 'email' | 'phone' | 'password' | 'trimesterLabel' | 'role'
>[] {
  return getAllUsers().map(
    ({ name, email, phone, password, trimesterLabel, role }) => ({
      name,
      email,
      phone,
      password,
      trimesterLabel,
      role,
    })
  );
}

export function getSession(): UserSession | null {
  const session = storage.getItem<UserSession | null>(STORAGE_KEYS.SESSION, null);
  if (!session) return null;
  if (session.role !== 'admin' && (!session.trimesterLabel || session.trimesterLabel.startsWith('Trimester'))) {
    const normalized: UserSession = {
      ...session,
      trimesterLabel: normalizeNifasLabel(session.trimesterLabel),
    };
    storage.setItem(STORAGE_KEYS.SESSION, normalized);
    return normalized;
  }
  return session;
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
      error: 'Mohon isi alamat email atau nomor HP terlebih dahulu.',
    };
  }

  if (!password.trim()) {
    return {
      success: false,
      error: 'Mohon isi kata sandi terlebih dahulu.',
    };
  }

  const users = getAllUsers();
  const matchedUser = users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.phone.replace(/[\s\-]/g, '') === cleanPhone
  );

  if (!matchedUser) {
    return {
      success: false,
      error:
        'Akun belum terdaftar. Silakan gunakan tab "Daftar Akun Baru" atau pilih salah satu akun contoh di bawah.',
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
    trimesterLabel:
      matchedUser.role === 'admin'
        ? matchedUser.trimesterLabel
        : normalizeNifasLabel(matchedUser.trimesterLabel),
    role: matchedUser.role ?? 'user',
    loggedInAt: new Date().toISOString(),
  };

  storage.setItem(STORAGE_KEYS.SESSION, session);
  return { success: true, session };
}

export function registerUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  trimesterLabel?: string;
}): { success: true; session: UserSession } | { success: false; error: string } {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const password = input.password.trim();

  if (!name) {
    return { success: false, error: 'Mohon isi nama lengkap Bunda.' };
  }
  if (!phone || phone.replace(/\D/g, '').length < 9) {
    return {
      success: false,
      error: 'Mohon masukkan nomor WhatsApp aktif Bunda (minimal 9 digit) untuk pengiriman notifikasi pengingat Post-Test hari ke-7.',
    };
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Mohon isi alamat email yang valid.' };
  }
  if (!password || password.length < 4) {
    return {
      success: false,
      error: 'Kata sandi minimal terdiri dari 4 karakter.',
    };
  }

  const users = getAllUsers();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return {
      success: false,
      error: 'Email tersebut sudah terdaftar. Silakan langsung masuk (Login).',
    };
  }
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone && users.some((u) => u.phone && u.phone.replace(/\D/g, '') === cleanPhone)) {
    return {
      success: false,
      error: 'Nomor WhatsApp tersebut sudah terdaftar pada akun lain. Silakan langsung masuk (Login).',
    };
  }

  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    password,
    trimesterLabel: input.trimesterLabel || 'Nifas Hari ke 1-2 Hari',
    role: 'user',
  };

  const updatedUsers = [...users, newUser];
  saveAllUsers(updatedUsers);
  void syncUserToSupabase(newUser);

  const session: UserSession = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    trimesterLabel: newUser.trimesterLabel,
    role: 'user',
    loggedInAt: new Date().toISOString(),
  };

  storage.setItem(STORAGE_KEYS.SESSION, session);
  return { success: true, session };
}

export function updateUserProfile(
  userId: string,
  updates: {
    name: string;
    email: string;
    phone: string;
    trimesterLabel?: string;
    password?: string;
  }
): UserSession | null {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);
  const currentSession = getSession();

  const updatedUser: MockUser =
    idx >= 0
      ? {
          ...users[idx],
          name: updates.name.trim() || users[idx].name,
          email: updates.email.trim() || users[idx].email,
          phone: updates.phone.trim() || users[idx].phone,
          trimesterLabel: updates.trimesterLabel || users[idx].trimesterLabel,
          password:
            updates.password && updates.password.trim()
              ? updates.password.trim()
              : users[idx].password,
        }
      : {
          id: userId,
          name: updates.name.trim(),
          email: updates.email.trim(),
          phone: updates.phone.trim(),
          trimesterLabel: updates.trimesterLabel || 'Trimester 1',
          password: updates.password?.trim() || 'kasih123',
          role: currentSession?.role ?? 'user',
        };

  if (idx >= 0) {
    users[idx] = updatedUser;
  } else {
    users.push(updatedUser);
  }
  saveAllUsers(users);
  void syncUserToSupabase(updatedUser);

  if (currentSession && currentSession.id === userId) {
    const newSession: UserSession = {
      ...currentSession,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      trimesterLabel: updatedUser.trimesterLabel,
    };
    storage.setItem(STORAGE_KEYS.SESSION, newSession);
    return newSession;
  }
  return currentSession;
}

export function adminSaveUser(user: MockUser): MockUser[] {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  saveAllUsers(users);
  void syncUserToSupabase(user);
  return [...users];
}

export function adminDeleteUser(userId: string): MockUser[] {
  const users = getAllUsers().filter((u) => u.id !== userId);
  saveAllUsers(users);
  return users;
}

export function logout(): void {
  storage.removeItem(STORAGE_KEYS.SESSION);
}

// ============================================================================
// 2. DATA KONTEN & ADMIN MATERI CRUD
// ============================================================================

export function getModules(): ModuleItem[] {
  const saved = storage.getItem<ModuleItem[] | null>(
    STORAGE_KEYS.MODULES_LIST,
    null
  );
  const source = saved && saved.length > 0 ? saved : mockModules;
  return [...source].sort((a, b) => a.order - b.order);
}

export function adminSaveModule(mod: ModuleItem): ModuleItem[] {
  const current = getModules();
  const idx = current.findIndex((m) => m.id === mod.id);
  if (idx >= 0) {
    current[idx] = mod;
  } else {
    current.push(mod);
  }
  const sorted = [...current].sort((a, b) => a.order - b.order);
  storage.setItem(STORAGE_KEYS.MODULES_LIST, sorted);
  return sorted;
}

export function adminDeleteModule(moduleId: string): ModuleItem[] {
  const filtered = getModules()
    .filter((m) => m.id !== moduleId)
    .map((m, idx) => ({ ...m, order: idx + 1 }));
  storage.setItem(STORAGE_KEYS.MODULES_LIST, filtered);
  return filtered;
}

export function adminResetModules(): ModuleItem[] {
  storage.removeItem(STORAGE_KEYS.MODULES_LIST);
  return getModules();
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
// 3. KUESIONER KECEMASAN (DISIMPAN PER AKUN)
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
  answers: Record<string, 0 | 1 | 2 | 3>,
  phase: 'pretest' | 'posttest' = 'pretest'
): AnxietySubmission {
  const currentProgress = getUserProgress(userId);

  // Pre-Test dan Post-Test masing-masing hanya bisa dikerjakan 1 kali
  if (phase === 'pretest' && currentProgress.initialPretestAnxiety) {
    const existing = getAnxietySubmission(userId);
    if (existing) return existing;
  }
  if (phase === 'posttest' && currentProgress.posttestAnxiety) {
    const existing = getAnxietySubmission(userId);
    if (existing) return existing;
  }

  const questions = getAnxietyConfig().questions;
  const maxScore = questions.length * 3;
  const totalScore = Object.values(answers).reduce<number>(
    (acc, val) => acc + val,
    0
  );

  const passInfo = evaluatePassScore(totalScore, maxScore);
  const level = passInfo.level;
  const categoryLabel = passInfo.categoryLabel;

  const submission: AnxietySubmission = {
    userId,
    answers,
    totalScore,
    maxScore,
    level,
    categoryLabel,
    phase,
    attemptNumber: 1,
    completedAt: new Date().toISOString(),
  };

  const allSubmissions = storage.getItem<Record<string, AnxietySubmission>>(
    STORAGE_KEYS.ANXIETY_BY_USER,
    {}
  );
  allSubmissions[userId] = submission;
  storage.setItem(STORAGE_KEYS.ANXIETY_BY_USER, allSubmissions);

  // Perbarui UserProgress: catat riwayat pengerjaan tes dan hasil awal/akhir (1x pengerjaan)
  const testHistory = currentProgress.testHistory ? [...currentProgress.testHistory] : [];

  const targetCategory: TestAttemptCategory =
    phase === 'posttest' ? 'posttest-kecemasan' : 'pretest-kecemasan';

  const newRecord: TestAttemptRecord = {
    id: `attempt-anxiety-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    category: targetCategory,
    title:
      phase === 'posttest'
        ? `Post-Test Skrining Kecemasan PASS (Hari ke-7)`
        : `Pre-Test Skrining Kecemasan PASS`,
    score: totalScore,
    maxScore,
    percentage: Math.round((totalScore / maxScore) * 100),
    level,
    categoryLabel,
    attemptNumber: 1,
    completedAt: submission.completedAt,
  };

  testHistory.unshift(newRecord);

  const updatedProgress: UserProgress = {
    ...currentProgress,
    testHistory,
    ...(phase === 'pretest' && !currentProgress.initialPretestAnxiety
      ? {
          initialPretestAnxiety: {
            totalScore,
            maxScore,
            level,
            categoryLabel,
            completedAt: submission.completedAt,
          },
        }
      : {}),
    ...(phase === 'posttest' && !currentProgress.posttestAnxiety
      ? {
          posttestAnxiety: {
            totalScore,
            maxScore,
            level,
            categoryLabel,
            completedAt: submission.completedAt,
          },
        }
      : {}),
  };

  saveUserProgress(updatedProgress);
  void syncAnxietyToSupabase(submission);

  return submission;
}

// ============================================================================
// 4. PROGRES BELAJAR 3 LEVEL, ATURAN KUNCI TAHAPAN, DAN SKOR QUIZ
// ============================================================================

export function getUserProgress(userId: string): UserProgress {
  const allProgress = storage.getItem<Record<string, UserProgress>>(
    STORAGE_KEYS.PROGRESS_BY_USER,
    {}
  );
  const saved = allProgress[userId];
  if (!saved) {
    return createDefaultProgress(userId);
  }
  const validStage = STAGE_ORDER.includes(saved.activeStageId)
    ? saved.activeStageId
    : 'materi';
  const cleanedCompletedStages = (saved.completedStageIds || []).filter((id) =>
    STAGE_ORDER.includes(id)
  );
  return {
    ...saved,
    completedStageIds: cleanedCompletedStages,
    activeStageId: validStage,
  };
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
  void syncProgressToSupabase(updated);
  return updated;
}

/**
 * Menghitung status tiap materi (terkunci, terbuka, selesai).
 * Materi terbuka secara bertahap: Materi 1 terbuka di awal,
 * Materi berikutnya terbuka setelah materi sebelumnya selesai dibaca.
 */
export function getModuleStatuses(
  progress: UserProgress | null
): Record<string, CompletionStatus> {
  const modules = getModules();
  const statuses: Record<string, CompletionStatus> = {};

  if (!progress) {
    modules.forEach((mod, index) => {
      statuses[mod.id] = index === 0 ? 'terbuka' : 'terkunci';
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
 * Menghitung status tiap bulatan 4 level tahapan (terkunci, terbuka, selesai).
 * Aturan kunci (Client Brief No. 13 & User Flow No. 5-6):
 * Hanya tahap pertama (Materi) yang terbuka di awal.
 * Tahap berikutnya terbuka setelah tahap sebelumnya selesai:
 * Level 1 (Materi) -> Level 2 (Quiz) -> Level 3 (Tahap 3) -> Level 4 (Hasil Saya).
 */
export function getStageStatuses(
  progress: UserProgress | null
): Record<StageId, CompletionStatus> {
  const statuses: Record<StageId, CompletionStatus> = {
    materi: 'terbuka',
    'tahap-3': 'terkunci',
    'bunga-delima': 'terkunci',
  };

  if (!progress) {
    return statuses;
  }

  STAGE_ORDER.forEach((stageId, index) => {
    const isCompleted =
      progress.completedStageIds.includes(stageId) ||
      (stageId === 'bunga-delima' && (progress.pomegranateGarden?.points ?? 0) >= 25);
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
 * Bila semua materi sudah selesai dibaca, Level 1 ('materi') otomatis ditandai selesai
 * sehingga Level 2 ('quiz') langsung terbuka.
 */
export function completeModule(userId: string, moduleId: string): UserProgress {
  const current = getUserProgress(userId);
  const allModules = getModules();

  const updatedModules = current.completedModuleIds.includes(moduleId)
    ? current.completedModuleIds
    : [...current.completedModuleIds, moduleId];

  const allCompleted = allModules.every((m) => updatedModules.includes(m.id));

  const updatedStages: StageId[] = [...current.completedStageIds];
  if (allCompleted && !updatedStages.includes('materi')) {
    updatedStages.push('materi');
  }

  return saveUserProgress({
    ...current,
    completedModuleIds: updatedModules,
    completedStageIds: updatedStages,
  });
}

/**
 * Menyimpan skor pemahaman 20 soal (Pre-Test Awal atau Post-Test Hari ke-7).
 * Baik Pre-Test maupun Post-Test hanya dapat dikerjakan 1 kali per akun.
 */
export function saveQuizScore(
  userId: string,
  correctCount: number,
  totalQuestions: number,
  isPretest: boolean = false
): UserProgress {
  const current = getUserProgress(userId);

  // Hanya bisa dikerjakan 1 kali untuk Pre-Test dan 1 kali untuk Post-Test
  if (isPretest && current.initialPretestQuiz) {
    return current;
  }
  if (!isPretest && current.posttestQuiz) {
    return current;
  }

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const bestQuizScore =
    current.bestQuizScore === null
      ? percentage
      : Math.max(current.bestQuizScore, percentage);

  const bestQuizCorrectCount =
    current.bestQuizCorrectCount === null
      ? correctCount
      : Math.max(current.bestQuizCorrectCount, correctCount);

  const testHistory = current.testHistory ? [...current.testHistory] : [];
  const targetCategory: TestAttemptCategory = isPretest
    ? 'pretest-materi'
    : 'kuis-materi';

  const newRecord: TestAttemptRecord = {
    id: `attempt-quiz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    category: targetCategory,
    title: isPretest
      ? 'Pre-Test Pemahaman Materi (20 Pertanyaan)'
      : 'Post-Test Pemahaman Materi (Hari ke-7 • 20 Pertanyaan)',
    score: correctCount,
    maxScore: totalQuestions,
    percentage,
    attemptNumber: 1,
    completedAt: new Date().toISOString(),
  };

  testHistory.unshift(newRecord);

  const initialPretestQuiz =
    isPretest && !current.initialPretestQuiz
      ? {
          score: correctCount,
          maxScore: totalQuestions,
          percentage,
          completedAt: newRecord.completedAt,
        }
      : current.initialPretestQuiz;

  const posttestQuiz =
    !isPretest && !current.posttestQuiz
      ? {
          score: correctCount,
          maxScore: totalQuestions,
          percentage,
          completedAt: newRecord.completedAt,
        }
      : current.posttestQuiz;

  return saveUserProgress({
    ...current,
    bestQuizScore: isPretest ? current.bestQuizScore : bestQuizScore,
    bestQuizCorrectCount: isPretest ? current.bestQuizCorrectCount : bestQuizCorrectCount,
    quizAttempts: isPretest ? current.quizAttempts : current.quizAttempts + 1,
    initialPretestQuiz,
    posttestQuiz,
    testHistory,
  });
}

/**
 * Menandai suatu level selesai dan membuka level berikutnya.
 */
export function completeStage(
  userId: string,
  stageId: StageId,
  extraData?: {
    reflectionNote?: string;
    reflectionSelectedItems?: string[];
    evaluationCheckedItems?: string[];
    reflectionStartTimeChoice?: string;
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

  if (nextStageId === 'bunga-delima' && !updatedStages.includes('bunga-delima')) {
    updatedStages.push('bunga-delima');
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
    reflectionStartTimeChoice:
      extraData?.reflectionStartTimeChoice ?? current.reflectionStartTimeChoice,
  });
}

// ============================================================================
// 5. KALENDER EMOT HARIAN & KEBUN BUAH DELIMA (GAMIFIKASI 2 HARI & HARI KE-7)
// ============================================================================

export function getUserDayInfo(userId: string): {
  dayNumber: number;
  firstLoginAt: string;
  simulatedOffset: number;
  unlocked: {
    video: boolean;
    audio: boolean;
    game: boolean;
    posttestAnxiety: boolean;
  };
} {
  const progress = getUserProgress(userId);
  const firstLoginAt = progress.firstLoginAt || new Date().toISOString();
  const startTime = new Date(firstLoginAt).getTime();
  const now = Date.now();
  const realDiffDays = Math.max(0, Math.floor((now - startTime) / (1000 * 60 * 60 * 24)));
  const simulatedOffset = progress.simulatedDayOffset || 0;
  const dayNumber = Math.max(1, 1 + realDiffDays + simulatedOffset);

  return {
    dayNumber,
    firstLoginAt,
    simulatedOffset,
    unlocked: {
      video: dayNumber >= 1,
      audio: dayNumber >= 3,
      game: dayNumber >= 5,
      posttestAnxiety: dayNumber >= 7,
    },
  };
}

export function setSimulatedDay(userId: string, targetDay: 1 | 3 | 5 | 7): UserProgress {
  const current = getUserProgress(userId);
  const firstLoginAt = current.firstLoginAt || new Date().toISOString();
  const startTime = new Date(firstLoginAt).getTime();
  const now = Date.now();
  const realDiffDays = Math.max(0, Math.floor((now - startTime) / (1000 * 60 * 60 * 24)));
  const offset = (targetDay - 1) - realDiffDays;

  return saveUserProgress({
    ...current,
    simulatedDayOffset: offset,
  });
}

export function completeGardenActivity(
  userId: string,
  activityId: 'video' | 'audio' | 'game',
  pointsEarned: number,
  title: string
): UserProgress {
  const current = getUserProgress(userId);
  const garden = current.pomegranateGarden || {
    points: 0,
    completedActivities: {},
    activityLogs: [],
    lastUpdatedAt: new Date().toISOString(),
  };

  if (garden.completedActivities[activityId]) {
    return current;
  }

  const dayInfo = getUserDayInfo(userId);
  const newPoints = Math.min(100, (garden.points || 0) + pointsEarned);

  const updatedGarden: PomegranateGardenState = {
    points: newPoints,
    completedActivities: {
      ...garden.completedActivities,
      [activityId]: true,
    },
    activityLogs: [
      {
        activityId,
        title,
        pointsEarned,
        completedAt: new Date().toISOString(),
        dayNumber: dayInfo.dayNumber,
      },
      ...(garden.activityLogs || []),
    ],
    lastUpdatedAt: new Date().toISOString(),
  };

  return saveUserProgress({
    ...current,
    pomegranateGarden: updatedGarden,
  });
}

export function saveDailyMood(
  userId: string,
  entry: {
    dateKey: string;
    mood: DailyMoodType;
    emoji: string;
    label: string;
    note?: string;
  }
): UserProgress {
  const current = getUserProgress(userId);
  const dailyMoods = { ...(current.dailyMoods || {}) };
  dailyMoods[entry.dateKey] = {
    ...entry,
    updatedAt: new Date().toISOString(),
  };

  return saveUserProgress({
    ...current,
    dailyMoods,
  });
}

'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  completeModule as apiCompleteModule,
  completeStage as apiCompleteStage,
  getAnxietySubmission,
  getModuleStatuses,
  getModules,
  getSession,
  getStageStatuses,
  getUserProgress,
  login as apiLogin,
  logout as apiLogout,
  registerUser as apiRegisterUser,
  saveAnxietyAnswers as apiSaveAnxietyAnswers,
  saveQuizScore as apiSaveQuizScore,
  setActiveStage as apiSetActiveStage,
  updateUserProfile as apiUpdateUserProfile,
} from '@/lib/api';
import {
  AnxietySubmission,
  CompletionStatus,
  StageId,
  UserProgress,
  UserSession,
} from '@/types';

export type AppMode = 'landing' | 'webapp';

interface AppContextValue {
  isHydrated: boolean;
  appMode: AppMode;
  activeSection: string;
  session: UserSession | null;
  progress: UserProgress | null;
  anxietySubmission: AnxietySubmission | null;
  moduleStatuses: Record<string, CompletionStatus>;
  stageStatuses: Record<StageId, CompletionStatus>;
  isLoginDialogOpen: boolean;
  isAnxietyDialogOpen: boolean;
  activeModuleId: string | null;
  lockedNotice: string | null;
  dataVersion: number;
  refreshData: () => void;
  setAppMode: (mode: AppMode) => void;
  setActiveSection: (section: string) => void;
  enterWebApp: (targetSection?: string) => void;
  enterLandingPage: () => void;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
  closeAnxietyDialog: () => void;
  openAnxietyDialog: () => void;
  handleLogin: (
    identifier: string,
    password: string
  ) => { success: boolean; error?: string };
  handleRegister: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    trimesterLabel?: string;
  }) => { success: boolean; error?: string };
  handleUpdateProfile: (updates: {
    name: string;
    email: string;
    phone: string;
    trimesterLabel?: string;
    password?: string;
  }) => void;
  handleLogout: () => void;
  handleSubmitAnxiety: (
    answers: Record<string, 0 | 1 | 2 | 3>
  ) => AnxietySubmission | null;
  selectStage: (stageId: StageId) => boolean;
  openModuleReader: (moduleId: string) => void;
  closeModuleReader: () => void;
  handleCompleteModule: (moduleId: string) => void;
  handleSaveQuizScore: (correctCount: number, totalQuestions: number) => void;
  handleCompleteStage: (
    stageId: StageId,
    extraData?: {
      reflectionNote?: string;
      reflectionSelectedItems?: string[];
      evaluationCheckedItems?: string[];
      advanceToNext?: boolean;
    }
  ) => void;
  triggerLockedNotice: (message: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const VALID_SECTIONS = [
  'beranda',
  'materi',
  'tips',
  'kontak-ahli',
  'selfie',
  'pengaturan',
  'admin',
];

export function AppProvider({
  children,
  initialMode = 'landing',
}: {
  children: React.ReactNode;
  initialMode?: AppMode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>(initialMode);
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [session, setSession] = useState<UserSession | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [anxietySubmission, setAnxietySubmission] =
    useState<AnxietySubmission | null>(null);

  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isAnxietyDialogOpen, setIsAnxietyDialogOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [pendingModuleId, setPendingModuleId] = useState<string | null>(null);
  const [pendingTargetSection, setPendingTargetSection] = useState<string | null>(
    null
  );
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  const refreshData = useCallback(() => {
    setDataVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedSession = getSession();
      if (savedSession) {
        const userProgress = getUserProgress(savedSession.id);
        const userAnxiety = getAnxietySubmission(savedSession.id);
        setSession(savedSession);
        setProgress(userProgress);
        setAnxietySubmission(userAnxiety);
      }
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (
          params.get('mode') === 'webapp' ||
          window.location.pathname.startsWith('/belajar')
        ) {
          setAppMode('webapp');
          if (!savedSession) {
            setIsLoginDialogOpen(true);
          }
        }
        const tabParam = params.get('tab');
        if (tabParam && VALID_SECTIONS.includes(tabParam)) {
          setActiveSection(tabParam);
        }
      }
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Sesuai User Flow No. 1-3:
  // Pengguna langsung masuk ke beranda website, lalu login untuk membuka webapp di dalamnya.
  const enterWebApp = useCallback(
    (target?: string) => {
      const resolvedSection =
        target && VALID_SECTIONS.includes(target) ? target : 'beranda';

      if (!session) {
        setPendingTargetSection(resolvedSection);
        setIsLoginDialogOpen(true);
        return;
      }

      setAppMode('webapp');
      setActiveSection(resolvedSection);
      if (typeof window === 'undefined') return;
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    },
    [session]
  );

  const enterLandingPage = useCallback(() => {
    setAppMode('landing');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const triggerLockedNotice = useCallback((message: string) => {
    setLockedNotice(message);
    window.clearTimeout(
      (window as unknown as { __lockedTimer?: number }).__lockedTimer
    );
    (window as unknown as { __lockedTimer?: number }).__lockedTimer =
      window.setTimeout(() => {
        setLockedNotice(null);
      }, 3200);
  }, []);

  const openLoginDialog = useCallback(() => {
    setIsLoginDialogOpen(true);
  }, []);

  const closeLoginDialog = useCallback(() => {
    setIsLoginDialogOpen(false);
  }, []);

  const closeAnxietyDialog = useCallback(() => {
    setIsAnxietyDialogOpen(false);
  }, []);

  const openAnxietyDialog = useCallback(() => {
    setIsAnxietyDialogOpen(true);
  }, []);

  const applyAuthenticatedSession = useCallback(
    (newSession: UserSession) => {
      const userProgress = getUserProgress(newSession.id);
      const existingAnxiety = getAnxietySubmission(newSession.id);

      setSession(newSession);
      setProgress(userProgress);
      setAnxietySubmission(existingAnxiety);
      setIsLoginDialogOpen(false);
      setAppMode('webapp');

      if (newSession.role === 'admin' && pendingTargetSection === 'admin') {
        setActiveSection('admin');
      } else if (pendingTargetSection) {
        setActiveSection(pendingTargetSection);
      } else {
        setActiveSection('beranda');
      }
      setPendingTargetSection(null);

      if (pendingModuleId) {
        const statuses = getModuleStatuses(userProgress);
        if (statuses[pendingModuleId] !== 'terkunci') {
          const updated = apiSetActiveStage(newSession.id, 'materi');
          setProgress(updated);
          setActiveModuleId(pendingModuleId);
          setActiveSection('materi');
        }
        setPendingModuleId(null);
      }

      // Sesuai User Flow No. 4:
      // Sistem menampilkan pertanyaan kecemasan dalam beranda (jika belum diisi atau saat login pengguna)
      if (newSession.role !== 'admin') {
        window.setTimeout(() => {
          setIsAnxietyDialogOpen(true);
        }, 1350);
      }

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [pendingModuleId, pendingTargetSection]
  );

  const handleLogin = useCallback(
    (identifier: string, password: string) => {
      const result = apiLogin(identifier, password);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      applyAuthenticatedSession(result.session);
      return { success: true };
    },
    [applyAuthenticatedSession]
  );

  const handleRegister = useCallback(
    (input: {
      name: string;
      email: string;
      phone: string;
      password: string;
      trimesterLabel?: string;
    }) => {
      const result = apiRegisterUser(input);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      applyAuthenticatedSession(result.session);
      return { success: true };
    },
    [applyAuthenticatedSession]
  );

  const handleUpdateProfile = useCallback(
    (updates: {
      name: string;
      email: string;
      phone: string;
      trimesterLabel?: string;
      password?: string;
    }) => {
      if (!session) return;
      const updated = apiUpdateUserProfile(session.id, updates);
      if (updated) {
        setSession(updated);
        refreshData();
      }
    },
    [session, refreshData]
  );

  const handleLogout = useCallback(() => {
    apiLogout();
    setSession(null);
    setProgress(null);
    setAnxietySubmission(null);
    setActiveModuleId(null);
    setIsAnxietyDialogOpen(false);
    setAppMode('landing');
  }, []);

  const handleSubmitAnxiety = useCallback(
    (answers: Record<string, 0 | 1 | 2 | 3>) => {
      if (!session) return null;
      const saved = apiSaveAnxietyAnswers(session.id, answers);
      setAnxietySubmission(saved);
      return saved;
    },
    [session]
  );

  const moduleStatuses = useMemo(
    () => getModuleStatuses(progress),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress, dataVersion]
  );

  const stageStatuses = useMemo(() => getStageStatuses(progress), [progress]);

  const selectStage = useCallback(
    (stageId: StageId): boolean => {
      if (!session || !progress) {
        setIsLoginDialogOpen(true);
        return false;
      }
      const status = stageStatuses[stageId];
      if (status === 'terkunci') {
        triggerLockedNotice(
          'Selesaikan level sebelumnya terlebih dahulu agar level ini terbuka.'
        );
        return false;
      }
      const updated = apiSetActiveStage(session.id, stageId);
      setProgress(updated);
      setAppMode('webapp');
      setActiveSection('materi');
      return true;
    },
    [session, progress, stageStatuses, triggerLockedNotice]
  );

  const openModuleReader = useCallback(
    (moduleId: string) => {
      if (!session || !progress) {
        setPendingModuleId(moduleId);
        setIsLoginDialogOpen(true);
        return;
      }
      const status = moduleStatuses[moduleId];
      if (status === 'terkunci') {
        setAppMode('webapp');
        setActiveSection('materi');
        triggerLockedNotice(
          'Selesaikan modul sebelumnya terlebih dahulu agar modul ini terbuka.'
        );
        return;
      }
      if (progress.activeStageId !== 'materi') {
        const updated = apiSetActiveStage(session.id, 'materi');
        setProgress(updated);
      }
      setActiveModuleId(moduleId);
      setAppMode('webapp');
      setActiveSection('materi');

      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 60);
    },
    [session, progress, moduleStatuses, triggerLockedNotice]
  );

  const closeModuleReader = useCallback(() => {
    setActiveModuleId(null);
  }, []);

  const handleCompleteModule = useCallback(
    (moduleId: string) => {
      if (!session) return;
      const updated = apiCompleteModule(session.id, moduleId);
      setProgress(updated);

      const allModules = getModules();
      const idx = allModules.findIndex((m) => m.id === moduleId);
      if (idx >= 0 && idx < allModules.length - 1) {
        setActiveModuleId(allModules[idx + 1].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setActiveModuleId(null);
      }
    },
    [session]
  );

  const handleSaveQuizScore = useCallback(
    (correctCount: number, totalQuestions: number) => {
      if (!session) return;
      const updated = apiSaveQuizScore(session.id, correctCount, totalQuestions);
      setProgress(updated);
    },
    [session]
  );

  const handleCompleteStage = useCallback(
    (
      stageId: StageId,
      extraData?: {
        reflectionNote?: string;
        reflectionSelectedItems?: string[];
        evaluationCheckedItems?: string[];
        advanceToNext?: boolean;
      }
    ) => {
      if (!session) return;
      const updated = apiCompleteStage(session.id, stageId, extraData);
      setProgress(updated);
    },
    [session]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      isHydrated,
      appMode,
      activeSection,
      session,
      progress,
      anxietySubmission,
      moduleStatuses,
      stageStatuses,
      isLoginDialogOpen,
      isAnxietyDialogOpen,
      activeModuleId,
      lockedNotice,
      dataVersion,
      refreshData,
      setAppMode,
      setActiveSection,
      enterWebApp,
      enterLandingPage,
      openLoginDialog,
      closeLoginDialog,
      closeAnxietyDialog,
      openAnxietyDialog,
      handleLogin,
      handleRegister,
      handleUpdateProfile,
      handleLogout,
      handleSubmitAnxiety,
      selectStage,
      openModuleReader,
      closeModuleReader,
      handleCompleteModule,
      handleSaveQuizScore,
      handleCompleteStage,
      triggerLockedNotice,
    }),
    [
      isHydrated,
      appMode,
      activeSection,
      session,
      progress,
      anxietySubmission,
      moduleStatuses,
      stageStatuses,
      isLoginDialogOpen,
      isAnxietyDialogOpen,
      activeModuleId,
      lockedNotice,
      dataVersion,
      refreshData,
      enterWebApp,
      enterLandingPage,
      openLoginDialog,
      closeLoginDialog,
      closeAnxietyDialog,
      openAnxietyDialog,
      handleLogin,
      handleRegister,
      handleUpdateProfile,
      handleLogout,
      handleSubmitAnxiety,
      selectStage,
      openModuleReader,
      closeModuleReader,
      handleCompleteModule,
      handleSaveQuizScore,
      handleCompleteStage,
      triggerLockedNotice,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp harus digunakan di dalam AppProvider');
  }
  return context;
}

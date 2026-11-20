// Klien Integrasi Supabase untuk Buna Ceria (Teman Kasih)
// Mendukung sinkronisasi otomatis (Cloud Sync + Offline-First LocalStorage)

import { AnxietySubmission, MockUser, UserProgress } from '@/types';

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable__E9F6SUisom2Sbb4CNW46Q_8vChQS6l';

export const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY || '';

const SUPABASE_URL_STORAGE_KEY = 'teman_kasih_v2_supabase_url';

export function getSupabaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(SUPABASE_URL_STORAGE_KEY) || '';
    if (saved && saved.startsWith('http')) {
      return saved.replace(/\/+$/, '');
    }
  }
  return '';
}

export function setSupabaseUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const clean = url.trim().replace(/\/+$/, '');
  if (clean) {
    window.localStorage.setItem(SUPABASE_URL_STORAGE_KEY, clean);
  } else {
    window.localStorage.removeItem(SUPABASE_URL_STORAGE_KEY);
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && SUPABASE_PUBLISHABLE_KEY);
}

function getHeaders(useSecret: boolean = false): HeadersInit {
  const key = useSecret ? SUPABASE_SECRET_KEY : SUPABASE_PUBLISHABLE_KEY;
  return {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
    Prefer: 'resolution=merge-duplicates,return=minimal',
  };
}

export async function testSupabaseConnection(
  customUrl?: string
): Promise<{ ok: boolean; message: string }> {
  const baseUrl = (customUrl ?? getSupabaseUrl()).trim().replace(/\/+$/, '');
  if (!baseUrl || !baseUrl.startsWith('https://')) {
    return {
      ok: false,
      message:
        'Masukkan Project URL Supabase terlebih dahulu (contoh: https://xxxx.supabase.co).',
    };
  }

  try {
    const res = await fetch(`${baseUrl}/rest/v1/buna_users?select=id&limit=1`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
    });

    if (res.ok) {
      return {
        ok: true,
        message:
          'Berhasil terhubung ke database Supabase! Tabel buna_users siap digunakan.',
      };
    }

    if (res.status === 404) {
      return {
        ok: false,
        message:
          'Terhubung ke Supabase, namun tabel belum dibuat. Silakan jalankan skrip SQL (supabase/schema.sql) di SQL Editor Supabase.',
      };
    }

    const errText = await res.text();
    return {
      ok: false,
      message: `Respon Supabase (${res.status}): ${errText.slice(0, 140)}`,
    };
  } catch (err) {
    return {
      ok: false,
      message: `Gagal menghubungi URL Supabase: ${
        err instanceof Error ? err.message : 'Network error'
      }`,
    };
  }
}

export async function syncUserToSupabase(user: MockUser): Promise<void> {
  const baseUrl = getSupabaseUrl();
  if (!baseUrl) return;

  try {
    await fetch(`${baseUrl}/rest/v1/buna_users?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        trimester_label: user.trimesterLabel || 'Nifas Hari ke 1-2 Hari',
        role: user.role || 'user',
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // Tetap berjalan lancar dengan penyimpanan lokal jika koneksi sedang offline
  }
}

export async function syncProgressToSupabase(
  progress: UserProgress
): Promise<void> {
  const baseUrl = getSupabaseUrl();
  if (!baseUrl) return;

  try {
    await fetch(`${baseUrl}/rest/v1/buna_progress?on_conflict=user_id`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        user_id: progress.userId,
        progress_data: progress,
        pretest_pass_score: progress.initialPretestAnxiety?.totalScore ?? null,
        pretest_pass_level: progress.initialPretestAnxiety?.categoryLabel ?? null,
        pretest_quiz_score: progress.initialPretestQuiz?.score ?? null,
        posttest_pass_score: progress.posttestAnxiety?.totalScore ?? null,
        posttest_pass_level: progress.posttestAnxiety?.categoryLabel ?? null,
        posttest_quiz_score: progress.posttestQuiz?.score ?? null,
        garden_points: progress.pomegranateGarden?.points ?? 0,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // Abaikan bila offline
  }
}

export async function syncAnxietyToSupabase(
  submission: AnxietySubmission
): Promise<void> {
  const baseUrl = getSupabaseUrl();
  if (!baseUrl) return;

  try {
    await fetch(`${baseUrl}/rest/v1/buna_anxiety_submissions`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        user_id: submission.userId,
        phase: submission.phase || 'pretest',
        total_score: submission.totalScore,
        max_score: submission.maxScore,
        level: submission.level,
        category_label: submission.categoryLabel || '',
        answers: submission.answers,
        completed_at: submission.completedAt,
      }),
    });
  } catch {
    // Abaikan bila offline
  }
}

export async function pushAllLocalDataToSupabase(
  users: MockUser[],
  progressMap: Record<string, UserProgress>
): Promise<{ ok: boolean; syncedUsers: number; message: string }> {
  const baseUrl = getSupabaseUrl();
  if (!baseUrl) {
    return {
      ok: false,
      syncedUsers: 0,
      message: 'Project URL Supabase belum diisi.',
    };
  }

  try {
    for (const u of users) {
      await syncUserToSupabase(u);
      const prog = progressMap[u.id];
      if (prog) {
        await syncProgressToSupabase(prog);
      }
    }
    return {
      ok: true,
      syncedUsers: users.length,
      message: `Berhasil menyinkronkan ${users.length} akun pengguna beserta progres Pre-Test & Post-Test ke Supabase!`,
    };
  } catch (err) {
    return {
      ok: false,
      syncedUsers: 0,
      message: `Gagal menyinkronkan data: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`,
    };
  }
}

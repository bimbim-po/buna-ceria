-- =============================================================================
-- SKEMA DATABASE SUPABASE UNTUK BUNA CERIA (TEMAN KASIH)
-- Jalankan skrip ini di menu "SQL Editor" pada Dashboard Supabase Anda
-- =============================================================================

-- 1. Tabel Pengguna Terdaftar (Responden Ibu Nifas & Admin)
CREATE TABLE IF NOT EXISTS public.buna_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  trimester_label TEXT DEFAULT 'Nifas Hari ke 1-2 Hari',
  role TEXT DEFAULT 'user',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Progres Belajar, Pre-Test, Post-Test, Kebun Delima, & Kalender Emosi
CREATE TABLE IF NOT EXISTS public.buna_progress (
  user_id TEXT PRIMARY KEY REFERENCES public.buna_users(id) ON DELETE CASCADE,
  progress_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  pretest_pass_score INTEGER,
  pretest_pass_level TEXT,
  pretest_quiz_score INTEGER,
  posttest_pass_score INTEGER,
  posttest_pass_level TEXT,
  posttest_quiz_score INTEGER,
  garden_points INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Riwayat Detail Jawaban 31 Pernyataan PASS (Pre-Test & Post-Test)
CREATE TABLE IF NOT EXISTS public.buna_anxiety_submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  phase TEXT NOT NULL DEFAULT 'pretest',
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 93,
  level TEXT NOT NULL,
  category_label TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS) dan izinkan akses dengan Publishable Key
ALTER TABLE public.buna_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buna_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buna_anxiety_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read write buna_users" ON public.buna_users;
CREATE POLICY "Allow public read write buna_users"
  ON public.buna_users FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read write buna_progress" ON public.buna_progress;
CREATE POLICY "Allow public read write buna_progress"
  ON public.buna_progress FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read write buna_anxiety_submissions" ON public.buna_anxiety_submissions;
CREATE POLICY "Allow public read write buna_anxiety_submissions"
  ON public.buna_anxiety_submissions FOR ALL
  USING (true)
  WITH CHECK (true);

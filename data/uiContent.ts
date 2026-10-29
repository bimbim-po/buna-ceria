// Teks antarmuka terpusat — bersih, ringkas, hangat, tanpa subjudul berlebihan

export const uiContent = {
  brand: {
    name: 'Teman Kasih',
    loadingText: 'Menyiapkan ruang belajar...',
  },
  navItems: [
    { id: 'beranda', label: 'Beranda', href: '#beranda' },
    { id: 'ruang-belajar', label: 'Tahap Belajar', href: '#ruang-belajar' },
    { id: 'daftar-materi', label: '4 Materi', href: '#daftar-materi' },
    { id: 'tips-kehamilan', label: 'Tips Harian', href: '#tips-kehamilan' },
    { id: 'kontak-ahli', label: 'Kontak Ahli', href: '#kontak-ahli' },
    { id: 'daftar-pustaka', label: 'Daftar Pustaka', href: '#daftar-pustaka' },
  ],
  header: {
    loginButton: 'Masuk',
    logoutButton: 'Keluar',
    menuButtonLabel: 'Buka menu navigasi',
    closeMenuLabel: 'Tutup menu navigasi',
  },
  hero: {
    title: 'Belajar pelan-pelan, ditemani setiap minggu.',
    greeting:
      'Halo Ibu. Mari duduk sebentar, tarik napas yang nyaman, lalu baca materi hari ini sesuai ritme Ibu.',
    ctaPrimary: 'Mulai Belajar',
    ctaSecondary: 'Lihat 4 Materi',
    summaryCards: {
      modulesLabel: 'Materi Selesai',
      stagesLabel: 'Tahap Belajar',
      quizLabel: 'Skor Quiz',
    },
  },
  pillarsSection: {
    sectionTitle: 'Semua yang Ibu perlukan di kehamilan pertama',
    ctaButton: 'Mulai Belajar Sekarang',
  },
  feelingsSection: {
    sectionTitle: 'Apa yang Sedang Ibu Rasakan?',
    sectionSubtitle:
      'Yuk, pilih perasaan yang sedang Ibu hadapi dan temukan panduan serta bantuan yang Ibu butuhkan sekarang!',
    checkAnxietyButton: 'Cek Tingkat Kecemasan',
    contactExpertButton: 'Tanya Bidan / Konselor',
  },
  learningSection: {
    sectionTitle: 'Tahap Belajar',
    lockedStageHint: 'Selesaikan tahap sebelumnya dahulu',
    guestCardTitle: 'Masuk untuk Memulai',
    guestCardDescription:
      'Simpan bacaan, nilai kuis, dan catatan perasaan Ibu di perangkat ini.',
    guestCardButton: 'Masuk Sekarang',
  },
  modulesSection: {
    sectionTitle: 'Materi Kehamilan',
    readTimeUnit: 'menit baca',
    statusLabels: {
      terkunci: 'Terkunci',
      terbuka: 'Aktif',
      selesai: 'Selesai',
    },
    lockedModuleHint: 'Selesaikan materi sebelumnya dahulu',
    lockedGuestHint: 'Masuk dahulu untuk membuka materi',
    readButton: 'Baca Materi',
    rereadButton: 'Baca Ulang',
  },
  tipsSection: {
    sectionTitle: 'Tips Harian',
  },
  expertsSection: {
    sectionTitle: 'Kontak Ahli',
    contactButton: 'Hubungi via WhatsApp',
    callButton: 'Telepon',
    whatsappDefaultMessage:
      'Halo Ibu Bidan/Konselor, saya pengguna Teman Kasih dan ingin bertanya seputar kehamilan saya.',
  },
  referencesSection: {
    sectionTitle: 'Daftar Pustaka',
  },
};

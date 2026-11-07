import { StageDefinition } from '@/types';

// Definisi 4 Level Tahapan Pembelajaran di Buna Ceria (Teman Kasih)
// Sesuai Client Brief No. 13, 14, dan User Flow No. 6:
// Level 1: Materi -> Level 2: Quiz -> Level 3: Tahap 3 -> Level 4: Hasil Saya
export const mockStages: StageDefinition[] = [
  {
    id: 'materi',
    order: 1,
    title: 'Level 1: Materi Kehamilan',
    shortTitle: 'Materi',
    subtitle: '4 modul bacaan bertahap yang menenangkan',
    description:
      'Pelajari keempat modul kehamilan secara berurutan hingga selesai untuk membuka Level 2 (Quiz).',
  },
  {
    id: 'quiz',
    order: 2,
    title: 'Level 2: Quiz Pemahaman',
    shortTitle: 'Quiz',
    subtitle: '8 soal pilihan ganda dengan ulasan lembut',
    description:
      'Ukur pemahaman Bunda dari materi yang telah dipelajari melalui 8 pertanyaan interaktif. Bunda dapat mengulang kapan saja.',
  },
  {
    id: 'tahap-3',
    order: 3,
    title: 'Level 3: Tahap 3 (Refleksi & Rencana)',
    shortTitle: 'Tahap 3',
    subtitle: 'Refleksi perasaan & rencana sederhana Bunda',
    description:
      'Luangkan waktu sejenak untuk memilih poin refleksi diri dan langkah kecil yang ingin Bunda jalankan setelah membaca materi serta mengerjakan quiz.',
    prompts: [
      'Saya bersyukur telah meluangkan waktu untuk belajar dan merawat ketenangan diri hari ini.',
      'Saya memahami bahwa setiap perubahan perasaan di masa kehamilan adalah hal yang wajar.',
      'Saya siap berkomunikasi lebih hangat dan terbuka dengan pasangan atau keluarga.',
      'Saya tahu bahwa saya selalu bisa menghubungi pendamping ahli ketika membutuhkan teman bicara.',
    ],
    evaluationPrompts: [
      'Menyediakan jeda bernapas tenang selama 5 menit setiap pagi.',
      'Menata waktu istirahat malam dengan mengurangi layar gawai sebelum tidur.',
      'Membagi rencana persiapan kehamilan menjadi langkah-langkah kecil mingguan.',
      'Menyimpan nomor Kontak Ahli untuk berdiskusi bila diperlukan.',
    ],
    actionLabel: 'Simpan Tahap 3 & Buka Hasil Saya',
  },
  {
    id: 'hasil-saya',
    order: 4,
    title: 'Level 4: Hasil Saya',
    shortTitle: 'Hasil Saya',
    subtitle: 'Ringkasan perjalanan belajar Bunda',
    description:
      'Lihat rangkuman capaian belajar 4 level, skor quiz terbaik, serta catatan perasaan Bunda dalam satu tampilan yang hangat.',
  },
];

import { StageDefinition } from '@/types';

// Definisi 5 tahapan belajar di Teman Kasih
// Nama Tahap 3 (Refleksi) dan Tahap 4 (Evaluasi Akhir) dapat diubah langsung dari berkas ini
export const mockStages: StageDefinition[] = [
  {
    id: 'materi',
    order: 1,
    title: 'Materi',
    shortTitle: 'Materi',
    subtitle: '4 bacaan bertahap yang menenangkan',
    description:
      'Bacalah keempat materi contoh secara berurutan hingga selesai untuk membuka tahap berikutnya.',
  },
  {
    id: 'quiz',
    order: 2,
    title: 'Quiz',
    shortTitle: 'Quiz',
    subtitle: '8 soal pilihan ganda dengan ulasan lembut',
    description:
      'Ulas kembali poin-poin penting dari materi melalui 8 pertanyaan singkat. Ibu dapat mengulang kapan saja.',
  },
  {
    id: 'tahap-3',
    order: 3,
    title: 'Refleksi',
    shortTitle: 'Refleksi',
    subtitle: '[Contoh] Tahap 3 — Mengenali hal baik yang Ibu rasakan',
    description:
      '[Contoh] Luangkan waktu sejenak untuk memilih poin refleksi diri setelah membaca materi dan mengerjakan quiz.',
    prompts: [
      '[Contoh] Saya bersyukur telah meluangkan waktu untuk belajar dan merawat ketenangan diri hari ini.',
      '[Contoh] Saya memahami bahwa setiap perubahan perasaan di masa kehamilan adalah hal yang wajar.',
      '[Contoh] Saya siap berkomunikasi lebih hangat dan terbuka dengan pasangan atau keluarga.',
      '[Contoh] Saya tahu bahwa saya selalu bisa menghubungi pendamping ahli ketika membutuhkan teman bicara.',
    ],
    actionLabel: 'Simpan & Selesaikan Refleksi',
  },
  {
    id: 'tahap-4',
    order: 4,
    title: 'Evaluasi Akhir',
    shortTitle: 'Evaluasi Akhir',
    subtitle: '[Contoh] Tahap 4 — Konfirmasi kesiapan & rencana sederhana',
    description:
      '[Contoh] Tandai langkah-langkah kecil yang ingin Ibu terapkan dalam keseharian sebelum melihat rangkuman Hasil Saya.',
    prompts: [
      '[Contoh] Menyediakan jeda bernapas tenang selama 5 menit setiap pagi.',
      '[Contoh] Menata waktu istirahat malam dengan mengurangi layar gawai sebelum tidur.',
      '[Contoh] Membagi rencana persiapan kehamilan menjadi langkah-langkah kecil mingguan.',
      '[Contoh] Menyimpan nomor Kontak Ahli Teman Kasih untuk berdiskusi bila diperlukan.',
    ],
    actionLabel: 'Selesaikan Evaluasi Akhir & Lihat Hasil',
  },
  {
    id: 'hasil-saya',
    order: 5,
    title: 'Hasil Saya',
    shortTitle: 'Hasil Saya',
    subtitle: 'Ringkasan perjalanan belajar Ibu',
    description:
      'Lihat rangkuman capaian belajar, skor quiz terbaik, serta catatan perasaan Ibu dalam satu tampilan yang hangat.',
  },
];

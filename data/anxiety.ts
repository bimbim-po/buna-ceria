import { AnxietyOption, AnxietyQuestion } from '@/types';

// Skala 4 pilihan dengan nilai 0 sampai 3 sesuai spesifikasi
export const anxietyScaleOptions: AnxietyOption[] = [
  { label: 'Tidak pernah', value: 0 },
  { label: 'Kadang-kadang', value: 1 },
  { label: 'Sering', value: 2 },
  { label: 'Hampir selalu', value: 3 },
];

// Keterangan wajib di awal kuesioner kecemasan
export const anxietyIntroDisclaimer =
  'Ini bukan diagnosis, hanya membantu kami memahami perasaanmu.';

// TODO: Validasi instrumen skrining emosi bersama psikolog maternal HIMPSI
// 7 Pernyataan perasaan/kecemasan mandiri:
export const mockAnxietyQuestions: AnxietyQuestion[] = [
  {
    id: 'anx-1',
    order: 1,
    statement:
      'Dalam beberapa hari terakhir, saya merasa pikiran saya sulit berhenti memikirkan banyak hal sekaligus.',
  },
  {
    id: 'anx-2',
    order: 2,
    statement:
      'Saya merasa kurang tenang saat membayangkan perubahan yang akan datang.',
  },
  {
    id: 'anx-3',
    order: 3,
    statement:
      'Saya merasa membutuhkan waktu lebih lama untuk bisa benar-benar rileks saat beristirahat.',
  },
  {
    id: 'anx-4',
    order: 4,
    statement:
      'Saya mudah merasa khawatir terhadap hal-hal kecil dalam keseharian.',
  },
  {
    id: 'anx-5',
    order: 5,
    statement:
      'Saya merasa sungkan atau ragu ketika ingin menceritakan perasaan saya kepada orang lain.',
  },
  {
    id: 'anx-6',
    order: 6,
    statement:
      'Saya merasa tubuh mudah lelah karena pikiran yang terasa penuh.',
  },
  {
    id: 'anx-7',
    order: 7,
    statement:
      'Saya berharap memiliki ruang aman untuk berbagi cerita dan mendapatkan ketenangan.',
  },
];

// Pesan penutup yang hangat dan tidak menghakimi berdasarkan rentang skor (0 - 21)
export const anxietyClosingMessages = {
  rendah: {
    title: 'Terima kasih telah berbagi perasaanmu hari ini, Ibu',
    message:
      'Saat ini perasaan Ibu tampak cukup teduh dan terkendali. Mari lanjutkan belajar secara perlahan sesuai kenyamanan Ibu.',
  },
  sedang: {
    title: 'Terima kasih sudah jujur mengenali perasaanmu, Ibu',
    message:
      'Wajar sekali bila terkadang pikiran terasa penuh. Berikan waktu bagi diri sendiri untuk beristirahat, dan nikmati materi belajar ini tanpa terburu-buru.',
  },
  tinggi: {
    title: 'Kami menemani Ibu, terima kasih sudah berbagi dengan tulus',
    message:
      'Sepertinya akhir-akhir ini ada cukup banyak hal yang memenuhi pikiran Ibu. Ibu tidak harus melewatinya sendirian—kami sangat menyarankan Ibu untuk berbincang hangat dengan Kontak Ahli kami kapan pun Ibu siap.',
  },
};

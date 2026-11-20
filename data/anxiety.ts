import { AnxietyOption, AnxietyQuestion, AnxietySeverityLevel } from '@/types';

// Skala 4 pilihan dengan nilai 0 sampai 3 sesuai instrumen PASS Versi Indonesia
export const anxietyScaleOptions: AnxietyOption[] = [
  { label: 'Tidak pernah', value: 0 },
  { label: 'Kadang-Kadang', value: 1 },
  { label: 'Sering', value: 2 },
  { label: 'Selalu', value: 3 },
];

export const anxietyIntroTitle =
  'Pretest-Posttest Skrining Kecemasan Menggunakan PASS';

export const anxietyIntroSubtitle = 'Yuk, Kenali Perasaan Bunda! ❤️';

export const anxietyIntroDescription =
  'Selama masa nifas, Bunda mungkin mengalami berbagai perasaan, mulai dari bahagia, khawatir, hingga cemas. Melalui skrining ini, BUNA CERIA mengajak Bunda mengenali kondisi perasaan Bunda saat ini.';

export const anxietyInstructions: string[] = [
  'Bacalah setiap pernyataan dengan teliti.',
  'Pilih jawaban yang paling sesuai dengan kondisi Bunda saat ini.',
  'Jawablah pertanyaan dengan jujur.',
  'Tidak ada jawaban benar atau salah.',
];

// Informasi Penting wajib di setiap hasil di bagian bawah rekomendasi tindakan
export const anxietyIntroDisclaimer =
  'Hasil skrining ini merupakan gambaran awal kondisi kecemasan Bunda, bukan diagnosis medis. Jika Bunda mengalami keluhan yang mengganggu, silakan berkonsultasi dengan bidan atau tenaga kesehatan untuk mendapatkan pemeriksaan lebih lanjut. ❤️';

export const passImportantNote = anxietyIntroDisclaimer;

export const passCutOffValue = 26;
export const passMaxScore = 93; // 31 pertanyaan x 3

// 31 Pernyataan PASS Versi Indonesia (Perinatal Anxiety Screening Scale)
export const mockAnxietyQuestions: AnxietyQuestion[] = [
  {
    id: 'pass-1',
    order: 1,
    statement: 'Merasa terpisah seperti anda melihat diri sendiri di dalam sebuah film',
  },
  {
    id: 'pass-2',
    order: 2,
    statement: 'Kehilangan jejak waktu dan tidak ingat apa yang terjadi dalam suatu waktu',
  },
  {
    id: 'pass-3',
    order: 3,
    statement: 'Kesulitan menyesuaikan diri dengan perubahan terkini',
  },
  {
    id: 'pass-4',
    order: 4,
    statement: 'Kecemasan menghalangi untuk bisa melakukan aktivitas',
  },
  {
    id: 'pass-5',
    order: 5,
    statement: 'Berpikir cepat membuat sulit untuk berkonsentrasi',
  },
  {
    id: 'pass-6',
    order: 6,
    statement: 'Perasaan takut kehilangan kendali',
  },
  {
    id: 'pass-7',
    order: 7,
    statement: 'Merasa panik',
  },
  {
    id: 'pass-8',
    order: 8,
    statement: 'Merasa gelisah',
  },
  {
    id: 'pass-9',
    order: 9,
    statement: 'Khawatir tentang bayi/kehamilan',
  },
  {
    id: 'pass-10',
    order: 10,
    statement: 'Takut pada bahaya yang akan datang pada bayi',
  },
  {
    id: 'pass-11',
    order: 11,
    statement: 'Rasa takut bahwa sesuatu yang buruk akan terjadi',
  },
  {
    id: 'pass-12',
    order: 12,
    statement: 'Khawatir dengan banyak hal',
  },
  {
    id: 'pass-13',
    order: 13,
    statement: 'Khawatir tentang masa depan',
  },
  {
    id: 'pass-14',
    order: 14,
    statement: 'Merasa kuwalahan',
  },
  {
    id: 'pass-15',
    order: 15,
    statement: 'Sangat takut terhadap suatu hal, misalnya jarum, darah, kelahiran, rasa sakit, dll',
  },
  {
    id: 'pass-16',
    order: 16,
    statement: 'Tiba-tiba merasa takut atau tidak nyaman yang ekstrim',
  },
  {
    id: 'pass-17',
    order: 17,
    statement: 'Pikiran berulang-ulang yang sulit dihentikan atau dikendalikan',
  },
  {
    id: 'pass-18',
    order: 18,
    statement: 'Kesulitan untuk tidur bahkan ketika saya memiliki kesempatan untuk tidur',
  },
  {
    id: 'pass-19',
    order: 19,
    statement: 'Harus melakukan sesuatu dengan cara atau urutan tertentu',
  },
  {
    id: 'pass-20',
    order: 20,
    statement: 'Menginginkan sesuatu hal menjadi sempurna',
  },
  {
    id: 'pass-21',
    order: 21,
    statement: 'Perlu mengendalikan atau mengontrol banyak hal',
  },
  {
    id: 'pass-22',
    order: 22,
    statement: 'Kesulitan berhenti memeriksa atau melakukan sesuatu berulang-ulang',
  },
  {
    id: 'pass-23',
    order: 23,
    statement: 'Merasa gelisah atau mudah terkejut',
  },
  {
    id: 'pass-24',
    order: 24,
    statement: 'Khawatir terhadap pikiran yang berulang-ulang',
  },
  {
    id: 'pass-25',
    order: 25,
    statement: 'Merasa perlu ‘berjaga jaga’ atau waspada terhadap sesuatu hal',
  },
  {
    id: 'pass-26',
    order: 26,
    statement: 'Kesal dengan kenangan, mimpi atau mimpi buruk yang berulang-ulang',
  },
  {
    id: 'pass-27',
    order: 27,
    statement: 'Khawatir bahwa saya akan mempermalukan diri-sendiri di depan orang lain',
  },
  {
    id: 'pass-28',
    order: 28,
    statement: 'Takut orang lain akan menilai saya secara negatif',
  },
  {
    id: 'pass-29',
    order: 29,
    statement: 'Merasa sangat gelisah dalam keramaian',
  },
  {
    id: 'pass-30',
    order: 30,
    statement: 'Menghindari kegiatan sosial karena saya cenderung gugup',
  },
  {
    id: 'pass-31',
    order: 31,
    statement: 'Menghindari hal-hal yang menjadi perhatian saya',
  },
];

export interface PassInterpretationItem {
  level: AnxietySeverityLevel;
  intervalLabel: string;
  heading: string;
  categoryLabel: string;
  badgeSubLabel?: string;
  analysis: string;
  recommendation: string;
  tableReferenceNote: string;
}

export const passInterpretations: Record<
  'minimal' | 'ringan-sedang-bawah' | 'ringan-sedang-atas' | 'berat',
  PassInterpretationItem
> = {
  minimal: {
    level: 'minimal',
    intervalLabel: '0-20',
    heading: 'Skor 0-20 (Kecemasan Minimal atau Tanpa Gejala)',
    categoryLabel: 'Gejala Kecemasan Minimal',
    badgeSubLabel: 'Minimal / Tanpa Gejala',
    analysis:
      'Bunda menunjukkan sedikit atau tidak ada gejala kecemasan yang teridentifikasi melalui skrining. Tetap jaga kesehatan fisik dan mental selama masa nifas.',
    recommendation:
      'Pertahankan kondisi positif dengan mendapatkan dukungan dari suami dan keluarga, menjaga waktu istirahat, serta tetap memperhatikan kesehatan diri.',
    tableReferenceNote:
      'Tidak menunjukkan gejala kecemasan yang bermakna. Tetap perhatikan perubahan perasaan dan kondisi emosional selama masa nifas.',
  },
  'ringan-sedang-bawah': {
    level: 'ringan-sedang-bawah',
    intervalLabel: '21-25',
    heading: 'Skor 21-25 (Kecemasan Ringan-Sedang)',
    categoryLabel: 'Kecemasan Ringan-Sedang',
    badgeSubLabel: 'Skor 21-25 (Di Bawah Cut-off 26)',
    analysis:
      'Bunda menunjukkan adanya beberapa gejala kecemasan, seperti rasa khawatir, takut, atau gelisah. Kondisi ini mungkin membuat Bunda merasa kurang nyaman dalam menjalani aktivitas sehari-hari.',
    recommendation:
      'Luangkan waktu untuk relaksasi, kenali perasaan Bunda, dan jangan ragu untuk berbagi cerita dengan orang terdekat. Jika keluhan mulai mengganggu aktivitas sehari-hari, konsultasikan dengan bidan atau tenaga kesehatan.',
    tableReferenceNote:
      'Bunda mungkin merasa khawatir, takut, atau gelisah. Hasil skrining belum mencapai batas skor PASS yang menunjukkan risiko kecemasan lebih tinggi. Tetap perhatikan kondisi emosional dan perubahan perasaan Bunda.',
  },
  'ringan-sedang-atas': {
    level: 'ringan-sedang-atas',
    intervalLabel: '26-41',
    heading: 'Skor 26-41 (Kecemasan Ringan-Sedang)',
    categoryLabel: 'Kecemasan Ringan-Sedang',
    badgeSubLabel: 'Skor 26-41 (≥ Cut-off 26)',
    analysis:
      'Bunda mungkin merasa cemas dan khawatir yang cukup mengganggu aktivitas sehari-hari, termasuk dalam merawat Si Kecil.',
    recommendation:
      'Bunda dianjurkan untuk berkonsultasi dengan bidan atau tenaga kesehatan agar dapat memperoleh dukungan yang sesuai. Jangan ragu untuk berbagi cerita dengan suami atau keluarga. Bunda tidak perlu menghadapi perasaan ini sendirian.',
    tableReferenceNote:
      'Bunda menunjukkan beberapa gejala kecemasan yang perlu mendapatkan perhatian lebih lanjut. Bunda dianjurkan berkonsultasi dengan bidan atau tenaga kesehatan untuk mendapatkan penilaian lebih lanjut.',
  },
  berat: {
    level: 'berat',
    intervalLabel: '42-93',
    heading: 'Skor 42-93 (Kecemasan Berat)',
    categoryLabel: 'Kecemasan Berat',
    badgeSubLabel: 'Skor 42-93 (Perlu Pendampingan)',
    analysis:
      'Bunda menunjukkan gejala kecemasan yang lebih berat dan mungkin memengaruhi kenyamanan serta aktivitas sehari-hari Bunda. Kondisi ini memerlukan perhatian dan pendampingan lebih lanjut.',
    recommendation:
      'Disarankan untuk melakukan konsultasi dengan tenaga kesehatan profesional, seperti psikolog atau psikiater, guna mendapatkan pemeriksaan dan pendampingan lebih lanjut.',
    tableReferenceNote:
      'Bunda menunjukkan gejala kecemasan yang lebih berat dan mungkin mengganggu aktivitas sehari-hari. Bunda dianjurkan mendapatkan pendampingan dari tenaga kesehatan profesional.',
  },
};

export const passReferenceTable = [
  passInterpretations.minimal,
  passInterpretations['ringan-sedang-bawah'],
  passInterpretations['ringan-sedang-atas'],
  passInterpretations.berat,
];

export function evaluatePassScore(
  totalScore: number,
  maxScore: number = passMaxScore
): PassInterpretationItem {
  // Jika data lama memiliki maxScore <= 21 (versi 7 soal lama), petakan secara proporsional
  const normalizedScore =
    maxScore <= 21 ? Math.round((totalScore / Math.max(1, maxScore)) * passMaxScore) : totalScore;

  if (normalizedScore <= 20) {
    return passInterpretations.minimal;
  }
  if (normalizedScore <= 25) {
    return passInterpretations['ringan-sedang-bawah'];
  }
  if (normalizedScore <= 41) {
    return passInterpretations['ringan-sedang-atas'];
  }
  return passInterpretations.berat;
}

// Kompatibilitas mundur dengan komponen lama jika dipanggil
export const anxietyClosingMessages = {
  minimal: {
    title: passInterpretations.minimal.heading,
    message: passInterpretations.minimal.analysis,
  },
  'ringan-sedang-bawah': {
    title: passInterpretations['ringan-sedang-bawah'].heading,
    message: passInterpretations['ringan-sedang-bawah'].analysis,
  },
  'ringan-sedang-atas': {
    title: passInterpretations['ringan-sedang-atas'].heading,
    message: passInterpretations['ringan-sedang-atas'].analysis,
  },
  berat: {
    title: passInterpretations.berat.heading,
    message: passInterpretations.berat.analysis,
  },
  rendah: {
    title: passInterpretations.minimal.heading,
    message: passInterpretations.minimal.analysis,
  },
  sedang: {
    title: passInterpretations['ringan-sedang-bawah'].heading,
    message: passInterpretations['ringan-sedang-bawah'].analysis,
  },
  tinggi: {
    title: passInterpretations.berat.heading,
    message: passInterpretations.berat.analysis,
  },
};

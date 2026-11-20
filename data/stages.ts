import { StageDefinition } from '@/types';

// Definisi 3 Level Tahapan Pembelajaran di Buna Ceria (Masa Nifas)
// Level 1: Materi (4 Materi)
// Level 2: Refleksi Diri dan Tips
// Level 3: Bunga Delima (Jika ditekan langsung menuju menu Kebun Bunga Delima)
export const mockStages: StageDefinition[] = [
  {
    id: 'materi',
    order: 1,
    title: 'Level 1: Materi Masa Nifas',
    shortTitle: 'Materi',
    subtitle: '4 modul bacaan masa nifas & kecukupan ASI',
    description:
      'Pelajari keempat modul masa nifas secara berurutan hingga selesai untuk membuka Level 2 (Refleksi Diri dan Tips).',
  },
  {
    id: 'tahap-3',
    order: 2,
    title: 'Level 2: Refleksi Diri dan Tips',
    shortTitle: 'Refleksi & Tips',
    subtitle: 'Refleksi diri dan tips menghadapi kecemasan',
    description:
      'Yuk, kenali perasaanmu! Centang checklist usaha Bunda, pilih rencana langkah kecil ke depan, serta pelajari teknik relaksasi dan tips menghadapi kecemasan.',
    prompts: [
      'Berusaha menerima perubahan fisik dan emosional setelah melahirkan.',
      'Mencoba menenangkan diri ketika mulai merasa cemas.',
      'Mengatur pernapasan ketika merasa khawatir atau gelisah.',
      'Meluangkan waktu untuk beristirahat di sela-sela merawat bayi.',
      'Menceritakan perasaan kepada suami atau keluarga.',
      'Mencari informasi mengenai cara tanda-tanda kecukupan ASI.',
      'Berkonsultasi dengan bidan/tenaga ahli ketika memiliki kekhawatiran mengenai kondisi diri atau bayi.',
      'Berusaha tidak membandingkan kemampuan diri dengan ibu lainnya.',
      'Memberikan apresiasi kepada diri sendiri atas usaha yang sudah dilakukan.',
      'Meminta bantuan orang lain saat merasa kewalahan.',
    ],
    evaluationPrompts: [
      'Saya akan berusaha lebih menerima dan memahami perasaan sendiri.',
      'Saya akan mencoba latihan pernapasan ketika merasa cemas.',
      'Saya akan mengatur waktu istirahat dengan lebih baik.',
      'Saya akan meminta bantuan suami atau keluarga ketika merasa kewalahan.',
      'Saya akan lebih terbuka dalam menyampaikan kebutuhan dan perasaan.',
      'Saya akan mempelajari tanda-tanda kecukupan ASI agar tidak mudah khawatir.',
      'Saya akan meluangkan waktu untuk melakukan kegiatan yang saya sukai.',
      'Saya akan mengurangi kebiasaan membandingkan diri dengan ibu lainnya.',
      'Saya akan lebih menghargai setiap usaha kecil yang sudah saya lakukan.',
      'Saya akan meminta bantuan tenaga kesehatan jika kecemasan terus berlanjut atau mengganggu aktivitas.',
    ],
    actionLabel: 'Simpan Refleksi & Buka Bunga Delima (Level 3)',
  },
  {
    id: 'bunga-delima',
    order: 3,
    title: 'Level 3: Bunga Delima',
    shortTitle: 'Bunga Delima',
    subtitle: 'Kebun edukasi interaktif video, audio & game ASI',
    description:
      'Tumbuhkan benih menjadi Bunga Delima mekar melalui kegiatan menonton video, mendengarkan audio, dan bermain game tebak gambar kecukupan ASI.',
  },
];

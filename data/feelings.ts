import { FeelingTopic, PregnancyPillar } from '@/types';

// Data untuk bagian "Semua yang Ibu perlukan di kehamilan pertama" (Referensi Diary Bunda)
export const mockPregnancyPillars: PregnancyPillar[] = [
  {
    id: 'tips-harian',
    title: 'Dapatkan tips harian tentang kesehatan Ibu',
    description:
      'Nikmati bacaan dan tips singkat seputar kehamilan serta ketenangan hati yang telah disusun bersama bidan pendamping.',
    targetHref: '#tips-kehamilan',
  },
  {
    id: 'tahapan',
    title: 'Memandu dalam setiap tahapan',
    description:
      'Pelajari 4 materi secara bertahap, kerjakan kuis ringan, hingga refleksi mingguan sesuai ritme kenyamanan Ibu.',
    targetHref: '#ruang-belajar',
  },
  {
    id: 'konsultasi',
    title: 'Nggak usah lagi tebak-tebakan',
    description:
      'Tidak perlu bingung mana mitos mana fakta, sekarang Ibu bisa langsung terhubung dan bertanya dengan bidan serta konselor kami.',
    targetHref: '#kontak-ahli',
  },
];

// Data untuk bagian interaktif "Apa yang Sedang Ibu Rasakan?" (Referensi Pemilih Perasaan)
export const mockFeelingTopics: FeelingTopic[] = [
  {
    id: 'keluarga',
    label: 'Keluarga & hubungan',
    title: 'Ingin lebih dimengerti oleh pasangan & keluarga',
    advice:
      'Perubahan peran selama hamil sering membuat Ibu butuh dukungan ekstra. Mengobrol jujur selama 10 menit sehari bersama pasangan tentang hal kecil yang Ibu butuhkan dapat mempererat ikatan di rumah.',
    recommendedModuleId: 'materi-4',
    recommendedModuleLabel: 'Materi 4: Komunikasi dengan Pasangan & Pendamping',
  },
  {
    id: 'kecemasan',
    label: 'Kecemasan',
    title: 'Pikiran sering penuh kekhawatiran tentang janin',
    advice:
      'Wajar sekali bila sesekali Ibu bertanya-tanya apakah si kecil baik-baik saja di dalam kandungan. Mari kenali pemicu cemas dan latih teknik jeda napas agar hati kembali teduh.',
    recommendedModuleId: 'materi-2',
    recommendedModuleLabel: 'Materi 2: Mengenali & Meredakan Rasa Cemas',
  },
  {
    id: 'stres',
    label: 'Stres & lelah',
    title: 'Tubuh terasa cepat lelah dan pikiran penat',
    advice:
      'Tubuh Ibu sedang bekerja luar biasa setiap detiknya. Beri izin pada diri sendiri untuk menunda pekerjaan rumah yang belum mendesak dan beristirahat tanpa rasa bersalah.',
    recommendedModuleId: 'materi-1',
    recommendedModuleLabel: 'Materi 1: Memahami Perubahan Tubuh & Emosi',
  },
  {
    id: 'mood',
    label: 'Gangguan mood',
    title: 'Suasana hati mudah berubah dari senang ke sedih',
    advice:
      'Lonjakan hormon kehamilan membuat perasaan menjadi lebih peka. Ibu tidak perlu menyalahkan diri sendiri saat tiba-tiba ingin menangis atau butuh waktu tenang sejenak.',
    recommendedModuleId: 'materi-1',
    recommendedModuleLabel: 'Materi 1: Memahami Perubahan Tubuh & Emosi',
  },
  {
    id: 'persalinan',
    label: 'Takut persalinan',
    title: 'Membayangkan hari persalinan terasa menegangkan',
    advice:
      'Rasa gugup menjelang hari H akan berkurang saat Ibu memiliki persiapan yang terarah. Mari susun langkah demi langkah bersama pasangan dan bidan agar Ibu merasa lebih siap.',
    recommendedModuleId: 'materi-4',
    recommendedModuleLabel: 'Materi 4: Menyiapkan Hati Menjelang Persalinan',
  },
  {
    id: 'tidur',
    label: 'Sulit tidur',
    title: 'Sering terbangun atau sulit mencari posisi nyaman',
    advice:
      'Cobalah tidur miring dengan bantal penyangga di antara lutut dan kurangi menelusuri layar ponsel 30 menit sebelum tidur. Latihan relaksasi bahu juga sangat membantu.',
    recommendedModuleId: 'materi-3',
    recommendedModuleLabel: 'Materi 3: Latihan Napas & Relaksasi Harian',
  },
];

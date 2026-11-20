import { FeelingTopic, PregnancyPillar } from '@/types';

export const mockPregnancyPillars: PregnancyPillar[] = [
  {
    id: 'tips-harian',
    title: 'Dapatkan tips harian tentang kesehatan Ibu Nifas',
    description:
      'Nikmati bacaan dan tips singkat seputar masa nifas, kecukupan ASI, serta ketenangan hati yang telah disusun bersama bidan pendamping.',
    targetHref: '#tips-kehamilan',
  },
  {
    id: 'tahapan',
    title: 'Memandu dalam setiap tahapan nifas',
    description:
      'Pelajari 4 materi masa nifas secara bertahap, refleksi diri dan tips, hingga kuis evaluasi sesuai ritme kenyamanan Ibu.',
    targetHref: '#ruang-belajar',
  },
  {
    id: 'konsultasi',
    title: 'Temukan informasi terpercaya',
    description:
      'Pahami perubahan emosi, tanda kecukupan ASI, dan langkah praktis merawat diri serta buah hati dengan lebih percaya diri.',
    targetHref: '#ruang-belajar',
  },
];

// Data untuk bagian interaktif "Apa yang Bunda Rasakan Hari Ini?"
export const mockFeelingTopics: FeelingTopic[] = [
  {
    id: 'tidur',
    label: 'Sulit tidur malam hari',
    title: 'Sulit tidur atau sering terbangun pada malam hari',
    advice:
      'Perubahan pola tidur setelah melahirkan sering terjadi karena Ibu perlu menyesuaikan waktu istirahat dengan kebutuhan si Kecil. Cobalah beristirahat ketika bayi tidur, atur posisi senyaman mungkin, dan mintalah bantuan pasangan untuk bergantian menjaga bayi agar Ibu memiliki waktu istirahat yang cukup.',
    recommendedModuleId: 'materi-1',
    recommendedModuleLabel: 'Materi 1: Mengenali Perubahan Perasaan di Masa Nifas',
  },
  {
    id: 'kecemasan',
    label: 'Khawatir merawat bayi',
    title: 'Merasa khawatir dalam merawat bayi',
    advice:
      'Menjadi ibu baru merupakan pengalaman yang membutuhkan proses penyesuaian. Ibu mungkin merasa takut salah saat memandikan, menggendong, atau menyusui bayi. Jangan terburu-buru menuntut diri untuk langsung mahir karena keterampilan merawat bayi dapat dipelajari secara bertahap.',
    recommendedModuleId: 'materi-2',
    recommendedModuleLabel: 'Materi 2: Mengenali Kecemasan dan Menjaga Ketenangan Diri',
  },
  {
    id: 'mood',
    label: 'Suasana hati berubah',
    title: 'Suasana hati mudah berubah dari senang menjadi sedih',
    advice:
      'Setelah persalinan, perubahan hormon, kelelahan, dan penyesuaian terhadap peran baru dapat membuat suasana hati ibu lebih sensitif. Terkadang Ibu merasa bahagia, tetapi di waktu lain mudah menangis atau merasa sedih tanpa alasan yang jelas. Perasaan tersebut tidak perlu membuat Ibu menyalahkan diri sendiri.',
    recommendedModuleId: 'materi-3',
    recommendedModuleLabel: 'Materi 3: Gangguan Psikologis Masa Nifas',
  },
  {
    id: 'stres',
    label: 'Cepat lelah & penat',
    title: 'Tubuh terasa cepat lelah dan pikiran mudah penat',
    advice:
      'Setelah melahirkan, tubuh Ibu membutuhkan waktu untuk memulihkan diri sekaligus menyesuaikan diri dengan rutinitas merawat bayi. Rasa lelah dapat muncul akibat kurang tidur, aktivitas menyusui, dan perubahan aktivitas sehari-hari. Jangan memaksakan diri untuk menyelesaikan semua pekerjaan rumah ketika tubuh membutuhkan istirahat.',
    recommendedModuleId: 'materi-1',
    recommendedModuleLabel: 'Materi 1: Mengenali Perubahan Perasaan di Masa Nifas',
  },
  {
    id: 'persalinan',
    label: 'Khawatir kecukupan ASI',
    title: 'Sering merasa khawatir apakah ASI sudah cukup untuk bayi',
    advice:
      'Kekhawatiran mengenai kecukupan ASI sering muncul, terutama ketika Ibu belum memahami tanda-tanda bayi mendapatkan ASI yang cukup. Ibu dapat memperhatikan frekuensi buang air kecil, kondisi bayi setelah menyusu, serta pertambahan berat badan bayi untuk membantu menilai kecukupan asupan ASI.',
    recommendedModuleId: 'materi-4',
    recommendedModuleLabel: 'Materi 4: Mengenal ASI dan Proses Produksinya',
  },
  {
    id: 'keluarga',
    label: 'Dukungan pasangan & keluarga',
    title: 'Ingin lebih dimengerti oleh pasangan dan keluarga',
    advice:
      'Menjalani peran baru sebagai seorang ibu bukanlah hal yang selalu mudah. Ibu mungkin membutuhkan perhatian, bantuan, dan dukungan emosional dari orang-orang terdekat. Dukungan pasangan dan keluarga dapat membantu Ibu merasa lebih dihargai, nyaman, dan tidak sendirian dalam menjalani masa nifas.',
    recommendedModuleId: 'materi-2',
    recommendedModuleLabel: 'Materi 2: Mengenali Kecemasan dan Menjaga Ketenangan Diri',
  },
];

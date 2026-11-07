import { PregnancyTip } from '@/types';

// 6 Tips kehamilan pendek yang ringkas dan mudah dibaca
export const mockPregnancyTips: PregnancyTip[] = [
  {
    id: 'tip-1',
    title: 'Jeda Napas Pagi Hari',
    description:
      'Tarik napas perlahan selama beberapa menit sebelum beraktivitas agar suasana hati terasa lebih teduh.',
    iconName: 'Sun',
    tags: ['Pagi Hari', '3 Menit', 'Ketenangan'],
    category: 'Relaksasi Pikiran',
  },
  {
    id: 'tip-2',
    title: 'Minum Air Secara Berkala',
    description:
      'Siapkan botol air di dekat tempat duduk Ibu agar kesegaran tubuh dan hidrasi cairan ketuban terjaga sepanjang hari.',
    iconName: 'Droplets',
    tags: ['Hidrasi Janin', '8 Gelas/Hari', 'Kebugaran'],
    category: 'Kesehatan Fisik',
  },
  {
    id: 'tip-3',
    title: 'Istirahat Saat Tubuh Lelah',
    description:
      'Dengarkan sinyal tubuh saat mulai lelah dan beri izin diri sendiri untuk rebahan sejenak tanpa membebani pikiran.',
    iconName: 'Moon',
    tags: ['Rehat Tubuh', '15–20 Menit', 'Bebas Cemas'],
    category: 'Pemulihan Energi',
  },
  {
    id: 'tip-4',
    title: 'Mengobrol dengan Pasangan',
    description:
      'Luangkan 10 menit setiap malam untuk berbagi cerita ringan bersama pasangan agar ikatan emosional semakin hangat.',
    iconName: 'Heart',
    tags: ['Waktu Pasangan', 'Malam Hari', 'Harmonis'],
    category: 'Koneksi Keluarga',
  },
  {
    id: 'tip-5',
    title: 'Saring Informasi Harian',
    description:
      'Pilih bacaan tepercaya dan hindari menelusuri kabar simpang siur yang memicu rasa cemas menjelang waktu tidur.',
    iconName: 'ShieldCheck',
    tags: ['Pikiran Tenang', 'Buku KIA', 'Sebelum Tidur'],
    category: 'Saring Informasi',
  },
  {
    id: 'tip-6',
    title: 'Catat Hal yang Disyukuri',
    description:
      'Tuliskan satu kalimat rasa syukur hari ini untuk membantu pikiran tetap fokus pada hal-hal hangat dan membahagiakan.',
    iconName: 'Smile',
    tags: ['Afirmasi Positif', '1 Kalimat/Hari', 'Bahagia'],
    category: 'Penguatan Jiwa',
  },
];

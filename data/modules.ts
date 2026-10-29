import { ModuleItem } from '@/types';

// 4 Materi edukasi kehamilan bertahap
// Struktur konten menggunakan blok bertipe agar siap menerima teks, gambar, maupun video
export const mockModules: ModuleItem[] = [
  {
    id: 'materi-1',
    order: 1,
    title: 'Mengenali Perubahan & Menjaga Ketenangan Diri',
    summary:
      'Memahami perubahan perasaan serta rutinitas sederhana agar hati tetap tenang.',
    readingTimeMinutes: 4,
    category: 'Tahap Awal',
    content: [
      {
        type: 'paragraph',
        text: 'Selamat datang di ruang belajar Teman Kasih. Setiap perjalanan kehamilan memiliki cerita yang unik, sehingga wajar apabila Ibu merasakan beragam emosi sekaligus di masa awal ini.',
      },
      {
        type: 'subheading',
        text: 'Mengapa Mengenali Perasaan Itu Penting?',
      },
      {
        type: 'paragraph',
        text: 'Memberikan jeda sejenak dalam keseharian dapat membantu Ibu merasa lebih nyaman. Fokus utama dari materi ini adalah mengajak Ibu mendengarkan kebutuhan diri sendiri tanpa terburu-buru.',
      },
      {
        type: 'list',
        title: 'Langkah Sederhana Hari Ini:',
        items: [
          'Meluangkan waktu 5 menit di pagi hari untuk bernapas perlahan dan nyaman.',
          'Mencatat hal-hal kecil yang membuat Ibu merasa bersyukur atau tenang.',
          'Berbicara terbuka dengan pasangan atau keluarga mengenai dukungan yang dibutuhkan.',
        ],
      },
      {
        type: 'callout',
        title: 'Catatan Hangat untuk Ibu',
        text: 'Tidak apa-apa jika hari ini Ibu ingin beristirahat lebih banyak. Memahami ritme tubuh adalah langkah awal yang berharga.',
      },
    ],
  },
  {
    id: 'materi-2',
    order: 2,
    title: 'Kenyamanan Harian & Istirahat Berkualitas',
    summary:
      'Menata waktu istirahat, suasana kamar yang teduh, dan menjaga kesegaran tubuh.',
    readingTimeMinutes: 5,
    category: 'Keseharian',
    content: [
      {
        type: 'paragraph',
        text: 'Istirahat yang cukup membantu tubuh dan pikiran Ibu tetap segar. Bagian ini membahas langkah praktis yang mudah diterapkan di rumah setiap hari.',
      },
      {
        type: 'subheading',
        text: 'Menciptakan Ruang Istirahat yang Nyaman',
      },
      {
        type: 'paragraph',
        text: 'Suasana lingkungan sekitar yang rapi, sejuk, dan tenang sering kali membantu pikiran menjadi lebih rileks menjelang waktu tidur malam maupun istirahat siang.',
      },
      {
        type: 'list',
        title: 'Kebiasaan Kecil Menjelang Istirahat:',
        items: [
          'Mengurangi paparan layar gawai sekitar 30 menit sebelum beristirahat.',
          'Menyiapkan bantal tambahan untuk menopang posisi duduk atau berbaring yang nyaman.',
          'Memutar suara alam yang lembut atau membaca bacaan ringan yang menenangkan.',
        ],
      },
      {
        type: 'callout',
        title: 'Pengingat Lembut',
        text: 'Dengarkan sinyal tubuh Ibu. Beristirahat sejenak di siang hari sangat baik untuk memulihkan tenaga.',
      },
    ],
  },
  {
    id: 'materi-3',
    order: 3,
    title: 'Komunikasi Hangat Bersama Pasangan',
    summary:
      'Cara berbagi cerita dan menyampaikan kebutuhan dengan jujur kepada keluarga.',
    readingTimeMinutes: 4,
    category: 'Dukungan Sosial',
    content: [
      {
        type: 'paragraph',
        text: 'Perjalanan kehamilan terasa lebih ringan ketika dijalani bersama orang-orang terdekat yang saling memahami dan mendengarkan.',
      },
      {
        type: 'subheading',
        text: 'Menyampaikan Kebutuhan dengan Bahasa yang Lembut',
      },
      {
        type: 'paragraph',
        text: 'Terkadang orang di sekitar kita ingin membantu, namun belum tahu bentuk bantuan apa yang paling Ibu perlukan. Mengungkapkannya secara sederhana dapat mempererat hubungan.',
      },
      {
        type: 'list',
        title: 'Contoh Kalimat Komunikasi Positif:',
        items: [
          '"Hari ini aku merasa sedikit lelah, bolehkah kita berbagi tugas rumah sore ini?"',
          '"Terima kasih sudah mendengarkan ceritaku hari ini tanpa terburu-buru memberi saran."',
          '"Yuk, kita jadwalkan waktu santai berdua akhir pekan ini untuk mengobrol ringan."',
        ],
      },
      {
        type: 'callout',
        title: 'Dukungan Bersama',
        text: 'Meminta bantuan bukanlah tanda kelemahan, melainkan bentuk kasih sayang kepada diri sendiri dan keluarga.',
      },
    ],
  },
  {
    id: 'materi-4',
    order: 4,
    title: 'Menyiapkan Hati Menyambut Buah Hati',
    summary:
      'Perencanaan bertahap dan menumbuhkan rasa percaya diri menjelang persalinan.',
    readingTimeMinutes: 6,
    category: 'Persiapan Diri',
    content: [
      {
        type: 'paragraph',
        text: 'Selamat, Ibu telah mencapai materi keempat dalam rangkaian pembelajaran Teman Kasih. Bagian ini merangkum langkah-langkah reflektif untuk menumbuhkan rasa percaya diri.',
      },
      {
        type: 'subheading',
        text: 'Melangkah Satu Hari demi Satu Hari',
      },
      {
        type: 'paragraph',
        text: 'Menyiapkan diri menyambut kehadiran buah hati tidak harus diselesaikan dalam satu malam. Membagi persiapan menjadi langkah-langkah kecil membantu pikiran tetap jernih.',
      },
      {
        type: 'list',
        title: 'Bekal Ketenangan untuk Ibu:',
        items: [
          'Menyusun daftar persiapan sederhana sesuai prioritas mingguan.',
          'Menghindari membandingkan perjalanan diri sendiri dengan cerita orang lain di media sosial.',
          'Menyimpan kontak tenaga pendamping atau ahli tepercaya jika membutuhkan teman diskusi.',
        ],
      },
      {
        type: 'callout',
        title: 'Siap Melanjutkan ke Tahap Quiz',
        text: 'Setelah menandai materi keempat ini selesai, tahap Quiz akan terbuka secara otomatis agar Ibu dapat mengulas kembali poin-poin di atas.',
      },
    ],
  },
];

import { ModuleItem } from '@/types';

// 4 Materi edukasi kehamilan bertahap (placeholder bertanda [Contoh])
// Struktur konten menggunakan blok bertipe agar siap menerima teks, gambar, maupun video
export const mockModules: ModuleItem[] = [
  {
    id: 'materi-1',
    order: 1,
    title: '[Contoh] Materi 1: Mengenali Perubahan Awal & Menjaga Ketenangan Diri',
    summary:
      '[Contoh] Pengenalan lembut mengenai perubahan perasaan serta rutinitas sederhana untuk menyambut masa kehamilan dengan hati yang tenang.',
    readingTimeMinutes: 4,
    category: 'Tahap Awal',
    content: [
      {
        type: 'paragraph',
        text: '[Contoh] Selamat datang di ruang belajar Teman Kasih. Bagian ini adalah contoh isi materi pertama yang nantinya akan diganti dengan naskah resmi pada awal November. Setiap perjalanan kehamilan memiliki cerita yang unik, sehingga wajar apabila Ibu merasakan beragam emosi sekaligus.',
      },
      {
        type: 'subheading',
        text: '[Contoh] Mengapa Mengenali Perasaan Itu Penting?',
      },
      {
        type: 'paragraph',
        text: '[Contoh] Paragraf contoh ini menjelaskan bagaimana memberikan jeda sejenak dalam keseharian dapat membantu Ibu merasa lebih nyaman. Fokus utama dari materi ini adalah mengajak Ibu mendengarkan kebutuhan diri sendiri tanpa terburu-buru.',
      },
      {
        type: 'list',
        title: '[Contoh] Langkah Sederhana Hari Ini:',
        items: [
          '[Contoh] Meluangkan waktu 5 menit di pagi hari untuk bernapas perlahan dan nyaman.',
          '[Contoh] Mencatat hal-hal kecil yang membuat Ibu merasa bersyukur atau tenang.',
          '[Contoh] Berbicara terbuka dengan pasangan atau keluarga mengenai dukungan yang dibutuhkan.',
        ],
      },
      {
        type: 'callout',
        title: '[Contoh] Catatan Hangat untuk Ibu',
        text: '[Contoh] Tidak apa-apa jika hari ini Ibu ingin beristirahat lebih banyak. Memahami ritme tubuh adalah langkah awal yang berharga.',
      },
    ],
  },
  {
    id: 'materi-2',
    order: 2,
    title: '[Contoh] Materi 2: Kenyamanan Sehari-hari & Istirahat yang Berkualitas',
    summary:
      '[Contoh] Panduan contoh seputar menata waktu istirahat, menciptakan suasana kamar yang teduh, dan menjaga kesegaran tubuh sehari-hari.',
    readingTimeMinutes: 5,
    category: 'Keseharian',
    content: [
      {
        type: 'paragraph',
        text: '[Contoh] Ini adalah teks placeholder untuk Materi 2. Konten ini dirancang sebagai contoh tata letak bacaan agar nyaman dibaca melalui layar ponsel oleh Ibu kapan saja.',
      },
      {
        type: 'subheading',
        text: '[Contoh] Menciptakan Ruang Istirahat yang Nyaman',
      },
      {
        type: 'paragraph',
        text: '[Contoh] Suasana lingkungan sekitar yang rapi, sejuk, dan tenang sering kali membantu pikiran menjadi lebih rileks menjelang waktu tidur malam maupun istirahat siang.',
      },
      {
        type: 'list',
        title: '[Contoh] Kebiasaan Kecil Menjelang Istirahat:',
        items: [
          '[Contoh] Mengurangi paparan layar gawai sekitar 30 menit sebelum beristirahat.',
          '[Contoh] Menyiapkan bantal tambahan untuk menopang posisi duduk atau berbaring yang nyaman.',
          '[Contoh] Memutar suara alam yang lembut atau membaca bacaan ringan yang menenangkan.',
        ],
      },
      {
        type: 'callout',
        title: '[Contoh] Pengingat Lembut',
        text: '[Contoh] Isi materi ini merupakan contoh tampilan. Seluruh saran kesehatan resmi nantinya merujuk pada materi terverifikasi dari tim penyusun.',
      },
    ],
  },
  {
    id: 'materi-3',
    order: 3,
    title: '[Contoh] Materi 3: Komunikasi Hangat Bersama Pasangan & Keluarga',
    summary:
      '[Contoh] Contoh pembahasan tentang cara berbagi cerita, menyampaikan kebutuhan dengan jujur, dan membangun dukungan bersama orang terdekat.',
    readingTimeMinutes: 4,
    category: 'Dukungan Sosial',
    content: [
      {
        type: 'paragraph',
        text: '[Contoh] Teks contoh untuk Materi 3. Perjalanan kehamilan terasa lebih ringan ketika dijalani bersama orang-orang terdekat yang saling memahami dan mendengarkan.',
      },
      {
        type: 'subheading',
        text: '[Contoh] Menyampaikan Kebutuhan dengan Bahasa yang Lembut',
      },
      {
        type: 'paragraph',
        text: '[Contoh] Terkadang orang di sekitar kita ingin membantu, namun belum tahu bentuk bantuan apa yang paling Ibu perlukan. Mengungkapkannya secara sederhana dapat mempererat hubungan.',
      },
      {
        type: 'list',
        title: '[Contoh] Contoh Kalimat Komunikasi Positif:',
        items: [
          '[Contoh] "Hari ini aku merasa sedikit lelah, bolehkah kita berbagi tugas rumah sore ini?"',
          '[Contoh] "Terima kasih sudah mendengarkan ceritaku hari ini tanpa terburu-buru memberi saran."',
          '[Contoh] "Yuk, kita jadwalkan waktu santai berdua akhir pekan ini untuk mengobrol ringan."',
        ],
      },
      {
        type: 'callout',
        title: '[Contoh] Dukungan Bersama',
        text: '[Contoh] Meminta bantuan bukanlah tanda kelemahan, melainkan bentuk kasih sayang kepada diri sendiri dan keluarga.',
      },
    ],
  },
  {
    id: 'materi-4',
    order: 4,
    title: '[Contoh] Materi 4: Menyiapkan Hati Menyambut Peran Baru dengan Percaya Diri',
    summary:
      '[Contoh] Rangkuman contoh mengenai perencanaan bertahap, mengelola ekspektasi dengan bijak, dan mengetahui kapan perlu menghubungi pendamping ahli.',
    readingTimeMinutes: 6,
    category: 'Persiapan Diri',
    content: [
      {
        type: 'paragraph',
        text: '[Contoh] Selamat, Ibu telah mencapai materi keempat dalam rangkaian contoh pembelajaran Teman Kasih. Bagian ini merangkum langkah-langkah reflektif untuk menumbuhkan rasa percaya diri.',
      },
      {
        type: 'subheading',
        text: '[Contoh] Melangkah Satu Hari demi Satu Hari',
      },
      {
        type: 'paragraph',
        text: '[Contoh] Menyiapkan diri menyambut kehadiran buah hati tidak harus diselesaikan dalam satu malam. Membagi persiapan menjadi langkah-langkah kecil membantu pikiran tetap jernih.',
      },
      {
        type: 'list',
        title: '[Contoh] Bekal Ketenangan untuk Ibu:',
        items: [
          '[Contoh] Menyusun daftar persiapan sederhana sesuai prioritas mingguan.',
          '[Contoh] Menghindari membandingkan perjalanan diri sendiri dengan cerita orang lain di media sosial.',
          '[Contoh] Menyimpan kontak tenaga pendamping atau ahli tepercaya jika membutuhkan teman diskusi.',
        ],
      },
      {
        type: 'callout',
        title: '[Contoh] Siap Melanjutkan ke Tahap Quiz',
        text: '[Contoh] Setelah menandai materi keempat ini selesai, tahap Quiz akan terbuka secara otomatis agar Ibu dapat mengulas kembali poin-poin di atas.',
      },
    ],
  },
];

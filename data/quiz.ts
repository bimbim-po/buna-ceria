import { QuizQuestion } from '@/types';

// 8 Soal quiz pilihan ganda (placeholder bertanda [Contoh])
// Nada penjelasan dibuat ramah, menenangkan, dan tidak menghakimi
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'quiz-1',
    order: 1,
    question:
      '[Contoh] Ketika Ibu merasakan perubahan suasana hati di masa kehamilan, sikap awal manakah yang paling menenangkan?',
    options: [
      '[Contoh] Menyalahkan diri sendiri karena merasa kurang kuat',
      '[Contoh] Menerima perasaan tersebut dengan lembut dan memberi waktu untuk beristirahat',
      '[Contoh] Menyembunyikan semua perasaan agar tidak diketahui siapa pun',
      '[Contoh] Memaksakan diri menyelesaikan semua pekerjaan sekaligus',
    ],
    correctIndex: 1,
    explanation:
      '[Contoh] Menerima perasaan dengan lembut membantu pikiran lebih tenang dan memberi ruang bagi Ibu untuk mengenali kebutuhan diri.',
  },
  {
    id: 'quiz-2',
    order: 2,
    question:
      '[Contoh] Kebiasaan sederhana apakah yang dicontohkan pada Materi 1 untuk memulai pagi dengan lebih tenang?',
    options: [
      '[Contoh] Meluangkan waktu sekitar 5 menit untuk bernapas perlahan dan nyaman',
      '[Contoh] Langsung membuka banyak berita yang memicu kekhawatiran',
      '[Contoh] Melewatkan waktu istirahat pagi',
      '[Contoh] Membandingkan kondisi diri dengan orang lain',
    ],
    correctIndex: 0,
    explanation:
      '[Contoh] Jeda singkat di pagi hari untuk bernapas perlahan membantu tubuh dan pikiran memulai aktivitas dengan lebih rileks.',
  },
  {
    id: 'quiz-3',
    order: 3,
    question:
      '[Contoh] Apa salah satu langkah sederhana yang dapat dilakukan sekitar 30 menit sebelum waktu istirahat malam?',
    options: [
      '[Contoh] Menonton tayangan yang menegangkan hingga larut',
      '[Contoh] Mengurangi paparan layar gawai dan menyiapkan suasana kamar yang teduh',
      '[Contoh] Mengerjakan tugas berat di tempat tidur',
      '[Contoh] Menyalakan seluruh lampu kamar dengan sangat terang',
    ],
    correctIndex: 1,
    explanation:
      '[Contoh] Mengurangi paparan layar gawai dan meredupkan suasana kamar memberi sinyal alami bagi tubuh untuk beristirahat.',
  },
  {
    id: 'quiz-4',
    order: 4,
    question:
      '[Contoh] Bagaimana cara yang dianjurkan saat Ibu membutuhkan bantuan dari pasangan atau keluarga?',
    options: [
      '[Contoh] Diam saja dan berharap pasangan langsung menebak',
      '[Contoh] Menyampaikan kebutuhan secara jujur dan lembut dengan kalimat sederhana',
      '[Contoh] Menunggu sampai tubuh benar-benar kelelahan terlebih dahulu',
      '[Contoh] Merasa sungkan karena takut dianggap merepotkan',
    ],
    correctIndex: 1,
    explanation:
      '[Contoh] Komunikasi yang jujur dan hangat memudahkan pasangan maupun keluarga memberikan dukungan yang tepat bagi Ibu.',
  },
  {
    id: 'quiz-5',
    order: 5,
    question:
      '[Contoh] Mengapa kita dianjurkan untuk tidak membandingkan perjalanan kehamilan sendiri dengan unggahan di media sosial?',
    options: [
      '[Contoh] Karena setiap ibu memiliki kondisi dan cerita perjalanan yang unik',
      '[Contoh] Karena media sosial wajib dihapus sepenuhnya',
      '[Contoh] Karena pengalaman orang lain tidak pernah nyata',
      '[Contoh] Karena kita harus selalu terlihat paling sempurna',
    ],
    correctIndex: 0,
    explanation:
      '[Contoh] Setiap perjalanan kehamilan bersifat unik. Fokus pada kenyamanan dan kebutuhan diri sendiri jauh lebih menenangkan.',
  },
  {
    id: 'quiz-6',
    order: 6,
    question:
      '[Contoh] Apa manfaat membagi daftar persiapan kehamilan menjadi langkah-langkah kecil mingguan?',
    options: [
      '[Contoh] Membuat pekerjaan terasa semakin menumpuk',
      '[Contoh] Membantu pikiran tetap jernih dan tidak merasa kewalahan',
      '[Contoh] Mengharuskan semua rencana selesai dalam satu hari',
      '[Contoh] Mengurangi waktu istirahat Ibu setiap hari',
    ],
    correctIndex: 1,
    explanation:
      '[Contoh] Langkah kecil yang terjadwal bertahap membantu Ibu menyiapkan keperluan tanpa rasa terburu-buru.',
  },
  {
    id: 'quiz-7',
    order: 7,
    question:
      '[Contoh] Apa yang sebaiknya dilakukan apabila Ibu merasa butuh teman diskusi tepercaya mengenai perasaan yang dialami?',
    options: [
      '[Contoh] Memendamnya sendiri berlarut-larut',
      '[Contoh] Menghubungi pendamping atau kontak ahli yang tersedia untuk berkonsultasi dengan nyaman',
      '[Contoh] Mencari informasi acak dari sumber yang belum jelas',
      '[Contoh] Mengabaikan perasaan tersebut sepenuhnya',
    ],
    correctIndex: 1,
    explanation:
      '[Contoh] Berbincang dengan tenaga pendamping atau ahli dapat memberikan ketenangan dan arahan yang tepercaya.',
  },
  {
    id: 'quiz-8',
    order: 8,
    question:
      '[Contoh] Manakah pernyataan yang paling menggambarkan semangat belajar di Teman Kasih?',
    options: [
      '[Contoh] Belajar dengan tenang, bertahap, dan penuh kasih sayang terhadap diri sendiri',
      '[Contoh] Berlomba menyelesaikan materi paling cepat tanpa membaca isi',
      '[Contoh] Menghafal istilah sulit sebanyak mungkin',
      '[Contoh] Merasa cemas jika belum hafal semua materi',
    ],
    correctIndex: 0,
    explanation:
      '[Contoh] Teman Kasih hadir untuk menemani Ibu belajar secara bertahap dengan hati yang tenang dan nyaman.',
  },
];

import { QuizQuestion } from '@/types';

// TODO: Bank soal divalidasi oleh tim bidan IBI dan dokter spesialis obstetri
// 8 Soal kuis pemahaman bertahap:
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'quiz-1',
    order: 1,
    question:
      'Ketika Ibu merasakan perubahan suasana hati di masa kehamilan, sikap awal manakah yang paling menenangkan?',
    options: [
      'Menyalahkan diri sendiri karena merasa kurang kuat',
      'Menerima perasaan tersebut dengan lembut dan memberi waktu untuk beristirahat',
      'Menyembunyikan semua perasaan agar tidak diketahui siapa pun',
      'Memaksakan diri menyelesaikan semua pekerjaan sekaligus',
    ],
    correctIndex: 1,
    explanation:
      'Menerima perasaan dengan lembut membantu pikiran lebih tenang dan memberi ruang bagi Ibu untuk mengenali kebutuhan diri.',
  },
  {
    id: 'quiz-2',
    order: 2,
    question:
      'Kebiasaan sederhana apakah yang dicontohkan pada Materi 1 untuk memulai pagi dengan lebih tenang?',
    options: [
      'Meluangkan waktu sekitar 5 menit untuk bernapas perlahan dan nyaman',
      'Langsung membuka banyak berita yang memicu kekhawatiran',
      'Melewatkan waktu istirahat pagi',
      'Membandingkan kondisi diri dengan orang lain',
    ],
    correctIndex: 0,
    explanation:
      'Jeda singkat di pagi hari untuk bernapas perlahan membantu tubuh dan pikiran memulai aktivitas dengan lebih rileks.',
  },
  {
    id: 'quiz-3',
    order: 3,
    question:
      'Apa salah satu langkah sederhana yang dapat dilakukan sekitar 30 menit sebelum waktu istirahat malam?',
    options: [
      'Menonton tayangan yang menegangkan hingga larut',
      'Mengurangi paparan layar gawai dan menyiapkan suasana kamar yang teduh',
      'Mengerjakan tugas berat di tempat tidur',
      'Menyalakan seluruh lampu kamar dengan sangat terang',
    ],
    correctIndex: 1,
    explanation:
      'Mengurangi paparan layar gawai dan meredupkan suasana kamar memberi sinyal alami bagi tubuh untuk beristirahat.',
  },
  {
    id: 'quiz-4',
    order: 4,
    question:
      'Bagaimana cara yang dianjurkan saat Ibu membutuhkan bantuan dari pasangan atau keluarga?',
    options: [
      'Diam saja dan berharap pasangan langsung menebak',
      'Menyampaikan kebutuhan secara jujur dan lembut dengan kalimat sederhana',
      'Menunggu sampai tubuh benar-benar kelelahan terlebih dahulu',
      'Merasa sungkan karena takut dianggap merepotkan',
    ],
    correctIndex: 1,
    explanation:
      'Komunikasi yang jujur dan hangat memudahkan pasangan maupun keluarga memberikan dukungan yang tepat bagi Ibu.',
  },
  {
    id: 'quiz-5',
    order: 5,
    question:
      'Mengapa kita dianjurkan untuk tidak membandingkan perjalanan kehamilan sendiri dengan unggahan di media sosial?',
    options: [
      'Karena setiap ibu memiliki kondisi dan cerita perjalanan yang unik',
      'Karena media sosial wajib dihapus sepenuhnya',
      'Karena pengalaman orang lain tidak pernah nyata',
      'Karena kita harus selalu terlihat paling sempurna',
    ],
    correctIndex: 0,
    explanation:
      'Setiap perjalanan kehamilan bersifat unik. Fokus pada kenyamanan dan kebutuhan diri sendiri jauh lebih menenangkan.',
  },
  {
    id: 'quiz-6',
    order: 6,
    question:
      'Apa manfaat membagi daftar persiapan kehamilan menjadi langkah-langkah kecil mingguan?',
    options: [
      'Membuat pekerjaan terasa semakin menumpuk',
      'Membantu pikiran tetap jernih dan tidak merasa kewalahan',
      'Mengharuskan semua rencana selesai dalam satu hari',
      'Mengurangi waktu istirahat Ibu setiap hari',
    ],
    correctIndex: 1,
    explanation:
      'Langkah kecil yang terjadwal bertahap membantu Ibu menyiapkan keperluan tanpa rasa terburu-buru.',
  },
  {
    id: 'quiz-7',
    order: 7,
    question:
      'Apa yang sebaiknya dilakukan apabila Ibu merasa butuh teman diskusi tepercaya mengenai perasaan yang dialami?',
    options: [
      'Memendamnya sendiri berlarut-larut',
      'Menghubungi pendamping atau kontak ahli yang tersedia untuk berkonsultasi dengan nyaman',
      'Mencari informasi acak dari sumber yang belum jelas',
      'Mengabaikan perasaan tersebut sepenuhnya',
    ],
    correctIndex: 1,
    explanation:
      'Berbincang dengan tenaga pendamping atau ahli dapat memberikan ketenangan dan arahan yang tepercaya.',
  },
  {
    id: 'quiz-8',
    order: 8,
    question:
      'Manakah pernyataan yang paling menggambarkan semangat belajar di Teman Kasih?',
    options: [
      'Belajar dengan tenang, bertahap, dan penuh kasih sayang terhadap diri sendiri',
      'Berlomba menyelesaikan materi paling cepat tanpa membaca isi',
      'Menghafal istilah sulit sebanyak mungkin',
      'Merasa cemas jika belum hafal semua materi',
    ],
    correctIndex: 0,
    explanation:
      'Teman Kasih hadir untuk menemani Ibu belajar secara bertahap dengan hati yang tenang dan nyaman.',
  },
];

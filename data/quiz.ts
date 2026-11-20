import { QuizQuestion } from '@/types';

// Materi Pengingat Singkat sebelum memulai Post Test (Level 4: Quiz 20 Soal)
export const quizReminderMaterial = {
  badge: 'Materi Pengingat Sebelum Post Test',
  title: 'Yuk, Segarkan Kembali Ingatan Bunda! 🌸',
  subtitle:
    'Sebelum mengerjakan 20 soal Post Test, mari ulas singkat 4 poin inti pembelajaran masa nifas dan kecukupan ASI yang telah Bunda pelajari:',
  sections: [
    {
      number: '01',
      title: 'Masa Nifas & Adaptasi Perasaan',
      points: [
        'Masa nifas berlangsung sejak bayi dan plasenta lahir hingga sekitar 42 hari (6 minggu).',
        'Perubahan emosi selama masa nifas dipengaruhi oleh pemulihan fisik, perubahan hormon, kurang tidur, dan adaptasi peran baru sebagai ibu.',
        'Mengenali perasaan membantu Bunda memahami kebutuhan diri untuk beristirahat dan meminta dukungan.',
      ],
    },
    {
      number: '02',
      title: 'Mengenali Tanda & Tingkat Kecemasan',
      points: [
        'Gejala kecemasan muncul pada 4 aspek: Perasaan (mudah khawatir/gelisah), Pikiran (sulit konsentrasi/takut tidak mampu), Fisik (jantung berdebar/otot tegang/sulit tidur), dan Perilaku (berulang kali memeriksa bayi).',
        '4 Tingkat Kecemasan: Ringan (masih bisa beraktivitas), Sedang (mulai mengganggu konsentrasi), Berat (mengganggu aktivitas harian), dan Panik (sulit mengendalikan diri).',
      ],
    },
    {
      number: '03',
      title: 'Perbedaan Baby Blues, Depresi Postpartum, dan Psikosis',
      points: [
        'Baby Blues: Umum terjadi di hari-hari pertama nifas (mudah menangis/sensitif) dan membaik dalam 1–2 minggu dengan dukungan keluarga & istirahat.',
        'Depresi Postpartum (DPP): Kesedihan berkepanjangan (>2 minggu), putus asa, kehilangan minat, dan memerlukan bantuan tenaga kesehatan.',
        'Psikosis Postpartum: Kondisi darurat medis dengan gejala kebingungan berat, halusinasi, atau perubahan perilaku drastis.',
      ],
    },
    {
      number: '04',
      title: 'Produksi & Tanda Kecukupan ASI serta Tips Relaksasi',
      points: [
        'Dua hormon utama ASI: Prolaktin (merangsang produksi ASI) dan Oksitosin (refleks pengeluaran ASI / let-down reflex). Stres/kortisol dapat menghambat kerja oksitosin.',
        'Indikator Bayi Cukup ASI: Menyusu efektif 8–12 kali/24 jam, BAK minimal 6 popok basah/24 jam setelah hari ke-5, BAB sesuai usia (hari 5–7 minimal 3–4 kali/hari), dan berat badan kembali ke berat lahir pada usia 10–14 hari.',
        'Atasi kecemasan dengan teknik pernapasan dalam, afirmasi positif, mendengarkan audio relaksasi, dan dukungan suami.',
      ],
    },
  ],
};

// 20 Soal Evaluasi Pemahaman (Pre-Test & Post-Test Materi Masa Nifas & Kecukupan ASI)
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'quiz-1',
    order: 1,
    question:
      'Berapa lama periode masa nifas berlangsung setelah bayi dan plasenta dilahirkan?',
    options: [
      'Sekitar 7 hari pertama setelah melahirkan',
      'Sekitar 14 hari setelah melahirkan',
      'Hingga sekitar 42 hari (6 minggu) setelah melahirkan',
      'Hingga bayi berusia 6 bulan penuh',
    ],
    correctIndex: 2,
    explanation:
      'Masa nifas adalah periode pemulihan tubuh dan adaptasi emosional sejak bayi dan plasenta lahir hingga sekitar 42 hari.',
  },
  {
    id: 'quiz-2',
    order: 2,
    question:
      'Faktor apakah yang sering menyebabkan perubahan perasaan pada Bunda setelah melahirkan?',
    options: [
      'Perubahan hormon, kelelahan fisik, kurang tidur, dan penyesuaian peran baru',
      'Karena Bunda kurang menyayangi buah hati',
      'Karena Bunda terlalu banyak tidur di siang hari',
      'Hanya terjadi pada ibu yang tidak menyusui bayinya',
    ],
    correctIndex: 0,
    explanation:
      'Perubahan emosi selama masa nifas berkaitan erat dengan pemulihan persalinan, perubahan hormon, kurang tidur, serta adaptasi peran baru.',
  },
  {
    id: 'quiz-3',
    order: 3,
    question:
      'Mengapa mengenali perasaan sendiri selama masa nifas sangat penting bagi Bunda?',
    options: [
      'Agar Bunda bisa memendam semua keluhan sendirian',
      'Membantu Bunda memahami apa yang sedang dialami dan mengambil langkah tepat untuk merawat diri',
      'Supaya Bunda dapat menuntut diri menjadi ibu yang sempurna tanpa bantuan',
      'Agar tidak perlu beristirahat meskipun tubuh terasa lelah',
    ],
    correctIndex: 1,
    explanation:
      'Mengenali perasaan membantu Bunda memahami kebutuhan diri saat sedang lelah atau khawatir sehingga dapat beristirahat atau meminta dukungan.',
  },
  {
    id: 'quiz-4',
    order: 4,
    question:
      'Apa yang dimaksud dengan kecemasan pada masa nifas?',
    options: [
      'Rasa bahagia berlebihan saat menggendong bayi',
      'Perasaan khawatir, takut, atau gelisah terhadap sesuatu yang belum pasti atau dianggap mengancam',
      'Kondisi mengantuk biasa setelah menyusui di malam hari',
      'Keinginan untuk makan makanan bergizi setiap hari',
    ],
    correctIndex: 1,
    explanation:
      'Kecemasan adalah perasaan khawatir, takut, atau gelisah terhadap sesuatu yang belum pasti, seperti kondisi bayi atau kemampuan merawat bayi.',
  },
  {
    id: 'quiz-5',
    order: 5,
    question:
      'Manakah di bawah ini yang termasuk tanda kecemasan yang dirasakan melalui FISIK (tubuh)?',
    options: [
      'Jantung berdebar, berkeringat, pusing, otot terasa tegang, atau sulit tidur',
      'Merasa bangga atas pertumbuhan berat badan bayi',
      'Ingin membaca buku panduan menyusui bersama suami',
      'Merasa tenang setelah mendengarkan audio relaksasi',
    ],
    correctIndex: 0,
    explanation:
      'Gejala fisik kecemasan meliputi jantung berdebar, berkeringat, pusing, ketegangan otot, dan gangguan tidur.',
  },
  {
    id: 'quiz-6',
    order: 6,
    question:
      'Ketika Bunda terus memikirkan sesuatu yang buruk, sulit berkonsentrasi, atau takut tidak mampu merawat bayi, hal tersebut termasuk tanda kecemasan pada aspek...',
    options: [
      'Aspek Pikiran',
      'Aspek Pencernaan',
      'Aspek Kebugaran Jasmani',
      'Aspek Nutrisi',
    ],
    correctIndex: 0,
    explanation:
      'Pikiran yang terus membayangkan hal buruk, sulit fokus, dan takut gagal merawat bayi merupakan tanda kecemasan pada aspek pikiran.',
  },
  {
    id: 'quiz-7',
    order: 7,
    question:
      'Pada tingkat kecemasan manakah Bunda merasa sedikit khawatir tetapi masih dapat melakukan aktivitas sehari-hari dengan baik?',
    options: [
      'Panik',
      'Kecemasan Berat',
      'Kecemasan Sedang',
      'Kecemasan Ringan',
    ],
    correctIndex: 3,
    explanation:
      'Pada tingkat kecemasan ringan, Bunda merasa sedikit khawatir namun masih mampu menjalani aktivitas harian.',
  },
  {
    id: 'quiz-8',
    order: 8,
    question:
      'Apa ciri utama dari kondisi Baby Blues pada ibu nifas?',
    options: [
      'Muncul pada hari-hari pertama setelah melahirkan dan umumnya membaik dalam 1–2 minggu dengan dukungan keluarga',
      'Berlangsung lebih dari 1 tahun dan disertai halusinasi berat',
      'Hanya bisa disembuhkan melalui operasi medis di rumah sakit',
      'Tidak pernah disertai rasa sedih atau mudah menangis',
    ],
    correctIndex: 0,
    explanation:
      'Baby blues umum terjadi di hari-hari awal pascapersalinan (mudah menangis, sensitif, cemas) dan membaik dalam 1–2 minggu.',
  },
  {
    id: 'quiz-9',
    order: 9,
    question:
      'Apa yang membedakan Depresi Postpartum (DPP) dengan Baby Blues?',
    options: [
      'Depresi postpartum selalu hilang sendiri dalam 24 jam pertama',
      'Depresi postpartum berupa kesedihan berkepanjangan (>2 minggu), merasa putus asa/tidak berharga, dan mengganggu kemampuan merawat bayi',
      'Depresi postpartum membuat ibu selalu bersemangat sepanjang malam',
      'Tidak ada perbedaan sama sekali antara keduanya',
    ],
    correctIndex: 1,
    explanation:
      'Depresi postpartum berlangsung lebih lama dan lebih berat dibanding baby blues sehingga mengganggu aktivitas harian dan butuh bantuan tenaga kesehatan.',
  },
  {
    id: 'quiz-10',
    order: 10,
    question:
      'Kondisi langka namun sangat serius dengan gejala kebingungan berat, perubahan perilaku drastis, serta mendengar atau melihat sesuatu yang tidak nyata disebut...',
    options: [
      'Baby Blues ringan',
      'Kelelahan menyusui biasa',
      'Psikosis Postpartum',
      'Adaptasi masa nifas normal',
    ],
    correctIndex: 2,
    explanation:
      'Psikosis postpartum adalah kondisi darurat medis yang ditandai halusinasi, delusi, atau kebingungan berat.',
  },
  {
    id: 'quiz-11',
    order: 11,
    question:
      'Kapan Bunda perlu segera berkonsultasi kepada bidan atau tenaga kesehatan terkait perasaan sedih atau cemas?',
    options: [
      'Jika perasaan sedih atau cemas berlangsung lebih dari dua minggu, semakin berat, atau mengganggu aktivitas sehari-hari',
      'Hanya ketika bayi sudah berusia di atas 2 tahun',
      'Tidak perlu berkonsultasi karena semua keluhan harus dipendam sendiri',
      'Hanya saat Bunda merasa sangat bahagia',
    ],
    correctIndex: 0,
    explanation:
      'Keluhan sedih atau cemas yang bertahan lebih dari 2 minggu atau mengganggu fungsi harian harus segera dikonsultasikan ke tenaga kesehatan.',
  },
  {
    id: 'quiz-12',
    order: 12,
    question:
      'Hormon apakah yang berperan merangsang produksi ASI di dalam payudara Bunda?',
    options: [
      'Hormon Adrenalin',
      'Hormon Prolaktin',
      'Hormon Kortisol',
      'Hormon Insulin',
    ],
    correctIndex: 1,
    explanation:
      'Hormon prolaktin berperan penting dalam merangsang produksi ASI di kelenjar payudara.',
  },
  {
    id: 'quiz-13',
    order: 13,
    question:
      'Apa fungsi utama dari hormon Oksitosin dalam proses menyusui?',
    options: [
      'Menghambat keluarnya ASI saat bayi menangis',
      'Membantu mengeluarkan ASI dari payudara melalui refleks pengeluaran ASI (let-down reflex)',
      'Membuat tubuh Bunda merasa tegang dan gelisah',
      'Mengurangi frekuensi bayi menyusu di malam hari',
    ],
    correctIndex: 1,
    explanation:
      'Hormon oksitosin bekerja memicu refleks pengeluaran ASI (let-down reflex) agar ASI mengalir keluar saat bayi menyusu.',
  },
  {
    id: 'quiz-14',
    order: 14,
    question:
      'Bagaimana perasaan cemas atau stres dapat memengaruhi kelancaran pengeluaran ASI?',
    options: [
      'Stres meningkatkan hormon kortisol yang dapat menghambat kerja hormon oksitosin dalam mengeluarkan ASI',
      'Kecemasan justru membuat refleks pengeluaran ASI semakin deras',
      'Perasaan ibu sama sekali tidak berhubungan dengan hormon menyusui',
      'Kecemasan mengubah warna ASI menjadi bening permanen',
    ],
    correctIndex: 0,
    explanation:
      'Saat cemas atau stres, peningkatan hormon kortisol dapat menghambat refleks oksitosin sehingga ASI terasa lebih sulit keluar.',
  },
  {
    id: 'quiz-15',
    order: 15,
    question:
      'Berapa kali umumnya bayi baru lahir menyusu secara efektif dalam waktu 24 jam?',
    options: [
      'Hanya 1–2 kali dalam 24 jam',
      'Sekitar 3–4 kali dalam 24 jam',
      'Sekitar 8–12 kali dalam 24 jam',
      'Cukup 1 kali setiap pagi hari',
    ],
    correctIndex: 2,
    explanation:
      'Bayi yang menyusu secara efektif umumnya menyusu sekitar 8–12 kali dalam 24 jam dengan pelekatan yang baik dan terdengar menelan.',
  },
  {
    id: 'quiz-16',
    order: 16,
    question:
      'Setelah bayi berusia lebih dari 5 hari, berapa jumlah minimal popok basah (Buang Air Kecil / BAK) dalam 24 jam yang menandakan bayi cukup ASI?',
    options: [
      'Minimal 1 popok basah dalam 24 jam',
      'Minimal 2 popok basah dalam 24 jam',
      'Setidaknya 6 popok basah dalam 24 jam',
      'Tidak perlu ganti popok seharian',
    ],
    correctIndex: 2,
    explanation:
      'Setelah hari ke-5, bayi yang mendapatkan cukup ASI umumnya menghasilkan setidaknya enam popok basah dalam 24 jam.',
  },
  {
    id: 'quiz-17',
    order: 17,
    question:
      'Berapa frekuensi Buang Air Besar (BAB) normal pada bayi usia 5–7 hari yang mendapatkan cukup ASI?',
    options: [
      'Minimal 3–4 kali sehari',
      'Hanya 1 kali dalam seminggu',
      'Tidak pernah BAB sama sekali',
      'Kurang dari 1 kali dalam 3 hari',
    ],
    correctIndex: 0,
    explanation:
      'Pada usia 5–7 hari, indikator kecukupan ASI ditunjukkan dengan frekuensi BAB minimal 3–4 kali sehari.',
  },
  {
    id: 'quiz-18',
    order: 18,
    question:
      'Pada usia berapakah berat badan bayi umumnya kembali mencapai berat lahir setelah mengalami penurunan awal pascapersalinan?',
    options: [
      'Pada usia 1–2 hari',
      'Pada usia 10–14 hari',
      'Pada usia 6 bulan',
      'Pada usia 1 tahun',
    ],
    correctIndex: 1,
    explanation:
      'Berat badan bayi umumnya kembali mencapai berat lahir pada usia 10–14 hari dan terus bertambah sesuai grafik pertumbuhan.',
  },
  {
    id: 'quiz-19',
    order: 19,
    question:
      'Bagaimanakah langkah yang benar saat melakukan teknik relaksasi pernapasan dalam ketika Bunda merasa cemas?',
    options: [
      'Menahan napas selama mungkin sambil mengepalkan tangan',
      'Bernapas cepat dan pendek melalui mulut sambil berdiri',
      'Letakkan satu tangan di dada dan satu di perut, tarik napas perlahan lewat hidung hingga perut mengembang, lalu embuskan perlahan lewat mulut',
      'Menarik napas sambil memikirkan hal-hal yang menakutkan',
    ],
    correctIndex: 2,
    explanation:
      'Pernapasan dalam dilakukan dalam posisi nyaman dengan menarik napas perlahan lewat hidung (perut mengembang) dan mengembuskannya perlahan lewat mulut.',
  },
  {
    id: 'quiz-20',
    order: 20,
    question:
      'Mengapa dukungan suami sangat penting bagi Bunda selama menjalani masa nifas?',
    options: [
      'Membuat Bunda merasa lebih dihargai, didengarkan, mendapat bantuan merawat bayi, dan tidak menghadapi perubahan seorang diri',
      'Agar Bunda tidak perlu menyentuh bayi sama sekali',
      'Karena hanya suami yang boleh menggendong bayi',
      'Agar Bunda tidak perlu berkonsultasi ke bidan saat sakit',
    ],
    correctIndex: 0,
    explanation:
      'Kehadiran dan dukungan emosional maupun praktis dari suami membuat Bunda merasa dihargai, tenang, dan tidak sendirian menjalani masa nifas.',
  },
];

import { ModuleItem } from '@/types';

// 4 Materi Pembelajaran Masa Nifas & Kecukupan ASI (Level 1)
export const mockModules: ModuleItem[] = [
  {
    id: 'materi-1',
    order: 1,
    title: 'Mengenali Perubahan Perasaan di Masa Nifas',
    summary:
      'Memahami masa nifas, perubahan emosional setelah melahirkan, dan mengenali berbagai perasaan yang dapat muncul selama masa nifas.',
    readingTimeMinutes: 5,
    category: 'Adaptasi Masa Nifas',
    content: [
      {
        type: 'subheading',
        text: 'Selamat Datang di Masa Baru, Bunda!',
      },
      {
        type: 'paragraph',
        text: 'Menjadi seorang ibu merupakan pengalaman yang penuh kebahagiaan sekaligus tantangan. Setelah melahirkan, Ibu tidak hanya mengalami perubahan fisik, tetapi juga perubahan perasaan dan rutinitas sehari-hari.',
      },
      {
        type: 'paragraph',
        text: 'Ibu mungkin merasa bahagia ketika melihat si kecil, tetapi pada waktu yang sama juga merasa lelah, khawatir, mudah menangis, atau lebih sensitif dari biasanya.',
      },
      {
        type: 'paragraph',
        text: 'Perubahan tersebut dapat berkaitan dengan proses pemulihan setelah persalinan, perubahan hormon, kurang tidur, serta penyesuaian terhadap peran baru sebagai seorang ibu.',
      },
      {
        type: 'subheading',
        text: 'Mengenal Masa Nifas?',
      },
      {
        type: 'paragraph',
        text: 'Tahukah Bunda? Setelah melahirkan, tubuh membutuhkan waktu untuk kembali pulih. Periode ini dikenal sebagai masa nifas, yaitu masa setelah bayi dan plasenta dilahirkan hingga sekitar 42 hari. Pada masa ini, tubuh Bunda mengalami proses pemulihan dan penyesuaian, termasuk perubahan pada organ reproduksi serta proses menyusui.',
      },
      {
        type: 'paragraph',
        text: 'Pada masa ini, Ibu juga mulai beradaptasi dengan berbagai perubahan, seperti pola tidur yang berubah, kebutuhan bayi yang harus dipenuhi, serta tanggung jawab baru dalam merawat si kecil.',
      },
      {
        type: 'callout',
        title: 'Ingat, Bunda!',
        text: 'Masa nifas bukan hanya tentang pemulihan tubuh, tetapi juga tentang memberikan waktu bagi Ibu untuk beradaptasi secara emosional dengan kehidupan setelah melahirkan.',
      },
      {
        type: 'subheading',
        text: 'Mengapa Mengenali Perasaan Itu Penting?',
      },
      {
        type: 'paragraph',
        text: 'Mengenali perasaan membantu Ibu memahami apa yang sedang dialami dan apa yang dibutuhkan saat ini.',
      },
      {
        type: 'paragraph',
        text: 'Ketika Ibu merasa sedang lelah, khawatir, atau membutuhkan dukungan, Ibu dapat mengambil langkah yang lebih tepat untuk merawat diri.',
      },
      {
        type: 'paragraph',
        text: 'Tidak semua perasaan tidak nyaman berarti Ibu mengalami gangguan mental. Namun, perasaan sedih atau cemas yang berlangsung terus-menerus, semakin berat, atau mengganggu aktivitas sehari-hari perlu mendapatkan perhatian.',
      },
      {
        type: 'callout',
        title: 'Pesan untuk Bunda 💗',
        text: 'Menjadi ibu adalah perjalanan baru yang membutuhkan waktu untuk dipelajari. Bunda tidak harus selalu merasa bahagia atau mampu melakukan semuanya sendiri. Beri kesempatan kepada diri sendiri untuk beradaptasi, beristirahat, dan mendapatkan dukungan.',
      },
    ],
  },
  {
    id: 'materi-2',
    order: 2,
    title: 'Mengenali Kecemasan dan Menjaga Ketenangan Diri',
    summary:
      'Mengenali kecemasan, memahami pemicunya, dan mengetahui kapan kekhawatiran perlu mendapatkan perhatian lebih.',
    readingTimeMinutes: 6,
    category: 'Ketenangan Emosi',
    content: [
      {
        type: 'subheading',
        text: 'Apa itu Kecemasan?',
      },
      {
        type: 'paragraph',
        text: 'Kecemasan merupakan perasaan khawatir, takut, atau gelisah terhadap sesuatu yang belum pasti atau dianggap mengancam.',
      },
      {
        type: 'paragraph',
        text: 'Setelah melahirkan, Bunda mungkin merasa khawatir terhadap kondisi bayi, kemampuan merawat bayi, proses menyusui, maupun perubahan kehidupan setelah menjadi seorang ibu. Apabila kecemasan berlangsung terus-menerus, sulit dikendalikan, atau mulai mengganggu aktivitas sehari-hari, kondisi tersebut perlu mendapatkan perhatian.',
      },
      {
        type: 'subheading',
        text: 'Yuk, Kenali Tanda-Tanda Kecemasan!',
      },
      {
        type: 'paragraph',
        text: 'Kecemasan tidak selalu muncul dalam bentuk rasa takut. Terkadang, Bunda mungkin merasakannya melalui perubahan pikiran, perasaan, tubuh, maupun perilaku.',
      },
      {
        type: 'list',
        title: '4 Dimensi Tanda Kecemasan:',
        items: [
          'Perasaan: Bunda mungkin merasa mudah khawatir, takut, gelisah, mudah tersinggung, atau merasa tidak tenang.',
          'Pikiran: Terus memikirkan sesuatu yang buruk, sulit berkonsentrasi, atau merasa takut tidak mampu merawat bayi.',
          'Fisik: Kecemasan dapat disertai jantung berdebar, berkeringat, pusing, otot terasa tegang, atau sulit tidur.',
          'Perilaku: Gelisah, berulang kali memeriksa kondisi bayi, atau menghindari hal-hal yang membuat khawatir.',
        ],
      },
      {
        type: 'callout',
        title: 'Tahukah Bunda? 🌷',
        text: 'Kecemasan tidak hanya berkaitan dengan pikiran dan perasaan, tetapi juga dapat dirasakan melalui tubuh. Ketika merasa cemas, tubuh dapat menjadi lebih tegang, jantung berdebar, atau napas terasa lebih cepat. Hal ini merupakan respons tubuh terhadap situasi yang dianggap mengancam. Karena itu, mengenali perubahan yang terjadi pada tubuh dapat membantu Bunda lebih memahami kondisi diri ketika sedang merasa cemas.',
      },
      {
        type: 'subheading',
        text: 'Mengenal Tingkat Kecemasan',
      },
      {
        type: 'paragraph',
        text: 'Kecemasan dapat dibedakan menjadi empat tingkat berdasarkan beratnya gejala.',
      },
      {
        type: 'list',
        title: 'Empat Tingkat Kecemasan:',
        items: [
          'Kecemasan ringan: Bunda merasa sedikit khawatir, tetapi masih dapat melakukan aktivitas sehari-hari.',
          'Kecemasan sedang: Rasa khawatir mulai mengganggu konsentrasi dan membuat Bunda sulit merasa tenang.',
          'Kecemasan berat: Bunda mengalami rasa takut atau khawatir yang kuat sehingga aktivitas sehari-hari dapat terganggu.',
          'Panik: Bunda dapat merasa sangat takut, sulit mengendalikan diri, dan kesulitan berpikir dengan jernih.',
        ],
      },
      {
        type: 'subheading',
        text: 'Mengapa Kecemasan Perlu Dikenali?',
      },
      {
        type: 'paragraph',
        text: 'Kecemasan yang berlangsung terus-menerus dapat memengaruhi kenyamanan Bunda selama masa nifas. Bunda mungkin menjadi lebih sulit beristirahat, merasa kurang percaya diri dalam merawat bayi, atau mengalami kesulitan menikmati proses menyusui.',
      },
      {
        type: 'paragraph',
        text: 'Kecemasan juga dapat memengaruhi refleks pengeluaran ASI pada sebagian ibu. Namun, kecemasan tidak selalu menyebabkan produksi ASI berkurang. Mengenali kecemasan sejak awal membantu Bunda memahami kebutuhan diri dan mengetahui kapan perlu mendapatkan dukungan.',
      },
      {
        type: 'subheading',
        text: 'Yuk, Kenali Apa yang Membuat Bunda Khawatir!',
      },
      {
        type: 'list',
        title: 'Pertanyaan Reflektif untuk Bunda:',
        items: [
          'Apakah Bunda sering merasa khawatir ketika bayi menangis?',
          'Apakah Bunda merasa takut ASI tidak cukup?',
          'Apakah Bunda merasa khawatir ketika harus merawat bayi sendiri?',
          'Apakah Bunda sulit beristirahat karena terus memikirkan kondisi bayi?',
        ],
      },
      {
        type: 'paragraph',
        text: 'Jika pernah merasakan hal tersebut, cobalah mengenali apa yang sebenarnya membuat Bunda khawatir. Memahami pemicu kecemasan dapat membantu Bunda menentukan informasi yang dibutuhkan, meminta bantuan suami, atau konsultasi dengan tenaga kesehatan.',
      },
      {
        type: 'callout',
        title: 'Pesan untuk Bunda 💗',
        text: 'Merasa cemas setelah melahirkan bukan berarti Bunda lemah atau tidak mampu menjadi ibu yang baik. Bunda tidak harus menghadapi semuanya sendirian. Jangan ragu untuk bercerita dan meminta bantuan ketika membutuhkannya.',
      },
    ],
  },
  {
    id: 'materi-3',
    order: 3,
    title: 'Gangguan Psikologis Masa Nifas',
    summary:
      'Mengenali perbedaan baby blues, depresi postpartum, dan psikosis postpartum serta memahami kapan Ibu perlu mendapatkan pertolongan.',
    readingTimeMinutes: 6,
    category: 'Kesehatan Psikologis',
    content: [
      {
        type: 'paragraph',
        text: 'Setelah melahirkan, perubahan suasana hati dapat terjadi sebagai bagian dari penyesuaian. Namun, beberapa kondisi dapat membutuhkan perhatian dan penanganan lebih lanjut.',
      },
      {
        type: 'paragraph',
        text: 'Yuk, Bunda, kenali tiga kondisi berikut agar lebih memahami perubahan perasaan setelah melahirkan.',
      },
      {
        type: 'subheading',
        text: '1. Baby Blues',
      },
      {
        type: 'image',
        src: '/materi-baby-blues.webp',
        alt: 'Ilustrasi kondisi Baby Blues pada ibu masa nifas yang didampingi suami',
        caption:
          'Ilustrasi Baby Blues: Perubahan suasana hati di hari-hari pertama nifas yang membaik dengan dukungan hangat keluarga & istirahat.',
      },
      {
        type: 'paragraph',
        text: 'Baby blues merupakan perubahan suasana hati yang umum terjadi setelah melahirkan.',
      },
      {
        type: 'list',
        title: 'Bunda mungkin mengalami:',
        items: [
          'Mudah menangis.',
          'Merasa sedih atau sensitif.',
          'Mudah tersinggung.',
          'Perubahan suasana hati.',
          'Merasa cemas atau kewalahan.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Baby blues biasanya muncul pada hari-hari pertama setelah melahirkan dan membaik dengan sendirinya dalam waktu sekitar 1–2 minggu. Pada masa ini, dukungan keluarga, istirahat, dan bantuan dalam merawat bayi dapat membantu Bunda melewati proses adaptasi.',
      },
      {
        type: 'subheading',
        text: '2. Depresi Postpartum (DPP)',
      },
      {
        type: 'image',
        src: '/materi-dpp.webp',
        alt: 'Ilustrasi kondisi Depresi Postpartum dan pendampingan tenaga kesehatan',
        caption:
          'Ilustrasi Depresi Postpartum (DPP): Kesedihan berkepanjangan yang memerlukan pendampingan bidan atau konselor kesehatan.',
      },
      {
        type: 'paragraph',
        text: 'Depresi postpartum merupakan kondisi ketika Bunda mengalami kesedihan berkepanjangan, kehilangan minat, merasa putus asa, atau merasa tidak berharga. Kondisi ini dapat mengganggu aktivitas sehari-hari dan kemampuan merawat bayi.',
      },
      {
        type: 'paragraph',
        text: 'Depresi postpartum tidak sama dengan baby blues. Kondisi ini dapat berlangsung lebih lama, terasa lebih berat, dan mengganggu kehidupan sehari-hari.',
      },
      {
        type: 'paragraph',
        text: 'Depresi postpartum bukan kesalahan Bunda dan bukan tanda bahwa Bunda gagal menjadi ibu. Kondisi ini dapat ditangani dengan bantuan tenaga kesehatan.',
      },
      {
        type: 'subheading',
        text: '3. Psikosis Postpartum',
      },
      {
        type: 'image',
        src: '/materi-psikosis.webp',
        alt: 'Ilustrasi penanganan medis darurat pada kondisi Psikosis Postpartum',
        caption:
          'Ilustrasi Psikosis Postpartum: Kondisi serius yang jarang terjadi namun membutuhkan pertolongan medis darurat segera.',
      },
      {
        type: 'paragraph',
        text: 'Psikosis postpartum merupakan kondisi yang jarang terjadi, tetapi sangat serius.',
      },
      {
        type: 'list',
        title: 'Gejalanya dapat muncul secara tiba-tiba, seperti:',
        items: [
          'Kebingungan berat.',
          'Perubahan perilaku yang sangat drastis.',
          'Mendengar atau melihat sesuatu yang sebenarnya tidak ada.',
          'Memiliki keyakinan yang tidak sesuai dengan kenyataan.',
          'Sulit membedakan kenyataan dan sesuatu yang tidak nyata.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Kondisi ini membutuhkan pertolongan medis darurat.',
      },
      {
        type: 'callout',
        title: 'Penting untuk Bunda!',
        text: 'Jika perasaan sedih atau cemas berlangsung lebih dari dua minggu, semakin berat, atau mengganggu aktivitas sehari-hari, segera konsultasikan kepada bidan atau tenaga kesehatan. Jika muncul pikiran untuk menyakiti diri sendiri atau bayi, atau gejala psikosis, segera cari pertolongan medis darurat.',
      },
    ],
  },
  {
    id: 'materi-4',
    order: 4,
    title: 'Mengenal ASI dan Proses Produksinya',
    summary:
      'Memahami manfaat ASI, proses produksi dan pengeluaran ASI, serta tanda bayi cukup ASI.',
    readingTimeMinutes: 6,
    category: 'Edukasi Laktasi & ASI',
    content: [
      {
        type: 'subheading',
        text: 'Mengenal Kecukupan ASI',
      },
      {
        type: 'paragraph',
        text: 'ASI merupakan sumber nutrisi utama bagi bayi yang mengandung zat gizi dan antibodi untuk mendukung pertumbuhan dan melindungi bayi dari penyakit, terutama selama enam bulan pertama kehidupan.',
      },
      {
        type: 'paragraph',
        text: 'Kecukupan ASI adalah kondisi ketika bayi mendapatkan ASI sesuai kebutuhannya untuk memenuhi kebutuhan nutrisi dan cairan tubuh.',
      },
      {
        type: 'paragraph',
        text: 'Perlu Bunda ketahui, ASI yang terlihat sedikit belum tentu berarti kebutuhan bayi tidak terpenuhi. Kecukupan ASI dapat dilihat dari kondisi bayi, seperti frekuensi buang air kecil, perubahan BAB, dan pertambahan berat badan.',
      },
      {
        type: 'subheading',
        text: 'Bagaimana ASI Diproduksi?',
      },
      {
        type: 'paragraph',
        text: 'Tahukah Bunda? Produksi dan pengeluaran ASI melibatkan dua hormon penting, yaitu:',
      },
      {
        type: 'list',
        title: 'Dua Hormon Penting Menyusui:',
        items: [
          'Prolaktin: berperan dalam merangsang produksi ASI di payudara.',
          'Oksitosin: membantu mengeluarkan ASI dari payudara melalui refleks pengeluaran ASI (let-down reflex).',
        ],
      },
      {
        type: 'paragraph',
        text: 'Ketika bayi menyusu, rangsangan isapan akan membantu pelepasan kedua hormon tersebut. Oleh karena itu, menyusui secara sering dan efektif penting untuk mendukung kelancaran ASI.',
      },
      {
        type: 'subheading',
        text: 'Apakah ASI Bunda Sudah Cukup?',
      },
      {
        type: 'paragraph',
        text: 'Salah satu kekhawatiran adalah Ibu tidak dapat melihat secara langsung jumlah ASI yang diminum bayi ketika menyusu, kecukupan ASI perlu dinilai melalui beberapa indikator:',
      },
      {
        type: 'list',
        title: 'Indikator Kecukupan ASI pada Bayi:',
        items: [
          'Bayi Menyusu secara Efektif: Bayi memiliki pelekatan yang baik, mengisap secara teratur, dan terdengar menelan. Bayi umumnya menyusu sekitar 8–12 kali dalam 24 jam.',
          'Frekuensi Buang Air Kecil (BAK): Setelah hari ke-5, bayi umumnya memiliki setidaknya enam popok basah dalam 24 jam.',
          'Frekuensi Buang Air Besar (BAB): Usia 1–2 hari sekitar 1–2 kali sehari; Usia 3–4 hari minimal 2 kali sehari; Usia 5–7 hari minimal 3–4 kali sehari.',
          'Berat Badan Bertambah: Berat badan bayi biasanya mengalami penurunan pada beberapa hari pertama setelah lahir. Namun, berat badan umumnya kembali mencapai berat lahir pada usia 10–14 hari dan selanjutnya bertambah sesuai pertumbuhan bayi.',
        ],
      },
      {
        type: 'subheading',
        text: 'Hubungan Kecemasan dengan Kecukupan ASI',
      },
      {
        type: 'paragraph',
        text: 'Tahukah Bunda bahwa perasaan cemas dapat memengaruhi proses menyusui? Ketika merasa cemas atau stres, tubuh dapat meningkatkan pelepasan hormon kortisol sebagai respons terhadap stres. Kondisi ini dapat memengaruhi kerja hormon oksitosin yang berperan dalam refleks pengeluaran ASI.',
      },
      {
        type: 'paragraph',
        text: 'Akibatnya, ASI mungkin menjadi lebih sulit keluar meskipun sebenarnya masih diproduksi. Jika pengeluaran ASI terus tidak efektif, hal ini juga dapat memengaruhi produksi ASI.',
      },
      {
        type: 'list',
        title: 'Langkah Sederhana Hari Ini:',
        items: [
          'Perhatikan frekuensi menyusui bayi.',
          'Amati jumlah popok basah sesuai usia bayi.',
          'Pantau berat badan bayi secara berkala.',
          'Catat hal yang membuat Ibu khawatir dan konsultasikan jika diperlukan.',
        ],
      },
      {
        type: 'callout',
        title: 'Pesan untuk Bunda 💗',
        text: 'Setiap proses menyusui memiliki perjalanan yang berbeda. Jangan hanya menilai ASI dari banyaknya ASI yang terlihat keluar. Kenali tanda kecukupan ASI pada bayi dan jangan ragu meminta bantuan ketika mengalami kesulitan.',
      },
    ],
  },
];

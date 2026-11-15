import {
  CauseEffectItem,
  DemonstrationStep,
  EnrichmentChallenge,
  ExerciseQuestion,
  MaterialQuizQuestion,
  RubricRow,
  RubricSectionSpec,
  StoryData,
} from '../types';

export const HERO_BANNER_IMAGE = '/src/assets/images/hero_detektif_cerita_1794751245119.jpg';

export const STORIES: Record<StoryData['id'], StoryData> = {
  'cerita-1': {
    id: 'cerita-1',
    title: 'Rahasia Bekal di Bangku Taman',
    subtitle: 'Cerita 1 · Contoh dan Demonstrasi Analisis Unsur Intrinsik',
    usedIn: 'Contoh dan Demonstrasi',
    coverImage: '/src/assets/images/cover_cerita_bekal_1794751245863.jpg',
    panels: [
      {
        id: 'c1-p1',
        order: 1,
        sceneKey: 'c1-p1',
        caption: 'Bel Istirahat Pukul 09.30',
        narrative:
          'Pukul 09.30 pagi di halaman sekolah yang cerah, Beni berlari menuju taman bacaan sambil membawa tas bekal biru. Ia meletakkan tas bekalnya di bangku kayu lalu asyik membaca komik sains bersama teman-teman.',
        visualClues: [
          'Jam dinding koridor menunjukkan 09.30',
          'Tas bekal biru diletakkan di bangku kayu taman',
          'Beni tampak terburu-buru membuka buku',
        ],
      },
      {
        id: 'c1-p2',
        order: 2,
        sceneKey: 'c1-p2',
        caption: 'Tas Bekal Menghilang',
        narrative:
          'Saat perutnya berbunyi karena lapar, Beni menoleh ke bangku kayu. Tas bekal birunya sudah tidak ada! Di ujung bangku hanya tersisa tas biru lain yang hampir mirip tanpa gantungan kunci bintang.',
        visualClues: [
          'Wajah Beni terlihat panik dan cemas',
          'Ada tas biru lain tanpa gantungan bintang',
          'Beberapa siswa lain berjalan menuju kantin',
        ],
      },
      {
        id: 'c1-p3',
        order: 3,
        sceneKey: 'c1-p3',
        caption: 'Tuduhan yang Tergesa-gesa',
        narrative:
          'Beni langsung berprasangka bahwa ada siswa kelas lain yang mengambil bekalnya. Raka datang menghampiri dan meminta Beni menarik napas tenang sebelum menuduh siapa pun.',
        visualClues: [
          'Beni menunjuk ke arah siswa lain dengan kesal',
          'Raka bersikap tenang dan mengajak memeriksa sekitar',
        ],
      },
      {
        id: 'c1-p4',
        order: 4,
        sceneKey: 'c1-p4',
        caption: 'Mencari Jejak di Taman Bacaan',
        narrative:
          'Raka mengajak Beni memeriksa rak buku mini dan area sekitar bangku taman. Mereka melihat label nama pada tas biru yang tertinggal di bangku bertuliskan "Siti - 6B".',
        visualClues: [
          'Raka memeriksa label nama pada tas dengan teliti',
          'Terlihat rak buku Taman Bacaan Sekolah di dekat bangku',
        ],
      },
      {
        id: 'c1-p5',
        order: 5,
        sceneKey: 'c1-p5',
        caption: 'Bekal Ditemukan Selamat',
        narrative:
          'Ternyata tas bekal Beni bergeser ke rak bawah lemari buku karena tersenggol saat mereka duduk berdesakan. Tidak ada yang mengambilnya. Siti pun datang mengambil tas birunya yang sempat tertukar tempat.',
        visualClues: [
          'Tas biru dengan gantungan bintang ditemukan di rak bawah',
          'Beni dan Siti saling tersenyum lega',
        ],
      },
      {
        id: 'c1-p6',
        order: 6,
        sceneKey: 'c1-p6',
        caption: 'Makan Bersama dengan Hati Tenang',
        narrative:
          'Beni meminta maaf karena hampir berprasangka buruk dan berterima kasih kepada Raka yang sudah teliti membantu. Mereka menikmati bekal bersama di bangku taman.',
        visualClues: [
          'Beni dan Raka berbagi cerita sambil makan bekal',
          'Suasana taman sekolah kembali hangat dan akrab',
        ],
      },
    ],
    intrinsicKey: {
      tokohDanPenokohan:
        'Beni (ceroboh, mudah panik dan terburu-buru menuduh, namun mau meminta maaf) dan Raka (teliti, sabar, peduli, bijaksana). Tokoh tambahan: Siti (ramah).',
      latar:
        'Tempat: Taman bacaan di halaman sekolah. Waktu: Pagi hari pukul 09.30 saat jam istirahat. Suasana: Cerah, sempat tegang saat bekal hilang, lalu lega dan akrab.',
      konflik:
        'Tas bekal biru milik Beni hilang dari bangku taman sehingga Beni kelaparan dan hampir menuduh siswa lain mengambilnya.',
      penyelesaian:
        'Raka mengajak Beni memeriksa bukti dengan tenang hingga menemukan tas tertukar posisi di rak bawah taman bacaan.',
      alur: 'Alur maju: Beni meletakkan tas -> tas hilang & Beni panik -> Raka memeriksa petunjuk label nama -> tas ditemukan di rak bawah -> Beni meminta maaf dan makan bersama.',
      amanat:
        'Jangan terburu-buru menuduh orang lain sebelum memeriksa bukti dan fakta dengan tenang serta teliti.',
    },
  },

  'cerita-2': {
    id: 'cerita-2',
    title: 'Misteri Bibit Cabai di Kebun Kelas',
    subtitle: 'Cerita 2 · Misi Kelompok LKPD (Susun Gambar & Analisis)',
    usedIn: 'Misi Kelompok – LKPD',
    coverImage: '/src/assets/images/cover_cerita_kebun_1794751245574.jpg',
    panels: [
      {
        id: 'c2-p1',
        order: 1,
        sceneKey: 'c2-p1',
        caption: 'Persiapan Lomba Kebun Kelas',
        narrative:
          'Pagi pukul 07.15 sebelum pelajaran dimulai, Sinta merawat tiga pot bibit cabai milik kelompoknya di kebun sekolah. Hari ini Bu Dewi akan menilai kerapian dan pertumbuhan tanaman kelas 6.',
        visualClues: [
          'Tiga pot terakota berisi bibit cabai berdiri rapi',
          'Sinta menyiram tanaman dengan gembor hijau',
        ],
      },
      {
        id: 'c2-p2',
        order: 2,
        sceneKey: 'c2-p2',
        caption: 'Bola Terpental di Dekat Pot',
        narrative:
          'Tak lama kemudian, Bagas berlari kencang mengejar bola yang terlempar ke pinggir kebun. Karena tergesa-gesa tanpa melihat jalan, kaki Bagas menyenggol pot cabai nomor tiga hingga terguling.',
        visualClues: [
          'Bagas berlari mengejar bola merah',
          'Pot nomor tiga mulai miring dan jatuh',
        ],
      },
      {
        id: 'c2-p3',
        order: 3,
        sceneKey: 'c2-p3',
        caption: 'Tanah Berserakan dan Sinta Terkejut',
        narrative:
          'Saat Sinta kembali membawa papan nama tanaman, ia terkejut melihat satu pot roboh dan tanahnya tumpah ke jalan setapak. Bagas berdiri di balik pohon mangga sambil menunduk takut dimarahi.',
        visualClues: [
          'Pot pecah sebagian dan tanah berserakan',
          'Bagas bersembunyi sambil merasa bersalah',
          'Sinta tampak sedih melihat bibit cabai miring',
        ],
      },
      {
        id: 'c2-p4',
        order: 4,
        sceneKey: 'c2-p4',
        caption: 'Keberanian Mengakui Kesalahan',
        narrative:
          'Melihat Sinta hampir menangis karena penilaian sebentar lagi dimulai, Bagas memutuskan keluar dari balik pohon. Dengan jujur ia mengakui bahwa ia tidak sengaja menyenggol pot saat mengejar bola.',
        visualClues: [
          'Bagas menghampiri Sinta dan meminta maaf secara langsung',
          'Bu Dewi datang mendengarkan penjelasan dengan tenang',
        ],
      },
      {
        id: 'c2-p5',
        order: 5,
        sceneKey: 'c2-p5',
        caption: 'Gotong Royong Menyelamatkan Bibit',
        narrative:
          'Sinta memaafkan Bagas. Atas saran Bu Dewi, mereka segera memindahkan bibit ke pot cadangan, menambahkan tanah kompos, dan mengikat batang cabai pada bilah bambu penopang.',
        visualClues: [
          'Bagas memegang bilah bambu dan Sinta merapikan tanah dengan sekop kecil',
          'Kerja sama cepat sebelum bel penilaian berbunyi',
        ],
      },
      {
        id: 'c2-p6',
        order: 6,
        sceneKey: 'c2-p6',
        caption: 'Kebun Kembali Rapi dan Mendapat Pujian',
        narrative:
          'Saat penilaian dimulai, seluruh pot cabai berdiri tegak dan rapi. Bu Dewi memuji kejujuran Bagas dan kekompakan kelompok mereka dalam menyelesaikan masalah.',
        visualClues: [
          'Ketiga pot cabai kembali sehat dan tegak dengan penyangga bambu',
          'Bu Dewi tersenyum mengacungkan jempol kepada Sinta dan Bagas',
        ],
      },
    ],
    intrinsicKey: {
      tokohDanPenokohan:
        'Sinta (rajin, bertanggung jawab, pemaaf), Bagas (awalnya tergesa-gesa dan takut, lalu berani jujur dan bertanggung jawab), Bu Dewi (bijaksana, sabar, adil).',
      latar:
        'Tempat: Kebun sekolah dekat pohon mangga. Waktu: Pagi hari pukul 07.15 sebelum penilaian kebun. Suasana: Awalnya cerah, berubah cemas saat pot jatuh, lalu hangat penuh kerja sama.',
      konflik:
        'Pot bibit cabai milik kelompok Sinta jatuh tersenggol Bagas menjelang penilaian kebun kelas, dan Bagas sempat takut mengaku.',
      penyelesaian:
        'Bagas berani mengakui kesalahannya dan meminta maaf, lalu bersama Sinta menanam ulang bibit memakai pot cadangan dan penopang bambu.',
      alur: 'Alur maju: Sinta merawat pot -> Bagas menyenggol pot saat mengejar bola -> Sinta kaget & Bagas sempat sembunyi -> Bagas jujur mengaku -> gotong royong menanam ulang -> tanaman selamat & dipuji.',
      amanat:
        'Berani mengakui kesalahan dengan jujur dan bekerja sama memperbaikinya jauh lebih terpuji daripada bersembunyi.',
    },
  },

  'cerita-3': {
    id: 'cerita-3',
    title: 'Lentera Hujan di Pos Ronda',
    subtitle: 'Cerita 3 · Tantangan Individu Soal Latihan (Analisis C4)',
    usedIn: 'Tantangan Individu – Soal Latihan',
    coverImage: '/src/assets/images/cover_cerita_lentera_1794751246771.jpg',
    panels: [
      {
        id: 'c3-p1',
        order: 1,
        sceneKey: 'c3-p1',
        caption: 'Sore Mendung Menjelang Piket Ronda',
        narrative:
          'Pukul 17.45 sore di Kampung Melati, langit mendung pekat. Dimas sedang asyik bermain gim di teras rumah ketika Ayah memintanya mengantar jas hujan dan lentera cadangan ke Pos Ronda karena Ayah harus berjaga lebih awal.',
        visualClues: [
          'Awan gelap bergelayut di langit sore menjelang malam',
          'Dimas tampak enggan meletakkan alat permainannya',
          'Ayah menyerahkan jas hujan kuning dan lentera minyak',
        ],
      },
      {
        id: 'c3-p2',
        order: 2,
        sceneKey: 'c3-p2',
        caption: 'Hujan Deras dan Listrik Padam',
        narrative:
          'Baru setengah perjalanan, hujan turun sangat deras disertai angin kencang. Tiba-tiba lampu jalan di seluruh Kampung Melati padam. Air parit di dekat jembatan kayu kecil mulai meluap menggenangi jalan setapak.',
        visualClues: [
          'Lampu tiang jalan padam sehingga suasana menjadi gelap',
          'Air parit meluap menutupi tepi jembatan kayu',
          'Dimas memakai jas hujan kuning dan menyalakan lentera',
        ],
      },
      {
        id: 'c3-p3',
        order: 3,
        sceneKey: 'c3-p3',
        caption: 'Langkah Hati-Hati Menuju Pos Ronda',
        narrative:
          'Jalan setapak menjadi licin dan gelap. Dimas hampir terpeleset di batu berlumut hingga pergelangan kakinya terasa agak nyeri. Namun ia tetap melangkah hati-hati sambil mengangkat lentera agar ayah dan petugas ronda tidak menunggu dalam gelap.',
        visualClues: [
          'Dimas meringis memegang kakinya sebentar di jalan becek',
          'Cahaya lentera menerangi jalan setapak yang gelap',
        ],
      },
      {
        id: 'c3-p4',
        order: 4,
        sceneKey: 'c3-p4',
        caption: 'Suara Tongkat di Tepi Jembatan',
        narrative:
          'Saat mendekati jembatan kayu kecil, Dimas mendengar suara ketukan tongkat dan helaan napas cemas. Di bawah pohon bambu, Nenek Sari berdiri kebingungan karena senter kecilnya kehabisan baterai dan tidak berani menyeberangi jembatan yang tergenang.',
        visualClues: [
          'Nenek Sari memegang tongkat kayu dan senter yang mati',
          'Genangan air terlihat jelas di dekat papan jembatan',
          'Wajah Nenek Sari tampak cemas di tengah hujan',
        ],
      },
      {
        id: 'c3-p5',
        order: 5,
        sceneKey: 'c3-p5',
        caption: 'Menuntun dengan Cahaya Lentera',
        narrative:
          'Meski kakinya masih terasa ngilu dan bajunya mulai basah, Dimas segera memayungi Nenek Sari dan mengangkat lentera tinggi-tinggi. Dengan sabar ia menuntun langkah Nenek Sari melewati jembatan kecil menuju Pos Ronda yang lebih tinggi dan aman.',
        visualClues: [
          'Dimas berbagi payung dan menuntun tangan Nenek Sari perlahan',
          'Cahaya lentera terang menerangi pijakan papan jembatan',
        ],
      },
      {
        id: 'c3-p6',
        order: 6,
        sceneKey: 'c3-p6',
        caption: 'Kehangatan di Pos Ronda Kampung Melati',
        narrative:
          'Setibanya di Pos Ronda, Ayah dan Pak RT Anton segera menyambut mereka dan memberi Nenek Sari teh hangat. Pak RT Anton memuji keberanian dan kepedulian Dimas yang rela menolong warga di tengah gelapnya hujan. Dimas pun merasa bangga bisa berguna bagi kampungnya.',
        visualClues: [
          'Pos Ronda kayu terang benderang diterangi lentera',
          'Pak RT Anton menepuk bahu Dimas dengan bangga',
          'Nenek Sari tersenyum hangat sambil memegang cangkir teh',
        ],
      },
    ],
    intrinsicKey: {
      tokohDanPenokohan:
        'Dimas (awalnya enggan dan lebih mementingkan bermain gim, berkembang menjadi sigap, peduli, berani, dan bertanggung jawab), Nenek Sari (sabar namun cemas saat kesulitan), Pak RT Anton & Ayah (sigap, peduli, apresiatif).',
      latar:
        'Tempat: Jalan setapak Kampung Melati, jembatan kayu kecil di dekat parit, dan Pos Ronda. Waktu: Sore menjelang malam (17.45) hingga malam hari. Suasana: Awalnya santai, berubah gelap dan tegang saat hujan badai dan listrik padam, lalu hangat dan mengharukan di Pos Ronda.',
      konflik:
        'Hujan deras dan pemadaman listrik membuat jalanan gelap serta parit meluap di jembatan kecil, sementara Dimas harus mengantar lentera dan menemukan Nenek Sari yang terjebak kebingungan karena senternya mati.',
      penyelesaian:
        'Dimas menunda rasa lelah dan nyeri kakinya untuk memayungi, menerangi jalan dengan lentera, dan menuntun Nenek Sari melintasi jembatan menuju Pos Ronda yang aman.',
      alur: 'Alur maju: Dimas diminta mengantar perlengkapan ke Pos Ronda -> hujan deras & mati lampu membuat parit meluap -> Dimas hampir terpeleset -> bertemu Nenek Sari yang kebingungan di jembatan (klimaks) -> menuntun Nenek Sari ke Pos Ronda -> mendapat pujian Pak RT.',
      amanat:
        'Kepedulian, keberanian, dan rasa tanggung jawab membantu sesama yang membutuhkan jauh lebih berharga daripada sekadar bersenang-senang untuk diri sendiri.',
    },
  },

  'cerita-4': {
    id: 'cerita-4',
    title: 'Payung Biru untuk Kiko',
    subtitle: 'Cerita 4 · Remedial Scaffolding Bertahap (5 Panel)',
    usedIn: 'Remedial',
    coverImage: '/src/assets/images/cover_cerita_payung_1794751247155.jpg',
    panels: [
      {
        id: 'c4-p1',
        order: 1,
        sceneKey: 'c4-p1',
        caption: 'Bel Pulang dan Awan Kelabu',
        narrative:
          'Pukul 13.00 siang saat bel pulang berbunyi, gerimis mulai turun di halaman sekolah. Rina dan Kiko berjalan menuju halte depan sekolah.',
        visualClues: [
          'Tetesan hujan turun di depan gerbang sekolah',
          'Jam pulang sekolah pukul 13.00',
        ],
      },
      {
        id: 'c4-p2',
        order: 2,
        sceneKey: 'c4-p2',
        caption: 'Kiko Lupa Membawa Payung',
        narrative:
          'Kiko membuka tas hijaunya dan sadar ia lupa membawa payung. Ia khawatir buku tulis di dalam tasnya akan basah terkena hujan.',
        visualClues: [
          'Kiko memeriksa tasnya dengan wajah cemas',
          'Hujan semakin deras di luar atap halte',
        ],
      },
      {
        id: 'c4-p3',
        order: 3,
        sceneKey: 'c4-p3',
        caption: 'Rina Menawarkan Payung Biru',
        narrative:
          'Melihat Kiko bingung, Rina mengeluarkan payung biru besar dari tasnya. Dengan ramah Rina mengajak Kiko memakai payung bersama.',
        visualClues: [
          'Rina membuka payung biru sambil tersenyum',
          'Kiko tampak lega dan berterima kasih',
        ],
      },
      {
        id: 'c4-p4',
        order: 4,
        sceneKey: 'c4-p4',
        caption: 'Berjalan Bersama di Bawah Payung',
        narrative:
          'Mereka berjalan berdampingan melewati trotoar yang basah. Payung biru melindungi keduanya serta tas sekolah mereka dari air hujan.',
        visualClues: [
          'Rina dan Kiko berbagi satu payung biru',
          'Tas buku mereka tetap kering dan aman',
        ],
      },
      {
        id: 'c4-p5',
        order: 5,
        sceneKey: 'c4-p5',
        caption: 'Tiba dengan Aman dan Gembira',
        narrative:
          'Kiko sampai di depan rumahnya dengan selamat dan buku tetap kering. Ia mengucapkan terima kasih kepada Rina dan berjanji akan selalu memeriksa tas sebelum berangkat.',
        visualClues: [
          'Kiko melambaikan tangan dengan gembira',
          'Persahabatan Rina dan Kiko makin erat',
        ],
      },
    ],
    intrinsicKey: {
      tokohDanPenokohan:
        'Rina (penolong, peduli, ramah) dan Kiko (pelupa/kurang teliti, sopan, tahu berterima kasih).',
      latar:
        'Tempat: Halte depan sekolah dan trotoar jalan pulang. Waktu: Siang hari pukul 13.00 sepulang sekolah. Suasana: Hujan gerimis hingga deras, hangat oleh rasa persahabatan.',
      konflik:
        'Kiko lupa membawa payung saat pulang sekolah hujan deras sehingga takut bukunya basah.',
      penyelesaian:
        'Rina meminjamkan dan berbagi payung biru miliknya agar mereka bisa pulang bersama dengan kering.',
      alur: 'Alur maju: Pulang sekolah turun hujan -> Kiko sadar lupa bawa payung -> Rina menawarkan payung biru -> berjalan pulang bersama -> tiba selamat dan berterima kasih.',
      amanat:
        'Menolong teman yang sedang kesulitan membuat persahabatan semakin erat, dan kita harus teliti menyiapkan perlengkapan sekolah.',
    },
  },

  'cerita-5': {
    id: 'cerita-5',
    title: 'Jejak Misterius di Ruang Musik',
    subtitle: 'Cerita 5 · Pengayaan Analisis Mendalam (7 Panel)',
    usedIn: 'Pengayaan',
    coverImage: '/src/assets/images/cover_cerita_angklung_1794751246749.jpg',
    panels: [
      {
        id: 'c5-p1',
        order: 1,
        sceneKey: 'c5-p1',
        caption: 'Persiapan Pentas Seni Hari Jumat',
        narrative:
          'Hari Rabu siang di Ruang Musik SD Harapan, Tari sebagai ketua sanggar mengingatkan seluruh anggota agar menjaga alat musik dengan baik karena Pentas Seni tinggal dua hari lagi.',
        visualClues: [
          'Spanduk bertuliskan Pentas Seni Jumat di papan tulis',
          'Rak angklung bambu berjejer lengkap',
        ],
      },
      {
        id: 'c5-p2',
        order: 2,
        sceneKey: 'c5-p2',
        caption: 'Edo Pulang Paling Akhir',
        narrative:
          'Sore pukul 15.30 setelah anggota lain pulang, Edo melihat tali pengikat angklung nada Do (nada 1) mulai longgar. Karena takut merusak urutan rak jika diletakkan miring, Edo memperbaikinya dengan tali rotan lalu menyimpannya sementara di peti kayu penyimpanan bertanda khusus.',
        visualClues: [
          'Edo mengikat ulang tali bambu yang kendur dengan hati-hati',
          'Edo menempelkan catatan kecil pada peti kayu di sudut ruangan',
        ],
      },
      {
        id: 'c5-p3',
        order: 3,
        sceneKey: 'c5-p3',
        caption: 'Angklung Nada Utama Hilang dari Rak',
        narrative:
          'Kamis siang saat latihan dimulai, Tari terkejut karena angklung nada Do tidak ada di raknya. Latihan mendadak terhenti dan suasana ruang musik menjadi tegang.',
        visualClues: [
          'Slot pertama pada rak angklung tampak kosong',
          'Anggota sanggar berbisik-bisik kebingungan',
        ],
      },
      {
        id: 'c5-p4',
        order: 4,
        sceneKey: 'c5-p4',
        caption: 'Prasangka di Tengah Ketegangan',
        narrative:
          'Mendengar dari penjaga sekolah bahwa Edo pulang paling akhir kemarin, Tari langsung menuduh Edo lalai atau menyembunyikan angklung tersebut. Edo yang pemalu hanya menunduk gugup sehingga terlihat semakin mencurigakan.',
        visualClues: [
          'Tari berbicara dengan nada tegas dan menunjuk ke arah rak kosong',
          'Edo gugup dan belum sempat menjelaskan alasan sebenarnya',
        ],
      },
      {
        id: 'c5-p5',
        order: 5,
        sceneKey: 'c5-p5',
        caption: 'Pengamatan Teliti dari Lani',
        narrative:
          'Lani tidak ikut menuduh. Ia mengamati sekitar ruangan dan melihat secarik kertas bertuliskan "Sedang diperbaiki - jangan tertindih" tertempel rapi di atas peti kayu dekat jendela.',
        visualClues: [
          'Lani menunjuk label catatan di atas peti kayu',
          'Pak Bimo memperhatikan temuan Lani dengan saksama',
        ],
      },
      {
        id: 'c5-p6',
        order: 6,
        sceneKey: 'c5-p6',
        caption: 'Kebenaran Terungkap dengan Kepala Dingin',
        narrative:
          'Pak Bimo membuka peti kayu dan menemukan angklung nada Do terbungkus kain bersih dalam keadaan utuh serta sudah diperbaiki talinya. Edo akhirnya memberanikan diri menjelaskan niatnya agar angklung tidak patah saat tertindih.',
        visualClues: [
          'Angklung nada Do berada dalam kondisi baik dan tali baru yang kuat',
          'Tari terdiam menyadari kekeliruannya berprasangka buruk',
        ],
      },
      {
        id: 'c5-p7',
        order: 7,
        sceneKey: 'c5-p7',
        caption: 'Harmoni Menjelang Pentas',
        narrative:
          'Tari meminta maaf dengan tulus kepada Edo karena terburu-buru menuduh tanpa bertanya terlebih dahulu. Edo berjanji ke depan akan langsung melapor ke ketua sanggar jika memindahkan alat. Latihan pun kembali berjalan merdu penuh semangat.',
        visualClues: [
          'Tari dan Edo berjabat tangan di depan Pak Bimo dan Lani',
          'Semua siswa memainkan angklung dengan kompak dan gembira',
        ],
      },
    ],
    intrinsicKey: {
      tokohDanPenokohan:
        'Tari (disiplin dan peduli jadwal, namun awalnya emosional & mudah berprasangka, lalu berubah mau mengakui salah dan meminta maaf), Edo (teliti dan peduli alat musik, awalnya pemalu & pasif saat dituduh, lalu berani berbicara jujur), Lani (observatif, tenang, objektif), Pak Bimo (adil, menengahi konflik dengan kepala dingin).',
      latar:
        'Tempat: Ruang Musik SD Harapan. Waktu: Rabu sore hingga Kamis siang menjelang Pentas Seni hari Jumat. Suasana: Semula bersemangat, berubah tegang akibat tuduhan, lalu kembali harmonis.',
      konflik:
        'Konflik utama: Hilangnya angklung nada Do dari rak menjelang pentas seni. Konflik pendukung: Tari menuduh Edo tanpa bukti karena sikap Edo yang gugup dan pulang terakhir, ditambah kurangnya komunikasi dari Edo.',
      penyelesaian:
        'Lani menemukan catatan di peti kayu dan Pak Bimo memediasi pengecekan peti, sehingga ditemukan angklung yang justru sudah diperbaiki Edo. Tari meminta maaf dan Edo belajar berkomunikasi terbuka.',
      alur: 'Alur maju dengan kilas informasi: Persiapan Rabu -> Edo memperbaiki angklung sore hari -> Kamis angklung hilang dari rak -> Tari menuduh Edo -> Lani menemukan label peti -> Pak Bimo membuka peti & Edo menjelaskan -> saling memaafkan & latihan harmonis.',
      amanat:
        'Jangan menilai atau menuduh seseorang hanya dari dugaan tanpa bukti, serta biasakan berkomunikasi terbuka agar tidak terjadi salah paham dalam tim.',
    },
  },
};

export const MATERIAL_QUIZ: MaterialQuizQuestion[] = [
  {
    id: 'mq-1',
    question:
      'Mengapa teks sastra sering disajikan dalam bentuk cerita bergambar untuk pembaca kelas VI?',
    options: [
      'Agar gambar menggantikan seluruh isi cerita sehingga tidak perlu membaca teks',
      'Karena perpaduan teks dan gambar membantu pembaca membayangkan tokoh, latar, dan alur lebih jelas',
      'Karena teks sastra hanya berisi daftar fakta ilmiah tanpa tokoh',
      'Supaya cerita tidak perlu memiliki konflik maupun amanat',
    ],
    correctIndex: 1,
    explanation:
      'Cerita bergambar memadukan teks dan gambar agar saling melengkapi dalam menyampaikan tokoh, latar, konflik, alur, dan amanat.',
  },
  {
    id: 'mq-2',
    question:
      'Jika dalam gambar terlihat jam dinding pukul 06.30, matahari baru terbit, dan seorang anak berseragam rapi berangkat ke sekolah, unsur intrinsik apa yang paling kuat ditunjukkan gambar itu?',
    options: [
      'Amanat cerita',
      'Konflik utama cerita',
      'Latar waktu dan suasana pagi',
      'Penyelesaian masalah',
    ],
    correctIndex: 2,
    explanation:
      'Jam pukul 06.30 dan matahari terbit menunjukkan informasi latar waktu (pagi hari) dan suasana persiapan berangkat sekolah.',
  },
  {
    id: 'mq-3',
    question:
      'Perbedaan antara "tokoh" dan "penokohan" yang paling tepat adalah...',
    options: [
      'Tokoh adalah sifatnya, sedangkan penokohan adalah tempat kejadiannya',
      'Tokoh adalah pelaku dalam cerita, sedangkan penokohan adalah sifat atau watak pelaku tersebut',
      'Tokoh hanya hewan, sedangkan penokohan hanya manusia',
      'Tokoh selalu bersifat baik, sedangkan penokohan selalu jahat',
    ],
    correctIndex: 1,
    explanation:
      'Tokoh merujuk pada siapa pelakunya, sedangkan penokohan menggambarkan sifat/karakter pelaku tersebut (misalnya jujur, sabar, ceroboh).',
  },
  {
    id: 'mq-4',
    question: 'Urutan tahapan alur maju yang benar dalam sebuah cerita adalah...',
    options: [
      'Penyelesaian -> masalah berkembang -> awal cerita -> muncul masalah',
      'Awal cerita -> penyelesaian -> muncul masalah -> masalah berkembang',
      'Awal cerita -> muncul masalah -> masalah berkembang -> penyelesaian',
      'Muncul masalah -> penyelesaian -> awal cerita -> amanat',
    ],
    correctIndex: 2,
    explanation:
      'Alur maju bergerak secara berurutan dari pengenalan awal, muncul masalah, masalah berkembang/klimaks, hingga penyelesaian.',
  },
  {
    id: 'mq-5',
    question:
      'Bagaimana cara seorang detektif cerita menentukan amanat dan sifat tokoh dengan benar?',
    options: [
      'Cukup menebak berdasarkan sampul depan buku saja',
      'Memilih jawaban yang paling panjang tanpa membaca panel cerita',
      'Mengamati bukti tindakan tokoh pada gambar dan keterangan teks secara bersama-sama',
      'Menanyakan langsung kepada teman tanpa membaca cerita',
    ],
    correctIndex: 2,
    explanation:
      'Analisis unsur intrinsik harus selalu didukung bukti nyata dari gambar dan narasi cerita, bukan sekadar menebak.',
  },
];

export const DEMONSTRATION_STEPS: DemonstrationStep[] = [
  {
    unsur: '1. Tokoh dan Penokohan',
    cobaPikirkan:
      'Siapa pelaku utama dalam Cerita 1 "Rahasia Bekal di Bangku Taman", dan bagaimana sifat masing-masing tokoh terlihat dari tindakannya?',
    lihatPetunjuk:
      'Perhatikan Panel 2 dan Panel 3. Lihat perbedaan reaksi antara anak yang kehilangan tas bekal dan temannya yang datang membantu.',
    lihatAnalisis:
      'Tokoh utamanya adalah Beni dan Raka (ditambah Siti sebagai tokoh pendukung). Beni memiliki sifat ceroboh dan mudah panik/terburu-buru menuduh (bukti: meletakkan tas sembarangan lalu menuduh siswa lain di Panel 3), namun ia jujur mau meminta maaf di Panel 6. Raka bersifat tenang, teliti, dan peduli (bukti: mengajak Beni bernapas tenang dan memeriksa label nama di Panel 4).',
  },
  {
    unsur: '2. Latar (Tempat, Waktu, Suasana)',
    cobaPikirkan:
      'Di mana dan kapan peristiwa pada Cerita 1 terjadi? Bagaimana suasana yang tampak di gambar?',
    lihatPetunjuk:
      'Amati tanda papan bertuliskan Taman Bacaan Sekolah, bangku kayu, serta jam di Panel 1.',
    lihatAnalisis:
      'Latar tempat: Taman bacaan di halaman sekolah. Latar waktu: Pagi hari pukul 09.30 saat jam istirahat. Latar suasana: Cerah saat istirahat (Panel 1), berubah cemas dan tegang ketika tas hilang (Panel 2–3), lalu kembali lega dan hangat (Panel 5–6).',
  },
  {
    unsur: '3. Konflik dan Penyelesaian',
    cobaPikirkan:
      'Masalah apa yang memicu ketegangan dalam cerita, dan langkah nyata apa yang menyelesaikannya?',
    lihatPetunjuk:
      'Bandingkan keadaan di Panel 2 (tas tidak ada) dengan tindakan Raka di Panel 4 dan hasil di Panel 5.',
    lihatAnalisis:
      'Konflik: Tas bekal biru milik Beni menghilang dari bangku taman sehingga ia kelaparan dan hampir menuduh teman lain. Penyelesaian: Raka memeriksa label nama pada tas tersisa milik Siti lalu menelusuri rak bawah lemari buku hingga tas bergantungan bintang milik Beni ditemukan.',
  },
  {
    unsur: '4. Alur Cerita',
    cobaPikirkan:
      'Bagaimana urutan kejadian dari awal hingga akhir? Apakah cerita bergerak maju secara runtut?',
    lihatPetunjuk:
      'Ikuti nomor kejadian dari Panel 1 sampai Panel 6: pengenalan, muncul masalah, masalah memuncak, hingga selesai.',
    lihatAnalisis:
      'Cerita menggunakan alur maju: Awal (Beni membaca di bangku pukul 09.30) -> Muncul masalah (tas bekal hilang) -> Masalah berkembang (Beni panik dan hampir menuduh orang) -> Penyelesaian (Raka mengecek bukti label nama dan menemukan tas di rak bawah; Beni meminta maaf).',
  },
  {
    unsur: '5. Amanat',
    cobaPikirkan:
      'Pelajaran berharga apa yang bisa kita terapkan di sekolah setelah melihat pengalaman Beni dan Raka?',
    lihatPetunjuk:
      'Lihat perubahan sikap Beni di Panel 6 setelah masalah terungkap bukan karena pencurian.',
    lihatAnalisis:
      'Amanat: Jangan mudah berprasangka buruk atau menuduh orang lain sebelum memeriksa bukti dan kenyataan dengan teliti serta kepala dingin.',
  },
];

export const LKPD_CAUSE_EFFECT_ITEMS: CauseEffectItem[] = [
  {
    id: 'ce-1',
    penyebab: 'Bagas berlari tergesa-gesa mengejar bola ke pinggir kebun tanpa memperhatikan sekitar.',
    peristiwa: 'Kaki Bagas menyenggol pot cabai nomor tiga milik kelompok Sinta hingga jatuh dan tanahnya tumpah.',
    akibat: 'Sinta bersedih dan cemas karena kebun kelas akan segera dinilai oleh Bu Dewi.',
  },
  {
    id: 'ce-2',
    penyebab: 'Bagas merasa bersalah melihat Sinta hampir menangis menjelang penilaian kebun.',
    peristiwa: 'Bagas memberanikan diri keluar dari balik pohon mangga untuk mengaku jujur dan meminta maaf.',
    akibat: 'Sinta memaafkan Bagas sehingga mereka bisa segera mencari jalan keluar bersama.',
  },
  {
    id: 'ce-3',
    penyebab: 'Bu Dewi memberi arahan tenang agar tanaman segera diselamatkan sebelum bel penilaian.',
    peristiwa: 'Sinta dan Bagas memindahkan bibit ke pot cadangan dan menopang batangnya dengan bilah bambu.',
    akibat: 'Bibit cabai kembali berdiri tegak dan kelompok mereka mendapat pujian atas kejujuran serta kerja samanya.',
  },
];

export const LATIHAN_QUESTIONS: ExerciseQuestion[] = [
  // LEVEL 1: PEMULA (5 soal x 5 poin = 25)
  {
    id: 'q1',
    number: 1,
    level: 'Pemula',
    levelLabel: 'Level 1 · Detektif Pemula (Analisis Dasar)',
    indicator:
      'Menganalisis alasan tindakan tokoh berdasarkan kondisi dan peristiwa dalam cerita.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Berdasarkan Panel 1 dan Panel 3 pada Cerita 3 ("Lentera Hujan di Pos Ronda"), mengapa Dimas tetap melangkah menuju Pos Ronda meskipun hujan turun dan kakinya sempat terasa nyeri?',
    options: [
      'Karena Dimas ingin segera kembali pulang untuk melanjutkan bermain gim',
      'Karena ia sadar ayah dan petugas ronda membutuhkan jas hujan serta lentera di tengah gelapnya hujan',
      'Karena Dimas takut dimarahi Nenek Sari apabila tidak membawa payung',
      'Karena jalan setapak di Kampung Melati sedang ramai dilalui kendaraan',
    ],
    correctIndex: 1,
    hintStages: [
      'Perhatikan tugas yang diberikan Ayah kepada Dimas pada Panel 1 dan narasi di Panel 3.',
      'Di Panel 3 disebutkan alasan Dimas tetap melangkah meski kakinya nyeri: ia memikirkan ayah dan petugas ronda.',
      'Hubungkan kondisi hujan + lampu padam dengan barang yang dibawa Dimas (jas hujan dan lentera).',
      'Pilih opsi yang menjelaskan kepedulian Dimas mengantarkan perlengkapan penting agar ayah dan petugas ronda tidak menunggu dalam gelap.',
    ],
    keyExplanation:
      'Pada Panel 3, Dimas tetap berjalan karena sadar Ayah dan petugas ronda membutuhkan jas hujan dan lentera saat listrik padam.',
  },
  {
    id: 'q2',
    number: 2,
    level: 'Pemula',
    levelLabel: 'Level 1 · Detektif Pemula (Analisis Dasar)',
    indicator:
      'Menganalisis latar waktu dan suasana berdasarkan gambaran peristiwa dalam cerita.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Amati perubahan dari Panel 1 ke Panel 2 pada Cerita 3. Latar waktu dan suasana yang tergambar saat Dimas berada di tengah perjalanan adalah...',
    options: [
      'Pagi hari yang cerah dengan suasana santai dan penuh tawa',
      'Siang hari terik dengan suasana pasar kampung yang ramai',
      'Sore menjelang malam saat hujan deras dan listrik padam sehingga suasana gelap serta tegang',
      'Tengah malam yang tenang dengan langit berbintang terang',
    ],
    correctIndex: 2,
    hintStages: [
      'Periksa keterangan jam di Panel 1 dan warna langit serta kejadian lampu jalan di Panel 2.',
      'Panel 1 menyebut pukul 17.45 sore mendung pekat, dan Panel 2 memperlihatkan hujan deras disertai lampu jalan padam.',
      'Bayangkan perasaan ketika jalan gelap dan air parit meluap—suasananya bukan santai, melainkan tegang.',
      'Jawaban tepat menyebutkan waktu sore menjelang malam, hujan deras, listrik padam, dan suasana gelap/tegang.',
    ],
    keyExplanation:
      'Pukul 17.45 adalah sore menjelang malam; hujan lebat dan pemadaman listrik menciptakan suasana gelap dan menegangkan.',
  },
  {
    id: 'q3',
    number: 3,
    level: 'Pemula',
    levelLabel: 'Level 1 · Detektif Pemula (Analisis Dasar)',
    indicator:
      'Menganalisis konflik utama yang menjadi penyebab munculnya masalah dalam cerita.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Apa konflik utama yang memicu ketegangan terbesar pada peristiwa di dekat jembatan kecil (Panel 2–4)?',
    options: [
      'Dimas kehilangan alat permainan gim miliknya di teras rumah',
      'Hujan deras dan listrik padam membuat jembatan tergenang gelap sementara Nenek Sari kebingungan karena senternya mati',
      'Pak RT Anton melarang warga keluar rumah sebelum pukul delapan malam',
      'Lentera minyak yang dibawa Dimas rusak terkena angin kencang',
    ],
    correctIndex: 1,
    hintStages: [
      'Cari peristiwa yang membuat tokoh mengalami kesulitan besar di tengah jalan.',
      'Lihat Panel 4: ada tokoh lain di tepi jembatan yang tidak bisa menyeberang karena kondisi alam dan alat penerangnya mati.',
      'Masalah utamanya menggabungkan hujan deras, mati lampu, genangan di jembatan, dan senter Nenek Sari yang mati.',
      'Pilih opsi yang menggambarkan situasi Nenek Sari terjebak gelap dan genangan di jembatan saat hujan serta listrik padam.',
    ],
    keyExplanation:
      'Konflik utama muncul saat cuaca buruk dan pemadaman listrik membuat jembatan tergenang gelap, bertepatan dengan senter Nenek Sari yang mati.',
  },
  {
    id: 'q4',
    number: 4,
    level: 'Pemula',
    levelLabel: 'Level 1 · Detektif Pemula (Analisis Dasar)',
    indicator:
      'Menganalisis peristiwa yang menandai awal munculnya konflik dalam alur cerita.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Peristiwa manakah yang menandai awal mulainya masalah dalam perjalanan Dimas?',
    options: [
      'Dimas menerima teh hangat dari Pak RT di Pos Ronda',
      'Hujan deras disertai angin kencang turun dan membuat lampu jalan padam serta air parit meluap',
      'Dimas bermain gim dengan gembira bersama teman-temannya',
      'Nenek Sari mengucapkan terima kasih di dalam Pos Ronda',
    ],
    correctIndex: 1,
    hintStages: [
      'Ingat urutan alur maju: awal cerita (Panel 1) masih tenang, lalu masalah mulai muncul di panel berikutnya.',
      'Perhatikan kejadian pada Panel 2 yang mengubah perjalanan biasa menjadi sulit.',
      'Ketika hujan deras, listrik padam, dan parit meluap, saat itulah rintangan perjalanan Dimas dimulai.',
      'Pilih peristiwa yang terjadi tepat pada Panel 2.',
    ],
    keyExplanation:
      'Awal munculnya konflik terjadi pada Panel 2 ketika hujan deras turun, lampu jalan padam, dan parit mulai meluap.',
  },
  {
    id: 'q5',
    number: 5,
    level: 'Pemula',
    levelLabel: 'Level 1 · Detektif Pemula (Analisis Dasar)',
    indicator:
      'Menganalisis amanat berdasarkan tindakan tokoh dalam menghadapi permasalahan.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Berdasarkan tindakan Dimas menolong Nenek Sari di Panel 5, amanat yang paling sesuai dengan cerita tersebut adalah...',
    options: [
      'Bermain gim di rumah selalu lebih aman daripada membantu orang tua',
      'Sebaiknya kita menghindari jalan kampung saat hujan meskipun ada yang butuh bantuan',
      'Kepedulian dan keberanian menolong sesama yang kesusahan lebih berharga daripada sekadar bersenang-senang sendiri',
      'Setiap warga harus memiliki dua senter agar tidak perlu saling membantu',
    ],
    correctIndex: 2,
    hintStages: [
      'Bandingkan sikap Dimas di Panel 1 (lebih suka main gim) dengan tindakannya di Panel 5 (menolong Nenek Sari).',
      'Apa nilai kebaikan yang membuat Dimas mendapat pujian Pak RT di Panel 6?',
      'Cari pesan moral tentang mendahulukan kepedulian dan menolong sesama dibanding kepentingan bermain sendiri.',
      'Pilih opsi ketiga yang menekankan nilai kepedulian dan keberanian menolong sesama.',
    ],
    keyExplanation:
      'Tindakan Dimas menunjukkan amanat bahwa kepedulian dan keberanian membantu orang lain jauh lebih utama daripada kesenangan pribadi.',
  },

  // LEVEL 2: MENENGAH (5 soal x 5 poin = 25)
  {
    id: 'q6',
    number: 6,
    level: 'Menengah',
    levelLabel: 'Level 2 · Detektif Menengah (Analisis Sebab-Akibat)',
    indicator:
      'Menganalisis hubungan antara tindakan tokoh dengan karakter atau sifat tokoh berdasarkan peristiwa cerita.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Pada Panel 5, Dimas memilih memayungi dan menuntun Nenek Sari perlahan meski kakinya sendiri terasa ngilu dan bajunya basah. Hubungan tindakan tersebut dengan sifat Dimas menunjukkan bahwa ia adalah anak yang...',
    options: [
      'Cepat menyerah karena berhenti berjalan di tengah jembatan',
      'Rela berkorban, empati tinggi, dan bertanggung jawab terhadap keselamatan orang lain',
      'Ceroboh karena tidak membawa dua payung dari rumah',
      'Pemalu karena langsung bersembunyi saat tiba di Pos Ronda',
    ],
    correctIndex: 1,
    hintStages: [
      'Hubungkan dua fakta: kondisi diri Dimas (kaki ngilu, baju basah) dan tindakannya (tetap memayungi & menuntun Nenek Sari).',
      'Orang yang tetap mendahulukan keselamatan orang lain meski dirinya sendiri tidak nyaman menunjukkan sifat apa?',
      'Dalam tokoh & penokohan, sikap mendahulukan kebutuhan orang lain saat susah disebut empati dan rela berkorban.',
      'Pilih opsi yang menggambarkan sifat rela berkorban, empati, dan bertanggung jawab.',
    ],
    keyExplanation:
      'Tetap menolong Nenek Sari melewati jembatan di tengah rasa nyeri dan hujan membuktikan empati tinggi serta sikap rela berkorban Dimas.',
  },
  {
    id: 'q7',
    number: 7,
    level: 'Menengah',
    levelLabel: 'Level 2 · Detektif Menengah (Analisis Sebab-Akibat)',
    indicator:
      'Menganalisis dampak kondisi tokoh terhadap jalannya peristiwa dan penyelesaian konflik.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Apa dampak dari kondisi senter Nenek Sari yang kehabisan baterai terhadap jalannya penyelesaian konflik dalam cerita?',
    options: [
      'Nenek Sari dapat pulang sendiri dengan cepat tanpa perlu bantuan siapa pun',
      'Lentera yang dibawa Dimas menjadi penentu utama agar Nenek Sari bisa melihat pijakan jembatan menuju tempat aman',
      'Pos Ronda menjadi gelap gulita sepanjang malam tanpa penerangan',
      'Ayah Dimas memutuskan menutup jalan jembatan hingga pagi hari',
    ],
    correctIndex: 1,
    hintStages: [
      'Bayangkan jika senter Nenek Sari tidak mati, apakah ia membutuhkan cahaya lentera Dimas?',
      'Gabungkan informasi Panel 4 (senter Nenek Sari mati) dengan Panel 5 (Dimas mengangkat lentera menerangi papan jembatan).',
      'Kondisi senter yang mati membuat peran lentera Dimas menjadi kunci penyelesaian agar Nenek Sari selamat.',
      'Pilih opsi yang menunjukkan bagaimana lentera Dimas menjadi solusi atas senter Nenek Sari yang mati.',
    ],
    keyExplanation:
      'Karena senter Nenek Sari mati di tengah gelap, lentera yang dibawa Dimas berperan krusial menerangi jembatan menuju Pos Ronda.',
  },
  {
    id: 'q8',
    number: 8,
    level: 'Menengah',
    levelLabel: 'Level 2 · Detektif Menengah (Analisis Sebab-Akibat)',
    indicator:
      'Menganalisis hubungan perubahan kondisi lingkungan dengan peningkatan konflik dalam cerita.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Bagaimana perubahan kondisi lingkungan dari Panel 1 ke Panel 2–4 memengaruhi tingkat kesulitan masalah yang dihadapi tokoh?',
    options: [
      'Hujan reda membuat jalan menjadi kering sehingga masalah langsung berakhir',
      'Kombinasi hujan deras, listrik padam, jalan licin, dan parit meluap memperbesar bahaya saat melintasi jembatan kayu',
      'Angin kencang membantu mengeringkan genangan air di parit Kampung Melati',
      'Lampu jalan yang menyala terang membuat Nenek Sari mudah menemukan jalan',
    ],
    correctIndex: 1,
    hintStages: [
      'Bandingkan kondisi lingkungan di Panel 1 (baru mendung) dengan Panel 2 dan 4.',
      'Sebutkan tiga perubahan alam/lingkungan di Panel 2: hujan deras, lampu padam, air parit meluap ke jalan dan jembatan.',
      'Semua perubahan lingkungan itu membuat perjalanan jauh lebih berbahaya, terutama bagi lansia seperti Nenek Sari.',
      'Pilih opsi yang menjelaskan peningkatan bahaya akibat gabungan hujan deras, gelap, licin, dan luapan air.',
    ],
    keyExplanation:
      'Perubahan cuaca menjadi hujan lebat, listrik padam, jalan licin, dan air meluap memperbesar risiko bahaya di jembatan kayu.',
  },
  {
    id: 'q9',
    number: 9,
    level: 'Menengah',
    levelLabel: 'Level 2 · Detektif Menengah (Analisis Sebab-Akibat)',
    indicator:
      'Menganalisis posisi suatu peristiwa berdasarkan tahapan alur cerita.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Peristiwa "Dimas memayungi dan menuntun Nenek Sari melewati papan jembatan yang tergenang sambil mengangkat lentera" menempati tahapan alur...',
    options: [
      'Pengenalan awal sebelum masalah terjadi',
      'Pemunculan masalah pertama kali',
      'Tahap menuju penyelesaian masalah setelah puncak ketegangan',
      'Penutup cerita setelah konflik selesai sepenuhnya',
    ],
    correctIndex: 2,
    hintStages: [
      'Ingat tahapan alur: Awal -> Muncul Masalah -> Puncak Ketegangan (Klimaks) -> Menuju Penyelesaian -> Penutup.',
      'Puncak ketegangan terjadi di Panel 4 saat Nenek Sari terjebak bingung di tepi jembatan gelap.',
      'Tindakan Dimas di Panel 5 langsung mengatasi masalah tersebut agar mereka sampai di Pos Ronda (Panel 6).',
      'Jadi peristiwa di Panel 5 adalah tahap menuju penyelesaian masalah.',
    ],
    keyExplanation:
      'Tindakan menuntun Nenek Sari pada Panel 5 adalah bagian penyelesaian masalah tepat setelah klimaks di Panel 4.',
  },
  {
    id: 'q10',
    number: 10,
    level: 'Menengah',
    levelLabel: 'Level 2 · Detektif Menengah (Analisis Sebab-Akibat)',
    indicator:
      'Menganalisis hubungan antara sikap tokoh dan alasan munculnya apresiasi dari tokoh lain.',
    questionType: 'Pilihan Ganda',
    weight: 5,
    prompt:
      'Mengapa Pak RT Anton memberikan apresiasi dan pujian kepada Dimas pada Panel 6?',
    options: [
      'Karena Dimas berhasil memenangkan permainan gim sebelum berangkat',
      'Karena Dimas berani menolong Nenek Sari di tengah cuaca buruk dan menjalankan tugas ronda dengan tanggung jawab',
      'Karena Dimas datang paling cepat sambil berlari meninggalkan warga lain',
      'Karena Dimas membawa cangkir teh hangat dari rumahnya sendiri',
    ],
    correctIndex: 1,
    hintStages: [
      'Perhatikan ucapan dan ekspresi Pak RT Anton pada Panel 6.',
      'Hubungkan pujian Pak RT dengan dua hal: tugas mengantar lentera untuk pos ronda dan menolong Nenek Sari.',
      'Apresiasi muncul akibat keberanian, kepedulian, dan tanggung jawab Dimas.',
      'Pilih opsi kedua yang menghubungkan pujian dengan keberanian menolong dan tanggung jawab Dimas.',
    ],
    keyExplanation:
      'Pak RT Anton memuji Dimas karena ketulusannya menolong Nenek Sari di tengah hujan gelap sekaligus memenuhi amanah mengantar perlengkapan ronda.',
  },

  // LEVEL 3: AHLI (5 soal Pilihan Ganda Beralasan x 10 poin = 50)
  {
    id: 'q11',
    number: 11,
    level: 'Ahli',
    levelLabel: 'Level 3 · Detektif Ahli (Analisis Berbasis Alasan & Bukti)',
    indicator:
      'Menganalisis perkembangan karakter tokoh berdasarkan perbandingan perilaku pada beberapa panel cerita serta memberikan bukti pendukung.',
    questionType: 'Pilihan Ganda Beralasan',
    weight: 10,
    prompt:
      'Bagaimana perkembangan karakter Dimas jika membandingkan sikapnya pada Panel 1 dengan sikapnya pada Panel 5–6? Pilih jawaban paling tepat lalu tuliskan bukti panel yang mendukung!',
    options: [
      'Dimas tidak mengalami perubahan sikap karena ia tetap mengeluh sampai di Pos Ronda',
      'Dimas berkembang dari anak yang awalnya enggan karena asyik bermain gim menjadi anak yang peduli, sigap, dan bangga membantu sesama',
      'Dimas berubah menjadi anak yang takut air hujan sehingga menolak melewati jembatan',
      'Dimas menjadi semakin ceroboh karena melupakan tugas yang diberikan ayahnya',
    ],
    correctIndex: 1,
    hintStages: [
      'Bandingkan ekspresi serta tindakan Dimas di Panel 1 dengan tindakan dan perasaannya di Panel 5 serta Panel 6.',
      'Di Panel 1 Dimas enggan meletakkan gim. Di Panel 5 ia memayungi Nenek Sari walau kaki ngilu, lalu di Panel 6 ia merasa bangga berguna bagi warga.',
      'Jelaskan perubahan tersebut dengan menyebut bukti spesifik dari Panel 1 dan Panel 5–6.',
      'Pilih opsi kedua, lalu tulis bukti perubahan dari "enggan bermain gim di Panel 1" menjadi "rela menolong Nenek Sari di Panel 5 dan bangga di Panel 6".',
    ],
    keyExplanation:
      'Dimas mengalami perkembangan karakter positif: semula enggan meninggalkan gim (Panel 1), lalu rela menuntun Nenek Sari meski kakinya nyeri (Panel 5) hingga bangga bisa membantu (Panel 6).',
    evidencePrompt:
      'Tuliskan bukti perubahan sifat Dimas berdasarkan perbandingan Panel 1 dengan Panel 5–6:',
    expectedEvidenceKeywords: ['panel 1', 'gim', 'panel 5', 'nenek', 'menolong', 'peduli', 'bangga'],
  },
  {
    id: 'q12',
    number: 12,
    level: 'Ahli',
    levelLabel: 'Level 3 · Detektif Ahli (Analisis Berbasis Alasan & Bukti)',
    indicator:
      'Menganalisis peristiwa yang menjadi klimaks cerita serta memberikan bukti pendukung.',
    questionType: 'Pilihan Ganda Beralasan',
    weight: 10,
    prompt:
      'Peristiwa manakah yang merupakan klimaks (puncak ketegangan) dalam Cerita 3? Pilih jawaban yang tepat dan jelaskan bukti ketegangannya dari gambar dan teks!',
    options: [
      'Saat Ayah menyerahkan jas hujan kuning kepada Dimas di teras rumah',
      'Saat Nenek Sari berdiri cemas di tepi jembatan tergenang dalam gelap karena senternya mati sementara hujan deras mengguyur',
      'Saat Nenek Sari meminum teh hangat di dalam Pos Ronda bersama warga',
      'Saat Dimas sedang bermain gim sebelum langit mendung',
    ],
    correctIndex: 1,
    hintStages: [
      'Klimaks adalah titik paling menegangkan ketika masalah memuncak dan menuntut keputusan penting tokoh.',
      'Amati Panel 4: di mana posisi Nenek Sari, bagaimana kondisi jembatan, dan apa masalah alat penerangnya?',
      'Gabungkan bukti visual (gelap, air menggenangi jembatan, wajah cemas Nenek Sari) dan bukti teks (senter mati).',
      'Pilih opsi kedua dan sertakan alasan mengapa momen di Panel 4 adalah puncak ketegangan cerita.',
    ],
    keyExplanation:
      'Klimaks terjadi pada Panel 4 saat Dimas menemukan Nenek Sari cemas di jembatan tergenang dalam kondisi gelap dan senter mati.',
    evidencePrompt:
      'Jelaskan alasan dan bukti visual/narasi yang menunjukkan peristiwa itu sebagai klimaks:',
    expectedEvidenceKeywords: ['panel 4', 'jembatan', 'gelap', 'senter', 'mati', 'tergenang', 'cemas'],
  },
  {
    id: 'q13',
    number: 13,
    level: 'Ahli',
    levelLabel: 'Level 3 · Detektif Ahli (Analisis Berbasis Alasan & Bukti)',
    indicator:
      'Menganalisis latar tempat berdasarkan kesesuaian bukti visual dan narasi dalam cerita.',
    questionType: 'Pilihan Ganda Beralasan',
    weight: 10,
    prompt:
      'Berdasarkan kesesuaian bukti visual dan narasi pada Panel 2 hingga Panel 6, rangkaian latar tempat berlangsungnya misi Dimas yang paling akurat adalah...',
    options: [
      'Ruang kelas sekolah, perpustakaan, lalu kantin sekolah',
      'Teras rumah, jalan setapak Kampung Melati di dekat parit dan jembatan kayu kecil, hingga Pos Ronda',
      'Halaman pasar kota, terminal bus, lalu stasiun kereta api',
      'Taman bermain kota, lapangan bola, lalu gedung balai kota',
    ],
    correctIndex: 1,
    hintStages: [
      'Periksa benda-benda fisik yang terlihat di gambar sekaligus nama tempat yang tertulis di narasi.',
      'Di Panel 1 ada teras rumah, Panel 2–4 jalan setapak & jembatan kayu di atas parit kampung, Panel 6 Pos Ronda kayu.',
      'Pastikan kamu menyebutkan bukti visual (jembatan kayu, pohon bambu, bangunan Pos Ronda) dan bukti narasi (Kampung Melati).',
      'Pilih opsi kedua lalu tuliskan bukti visual serta teks dari panel cerita.',
    ],
    keyExplanation:
      'Cerita berlangsung mulai dari teras rumah (Panel 1), jalan setapak & jembatan kayu dekat parit Kampung Melati (Panel 2–5), hingga Pos Ronda (Panel 6).',
    evidencePrompt:
      'Sebutkan bukti gambar dan teks yang membuktikan latar tempat tersebut:',
    expectedEvidenceKeywords: ['teras', 'kampung melati', 'jembatan', 'parit', 'pos ronda', 'jalan'],
  },
  {
    id: 'q14',
    number: 14,
    level: 'Ahli',
    levelLabel: 'Level 3 · Detektif Ahli (Analisis Berbasis Alasan & Bukti)',
    indicator:
      'Menganalisis ketepatan tindakan tokoh dalam menyelesaikan konflik berdasarkan kondisi yang dihadapi serta memberikan alasan pendukung.',
    questionType: 'Pilihan Ganda Beralasan',
    weight: 10,
    prompt:
      'Mengapa keputusan Dimas membawa Nenek Sari menuju Pos Ronda (bukan meninggalkannya untuk mencari orang lain terlebih dahulu) merupakan tindakan penyelesaian konflik yang tepat?',
    options: [
      'Karena Pos Ronda lebih dekat, terang oleh lentera, berada di tempat lebih tinggi yang aman dari luapan air, serta sudah ada Ayah dan Pak RT',
      'Karena rumah Nenek Sari berada di luar kota yang sangat jauh',
      'Karena di Pos Ronda tersedia banyak permainan untuk menghibur Dimas',
      'Karena jembatan kayu tidak boleh dilewati oleh anak sekolah',
    ],
    correctIndex: 0,
    hintStages: [
      'Pikirkan kondisi Nenek Sari (lansia, senter mati, hujan deras, parit meluap) dan kondisi Pos Ronda di Panel 5–6.',
      'Jika Nenek Sari ditinggal sendirian di dekat air yang meluap dalam gelap, bahaya apa yang mengancam?',
      'Di Pos Ronda ada tempat berteduh tinggi, orang dewasa (Ayah & Pak RT), dan lentera sebagai penerang langsung.',
      'Pilih opsi pertama dan jelaskan alasan keselamatan serta keberadaan orang dewasa di Pos Ronda.',
    ],
    keyExplanation:
      'Menuntun langsung ke Pos Ronda adalah solusi paling aman karena Nenek Sari tidak ditinggal di area gelap tergenang dan segera mendapat pertolongan di tempat tinggi dan hangat.',
    evidencePrompt:
      'Tuliskan alasan logismu mengenai ketepatan keputusan Dimas berdasarkan kondisi di cerita:',
    expectedEvidenceKeywords: ['aman', 'tinggi', 'ayah', 'pak rt', 'lentera', 'gelap', 'bahaya', 'banjir', 'luap'],
  },
  {
    id: 'q15',
    number: 15,
    level: 'Ahli',
    levelLabel: 'Level 3 · Detektif Ahli (Analisis Berbasis Alasan & Bukti)',
    indicator:
      'Menganalisis keterkaitan amanat cerita dengan penerapannya dalam kehidupan sehari-hari disertai alasan yang relevan.',
    questionType: 'Pilihan Ganda Beralasan',
    weight: 10,
    prompt:
      'Contoh penerapan nyata amanat Cerita 3 dalam kehidupan siswa kelas VI sehari-hari yang paling relevan adalah...',
    options: [
      'Menunda tugas piket kelas sampai teman lain menyelesaikannya sendiri',
      'Segera menunda waktu bermain gawai ketika melihat orang tua atau tetangga lansia kesulitan membawa barang saat hujan dan membantunya',
      'Menyalakan seluruh lampu rumah saat siang hari agar tidak takut gelap',
      'Selalu membawa konsol gim ke mana pun agar tidak bosan saat membantu orang tua',
    ],
    correctIndex: 1,
    hintStages: [
      'Ingat inti amanat Cerita 3: mendahulukan kepedulian dan tanggung jawab membantu sesama di atas kesenangan bermain sendiri.',
      'Cari contoh situasi kelas VI yang mirip dengan pilihan antara main gawai/gim dan membantu orang di sekitar.',
      'Dalam alasanmu, hubungkan amanat cerita (sikap Dimas meletakkan gim untuk menolong) dengan manfaatnya di kehidupan nyata.',
      'Pilih opsi kedua dan jelaskan alasan keterkaitannya dengan amanat cerita.',
    ],
    keyExplanation:
      'Menghentikan permainan gawai untuk membantu orang tua atau tetangga yang kesulitan mencerminkan langsung teladan sikap peduli dan tanggung jawab Dimas.',
    evidencePrompt:
      'Jelaskan alasan keterkaitan contoh pilihanmu dengan amanat Cerita 3 dalam kehidupan sehari-hari:',
    expectedEvidenceKeywords: ['peduli', 'tanggung jawab', 'menolong', 'bermain', 'dimas', 'sesama'],
  },
];

export const ASSESSMENT_RUBRIC: RubricRow[] = [
  {
    no: 1,
    tingkat: 'Pemula (Analisis Dasar)',
    indikator: 'Menganalisis alasan tindakan tokoh berdasarkan kondisi dan peristiwa dalam cerita.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 1,
    bobot: 5,
  },
  {
    no: 2,
    tingkat: 'Pemula (Analisis Dasar)',
    indikator: 'Menganalisis latar waktu dan suasana berdasarkan gambaran peristiwa dalam cerita.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 2,
    bobot: 5,
  },
  {
    no: 3,
    tingkat: 'Pemula (Analisis Dasar)',
    indikator: 'Menganalisis konflik utama yang menjadi penyebab munculnya masalah dalam cerita.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 3,
    bobot: 5,
  },
  {
    no: 4,
    tingkat: 'Pemula (Analisis Dasar)',
    indikator: 'Menganalisis peristiwa yang menandai awal munculnya konflik dalam alur cerita.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 4,
    bobot: 5,
  },
  {
    no: 5,
    tingkat: 'Pemula (Analisis Dasar)',
    indikator: 'Menganalisis amanat berdasarkan tindakan tokoh dalam menghadapi permasalahan.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 5,
    bobot: 5,
  },
  {
    no: 6,
    tingkat: 'Menengah (Analisis Sebab-Akibat)',
    indikator: 'Menganalisis hubungan antara tindakan tokoh dengan karakter atau sifat tokoh berdasarkan peristiwa cerita.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 1,
    bobot: 5,
  },
  {
    no: 7,
    tingkat: 'Menengah (Analisis Sebab-Akibat)',
    indikator: 'Menganalisis dampak kondisi tokoh terhadap jalannya peristiwa dan penyelesaian konflik.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 2,
    bobot: 5,
  },
  {
    no: 8,
    tingkat: 'Menengah (Analisis Sebab-Akibat)',
    indikator: 'Menganalisis hubungan perubahan kondisi lingkungan dengan peningkatan konflik dalam cerita.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 3,
    bobot: 5,
  },
  {
    no: 9,
    tingkat: 'Menengah (Analisis Sebab-Akibat)',
    indikator: 'Menganalisis posisi suatu peristiwa berdasarkan tahapan alur cerita.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 4,
    bobot: 5,
  },
  {
    no: 10,
    tingkat: 'Menengah (Analisis Sebab-Akibat)',
    indikator: 'Menganalisis hubungan antara sikap tokoh dan alasan munculnya apresiasi dari tokoh lain.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda',
    nomorSoal: 5,
    bobot: 5,
  },
  {
    no: 11,
    tingkat: 'Ahli (Analisis Berbasis Alasan dan Bukti)',
    indikator: 'Menganalisis perkembangan karakter tokoh berdasarkan perbandingan perilaku pada beberapa panel cerita serta memberikan bukti pendukung.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda Beralasan',
    nomorSoal: 1,
    bobot: 10,
  },
  {
    no: 12,
    tingkat: 'Ahli (Analisis Berbasis Alasan dan Bukti)',
    indikator: 'Menganalisis peristiwa yang menjadi klimaks cerita serta memberikan bukti pendukung.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda Beralasan',
    nomorSoal: 2,
    bobot: 10,
  },
  {
    no: 13,
    tingkat: 'Ahli (Analisis Berbasis Alasan dan Bukti)',
    indikator: 'Menganalisis latar tempat berdasarkan kesesuaian bukti visual dan narasi dalam cerita.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda Beralasan',
    nomorSoal: 3,
    bobot: 10,
  },
  {
    no: 14,
    tingkat: 'Ahli (Analisis Berbasis Alasan dan Bukti)',
    indikator: 'Menganalisis ketepatan tindakan tokoh dalam menyelesaikan konflik berdasarkan kondisi yang dihadapi serta memberikan alasan pendukung.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda Beralasan',
    nomorSoal: 4,
    bobot: 10,
  },
  {
    no: 15,
    tingkat: 'Ahli (Analisis Berbasis Alasan dan Bukti)',
    indikator: 'Menganalisis keterkaitan amanat cerita dengan penerapannya dalam kehidupan sehari-hari disertai alasan yang relevan.',
    levelKognitif: 'C4',
    bentukSoal: 'Pilihan Ganda Beralasan',
    nomorSoal: 5,
    bobot: 10,
  },
];

export const ENRICHMENT_CHALLENGES: EnrichmentChallenge[] = [
  {
    id: 'enr-1',
    number: 1,
    aspect: 'Membandingkan Sifat Tokoh',
    prompt:
      'Bandingkan sikap Tari dan Lani ketika mengetahui angklung nada Do tidak ada di rak pada Panel 3–5!',
    type: 'choice',
    options: [
      'Tari bersikap tenang mengamati ruangan, sedangkan Lani langsung menuduh Edo',
      'Tari bereaksi emosional dan cepat berprasangka, sedangkan Lani tetap tenang dan memeriksa bukti di sekitar ruangan',
      'Keduanya memilih diam dan membiarkan latihan dibatalkan',
      'Tari dan Lani sama-sama langsung membuka peti kayu sebelum bertanya',
    ],
    correctIndex: 1,
    sampleAnswer:
      'Tari bereaksi cepat menuduh karena panik menjelang pentas, sedangkan Lani bersikap objektif dan teliti mengamati bukti catatan di ruangan.',
    hint: 'Amati perbedaan tindakan Tari di Panel 4 dan tindakan Lani di Panel 5.',
  },
  {
    id: 'enr-2',
    number: 2,
    aspect: 'Menganalisis Perubahan Sifat Tokoh',
    prompt:
      'Bagaimana perubahan sikap Tari dan Edo dari awal konflik (Panel 4) hingga akhir cerita (Panel 7)?',
    type: 'short-analysis',
    sampleAnswer:
      'Tari berubah dari mudah berprasangka menjadi rendah hati dan mau meminta maaf. Edo berubah dari pemalu/pasif saat dituduh menjadi berani menjelaskan kebenaran dan berkomitmen melapor ke ketua sanggar.',
    hint: 'Perhatikan sikap Tari saat menunjuk Edo di Panel 4 lalu berjabat tangan di Panel 7, serta perubahan keberanian Edo.',
  },
  {
    id: 'enr-3',
    number: 3,
    aspect: 'Menentukan Hubungan Sebab-Akibat',
    prompt:
      'Mengapa Edo tidak langsung mendapat kepercayaan dari Tari saat pertama kali ditanya mengenai angklung yang hilang?',
    type: 'choice',
    options: [
      'Karena penjaga sekolah melihat Edo membawa angklung pulang ke rumah',
      'Karena Edo pulang paling akhir dan tampak gugup saat dituduh sehingga terlihat mencurigakan tanpa penjelasan catatan',
      'Karena Edo adalah anggota baru yang tidak bisa memainkan angklung nada Do',
      'Karena Pak Bimo melarang Edo berbicara di dalam ruang musik',
    ],
    correctIndex: 1,
    sampleAnswer:
      'Informasi bahwa Edo pulang terakhir ditambah sikap Edo yang gugup dan tidak sempat melapor sebelumnya memicu prasangka Tari.',
    hint: 'Gabungkan petunjuk penjaga sekolah dengan ekspresi Edo di Panel 4.',
  },
  {
    id: 'enr-4',
    number: 4,
    aspect: 'Menganalisis Struktur Alur',
    prompt:
      'Pada Panel 2 terdapat informasi kejadian hari Rabu sore setelah latihan selesai, sedangkan Panel 3 terjadi Kamis siang. Bagaimana fungsi Panel 2 dalam alur cerita ini?',
    type: 'choice',
    options: [
      'Menjadi penutup cerita setelah pentas seni selesai',
      'Memberi petunjuk latar belakang penyebab sebenarnya sebelum konflik tuduhan muncul di hari berikutnya',
      'Menunjukkan bahwa cerita sepenuhnya menggunakan alur mundur dari akhir ke awal',
      'Menggantikan peran tokoh utama agar tidak perlu ada penyelesaian',
    ],
    correctIndex: 1,
    sampleAnswer:
      'Panel 2 menyajikan fakta awal secara runtut sebelum konflik muncul di Kamis siang sehingga pembaca mengetahui konteks perbaikan tali rotan.',
    hint: 'Lihat urutan waktu Rabu siang (Panel 1) -> Rabu sore (Panel 2) -> Kamis siang (Panel 3).',
  },
  {
    id: 'enr-5',
    number: 5,
    aspect: 'Konflik Utama & Konflik Pendukung',
    prompt:
      'Manakah pasangan konflik utama dan konflik pendukung yang paling tepat dalam Cerita 5?',
    type: 'choice',
    options: [
      'Konflik utama: Tari lupa jadwal pentas; Konflik pendukung: Lani kehilangan buku partitur',
      'Konflik utama: Angklung nada Do hilang dari rak menjelang pentas; Konflik pendukung: kesalahpahaman dan tuduhan Tari kepada Edo karena kurang komunikasi',
      'Konflik utama: Tali angklung rusak; Konflik pendukung: penjaga sekolah mengunci pintu terlalu cepat',
      'Konflik utama: Pak Bimo terlambat datang; Konflik pendukung: spanduk pentas seni terlepas',
    ],
    correctIndex: 1,
    sampleAnswer:
      'Masalah inti yang mengganggu latihan adalah hilangnya angklung nada utama (Do), yang diperuncing konflik antartokoh berupa prasangka Tari terhadap Edo.',
    hint: 'Bedakan masalah benda/situasi latihan dengan masalah hubungan antar tokohnya.',
  },
  {
    id: 'enr-6',
    number: 6,
    aspect: 'Menemukan Bukti Pendukung Sifat Tokoh',
    prompt:
      'Tuliskan bukti konkret dari gambar/teks yang membuktikan bahwa Edo sebenarnya memiliki sifat peduli dan teliti terhadap alat musik!',
    type: 'short-analysis',
    sampleAnswer:
      'Pada Panel 2, Edo memperbaiki tali pengikat angklung yang longgar memakai tali rotan, membungkusnya dengan kain bersih di peti kayu (Panel 6), serta menempelkan kertas pesan agar tidak tertindih (Panel 5).',
    hint: 'Periksa apa yang dilakukan Edo pada Panel 2, 5, dan 6!',
  },
  {
    id: 'enr-7',
    number: 7,
    aspect: 'Amanat Berdasarkan Keseluruhan Cerita',
    prompt:
      'Amanat menyeluruh yang dapat dipetik baik oleh pemimpin kelompok (seperti Tari) maupun anggota (seperti Edo) adalah...',
    type: 'choice',
    options: [
      'Pemimpin kelompok boleh menuduh siapa saja jika waktu latihan sudah sempit',
      'Anggota kelompok sebaiknya memperbaiki barang rusak secara diam-diam tanpa memberi tahu siapa pun',
      'Dalam kerja tim, hindari berprasangka tanpa bukti dan biasakan komunikasi terbuka agar tidak terjadi salah paham',
      'Alat musik tradisional sebaiknya tidak disimpan di ruang musik sekolah',
    ],
    correctIndex: 2,
    sampleAnswer:
      'Kerja tim membutuhkan keterbukaan informasi (Edo melapor saat memindahkan alat) dan sikap adil memeriksa bukti sebelum menuduh (pelajaran bagi Tari).',
    hint: 'Gabungkan pelajaran yang dipetik Tari dan janji Edo di Panel 7.',
  },
  {
    id: 'enr-8',
    number: 8,
    aspect: 'Hubungan Gambar dan Teks',
    prompt:
      'Jelaskan bagaimana detail gambar "kertas catatan di atas peti kayu" (Panel 5) bekerja sama dengan teks narasi untuk menyelesaikan misteri ruang musik!',
    type: 'short-analysis',
    sampleAnswer:
      'Gambar menunjukkan posisi peti kayu di sudut ruang dan kertas pesan yang ditempel rapi, sedangkan teks menjelaskan isi tulisan "Sedang diperbaiki - jangan tertindih" sehingga Pak Bimo tahu di mana angklung disimpan dengan aman.',
    hint: 'Jelaskan apa yang terlihat di gambar Panel 5 dan informasi apa yang ditambahkan oleh teks narasinya.',
  },
];

export const REFLECTION_PROMPTS: string[] = [
  '1. Apa yang saya pelajari hari ini tentang teks sastra dan cerita bergambar?',
  '2. Unsur intrinsik apa yang paling mudah saya temukan?',
  '3. Unsur intrinsik apa yang masih sulit saya analisis?',
  '4. Bagaimana saya menentukan jawaban berdasarkan informasi dalam cerita?',
  '5. Bagaimana pengalaman saya bekerja sama dengan kelompok?',
  '6. Apa yang akan saya lakukan agar lebih percaya diri dalam menyampaikan hasil analisis?',
];

export const AFFECTIVE_RUBRIC: RubricSectionSpec = {
  id: 'a5',
  title: '2. Rubrik Sikap Afektif A5 – Percaya Diri & Santun',
  items: [
    {
      level: 'Sangat Baik',
      skor: 4,
      deskripsi:
        'Berani berbicara tanpa ragu, artikulasi jelas, dan menanggapi teman dengan santun.',
    },
    {
      level: 'Baik',
      skor: 3,
      deskripsi:
        'Percaya diri saat membaca catatan dan santun mendengarkan rekan lain.',
    },
    {
      level: 'Cukup',
      skor: 2,
      deskripsi:
        'Sesekali ragu namun tetap menyelesaikan presentasi kelompok.',
    },
  ],
};

export const PSYCHOMOTOR_RUBRIC: RubricSectionSpec = {
  id: 'p4',
  title: '3. Rubrik Psikomotorik P4 – Rekonstruksi Alur Runtut',
  items: [
    {
      level: 'Sangat Tepat',
      skor: 4,
      deskripsi:
        'Seluruh 6 panel gambar acak tersusun sesuai kaidah alur kronologis 100%.',
    },
    {
      level: 'Tepat',
      skor: 3,
      deskripsi:
        '4–5 panel tersusun benar dengan penjelasan hubungan sebab-akibat.',
    },
    {
      level: 'Perlu Bimbingan',
      skor: 2,
      deskripsi:
        'Kurang dari 4 panel, diarahkan ke penguatan alur di Remedial.',
    },
  ],
};


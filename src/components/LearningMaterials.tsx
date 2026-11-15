import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Eye,
  HelpCircle,
  Home,
  Lightbulb,
  Search,
} from 'lucide-react';
import {
  DEMONSTRATION_STEPS,
  MATERIAL_QUIZ,
  STORIES,
} from '../data/stories';
import { ClassRoom, MenuSectionId, StudentProgressState } from '../types';
import { StoryViewer } from './StoryViewer';
import { TutorContext } from './AiTutorDrawer';
import { useRealtimeDate } from '../hooks/useRealtimeDate';
import { soundManager } from '../utils/soundEffects';

interface LearningMaterialsProps {
  section: MenuSectionId;
  progress: StudentProgressState;
  onUpdateStudentIdentity: (name: string, className: ClassRoom) => void;
  onNavigate: (target: MenuSectionId) => void;
  onCompleteMaterialQuiz: (score: number, total: number) => void;
  onCompleteDemo: () => void;
  onOpenTutor: (ctx: TutorContext) => void;
}

const OBSERVATION_PROMPTS = [
  {
    q: 'Siapa yang terlihat pada gambar?',
    a: 'Kita mengamati jumlah pelaku, pakaian, ekspresi wajah, dan peran tokoh dalam adegan.',
  },
  {
    q: 'Di mana peristiwa terjadi?',
    a: 'Benda latar seperti bangku taman, papan tulis, jembatan, atau ruang musik memberi petunjuk tempat.',
  },
  {
    q: 'Apa yang sedang dilakukan tokoh?',
    a: 'Gerakan tangan dan arah pandangan tokoh menunjukkan tindakan sekaligus sifatnya.',
  },
  {
    q: 'Apa yang terjadi?',
    a: 'Urutan adegan dari satu panel ke panel berikutnya membentuk rangkaian peristiwa.',
  },
  {
    q: 'Apa masalah yang muncul?',
    a: 'Wajah cemas, benda yang hilang/jatuh, atau suasana gelap menandai konflik cerita.',
  },
  {
    q: 'Bagaimana masalah tersebut diselesaikan?',
    a: 'Tindakan kerja sama, kejujuran, atau pertolongan pada panel akhir menunjukkan penyelesaian.',
  },
  {
    q: 'Apa yang dapat dipelajari dari cerita?',
    a: 'Dari akibat tindakan baik atau keliru tokoh, kita menemukan amanat cerita.',
  },
];

const FooterNav: React.FC<{
  backTarget?: MenuSectionId;
  nextTarget?: MenuSectionId;
  nextLabel?: string;
  onNavigate: (t: MenuSectionId) => void;
}> = ({ backTarget, nextTarget, nextLabel = 'Lanjut', onNavigate }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-8 border-t border-slate-200">
    <div className="flex items-center gap-2">
      {backTarget && (
        <button
          type="button"
          onClick={() => onNavigate(backTarget)}
          className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
      )}
      <button
        type="button"
        onClick={() => onNavigate('menu-utama')}
        className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap shrink-0"
      >
        <Home className="w-4 h-4" />
        Menu Utama
      </button>
    </div>
    {nextTarget && (
      <button
        type="button"
        onClick={() => onNavigate(nextTarget)}
        className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-2 whitespace-nowrap shrink-0"
      >
        {nextLabel}
        <ArrowRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

export const LearningMaterials: React.FC<LearningMaterialsProps> = ({
  section,
  progress,
  onUpdateStudentIdentity,
  onNavigate,
  onCompleteMaterialQuiz,
  onCompleteDemo,
  onOpenTutor,
}) => {
  const realtimeDate = useRealtimeDate();
  const [selectedObs, setSelectedObs] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [demoRevealed, setDemoRevealed] = useState<
    Record<number, { hint: boolean; analysis: boolean }>
  >({});

  // 1. PETUNJUK PENGGUNAAN APLIKASI
  if (section === 'petunjuk') {
    const instructions = [
      'Klik tombol Mulai untuk memulai petualangan belajar.',
      'Gunakan tombol Lanjut untuk berpindah ke halaman materi atau misi berikutnya.',
      'Gunakan tombol Kembali untuk melihat atau meninjau halaman sebelumnya.',
      'Bacalah teks materi dan amati setiap gambar/panel cerita dengan teliti.',
      'Pada aktivitas tertentu, pilih jawaban, seret gambar (drag and drop), atau susun urutan peristiwa cerita.',
      'Gunakan tombol Petunjuk/Hint atau Teman Detektif jika mengalami kesulitan. Bantuan diberikan secara bertahap dan tidak langsung memberi jawaban.',
      'Kerjakan Misi Kelompok – LKPD secara berkelompok sesuai identitas kelompok (maksimal 6 anggota) yang telah diisi.',
      'Kerjakan Soal Latihan Individu, Remedial, dan Pengayaan secara mandiri dan jujur.',
      'Perhatikan halaman Hasil dan Progres Belajar setelah menyelesaikan aktivitas untuk melihat ketuntasanmu.',
      'Gunakan bahasa Indonesia yang sopan saat berdiskusi, berpendapat, dan mempresentasikan hasil kelompok.',
    ];

    return (
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-medium text-sky-700 mb-1">
          Panduan Detektif Cerita · Kelas VI SD
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Petunjuk Penggunaan Aplikasi
        </h2>
        <p className="text-slate-600 text-base mb-6">
          Bacalah langkah-langkah berikut agar petualanganmu menganalisis cerita bergambar berjalan lancar.
        </p>

        <ol className="space-y-3">
          {instructions.map((text, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60"
            >
              <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-mono text-xs font-semibold flex items-center justify-center shrink-0 tabular-nums">
                {idx + 1}
              </span>
              <p className="text-sm md:text-base text-slate-800 leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>

        <FooterNav
          nextTarget="mulai-petualangan"
          nextLabel="Mulai Petualangan"
          onNavigate={onNavigate}
        />
      </section>
    );
  }

  // 2. MULAI PETUALANGAN
  if (section === 'mulai-petualangan') {
    return (
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-medium text-sky-700 mb-1">
          Misi Pembuka · Problem Based Learning (PBL)
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Mulai Petualangan Detektif Cerita
        </h2>
        <p className="text-slate-600 text-base mb-6">
          Selamat datang, Detektif Muda Kelas VI! Hari ini kamu akan memecahkan misteri di balik lima cerita bergambar yang berbeda dengan mengamati gambar dan teks secara teliti.
        </p>

        {/* Identity Box */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 mb-8">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Kartu Identitas Detektif Cerita
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="detective-name"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Nama Lengkap Peserta Didik
              </label>
              <input
                id="detective-name"
                type="text"
                value={progress.studentName}
                onChange={(e) =>
                  onUpdateStudentIdentity(e.target.value, progress.studentClass)
                }
                placeholder="Contoh: Aisyah Putri"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kelas
              </span>
              <div className="flex items-center gap-2">
                {(['6A', '6B'] as ClassRoom[]).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => onUpdateStudentIdentity(progress.studentName, cls)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${
                      progress.studentClass === cls
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Kelas {cls}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hari / Tanggal (Realtime)
              </span>
              <div className="px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 font-mono tabular-nums truncate">
                {realtimeDate.fullLabel}
              </div>
            </div>
          </div>
        </div>

        {/* PBL Roadmap */}
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Alur Petualangan Belajar Kita
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              step: '01',
              title: 'Memahami Dasar Cerita',
              desc: 'Mengenal tujuan belajar, teks sastra, cerita bergambar, dan 5 unsur intrinsik.',
            },
            {
              step: '02',
              title: 'Belajar Lewat Contoh (Cerita 1)',
              desc: 'Mengamati demonstrasi analisis bertahap berbasis bukti cerita.',
            },
            {
              step: '03',
              title: 'Misi Kelompok LKPD (Cerita 2)',
              desc: 'Menyusun 6 panel acak, mengisi tabel unsur, sebab-akibat, dan menyiapkan presentasi.',
            },
            {
              step: '04',
              title: 'Tantangan Individu & Tindak Lanjut',
              desc: 'Mengerjakan soal C4 berjenjang (Cerita 3), lalu Remedial (Cerita 4) atau Pengayaan (Cerita 5).',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-4"
            >
              <span className="font-mono text-sm font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md shrink-0 tabular-nums">
                {item.step}
              </span>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <FooterNav
          backTarget="petunjuk"
          nextTarget="tujuan"
          nextLabel="Lihat Tujuan Pembelajaran"
          onNavigate={onNavigate}
        />
      </section>
    );
  }

  // 3. TUJUAN PEMBELAJARAN
  if (section === 'tujuan') {
    return (
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-medium text-sky-700 mb-1">
          Fase C · Kelas VI SD · Elemen Membaca dan Memirsa
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Tujuan Pembelajaran
        </h2>
        <p className="text-slate-600 text-base mb-6">
          Melalui model <strong>Problem Based Learning (PBL)</strong> dan pendekatan{' '}
          <strong>Deep Learning</strong>, setelah menyelesaikan petualangan ini kamu diharapkan mampu:
        </p>

        <div className="space-y-4">
          {[
            {
              code: 'TP 1 · Level Kognitif C4 (Menganalisis)',
              title:
                'Menganalisis unsur-unsur intrinsik pada teks sastra bergambar atau cerita bergambar dengan benar.',
              detail:
                'Dilatihkan melalui Contoh Analisis (Cerita 1), Misi LKPD Kelompok (Cerita 2), Soal Latihan Berjenjang (Cerita 3), dan Pengayaan (Cerita 5).',
            },
            {
              code: 'TP 2 · Level Afektif A5 (Menyatakan / Mengamalkan)',
              title:
                'Menyatakan unsur-unsur intrinsik pada teks sastra bergambar atau cerita bergambar secara percaya diri.',
              detail:
                'Dilatihkan melalui diskusi kelompok LKPD, persiapan presentasi, penyampaian hasil analisis, menanggapi teman dengan sopan, serta refleksi belajar.',
            },
            {
              code: 'TP 3 · Level Psikomotorik P4 (Merangkaikan)',
              title:
                'Merangkaikan gambar berdasarkan unsur-unsur intrinsik pada teks sastra bergambar atau cerita bergambar dengan benar.',
              detail:
                'Dilatihkan melalui aktivitas drag and drop menyusun 6 panel acak pada LKPD (Cerita 2) dan menyusun peristiwa pada Remedial (Cerita 4).',
            },
          ].map((tp) => (
            <div
              key={tp.code}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/70"
            >
              <p className="text-xs font-mono font-semibold text-sky-700 mb-1">
                {tp.code}
              </p>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                {tp.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{tp.detail}</p>
            </div>
          ))}
        </div>

        <FooterNav
          backTarget="mulai-petualangan"
          nextTarget="kenali-sastra"
          nextLabel="Mulai Materi: Kenali Teks Sastra"
          onNavigate={onNavigate}
        />
      </section>
    );
  }

  // 4. KENALI TEKS SASTRA
  if (section === 'kenali-sastra') {
    return (
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-medium text-sky-700 mb-1">
          Materi 1 · Fondasi Membaca dan Memirsa
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Kenali Teks Sastra
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-6">
          <div className="md:col-span-7 space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Apa itu Teks Sastra?
              </h3>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                <strong>Teks sastra</strong> adalah karangan atau tulisan indah yang berisi kisah rekaan maupun pengalaman bermakna. Di dalamnya selalu ada <strong>tokoh</strong> yang mengalami <strong>peristiwa</strong>, menghadapi masalah, lalu memberi <strong>pesan kebaikan</strong> bagi pembacanya.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                Tujuan dan Fungsi Teks Sastra
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                <li>
                  <strong>Menghibur dan menumbuhkan imajinasi:</strong> membuat kita seolah ikut bertualang bersama tokoh cerita.
                </li>
                <li>
                  <strong>Menyampaikan pesan moral:</strong> mengajarkan kejujuran, kerja sama, empati, dan tanggung jawab.
                </li>
                <li>
                  <strong>Melatih kepekaan berpikir:</strong> membantu kita memahami perasaan orang lain dan sebab-akibat peristiwa.
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src="/src/assets/images/hero_detektif_cerita_1794751245119.jpg"
                alt="Ilustrasi meja detektif cerita dan buku sastra bergambar"
                referrerPolicy="no-referrer"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <p className="text-xs font-semibold text-slate-900 mb-1">
                  Contoh Teks Sastra Dekat dengan Kita
                </p>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Cerita pendek anak (cerpen) di majalah dinding sekolah.</li>
                  <li>Fabel atau dongeng Nusantara yang penuh pesan bijak.</li>
                  <li>Komik edukatif dan cerita bergambar di perpustakaan sekolah.</li>
                  <li>Puisi atau pantun jenaka yang sering dibacakan saat pentas kelas.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <FooterNav
          backTarget="tujuan"
          nextTarget="cerita-bergambar"
          nextLabel="Lanjut: Pelajari Cerita Bergambar"
          onNavigate={onNavigate}
        />
      </section>
    );
  }

  // 5. PELAJARI CERITA BERGAMBAR
  if (section === 'cerita-bergambar') {
    const features = [
      'Memiliki rangkaian peristiwa yang berurutan.',
      'Memiliki tokoh dan penokohan (sifat pelaku cerita).',
      'Memiliki latar (tempat, waktu, dan suasana).',
      'Memiliki konflik (masalah) dan penyelesaian.',
      'Memiliki alur cerita yang runtut.',
      'Memiliki amanat atau pesan kebaikan.',
      'Memadukan teks narasi/dialog dan gambar panel.',
      'Gambar dan teks saling mendukung untuk memahami makna cerita.',
    ];

    return (
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-medium text-sky-700 mb-1">
          Materi 2 · Memadukan Teks dan Visual
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Pelajari Cerita Bergambar
        </h2>

        <div className="p-5 rounded-xl border border-slate-200 bg-sky-50/50 mb-6">
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Pengertian Cerita Bergambar
          </h3>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            <strong>Cerita bergambar</strong> adalah teks sastra yang memadukan{' '}
            <strong>teks tulisan dan gambar</strong> untuk menyampaikan rangkaian peristiwa. Gambar membantu kita melihat wujud tokoh, tempat, suasana, dan ekspresi secara nyata, sedangkan teks memberikan informasi pelengkap seperti waktu kejadian, pikiran tokoh, dan dialog.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Ciri-Ciri Cerita Bergambar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-white"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-800">{feat}</span>
            </div>
          ))}
        </div>

        {/* Bagaimana Gambar dan Teks Bekerja Sama */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Bagaimana Gambar dan Teks Bekerja Sama?
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Klik 7 pertanyaan pengamatan detektif di bawah ini untuk mengetahui bagaimana gambar dan teks saling melengkapi!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            <div className="md:col-span-6 space-y-2">
              {OBSERVATION_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedObs(idx)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-between gap-2 ${
                    selectedObs === idx
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>
                    {idx + 1}. {item.q}
                  </span>
                  <Search className="w-4 h-4 shrink-0 opacity-80" />
                </button>
              ))}
            </div>

            <div className="md:col-span-6 p-5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="rounded-lg overflow-hidden border border-slate-200 mb-4 bg-white">
                <img
                  src="/src/assets/images/cover_cerita_bekal_1794751245863.jpg"
                  alt="Ilustrasi contoh kerja sama gambar dan teks"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
              </div>
              <p className="text-xs font-mono font-semibold text-sky-700 mb-1">
                Fokus Pengamatan {selectedObs + 1}
              </p>
              <h4 className="font-semibold text-slate-900 text-base mb-2">
                {OBSERVATION_PROMPTS[selectedObs].q}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {OBSERVATION_PROMPTS[selectedObs].a}
              </p>
            </div>
          </div>
        </div>

        <FooterNav
          backTarget="kenali-sastra"
          nextTarget="unsur-intrinsik"
          nextLabel="Lanjut: Kenali Unsur Intrinsik"
          onNavigate={onNavigate}
        />
      </section>
    );
  }

  // 6. KENALI UNSUR INTRINSIK + PETA KONSEP + KUIS PEMAHAMAN 5 SOAL
  if (section === 'unsur-intrinsik') {
    const correctCount = MATERIAL_QUIZ.filter(
      (q) => quizAnswers[q.id] === q.correctIndex
    ).length;

    const handleSubmitQuiz = () => {
      setQuizSubmitted(true);
      onCompleteMaterialQuiz(correctCount, MATERIAL_QUIZ.length);
      if (correctCount >= Math.ceil(MATERIAL_QUIZ.length * 0.8)) {
        soundManager.playSuccess();
      } else {
        soundManager.playTryAgain();
      }
    };

    return (
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
          <p className="text-xs font-medium text-sky-700 mb-1">
            Materi 3 · Peta Unsur Intrinsik & Kuis Pemahaman
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Kenali Unsur-Unsur Intrinsik
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                a. Tokoh dan Penokohan
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Tokoh</strong> adalah pelaku dalam cerita.{' '}
                <strong>Penokohan</strong> adalah sifat atau karakter tokoh. Contoh sifat: baik, jujur, bertanggung jawab, ceroboh, sabar, dan peduli.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                b. Latar (Tempat, Waktu, Suasana)
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Menunjukkan <strong>di mana</strong> peristiwa terjadi (tempat),{' '}
                <strong>kapan</strong> terjadinya (waktu), serta{' '}
                <strong>bagaimana perasaan/keadaan</strong> peristiwa (suasana, misalnya tegang, ceria, atau haru).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                c. Konflik dan Penyelesaian
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Konflik</strong> adalah masalah atau pertentangan yang dialami tokoh. <strong>Penyelesaian</strong> adalah cara masalah tersebut diatasi hingga cerita berakhir.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900 text-base mb-1.5">
                e. Amanat
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Amanat</strong> adalah pesan kebaikan atau pelajaran berharga yang dapat diambil dan diterapkan pembaca dalam kehidupan sehari-hari.
              </p>
            </div>
          </div>

          {/* Alur Maju Diagram */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white mb-8">
            <h3 className="font-semibold text-slate-900 text-base mb-2">
              d. Alur (Urutan Peristiwa Cerita) — Contoh Alur Maju
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
              {[
                { no: '1', label: 'Awal Cerita', desc: 'Pengenalan tokoh dan latar' },
                { no: '2', label: 'Muncul Masalah', desc: 'Awal terjadinya konflik' },
                { no: '3', label: 'Masalah Berkembang', desc: 'Konflik memuncak (klimaks)' },
                { no: '4', label: 'Penyelesaian', desc: 'Masalah teratasi dengan jelas' },
              ].map((step) => (
                <div
                  key={step.no}
                  className="p-3.5 rounded-lg border border-sky-200 bg-sky-50/60"
                >
                  <p className="text-xs font-mono font-semibold text-sky-700 mb-0.5">
                    Tahap {step.no}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                  <p className="text-xs text-slate-600 mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Peta Konsep */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-900 text-white">
            <p className="text-xs font-mono text-sky-300 mb-2">Peta Konsep Materi</p>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="px-5 py-2.5 rounded-lg bg-sky-600 font-semibold text-sm">
                Cerita Bergambar
              </div>
              <div className="text-xs text-slate-300">↓ memiliki</div>
              <div className="px-5 py-2 rounded-lg bg-slate-800 border border-slate-700 font-semibold text-sm">
                Unsur Intrinsik
              </div>
              <div className="text-xs text-slate-300">↓ terdiri atas</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
                {[
                  'Tokoh & Penokohan',
                  'Latar',
                  'Konflik & Penyelesaian',
                  'Alur',
                  'Amanat',
                ].map((el) => (
                  <div
                    key={el}
                    className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-100"
                  >
                    {el}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kuis Pemahaman Materi (5 Soal) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-medium text-amber-700 mb-0.5">
                Cek Pemahaman Materi (Bukan Penilaian Utama C4)
              </p>
              <h3 className="text-xl font-bold text-slate-900">
                Kuis Pemahaman Materi (5 Pertanyaan Singkat)
              </h3>
            </div>
            <button
              type="button"
              onClick={() =>
                onOpenTutor({
                  title: 'Kuis Pemahaman Materi',
                  storyContext:
                    'Materi dasar tentang Teks Sastra, Cerita Bergambar, dan 5 Unsur Intrinsik.',
                  questionText:
                    'Membantu memahami tokoh, penokohan, latar, alur maju, konflik, dan amanat.',
                })
              }
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-4 h-4" />
              Petunjuk / Teman Detektif
            </button>
          </div>

          <div className="space-y-5">
            {MATERIAL_QUIZ.map((q, qIdx) => {
              const chosen = quizAnswers[q.id];
              const isCorrect = chosen === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                          chosen === oIdx
                            ? 'bg-sky-50 border-sky-400 text-slate-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={chosen === oIdx}
                          onChange={() => {
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }));
                            if (quizSubmitted) setQuizSubmitted(false);
                          }}
                          className="mt-1 accent-sky-600"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <div
                      className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <strong>{isCorrect ? 'Benar!' : 'Perlu dicek lagi:'}</strong>{' '}
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              disabled={Object.keys(quizAnswers).length < MATERIAL_QUIZ.length}
              onClick={handleSubmitQuiz}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              Cek Jawaban Kuis
            </button>

            {quizSubmitted && (
              <p className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
                Hasil Pemahaman: {correctCount} / {MATERIAL_QUIZ.length} benar (
                {Math.round((correctCount / MATERIAL_QUIZ.length) * 100)}%)
              </p>
            )}
          </div>

          <FooterNav
            backTarget="cerita-bergambar"
            nextTarget="contoh-demonstrasi"
            nextLabel="Lanjut: Contoh & Demonstrasi (Cerita 1)"
            onNavigate={onNavigate}
          />
        </div>
      </section>
    );
  }

  // 7. CONTOH DAN DEMONSTRASI (CERITA 1)
  const story1 = STORIES['cerita-1'];
  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-sky-700 mb-1">
              Contoh dan Demonstrasi · Cerita 1 (Berbeda dari Misi & Latihan)
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {story1.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenTutor({
                title: 'Demonstrasi Cerita 1',
                storyContext: story1.panels
                  .map((p) => `Panel ${p.order}: ${p.narrative}`)
                  .join('\n'),
                questionText:
                  'Membantu siswa berlatih mengamati bukti cerita pada Rahasia Bekal di Bangku Taman.',
              })
            }
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Compass className="w-4 h-4" />
            Tanya Teman Detektif
          </button>
        </div>
        <p className="text-sm md:text-base text-slate-600 mb-6">
          Amati 6 panel cerita berikut ini dengan saksama. Ingat prinsip detektif:{' '}
          <strong>setiap analisis wajib disertai bukti dari gambar dan teks</strong>, bukan sekadar menebak!
        </p>

        <StoryViewer story={story1} />
      </div>

      {/* Contoh Analisis Bertahap */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Demonstrasi Analisis Unsur Intrinsik Bertahap
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Ikuti tiga langkah detektif pada setiap unsur: baca bagian{' '}
          <strong>Coba Pikirkan</strong>, buka <strong>Lihat Petunjuk</strong>, lalu cocokkan dengan{' '}
          <strong>Lihat Analisis</strong>.
        </p>

        <div className="space-y-4">
          {DEMONSTRATION_STEPS.map((step, idx) => {
            const state = demoRevealed[idx] || { hint: false, analysis: false };
            return (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h4 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-700" />
                    {step.unsur}
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!state.hint) soundManager.playHint();
                        setDemoRevealed((prev) => ({
                          ...prev,
                          [idx]: { ...state, hint: !state.hint },
                        }));
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {state.hint ? 'Tutup Petunjuk' : 'Lihat Petunjuk'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!state.analysis) soundManager.playSuccess();
                        setDemoRevealed((prev) => ({
                          ...prev,
                          [idx]: { hint: true, analysis: !state.analysis },
                        }));
                        onCompleteDemo();
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {state.analysis ? 'Tutup Analisis' : 'Lihat Analisis'}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-800">
                  <span className="font-semibold text-sky-800">Coba Pikirkan: </span>
                  {step.cobaPikirkan}
                </div>

                {state.hint && (
                  <div className="mt-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-950">
                    <span className="font-semibold">Lihat Petunjuk: </span>
                    {step.lihatPetunjuk}
                  </div>
                )}

                {state.analysis && (
                  <div className="mt-2.5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-950 leading-relaxed">
                    <span className="font-semibold">Lihat Analisis (Berbasis Bukti): </span>
                    {step.lihatAnalisis}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <FooterNav
          backTarget="unsur-intrinsik"
          nextTarget="lkpd-kelompok"
          nextLabel="Lanjut: Misi Kelompok – LKPD (Cerita 2)"
          onNavigate={onNavigate}
        />
      </div>
    </section>
  );
};

import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Compass,
  GraduationCap,
  Lock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { HERO_BANNER_IMAGE } from './data/stories';
import {
  AhliQuestionScore,
  ClassRoom,
  MenuSectionId,
  ProgressStatus,
  StudentProgressState,
} from './types';
import { useRealtimeDate } from './hooks/useRealtimeDate';
import { LearningMaterials } from './components/LearningMaterials';
import { LkpdMission } from './components/LkpdMission';
import { IndividualExercise } from './components/IndividualExercise';
import { RemedialPengayaan } from './components/RemedialPengayaan';
import { ReflectionAndProgress } from './components/ReflectionAndProgress';
import { AiTutorDrawer, TutorContext } from './components/AiTutorDrawer';
import { TeacherDashboard } from './components/TeacherDashboard';
import { DeveloperProfileModal } from './components/DeveloperProfileModal';
import { soundManager } from './utils/soundEffects';

const STORAGE_KEY = 'detektif_cerita_progress_v1';

const DEFAULT_PROGRESS: StudentProgressState = {
  studentName: '',
  studentClass: '6A',
  materialQuizScore: null,
  materialQuizTotal: 5,
  demoCompleted: false,
  lkpdCompleted: false,
  lkpdGroupName: 'Kelompok 1',
  lkpdMembers: [],
  lkpdOrderCorrect: false,
  lkpdCauseEffectScore: 0,
  latihanCompleted: false,
  latihanPemulaScore: 0,
  latihanMenengahScore: 0,
  latihanAhliScore: 0,
  latihanTotalScore: 0,
  remedialCompleted: false,
  remedialStage: 0,
  pengayaanCompleted: false,
  pengayaanScore: 0,
  refleksiCompleted: false,
  refleksiAnswers: {},
  visitedSections: ['menu-utama'],
};

interface MenuItemSpec {
  id: Exclude<MenuSectionId, 'menu-utama'>;
  number: string;
  title: string;
  subtitle: string;
  storyTag?: string;
}

const MENU_ITEMS: MenuItemSpec[] = [
  {
    id: 'petunjuk',
    number: '01',
    title: 'Petunjuk Penggunaan Aplikasi',
    subtitle: 'Panduan singkat langkah belajar sebelum memulai misi',
  },
  {
    id: 'mulai-petualangan',
    number: '02',
    title: 'Mulai Petualangan',
    subtitle: 'Isi kartu identitas detektif & lihat alur pembelajaran PBL',
  },
  {
    id: 'tujuan',
    number: '03',
    title: 'Tujuan Pembelajaran',
    subtitle: 'Capaian analisis (C4), percaya diri (A5), dan merangkai gambar (P4)',
  },
  {
    id: 'kenali-sastra',
    number: '04',
    title: 'Kenali Teks Sastra',
    subtitle: 'Pengertian, tujuan, fungsi, dan contoh teks sastra bergambar',
  },
  {
    id: 'cerita-bergambar',
    number: '05',
    title: 'Pelajari Cerita Bergambar',
    subtitle: 'Ciri-ciri dan cara kerja sama gambar dengan teks narasi',
  },
  {
    id: 'unsur-intrinsik',
    number: '06',
    title: 'Kenali Unsur Intrinsik',
    subtitle: 'Tokoh, latar, konflik, alur, amanat, peta konsep, dan kuis 5 soal',
  },
  {
    id: 'contoh-demonstrasi',
    number: '07',
    title: 'Contoh dan Demonstrasi',
    subtitle: 'Analisis bertahap berbasis bukti dari teks dan gambar',
    storyTag: 'Cerita 1 · Rahasia Bekal di Bangku Taman',
  },
  {
    id: 'lkpd-kelompok',
    number: '08',
    title: 'Misi Kelompok – LKPD',
    subtitle: 'Drag & drop 6 panel acak, tabel unsur, sebab-akibat, presentasi',
    storyTag: 'Cerita 2 · Misteri Bibit Cabai di Kebun Kelas',
  },
  {
    id: 'latihan-individu',
    number: '09',
    title: 'Tantangan Individu – Soal Latihan',
    subtitle: '15 soal analisis C4 berjenjang (Pemula, Menengah, Ahli)',
    storyTag: 'Cerita 3 · Lentera Hujan di Pos Ronda',
  },
  {
    id: 'remedial',
    number: '10',
    title: 'Remedial',
    subtitle: 'Pendampingan 5 tahap bertahap untuk penguatan unsur intrinsik',
    storyTag: 'Cerita 4 · Payung Biru untuk Kiko',
  },
  {
    id: 'pengayaan',
    number: '11',
    title: 'Pengayaan',
    subtitle: '8 tantangan analisis tingkat lanjut dan aktivitas Bagaimana Jika?',
    storyTag: 'Cerita 5 · Jejak Misterius di Ruang Musik',
  },
  {
    id: 'refleksi',
    number: '12',
    title: 'Refleksi',
    subtitle: '6 pertanyaan perenungan diri setelah menyelesaikan petualangan',
  },
  {
    id: 'progres-belajar',
    number: '13',
    title: 'Hasil dan Progres Belajar',
    subtitle: 'Pantau ketuntasan dan rekomendasi Remedial atau Pengayaan',
  },
];

export default function App() {
  const realtimeDate = useRealtimeDate();
  const [activeSection, setActiveSection] = useState<MenuSectionId>('menu-utama');
  const [progress, setProgress] = useState<StudentProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROGRESS;
  });

  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorContext, setTutorContext] = useState<TutorContext>({
    title: 'Petualangan Detektif Cerita',
    storyContext:
      'Pembelajaran Bahasa Indonesia Kelas VI SD topik Teks Sastra Cerita Bergambar.',
  });
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [devProfileOpen, setDevProfileOpen] = useState(false);
  const [audioMuted, setAudioMuted] = useState(() => soundManager.isMuted());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const navigateTo = (target: MenuSectionId) => {
    soundManager.playClick();
    setActiveSection(target);
    setProgress((prev) => ({
      ...prev,
      visitedSections: prev.visitedSections.includes(target)
        ? prev.visitedSections
        : [...prev.visitedSections, target],
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAudioMute = () => {
    const next = !audioMuted;
    soundManager.setMuted(next);
    setAudioMuted(next);
    if (!next) soundManager.playClick();
  };

  const openTutorWithContext = (ctx: TutorContext) => {
    setTutorContext(ctx);
    setTutorOpen(true);
  };

  const postSubmission = async (body: Record<string, unknown>) => {
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      // keep local state even if offline
    }
  };

  const handleUpdateIdentity = (name: string, cls: ClassRoom) => {
    setProgress((prev) => ({
      ...prev,
      studentName: name,
      studentClass: cls,
    }));
  };

  const handleCompleteMaterialQuiz = async (score: number, total: number) => {
    setProgress((prev) => ({
      ...prev,
      materialQuizScore: score,
      materialQuizTotal: total,
    }));
    if (progress.studentName.trim()) {
      await postSubmission({
        activityType: 'Kuis Materi',
        studentOrGroupName: progress.studentName.trim(),
        className: progress.studentClass,
        realtimeDateLabel: realtimeDate.fullLabel,
        score,
        maxScore: total,
        status: score >= 4 ? 'Tuntas' : 'Sedang Berproses',
        details: { score, total },
      });
    }
  };

  const handleSaveLkpd = async (payload: {
    groupName: string;
    members: string[];
    className: ClassRoom;
    realtimeDateLabel: string;
    orderCorrect: boolean;
    causeEffectScore: number;
    analysis: Record<string, string>;
    totalScore: number;
    p4Score: number;
  }) => {
    setProgress((prev) => ({
      ...prev,
      lkpdCompleted: true,
      lkpdGroupName: payload.groupName,
      lkpdMembers: payload.members,
      lkpdOrderCorrect: payload.orderCorrect,
      lkpdCauseEffectScore: payload.causeEffectScore,
      studentClass: payload.className,
    }));

    await postSubmission({
      activityType: 'LKPD Kelompok',
      studentOrGroupName: payload.groupName,
      members: payload.members,
      className: payload.className,
      realtimeDateLabel: payload.realtimeDateLabel,
      score: payload.totalScore,
      maxScore: 100,
      p4Score: payload.p4Score,
      status: payload.totalScore >= 75 ? 'Tuntas' : 'Hampir Tuntas',
      details: {
        orderCorrect: payload.orderCorrect,
        causeEffectScore: payload.causeEffectScore,
        ...payload.analysis,
      },
    });
  };

  const handleCompleteExercise = async (payload: {
    studentName: string;
    className: ClassRoom;
    realtimeDateLabel: string;
    pemulaScore: number;
    menengahScore: number;
    ahliScore: number;
    totalScore: number;
    ahliDetails: AhliQuestionScore[];
  }) => {
    setProgress((prev) => ({
      ...prev,
      studentName: payload.studentName,
      studentClass: payload.className,
      latihanCompleted: true,
      latihanPemulaScore: payload.pemulaScore,
      latihanMenengahScore: payload.menengahScore,
      latihanAhliScore: payload.ahliScore,
      latihanTotalScore: payload.totalScore,
    }));

    await postSubmission({
      activityType: 'Latihan Individu',
      studentOrGroupName: payload.studentName,
      className: payload.className,
      realtimeDateLabel: payload.realtimeDateLabel,
      score: payload.totalScore,
      maxScore: 100,
      status: payload.totalScore >= 75 ? 'Tuntas' : 'Hampir Tuntas',
      details: {
        pemulaScore: payload.pemulaScore,
        menengahScore: payload.menengahScore,
        ahliScore: payload.ahliScore,
        ahliDetails: payload.ahliDetails,
      },
    });
  };

  const handleSaveRemedial = async (payload: {
    studentName: string;
    className: ClassRoom;
    realtimeDateLabel: string;
    stageCompleted: number;
    score: number;
  }) => {
    setProgress((prev) => ({
      ...prev,
      studentName: payload.studentName,
      studentClass: payload.className,
      remedialCompleted: true,
      remedialStage: payload.stageCompleted,
    }));

    await postSubmission({
      activityType: 'Remedial',
      studentOrGroupName: payload.studentName,
      className: payload.className,
      realtimeDateLabel: payload.realtimeDateLabel,
      score: payload.score,
      maxScore: 100,
      status: 'Tuntas',
      details: { stageCompleted: payload.stageCompleted },
    });
  };

  const handleSavePengayaan = async (payload: {
    studentName: string;
    className: ClassRoom;
    realtimeDateLabel: string;
    score: number;
    howIfAnswer: string;
  }) => {
    setProgress((prev) => ({
      ...prev,
      studentName: payload.studentName,
      studentClass: payload.className,
      pengayaanCompleted: true,
      pengayaanScore: payload.score,
    }));

    await postSubmission({
      activityType: 'Pengayaan',
      studentOrGroupName: payload.studentName,
      className: payload.className,
      realtimeDateLabel: payload.realtimeDateLabel,
      score: payload.score,
      maxScore: 100,
      status: 'Tuntas',
      details: { howIfAnswer: payload.howIfAnswer },
    });
  };

  const handleSaveReflection = async (payload: {
    studentName: string;
    className: ClassRoom;
    realtimeDateLabel: string;
    answers: Record<string, string>;
  }) => {
    setProgress((prev) => ({
      ...prev,
      studentName: payload.studentName,
      studentClass: payload.className,
      refleksiCompleted: true,
      refleksiAnswers: payload.answers,
    }));

    await postSubmission({
      activityType: 'Refleksi',
      studentOrGroupName: payload.studentName,
      className: payload.className,
      realtimeDateLabel: payload.realtimeDateLabel,
      score: 100,
      maxScore: 100,
      status: 'Tuntas',
      details: { answers: payload.answers },
    });
  };

  const getItemStatus = (id: Exclude<MenuSectionId, 'menu-utama'>): ProgressStatus => {
    if (id === 'unsur-intrinsik' && progress.materialQuizScore !== null) return 'Tuntas';
    if (id === 'contoh-demonstrasi' && progress.demoCompleted) return 'Tuntas';
    if (id === 'lkpd-kelompok' && progress.lkpdCompleted) return 'Tuntas';
    if (id === 'latihan-individu' && progress.latihanCompleted) return 'Tuntas';
    if (id === 'remedial' && progress.remedialCompleted) return 'Tuntas';
    if (id === 'pengayaan' && progress.pengayaanCompleted) return 'Tuntas';
    if (id === 'refleksi' && progress.refleksiCompleted) return 'Tuntas';
    if (progress.visitedSections.includes(id)) return 'Sedang Berproses';
    return 'Belum Mulai';
  };

  const isLearningSection =
    activeSection === 'petunjuk' ||
    activeSection === 'mulai-petualangan' ||
    activeSection === 'tujuan' ||
    activeSection === 'kenali-sastra' ||
    activeSection === 'cerita-bergambar' ||
    activeSection === 'unsur-intrinsik' ||
    activeSection === 'contoh-demonstrasi';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Title */}
          <button
            type="button"
            onClick={() => navigateTo('menu-utama')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left"
          >
            Detektif Cerita
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => navigateTo('menu-utama')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'menu-utama' ? 'text-sky-700 font-semibold' : ''
              }`}
            >
              Menu Utama
            </button>
            <button
              type="button"
              onClick={() => navigateTo('petunjuk')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'petunjuk' ? 'text-sky-700 font-semibold' : ''
              }`}
            >
              Petunjuk
            </button>
            <button
              type="button"
              onClick={() => navigateTo('kenali-sastra')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'kenali-sastra' ||
                activeSection === 'cerita-bergambar' ||
                activeSection === 'unsur-intrinsik'
                  ? 'text-sky-700 font-semibold'
                  : ''
              }`}
            >
              Materi
            </button>
            <button
              type="button"
              onClick={() => navigateTo('lkpd-kelompok')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'lkpd-kelompok' ||
                activeSection === 'latihan-individu'
                  ? 'text-sky-700 font-semibold'
                  : ''
              }`}
            >
              Misi &amp; Latihan
            </button>
            <button
              type="button"
              onClick={() => navigateTo('progres-belajar')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeSection === 'progres-belajar' ? 'text-sky-700 font-semibold' : ''
              }`}
            >
              Progres
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setTeacherOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Dasbor Guru
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Context Strip below header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span>Bahasa Indonesia · Fase C / Kelas VI SD</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{realtimeDate.fullLabel}</span>
            {progress.studentName && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-slate-900">
                  {progress.studentName} (Kelas {progress.studentClass})
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={toggleAudioMute}
              className="text-xs font-medium text-slate-700 hover:text-slate-950 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              {audioMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  Audio Hening
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                  Audio Aktif
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDevProfileOpen(true)}
              className="text-xs font-medium text-slate-700 hover:text-sky-700 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
              Profil Pengembang
            </button>

            <button
              type="button"
              onClick={() =>
                openTutorWithContext({
                  title:
                    MENU_ITEMS.find((m) => m.id === activeSection)?.title ||
                    'Menu Utama Detektif Cerita',
                  storyContext:
                    'Membantu peserta didik kelas VI SD memahami teks sastra cerita bergambar dan unsur intrinsiknya secara bertahap.',
                })
              }
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Compass className="w-3.5 h-3.5" />
              Buka Teman Detektif AI
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeSection === 'menu-utama' && (
          <div className="space-y-10">
            {/* Hero 2-Column Split */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="lg:col-span-6 p-7 md:p-10 flex flex-col justify-center">
                <p className="text-xs font-medium text-sky-700 mb-2">
                  Problem Based Learning (PBL) · Membaca dan Memirsa
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4 [text-wrap:balance]">
                  Petualangan Menjadi Detektif Cerita
                </h1>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  Amati gambar, telusuri bukti teks, susun rangkaian peristiwa, dan temukan unsur intrinsik dari lima cerita bergambar kelas VI SD bersama kelompokmu.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateTo('mulai-petualangan')}
                    className="px-5 py-3 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    Mulai Petualangan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('petunjuk')}
                    className="px-5 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    Petunjuk Penggunaan
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 min-h-[260px] bg-slate-100">
                <img
                  src={HERO_BANNER_IMAGE}
                  alt="Ilustrasi meja detektif cerita bergambar di ruang baca sekolah"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </section>

            {/* Full-width Identity Strip below Hero */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <p className="text-xs text-slate-500">Topik Pembelajaran</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Teks Sastra – Cerita Bergambar
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <p className="text-xs text-slate-500">Target Peserta Didik</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Kelas VI SD (Kelas 6A &amp; 6B)
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <p className="text-xs text-slate-500">Jumlah Cerita Unik</p>
                <p className="text-sm font-semibold text-slate-900 mt-1 font-mono tabular-nums">
                  5 Cerita Bergambar Berbeda
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <p className="text-xs text-slate-500">Pendekatan &amp; Evaluasi</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Deep Learning · C4, A5, P4
                </p>
              </div>
            </section>

            {/* 13 Main Menu Hub */}
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Peta Menu Utama Petualangan
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Pilih tahapan belajar di bawah ini secara berurutan atau langsung menuju aktivitas yang ditugaskan guru.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MENU_ITEMS.map((item) => {
                  const status = getItemStatus(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.id)}
                      className="text-left p-5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 transition-colors flex flex-col justify-between gap-4 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                          <span className="font-mono font-semibold text-sky-700 tabular-nums">
                            {item.number}.
                          </span>
                          <span
                            className={`font-medium ${
                              status === 'Tuntas'
                                ? 'text-emerald-700'
                                : status === 'Sedang Berproses'
                                  ? 'text-amber-700'
                                  : 'text-slate-400'
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 truncate">
                          {item.storyTag || 'Aktivitas Pembelajaran'}
                        </span>
                        <span className="font-semibold text-sky-700 shrink-0">
                          Buka →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Profil Pengembang Media Card */}
            <section className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-sky-700">
                    Profil Pengembang Media Pembelajaran
                  </p>
                  <h3 className="text-lg font-bold text-slate-900">
                    Iya Riyani, S.Pd. · PGSD Universitas Muhammadiyah Cirebon
                  </h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    PPG Calon Guru Gelombang 1 Tahun 2026 (NIM 2506733048) · Fokus PBL &amp; Deep Learning (C4, A5, P4).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDevProfileOpen(true)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 self-start md:self-center"
              >
                Lihat Profil &amp; Kontak
              </button>
            </section>
          </div>
        )}

        {isLearningSection && (
          <LearningMaterials
            section={activeSection}
            progress={progress}
            onUpdateStudentIdentity={handleUpdateIdentity}
            onNavigate={navigateTo}
            onCompleteMaterialQuiz={handleCompleteMaterialQuiz}
            onCompleteDemo={() =>
              setProgress((prev) => ({ ...prev, demoCompleted: true }))
            }
            onOpenTutor={openTutorWithContext}
          />
        )}

        {activeSection === 'lkpd-kelompok' && (
          <LkpdMission
            initialClass={progress.studentClass}
            onNavigate={navigateTo}
            onSaveLkpd={handleSaveLkpd}
            onOpenTutor={openTutorWithContext}
          />
        )}

        {activeSection === 'latihan-individu' && (
          <IndividualExercise
            studentName={progress.studentName}
            studentClass={progress.studentClass}
            onUpdateIdentity={handleUpdateIdentity}
            onNavigate={navigateTo}
            onCompleteExercise={handleCompleteExercise}
            onOpenTutor={openTutorWithContext}
          />
        )}

        {(activeSection === 'remedial' || activeSection === 'pengayaan') && (
          <RemedialPengayaan
            mode={activeSection}
            studentName={progress.studentName}
            studentClass={progress.studentClass}
            onUpdateIdentity={handleUpdateIdentity}
            onNavigate={navigateTo}
            onSaveRemedial={handleSaveRemedial}
            onSavePengayaan={handleSavePengayaan}
            onOpenTutor={openTutorWithContext}
          />
        )}

        {(activeSection === 'refleksi' ||
          activeSection === 'progres-belajar') && (
          <ReflectionAndProgress
            mode={activeSection}
            progress={progress}
            onUpdateIdentity={handleUpdateIdentity}
            onNavigate={navigateTo}
            onSaveReflection={handleSaveReflection}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            Detektif Cerita · Bahasa Indonesia Fase C Kelas VI SD (6A &amp; 6B)
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('menu-utama')}
              className="hover:text-slate-900"
            >
              Menu Utama
            </button>
            <button
              type="button"
              onClick={() => navigateTo('progres-belajar')}
              className="hover:text-slate-900"
            >
              Hasil &amp; Progres
            </button>
            <button
              type="button"
              onClick={() => setDevProfileOpen(true)}
              className="hover:text-slate-900"
            >
              Profil Pengembang
            </button>
            <button
              type="button"
              onClick={() => setTeacherOpen(true)}
              className="hover:text-slate-900"
            >
              Dasbor Guru
            </button>
          </div>
        </div>
      </footer>

      {/* AI Tutor Drawer */}
      <AiTutorDrawer
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        context={tutorContext}
      />

      {/* Locked Teacher Dashboard Modal */}
      <TeacherDashboard
        isOpen={teacherOpen}
        onClose={() => setTeacherOpen(false)}
      />

      {/* Developer Profile Modal */}
      <DeveloperProfileModal
        isOpen={devProfileOpen}
        onClose={() => setDevProfileOpen(false)}
      />
    </div>
  );
}

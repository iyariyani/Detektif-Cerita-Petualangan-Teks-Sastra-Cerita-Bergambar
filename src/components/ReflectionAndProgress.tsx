import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Home,
  Save,
} from 'lucide-react';
import { REFLECTION_PROMPTS } from '../data/stories';
import {
  ClassRoom,
  MenuSectionId,
  ProgressStatus,
  StudentProgressState,
} from '../types';
import { useRealtimeDate } from '../hooks/useRealtimeDate';

interface ReflectionAndProgressProps {
  mode: 'refleksi' | 'progres-belajar';
  progress: StudentProgressState;
  onUpdateIdentity: (name: string, cls: ClassRoom) => void;
  onNavigate: (target: MenuSectionId) => void;
  onSaveReflection: (payload: {
    studentName: string;
    className: ClassRoom;
    realtimeDateLabel: string;
    answers: Record<string, string>;
  }) => Promise<void>;
}

export const ReflectionAndProgress: React.FC<ReflectionAndProgressProps> = ({
  mode,
  progress,
  onUpdateIdentity,
  onNavigate,
  onSaveReflection,
}) => {
  const realtimeDate = useRealtimeDate();
  const [name, setName] = useState(progress.studentName);
  const [cls, setCls] = useState<ClassRoom>(progress.studentClass);
  const [answers, setAnswers] = useState<Record<string, string>>(
    progress.refleksiAnswers || {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (mode === 'refleksi') {
    const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      if (!name.trim()) {
        setErrorMsg('Tuliskan nama lengkapmu terlebih dahulu sebelum menyimpan refleksi.');
        return;
      }
      const filled = REFLECTION_PROMPTS.filter(
        (_, i) => (answers[String(i)] || '').trim().length > 0
      ).length;
      if (filled < REFLECTION_PROMPTS.length) {
        setErrorMsg('Jawab seluruh 6 pertanyaan refleksi agar catatan belajarmu lengkap.');
        return;
      }
      setSaving(true);
      onUpdateIdentity(name.trim(), cls);
      await onSaveReflection({
        studentName: name.trim(),
        className: cls,
        realtimeDateLabel: realtimeDate.fullLabel,
        answers,
      });
      setSaving(false);
      setSaved(true);
    };

    return (
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-medium text-sky-700 mb-1">
          Evaluasi Diri · TP 2 (A5 - Sikap & Kepercayaan Diri)
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Refleksi Pembelajaran
        </h2>
        <p className="text-sm md:text-base text-slate-600 mb-6">
          Renungkan kembali perjalananmu menjadi Detektif Cerita hari ini dan tuliskan jawabanmu dengan jujur.
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Peserta Didik
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tulis namamu..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1">
                Kelas
              </span>
              <div className="flex gap-2">
                {(['6A', '6B'] as ClassRoom[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCls(c)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg border ${
                      cls === c
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1">
                Waktu (Realtime)
              </span>
              <div className="px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-200 bg-white text-slate-700">
                {realtimeDate.fullLabel}
              </div>
            </div>
          </div>

          {REFLECTION_PROMPTS.map((question, idx) => (
            <div key={idx}>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                {question}
              </label>
              <textarea
                rows={2}
                value={answers[String(idx)] || ''}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [String(idx)]: e.target.value,
                  }))
                }
                placeholder="Tuliskan pendapat dan pengalamanmu..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          ))}

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
              {errorMsg}
            </div>
          )}

          {saved && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Refleksi berhasil disimpan! Sekarang lihat rekapitulasi progresmu.</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('latihan-individu')}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </button>
              <button
                type="button"
                onClick={() => onNavigate('menu-utama')}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Menu Utama
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Refleksi'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('progres-belajar')}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-2"
              >
                Hasil & Progres Belajar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </section>
    );
  }

  // PROGRES BELAJAR
  const completedCount = [
    progress.materialQuizScore !== null,
    progress.lkpdCompleted,
    progress.latihanCompleted,
    progress.remedialCompleted || progress.pengayaanCompleted,
    progress.refleksiCompleted,
  ].filter(Boolean).length;

  let overallStatus: ProgressStatus = 'Belum Mulai';
  if (completedCount === 5) overallStatus = 'Tuntas';
  else if (completedCount >= 3) overallStatus = 'Hampir Tuntas';
  else if (completedCount >= 1 || progress.visitedSections.length > 2)
    overallStatus = 'Sedang Berproses';

  const statusSteps: ProgressStatus[] = [
    'Belum Mulai',
    'Sedang Berproses',
    'Hampir Tuntas',
    'Tuntas',
  ];

  const needsRemedial =
    progress.latihanCompleted && progress.latihanTotalScore < 75;
  const readyForPengayaan =
    progress.latihanCompleted && progress.latihanTotalScore >= 75;

  const activityCards = [
    {
      name: 'Kuis Pemahaman Materi',
      status: progress.materialQuizScore !== null ? 'Tuntas' : 'Belum Mulai',
      scoreLabel:
        progress.materialQuizScore !== null
          ? `${progress.materialQuizScore} / ${progress.materialQuizTotal} benar`
          : 'Belum dikerjakan',
      target: 'unsur-intrinsik' as MenuSectionId,
    },
    {
      name: 'LKPD Kelompok (Cerita 2)',
      status: progress.lkpdCompleted ? 'Tuntas' : 'Belum Mulai',
      scoreLabel: progress.lkpdCompleted
        ? `${progress.lkpdGroupName} · Urutan ${progress.lkpdOrderCorrect ? 'Benar' : 'Dicek'} · Sebab-Akibat ${progress.lkpdCauseEffectScore}/3`
        : 'Belum dikerjakan',
      target: 'lkpd-kelompok' as MenuSectionId,
    },
    {
      name: 'Soal Latihan Individu C4 (Cerita 3)',
      status: progress.latihanCompleted ? 'Tuntas' : 'Belum Mulai',
      scoreLabel: progress.latihanCompleted
        ? `Total ${progress.latihanTotalScore}/100 (Pemula ${progress.latihanPemulaScore}, Menengah ${progress.latihanMenengahScore}, Ahli ${progress.latihanAhliScore})`
        : 'Belum dikerjakan',
      target: 'latihan-individu' as MenuSectionId,
    },
    {
      name: 'Remedial (Cerita 4)',
      status: progress.remedialCompleted
        ? 'Tuntas'
        : needsRemedial
          ? 'Direkomendasikan'
          : 'Opsional',
      scoreLabel: progress.remedialCompleted
        ? 'Selesai 5 tahap scaffolding'
        : needsRemedial
          ? 'Disarankan untuk penguatan'
          : 'Diikuti jika skor latihan < 75',
      target: 'remedial' as MenuSectionId,
    },
    {
      name: 'Pengayaan (Cerita 5)',
      status: progress.pengayaanCompleted
        ? 'Tuntas'
        : readyForPengayaan
          ? 'Direkomendasikan'
          : 'Opsional',
      scoreLabel: progress.pengayaanCompleted
        ? `Skor ${progress.pengayaanScore}/100`
        : readyForPengayaan
          ? 'Kamu sudah tuntas! Ayo ikuti tantangan lanjut'
          : 'Dibuka setelah menuntaskan latihan (skor ≥ 75)',
      target: 'pengayaan' as MenuSectionId,
    },
    {
      name: 'Refleksi Diri',
      status: progress.refleksiCompleted ? 'Tuntas' : 'Belum Mulai',
      scoreLabel: progress.refleksiCompleted
        ? '6 pertanyaan refleksi tersimpan'
        : 'Belum diisi',
      target: 'refleksi' as MenuSectionId,
    },
  ];

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-sky-700 mb-1">
              Rekapitulasi Capaian Detektif Cerita
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Hasil dan Progres Belajar
            </h2>
          </div>
          <div className="text-sm text-slate-600 font-mono tabular-nums">
            {progress.studentName || 'Peserta Didik'} · Kelas {progress.studentClass}
          </div>
        </div>

        {/* 4-Stage Progress Indicator */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 mb-6">
          <p className="text-xs font-semibold text-slate-700 mb-3">
            Indikator Progres Belajar Saat Ini:{' '}
            <span className="text-sky-700 font-bold">{overallStatus}</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {statusSteps.map((step, idx) => {
              const currentIdx = statusSteps.indexOf(overallStatus);
              const active = idx <= currentIdx;
              return (
                <div
                  key={step}
                  className={`p-3 rounded-lg border text-center text-xs font-semibold ${
                    step === overallStatus
                      ? 'bg-sky-600 text-white border-sky-600'
                      : active
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {idx + 1}. {step}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendation Banner */}
        {needsRemedial && !progress.remedialCompleted && (
          <div className="p-5 rounded-xl border border-amber-300 bg-amber-50 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-amber-950 text-base">
                Rekomendasi Belajar: Penguatan Melalui Remedial
              </h3>
              <p className="text-sm text-amber-900 mt-0.5">
                Skor latihan individumu saat ini {progress.latihanTotalScore}/100. Mari berlatih bertahap di halaman Remedial dengan Cerita 4 agar semakin mantap!
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('remedial')}
              className="px-4 py-2.5 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 whitespace-nowrap shrink-0"
            >
              Buka Remedial Sekarang
            </button>
          </div>
        )}

        {readyForPengayaan && !progress.pengayaanCompleted && (
          <div className="p-5 rounded-xl border border-emerald-300 bg-emerald-50 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-emerald-950 text-base">
                Rekomendasi Belajar: Siap Menuju Tantangan Pengayaan!
              </h3>
              <p className="text-sm text-emerald-900 mt-0.5">
                Selamat! Kamu sudah mencapai kriteria tujuan pembelajaran ({progress.latihanTotalScore}/100). Ayo taklukkan Cerita 5 di menu Pengayaan!
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('pengayaan')}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 whitespace-nowrap shrink-0"
            >
              Buka Pengayaan Sekarang
            </button>
          </div>
        )}

        {/* Activity Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activityCards.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {item.name}
                  </h3>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      item.status === 'Tuntas'
                        ? 'text-emerald-700'
                        : item.status === 'Direkomendasikan'
                          ? 'text-amber-700'
                          : 'text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.scoreLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(item.target)}
                className="self-start text-xs font-semibold text-sky-700 hover:text-sky-800 hover:underline"
              >
                Buka Aktivitas →
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => onNavigate('refleksi')}
            className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Refleksi
          </button>
          <button
            type="button"
            onClick={() => onNavigate('menu-utama')}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    </section>
  );
};

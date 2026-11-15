import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  HelpCircle,
  Home,
  MessageSquare,
  RotateCcw,
  Save,
  Square,
  Volume2,
} from 'lucide-react';
import { LKPD_CAUSE_EFFECT_ITEMS, STORIES } from '../data/stories';
import { ClassRoom, MenuSectionId, StoryPanel } from '../types';
import { StoryPanelIllustration } from './StoryPanelIllustration';
import { useRealtimeDate } from '../hooks/useRealtimeDate';
import { TutorContext } from './AiTutorDrawer';
import { soundManager } from '../utils/soundEffects';

interface LkpdMissionProps {
  initialClass: ClassRoom;
  onNavigate: (target: MenuSectionId) => void;
  onSaveLkpd: (payload: {
    groupName: string;
    members: string[];
    className: ClassRoom;
    realtimeDateLabel: string;
    orderCorrect: boolean;
    causeEffectScore: number;
    analysis: Record<string, string>;
    totalScore: number;
    p4Score: number;
  }) => Promise<void>;
  onOpenTutor: (ctx: TutorContext) => void;
}

const SCRAMBLED_INDICES = [2, 0, 4, 1, 5, 3]; // panels 3, 1, 5, 2, 6, 4

export const LkpdMission: React.FC<LkpdMissionProps> = ({
  initialClass,
  onNavigate,
  onSaveLkpd,
  onOpenTutor,
}) => {
  const story2 = STORIES['cerita-2'];
  const realtimeDate = useRealtimeDate();

  // Identitas Kelompok
  const [groupName, setGroupName] = useState('Kelompok 1');
  const [className, setClassName] = useState<ClassRoom>(initialClass);
  const [members, setMembers] = useState<string[]>(['', '', '', '', '', '']);

  // Misi 1: Drag and Drop 6 panel acak
  const [orderedPanels, setOrderedPanels] = useState<StoryPanel[]>(() =>
    SCRAMBLED_INDICES.map((i) => story2.panels[i])
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [orderChecked, setOrderChecked] = useState(false);
  const [orderAttempts, setOrderAttempts] = useState(0);

  // Misi 2: Tabel Unsur Intrinsik
  const [analysis, setAnalysis] = useState<Record<string, string>>({
    tokoh: '',
    latar: '',
    konflik: '',
    penyelesaian: '',
    alur: '',
    amanat: '',
  });
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [evaluatingAnalysis, setEvaluatingAnalysis] = useState(false);

  // Misi 3: Cause -> Event -> Effect matching
  const shuffledPeristiwa = useMemo(
    () => [
      LKPD_CAUSE_EFFECT_ITEMS[2],
      LKPD_CAUSE_EFFECT_ITEMS[0],
      LKPD_CAUSE_EFFECT_ITEMS[1],
    ],
    []
  );
  const shuffledAkibat = useMemo(
    () => [
      LKPD_CAUSE_EFFECT_ITEMS[1],
      LKPD_CAUSE_EFFECT_ITEMS[2],
      LKPD_CAUSE_EFFECT_ITEMS[0],
    ],
    []
  );
  const [ceMatches, setCeMatches] = useState<
    Record<string, { peristiwaId: string; akibatId: string }>
  >({});
  const [ceChecked, setCeChecked] = useState(false);

  // Misi 4: Persiapan Presentasi
  const [presenterMap, setPresenterMap] = useState({
    pembuka: '',
    penjelasUrutan: '',
    penjelasUnsur: '',
    penanggap: '',
  });
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [speakingPanelId, setSpeakingPanelId] = useState<string | null>(null);

  const correctPositionsCount = orderedPanels.filter(
    (p, idx) => p.order === idx + 1
  ).length;
  const isOrderCorrect = correctPositionsCount === story2.panels.length;

  const movePanel = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= orderedPanels.length) return;
    soundManager.playSwap();
    setOrderedPanels((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setOrderChecked(false);
  };

  const handleDrop = (targetIdx: number) => {
    if (dragIndex === null || dragIndex === targetIdx) return;
    movePanel(dragIndex, targetIdx);
    setDragIndex(null);
  };

  const handleResetOrder = () => {
    soundManager.playClick();
    setOrderedPanels(SCRAMBLED_INDICES.map((i) => story2.panels[i]));
    setOrderChecked(false);
  };

  const handleCheckOrder = () => {
    setOrderChecked(true);
    setOrderAttempts((n) => n + 1);
    if (isOrderCorrect) {
      soundManager.playSuccess();
    } else {
      soundManager.playTryAgain();
    }
  };

  const ceCorrectCount = LKPD_CAUSE_EFFECT_ITEMS.filter((item) => {
    const match = ceMatches[item.id];
    return match && match.peristiwaId === item.id && match.akibatId === item.id;
  }).length;

  const handleEvaluateTable = async () => {
    setEvaluatingAnalysis(true);
    setAiFeedback(null);
    const combined = Object.entries(analysis)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');
    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'lkpd-unsur',
          prompt: 'Analisis 6 unsur intrinsik Cerita 2: Misteri Bibit Cabai di Kebun Kelas.',
          studentAnswer: combined,
          referenceKey: JSON.stringify(story2.intrinsicKey),
        }),
      });
      const data = await res.json();
      setAiFeedback(
        data.feedback ||
          'Analisis kelompok sudah baik. Pastikan setiap unsur didukung kejadian pada panel gambar.'
      );
    } catch {
      setAiFeedback(
        'Hasil analisis kelompok sudah tercatat. Pastikan tokoh, latar, konflik, dan amanat sesuai isi cerita.'
      );
    } finally {
      setEvaluatingAnalysis(false);
    }
  };

  const handleSubmitAll = async () => {
    setFormError(null);
    const validMembers = members.map((m) => m.trim()).filter(Boolean);
    if (validMembers.length === 0) {
      setFormError('Isi minimal 1 nama anggota kelompok pada bagian Identitas LKPD di atas.');
      return;
    }

    const orderPts = Math.round((correctPositionsCount / 6) * 35);
    const tableFilledCount = Object.values(analysis).filter(
      (v) => v.trim().length >= 5
    ).length;
    const tablePts = Math.round((tableFilledCount / 6) * 35);
    const cePts = Math.round((ceCorrectCount / 3) * 30);
    const totalScore = orderPts + tablePts + cePts;
    const p4Score =
      correctPositionsCount === 6 ? 4 : correctPositionsCount >= 4 ? 3 : 2;

    setSaving(true);
    try {
      await onSaveLkpd({
        groupName,
        members: validMembers,
        className,
        realtimeDateLabel: realtimeDate.fullLabel,
        orderCorrect: isOrderCorrect,
        causeEffectScore: ceCorrectCount,
        analysis,
        totalScore,
        p4Score,
      });
      soundManager.playCelebration();
      setSavedSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      {/* Header & Identitas LKPD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-sky-700 mb-1">
              Misi Kelompok – LKPD · Cerita 2 ({story2.title})
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Lembar Kerja Peserta Didik (LKPD)
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenTutor({
                title: 'LKPD Kelompok · Cerita 2',
                storyContext: story2.panels
                  .map((p) => `Panel ${p.caption}: ${p.narrative}`)
                  .join('\n'),
                questionText:
                  'Membantu kelompok menyusun 6 panel acak dan menganalisis unsur intrinsik Misteri Bibit Cabai di Kebun Kelas.',
              })
            }
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            Bantuan Teman Detektif
          </button>
        </div>

        {/* Identitas LKPD */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Nama Kelompok
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-3 gap-1.5">
                {['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4', 'Kelompok 5'].map(
                  (g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGroupName(g)}
                      className={`px-2.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        groupName === g
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {g.replace('Kelompok ', 'Kel. ')}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Kelas
              </span>
              <div className="flex items-center gap-2">
                {(['6A', '6B'] as ClassRoom[]).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setClassName(cls)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${
                      className === cls
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
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Hari / Tanggal (Realtime)
              </span>
              <div className="px-3.5 py-2.5 text-xs font-mono tabular-nums rounded-lg border border-slate-200 bg-white text-slate-700">
                {realtimeDate.fullLabel}
              </div>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Anggota Kelompok (Maksimal 6 Orang)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-500 w-5 text-right tabular-nums">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={member}
                    onChange={(e) =>
                      setMembers((prev) => {
                        const next = [...prev];
                        next[idx] = e.target.value;
                        return next;
                      })
                    }
                    placeholder={`Nama Anggota ${idx + 1}`}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Misi 1: Susun Ceritanya (Drag and Drop 6 Panel Acak) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={story2.coverImage}
              alt={story2.title}
              referrerPolicy="no-referrer"
              className="w-14 h-11 rounded-lg object-cover border border-slate-200"
            />
            <div>
              <p className="text-xs font-mono font-semibold text-sky-700">
                Misi 1 · TP 3 (P4 - Merangkaikan Gambar)
              </p>
              <h3 className="text-xl font-bold text-slate-900">
                Susun Ceritanya ({story2.title})
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetOrder}
            className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Acak Ulang Panel
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-5">
          Keenam panel berikut masih acak. Diskusikan dalam kelompok, lalu{' '}
          <strong>seret (drag and drop)</strong> kartu atau gunakan tombol panah untuk menyusun urutan cerita dari <strong>Posisi 1 sampai 6</strong> yang logis!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderedPanels.map((panel, idx) => {
            const isSlotRight = orderChecked && panel.order === idx + 1;
            return (
              <div
                key={panel.id}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
                className={`rounded-xl border overflow-hidden bg-white transition-all cursor-grab active:cursor-grabbing flex flex-col ${
                  orderChecked
                    ? isSlotRight
                      ? 'border-emerald-400 ring-1 ring-emerald-300'
                      : 'border-amber-400'
                    : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 tabular-nums">
                    <GripVertical className="w-4 h-4 text-slate-400" />
                    Urutan ke-{idx + 1}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        void soundManager.speak(
                          `${panel.caption}. ${panel.narrative}`,
                          `lkpd-${panel.id}`,
                          (speaking, id) =>
                            setSpeakingPanelId(speaking ? id || `lkpd-${panel.id}` : null)
                        )
                      }
                      className={`p-1 rounded border ${
                        speakingPanelId === `lkpd-${panel.id}`
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Dengarkan teks panel"
                    >
                      {speakingPanelId === `lkpd-${panel.id}` ? (
                        <Square className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => movePanel(idx, idx - 1)}
                      className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      title="Geser lebih awal"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === orderedPanels.length - 1}
                      onClick={() => movePanel(idx, idx + 1)}
                      className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      title="Geser lebih akhir"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-100 border-b border-slate-200">
                  <StoryPanelIllustration sceneKey={panel.sceneKey} />
                </div>
                <div className="p-3.5 flex-1 flex flex-col gap-1.5">
                  <p className="text-xs font-semibold text-slate-900">
                    {panel.caption}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {panel.narrative}
                  </p>
                  {orderChecked && (
                    <p
                      className={`mt-auto pt-2 text-xs font-semibold ${
                        isSlotRight ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isSlotRight
                        ? 'Posisi ini sudah tepat'
                        : 'Periksa lagi posisi kejadian ini dalam alur'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleCheckOrder}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700"
          >
            Cek Jawaban Urutan
          </button>
          {orderChecked && (
            <div
              className={`px-4 py-2.5 rounded-lg text-sm border ${
                isOrderCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {isOrderCorrect ? (
                <span>
                  Hebat! Seluruh 6 panel telah tersusun menjadi alur maju yang logis (6/6 tepat).
                </span>
              ) : (
                <span>
                  Saat ini <strong>{correctPositionsCount} dari 6 panel</strong> sudah berada di posisi tepat.{' '}
                  {orderAttempts >= 2
                    ? 'Petunjuk: Mulailah dari Sinta menyiram 3 pot utuh, lalu kejadian bola Bagas, pot roboh, keberanian mengaku, menanam ulang, hingga dipuji Bu Dewi.'
                    : 'Petunjuk: Amati mana kejadian awal sebelum pot jatuh dan mana kejadian setelah mereka bekerja sama.'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Misi 2: Temukan Unsur Cerita (Tabel Analisis) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-mono font-semibold text-sky-700 mb-1">
          Misi 2 · TP 1 (C4 - Menganalisis Unsur Intrinsik)
        </p>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Temukan Unsur Cerita
        </h3>
        <p className="text-sm text-slate-600 mb-5">
          Setelah memahami urutan cerita, diskusikan bersama kelompok dan isi tabel analisis berikut berdasarkan bukti gambar serta narasi!
        </p>

        <div className="overflow-hidden border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="p-3.5 w-1/3">Unsur Intrinsik</th>
                <th className="p-3.5">Hasil Analisis Kelompok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {[
                {
                  key: 'tokoh',
                  label: 'Tokoh dan Penokohan',
                  placeholder: 'Siapa pelakunya dan apa sifat mereka berdasarkan bukti cerita?',
                },
                {
                  key: 'latar',
                  label: 'Latar (Tempat, Waktu, Suasana)',
                  placeholder: 'Di mana, kapan, dan bagaimana suasana kejadian?',
                },
                {
                  key: 'konflik',
                  label: 'Konflik',
                  placeholder: 'Masalah apa yang terjadi dan mengapa hal itu membuat cemas?',
                },
                {
                  key: 'penyelesaian',
                  label: 'Penyelesaian',
                  placeholder: 'Bagaimana masalah tersebut diselesaikan oleh para tokoh?',
                },
                {
                  key: 'alur',
                  label: 'Alur',
                  placeholder: 'Bagaimana urutan awal, masalah muncul, hingga akhir cerita?',
                },
                {
                  key: 'amanat',
                  label: 'Amanat',
                  placeholder: 'Pesan kebaikan apa yang dapat dipelajari dari cerita ini?',
                },
              ].map((row) => (
                <tr key={row.key}>
                  <td className="p-3.5 font-semibold text-slate-900 align-top bg-slate-50/40">
                    {row.label}
                  </td>
                  <td className="p-3">
                    <textarea
                      rows={2}
                      value={analysis[row.key]}
                      onChange={(e) =>
                        setAnalysis((prev) => ({
                          ...prev,
                          [row.key]: e.target.value,
                        }))
                      }
                      placeholder={row.placeholder}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={evaluatingAnalysis}
            onClick={() => void handleEvaluateTable()}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 disabled:opacity-50"
          >
            {evaluatingAnalysis
              ? 'Memeriksa Analisis...'
              : 'Minta Umpan Balik Teman Detektif AI'}
          </button>
        </div>

        {aiFeedback && (
          <div className="mt-3 p-4 rounded-lg bg-sky-50 border border-sky-200 text-sm text-sky-950">
            <strong>Umpan Balik Analisis Kelompok:</strong> {aiFeedback}
          </div>
        )}
      </div>

      {/* Misi 3: Hubungkan Sebab dan Akibat */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-mono font-semibold text-sky-700 mb-1">
          Misi 3 · Hubungan Kausalitas Alur Cerita
        </p>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Hubungkan Sebab dan Akibat
        </h3>
        <p className="text-sm text-slate-600 mb-5">
          Cocokkan setiap kartu <strong>Penyebab</strong> dengan{' '}
          <strong>Peristiwa</strong> dan <strong>Akibat/Penyelesaian</strong> yang sesuai!
        </p>

        <div className="space-y-4">
          {LKPD_CAUSE_EFFECT_ITEMS.map((item, idx) => {
            const match = ceMatches[item.id] || { peristiwaId: '', akibatId: '' };
            const isRowCorrect =
              ceChecked &&
              match.peristiwaId === item.id &&
              match.akibatId === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${
                  ceChecked
                    ? isRowCorrect
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-amber-50/50 border-amber-300'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <p className="text-xs font-mono font-semibold text-slate-500 mb-1.5">
                  Rangkaian {idx + 1} · Penyebab
                </p>
                <p className="text-sm font-semibold text-slate-900 mb-3">
                  {item.penyebab}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      → Pilih Peristiwa yang Terjadi
                    </label>
                    <select
                      value={match.peristiwaId}
                      onChange={(e) => {
                        setCeMatches((prev) => ({
                          ...prev,
                          [item.id]: { ...match, peristiwaId: e.target.value },
                        }));
                        setCeChecked(false);
                      }}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">-- Pilih kartu peristiwa --</option>
                      {shuffledPeristiwa.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.peristiwa}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      → Pilih Akibat / Penyelesaian
                    </label>
                    <select
                      value={match.akibatId}
                      onChange={(e) => {
                        setCeMatches((prev) => ({
                          ...prev,
                          [item.id]: { ...match, akibatId: e.target.value },
                        }));
                        setCeChecked(false);
                      }}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">-- Pilih kartu akibat --</option>
                      {shuffledAkibat.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.akibat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setCeChecked(true)}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700"
          >
            Cek Pasangan Sebab-Akibat
          </button>
          {ceChecked && (
            <span className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
              {ceCorrectCount} / 3 rangkaian tepat
            </span>
          )}
        </div>
      </div>

      {/* Misi 4: Siapkan Presentasi */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-mono font-semibold text-sky-700 mb-1">
          Misi 4 · TP 2 (A5 - Menyatakan Secara Percaya Diri & Sopan)
        </p>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Siapkan Presentasi Kelompok
        </h3>
        <p className="text-sm text-slate-600 mb-5">
          Gunakan panduan berikut agar presentasi kelompokmu berjalan tertib, jelas, dan percaya diri di depan kelas!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              title: '1. Siapa yang Menyampaikan',
              guide:
                'Bagi peran secara adil: pembuka salam, penyampai urutan cerita, pembaca analisis unsur intrinsik, serta penanggap pertanyaan.',
            },
            {
              title: '2. Cara Menjelaskan Urutan Cerita',
              guide:
                'Tunjukkan urutan Panel 1 sampai 6 dengan kata penghubung waktu: "Awalnya...", "Kemudian...", "Hingga akhirnya...".',
            },
            {
              title: '3. Cara Menyampaikan Pendapat',
              guide:
                'Berbicara dengan suara jelas, pandangan menghadap teman sekelas, dan selalu sertakan bukti dari gambar/teks cerita.',
            },
            {
              title: '4. Cara Menanggapi Pendapat Lain dengan Sopan',
              guide:
                'Awali dengan menghargai: "Terima kasih atas pendapat Kelompok ..., menurut kelompok kami pada Panel ...".',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70"
            >
              <h4 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-700" />
                {card.title}
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {card.guide}
              </p>
            </div>
          ))}
        </div>

        {/* Pembagian Peran Presentasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {[
            { key: 'pembuka', label: 'Pembuka & Salam Kelompok' },
            { key: 'penjelasUrutan', label: 'Penyampai Urutan 6 Panel' },
            { key: 'penjelasUnsur', label: 'Pembaca Tabel Unsur Intrinsik' },
            { key: 'penanggap', label: 'Juru Bicara Penanggap Diskusi' },
          ].map((role) => (
            <div key={role.key}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role.label}
              </label>
              <input
                type="text"
                value={presenterMap[role.key as keyof typeof presenterMap]}
                onChange={(e) =>
                  setPresenterMap((prev) => ({
                    ...prev,
                    [role.key]: e.target.value,
                  }))
                }
                placeholder="Tulis nama anggota..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-6">
          {[
            'Kami sudah menyusun seluruh 6 gambar sesuai urutan alur cerita.',
            'Kami sudah berdiskusi mengisi analisis unsur intrinsik berdasarkan bukti.',
            'Kami siap menyampaikan hasil dengan percaya diri dan bahasa yang sopan.',
          ].map((label, i) => (
            <label
              key={i}
              className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={!!checklist[i]}
                onChange={(e) =>
                  setChecklist((prev) => ({ ...prev, [i]: e.target.checked }))
                }
                className="w-4 h-4 accent-sky-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {formError && (
          <div className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            {formError}
          </div>
        )}

        {savedSuccess && (
          <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Hasil LKPD <strong>{groupName} (Kelas {className})</strong> berhasil disimpan ke Progres Belajar dan Dasbor Guru secara realtime!
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('contoh-demonstrasi')}
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSubmitAll()}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Selesai & Simpan Hasil LKPD'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('latihan-individu')}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-2"
            >
              Lanjut ke Tantangan Individu
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

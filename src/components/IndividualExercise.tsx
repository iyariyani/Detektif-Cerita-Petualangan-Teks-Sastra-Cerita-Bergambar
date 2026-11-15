import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Home,
  Lightbulb,
  Send,
} from 'lucide-react';
import { LATIHAN_QUESTIONS, STORIES } from '../data/stories';
import {
  AhliQuestionScore,
  ClassRoom,
  MenuSectionId,
} from '../types';
import { StoryViewer } from './StoryViewer';
import { useRealtimeDate } from '../hooks/useRealtimeDate';
import { TutorContext } from './AiTutorDrawer';
import { soundManager } from '../utils/soundEffects';

interface IndividualExerciseProps {
  studentName: string;
  studentClass: ClassRoom;
  onUpdateIdentity: (name: string, cls: ClassRoom) => void;
  onNavigate: (target: MenuSectionId) => void;
  onCompleteExercise: (payload: {
    studentName: string;
    className: ClassRoom;
    realtimeDateLabel: string;
    pemulaScore: number;
    menengahScore: number;
    ahliScore: number;
    totalScore: number;
    ahliDetails: AhliQuestionScore[];
  }) => Promise<void>;
  onOpenTutor: (ctx: TutorContext) => void;
}

export const IndividualExercise: React.FC<IndividualExerciseProps> = ({
  studentName,
  studentClass,
  onUpdateIdentity,
  onNavigate,
  onCompleteExercise,
  onOpenTutor,
}) => {
  const story3 = STORIES['cerita-3'];
  const realtimeDate = useRealtimeDate();

  const [name, setName] = useState(studentName);
  const [cls, setCls] = useState<ClassRoom>(studentClass);
  const [activeLevel, setActiveLevel] = useState<'Pemula' | 'Menengah' | 'Ahli'>(
    'Pemula'
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [hintLevelByQ, setHintLevelByQ] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    pemulaScore: number;
    menengahScore: number;
    ahliScore: number;
    totalScore: number;
    ahliDetails: AhliQuestionScore[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const levelQuestions = LATIHAN_QUESTIONS.filter(
    (q) => q.level === activeLevel
  );
  const answeredCount = LATIHAN_QUESTIONS.filter(
    (q) => answers[q.id] !== undefined
  ).length;

  const handleNextHint = (qId: string) => {
    soundManager.playHint();
    setHintLevelByQ((prev) => ({
      ...prev,
      [qId]: Math.min(4, (prev[qId] || 0) + 1),
    }));
  };

  const handleSubmitAll = async () => {
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg('Tuliskan nama lengkapmu pada Identitas Peserta Didik di bagian atas terlebih dahulu.');
      return;
    }
    if (answeredCount < LATIHAN_QUESTIONS.length) {
      setErrorMsg(
        `Masih ada ${LATIHAN_QUESTIONS.length - answeredCount} soal yang belum dipilih jawabannya (periksa tab Level Pemula, Menengah, dan Ahli).`
      );
      return;
    }

    const ahliMissingReason = LATIHAN_QUESTIONS.filter(
      (q) => q.level === 'Ahli' && !(reasons[q.id] || '').trim()
    );
    if (ahliMissingReason.length > 0) {
      setErrorMsg(
        `Pada Level 3 (Detektif Ahli), tuliskan alasan/bukti cerita untuk seluruh 5 soal (sisa ${ahliMissingReason.length} soal belum diisi alasannya).`
      );
      setActiveLevel('Ahli');
      return;
    }

    setSubmitting(true);
    onUpdateIdentity(name.trim(), cls);

    try {
      const pemulaScore = LATIHAN_QUESTIONS.filter((q) => q.level === 'Pemula').reduce(
        (acc, q) => acc + (answers[q.id] === q.correctIndex ? q.weight : 0),
        0
      );
      const menengahScore = LATIHAN_QUESTIONS.filter(
        (q) => q.level === 'Menengah'
      ).reduce(
        (acc, q) => acc + (answers[q.id] === q.correctIndex ? q.weight : 0),
        0
      );

      const ahliQuestions = LATIHAN_QUESTIONS.filter((q) => q.level === 'Ahli');
      const ahliDetails: AhliQuestionScore[] = await Promise.all(
        ahliQuestions.map(async (q) => {
          const selectedIndex = answers[q.id] ?? null;
          const selectedCorrect = selectedIndex === q.correctIndex;
          const reasonText = (reasons[q.id] || '').trim();
          try {
            const res = await fetch('/api/ai/evaluate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mode: 'latihan-ahli',
                prompt: q.prompt,
                studentAnswer: reasonText,
                referenceKey: q.keyExplanation,
                selectedCorrect,
                expectedKeywords: q.expectedEvidenceKeywords,
              }),
            });
            const data = await res.json();
            return {
              questionId: q.id,
              selectedIndex,
              reasonText,
              pilihanScore: Number(data.pilihanScore ?? (selectedCorrect ? 2 : 0)),
              buktiScore: Number(data.buktiScore ?? 2),
              hubunganScore: Number(data.hubunganScore ?? 2),
              totalScore: Number(data.totalScore ?? (selectedCorrect ? 6 : 4)),
              feedback: String(data.feedback || ''),
            };
          } catch {
            const pilihanScore = selectedCorrect ? 2 : 0;
            return {
              questionId: q.id,
              selectedIndex,
              reasonText,
              pilihanScore,
              buktiScore: 3,
              hubunganScore: 3,
              totalScore: pilihanScore + 6,
              feedback: 'Jawaban dan bukti sudah dicatat.',
            };
          }
        })
      );

      const ahliScore = ahliDetails.reduce((acc, d) => acc + d.totalScore, 0);
      const totalScore = pemulaScore + menengahScore + ahliScore;

      await onCompleteExercise({
        studentName: name.trim(),
        className: cls,
        realtimeDateLabel: realtimeDate.fullLabel,
        pemulaScore,
        menengahScore,
        ahliScore,
        totalScore,
        ahliDetails,
      });

      setSubmittedResult({
        pemulaScore,
        menengahScore,
        ahliScore,
        totalScore,
        ahliDetails,
      });
      soundManager.playCelebration();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      {/* Header & Identitas Peserta Didik */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <p className="text-xs font-medium text-sky-700 mb-1">
          Tantangan Individu · Evaluasi Kemampuan C4 (15 Soal · Total Bobot 100)
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Soal Latihan Individu
        </h2>

        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="latihan-name"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Nama Peserta Didik
            </label>
            <input
              id="latihan-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tulis nama lengkapmu..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kelas
            </span>
            <div className="flex items-center gap-2">
              {(['6A', '6B'] as ClassRoom[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCls(c)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${
                    cls === c
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Kelas {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hari / Tanggal (Realtime)
            </span>
            <div className="px-3.5 py-2.5 text-xs font-mono tabular-nums rounded-lg border border-slate-200 bg-white text-slate-700">
              {realtimeDate.fullLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Cerita 3 */}
      <StoryViewer story={story3} />

      {/* Soal Berjenjang */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'Pemula' as const, label: 'Level 1 · Pemula (5 soal · 25 poin)' },
              { id: 'Menengah' as const, label: 'Level 2 · Menengah (5 soal · 25 poin)' },
              { id: 'Ahli' as const, label: 'Level 3 · Ahli (5 soal · 50 poin)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveLevel(tab.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeLevel === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
            Terjawab: {answeredCount} / {LATIHAN_QUESTIONS.length} soal
          </span>
        </div>

        <div className="space-y-6">
          {levelQuestions.map((q, idxInLevel) => {
            const currentHintStage = hintLevelByQ[q.id] || 0;
            const ahliDetail = submittedResult?.ahliDetails.find(
              (d) => d.questionId === q.id
            );
            const isChoiceCorrect = answers[q.id] === q.correctIndex;

            return (
              <article
                key={q.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-semibold text-sky-700 tabular-nums">
                      Soal {q.number} ({q.level} #{idxInLevel + 1})
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{q.questionType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Bobot {q.weight}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNextHint(q.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {currentHintStage === 0
                        ? 'Petunjuk/Hint'
                        : currentHintStage < 4
                          ? `Petunjuk Tahap ${currentHintStage + 1}/4`
                          : 'Semua Petunjuk Terbuka'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenTutor({
                          title: `Soal ${q.number} (${q.level})`,
                          storyContext: story3.panels
                            .map((p) => `Panel ${p.order}: ${p.narrative}`)
                            .join('\n'),
                          questionText: q.prompt,
                          hintStages: q.hintStages,
                          keyExplanation: q.keyExplanation,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Tanya AI
                    </button>
                  </div>
                </div>

                <p className="text-sm md:text-base font-semibold text-slate-900 mb-3 leading-relaxed">
                  {q.prompt}
                </p>

                {currentHintStage > 0 && (
                  <div className="mb-4 space-y-1.5">
                    {q.hintStages.slice(0, currentHintStage).map((hintText, hIdx) => (
                      <div
                        key={hIdx}
                        className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950"
                      >
                        <strong className="font-mono">Petunjuk {hIdx + 1}: </strong>
                        {hintText}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                        answers[q.id] === oIdx
                          ? 'bg-sky-50 border-sky-400 text-slate-900 font-medium'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        disabled={!!submittedResult}
                        checked={answers[q.id] === oIdx}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                        }
                        className="mt-1 accent-sky-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                {q.level === 'Ahli' && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {q.evidencePrompt}
                    </label>
                    <textarea
                      rows={3}
                      disabled={!!submittedResult}
                      value={reasons[q.id] || ''}
                      onChange={(e) =>
                        setReasons((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Tuliskan bukti panel atau kalimat cerita serta alasan yang menghubungkannya dengan pilihanmu..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                )}

                {submittedResult && (
                  <div
                    className={`mt-4 p-4 rounded-lg border text-xs leading-relaxed ${
                      isChoiceCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <p className="font-semibold mb-1">
                      {isChoiceCorrect
                        ? 'Pilihan jawabanmu tepat!'
                        : 'Pilihan jawaban perlu diperbaiki.'}{' '}
                      (Penjelasan: {q.keyExplanation})
                    </p>
                    {ahliDetail && (
                      <div className="mt-2 pt-2 border-t border-slate-200/70 space-y-1 font-mono tabular-nums">
                        <p>
                          Rincian Skor Ahli: Pilihan ({ahliDetail.pilihanScore}/2) + Bukti ({ahliDetail.buktiScore}/4) + Keterhubungan ({ahliDetail.hubunganScore}/4) ={' '}
                          <strong>{ahliDetail.totalScore}/10</strong>
                        </p>
                        <p className="font-sans text-slate-800">{ahliDetail.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Level switching / submit controls */}
        {errorMsg && (
          <div className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        {submittedResult && (
          <div className="mt-6 p-6 rounded-xl border border-slate-200 bg-slate-900 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-mono text-sky-300">
                  Hasil Evaluasi C4 · {name} (Kelas {cls})
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  Skor Total: {submittedResult.totalScore} / 100
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>
                  {submittedResult.totalScore >= 75
                    ? 'Memenuhi Kriteria Tuntas (Lanjut ke Pengayaan)'
                    : 'Perlu Penguatan Bertahap (Arahkan ke Remedial)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-mono tabular-nums mb-5">
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <p className="text-xs text-slate-400">Level 1 · Pemula</p>
                <p className="text-lg font-semibold">{submittedResult.pemulaScore} / 25</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <p className="text-xs text-slate-400">Level 2 · Menengah</p>
                <p className="text-lg font-semibold">{submittedResult.menengahScore} / 25</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <p className="text-xs text-slate-400">Level 3 · Ahli</p>
                <p className="text-lg font-semibold">{submittedResult.ahliScore} / 50</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {submittedResult.totalScore < 75 ? (
                <button
                  type="button"
                  onClick={() => onNavigate('remedial')}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 flex items-center gap-2"
                >
                  Lanjut ke Program Remedial (Cerita 4)
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('pengayaan')}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 flex items-center gap-2"
                >
                  Lanjut ke Tantangan Pengayaan (Cerita 5)
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('progres-belajar')}
                className="px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-sm font-medium hover:bg-slate-700"
              >
                Lihat Hasil & Progres Belajar
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('lkpd-kelompok')}
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

          <div className="flex flex-wrap items-center gap-2">
            {activeLevel !== 'Ahli' && (
              <button
                type="button"
                onClick={() =>
                  setActiveLevel(activeLevel === 'Pemula' ? 'Menengah' : 'Ahli')
                }
                className="px-4 py-2.5 text-sm font-semibold rounded-lg border border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 flex items-center gap-1.5"
              >
                Lanjut ke Level Berikutnya
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {!submittedResult && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleSubmitAll()}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Menilai Jawaban...' : 'Selesai & Cek Nilai Akhir'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

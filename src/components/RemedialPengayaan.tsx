import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  HelpCircle,
  Home,
  Save,
} from 'lucide-react';
import { ENRICHMENT_CHALLENGES, STORIES } from '../data/stories';
import { ClassRoom, MenuSectionId, StoryPanel } from '../types';
import { StoryViewer } from './StoryViewer';
import { StoryPanelIllustration } from './StoryPanelIllustration';
import { useRealtimeDate } from '../hooks/useRealtimeDate';
import { TutorContext } from './AiTutorDrawer';
import { soundManager } from '../utils/soundEffects';

interface RemedialPengayaanProps {
  mode: 'remedial' | 'pengayaan';
  studentName: string;
  studentClass: ClassRoom;
  onUpdateIdentity: (name: string, cls: ClassRoom) => void;
  onNavigate: (target: MenuSectionId) => void;
  onSaveRemedial: (payload: {
    studentName: string;
    className: ClassRoom;
    realtimeDateLabel: string;
    stageCompleted: number;
    score: number;
  }) => Promise<void>;
  onSavePengayaan: (payload: {
    studentName: string;
    className: ClassRoom;
    realtimeDateLabel: string;
    score: number;
    howIfAnswer: string;
  }) => Promise<void>;
  onOpenTutor: (ctx: TutorContext) => void;
}

const REMEDIAL_SCRAMBLED = [2, 0, 4, 1, 3]; // panels 3,1,5,2,4

export const RemedialPengayaan: React.FC<RemedialPengayaanProps> = ({
  mode,
  studentName,
  studentClass,
  onUpdateIdentity,
  onNavigate,
  onSaveRemedial,
  onSavePengayaan,
  onOpenTutor,
}) => {
  const realtimeDate = useRealtimeDate();
  const [name, setName] = useState(studentName);
  const [cls, setCls] = useState<ClassRoom>(studentClass);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // REMEDIAL STATE
  const story4 = STORIES['cerita-4'];
  const [remStage, setRemStage] = useState(1);
  const [rinaTrait, setRinaTrait] = useState('');
  const [kikoTrait, setKikoTrait] = useState('');
  const [remTempat, setRemTempat] = useState('');
  const [remWaktu, setRemWaktu] = useState('');
  const [remMasalah, setRemMasalah] = useState('');
  const [remPanels, setRemPanels] = useState<StoryPanel[]>(() =>
    REMEDIAL_SCRAMBLED.map((i) => story4.panels[i])
  );
  const [remDragIdx, setRemDragIdx] = useState<number | null>(null);
  const [remAmanat, setRemAmanat] = useState('');
  const [stageFeedback, setStageFeedback] = useState<string | null>(null);
  const [remSaved, setRemSaved] = useState(false);

  // PENGAYAAN STATE
  const story5 = STORIES['cerita-5'];
  const [enrChoices, setEnrChoices] = useState<Record<string, number>>({});
  const [enrTexts, setEnrTexts] = useState<Record<string, string>>({});
  const [howIfScenario, setHowIfScenario] = useState(
    'Jika Edo tidak menempelkan kertas catatan di atas peti kayu pada Panel 2'
  );
  const [howIfAnswer, setHowIfAnswer] = useState('');
  const [enrFeedback, setEnrFeedback] = useState<string | null>(null);
  const [enrSubmitting, setEnrSubmitting] = useState(false);
  const [enrSavedScore, setEnrSavedScore] = useState<number | null>(null);

  // ========== REMEDIAL VIEW (CERITA 4) ==========
  if (mode === 'remedial') {
    const moveRemPanel = (from: number, to: number) => {
      if (to < 0 || to >= remPanels.length) return;
      soundManager.playSwap();
      setRemPanels((prev) => {
        const next = [...prev];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
      });
    };

    const handleCheckRemStage = async () => {
      setStageFeedback(null);
      setErrorMsg(null);
      if (remStage === 1) {
        if (rinaTrait === 'penolong' && kikoTrait === 'pelupa') {
          soundManager.playSuccess();
          setStageFeedback(
            'Tepat! Rina bersifat penolong dan peduli (menawarkan payung), sedangkan Kiko bersifat pelupa namun tahu berterima kasih.'
          );
          setRemStage(2);
        } else {
          soundManager.playTryAgain();
          setStageFeedback(
            'Petunjuk Tahap 1: Amati siapa yang mengeluarkan payung dari tas (Panel 3) dan siapa yang lupa membawa payung (Panel 2).'
          );
        }
      } else if (remStage === 2) {
        if (remTempat === 'halte' && remWaktu === 'siang') {
          soundManager.playSuccess();
          setStageFeedback(
            'Bagus! Latar tempatnya di halte depan sekolah dan waktunya pukul 13.00 siang sepulang sekolah.'
          );
          setRemStage(3);
        } else {
          soundManager.playTryAgain();
          setStageFeedback(
            'Petunjuk Tahap 2: Lihat tulisan papan di Panel 1 ("HALTE SEKOLAH · 13:00"). Jam 13.00 termasuk waktu siang sepulang sekolah.'
          );
        }
      } else if (remStage === 3) {
        if (remMasalah === 'lupa-payung') {
          soundManager.playSuccess();
          setStageFeedback(
            'Benar sekali! Masalah muncul ketika Kiko sadar lupa membawa payung dan khawatir bukunya basah.'
          );
          setRemStage(4);
        } else {
          soundManager.playTryAgain();
          setStageFeedback(
            'Petunjuk Tahap 3: Konflik adalah hal yang membuat tokoh cemas. Perhatikan wajah cemas Kiko pada Panel 2!'
          );
        }
      } else if (remStage === 4) {
        const rightCount = remPanels.filter((p, idx) => p.order === idx + 1).length;
        if (rightCount === 5) {
          soundManager.playSuccess();
          setStageFeedback(
            'Luar biasa! Kelima peristiwa sudah tersusun runtut dengan alur maju yang benar.'
          );
          setRemStage(5);
        } else {
          soundManager.playTryAgain();
          setStageFeedback(
            `Sudah ${rightCount} dari 5 gambar yang tepat. Petunjuk: Mulai dari hujan turun di halte (Panel 1), Kiko cek tas (Panel 2), Rina tawarkan payung (Panel 3), berjalan bersama (Panel 4), lalu tiba dengan aman (Panel 5).`
          );
        }
      } else if (remStage === 5) {
        if (remAmanat === 'menolong') {
          if (!name.trim()) {
            setErrorMsg('Isi nama lengkapmu di bagian Identitas Remedial terlebih dahulu.');
            return;
          }
          onUpdateIdentity(name.trim(), cls);
          await onSaveRemedial({
            studentName: name.trim(),
            className: cls,
            realtimeDateLabel: realtimeDate.fullLabel,
            stageCompleted: 5,
            score: 100,
          });
          soundManager.playCelebration();
          setRemSaved(true);
          setStageFeedback(
            'Selamat! Kamu telah menuntaskan seluruh 5 tahap scaffolding Remedial dengan sangat baik!'
          );
        } else {
          soundManager.playTryAgain();
          setStageFeedback(
            'Petunjuk Tahap 5: Ingat kebaikan Rina berbagi payung biru dengan Kiko. Pesan apa yang bisa kita tiru saat melihat teman kesusahan?'
          );
        }
      }
    };

    return (
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-medium text-amber-700 mb-1">
                Program Pendampingan Bertahap · Cerita 4 (Sederhana · 5 Panel)
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Remedial: {story4.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                onOpenTutor({
                  title: `Remedial Tahap ${remStage}`,
                  storyContext: story4.panels
                    .map((p) => `Panel ${p.order}: ${p.narrative}`)
                    .join('\n'),
                  questionText: `Membantu siswa pada Tahap ${remStage} (Scaffolding Cerita 4: Payung Biru untuk Kiko).`,
                })
              }
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              Bantuan Teman Detektif
            </button>
          </div>

          {/* Identitas Remedial */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Peserta Didik
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap..."
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
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border ${
                      cls === c
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-700 border-slate-300'
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

        <StoryViewer story={story4} />

        {/* Scaffolding 5 Tahap */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { s: 1, t: '1. Kenali Tokoh' },
              { s: 2, t: '2. Kenali Latar' },
              { s: 3, t: '3. Temukan Masalah' },
              { s: 4, t: '4. Susun Peristiwa' },
              { s: 5, t: '5. Temukan Amanat' },
            ].map((item) => (
              <button
                key={item.s}
                type="button"
                onClick={() => {
                  if (item.s <= remStage) setRemStage(item.s);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  remStage === item.s
                    ? 'bg-sky-600 text-white border-sky-600'
                    : item.s < remStage
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                {item.t}
              </button>
            ))}
          </div>

          {remStage === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Tahap 1 – Kenali Tokoh (Rina dan Kiko)
              </h3>
              <p className="text-sm text-slate-600">
                Cocokkan masing-masing tokoh dengan sifat yang terlihat dari tindakannya dalam cerita:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Sifat Tokoh Rina (Panel 3–4)
                  </label>
                  <select
                    value={rinaTrait}
                    onChange={(e) => setRinaTrait(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">-- Pilih sifat Rina --</option>
                    <option value="penolong">
                      Penolong dan ramah (meminjamkan payung biru untuk temannya)
                    </option>
                    <option value="egois">
                      Egois (pergi pulang sendiri tanpa peduli teman)
                    </option>
                    <option value="pemarah">
                      Pemarah (memarahi Kiko di halte)
                    </option>
                  </select>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Sifat Tokoh Kiko (Panel 2 & 5)
                  </label>
                  <select
                    value={kikoTrait}
                    onChange={(e) => setKikoTrait(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">-- Pilih sifat Kiko --</option>
                    <option value="pelupa">
                      Pelupa tetapi sopan (lupa bawa payung, namun berterima kasih)
                    </option>
                    <option value="sombong">
                      Sombong (menolak bantuan teman saat hujan)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {remStage === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Tahap 2 – Kenali Latar (Tempat dan Waktu)
              </h3>
              <p className="text-sm text-slate-600">
                Amati gambar papan bertuliskan "HALTE SEKOLAH · 13:00" di Panel 1!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Latar Tempat
                  </label>
                  <select
                    value={remTempat}
                    onChange={(e) => setRemTempat(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">-- Pilih latar tempat --</option>
                    <option value="halte">Halte depan sekolah dan trotoar jalan pulang</option>
                    <option value="kantin">Kantin sekolah saat makan siang</option>
                    <option value="perpustakaan">Ruang perpustakaan sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Latar Waktu
                  </label>
                  <select
                    value={remWaktu}
                    onChange={(e) => setRemWaktu(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">-- Pilih latar waktu --</option>
                    <option value="pagi">Pukul 07.00 pagi saat berangkat</option>
                    <option value="siang">Pukul 13.00 siang saat pulang sekolah hujan</option>
                    <option value="malam">Pukul 21.00 malam hari</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {remStage === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Tahap 3 – Temukan Masalah (Konflik Cerita)
              </h3>
              <p className="text-sm text-slate-600">
                Pilih peristiwa yang menunjukkan masalah utama yang dialami Kiko!
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    id: 'lupa-payung',
                    text: 'Kiko lupa membawa payung saat hujan turun sepulang sekolah sehingga khawatir bukunya basah.',
                  },
                  {
                    id: 'lupa-sepatu',
                    text: 'Rina kehilangan sepatu olahraganya di lapangan sekolah.',
                  },
                  {
                    id: 'pulang-cerah',
                    text: 'Kiko dan Rina pulang berjalan kaki saat matahari bersinar terik.',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm cursor-pointer ${
                      remMasalah === opt.id
                        ? 'bg-sky-50 border-sky-400 font-medium'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="remMasalah"
                      checked={remMasalah === opt.id}
                      onChange={() => setRemMasalah(opt.id)}
                      className="mt-1 accent-sky-600"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {remStage === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Tahap 4 – Susun Peristiwa (5 Panel Alur Maju)
              </h3>
              <p className="text-sm text-slate-600">
                Seret (drag and drop) atau tekan tombol panah untuk mengurutkan 5 peristiwa dari awal hingga akhir!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {remPanels.map((panel, idx) => (
                  <div
                    key={panel.id}
                    draggable
                    onDragStart={() => setRemDragIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (remDragIdx !== null && remDragIdx !== idx) {
                        moveRemPanel(remDragIdx, idx);
                      }
                      setRemDragIdx(null);
                    }}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white cursor-grab flex flex-col"
                  >
                    <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border-b border-slate-200 text-xs font-mono font-semibold">
                      <span className="flex items-center gap-1">
                        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                        #{idx + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveRemPanel(idx, idx - 1)}
                          className="p-0.5 rounded border border-slate-200 bg-white disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === remPanels.length - 1}
                          onClick={() => moveRemPanel(idx, idx + 1)}
                          className="p-0.5 rounded border border-slate-200 bg-white disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <StoryPanelIllustration sceneKey={panel.sceneKey} />
                    <div className="p-2.5 text-xs text-slate-700 font-medium">
                      {panel.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {remStage === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Tahap 5 – Temukan Amanat Cerita
              </h3>
              <p className="text-sm text-slate-600">
                Pertanyaan pengarah: Setelah melihat Rina berbagi payung biru dan Kiko berjanji lebih teliti, pesan kebaikan apa yang tepat dari cerita ini?
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    id: 'menolong',
                    text: 'Saling menolong teman yang sedang kesulitan mempererat persahabatan, dan kita perlu teliti menyiapkan perlengkapan sebelum berangkat.',
                  },
                  {
                    id: 'diam',
                    text: 'Jika turun hujan sebaiknya menunggu sampai malam di sekolah sendirian.',
                  },
                  {
                    id: 'tidak-bawa-tas',
                    text: 'Tidak perlu membawa buku tulis ke sekolah agar tidak pernah basah.',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm cursor-pointer ${
                      remAmanat === opt.id
                        ? 'bg-sky-50 border-sky-400 font-medium'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="remAmanat"
                      checked={remAmanat === opt.id}
                      onChange={() => setRemAmanat(opt.id)}
                      className="mt-1 accent-sky-600"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {stageFeedback && (
            <div className="mt-5 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-950">
              {stageFeedback}
            </div>
          )}
          {errorMsg && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
              {errorMsg}
            </div>
          )}
          {remSaved && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Program Remedial selesai dan terekam di Progres Belajar serta Dasbor Guru!
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-200">
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
                type="button"
                onClick={() => void handleCheckRemStage()}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700"
              >
                {remStage < 5 ? `Cek Tahap ${remStage} & Lanjut` : 'Selesai Remedial'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('refleksi')}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                Refleksi
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ========== PENGAYAAN VIEW (CERITA 5) ==========
  const handleSubmitPengayaan = async () => {
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg('Isi nama lengkapmu pada Identitas Pengayaan di atas terlebih dahulu.');
      return;
    }
    if (!howIfAnswer.trim()) {
      setErrorMsg('Tuliskan analisis "Bagaimana Jika?" sebelum menyelesaikan Pengayaan.');
      return;
    }

    setEnrSubmitting(true);
    onUpdateIdentity(name.trim(), cls);

    let points = 0;
    for (const ch of ENRICHMENT_CHALLENGES) {
      if (ch.type === 'choice') {
        if (enrChoices[ch.id] === ch.correctIndex) points += 10;
      } else {
        if ((enrTexts[ch.id] || '').trim().length >= 12) points += 10;
      }
    }

    let howIfScore = 15;
    let howIfFeedback =
      'Analisis "Bagaimana Jika?" kamu sudah logis dan memperhitungkan perubahan alur serta penyelesaian.';
    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'pengayaan-howif',
          prompt: `Aktivitas Bagaimana Jika pada Cerita 5 (Jejak Misterius di Ruang Musik): ${howIfScenario}`,
          studentAnswer: howIfAnswer.trim(),
          referenceKey:
            'Jika catatan tidak ditempel atau Lani ikut menuduh, konflik kesalahpahaman akan memanjang, Edo lebih tertekan, alur investigasi tertunda, dan penyelesaian baru terjadi setelah Pak Bimo memeriksa seluruh ruangan satu per satu.',
        }),
      });
      const data = await res.json();
      howIfScore = Math.round((Number(data.scoreOutOf10 ?? 8) / 10) * 20);
      howIfFeedback = String(data.feedback || howIfFeedback);
    } catch {
      // keep fallback
    }

    const totalScore = Math.min(100, points + howIfScore);
    await onSavePengayaan({
      studentName: name.trim(),
      className: cls,
      realtimeDateLabel: realtimeDate.fullLabel,
      score: totalScore,
      howIfAnswer: `${howIfScenario} -> ${howIfAnswer.trim()}`,
    });

    setEnrSavedScore(totalScore);
    setEnrFeedback(howIfFeedback);
    setEnrSubmitting(false);
    soundManager.playCelebration();
  };

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-emerald-700 mb-1">
              Program Pengayaan · Cerita 5 (7 Panel Kompleks · 8 Tantangan + Bagaimana Jika)
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Pengayaan: {story5.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenTutor({
                title: 'Pengayaan Cerita 5',
                storyContext: story5.panels
                  .map((p) => `Panel ${p.order}: ${p.narrative}`)
                  .join('\n'),
                questionText:
                  'Membantu analisis tingkat lanjut pada Jejak Misterius di Ruang Musik.',
              })
            }
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            Bantuan Teman Detektif
          </button>
        </div>

        {/* Identitas Pengayaan */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Peserta Didik
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap..."
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
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border ${
                    cls === c
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-300'
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

      <StoryViewer story={story5} />

      {/* 8 Tantangan Advance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            8 Tantangan Detektif Tingkat Lanjut
          </h3>
          <p className="text-sm text-slate-600">
            Hubungkan informasi lintas panel untuk menjawab 8 tantangan analisis mendalam berikut.
          </p>
        </div>

        <div className="space-y-5">
          {ENRICHMENT_CHALLENGES.map((ch) => (
            <div
              key={ch.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50"
            >
              <p className="text-xs font-mono font-semibold text-sky-700 mb-1">
                Tantangan {ch.number} · {ch.aspect}
              </p>
              <p className="text-sm md:text-base font-semibold text-slate-900 mb-3">
                {ch.prompt}
              </p>

              {ch.type === 'choice' && ch.options ? (
                <div className="space-y-2">
                  {ch.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer ${
                        enrChoices[ch.id] === idx
                          ? 'bg-sky-50 border-sky-400 font-medium'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name={ch.id}
                        checked={enrChoices[ch.id] === idx}
                        onChange={() =>
                          setEnrChoices((prev) => ({ ...prev, [ch.id]: idx }))
                        }
                        className="mt-1 accent-sky-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={enrTexts[ch.id] || ''}
                  onChange={(e) =>
                    setEnrTexts((prev) => ({ ...prev, [ch.id]: e.target.value }))
                  }
                  placeholder="Tuliskan analisis lengkapmu berdasarkan bukti dari panel cerita..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              )}

              {enrSavedScore !== null && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                  <strong>Kunci Referensi: </strong>
                  {ch.sampleAnswer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Aktivitas BAGAIMANA JIKA? */}
        <div className="p-6 rounded-xl border border-sky-200 bg-sky-50/50 space-y-4">
          <div>
            <p className="text-xs font-mono font-semibold text-sky-800 mb-1">
              Tantangan Kreatif & Prediksi Alur
            </p>
            <h3 className="text-xl font-bold text-slate-900">
              Aktivitas “BAGAIMANA JIKA?”
            </h3>
            <p className="text-sm text-slate-700 mt-1">
              Pilih salah satu kondisi cerita yang diubah, lalu analisislah bagaimana <strong>konflik, alur, atau penyelesaian cerita</strong> akan berubah beserta alasannya!
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Perubahan Kondisi Cerita
            </label>
            <select
              value={howIfScenario}
              onChange={(e) => setHowIfScenario(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white"
            >
              <option value="Jika Edo tidak menempelkan kertas catatan di atas peti kayu pada Panel 2">
                Jika Edo tidak menempelkan kertas catatan di atas peti kayu pada Panel 2
              </option>
              <option value="Jika Lani ikut menuduh Edo tanpa memeriksa sudut ruang musik pada Panel 5">
                Jika Lani ikut menuduh Edo tanpa memeriksa sudut ruang musik pada Panel 5
              </option>
              <option value="Jika Edo langsung memberi tahu Tari lewat pesan setelah memperbaiki angklung di hari Rabu">
                Jika Edo langsung memberi tahu Tari setelah memperbaiki angklung di hari Rabu
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jika peristiwa tersebut terjadi berbeda, bagaimana konflik, alur, atau penyelesaian cerita akan berubah? Jelaskan alasanmu!
            </label>
            <textarea
              rows={4}
              value={howIfAnswer}
              onChange={(e) => setHowIfAnswer(e.target.value)}
              placeholder="Tuliskan prediksi perubahan konflik, alur, dan penyelesaian cerita disertai alasan logismu..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        {enrSavedScore !== null && (
          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Skor Pengayaan: {enrSavedScore} / 100</span>
            </div>
            {enrFeedback && (
              <p>
                <strong>Umpan Balik Aktivitas "Bagaimana Jika?":</strong> {enrFeedback}
              </p>
            )}
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

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={enrSubmitting}
              onClick={() => void handleSubmitPengayaan()}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {enrSubmitting ? 'Menilai & Menyimpan...' : 'Selesai & Simpan Pengayaan'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('refleksi')}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-2"
            >
              Lanjut ke Refleksi
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

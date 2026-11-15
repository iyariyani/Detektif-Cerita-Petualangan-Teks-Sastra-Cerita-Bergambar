import React, { useEffect, useState } from 'react';
import {
  Download,
  KeyRound,
  Lock,
  LogOut,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  AFFECTIVE_RUBRIC,
  ASSESSMENT_RUBRIC,
  ENRICHMENT_CHALLENGES,
  LATIHAN_QUESTIONS,
  MATERIAL_QUIZ,
  PSYCHOMOTOR_RUBRIC,
  STORIES,
} from '../data/stories';
import { TeacherSubmissionRecord } from '../types';

interface TeacherDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [verifiedPin, setVerifiedPin] = useState<string | null>(() =>
    sessionStorage.getItem('detektif_teacher_pin')
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rekap' | 'kunci' | 'rubrik'>('rekap');
  const [records, setRecords] = useState<TeacherSubmissionRecord[]>([]);
  const [liveConnected, setLiveConnected] = useState(false);
  const [filterClass, setFilterClass] = useState<'ALL' | '6A' | '6B'>('ALL');
  const [filterActivity, setFilterActivity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen || !verifiedPin) return;

    let closed = false;
    fetch('/api/teacher/records', {
      headers: { 'x-teacher-pin': verifiedPin },
    })
      .then((r) => {
        if (r.status === 401) {
          sessionStorage.removeItem('detektif_teacher_pin');
          setVerifiedPin(null);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!closed && data?.records) {
          setRecords(data.records);
        }
      })
      .catch(() => {});

    const es = new EventSource(
      `/api/teacher/stream?pin=${encodeURIComponent(verifiedPin)}`
    );
    es.onopen = () => {
      if (!closed) setLiveConnected(true);
    };
    es.onmessage = (evt) => {
      try {
        const parsed = JSON.parse(evt.data);
        if (parsed.type === 'records' && Array.isArray(parsed.records)) {
          setRecords(parsed.records);
        }
      } catch {
        // ignore parse errors
      }
    };
    es.onerror = () => {
      if (!closed) setLiveConnected(false);
    };

    return () => {
      closed = true;
      setLiveConnected(false);
      es.close();
    };
  }, [isOpen, verifiedPin]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      if (!res.ok) {
        setAuthError('Kode akses guru salah. Silakan periksa kembali.');
        return;
      }
      const cleanPin = pinInput.trim().toUpperCase();
      sessionStorage.setItem('detektif_teacher_pin', cleanPin);
      setVerifiedPin(cleanPin);
      setPinInput('');
    } catch {
      setAuthError('Gagal terhubung ke server.');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!verifiedPin) return;
    await fetch(`/api/teacher/records/${id}`, {
      method: 'DELETE',
      headers: { 'x-teacher-pin': verifiedPin },
    });
  };

  const handleUpdateRubric = async (
    id: string,
    field: 'a5Score' | 'p4Score',
    value: number
  ) => {
    if (!verifiedPin) return;
    await fetch(`/api/teacher/records/${id}/rubric`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-teacher-pin': verifiedPin,
      },
      body: JSON.stringify({ [field]: value }),
    });
  };

  const handleDownloadExcel = () => {
    if (!verifiedPin) return;
    window.location.href = `/api/teacher/export-excel?pin=${encodeURIComponent(
      verifiedPin
    )}`;
  };

  const filteredRecords = records.filter((r) => {
    if (filterClass !== 'ALL' && r.className !== filterClass) return false;
    if (filterActivity !== 'ALL' && r.activityType !== filterActivity) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.studentOrGroupName.toLowerCase().includes(q);
      const matchMember = (r.members || []).some((m) =>
        m.toLowerCase().includes(q)
      );
      if (!matchName && !matchMember) return false;
    }
    return true;
  });

  const latihanCount = records.filter(
    (r) => r.activityType === 'Latihan Individu'
  ).length;
  const lkpdCount = records.filter(
    (r) => r.activityType === 'LKPD Kelompok'
  ).length;
  const avgLatihan =
    latihanCount > 0
      ? Math.round(
          records
            .filter((r) => r.activityType === 'Latihan Individu')
            .reduce((acc, r) => acc + r.score, 0) / latihanCount
        )
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Dasbor Khusus Guru"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-slate-700" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dasbor Khusus Guru · Kelas 6A & 6B
              </h2>
              <p className="text-xs text-slate-500">
                Rekapitulasi Realtime, Ekspor Excel, Kunci Telaah 5 Cerita & Rubrik Asesmen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {verifiedPin && (
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem('detektif_teacher_pin');
                  setVerifiedPin(null);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Kunci Kembali
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70"
              aria-label="Tutup Dasbor Guru"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!verifiedPin ? (
          <div className="p-8 md:p-12 flex items-center justify-center">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4"
            >
              <div className="flex items-center gap-2.5 text-slate-900">
                <KeyRound className="w-5 h-5 text-sky-700" />
                <h3 className="text-base font-bold">
                  Verifikasi Akses Pendidik
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                Dasbor ini dikunci khusus untuk guru agar kunci jawaban dan rekap nilai peserta didik tetap terjaga.
              </p>
              <div>
                <label
                  htmlFor="teacher-pin"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Kode Akses Guru
                </label>
                <input
                  id="teacher-pin"
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan kode akses guru..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              {authError && (
                <p className="text-xs font-medium text-red-700">{authError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700"
              >
                Buka Dasbor Guru
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Navigation Tabs & Excel Export */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {[
                  { id: 'rekap' as const, label: 'Rekapitulasi Realtime' },
                  { id: 'kunci' as const, label: 'Kunci Telaah 5 Cerita' },
                  { id: 'rubrik' as const, label: 'Rubrik & Kisi-Kisi Asesmen' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                      activeTab === t.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      liveConnected ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {liveConnected ? 'Sinkronisasi Realtime Aktif' : 'Menghubungkan...'}
                </span>

                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Unduh File Excel (.xlsx)
                </button>
              </div>
            </div>

            {activeTab === 'rekap' && (
              <div className="space-y-5">
                {/* Summary KPI Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="text-xs text-slate-500">Total Kiriman Aktivitas</p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {records.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="text-xs text-slate-500">LKPD Kelompok Masuk</p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {lkpdCount}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="text-xs text-slate-500">Latihan Individu C4</p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                      {latihanCount}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="text-xs text-slate-500">Rata-Rata Nilai C4</p>
                    <p className="text-2xl font-bold font-mono tabular-nums text-sky-700 mt-1">
                      {avgLatihan} / 100
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari nama siswa atau kelompok..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300"
                    />
                  </div>
                  <select
                    value={filterClass}
                    onChange={(e) =>
                      setFilterClass(e.target.value as 'ALL' | '6A' | '6B')
                    }
                    className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="ALL">Semua Kelas</option>
                    <option value="6A">Kelas 6A</option>
                    <option value="6B">Kelas 6B</option>
                  </select>
                  <select
                    value={filterActivity}
                    onChange={(e) => setFilterActivity(e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="ALL">Semua Aktivitas</option>
                    <option value="Kuis Materi">Kuis Materi</option>
                    <option value="LKPD Kelompok">LKPD Kelompok</option>
                    <option value="Latihan Individu">Latihan Individu</option>
                    <option value="Remedial">Remedial</option>
                    <option value="Pengayaan">Pengayaan</option>
                    <option value="Refleksi">Refleksi</option>
                  </select>
                </div>

                {/* Data Table */}
                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                        <th className="p-3">Waktu Pelaksanaan</th>
                        <th className="p-3">Aktivitas</th>
                        <th className="p-3">Nama Siswa / Kelompok</th>
                        <th className="p-3">Kelas</th>
                        <th className="p-3">Kognitif (C4)</th>
                        <th className="p-3">Afektif (A5)</th>
                        <th className="p-3">Psikomotorik (P4)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            className="p-8 text-center text-sm text-slate-500"
                          >
                            Belum ada data pembelajaran yang tercatat. Data akan muncul secara otomatis dan realtime saat peserta didik atau kelompok menyelesaikan aktivitas.
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-50/70">
                            <td className="p-3 text-xs font-mono tabular-nums text-slate-600 whitespace-nowrap">
                              {rec.realtimeDateLabel}
                            </td>
                            <td className="p-3 font-medium text-slate-900 whitespace-nowrap">
                              {rec.activityType}
                            </td>
                            <td className="p-3">
                              <p className="font-semibold text-slate-900">
                                {rec.studentOrGroupName}
                              </p>
                              {rec.members && rec.members.length > 0 && (
                                <p className="text-xs text-slate-500">
                                  Anggota: {rec.members.join(', ')}
                                </p>
                              )}
                            </td>
                            <td className="p-3 font-mono tabular-nums">
                              {rec.className}
                            </td>
                            <td className="p-3 font-mono tabular-nums font-semibold text-sky-700 whitespace-nowrap">
                              {rec.score} / {rec.maxScore}
                            </td>
                            <td className="p-3">
                              <select
                                aria-label={`Nilai Afektif A5 untuk ${rec.studentOrGroupName}`}
                                value={rec.a5Score ?? ''}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    void handleUpdateRubric(
                                      rec.id,
                                      'a5Score',
                                      Number(e.target.value)
                                    );
                                  }
                                }}
                                className="px-2 py-1 text-xs rounded border border-slate-300 bg-white font-medium"
                              >
                                <option value="">Nilai A5...</option>
                                <option value="4">4 · Sangat Baik</option>
                                <option value="3">3 · Baik</option>
                                <option value="2">2 · Cukup</option>
                              </select>
                            </td>
                            <td className="p-3">
                              <select
                                aria-label={`Nilai Psikomotorik P4 untuk ${rec.studentOrGroupName}`}
                                value={rec.p4Score ?? ''}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    void handleUpdateRubric(
                                      rec.id,
                                      'p4Score',
                                      Number(e.target.value)
                                    );
                                  }
                                }}
                                className="px-2 py-1 text-xs rounded border border-slate-300 bg-white font-medium"
                              >
                                <option value="">Nilai P4...</option>
                                <option value="4">4 · Sangat Tepat</option>
                                <option value="3">3 · Tepat</option>
                                <option value="2">2 · Perlu Bimbingan</option>
                              </select>
                            </td>
                            <td className="p-3 text-xs font-medium text-slate-700">
                              {rec.status}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => void handleDeleteRecord(rec.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                                title="Hapus catatan ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'kunci' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Kunci Telaah Unsur Intrinsik — 5 Cerita Berbeda
                  </h3>
                  {Object.values(STORIES).map((story) => (
                    <div
                      key={story.id}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-base">
                          {story.title}
                        </h4>
                        <span className="text-xs font-mono text-sky-700">
                          {story.usedIn}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                        <div>
                          <strong className="text-slate-900">Tokoh & Penokohan: </strong>
                          <span className="text-slate-700">
                            {story.intrinsicKey.tokohDanPenokohan}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Latar: </strong>
                          <span className="text-slate-700">{story.intrinsicKey.latar}</span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Konflik: </strong>
                          <span className="text-slate-700">{story.intrinsicKey.konflik}</span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Penyelesaian: </strong>
                          <span className="text-slate-700">
                            {story.intrinsicKey.penyelesaian}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Alur: </strong>
                          <span className="text-slate-700">{story.intrinsicKey.alur}</span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Amanat: </strong>
                          <span className="text-slate-700">{story.intrinsicKey.amanat}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kunci Soal Latihan & Kuis */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-900 text-base mb-3">
                    Kunci Jawaban 15 Soal Latihan Individu (Cerita 3)
                  </h4>
                  <div className="space-y-2 text-xs">
                    {LATIHAN_QUESTIONS.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200"
                      >
                        <p className="font-semibold text-slate-900">
                          No. {q.number} ({q.level} · Bobot {q.weight}) — Jawaban Benar:{' '}
                          <span className="text-emerald-700">
                            Opsi {String.fromCharCode(65 + q.correctIndex)} ({q.options[q.correctIndex]})
                          </span>
                        </p>
                        <p className="text-slate-600 mt-0.5">{q.keyExplanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">
                      Kunci Kuis Pemahaman Materi (5 Soal)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {MATERIAL_QUIZ.map((mq, i) => (
                        <li key={mq.id}>
                          <strong>No. {i + 1}:</strong> {mq.options[mq.correctIndex]}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">
                      Kunci 8 Tantangan Pengayaan (Cerita 5)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {ENRICHMENT_CHALLENGES.map((ec) => (
                        <li key={ec.id}>
                          <strong>No. {ec.number} ({ec.aspect}):</strong> {ec.sampleAnswer}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rubrik' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Kisi-Kisi Asesmen Kemampuan Menganalisis (C4)
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                          <th className="p-3">No.</th>
                          <th className="p-3">Tingkat Kesulitan</th>
                          <th className="p-3">Indikator Soal</th>
                          <th className="p-3">Level</th>
                          <th className="p-3">Bentuk Soal</th>
                          <th className="p-3">No. Soal</th>
                          <th className="p-3">Bobot</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {ASSESSMENT_RUBRIC.map((row) => (
                          <tr key={row.no}>
                            <td className="p-3 font-mono tabular-nums">{row.no}</td>
                            <td className="p-3 font-medium text-slate-900">{row.tingkat}</td>
                            <td className="p-3 text-slate-700">{row.indikator}</td>
                            <td className="p-3 font-mono">{row.levelKognitif}</td>
                            <td className="p-3">{row.bentukSoal}</td>
                            <td className="p-3 font-mono tabular-nums">{row.nomorSoal}</td>
                            <td className="p-3 font-mono font-semibold tabular-nums">
                              {row.bobot}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-bold">
                          <td colSpan={6} className="p-3 text-right">
                            Total Bobot (15 Soal)
                          </td>
                          <td className="p-3 font-mono tabular-nums">100</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-900 text-sm mb-3">
                      Pedoman Pembobotan Per Tingkat
                    </h4>
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 text-slate-700">
                          <th className="py-2">Tingkat</th>
                          <th className="py-2">Jumlah</th>
                          <th className="py-2">Bobot/Soal</th>
                          <th className="py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                        <tr>
                          <td className="py-2 font-sans">Pemula</td>
                          <td className="py-2">5</td>
                          <td className="py-2">5</td>
                          <td className="py-2 font-semibold">25</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans">Menengah</td>
                          <td className="py-2">5</td>
                          <td className="py-2">5</td>
                          <td className="py-2 font-semibold">25</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-sans">Ahli</td>
                          <td className="py-2">5</td>
                          <td className="py-2">10</td>
                          <td className="py-2 font-semibold">50</td>
                        </tr>
                        <tr className="font-bold">
                          <td className="py-2 font-sans">Total</td>
                          <td className="py-2">15</td>
                          <td className="py-2">-</td>
                          <td className="py-2">100</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-900 text-sm mb-3">
                      Rincian Rubrik Skor Soal Ahli (Maksimal 10 Poin/Soal)
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span>Ketepatan memilih jawaban</span>
                        <strong className="font-mono tabular-nums">2 poin</strong>
                      </li>
                      <li className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span>Ketepatan bukti atau alasan yang diberikan</span>
                        <strong className="font-mono tabular-nums">4 poin</strong>
                      </li>
                      <li className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span>Kemampuan menghubungkan bukti dengan jawaban</span>
                        <strong className="font-mono tabular-nums">4 poin</strong>
                      </li>
                      <li className="flex justify-between pt-1 font-bold text-slate-900">
                        <span>Total Maksimal per Soal Ahli</span>
                        <span className="font-mono tabular-nums">10 poin</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 2. Rubrik Sikap Afektif A5 & 3. Rubrik Psikomotorik P4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[AFFECTIVE_RUBRIC, PSYCHOMOTOR_RUBRIC].map((rubric) => (
                    <div
                      key={rubric.id}
                      className="p-5 rounded-xl border border-slate-200 bg-white space-y-3"
                    >
                      <h4 className="font-bold text-slate-900 text-sm">
                        {rubric.title}
                      </h4>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                              <th className="p-2.5 w-32">Kategori (Skor)</th>
                              <th className="p-2.5">Indikator Deskriptif</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {rubric.items.map((item) => (
                              <tr key={item.level}>
                                <td className="p-2.5 font-semibold text-slate-900 align-top whitespace-nowrap">
                                  {item.level} ({item.skor})
                                </td>
                                <td className="p-2.5 text-slate-700 leading-relaxed">
                                  {item.deskripsi}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

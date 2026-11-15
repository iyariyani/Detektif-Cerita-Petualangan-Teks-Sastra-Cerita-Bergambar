import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const TEACHER_PIN = process.env.TEACHER_PIN || 'GURU6AB';
const DATA_DIR = path.join(__dirname, 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'learning-records.json');

interface LearningRecord {
  id: string;
  timestamp: string;
  realtimeDateLabel: string;
  activityType:
    | 'Kuis Materi'
    | 'LKPD Kelompok'
    | 'Latihan Individu'
    | 'Remedial'
    | 'Pengayaan'
    | 'Refleksi';
  studentOrGroupName: string;
  members?: string[];
  className: '6A' | '6B';
  score: number;
  maxScore: number;
  status: 'Belum Mulai' | 'Sedang Berproses' | 'Hampir Tuntas' | 'Tuntas';
  a5Score?: number;
  p4Score?: number;
  details: Record<string, unknown>;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(RECORDS_FILE)) {
    fs.writeFileSync(RECORDS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readRecords(): LearningRecord[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(RECORDS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecords(records: LearningRecord[]) {
  ensureDataDir();
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

const sseClients = new Set<express.Response>();

function broadcastRecords(records: LearningRecord[]) {
  const payload = `data: ${JSON.stringify({ type: 'records', records })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function isTeacherAuthorized(req: express.Request): boolean {
  const pin = req.headers['x-teacher-pin'] || req.query.pin;
  return typeof pin === 'string' && pin.trim().toUpperCase() === TEACHER_PIN.toUpperCase();
}

const STORY_KEYS_FOR_EXPORT = [
  {
    Cerita: 'Cerita 1 - Rahasia Bekal di Bangku Taman',
    Aktivitas: 'Contoh dan Demonstrasi',
    Tokoh_Penokohan:
      'Beni (ceroboh, mudah panik & menuduh, mau minta maaf), Raka (teliti, sabar, peduli), Siti (ramah).',
    Latar: 'Taman bacaan halaman sekolah, pagi pukul 09.30 saat jam istirahat.',
    Konflik: 'Tas bekal biru Beni hilang dari bangku taman sehingga ia hampir menuduh orang lain.',
    Penyelesaian: 'Raka memeriksa label nama tas dan menemukan tas Beni bergeser di rak bawah.',
    Alur: 'Alur maju (6 panel berurutan).',
    Amanat: 'Jangan terburu-buru menuduh sebelum memeriksa bukti dan fakta dengan teliti.',
  },
  {
    Cerita: 'Cerita 2 - Misteri Bibit Cabai di Kebun Kelas',
    Aktivitas: 'Misi Kelompok - LKPD',
    Tokoh_Penokohan:
      'Sinta (rajin, bertanggung jawab, pemaaf), Bagas (tergesa-gesa namun berani jujur), Bu Dewi (bijaksana).',
    Latar: 'Kebun sekolah dekat pohon mangga, pagi pukul 07.15 sebelum penilaian kebun.',
    Konflik: 'Pot cabai kelompok jatuh tersenggol Bagas saat mengejar bola dan ia sempat takut mengaku.',
    Penyelesaian: 'Bagas mengaku jujur, lalu bersama Sinta menanam ulang bibit dengan pot cadangan dan bilah bambu.',
    Alur: 'Alur maju (6 panel disusun dari kondisi acak).',
    Amanat: 'Berani mengakui kesalahan dengan jujur dan bekerja sama memperbaikinya jauh lebih terpuji.',
  },
  {
    Cerita: 'Cerita 3 - Lentera Hujan di Pos Ronda',
    Aktivitas: 'Tantangan Individu - Soal Latihan (C4)',
    Tokoh_Penokohan:
      'Dimas (awalnya enggan karena gim -> berkembang menjadi peduli, sigap, bertanggung jawab), Nenek Sari (sabar, cemas saat gelap), Pak RT Anton & Ayah (sigap, apresiatif).',
    Latar: 'Kampung Melati (teras, jalan setapak dekat jembatan kecil, Pos Ronda), pukul 17.45 sore menjelang malam hingga malam hujan deras & listrik padam.',
    Konflik: 'Hujan deras dan mati lampu membuat jembatan tergenang gelap sementara senter Nenek Sari mati.',
    Penyelesaian: 'Dimas memayungi dan menerangi jalan dengan lentera untuk menuntun Nenek Sari ke Pos Ronda.',
    Alur: 'Alur maju (6 panel: pengenalan -> hujan & padam -> hampir terpeleset -> klimaks bertemu Nenek Sari -> menuntun -> apresiasi Pak RT).',
    Amanat: 'Kepedulian dan keberanian membantu sesama lebih berharga daripada kesenangan pribadi.',
  },
  {
    Cerita: 'Cerita 4 - Payung Biru untuk Kiko',
    Aktivitas: 'Remedial (Scaffolding 5 Tahap)',
    Tokoh_Penokohan: 'Rina (penolong, ramah), Kiko (pelupa, sopan, tahu berterima kasih).',
    Latar: 'Halte depan sekolah dan trotoar, siang pukul 13.00 saat hujan pulang sekolah.',
    Konflik: 'Kiko lupa membawa payung sehingga khawatir buku di tasnya basah kehujanan.',
    Penyelesaian: 'Rina meminjamkan dan berbagi payung biru untuk pulang bersama.',
    Alur: 'Alur maju (5 panel sederhana).',
    Amanat: 'Saling menolong teman yang kesusahan mempererat persahabatan dan selalu teliti menyiapkan barang.',
  },
  {
    Cerita: 'Cerita 5 - Jejak Misterius di Ruang Musik',
    Aktivitas: 'Pengayaan (8 Tantangan + Bagaimana Jika)',
    Tokoh_Penokohan:
      'Tari (disiplin, awalnya mudah curiga -> mau minta maaf), Edo (teliti, pemalu -> berani bicara jujur), Lani (observatif), Pak Bimo (adil).',
    Latar: 'Ruang Musik SD Harapan, Rabu sore hingga Kamis siang menjelang Pentas Seni Jumat.',
    Konflik:
      'Utama: Angklung nada Do hilang dari rak. Pendukung: Tari menuduh Edo tanpa bukti dan kurangnya komunikasi.',
    Penyelesaian:
      'Lani menemukan label catatan di peti kayu; Pak Bimo memeriksa dan menemukan angklung yang sudah diperbaiki Edo.',
    Alur: 'Alur maju dengan konteks latar belakang Rabu sore -> Kamis siang (7 panel).',
    Amanat: 'Jangan berprasangka tanpa bukti dan biasakan komunikasi terbuka dalam tim.',
  },
];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Submit / save student or group record
  app.post('/api/submissions', (req, res) => {
    const body = req.body as Partial<LearningRecord>;
    if (!body.activityType || !body.studentOrGroupName || !body.className) {
      return res.status(400).json({ error: 'Data identitas dan aktivitas wajib dilengkapi.' });
    }

    const records = readRecords();
    const record: LearningRecord = {
      id: body.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      realtimeDateLabel:
        body.realtimeDateLabel ||
        new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      activityType: body.activityType,
      studentOrGroupName: body.studentOrGroupName.trim(),
      members: Array.isArray(body.members) ? body.members : undefined,
      className: body.className === '6B' ? '6B' : '6A',
      score: Number(body.score ?? 0),
      maxScore: Number(body.maxScore ?? 100),
      status: body.status || 'Sedang Berproses',
      a5Score: body.a5Score !== undefined ? Number(body.a5Score) : undefined,
      p4Score: body.p4Score !== undefined ? Number(body.p4Score) : undefined,
      details: body.details || {},
    };

    const existingIndex = records.findIndex(
      (r) =>
        r.activityType === record.activityType &&
        r.className === record.className &&
        r.studentOrGroupName.toLowerCase() === record.studentOrGroupName.toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = records[existingIndex];
      records[existingIndex] = {
        ...record,
        id: existing.id,
        a5Score: record.a5Score ?? existing.a5Score,
        p4Score: record.p4Score ?? existing.p4Score,
      };
    } else {
      records.unshift(record);
    }

    writeRecords(records);
    broadcastRecords(records);
    res.json({ ok: true, record });
  });

  // Teacher auth check
  app.post('/api/teacher/login', (req, res) => {
    const { pin } = req.body as { pin?: string };
    if (typeof pin === 'string' && pin.trim().toUpperCase() === TEACHER_PIN.toUpperCase()) {
      return res.json({ ok: true });
    }
    return res.status(401).json({ ok: false, error: 'Kode akses guru tidak sesuai.' });
  });

  // Teacher get all records
  app.get('/api/teacher/records', (req, res) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).json({ error: 'Akses guru diperlukan.' });
    }
    res.json({ records: readRecords() });
  });

  // Teacher SSE realtime stream
  app.get('/api/teacher/stream', (req, res) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).end();
    }
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const current = readRecords();
    res.write(`data: ${JSON.stringify({ type: 'records', records: current })}\n\n`);

    sseClients.add(res);
    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // Teacher update A5 & P4 rubric scores
  app.patch('/api/teacher/records/:id/rubric', (req, res) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).json({ error: 'Akses guru diperlukan.' });
    }
    const { a5Score, p4Score } = req.body as {
      a5Score?: number;
      p4Score?: number;
    };
    const records = readRecords();
    const idx = records.findIndex((r) => r.id === req.params.id);
    if (idx < 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan.' });
    }
    if (a5Score !== undefined) {
      records[idx].a5Score = Math.min(4, Math.max(2, Number(a5Score)));
    }
    if (p4Score !== undefined) {
      records[idx].p4Score = Math.min(4, Math.max(2, Number(p4Score)));
    }
    writeRecords(records);
    broadcastRecords(records);
    res.json({ ok: true, record: records[idx] });
  });

  // Delete single record
  app.delete('/api/teacher/records/:id', (req, res) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).json({ error: 'Akses guru diperlukan.' });
    }
    const records = readRecords().filter((r) => r.id !== req.params.id);
    writeRecords(records);
    broadcastRecords(records);
    res.json({ ok: true });
  });

  // Export Excel (.xlsx) for Teacher Dashboard
  app.get('/api/teacher/export-excel', (req, res) => {
    if (!isTeacherAuthorized(req)) {
      return res.status(401).json({ error: 'Akses guru diperlukan.' });
    }

    const records = readRecords();
    const workbook = XLSX.utils.book_new();

    const rekapRows = records.map((r, idx) => ({
      No: idx + 1,
      Waktu_Pelaksanaan: r.realtimeDateLabel,
      Aktivitas: r.activityType,
      Nama_Siswa_atau_Kelompok: r.studentOrGroupName,
      Anggota_Kelompok: r.members ? r.members.filter(Boolean).join(', ') : '-',
      Kelas: r.className,
      Skor_Kognitif: r.score,
      Skor_Maksimal: r.maxScore,
      Persentase: r.maxScore > 0 ? `${Math.round((r.score / r.maxScore) * 100)}%` : '0%',
      Skor_Afektif_A5: r.a5Score ?? '-',
      Predikat_A5:
        r.a5Score === 4
          ? 'Sangat Baik'
          : r.a5Score === 3
            ? 'Baik'
            : r.a5Score === 2
              ? 'Cukup'
              : '-',
      Skor_Psikomotorik_P4: r.p4Score ?? '-',
      Predikat_P4:
        r.p4Score === 4
          ? 'Sangat Tepat'
          : r.p4Score === 3
            ? 'Tepat'
            : r.p4Score === 2
              ? 'Perlu Bimbingan'
              : '-',
      Status_Progres: r.status,
    }));

    const wsRekap = XLSX.utils.json_to_sheet(
      rekapRows.length > 0
        ? rekapRows
        : [
            {
              Info: 'Belum ada data pengerjaan siswa atau kelompok yang terekam.',
            },
          ]
    );
    XLSX.utils.book_append_sheet(workbook, wsRekap, 'Rekapitulasi_Realtime');

    const latihanRows = records
      .filter((r) => r.activityType === 'Latihan Individu')
      .map((r, idx) => ({
        No: idx + 1,
        Nama_Siswa: r.studentOrGroupName,
        Kelas: r.className,
        Hari_Tanggal: r.realtimeDateLabel,
        Skor_Pemula_Max25: Number(r.details?.pemulaScore ?? 0),
        Skor_Menengah_Max25: Number(r.details?.menengahScore ?? 0),
        Skor_Ahli_Max50: Number(r.details?.ahliScore ?? 0),
        Total_Skor_Max100: r.score,
        Rekomendasi: r.score >= 75 ? 'Pengayaan' : 'Remedial',
        Status: r.status,
      }));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        latihanRows.length > 0 ? latihanRows : [{ Info: 'Belum ada data Latihan Individu.' }]
      ),
      'Latihan_Individu_C4'
    );

    const lkpdRows = records
      .filter((r) => r.activityType === 'LKPD Kelompok')
      .map((r, idx) => ({
        No: idx + 1,
        Kelompok: r.studentOrGroupName,
        Kelas: r.className,
        Anggota: (r.members || []).filter(Boolean).join(', '),
        Hari_Tanggal: r.realtimeDateLabel,
        Urutan_Gambar_Benar: r.details?.orderCorrect ? 'Ya' : 'Perlu Perbaikan',
        Skor_Sebab_Akibat: Number(r.details?.causeEffectScore ?? 0),
        Analisis_Tokoh: String(r.details?.tokoh ?? ''),
        Analisis_Latar: String(r.details?.latar ?? ''),
        Analisis_Konflik: String(r.details?.konflik ?? ''),
        Analisis_Penyelesaian: String(r.details?.penyelesaian ?? ''),
        Analisis_Alur: String(r.details?.alur ?? ''),
        Analisis_Amanat: String(r.details?.amanat ?? ''),
        Total_Skor: r.score,
      }));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        lkpdRows.length > 0 ? lkpdRows : [{ Info: 'Belum ada data LKPD Kelompok.' }]
      ),
      'LKPD_Kelompok'
    );

    const remPengRows = records
      .filter((r) => r.activityType === 'Remedial' || r.activityType === 'Pengayaan')
      .map((r, idx) => ({
        No: idx + 1,
        Jenis: r.activityType,
        Nama_Siswa: r.studentOrGroupName,
        Kelas: r.className,
        Hari_Tanggal: r.realtimeDateLabel,
        Skor: r.score,
        Skor_Maksimal: r.maxScore,
        Status: r.status,
        Catatan_Bagaimana_Jika: String(r.details?.howIfAnswer ?? '-'),
      }));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        remPengRows.length > 0
          ? remPengRows
          : [{ Info: 'Belum ada data Remedial atau Pengayaan.' }]
      ),
      'Remedial_dan_Pengayaan'
    );

    const refleksiRows = records
      .filter((r) => r.activityType === 'Refleksi')
      .map((r, idx) => ({
        No: idx + 1,
        Nama_Siswa: r.studentOrGroupName,
        Kelas: r.className,
        Hari_Tanggal: r.realtimeDateLabel,
        Pelajaran_Hari_Ini: String((r.details?.answers as Record<string, string>)?.['0'] ?? ''),
        Unsur_Termudah: String((r.details?.answers as Record<string, string>)?.['1'] ?? ''),
        Unsur_Tersulit: String((r.details?.answers as Record<string, string>)?.['2'] ?? ''),
        Strategi_Menentukan_Jawaban: String((r.details?.answers as Record<string, string>)?.['3'] ?? ''),
        Pengalaman_Kelompok: String((r.details?.answers as Record<string, string>)?.['4'] ?? ''),
        Rencana_Percaya_Diri: String((r.details?.answers as Record<string, string>)?.['5'] ?? ''),
      }));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(
        refleksiRows.length > 0 ? refleksiRows : [{ Info: 'Belum ada data Refleksi.' }]
      ),
      'Refleksi_Siswa'
    );

    const wsKunci = XLSX.utils.json_to_sheet(STORY_KEYS_FOR_EXPORT);
    XLSX.utils.book_append_sheet(workbook, wsKunci, 'Kunci_Telaah_5_Cerita');

    const rubrikA5P4Rows = [
      {
        Ranah: 'Afektif A5 - Percaya Diri & Santun',
        Predikat: 'Sangat Baik',
        Skor: 4,
        Deskripsi:
          'Berani berbicara tanpa ragu, artikulasi jelas, dan menanggapi teman dengan santun.',
      },
      {
        Ranah: 'Afektif A5 - Percaya Diri & Santun',
        Predikat: 'Baik',
        Skor: 3,
        Deskripsi: 'Percaya diri saat membaca catatan dan santun mendengarkan rekan lain.',
      },
      {
        Ranah: 'Afektif A5 - Percaya Diri & Santun',
        Predikat: 'Cukup',
        Skor: 2,
        Deskripsi: 'Sesekali ragu namun tetap menyelesaikan presentasi kelompok.',
      },
      {
        Ranah: 'Psikomotorik P4 - Rekonstruksi Alur Runtut',
        Predikat: 'Sangat Tepat',
        Skor: 4,
        Deskripsi: 'Seluruh 6 panel gambar acak tersusun sesuai kaidah alur kronologis 100%.',
      },
      {
        Ranah: 'Psikomotorik P4 - Rekonstruksi Alur Runtut',
        Predikat: 'Tepat',
        Skor: 3,
        Deskripsi: '4–5 panel tersusun benar dengan penjelasan hubungan sebab-akibat.',
      },
      {
        Ranah: 'Psikomotorik P4 - Rekonstruksi Alur Runtut',
        Predikat: 'Perlu Bimbingan',
        Skor: 2,
        Deskripsi: 'Kurang dari 4 panel, diarahkan ke penguatan alur di Remedial.',
      },
    ];
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(rubrikA5P4Rows),
      'Rubrik_A5_dan_P4'
    );

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Rekap_Detektif_Cerita_Kelas_6_${new Date().toISOString().slice(0, 10)}.xlsx"`
    );
    res.send(buffer);
  });

  // AI Tutor: "Teman Detektif Cerita" with 4-stage progressive scaffolding
  app.post('/api/ai/tutor', async (req, res) => {
    const {
      petunjukLevel = 1,
      questionText,
      storyContext,
      studentMessage,
      hintStages,
      keyExplanation,
    } = req.body as {
      petunjukLevel?: number;
      questionText?: string;
      storyContext?: string;
      studentMessage?: string;
      hintStages?: string[];
      keyExplanation?: string;
    };

    const stage = Math.min(4, Math.max(1, Number(petunjukLevel)));
    const ai = getGenAIClient();

    if (!ai) {
      const fallbackText =
        hintStages && hintStages[stage - 1]
          ? hintStages[stage - 1]
          : stage === 1
            ? 'Coba amati kembali gambar dan baca keterangan waktunya: kira-kira peristiwa apa yang memicu masalah tokoh?'
            : stage === 2
              ? 'Perhatikan bukti tindakan tokoh di panel tengah cerita dan hubungkan dengan suasana pada gambar.'
              : stage === 3
                ? 'Cara berpikir detektif: cocokkan bukti gambar dengan kalimat teks, lalu singkirkan pilihan yang bertentangan.'
                : `Arah jawaban: ${keyExplanation || 'Periksa kembali bukti utama di panel cerita yang paling relevan.'}`;
      return res.json({ reply: fallbackText, stage, source: 'guided-fallback' });
    }

    const stageInstructions: Record<number, string> = {
      1: 'TAHAP 1 (Pertanyaan Pengarah): Berikan 1–2 pertanyaan pemantik sederhana yang mengarahkan siswa mengamati gambar dan teks. DILARANG menyebutkan jawaban atau kunci pilihan.',
      2: 'TAHAP 2 (Menunjukkan Informasi Penting): Tunjukkan bagian panel/informasi penting dalam cerita yang perlu diperhatikan siswa tanpa langsung membocorkan kesimpulan jawabannya.',
      3: 'TAHAP 3 (Contoh Cara Berpikir): Berikan contoh langkah berpikir analitis seorang detektif (misalnya menghubungkan kondisi sebab dengan akibat pada gambar), tetap jangan langsung memberi tahu huruf/pilihan final.',
      4: 'TAHAP 4 (Mengarahkan Menuju Jawaban): Bantu siswa menarik kesimpulan akhir dengan petunjuk yang sangat jelas menuju jawaban yang benar dan jelaskan alasannya secara ramah.',
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Konteks Cerita: ${storyContext || 'Cerita bergambar Bahasa Indonesia Kelas VI SD'}
Pertanyaan / Tugas yang sedang dikerjakan siswa: ${questionText || 'Menganalisis unsur intrinsik cerita bergambar'}
${studentMessage ? `Pesan/pertanyaan siswa: "${studentMessage}"` : 'Siswa meminta petunjuk belajar.'}
Catatan petunjuk internal: ${(hintStages || []).join(' | ')}
Penjelasan konsep: ${keyExplanation || '-'}`,
        config: {
          systemInstruction: `Kamu adalah "Teman Detektif Cerita", tutor AI ramah dan komunikatif untuk siswa kelas VI SD (usia 11-12 tahun) dalam pembelajaran Bahasa Indonesia model Problem Based Learning (PBL).
Gunakan bahasa Indonesia yang sopan, hangat, singkat (maksimal 3-4 kalimat), dan mudah dipahami anak kelas VI SD.
ATURAN KETAT: ${stageInstructions[stage]}
Jika siswa mengirim pesan atau jawaban percobaan, hargai usahanya terlebih dahulu lalu beri bimbingan sesuai tahap ${stage}.`,
        },
      });

      res.json({
        reply:
          response.text?.trim() ||
          hintStages?.[stage - 1] ||
          'Ayo periksa lagi detail gambar dan kalimat narasi di panel cerita!',
        stage,
        source: 'gemini',
      });
    } catch (err) {
      console.error('Gemini tutor error:', err);
      const fallbackText =
        hintStages?.[stage - 1] ||
        'Ayo amati kembali gambar pada panel cerita, lalu hubungkan tindakan tokoh dengan teks di bawah gambar.';
      res.json({ reply: fallbackText, stage, source: 'fallback' });
    }
  });

  // AI Evaluator for open-ended C4 answers, LKPD table, and Pengayaan "Bagaimana Jika?"
  app.post('/api/ai/evaluate', async (req, res) => {
    const {
      mode,
      prompt,
      studentAnswer,
      referenceKey,
      selectedCorrect,
      expectedKeywords,
    } = req.body as {
      mode: 'latihan-ahli' | 'lkpd-unsur' | 'pengayaan-analysis' | 'pengayaan-howif';
      prompt: string;
      studentAnswer: string;
      referenceKey: string;
      selectedCorrect?: boolean;
      expectedKeywords?: string[];
    };

    const trimmed = (studentAnswer || '').trim();
    if (!trimmed) {
      return res.json({
        pilihanScore: selectedCorrect ? 2 : 0,
        buktiScore: 0,
        hubunganScore: 0,
        totalScore: selectedCorrect ? 2 : 0,
        scoreOutOf10: selectedCorrect ? 2 : 0,
        feedback: 'Kamu belum menuliskan alasan atau bukti dari cerita. Coba tuliskan bukti dari panel cerita ya!',
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      // Deterministic rubric fallback
      const lower = trimmed.toLowerCase();
      const hits = (expectedKeywords || []).filter((kw) => lower.includes(kw.toLowerCase())).length;
      const wordCount = trimmed.split(/\s+/).length;
      if (mode === 'latihan-ahli') {
        const pilihanScore = selectedCorrect ? 2 : 0;
        const buktiScore = hits >= 2 ? 4 : hits === 1 || wordCount >= 8 ? 3 : 1;
        const hubunganScore = wordCount >= 10 && hits >= 1 ? 4 : wordCount >= 5 ? 2 : 1;
        return res.json({
          pilihanScore,
          buktiScore,
          hubunganScore,
          totalScore: pilihanScore + buktiScore + hubunganScore,
          feedback:
            hits >= 2
              ? 'Bagus! Kamu sudah menyertakan bukti cerita dan menghubungkannya dengan alasan yang logis.'
              : 'Alasanmu sudah mengarah ke cerita, coba sebutkan bukti panel atau peristiwa secara lebih spesifik lagi.',
        });
      }
      const scoreOutOf10 = wordCount >= 12 ? 9 : wordCount >= 6 ? 7 : 5;
      return res.json({
        scoreOutOf10,
        feedback:
          'Analisis kamu sudah baik dan logis. Pastikan selalu mengaitkan perubahan peristiwa dengan tokoh, konflik, dan penyelesaiannya.',
      });
    }

    try {
      if (mode === 'latihan-ahli') {
        const pilihanScore = selectedCorrect ? 2 : 0;
        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `Soal: ${prompt}
Kunci Jawaban & Bukti Referensi: ${referenceKey}
Ketepatan Pilihan Ganda Siswa: ${selectedCorrect ? 'BENAR (2/2)' : 'BELUM TEPAT (0/2)'}
Alasan dan Bukti Tertulis Siswa: "${trimmed}"`,
          config: {
            systemInstruction: `Kamu adalah penilai rubrik Bahasa Indonesia Kelas VI SD untuk soal analisis C4 Pilihan Ganda Beralasan.
Nilai alasan tertulis siswa secara adil untuk anak SD kelas VI berdasarkan dua aspek:
1. buktiScore (0-4): Ketepatan bukti atau alasan berdasarkan cerita (panel, tindakan tokoh, latar, atau teks).
2. hubunganScore (0-4): Kemampuan menghubungkan bukti dengan jawaban pilihan secara logis.
Berikan umpan balik singkat (1-2 kalimat) yang memotivasi dan menjelaskan kekuatan/kekurangan alasan siswa.`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                buktiScore: { type: Type.INTEGER },
                hubunganScore: { type: Type.INTEGER },
                feedback: { type: Type.STRING },
              },
              required: ['buktiScore', 'hubunganScore', 'feedback'],
            },
          },
        });
        const parsed = JSON.parse((response.text || '{}').trim());
        const buktiScore = Math.min(4, Math.max(0, Number(parsed.buktiScore ?? 2)));
        const hubunganScore = Math.min(4, Math.max(0, Number(parsed.hubunganScore ?? 2)));
        return res.json({
          pilihanScore,
          buktiScore,
          hubunganScore,
          totalScore: pilihanScore + buktiScore + hubunganScore,
          feedback: String(parsed.feedback || 'Alasan sudah dinilai berdasarkan bukti cerita.'),
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Tugas/Pertanyaan: ${prompt}
Kunci Referensi: ${referenceKey}
Jawaban Siswa/Kelompok: "${trimmed}"`,
        config: {
          systemInstruction: `Kamu adalah guru Bahasa Indonesia Kelas VI SD yang menilai analisis unsur intrinsik cerita bergambar atau tugas "Bagaimana Jika?".
Berikan skor 1-10 secara adil untuk siswa kelas VI SD dan umpan balik konstruktif 2 kalimat yang sopan dan menyemangati.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scoreOutOf10: { type: Type.INTEGER },
              feedback: { type: Type.STRING },
            },
            required: ['scoreOutOf10', 'feedback'],
          },
        },
      });
      const parsed = JSON.parse((response.text || '{}').trim());
      return res.json({
        scoreOutOf10: Math.min(10, Math.max(1, Number(parsed.scoreOutOf10 ?? 8))),
        feedback: String(parsed.feedback || 'Analisis yang baik dan sesuai dengan isi cerita.'),
      });
    } catch (err) {
      console.error('Gemini evaluate error:', err);
      const pilihanScore = selectedCorrect ? 2 : 0;
      return res.json({
        pilihanScore,
        buktiScore: 3,
        hubunganScore: 3,
        totalScore: pilihanScore + 6,
        scoreOutOf10: 8,
        feedback: 'Jawabanmu sudah terekam dan dinilai dengan baik.',
      });
    }
  });

  // Indonesian Story Audio Narration (Gemini 3.8 TTS with in-memory cache)
  const ttsAudioCache = new Map<string, string>();
  app.post('/api/ai/tts', async (req, res) => {
    const { text } = req.body as { text?: string };
    const cleanText = (text || '').trim().slice(0, 1400);
    if (!cleanText) {
      return res.status(400).json({ error: 'Teks audio tidak boleh kosong.' });
    }

    const cached = ttsAudioCache.get(cleanText);
    if (cached) {
      return res.json({ audioBase64: cached, mimeType: 'audio/wav', cached: true });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'TTS server belum aktif, gunakan fallback browser.' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style:
                    'Warm, friendly Indonesian elementary school storyteller, clear pronunciation for 6th grade students',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        return res.status(502).json({ error: 'Audio tidak dihasilkan.' });
      }

      if (ttsAudioCache.size >= 60) {
        const firstKey = ttsAudioCache.keys().next().value;
        if (firstKey) ttsAudioCache.delete(firstKey);
      }
      ttsAudioCache.set(cleanText, base64Audio);
      res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
    } catch (err) {
      console.error('Gemini TTS error:', err);
      res.status(502).json({ error: 'Gagal membuat audio narasi.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Detektif Cerita server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

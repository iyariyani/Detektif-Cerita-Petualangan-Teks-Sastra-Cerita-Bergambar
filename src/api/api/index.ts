import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import * as XLSX from 'xlsx';

const app = express();
app.use(express.json({ limit: '2mb' }));

const TEACHER_PIN = process.env.TEACHER_PIN || 'GURU6AB';
const RECORDS_FILE = path.join('/tmp', 'learning-records.json');

interface LearningRecord {
  id: string;
  timestamp: string;
  realtimeDateLabel: string;
  activityType: string;
  studentOrGroupName: string;
  members?: string[];
  className: '6A' | '6B';
  score: number;
  maxScore: number;
  status: string;
  a5Score?: number;
  p4Score?: number;
  details: Record<string, unknown>;
}

function readRecords(): LearningRecord[] {
  try {
    if (!fs.existsSync(RECORDS_FILE)) {
      fs.writeFileSync(RECORDS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    const raw = fs.readFileSync(RECORDS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecords(records: LearningRecord[]) {
  try {
    fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch {}
}

function isTeacherAuthorized(req: express.Request): boolean {
  const pin = req.headers['x-teacher-pin'] || req.query.pin;
  return typeof pin === 'string' && pin.trim().toUpperCase() === TEACHER_PIN.toUpperCase();
}

app.post('/api/submissions', (req, res) => {
  const body = req.body as Partial<LearningRecord>;
  if (!body.activityType || !body.studentOrGroupName || !body.className) {
    return res.status(400).json({ error: 'Data identitas dan aktivitas wajib dilengkapi.' });
  }
  const records = readRecords();
  const record: LearningRecord = {
    id: body.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    realtimeDateLabel: body.realtimeDateLabel || new Date().toLocaleString('id-ID'),
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

  const idx = records.findIndex(
    (r) =>
      r.activityType === record.activityType &&
      r.className === record.className &&
      r.studentOrGroupName.toLowerCase() === record.studentOrGroupName.toLowerCase()
  );
  if (idx >= 0) {
    records[idx] = { ...record, id: records[idx].id };
  } else {
    records.unshift(record);
  }
  writeRecords(records);
  res.json({ ok: true, record });
});

app.post('/api/teacher/login', (req, res) => {
  const { pin } = req.body as { pin?: string };
  if (typeof pin === 'string' && pin.trim().toUpperCase() === TEACHER_PIN.toUpperCase()) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Kode akses guru tidak sesuai.' });
});

app.get('/api/teacher/records', (req, res) => {
  if (!isTeacherAuthorized(req)) return res.status(401).json({ error: 'Akses guru diperlukan.' });
  res.json({ records: readRecords() });
});

app.get('/api/teacher/stream', (req, res) => {
  if (!isTeacherAuthorized(req)) return res.status(401).end();
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.write(`data: ${JSON.stringify({ type: 'records', records: readRecords() })}\n\n`);
  res.end();
});

app.patch('/api/teacher/records/:id/rubric', (req, res) => {
  if (!isTeacherAuthorized(req)) return res.status(401).json({ error: 'Akses guru diperlukan.' });
  const records = readRecords();
  const idx = records.findIndex((r) => r.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Data tidak ditemukan.' });
  if (req.body.a5Score !== undefined) records[idx].a5Score = Number(req.body.a5Score);
  if (req.body.p4Score !== undefined) records[idx].p4Score = Number(req.body.p4Score);
  writeRecords(records);
  res.json({ ok: true, record: records[idx] });
});

app.delete('/api/teacher/records/:id', (req, res) => {
  if (!isTeacherAuthorized(req)) return res.status(401).json({ error: 'Akses guru diperlukan.' });
  const records = readRecords().filter((r) => r.id !== req.params.id);
  writeRecords(records);
  res.json({ ok: true });
});

app.get('/api/teacher/export-excel', (req, res) => {
  if (!isTeacherAuthorized(req)) return res.status(401).json({ error: 'Akses guru diperlukan.' });
  const records = readRecords();
  const workbook = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(records.length > 0 ? records : [{ Info: 'Belum ada data.' }]);
  XLSX.utils.book_append_sheet(workbook, ws, 'Rekapitulasi');
  const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="Rekap_Detektif_Cerita.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API Key belum diatur.' });
    const ai = new GoogleGenAI({ apiKey });
    const prompt = req.body.prompt || req.body.message || 'Halo';
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    res.json({ text: response.text, reply: response.text });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Gagal memanggil AI' });
  }
});

export default app;

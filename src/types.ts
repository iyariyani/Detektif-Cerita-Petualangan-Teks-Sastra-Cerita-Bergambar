export type MenuSectionId =
  | 'menu-utama'
  | 'petunjuk'
  | 'mulai-petualangan'
  | 'tujuan'
  | 'kenali-sastra'
  | 'cerita-bergambar'
  | 'unsur-intrinsik'
  | 'contoh-demonstrasi'
  | 'lkpd-kelompok'
  | 'latihan-individu'
  | 'remedial'
  | 'pengayaan'
  | 'refleksi'
  | 'progres-belajar';

export type ProgressStatus =
  | 'Belum Mulai'
  | 'Sedang Berproses'
  | 'Hampir Tuntas'
  | 'Tuntas';

export type ClassRoom = '6A' | '6B';

export interface StoryPanel {
  id: string;
  order: number;
  sceneKey: string;
  caption: string;
  narrative: string;
  visualClues: string[];
}

export interface IntrinsicElementsKey {
  tokohDanPenokohan: string;
  latar: string;
  konflik: string;
  penyelesaian: string;
  alur: string;
  amanat: string;
}

export interface StoryData {
  id: 'cerita-1' | 'cerita-2' | 'cerita-3' | 'cerita-4' | 'cerita-5';
  title: string;
  subtitle: string;
  usedIn: string;
  coverImage: string;
  panels: StoryPanel[];
  intrinsicKey: IntrinsicElementsKey;
}

export interface MaterialQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DemonstrationStep {
  unsur: string;
  cobaPikirkan: string;
  lihatPetunjuk: string;
  lihatAnalisis: string;
}

export interface CauseEffectItem {
  id: string;
  penyebab: string;
  peristiwa: string;
  akibat: string;
}

export interface ExerciseQuestion {
  id: string;
  number: number;
  level: 'Pemula' | 'Menengah' | 'Ahli';
  levelLabel: string;
  indicator: string;
  questionType: 'Pilihan Ganda' | 'Pilihan Ganda Beralasan';
  weight: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  hintStages: [string, string, string, string];
  keyExplanation: string;
  evidencePrompt?: string;
  expectedEvidenceKeywords?: string[];
}

export interface RubricRow {
  no: number;
  tingkat: string;
  indikator: string;
  levelKognitif: string;
  bentukSoal: string;
  nomorSoal: number;
  bobot: number;
}

export interface EnrichmentChallenge {
  id: string;
  number: number;
  aspect: string;
  prompt: string;
  type: 'choice' | 'short-analysis';
  options?: string[];
  correctIndex?: number;
  sampleAnswer: string;
  hint: string;
}

export interface AhliQuestionScore {
  questionId: string;
  selectedIndex: number | null;
  reasonText: string;
  pilihanScore: number; // max 2
  buktiScore: number; // max 4
  hubunganScore: number; // max 4
  totalScore: number; // max 10
  feedback: string;
}

export interface StudentProgressState {
  studentName: string;
  studentClass: ClassRoom;
  materialQuizScore: number | null;
  materialQuizTotal: number;
  demoCompleted: boolean;
  lkpdCompleted: boolean;
  lkpdGroupName: string;
  lkpdMembers: string[];
  lkpdOrderCorrect: boolean;
  lkpdCauseEffectScore: number;
  latihanCompleted: boolean;
  latihanPemulaScore: number;
  latihanMenengahScore: number;
  latihanAhliScore: number;
  latihanTotalScore: number;
  remedialCompleted: boolean;
  remedialStage: number;
  pengayaanCompleted: boolean;
  pengayaanScore: number;
  refleksiCompleted: boolean;
  refleksiAnswers: Record<string, string>;
  visitedSections: MenuSectionId[];
}

export interface RubricLevelDescriptor {
  level: string;
  skor: number;
  deskripsi: string;
}

export interface RubricSectionSpec {
  id: string;
  title: string;
  items: RubricLevelDescriptor[];
}

export interface TeacherSubmissionRecord {
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
  className: ClassRoom;
  score: number;
  maxScore: number;
  status: ProgressStatus;
  a5Score?: number; // 2, 3, 4
  p4Score?: number; // 2, 3, 4
  details: Record<string, unknown>;
}

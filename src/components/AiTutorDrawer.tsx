import React, { useState } from 'react';
import { HelpCircle, Send, Square, Volume2, X } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export interface TutorContext {
  title: string;
  storyContext: string;
  questionText?: string;
  hintStages?: string[];
  keyExplanation?: string;
}

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: TutorContext;
}

interface ChatItem {
  role: 'tutor' | 'student';
  stage?: number;
  text: string;
}

const STAGE_LABELS = [
  { level: 1, label: 'Petunjuk 1 · Pertanyaan Pengarah' },
  { level: 2, label: 'Petunjuk 2 · Informasi Penting' },
  { level: 3, label: 'Petunjuk 3 · Contoh Cara Berpikir' },
  { level: 4, label: 'Petunjuk 4 · Arah Jawaban' },
];

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: 'tutor',
      text: `Halo Detektif! Saya Teman Detektif Cerita. Kamu sedang mengerjakan bagian "${context.title}". Klik salah satu tahap Petunjuk di bawah atau ceritakan bagian mana yang membuatmu bingung — kita pecahkan bertahap tanpa langsung menebak!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<string | null>(null);

  if (!isOpen) return null;

  const requestTutor = async (stageToUse: number, studentMessage?: string) => {
    soundManager.playHint();
    setLoading(true);
    setCurrentStage(stageToUse);

    if (studentMessage) {
      setMessages((prev) => [...prev, { role: 'student', text: studentMessage }]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: 'student',
          text: `Minta ${STAGE_LABELS[stageToUse - 1]?.label || `Petunjuk ${stageToUse}`}`,
        },
      ]);
    }

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petunjukLevel: stageToUse,
          questionText: context.questionText || context.title,
          storyContext: context.storyContext,
          studentMessage,
          hintStages: context.hintStages,
          keyExplanation: context.keyExplanation,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          stage: stageToUse,
          text:
            data.reply ||
            'Coba amati kembali gambar panel dan hubungkan dengan tindakan tokohnya ya!',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          stage: stageToUse,
          text:
            context.hintStages?.[stageToUse - 1] ||
            'Coba baca kembali narasi panel dengan tenang dan perhatikan bukti di gambar.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput('');
    void requestTutor(currentStage, trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Teman Detektif Cerita"
    >
      <div className="w-full max-w-md bg-white h-full flex flex-col border-l border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Teman Detektif Cerita
            </h2>
            <p className="text-xs text-slate-500 truncate">
              Bantuan bertahap · {context.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
            aria-label="Tutup Teman Detektif"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progressive Hint Buttons */}
        <div className="p-4 border-b border-slate-200 bg-amber-50/50">
          <p className="text-xs font-semibold text-amber-900 mb-2">
            Pilih Tahap Bantuan Bertahap:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {STAGE_LABELS.map((item) => (
              <button
                key={item.level}
                type="button"
                disabled={loading}
                onClick={() => void requestTutor(item.level)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  currentStage === item.level
                    ? 'bg-amber-100 border-amber-400 text-amber-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'student'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                {msg.stage && (
                  <p className="text-[11px] font-mono font-semibold text-amber-800 mb-1">
                    Petunjuk Tahap {msg.stage}
                  </p>
                )}
                <p>{msg.text}</p>
                {msg.role === 'tutor' && (
                  <button
                    type="button"
                    onClick={() =>
                      void soundManager.speak(
                        msg.text,
                        `tutor-msg-${idx}`,
                        (speaking, id) =>
                          setSpeakingIdx(speaking ? id || `tutor-msg-${idx}` : null)
                      )
                    }
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900"
                  >
                    {speakingIdx === `tutor-msg-${idx}` ? (
                      <>
                        <Square className="w-3 h-3 fill-current" />
                        Hentikan Audio
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        Dengarkan
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-3 text-sm bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 animate-spin" />
                Menyiapkan petunjuk detektif...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan atau dugaanmu..."
              className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Send className="w-4 h-4" />
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

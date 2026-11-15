import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Search, Square, Volume2 } from 'lucide-react';
import { StoryData } from '../types';
import { StoryPanelIllustration } from './StoryPanelIllustration';
import { soundManager } from '../utils/soundEffects';

interface StoryViewerProps {
  story: StoryData;
  defaultMode?: 'grid' | 'focus';
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  story,
  defaultMode = 'grid',
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'focus'>(defaultMode);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showClues, setShowClues] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const activePanel = story.panels[activeIndex];

  const handleSpeak = (text: string, id: string) => {
    void soundManager.speak(text, id, (isSpeaking, targetId) => {
      setSpeakingId(isSpeaking ? targetId || id : null);
    });
  };

  const fullStoryText = `${story.title}. ${story.panels
    .map((p) => `Panel ${p.order}, ${p.caption}. ${p.narrative}`)
    .join(' ')}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header strip with cover thumbnail & controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
            <img
              src={story.coverImage}
              alt={story.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">{story.subtitle}</p>
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {story.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleSpeak(fullStoryText, `${story.id}-full`)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              speakingId === `${story.id}-full`
                ? 'bg-sky-600 border-sky-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {speakingId === `${story.id}-full` ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                Hentikan Audio
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                Dengarkan Cerita
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowClues((v) => !v)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showClues
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            {showClues ? 'Sembunyikan Petunjuk Visual' : 'Amati Petunjuk Gambar'}
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Panel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('focus')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'focus'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Fokus
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {story.panels.map((panel, idx) => {
              const panelSpeakKey = `${story.id}-${panel.id}`;
              const isPanelSpeaking = speakingId === panelSpeakKey;
              return (
                <article
                  key={panel.id}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col"
                >
                  <div className="relative bg-slate-100 border-b border-slate-200">
                    <StoryPanelIllustration sceneKey={panel.sceneKey} />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleSpeak(
                            `Panel ${panel.order}, ${panel.caption}. ${panel.narrative}`,
                            panelSpeakKey
                          )
                        }
                        className={`px-2.5 py-1 text-xs font-medium rounded-md border shadow-sm flex items-center gap-1 ${
                          isPanelSpeaking
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white/95 hover:bg-white text-slate-800 border-slate-200'
                        }`}
                        title="Dengarkan narasi panel ini"
                      >
                        {isPanelSpeaking ? (
                          <Square className="w-3 h-3 fill-current" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        Audio
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveIndex(idx);
                          setViewMode('focus');
                        }}
                        className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-800 text-xs font-medium rounded-md border border-slate-200 shadow-sm flex items-center gap-1"
                        title="Perbesar panel ini"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Fokus
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-sky-700 tabular-nums">
                        Panel {panel.order}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700">{panel.caption}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700">{panel.narrative}</p>
                    {showClues && (
                      <div className="mt-auto pt-3 border-t border-slate-100">
                        <p className="text-xs font-semibold text-amber-800 mb-1">
                          Petunjuk Visual yang Bisa Diamati:
                        </p>
                        <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                          {panel.visualClues.map((clue, cIdx) => (
                            <li key={cIdx}>{clue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <StoryPanelIllustration sceneKey={activePanel.sceneKey} />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold text-sky-700 tabular-nums">
                  Panel {activePanel.order} dari {story.panels.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleSpeak(
                      `Panel ${activePanel.order}, ${activePanel.caption}. ${activePanel.narrative}`,
                      `${story.id}-focus-${activePanel.id}`
                    )
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 ${
                    speakingId === `${story.id}-focus-${activePanel.id}`
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {speakingId === `${story.id}-focus-${activePanel.id}` ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      Hentikan Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      Dengarkan Panel
                    </>
                  )}
                </button>
              </div>
              <p className="text-base leading-relaxed text-slate-800">
                {activePanel.narrative}
              </p>

              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200">
                <p className="text-xs font-semibold text-amber-900 mb-1.5">
                  Catatan Pengamatan Gambar
                </p>
                <ul className="space-y-1 text-sm text-amber-950 list-disc pl-4">
                  {activePanel.visualClues.map((clue, cIdx) => (
                    <li key={cIdx}>{clue}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </button>
                <div className="flex items-center gap-1.5">
                  {story.panels.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold transition-colors ${
                        i === activeIndex
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {p.order}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={activeIndex === story.panels.length - 1}
                  onClick={() =>
                    setActiveIndex((i) => Math.min(story.panels.length - 1, i + 1))
                  }
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  Lanjut
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

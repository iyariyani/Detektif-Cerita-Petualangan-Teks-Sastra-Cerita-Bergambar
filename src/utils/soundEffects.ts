// Interactive Sound Effects (Web Audio API) & Indonesian Story Audio Narration (Gemini TTS + Web Speech fallback)

class SoundManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private currentAudio: HTMLAudioElement | null = null;
  private ttsCache = new Map<string, string>();
  private activeSpeakCallback: ((speaking: boolean, id?: string) => void) | null = null;
  private currentSpeakId: string | null = null;

  constructor() {
    try {
      this.muted = localStorage.getItem('detektif_audio_muted') === 'true';
    } catch {
      this.muted = false;
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(value: boolean) {
    this.muted = value;
    try {
      localStorage.setItem('detektif_audio_muted', String(value));
    } catch {
      // ignore
    }
    if (value) {
      this.stopNarration();
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0
  ) {
    const ctx = this.getContext();
    if (!ctx) return;
    const startTime = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  playClick() {
    this.playTone(540, 0.06, 'triangle', 0.05);
  }

  playSwap() {
    this.playTone(440, 0.07, 'sine', 0.05);
    this.playTone(587, 0.08, 'sine', 0.05, 0.04);
  }

  playHint() {
    this.playTone(659.25, 0.12, 'sine', 0.06);
    this.playTone(880, 0.18, 'sine', 0.06, 0.09);
  }

  playSuccess() {
    this.playTone(523.25, 0.12, 'triangle', 0.08, 0);
    this.playTone(659.25, 0.12, 'triangle', 0.08, 0.09);
    this.playTone(783.99, 0.22, 'triangle', 0.09, 0.18);
  }

  playTryAgain() {
    this.playTone(392, 0.13, 'sine', 0.06, 0);
    this.playTone(329.63, 0.18, 'sine', 0.06, 0.11);
  }

  playCelebration() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.playTone(n, i === 3 ? 0.35 : 0.14, 'triangle', 0.08, i * 0.1);
    });
  }

  stopNarration() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.activeSpeakCallback) {
      this.activeSpeakCallback(false, this.currentSpeakId || undefined);
    }
    this.currentSpeakId = null;
  }

  async speak(
    text: string,
    id: string,
    onStateChange?: (speaking: boolean, activeId?: string) => void
  ): Promise<void> {
    const wasSame = this.currentSpeakId === id;
    this.stopNarration();
    if (wasSame) return;

    if (this.muted) return;

    this.activeSpeakCallback = onStateChange || null;
    this.currentSpeakId = id;
    onStateChange?.(true, id);

    try {
      let audioSrc = this.ttsCache.get(text);
      if (!audioSrc) {
        const res = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
            this.ttsCache.set(text, audioSrc);
          }
        }
      }

      if (audioSrc && this.currentSpeakId === id) {
        const audio = new Audio(audioSrc);
        this.currentAudio = audio;
        audio.onended = () => {
          if (this.currentSpeakId === id) {
            this.currentSpeakId = null;
            onStateChange?.(false, id);
          }
        };
        audio.onerror = () => {
          this.speakWithBrowserFallback(text, id, onStateChange);
        };
        await audio.play();
        return;
      }
    } catch {
      // fall through to Web Speech fallback
    }

    if (this.currentSpeakId === id) {
      this.speakWithBrowserFallback(text, id, onStateChange);
    }
  }

  private speakWithBrowserFallback(
    text: string,
    id: string,
    onStateChange?: (speaking: boolean, activeId?: string) => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.currentSpeakId = null;
      onStateChange?.(false, id);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.96;
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith('id'));
    if (idVoice) utterance.voice = idVoice;
    utterance.onend = () => {
      if (this.currentSpeakId === id) {
        this.currentSpeakId = null;
        onStateChange?.(false, id);
      }
    };
    utterance.onerror = () => {
      if (this.currentSpeakId === id) {
        this.currentSpeakId = null;
        onStateChange?.(false, id);
      }
    };
    window.speechSynthesis.speak(utterance);
  }
}

export const soundManager = new SoundManager();

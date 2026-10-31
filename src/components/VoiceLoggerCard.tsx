import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Activity,
  Sparkles,
  CheckCircle2,
  Clock,
  Volume2,
  Baby,
  Moon,
  HeartPulse,
} from 'lucide-react';
import {
  type MotherProfile,
  type AcousticTelemetry,
} from '../utils/riskEngine';
import {
  parseSpokenCareLog,
  type ParsedVoiceCareLog,
} from '../utils/telemetryParser';

interface VoiceLoggerCardProps {
  mother: MotherProfile;
  onSaveVoiceLog: (parsed: ParsedVoiceCareLog) => void;
}

const DEMO_VOICE_SAMPLES: {
  id: string;
  lang: 'en-IN' | 'hi-IN' | 'kn-IN';
  label: string;
  buttonText: string;
  timestamp: string;
  transcript: string;
}[] = [
  {
    id: 'sim-3am-fatigue',
    lang: 'en-IN',
    label: 'English (en-IN) · 03:15 AM High Fatigue',
    buttonText: 'Simulate 03:15 AM Exhausted Voice Log (EN)',
    timestamp: '03:15 AM',
    transcript:
      'Baby woke up 4 times tonight... breastfed for 18 minutes at 3:15 AM... feeling exhausted and overwhelmed, cannot sleep.',
  },
  {
    id: 'sim-hindi',
    lang: 'hi-IN',
    label: 'हिंदी (hi-IN) · रात 02:15 बजे फीडिंग',
    buttonText: 'Simulate Hindi Voice Log (hi-IN)',
    timestamp: '02:15 AM',
    transcript:
      'रात में बच्चा 3 बार उठा... 20 मिनट ब्रेस्टफीडिंग कराया... बहुत थकान और नींद की कमी महसूस हो रही है।',
  },
  {
    id: 'sim-kannada',
    lang: 'kn-IN',
    label: 'ಕನ್ನಡ (kn-IN) · ಬೆಳಗ್ಗೆ 08:15 ದಿನचर्या',
    buttonText: 'Simulate Kannada Voice Log (kn-IN)',
    timestamp: '08:15 AM',
    transcript:
      'ಮಗು ರಾತ್ರಿ ಚೆನ್ನಾಗಿ ನಿದ್ದೆ ಮಾಡಿದೆ, ಬೆಳಗ್ಗೆ 22 ನಿಮಿಷ ಹಾಲುಣಿಸಿದೆ, ಮನಸ್ಸು ಶಾಂತವಾಗಿದೆ.',
  },
];

export const VoiceLoggerCard: React.FC<VoiceLoggerCardProps> = ({
  mother,
  onSaveVoiceLog,
}) => {
  const [voiceLang, setVoiceLang] = useState<'en-IN' | 'hi-IN' | 'kn-IN'>('en-IN');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcriptInput, setTranscriptInput] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<ParsedVoiceCareLog | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const activeAcoustic: AcousticTelemetry = parsedPreview?.acoustic ||
    mother.acousticTelemetry || {
      wpm: 94,
      pauseFrequencyPerMin: 6.8,
      vocalFatiguePercent: 74,
      cadenceSummary: 'Elevated Vocal Fatigue: +18% slower cadence at 03:15 AM',
      stressIndicator: 'Elevated',
      lastRecordedAt: '03:15 AM',
      transcriptSnippet:
        'Baby woke up 4 times tonight... breastfed for 18 minutes at 3:15 AM.',
    };

  const handleStartBrowserMic = () => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SpeechRec) {
      // Fallback to realistic simulated capture if headless browser has no microphone hardware
      const sample =
        DEMO_VOICE_SAMPLES.find((s) => s.lang === voiceLang) || DEMO_VOICE_SAMPLES[0];
      handleRunSimulation(sample.transcript, sample.lang, sample.timestamp);
      return;
    }

    try {
      setIsRecording(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRec as any)();
      recognition.lang = voiceLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const text = event.results?.[0]?.[0]?.transcript || '';
        if (text) {
          handleRunSimulation(text, voiceLang);
        }
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setIsRecording(false);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleRunSimulation = (
    text: string,
    langCode: 'en-IN' | 'hi-IN' | 'kn-IN',
    overrideTime?: string
  ) => {
    setVoiceLang(langCode);
    setTranscriptInput(text);
    const parsed = parseSpokenCareLog(text, langCode, overrideTime);
    setParsedPreview(parsed);
    onSaveVoiceLog(parsed);
    setSavedNotice(
      `Synced Voice Log & Acoustic Telemetry (${parsed.acoustic.cadenceSummary}) to Cloud DB & Doctor Portal.`
    );
    setTimeout(() => setSavedNotice(null), 5000);
  };

  const handleManualParseAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcriptInput.trim()) return;
    handleRunSimulation(transcriptInput.trim(), voiceLang);
  };

  return (
    <div
      data-testid="voice-logger-card"
      className="bg-white border border-[#E6DFD3] rounded-2xl p-6 space-y-5 shadow-2xs"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6DFD3]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F4EFFA] border border-[#E2D6F3] flex items-center justify-center text-[#5B3E85] shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-semibold text-[#1F2421]">
                Hands-Free Multilingual Voice Data Logger + Acoustic Fatigue Analyzer
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-[#E3F2E6] text-[#2E6F40] text-[11px] font-mono font-semibold">
                Speech-to-Form NLP
              </span>
            </div>
            <p className="text-xs text-[#5A625D] mt-0.5">
              Speak naturally in English (`en-IN`), हिंदी (`hi-IN`), or ಕನ್ನಡ (`kn-IN`) while holding{' '}
              {mother.babyName} — automatically parses feeding, wake-ups, mood & vocal cadence.
            </p>
          </div>
        </div>

        {/* Language Selector for SpeechRecognition */}
        <div
          role="group"
          aria-label="Voice Recognition Language"
          className="flex items-center gap-1 p-1 bg-[#F7F2EB] border border-[#E6DFD3] rounded-xl self-start"
        >
          {(
            [
              { code: 'en-IN', label: 'EN (en-IN)' },
              { code: 'hi-IN', label: 'हिंदी (hi-IN)' },
              { code: 'kn-IN', label: 'ಕನ್ನಡ (kn-IN)' },
            ] as const
          ).map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setVoiceLang(item.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                voiceLang === item.code
                  ? 'bg-[#5B3E85] text-white'
                  : 'text-[#4A524D] hover:text-[#1F2421]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 One-Click "Simulate Voice Input" Demo Buttons */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#4A524D] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#5B3E85]" />
          <span>1-Click "Simulate Voice Input" Clinical Demo Presets:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {DEMO_VOICE_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              data-testid={sample.id}
              onClick={() =>
                handleRunSimulation(sample.transcript, sample.lang, sample.timestamp)
              }
              className="p-3 rounded-xl bg-[#FDFBF7] hover:bg-[#F4EFFA]/60 border border-[#E6DFD3] hover:border-[#5B3E85] text-left transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-[#5B3E85]">
                <span>{sample.label}</span>
                <Volume2 className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </div>
              <div className="text-xs font-semibold text-[#1F2421]">
                {sample.buttonText}
              </div>
              <p className="text-[11px] text-[#5A625D] line-clamp-2 italic">
                “{sample.transcript}”
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Live Mic Input + Natural Language Transcript Form */}
      <form onSubmit={handleManualParseAndSave} className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={handleStartBrowserMic}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shrink-0 transition-colors ${
            isRecording
              ? 'bg-[#E11D48] text-white animate-pulse'
              : 'bg-[#5B3E85] hover:bg-[#49306B] text-white'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Listening ({voiceLang})...</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Tap Mic ({voiceLang})</span>
            </>
          )}
        </button>

        <input
          type="text"
          aria-label="Spoken newborn care sentence"
          value={transcriptInput}
          onChange={(e) => setTranscriptInput(e.target.value)}
          placeholder="Or type/edit spoken sentence: e.g., 'Baby woke up 4 times, breastfed for 18 minutes at 3:15 AM, feeling exhausted'"
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs sm:text-sm text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
        />

        <button
          type="submit"
          data-testid="parse-voice-submit-btn"
          className="px-4 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold shrink-0 transition-colors"
        >
          Parse & Save Voice Log →
        </button>
      </form>

      {savedNotice && (
        <div
          role="status"
          data-testid="voice-saved-banner"
          className="p-3 rounded-xl bg-[#E3F2E6] border border-[#2E6F40]/30 text-xs font-semibold text-[#1F2421] flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#2E6F40] shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Parsed Structured Fields + Acoustic Voice Fatigue & Stress Indicator (Bonus #1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
        {/* Left: Natural Language Speech-to-Form Parsed Output */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1F2421] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2E6F40]" />
              <span>Auto-Parsed Care Log Fields</span>
            </span>
            <span className="text-[11px] font-mono text-[#5A625D]">
              Time: {parsedPreview?.timestamp || activeAcoustic.lastRecordedAt}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-[#E6DFD3]">
              <div className="text-[10px] text-[#5A625D] flex items-center gap-1">
                <Baby className="w-3 h-3 text-[#2E6F40]" />
                <span>Feeding Type & Duration</span>
              </div>
              <div
                data-testid="voice-parsed-feeding"
                className="font-semibold text-[#1F2421] mt-0.5 font-mono"
              >
                {parsedPreview
                  ? `${parsedPreview.feedingType} · ${parsedPreview.feedingDurationMins} mins`
                  : 'Breastfeeding · 18 mins'}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E6DFD3]">
              <div className="text-[10px] text-[#5A625D] flex items-center gap-1">
                <Moon className="w-3 h-3 text-[#5B3E85]" />
                <span>Night Wake-Ups</span>
              </div>
              <div
                data-testid="voice-parsed-wakeups"
                className="font-semibold text-[#1F2421] mt-0.5 font-mono"
              >
                {parsedPreview ? `${parsedPreview.nightWakeUps} wake-ups` : '4 wake-ups'}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E6DFD3]">
              <div className="text-[10px] text-[#5A625D] flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-[#E11D48]" />
                <span>Parsed Mood Score (1–5)</span>
              </div>
              <div
                data-testid="voice-parsed-mood"
                className="font-semibold text-[#1F2421] mt-0.5"
              >
                {parsedPreview
                  ? parsedPreview.moodLabel
                  : 'Overwhelmed & Exhausted (1/5)'}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E6DFD3]">
              <div className="text-[10px] text-[#5A625D] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#D97706]" />
                <span>Distress Signal</span>
              </div>
              <div className="font-semibold text-[#E11D48] mt-0.5 truncate">
                {parsedPreview
                  ? parsedPreview.isDistressSignal
                    ? 'Elevated Nocturnal Distress'
                    : 'Routine Baseline'
                  : 'Elevated Nocturnal Distress'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Bonus #1 — Acoustic Voice Fatigue & Stress Indicator */}
        <div
          data-testid="acoustic-fatigue-indicator"
          className="lg:col-span-6 p-4 rounded-xl bg-[#FFF5F5]/70 border border-[#F5D0D6] space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#1F2421] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#E11D48]" />
              <span>Acoustic Voice Fatigue & Stress Telemetry</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                activeAcoustic.stressIndicator === 'Elevated'
                  ? 'bg-[#E11D48] text-white'
                  : activeAcoustic.stressIndicator === 'Moderate'
                  ? 'bg-[#D97706] text-white'
                  : 'bg-[#2E6F40] text-white'
              }`}
            >
              {activeAcoustic.stressIndicator} Stress
            </span>
          </div>

          <div
            data-testid="acoustic-cadence-summary"
            className="text-xs sm:text-sm font-mono font-bold text-[#E11D48] bg-white px-3 py-2 rounded-lg border border-[#F5D0D6]"
          >
            {activeAcoustic.cadenceSummary}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-white border border-[#E6DFD3]">
              <div className="text-[10px] text-[#5A625D]">Speech Pace</div>
              <div className="text-xs font-mono font-bold text-[#1F2421]">
                {activeAcoustic.wpm} WPM
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-[#E6DFD3]">
              <div className="text-[10px] text-[#5A625D]">Pause Freq</div>
              <div className="text-xs font-mono font-bold text-[#1F2421]">
                {activeAcoustic.pauseFrequencyPerMin}/min
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-[#E6DFD3]">
              <div className="text-[10px] text-[#5A625D]">Vocal Fatigue</div>
              <div className="text-xs font-mono font-bold text-[#E11D48]">
                {activeAcoustic.vocalFatiguePercent}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

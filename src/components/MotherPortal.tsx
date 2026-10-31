import React, { useState, useEffect } from 'react';
import {
  Baby,
  Moon,
  Search,
  Smile,
  Volume2,
  VolumeX,
  Wind,
  MessageCircle,
  ClipboardCheck,
  PhoneCall,
  ShieldCheck,
  LogOut,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  type MotherProfile,
  type ConsentSettings,
  evaluateSearchDistress,
  isLateNightTimestamp,
  calculateEpdsEvaluation,
} from '../utils/riskEngine';
import {
  type LanguageCode,
  type TranslationDictionary,
  speakText,
  stopSpeaking,
} from '../i18n/translations';
import {
  type SupportSearchAnswer,
  generateSupportAnswerFallback,
} from '../utils/supportSearchAi';
import { WhatsappPreviewModal } from './WhatsappPreviewModal';

interface MotherPortalProps {
  mother: MotherProfile;
  allMothers: MotherProfile[];
  onSelectMother: (id: string) => void;
  onAddLog: (
    motherId: string,
    log: {
      timestamp: string;
      category: 'Feeding' | 'Sleep & Night Wake-up' | 'In-App Search' | 'Mood Check-In';
      detail: string;
      isNightBurst: boolean;
      isDistressSignal: boolean;
      baselineComparison: string;
    }
  ) => void;
  onUpdateConsent: (motherId: string, consent: ConsentSettings) => void;
  onSaveEpdsScore: (motherId: string, score: number, routeToDoctor: boolean) => void;
  onTriggerPartnerNudge: (motherId: string) => void;
  onRequestCoordinatorCall: (motherId: string) => void;
  onLogout: () => void;
  lang: LanguageCode;
  t: TranslationDictionary;
}

export type MotherTab = 'tabA' | 'tabB' | 'tabC' | 'tabD';

export const MotherPortal: React.FC<MotherPortalProps> = ({
  mother,
  onAddLog,
  onUpdateConsent,
  onSaveEpdsScore,
  onTriggerPartnerNudge,
  onRequestCoordinatorCall,
  onLogout,
  lang,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<MotherTab>('tabA');

  // Tab A Form States
  const [feedType, setFeedType] = useState<'Breastfeeding' | 'Bottle'>('Breastfeeding');
  const [feedTime, setFeedTime] = useState<string>('02:20 AM');
  const [feedDuration, setFeedDuration] = useState<string>('18');
  const [feedRepeatedEdit, setFeedRepeatedEdit] = useState<boolean>(true);

  const [sleepWakeTime, setSleepWakeTime] = useState<string>('03:15 AM');
  const [sleepStretch, setSleepStretch] = useState<string>('1.2');
  const [sleepFragmented, setSleepFragmented] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchAiAnswer, setSearchAiAnswer] = useState<SupportSearchAnswer | null>(null);
  const [isSearchingAi, setIsSearchingAi] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<string>('Overwhelmed');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Tab B States
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [customAiGuidance, setCustomAiGuidance] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // Tab C EPDS States
  const [epdsAnswers, setEpdsAnswers] = useState<number[]>([2, 2, 2, 2, 2]);
  const [epdsSubmitted, setEpdsSubmitted] = useState<boolean>(false);
  const [routedToDoctor, setRoutedToDoctor] = useState<boolean>(false);

  // Tab D WhatsApp Modal State
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState<boolean>(false);

  // Reset custom AI text when switching mother or language
  useEffect(() => {
    setCustomAiGuidance(null);
    stopSpeaking();
    setIsSpeaking(false);
    setSearchAiAnswer((prev) =>
      prev ? generateSupportAnswerFallback(prev.query, lang) : null
    );
  }, [mother.id, lang]);

  // Breathing timer cycle
  useEffect(() => {
    if (!isBreathingOpen) return;
    const phases: ('inhale' | 'hold' | 'exhale')[] = ['inhale', 'hold', 'exhale'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathingPhase(phases[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isBreathingOpen]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const getDefaultCompanionText = (): string => {
    if (mother.id === 'ananya') return t.geminiCompanionAnanya;
    if (mother.id === 'priya') return t.geminiCompanionPriya;
    return t.geminiCompanionSneha;
  };

  const companionText = customAiGuidance || getDefaultCompanionText();

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const started = speakText(companionText, lang, () => setIsSpeaking(false));
    if (!started) {
      setIsSpeaking(false);
    }
  };

  const handleRefreshGeminiInsight = async () => {
    setIsLoadingAi(true);
    try {
      const response = await fetch('/api/gemini/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motherName: mother.name,
          babyName: mother.babyName,
          postpartumWeeks: mother.postpartumWeeks,
          nightSessionsCount: mother.explainableSignals.nightSessionsCount,
          riskTier: mother.riskTier,
          lang,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          setCustomAiGuidance(data.text);
        }
      }
    } catch {
      // Keeps clean built-in localized guidance if offline
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleLogFeeding = (e: React.FormEvent) => {
    e.preventDefault();
    const isNight = isLateNightTimestamp(feedTime);
    const editSuffix = feedRepeatedEdit ? ' (Edited — repeated log correction)' : '';
    onAddLog(mother.id, {
      timestamp: feedTime,
      category: 'Feeding',
      detail: `${feedType === 'Breastfeeding' ? t.feedTypeBreast : t.feedTypeBottle} • ${feedDuration} mins${editSuffix}`,
      isNightBurst: isNight,
      isDistressSignal: false,
      baselineComparison: isNight
        ? t.nightBurstTag
        : t.normalWindowTag,
    });
    showToast(`${t.logFeedingTitle}: ${feedTime}`);
  };

  const handleLogSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const isNight = sleepFragmented || isLateNightTimestamp(sleepWakeTime);
    onAddLog(mother.id, {
      timestamp: sleepWakeTime,
      category: 'Sleep & Night Wake-up',
      detail: `${mother.babyName} wake-up • ${sleepStretch} hrs stretch`,
      isNightBurst: isNight,
      isDistressSignal: isNight && parseFloat(sleepStretch) < 2,
      baselineComparison: isNight ? t.nightBurstTag : t.normalWindowTag,
    });
    showToast(`${t.logSleepTitle}: ${sleepWakeTime}`);
  };

  const handleSearchLog = async (queryToLog: string) => {
    const trimmed = queryToLog.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    setIsSearchingAi(true);

    // Immediately compute local answer so the mother gets zero-latency AI help, then enrich from backend
    const immediateAnswer = generateSupportAnswerFallback(trimmed, lang);
    setSearchAiAnswer(immediateAnswer);

    const isDistress = evaluateSearchDistress(trimmed);
    const isNight = trimmed.toLowerCase().includes('3am') || isDistress;
    onAddLog(mother.id, {
      timestamp: isNight ? '03:15 AM' : '11:20 AM',
      category: 'In-App Search',
      detail: `Query: "${trimmed}"`,
      isNightBurst: isNight,
      isDistressSignal: isDistress,
      baselineComparison: isDistress
        ? 'Distress-oriented query (+26% SHAP weight)'
        : t.normalWindowTag,
    });

    try {
      const response = await fetch('/api/support-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          lang,
          motherId: mother.id,
          nightBurstTag: t.nightBurstTag,
          normalWindowTag: t.normalWindowTag,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.answer) {
          setSearchAiAnswer(data.answer);
        }
      }
    } catch {
      // Keeps immediateAnswer already rendered
    } finally {
      setIsSearchingAi(false);
    }
  };

  const handleMoodLog = (moodKey: string, label: string, isDistress: boolean) => {
    setSelectedMood(moodKey);
    onAddLog(mother.id, {
      timestamp: 'Just now',
      category: 'Mood Check-In',
      detail: `10-Second Voluntary Emoji Mood: ${label}`,
      isNightBurst: false,
      isDistressSignal: isDistress,
      baselineComparison: isDistress
        ? 'Elevated emotional fatigue signal'
        : 'Restorative check-in logged',
    });
    showToast(`${t.moodCheckInTitle}: ${label}`);
  };

  const epdsEval = calculateEpdsEvaluation(epdsAnswers);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Mother Portal Top Identity & Profile Bar */}
      <div className="bg-white border border-[#E6DFD3] rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4EFFA] border border-[#E2D6F3] flex items-center justify-center text-[#5B3E85] font-display text-lg font-semibold">
            {mother.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-semibold text-[#1F2421]">
                {mother.name} • {mother.babyName} ({mother.postpartumWeeks} {t.weeksOld})
              </h1>
              <span className="text-xs text-[#5A625D] font-mono">
                · {mother.city} · ID: {mother.hospitalId}
                {mother.doctorInviteCode && ` · Clinic: ${mother.doctorInviteCode}`}
              </span>
            </div>
            <p className="text-xs text-[#5A625D] mt-0.5">
              Personal Baseline Deviation:{' '}
              <span
                className={`font-mono font-semibold ${
                  mother.riskTier === 'high'
                    ? 'text-[#E11D48]'
                    : mother.riskTier === 'moderate'
                    ? 'text-[#D97706]'
                    : 'text-[#2E6F40]'
                }`}
              >
                +{mother.baselineDeviationPercent}% ({mother.riskScore}/100)
              </span>
              {' · '}Partner: {mother.partnerName}
              {mother.email && ` · ${mother.email}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            data-testid="mother-confidential-id-badge"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs font-mono font-bold text-[#2E6F40]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E6F40]" />
            ID: {mother.hospitalId}
          </span>

          <button
            type="button"
            data-testid="mother-logout-btn"
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F7F2EB] hover:bg-[#EDE5D8] text-xs font-semibold text-[#1F2421] transition-colors whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t.switchUserLogout}
          </button>
        </div>
      </div>

      {/* Live Toast Feedback */}
      {feedbackToast && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-[#E3F2E6] border border-[#2E6F40]/30 text-xs font-medium text-[#1F2421] flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E6F40]" />
            <span>{feedbackToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="text-xs text-[#2E6F40] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Structured Sub-Tabs */}
      <div
        role="tablist"
        aria-label="Mother Workspace Tabs"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 bg-[#F7F2EB] border border-[#E6DFD3] rounded-2xl"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tabA'}
          onClick={() => setActiveTab('tabA')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left flex items-center gap-2.5 ${
            activeTab === 'tabA'
              ? 'bg-white text-[#1F2421] shadow-xs border border-[#E6DFD3]'
              : 'text-[#5A625D] hover:text-[#1F2421]'
          }`}
        >
          <Baby className="w-4 h-4 text-[#2E6F40] shrink-0" />
          <span className="truncate">{t.motherTabA}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tabB'}
          onClick={() => setActiveTab('tabB')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left flex items-center gap-2.5 ${
            activeTab === 'tabB'
              ? 'bg-white text-[#1F2421] shadow-xs border border-[#E6DFD3]'
              : 'text-[#5A625D] hover:text-[#1F2421]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
          <span className="truncate">{t.motherTabB}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tabC'}
          onClick={() => setActiveTab('tabC')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left flex items-center gap-2.5 ${
            activeTab === 'tabC'
              ? 'bg-white text-[#1F2421] shadow-xs border border-[#E6DFD3]'
              : 'text-[#5A625D] hover:text-[#1F2421]'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 text-[#E11D48] shrink-0" />
          <span className="truncate">{t.motherTabC}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tabD'}
          onClick={() => setActiveTab('tabD')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left flex items-center gap-2.5 ${
            activeTab === 'tabD'
              ? 'bg-white text-[#1F2421] shadow-xs border border-[#E6DFD3]'
              : 'text-[#5A625D] hover:text-[#1F2421]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#2E6F40] shrink-0" />
          <span className="truncate">{t.motherTabD}</span>
        </button>
      </div>

      {/* ===================================================================
          TAB A: DAILY BABY CARE & 10-SECOND CHECK-IN
      =================================================================== */}
      {activeTab === 'tabA' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Log Feeding */}
            <form
              onSubmit={handleLogFeeding}
              className="bg-white border border-[#E6DFD3] rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Baby className="w-5 h-5 text-[#2E6F40]" />
                  <h2 className="text-base font-semibold text-[#1F2421]">{t.logFeedingTitle}</h2>
                </div>
                <span className="text-xs text-[#5A625D] font-mono">Real-time sync</span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F2EB] rounded-xl">
                <button
                  type="button"
                  onClick={() => setFeedType('Breastfeeding')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    feedType === 'Breastfeeding'
                      ? 'bg-white text-[#1F2421] shadow-xs'
                      : 'text-[#5A625D]'
                  }`}
                >
                  {t.feedTypeBreast}
                </button>
                <button
                  type="button"
                  onClick={() => setFeedType('Bottle')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    feedType === 'Bottle' ? 'bg-white text-[#1F2421] shadow-xs' : 'text-[#5A625D]'
                  }`}
                >
                  {t.feedTypeBottle}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="feed-time-select"
                    className="block text-xs font-medium text-[#4A524D] mb-1"
                  >
                    {t.feedTimeLabel}
                  </label>
                  <select
                    id="feed-time-select"
                    value={feedTime}
                    onChange={(e) => setFeedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-sm font-mono"
                  >
                    <option value="02:20 AM">02:20 AM (Late Night)</option>
                    <option value="03:45 AM">03:45 AM (Late Night)</option>
                    <option value="07:30 AM">07:30 AM (Morning)</option>
                    <option value="01:15 PM">01:15 PM (Afternoon)</option>
                    <option value="08:30 PM">08:30 PM (Evening)</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="feed-duration-input"
                    className="block text-xs font-medium text-[#4A524D] mb-1"
                  >
                    {t.feedDurationLabel}
                  </label>
                  <input
                    id="feed-duration-input"
                    type="number"
                    min="5"
                    max="60"
                    value={feedDuration}
                    onChange={(e) => setFeedDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-sm font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#4A524D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={feedRepeatedEdit}
                  onChange={(e) => setFeedRepeatedEdit(e.target.checked)}
                  className="rounded border-[#E6DFD3] text-[#2E6F40] focus:ring-[#2E6F40]"
                />
                <span>{t.feedMarkRepeatedEdit}</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors"
              >
                {t.logFeedingBtn}
              </button>
            </form>

            {/* Card 2: Log Baby Sleep & Night Wake-up */}
            <form
              onSubmit={handleLogSleep}
              className="bg-white border border-[#E6DFD3] rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Moon className="w-5 h-5 text-[#5B3E85]" />
                  <h2 className="text-base font-semibold text-[#1F2421]">{t.logSleepTitle}</h2>
                </div>
                <span className="text-xs text-[#5A625D] font-mono">1 AM – 4 AM detector</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="sleep-wake-select"
                    className="block text-xs font-medium text-[#4A524D] mb-1"
                  >
                    {t.sleepWakeTimeLabel}
                  </label>
                  <select
                    id="sleep-wake-select"
                    value={sleepWakeTime}
                    onChange={(e) => setSleepWakeTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-sm font-mono"
                  >
                    <option value="02:15 AM">02:15 AM (Fragmented Burst)</option>
                    <option value="03:15 AM">03:15 AM (Fragmented Burst)</option>
                    <option value="03:40 AM">03:40 AM (Fragmented Burst)</option>
                    <option value="06:30 AM">06:30 AM (Morning Wake)</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sleep-stretch-input"
                    className="block text-xs font-medium text-[#4A524D] mb-1"
                  >
                    {t.sleepDurationLabel}
                  </label>
                  <input
                    id="sleep-stretch-input"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="8"
                    value={sleepStretch}
                    onChange={(e) => setSleepStretch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-sm font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#4A524D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={sleepFragmented}
                  onChange={(e) => setSleepFragmented(e.target.checked)}
                  className="rounded border-[#E6DFD3] text-[#2E6F40] focus:ring-[#2E6F40]"
                />
                <span>{t.sleepFragmentedLabel}</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors"
              >
                {t.logSleepBtn}
              </button>
            </form>

            {/* Card 3: In-App Search Bar with Clickable Chips & Live AI Support Answer */}
            <div className="bg-[#F4EFFA]/60 border border-[#E2D6F3] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Search className="w-5 h-5 text-[#5B3E85]" />
                  <h2 className="text-base font-semibold text-[#1F2421]">{t.inAppSearchTitle}</h2>
                </div>
                <span className="text-xs font-mono text-[#5B3E85]">AI Support Engine</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchLog(searchQuery);
                }}
                className="flex gap-2"
              >
                <label htmlFor="in-app-search-input" className="sr-only">
                  {t.inAppSearchTitle}
                </label>
                <input
                  id="in-app-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E2D6F3] text-sm text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                />
                <button
                  type="submit"
                  disabled={isSearchingAi}
                  className="px-4 py-2 rounded-xl bg-[#5B3E85] hover:bg-[#49306B] text-white text-xs font-semibold transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {isSearchingAi ? '...' : t.searchBtn}
                </button>
              </form>

              <div className="space-y-2">
                <div className="text-xs font-medium text-[#4A524D]">
                  {t.searchQuickChipsLabel}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSearchLog('baby colic at 3am')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF5F5] border border-[#E2D6F3] text-xs font-medium text-[#1F2421] transition-colors"
                  >
                    “{t.chipColic3am}”
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearchLog('why do I feel numb and overwhelmed')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF5F5] border border-[#E2D6F3] text-xs font-medium text-[#E11D48] transition-colors"
                  >
                    “{t.chipNumbOverwhelmed}”
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearchLog('normal feeding schedule')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E3F2E6] border border-[#E2D6F3] text-xs font-medium text-[#2E6F40] transition-colors"
                  >
                    “{t.chipNormalSchedule}”
                  </button>
                </div>
              </div>

              {/* AI Support Search Answer Box */}
              {searchAiAnswer && (
                <div
                  data-testid="support-search-answer"
                  className="mt-3 p-4 rounded-2xl bg-white border border-[#E2D6F3] space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#F4EFFA] pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#5B3E85] shrink-0" />
                      <span className="text-xs font-semibold text-[#1F2421]">
                        AI Support Answer: “{searchAiAnswer.query}”
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `${searchAiAnswer.summary} ${searchAiAnswer.steps.join(' ')} ${searchAiAnswer.reassurance}`,
                          lang
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F4EFFA] hover:bg-[#EAE0F6] text-[11px] font-semibold text-[#5B3E85] transition-colors shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {t.listenVoiceBtn}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1F2421] leading-relaxed">
                    {searchAiAnswer.summary}
                  </p>

                  <ul className="space-y-1.5 text-xs text-[#3A403C]">
                    {searchAiAnswer.steps.map((stepText, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-[#5B3E85] shrink-0">
                          {idx + 1}.
                        </span>
                        <span>{stepText}</span>
                      </li>
                    ))}
                  </ul>

                  {searchAiAnswer.reassurance && (
                    <div className="pt-2 border-t border-[#F4EFFA] text-xs font-medium text-[#2E6F40]">
                      {searchAiAnswer.reassurance}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card 4: 10-Second Voluntary Emoji Mood Check-In */}
            <div className="bg-[#FFF5F5]/80 border border-[#F5D0D6] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smile className="w-5 h-5 text-[#E11D48]" />
                  <h2 className="text-base font-semibold text-[#1F2421]">{t.moodCheckInTitle}</h2>
                </div>
                <span className="text-xs text-[#5A625D]">10-sec voluntary</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[
                  { key: 'Peaceful', emoji: '😌', label: t.moodPeaceful, distress: false },
                  { key: 'Steady', emoji: '🙂', label: t.moodSteady, distress: false },
                  { key: 'Tired', emoji: '😮‍💨', label: t.moodTired, distress: false },
                  { key: 'Anxious', emoji: '😟', label: t.moodAnxious, distress: true },
                  { key: 'Overwhelmed', emoji: '😣', label: t.moodOverwhelmed, distress: true },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => handleMoodLog(m.key, m.label, m.distress)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      selectedMood === m.key
                        ? 'bg-white border-[#E11D48] shadow-xs'
                        : 'bg-white/70 border-[#E6DFD3] hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl" role="img" aria-label={m.label}>
                      {m.emoji}
                    </span>
                    <span className="text-[11px] font-semibold text-[#1F2421] truncate w-full">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Chronological Activity Log Table */}
          <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6DFD3]">
              <div>
                <h2 className="text-base font-semibold text-[#1F2421]">{t.activityLogTitle}</h2>
                <p className="text-xs text-[#5A625D]">{t.activityLogSubtitle}</p>
              </div>
              <span className="text-xs font-mono text-[#2E6F40]">
                {mother.logs.length} Events Logged
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6DFD3] text-xs font-semibold text-[#5A625D]">
                    <th className="py-3 pr-4">{t.colTime}</th>
                    <th className="py-3 px-4">{t.colCategory}</th>
                    <th className="py-3 px-4">{t.colDetail}</th>
                    <th className="py-3 pl-4">{t.colBaselineShift}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFD3] text-sm">
                  {mother.logs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#FDFBF7]">
                      <td className="py-3.5 pr-4 font-mono text-xs whitespace-nowrap">
                        <span
                          className={
                            entry.isNightBurst
                              ? 'text-[#E11D48] font-semibold'
                              : 'text-[#1F2421]'
                          }
                        >
                          {entry.timestamp}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#1F2421] whitespace-nowrap">
                        {entry.category}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#3A403C]">{entry.detail}</td>
                      <td className="py-3.5 pl-4 text-xs whitespace-nowrap">
                        <span
                          className={
                            entry.isNightBurst || entry.isDistressSignal
                              ? 'text-[#E11D48] font-medium'
                              : 'text-[#2E6F40] font-medium'
                          }
                        >
                          {entry.baselineComparison}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB B: MY WELLBEING & EXPLAINABLE INSIGHTS
      =================================================================== */}
      {activeTab === 'tabB' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 14-Day Personal Baseline Comparison Chart */}
            <div className="lg:col-span-7 bg-white border border-[#E6DFD3] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h2 className="text-base font-semibold text-[#1F2421]">{t.chart14dTitle}</h2>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-[#2E6F40] font-medium">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#2E6F40] inline-block" />
                      {t.legendBaseline}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#E11D48] font-medium">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#E11D48] inline-block" />
                      {t.legendCurrentWeek}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#5A625D] mb-6">{t.chart14dSubtitle}</p>

                {/* Grouped Bar Chart for 14-Day Personal Baseline vs Rolling Pattern */}
                <div className="h-56 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-[#E6DFD3]">
                  {mother.baselineSeries14d.map((pt) => (
                    <div
                      key={pt.dayLabel}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                    >
                      <div className="w-full flex items-end justify-center gap-1 h-44">
                        <div
                          style={{ height: `${Math.max(12, pt.personalBaseline)}%` }}
                          title={`${t.legendBaseline}: ${pt.personalBaseline}`}
                          className="w-2.5 bg-[#2E6F40]/70 rounded-t"
                        />
                        <div
                          style={{ height: `${Math.max(12, pt.currentRolling)}%` }}
                          title={`${t.legendCurrentWeek}: ${pt.currentRolling}`}
                          className={`w-2.5 rounded-t ${
                            pt.currentRolling >= 70
                              ? 'bg-[#E11D48]'
                              : pt.currentRolling >= 40
                              ? 'bg-[#D97706]'
                              : 'bg-[#2E6F40]'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#5A625D]">{pt.dayLabel}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#4A524D]">
                <span>Weeks 1–4 Personal Baseline Average: {mother.baselineScore}/100</span>
                <span className="font-mono font-semibold text-[#1F2421]">
                  Current 7-Day Rolling Signal: {mother.riskScore}/100 (+
                  {mother.baselineDeviationPercent}%)
                </span>
              </div>
            </div>

            {/* "Why am I seeing this gentle check-in?" Explainable Signals Card */}
            <div className="lg:col-span-5 bg-[#F4EFFA]/70 border border-[#E2D6F3] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-[#1F2421]">{t.whyCheckInTitle}</h2>
                <p className="text-xs text-[#4A524D] mt-1">{t.whyCheckInSubtitle}</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white border border-[#E2D6F3]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#E11D48] mb-1">
                    <span>Nocturnal Rhythm Shift</span>
                    <span>
                      {mother.explainableSignals.nightSessionsCount} vs{' '}
                      {mother.explainableSignals.usualNightSessions} usual
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#1F2421]">
                    <span className="font-mono font-bold">
                      {mother.explainableSignals.nightSessionsCount}
                    </span>{' '}
                    {t.signalNightSessions}{' '}
                    <span className="font-mono font-bold">
                      {mother.explainableSignals.usualNightSessions}
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2D6F3]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#D97706] mb-1">
                    <span>Check-In Cadence</span>
                    <span>-{mother.explainableSignals.missedMoodCheckIns} days</span>
                  </div>
                  <p className="text-sm font-medium text-[#1F2421]">
                    <span className="font-mono font-bold">
                      {mother.explainableSignals.missedMoodCheckIns}
                    </span>{' '}
                    {t.signalMissedMood}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2D6F3]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#5B3E85] mb-1">
                    <span>Interaction Friction</span>
                    <span>+{mother.explainableSignals.repeatedFeedingEdits} edits</span>
                  </div>
                  <p className="text-sm font-medium text-[#1F2421]">
                    <span className="font-mono font-bold">
                      {mother.explainableSignals.repeatedFeedingEdits}
                    </span>{' '}
                    {t.signalRepeatedEdits}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gemini Empathetic Companion Card + Voice Support + 4 Actionable Next Steps */}
          <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DFD3]">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#2E6F40]" />
                  <h2 className="font-display text-lg font-semibold text-[#1F2421]">
                    {t.geminiCompanionTitle}
                  </h2>
                  <span className="text-xs text-[#2E6F40] font-medium">
                    · {t.geminiCompanionBadge}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isSpeaking
                      ? 'bg-[#E11D48] text-white'
                      : 'bg-[#2E6F40] hover:bg-[#245832] text-white'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      {t.stopVoiceBtn}
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      {t.listenVoiceBtn}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRefreshGeminiInsight}
                  disabled={isLoadingAi}
                  className="px-3.5 py-2 rounded-xl bg-[#F7F2EB] hover:bg-[#EDE5D8] text-xs font-semibold text-[#1F2421] transition-colors disabled:opacity-50"
                >
                  {isLoadingAi ? '...' : t.refreshAiBtn}
                </button>
              </div>
            </div>

            <p className="text-base text-[#1F2421] leading-relaxed bg-[#FDFBF7] p-5 rounded-2xl border border-[#E6DFD3]">
              “{companionText}”
            </p>

            {/* 4 Actionable Next Steps */}
            <div>
              <h3 className="text-xs font-semibold text-[#5A625D] uppercase tracking-wider mb-3">
                {t.nextStepsHeading}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setIsBreathingOpen(true)}
                  className="p-4 rounded-xl bg-[#E3F2E6]/70 hover:bg-[#E3F2E6] border border-[#C5E3CC] text-left transition-colors flex flex-col justify-between gap-2"
                >
                  <Wind className="w-5 h-5 text-[#2E6F40]" />
                  <span className="text-xs font-semibold text-[#1F2421]">{t.step1Breathing}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onTriggerPartnerNudge(mother.id);
                    setIsWhatsappModalOpen(true);
                    showToast(t.partnerNudgeSentToast);
                  }}
                  className="p-4 rounded-xl bg-[#F4EFFA] hover:bg-[#EAE0F6] border border-[#E2D6F3] text-left transition-colors flex flex-col justify-between gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-[#5B3E85]" />
                  <span className="text-xs font-semibold text-[#1F2421]">
                    {t.step2NudgePartner} ({mother.partnerName.split(' ')[0]})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tabC')}
                  className="p-4 rounded-xl bg-[#FFF5F5] hover:bg-[#FCE8E8] border border-[#F5D0D6] text-left transition-colors flex flex-col justify-between gap-2"
                >
                  <ClipboardCheck className="w-5 h-5 text-[#E11D48]" />
                  <span className="text-xs font-semibold text-[#1F2421]">{t.step3EpdsCheck}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onRequestCoordinatorCall(mother.id);
                    showToast(t.careCallRequestedToast);
                  }}
                  className="p-4 rounded-xl bg-[#F7F2EB] hover:bg-[#EDE5D8] border border-[#E6DFD3] text-left transition-colors flex flex-col justify-between gap-2"
                >
                  <PhoneCall className="w-5 h-5 text-[#D97706]" />
                  <span className="text-xs font-semibold text-[#1F2421]">{t.step4RequestCall}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3-Minute Guided Breathing Reset Modal */}
          {isBreathingOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            >
              <div className="bg-[#FDFBF7] border border-[#E6DFD3] rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-xl">
                <h3 className="font-display text-xl font-semibold text-[#1F2421]">
                  {t.breathingModalTitle}
                </h3>
                <div className="py-8 flex flex-col items-center justify-center">
                  <div
                    className={`w-28 h-28 rounded-full bg-[#E3F2E6] border-2 border-[#2E6F40] flex items-center justify-center transition-transform duration-700 ${
                      breathingPhase === 'inhale'
                        ? 'scale-110'
                        : breathingPhase === 'hold'
                        ? 'scale-105'
                        : 'scale-95'
                    }`}
                  >
                    <Wind className="w-10 h-10 text-[#2E6F40]" />
                  </div>
                  <p className="mt-5 text-sm font-medium text-[#1F2421]">
                    {breathingPhase === 'inhale' && t.breathingInhale}
                    {breathingPhase === 'hold' && t.breathingHold}
                    {breathingPhase === 'exhale' && t.breathingExhale}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBreathingOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#2E6F40] text-white text-xs font-semibold"
                >
                  {t.closeModalBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB C: VALIDATED EPDS / PHQ-9 SELF-SCREENING & SUPPORT ROUTING
      =================================================================== */}
      {activeTab === 'tabC' && (
        <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E6DFD3] pb-4">
            <h2 className="font-display text-xl font-semibold text-[#1F2421]">{t.tabCTitle}</h2>
            <p className="text-xs text-[#5A625D] mt-1">{t.tabCSubtitle}</p>
          </div>

          {mother.epdsRequestedByDoctor && (
            <div className="p-4 rounded-xl bg-[#F4EFFA] border border-[#E2D6F3] flex items-center gap-3 text-xs font-semibold text-[#5B3E85]">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{t.epdsDoctorPromptBanner}</span>
            </div>
          )}

          <div className="space-y-5">
            {[t.epdsQ1, t.epdsQ2, t.epdsQ3, t.epdsQ4, t.epdsQ5].map((question, qIndex) => (
              <div
                key={question}
                className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3] space-y-3"
              >
                <p className="text-sm font-semibold text-[#1F2421]">{question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { val: 0, label: t.epdsOpt0 },
                    { val: 1, label: t.epdsOpt1 },
                    { val: 2, label: t.epdsOpt2 },
                    { val: 3, label: t.epdsOpt3 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => {
                        const next = [...epdsAnswers];
                        next[qIndex] = opt.val;
                        setEpdsAnswers(next);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-colors ${
                        epdsAnswers[qIndex] === opt.val
                          ? 'bg-[#2E6F40] text-white border-[#2E6F40]'
                          : 'bg-white text-[#3A403C] border-[#E6DFD3] hover:bg-[#F7F2EB]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEpdsSubmitted(true);
                onSaveEpdsScore(mother.id, epdsEval.totalScore, false);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-sm font-semibold transition-colors"
            >
              {t.submitEpdsBtn}
            </button>
            {epdsSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setEpdsSubmitted(false);
                  setRoutedToDoctor(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#F7F2EB] text-xs font-semibold text-[#1F2421]"
              >
                {t.resetEpdsBtn}
              </button>
            )}
          </div>

          {epdsSubmitted && (
            <div className="p-6 rounded-2xl bg-[#F4EFFA] border border-[#E2D6F3] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-[#1F2421]">{t.epdsResultHeading}</h3>
                <span className="font-mono text-lg font-bold text-[#1F2421]">
                  Score: {epdsEval.totalScore} / {epdsEval.maxScore} (
                  {epdsEval.severity.toUpperCase()})
                </span>
              </div>
              <p className="text-sm text-[#3A403C] leading-relaxed">
                {t[epdsEval.recommendationKey]}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSaveEpdsScore(mother.id, epdsEval.totalScore, true);
                    setRoutedToDoctor(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold transition-colors"
                >
                  {t.routeToDoctorBtn}
                </button>
                {routedToDoctor && (
                  <span className="text-xs font-semibold text-[#2E6F40] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.routedSuccessMsg}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          TAB D: PRIVACY & CONSENT CENTER (PRIVACY-BY-DESIGN)
      =================================================================== */}
      {activeTab === 'tabD' && (
        <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD3] pb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1F2421]">{t.tabDTitle}</h2>
              <p className="text-xs text-[#5A625D] mt-1">{t.tabDSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsWhatsappModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              {t.previewWhatsappBtn}
            </button>
          </div>

          <div className="space-y-4">
            {/* Toggle 1 */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-[#1F2421]">
                    {t.consentToggle1Title}
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      mother.consent.behaviouralSignalAnalysis
                        ? 'text-[#2E6F40]'
                        : 'text-[#D97706]'
                    }`}
                  >
                    ·{' '}
                    {mother.consent.behaviouralSignalAnalysis
                      ? t.statusActive
                      : t.statusPaused}
                  </span>
                </div>
                <p className="text-xs text-[#5A625D]">{t.consentToggle1Desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={mother.consent.behaviouralSignalAnalysis}
                aria-label={t.consentToggle1Title}
                onClick={() =>
                  onUpdateConsent(mother.id, {
                    ...mother.consent,
                    behaviouralSignalAnalysis: !mother.consent.behaviouralSignalAnalysis,
                  })
                }
                className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center shrink-0 ${
                  mother.consent.behaviouralSignalAnalysis
                    ? 'bg-[#2E6F40] justify-end'
                    : 'bg-[#D6CFC2] justify-start'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-[#1F2421]">
                    {t.consentToggle2Title}
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      mother.consent.partnerWhatsappNudges ? 'text-[#2E6F40]' : 'text-[#D97706]'
                    }`}
                  >
                    · {mother.consent.partnerWhatsappNudges ? t.statusActive : t.statusPaused}
                  </span>
                </div>
                <p className="text-xs text-[#5A625D]">{t.consentToggle2Desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={mother.consent.partnerWhatsappNudges}
                aria-label={t.consentToggle2Title}
                onClick={() =>
                  onUpdateConsent(mother.id, {
                    ...mother.consent,
                    partnerWhatsappNudges: !mother.consent.partnerWhatsappNudges,
                  })
                }
                className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center shrink-0 ${
                  mother.consent.partnerWhatsappNudges
                    ? 'bg-[#2E6F40] justify-end'
                    : 'bg-[#D6CFC2] justify-start'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-[#1F2421]">
                    {t.consentToggle3Title}
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      mother.consent.clinicianEscalationOptIn
                        ? 'text-[#2E6F40]'
                        : 'text-[#D97706]'
                    }`}
                  >
                    · {mother.consent.clinicianEscalationOptIn ? t.statusActive : t.statusPaused}
                  </span>
                </div>
                <p className="text-xs text-[#5A625D]">{t.consentToggle3Desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={mother.consent.clinicianEscalationOptIn}
                aria-label={t.consentToggle3Title}
                onClick={() =>
                  onUpdateConsent(mother.id, {
                    ...mother.consent,
                    clinicianEscalationOptIn: !mother.consent.clinicianEscalationOptIn,
                  })
                }
                className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center shrink-0 ${
                  mother.consent.clinicianEscalationOptIn
                    ? 'bg-[#2E6F40] justify-end'
                    : 'bg-[#D6CFC2] justify-start'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner WhatsApp Preview Modal */}
      <WhatsappPreviewModal
        isOpen={isWhatsappModalOpen}
        onClose={() => setIsWhatsappModalOpen(false)}
        motherName={mother.name}
        partnerName={mother.partnerName}
        partnerPhone={mother.partnerPhone}
        nightSessionsCount={mother.explainableSignals.nightSessionsCount}
        lang={lang}
        t={t}
      />
    </div>
  );
};

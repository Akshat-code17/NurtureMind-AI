import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Watch,
  X,
  Send,
  Mic,
  CheckCircle2,
  ExternalLink,
  Volume2,
  Sparkles,
  Phone,
} from 'lucide-react';
import {
  type MotherProfile,
  type DoctorProfile,
  resolveAssignedDoctor,
  buildWhatsAppDeepLink,
} from '../utils/riskEngine';
import { type LanguageCode, speakText } from '../i18n/translations';

interface WhatsAppBotWidgetProps {
  mother: MotherProfile;
  doctors: DoctorProfile[];
  lang: LanguageCode;
  isOpenExternal?: boolean;
  onOpenExternal?: () => void;
  onCloseExternal?: () => void;
  showWatchLauncher?: boolean;
  isWatchOpen?: boolean;
  onOpenWatch?: () => void;
  onProcessVoiceOrText: (
    motherId: string,
    messageText: string,
    lang: 'en' | 'hi' | 'kn'
  ) => {
    feeding: string;
    durationMins?: number;
    wakeups: number;
    mood: number;
    moodLabel: string;
    updatedRiskScore: number;
    assignedDoctorName: string;
  };
  onTriggerPartnerNudge: (motherId: string) => void;
  onRequestDoctorCallback: (motherId: string) => void;
}

interface ChatItem {
  id: string;
  sender: 'mother' | 'bot';
  text: string;
  timestamp: string;
  isVoiceNote?: boolean;
  extractedJson?: {
    feeding: string;
    durationMins?: number;
    wakeups: number;
    mood: number;
    moodLabel?: string;
    updatedRiskScore?: number;
  };
  partnerWaLink?: string;
  partnerPreviewText?: string;
}

export const WhatsAppBotWidget: React.FC<WhatsAppBotWidgetProps> = ({
  mother,
  doctors,
  lang,
  isOpenExternal,
  onOpenExternal,
  onCloseExternal,
  showWatchLauncher = false,
  isWatchOpen = false,
  onOpenWatch,
  onProcessVoiceOrText,
  onTriggerPartnerNudge,
  onRequestDoctorCallback,
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState<boolean>(false);
  const [botLang, setBotLang] = useState<'en' | 'hi' | 'kn'>(lang);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [targetPhoneInput, setTargetPhoneInput] = useState<string>(
    mother.partnerPhone || '+91 98450 71234'
  );

  // Sync default phone number when switching mother
  useEffect(() => {
    if (mother.partnerPhone) {
      setTargetPhoneInput(mother.partnerPhone);
    }
  }, [mother.id, mother.partnerPhone]);

  // Mutual exclusion: if Apple Watch popup opens, close internal WhatsApp state
  useEffect(() => {
    if (isWatchOpen) {
      setIsOpenInternal(false);
    }
  }, [isWatchOpen]);

  const assignedDoctor = resolveAssignedDoctor(mother, doctors);
  const isOpen = Boolean(isOpenExternal || isOpenInternal);

  const setOpen = (next: boolean) => {
    setIsOpenInternal(next);
    if (next && onOpenExternal) {
      onOpenExternal();
    }
    if (!next && onCloseExternal) {
      onCloseExternal();
    }
  };

  const getGreetingMessage = (l: 'en' | 'hi' | 'kn'): string => {
    if (l === 'hi') {
      return `नमस्ते ${mother.name} 🙏 मैं NurtureMind AI का आधिकारिक WhatsApp केयर बॉट (Bhashini Voice Enabled) हूँ। आप बोलकर या लिखकर ${mother.babyName} की फीडिंग, नींद या अपने मन की बात साझा कर सकती हैं।`;
    }
    if (l === 'kn') {
      return `ನಮಸ್ಕಾರ ${mother.name} 🙏 ನಾನು NurtureMind AI ಅಧಿಕೃತ WhatsApp ಕೇರ್ ಬಾಟ್ (Bhashini Voice Enabled). ನೀವು ಧ್ವನಿ ಸಂದೇಶ ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ${mother.babyName} ಆರೈಕೆ ಮತ್ತು ನಿಮ್ಮ ಮನಸ್ಥಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಬಹುದು.`;
    }
    return `Namaste ${mother.name} 🙏 Welcome to NurtureMind AI Official 2-Way WhatsApp Care Bot (Bhashini Voice Enabled). Type any natural-language care update or record a voice note below—synced live with ${assignedDoctor.fullName} at ${assignedDoctor.hospitalName} for ${mother.babyName}.`;
  };

  const [messages, setMessages] = useState<ChatItem[]>(() => [
    {
      id: 'wa-init-1',
      sender: 'bot',
      text: getGreetingMessage(lang),
      timestamp: '03:08 AM',
    },
  ]);

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getSampleVoiceNoteByLang = (l: 'en' | 'hi' | 'kn'): string => {
    if (l === 'hi') {
      return `🎙️ [0:12 Voice Note - हिंदी] ${mother.babyName} ने रात 3:10 AM पर 20 मिनट दूध पिया, 3 बार नींद खुली, मुझे बहुत थकान और घबराहट हो रही है`;
    }
    if (l === 'kn') {
      return `🎙️ [0:12 Voice Note - ಕನ್ನಡ] ${mother.babyName} ರಾತ್ರಿ 3:10 AM ಕ್ಕೆ 20 ನಿಮಿಷ ಹಾಲು ಕುಡಿಯಿತು, 3 ಬಾರಿ ಎಚ್ಚರವಾಯಿತು, ನನಗೆ ತುಂಬಾ ಸುಸ್ತಾಗಿದೆ ಮತ್ತು ಆತಂಕವಾಗುತ್ತಿದೆ`;
    }
    return `🎙️ [0:12 Voice Note] ${mother.babyName} fed for 20 mins at 3:10 AM, woke up 3 times, feeling very exhausted and anxious`;
  };

  // 1. Send Voice Note / Custom Natural-Language Text with 600ms Realistic "Typing..." Indicator
  const handleSendVoiceNoteOrText = (
    customText?: string,
    isVoiceNote: boolean = false
  ) => {
    const rawMsg =
      customText ||
      inputText.trim() ||
      getSampleVoiceNoteByLang(botLang);
    if (!rawMsg) return;

    const userMsg: ChatItem = {
      id: `wa-u-${Date.now()}`,
      sender: 'mother',
      text: rawMsg,
      timestamp: nowTime(),
      isVoiceNote,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Sync immediately to Mother's Dashboard history & Supabase so state updates right away,
    // and reveal the bot reply bubble after a realistic 600ms "Typing..." indicator
    const result = onProcessVoiceOrText(mother.id, rawMsg, botLang);
    const durationPart = result.durationMins
      ? ` (${result.durationMins} mins)`
      : '';

    const replyText =
      botLang === 'hi'
        ? `✅ ${mother.name}, आपका और ${mother.babyName} का केयर लॉग डैशबोर्ड और Supabase में सेव हो गया!\n• निकाला गया डेटा: फीडिंग ${result.feeding}${durationPart}, रात में जागना: ${result.wakeups} बार, मूड: ${result.mood}/5\n• अपडेटेड 7-दिन जोखिम स्कोर: ${result.updatedRiskScore}/100\n• आपकी असाइन की गई डॉक्टर ${result.assignedDoctorName} (${assignedDoctor.hospitalName}) के क्लिनिकल डैशबोर्ड को तुरंत अपडेट कर दिया गया है।`
        : botLang === 'kn'
        ? `✅ ${mother.name}, ನಿಮ್ಮ ಮತ್ತು ${mother.babyName} ಅವರ ಆರೈಕೆ ಲಾಗ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು Supabase ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ!\n• ಹೊರತೆಗೆದ ಮಾಹಿತಿ: ಫೀಡಿಂಗ್ ${result.feeding}${durationPart}, ಎಚ್ಚರ: ${result.wakeups} ಬಾರಿ, ಮನಸ್ಥಿತಿ: ${result.mood}/5\n• ನವೀಕರಿಸಿದ 7-ದಿನದ ರಿಸ್ಕ್ ಸ್ಕೋರ್: ${result.updatedRiskScore}/100\n• ನಿಮ್ಮ ವೈದ್ಯರಾದ ${result.assignedDoctorName} (${assignedDoctor.hospitalName}) ಪೋರ್ಟಲ್‌ಗೆ ತಕ್ಷಣ ಮಾಹಿತಿ ಕಳುಹಿಸಲಾಗಿದೆ.`
        : `✅ Care log for ${mother.babyName} synced to ${mother.name}'s Dashboard & Supabase Cloud DB!\n• Extracted Telemetry: { feeding: '${result.feeding}${durationPart}', wakeups: ${result.wakeups}, mood: ${result.mood}/5 (${result.moodLabel}) }\n• Recalculated 7-Day Risk Score: ${result.updatedRiskScore}/100\n• Clinical Care Routing: ${result.assignedDoctorName} (${assignedDoctor.hospitalName}) has been updated with your latest rhythm.`;

    setTimeout(() => {
      const botMsg: ChatItem = {
        id: `wa-b-${Date.now() + 1}`,
        sender: 'bot',
        text: replyText,
        timestamp: nowTime(),
        extractedJson: {
          feeding: `${result.feeding}${durationPart}`,
          durationMins: result.durationMins,
          wakeups: result.wakeups,
          mood: result.mood,
          moodLabel: result.moodLabel,
          updatedRiskScore: result.updatedRiskScore,
        },
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  // 2. Tap [ Check My Wellbeing Rhythm ]
  const handleCheckWellbeingRhythm = () => {
    const userMsg: ChatItem = {
      id: `wa-u-${Date.now()}`,
      sender: 'mother',
      text: 'Check My Wellbeing Rhythm',
      timestamp: nowTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const replyText =
      botLang === 'hi'
        ? `📊 ${mother.name} (${mother.babyName}) का 7-दिवसीय व्यवहारिक लय सारांश:\n• वर्तमान सिग्नल: ${mother.riskScore}/100 (व्यक्तिगत बेसलाइन ${mother.baselineScore}/100 से +${mother.baselineDeviationPercent}% बदलाव)\n• रात के सत्र (1–4 AM): ${mother.explainableSignals.nightSessionsCount} (सामान्य: ${mother.explainableSignals.usualNightSessions})\n• Apple Watch नींद: ${mother.watchTelemetry?.sleepSummaryLabel || '3.1 hrs sleep / 6 wake-ups'}\n• क्लिनिकल नोट: यह कोई निदान नहीं है; ${assignedDoctor.fullName} आपकी देखभाल टीम में उपलब्ध हैं।`
        : botLang === 'kn'
        ? `📊 ${mother.name} (${mother.babyName}) ಅವರ 7-ದಿನದ ಯೋಗಕ್ಷೇಮ ಲಯ ಸಾರಾಂಶ:\n• ಪ್ರಸ್ತುತ ಸಿಗ್ನಲ್: ${mother.riskScore}/100 (ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್ ${mother.baselineScore}/100 ಗಿಂತ +${mother.baselineDeviationPercent}% ಬದಲಾವಣೆ)\n• ರಾತ್ರಿ ಅವಧಿಗಳು (1–4 AM): ${mother.explainableSignals.nightSessionsCount} (ಸಾಮಾನ್ಯ: ${mother.explainableSignals.usualNightSessions})\n• Apple Watch ನಿದ್ದೆ: ${mother.watchTelemetry?.sleepSummaryLabel || '3.1 hrs sleep / 6 wake-ups'}\n• ವೈದ್ಯಕೀಯ ಸೂಚನೆ: ಇದು ರೋಗನಿರ್ಣಯವಲ್ಲ; ${assignedDoctor.fullName} ನಿಮ್ಮ ಆರೈಕೆಗೆ ಲಭ್ಯವಿದ್ದಾರೆ.`
        : `📊 7-Day Explainable Wellbeing Rhythm for ${mother.name} & ${mother.babyName}:\n• Rolling Signal: ${mother.riskScore}/100 (+${mother.baselineDeviationPercent}% vs Weeks 1–4 personal baseline of ${mother.baselineScore}/100)\n• Nocturnal Bursts (1–4 AM): ${mother.explainableSignals.nightSessionsCount} sessions vs ${mother.explainableSignals.usualNightSessions} usual\n• Apple Watch Biometrics: ${mother.watchTelemetry?.sleepSummaryLabel || '3.1 hrs sleep / 6 wake-ups'} (HRV ${mother.watchTelemetry?.hrvMs || 29} ms)\n• Assigned Care Team: ${assignedDoctor.fullName} (${assignedDoctor.hospitalName})`;

    setTimeout(() => {
      const botMsg: ChatItem = {
        id: `wa-b-${Date.now() + 1}`,
        sender: 'bot',
        text: replyText,
        timestamp: nowTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  // 3. Tap [ Send Partner Support Nudge ]
  const handleSendPartnerSupportNudge = () => {
    onTriggerPartnerNudge(mother.id);

    const partnerPreview = `Hi ${mother.partnerName}, NurtureMind Care Companion here. ${mother.name} has logged ${mother.explainableSignals.nightSessionsCount} late-night newborn care sessions with ${mother.babyName}. Could you take the next 2-hour soothing/burping shift so she can get uninterrupted rest? (Zero private search logs shared).`;
    const waLink = buildWhatsAppDeepLink(targetPhoneInput, partnerPreview);

    const userMsg: ChatItem = {
      id: `wa-u-${Date.now()}`,
      sender: 'mother',
      text: 'Send Partner Support Nudge',
      timestamp: nowTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const replyText =
      botLang === 'hi'
        ? `🤝 आपके पार्टनर ${mother.partnerName} (${targetPhoneInput}) के लिए गैर-नैदानिक (Non-clinical) सह-देखभाल संदेश तैयार है। आपकी निजी सर्च हिस्ट्री कभी साझा नहीं की जाती है।`
        : botLang === 'kn'
        ? `🤝 ನಿಮ್ಮ ಸಂಗಾತಿ ${mother.partnerName} (${targetPhoneInput}) ಅವರಿಗೆ ಬೆಂಬಲ ಸಂದೇಶ ಸಿದ್ಧವಾಗಿದೆ. ನಿಮ್ಮ ಖಾಸಗಿ ಹುಡುಕಾಟಗಳನ್ನು ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಲಾಗುವುದಿಲ್ಲ.`
        : `🤝 Prepared consented Partner Co-Care Nudge for ${mother.partnerName} (${targetPhoneInput}). Zero private search queries or clinical labels are exposed.`;

    setTimeout(() => {
      const botMsg: ChatItem = {
        id: `wa-b-${Date.now() + 1}`,
        sender: 'bot',
        text: replyText,
        timestamp: nowTime(),
        partnerWaLink: waLink,
        partnerPreviewText: partnerPreview,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  // 4. Tap [ Request Doctor Callback ]
  const handleRequestDoctorCallback = () => {
    onRequestDoctorCallback(mother.id);

    const userMsg: ChatItem = {
      id: `wa-u-${Date.now()}`,
      sender: 'mother',
      text: 'Request Doctor Callback',
      timestamp: nowTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const replyText =
      botLang === 'hi'
        ? `🩺 आपकी असाइन की गई डॉक्टर ${assignedDoctor.fullName} (${assignedDoctor.hospitalName}, ID: ${assignedDoctor.systemId}) को क्लिनिकल कतार में तुरंत फ्लैग कर दिया गया है। पेरिनेटल केयर कोऑर्डिनेटर आपसे जल्द संपर्क करेंगे।`
        : botLang === 'kn'
        ? `🩺 ನಿಮ್ಮ ನಿಯೋಜಿತ ವೈದ್ಯರಾದ ${assignedDoctor.fullName} (${assignedDoctor.hospitalName}, ID: ${assignedDoctor.systemId}) ಅವರ ಕ್ಲಿನಿಕಲ್ ಸರತಿಯಲ್ಲಿ ತಕ್ಷಣವೇ ಫ್ಲ್ಯಾಗ್ ಮಾಡಲಾಗಿದೆ.`
        : `🩺 Priority Callback Flagged! Your assigned clinician ${assignedDoctor.fullName} (${assignedDoctor.hospitalName} · Clinic Code ${assignedDoctor.clinicCode}) has been alerted in the clinical queue immediately.`;

    setTimeout(() => {
      const botMsg: ChatItem = {
        id: `wa-b-${Date.now() + 1}`,
        sender: 'bot',
        text: replyText,
        timestamp: nowTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  // Real External WhatsApp Deep-Link URLs (`https://wa.me/`)
  const liveCareSummaryMessage = `NurtureMind AI Live Care Summary for ${mother.name} (${mother.hospitalId}) & ${mother.babyName}:\n• 7-Day Risk Signal: ${mother.riskScore}/100 (+${mother.baselineDeviationPercent}% vs personal baseline)\n• Late-Night Sessions (1–4 AM): ${mother.explainableSignals.nightSessionsCount}\n• Assigned Clinician: ${assignedDoctor.fullName} (${assignedDoctor.hospitalName})`;

  const partnerSupportNudgeMessage = `Hi ${mother.partnerName}, NurtureMind AI Care Companion here. ${mother.name} has logged ${mother.explainableSignals.nightSessionsCount} late-night care sessions with ${mother.babyName}. Could you take the next 2-hour soothing shift so she can get uninterrupted rest? (Zero private search logs shared).`;

  const realWhatsAppSelfUrl = buildWhatsAppDeepLink(
    targetPhoneInput,
    liveCareSummaryMessage
  );
  const realWhatsAppPartnerUrl = buildWhatsAppDeepLink(
    targetPhoneInput,
    partnerSupportNudgeMessage
  );

  return (
    <>
      {/* Compact, Non-Overlapping Vertical Floating Dock (Bottom-Right) */}
      <div
        data-testid="floating-action-dock"
        className="flex flex-col items-end gap-2.5 fixed bottom-5 right-5 z-40"
      >
        {!isOpen && (
          <button
            type="button"
            data-testid="floating-whatsapp-bot-btn"
            onClick={() => setOpen(true)}
            className="px-3.5 py-2 text-xs font-medium shadow-lg rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white border border-emerald-200/40 flex items-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-white shrink-0" />
            <span>Live WhatsApp Care Bot</span>
          </button>
        )}

        {showWatchLauncher && !isWatchOpen && onOpenWatch && (
          <button
            type="button"
            data-testid="floating-watch-launcher"
            onClick={() => {
              setOpen(false);
              onOpenWatch();
            }}
            className="px-3.5 py-2 text-xs font-medium shadow-lg rounded-xl bg-[#16191D] hover:bg-[#23282E] text-white border border-emerald-400/50 flex items-center gap-2 transition-all"
          >
            <Watch className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Live Apple Watch ({mother.watchTelemetry?.heartRateBpm || 88} BPM)
            </span>
          </button>
        )}
      </div>

      {/* Realistic WhatsApp Phone Modal UI */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="NurtureMind AI Official WhatsApp Care Bot"
          data-testid="whatsapp-bot-modal"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <div className="w-full max-w-md bg-[#ECE5DD] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#075E54] flex flex-col max-h-[92vh]">
            {/* WhatsApp Official Green Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-[#075E54] flex items-center justify-center font-bold text-xs shrink-0">
                  NM
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm truncate">
                      NurtureMind AI Official Bot
                    </span>
                    <CheckCircle2
                      className="w-4 h-4 text-[#25D366] shrink-0"
                      aria-label="Verified Business"
                    />
                  </div>
                  <div className="text-[11px] text-emerald-100 truncate">
                    Verified Business · {mother.name} ({mother.babyName})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={realWhatsAppSelfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="wa-open-real-app-header-btn"
                  title="Open in Real WhatsApp Web / Mobile App"
                  className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#075E54] text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Open in Real WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  data-testid="close-whatsapp-bot-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Close WhatsApp Bot"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Multilingual Bhashini Selector Bar inside WhatsApp */}
            <div className="bg-[#128C7E] text-white px-3.5 py-1.5 flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Bhashini Voice & Chat:</span>
              </span>
              <div className="flex items-center gap-1">
                {(
                  [
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'kn', label: 'ಕನ್ನಡ' },
                  ] as const
                ).map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    data-testid={`wa-lang-${l.code}`}
                    onClick={() => setBotLang(l.code)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      botLang === l.code
                        ? 'bg-white text-[#075E54]'
                        : 'bg-[#075E54]/60 text-white hover:bg-[#075E54]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real External WhatsApp Web / Mobile App Deep-Link Panel */}
            <div className="bg-[#FDFBF7] border-b border-[#D8D3C8] px-3.5 py-2.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="wa-real-phone-input"
                  className="text-[11px] font-semibold text-[#075E54] flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Real WhatsApp Number (Mother / Partner / Demo):</span>
                </label>
                <input
                  id="wa-real-phone-input"
                  data-testid="wa-real-phone-input"
                  type="text"
                  value={targetPhoneInput}
                  onChange={(e) => setTargetPhoneInput(e.target.value)}
                  placeholder="+91 98450 71234"
                  className="w-36 px-2.5 py-1 rounded-lg bg-white border border-[#C5E3CC] text-[11px] font-mono text-[#1F2421] focus:outline-none focus:border-[#075E54]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <a
                  href={realWhatsAppSelfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="wa-send-self-real-link"
                  className="py-1.5 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#075E54] font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Send Live Message to My Real WhatsApp</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
                <a
                  href={realWhatsAppPartnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="wa-send-partner-real-link"
                  className="py-1.5 px-2.5 rounded-lg bg-[#075E54] hover:bg-[#128C7E] text-white font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Send Partner Nudge on Real WhatsApp</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* Chat Messages Scroll Container */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'mother' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      m.sender === 'mother'
                        ? 'bg-[#DCF8C6] text-[#1F2421] rounded-br-xs'
                        : 'bg-white text-[#1F2421] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {m.extractedJson && (
                      <div
                        data-testid="wa-bot-extracted-telemetry"
                        className="mt-2 p-2 rounded-xl bg-[#F4EFFA] border border-[#E2D6F3] font-mono text-[11px] text-[#5B3E85]"
                      >
                        <div>
                          Extracted:{' '}
                          {`{ feeding: '${m.extractedJson.feeding}', wakeups: ${m.extractedJson.wakeups}, mood: ${m.extractedJson.mood} }`}
                        </div>
                        <div className="font-bold text-[#E11D48] mt-0.5">
                          Synced 7-Day Risk Score: {m.extractedJson.updatedRiskScore}/100
                        </div>
                      </div>
                    )}

                    {m.partnerWaLink && (
                      <div className="mt-2.5 space-y-2 p-2.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3]">
                        <div className="text-[11px] text-[#4A524D] italic">
                          “{m.partnerPreviewText}”
                        </div>
                        <a
                          href={m.partnerWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="wa-partner-click-to-chat-link"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-[#075E54] font-semibold text-[11px]"
                        >
                          <span>Open Click-to-Chat ({targetPhoneInput})</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <div className="mt-1 flex items-center justify-end gap-2 text-[10px] text-[#5A625D]">
                      {m.sender === 'bot' && (
                        <button
                          type="button"
                          onClick={() => speakText(m.text, botLang)}
                          className="inline-flex items-center gap-0.5 text-[#075E54] font-semibold hover:underline"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                      )}
                      <span>{m.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Realistic 600ms "Typing..." Indicator */}
              {isTyping && (
                <div
                  data-testid="wa-bot-typing-indicator"
                  className="flex items-start"
                >
                  <div className="bg-white text-[#075E54] rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs font-semibold shadow-2xs flex items-center gap-2">
                    <span>NurtureMind AI Bot is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Interactive 1-Tap WhatsApp Quick Replies & Bhashini Voice Note Simulator */}
            <div className="bg-[#F0EEE9] border-t border-[#D8D3C8] p-3 space-y-2">
              <div className="text-[11px] font-semibold text-[#075E54]">
                1-Tap WhatsApp Commands & Bhashini Voice Note Simulator:
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  data-testid="wa-bot-cmd-voicenote"
                  onClick={() =>
                    handleSendVoiceNoteOrText(
                      getSampleVoiceNoteByLang(botLang),
                      true
                    )
                  }
                  className="w-full py-1.5 px-3 rounded-xl bg-[#FFF5F5] hover:bg-[#FCE8E8] border border-[#F5D0D6] text-left text-[11px] font-semibold text-[#E11D48] flex items-center gap-2 transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Simulate Voice Note ({botLang.toUpperCase()}): {mother.babyName} fed at 3:10 AM, woke up 3 times...
                  </span>
                </button>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    data-testid="wa-bot-cmd-rhythm"
                    onClick={handleCheckWellbeingRhythm}
                    className="py-1.5 px-2 rounded-xl bg-white hover:bg-[#E3F2E6] border border-[#C5E3CC] text-[11px] font-semibold text-[#075E54] text-center transition-colors"
                  >
                    Check Wellbeing Rhythm
                  </button>

                  <button
                    type="button"
                    data-testid="wa-bot-cmd-partner"
                    onClick={handleSendPartnerSupportNudge}
                    className="py-1.5 px-2 rounded-xl bg-white hover:bg-[#E3F2E6] border border-[#C5E3CC] text-[11px] font-semibold text-[#075E54] text-center transition-colors"
                  >
                    Send Partner Nudge
                  </button>

                  <button
                    type="button"
                    data-testid="wa-bot-cmd-doctor"
                    onClick={handleRequestDoctorCallback}
                    className="py-1.5 px-2 rounded-xl bg-white hover:bg-[#E3F2E6] border border-[#C5E3CC] text-[11px] font-semibold text-[#075E54] text-center transition-colors"
                  >
                    Request Doctor Callback
                  </button>
                </div>
              </div>

              {/* Free-Text Natural-Language WhatsApp Message Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendVoiceNoteOrText();
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  data-testid="wa-bot-text-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type e.g. Baby fed for 20 mins at 2 AM, woke up 3 times, I feel very anxious..."
                  className="flex-1 px-3.5 py-2 rounded-full bg-white border border-[#D8D3C8] text-xs text-[#1F2421] focus:outline-none focus:border-[#075E54]"
                />
                <button
                  type="submit"
                  data-testid="wa-bot-send-btn"
                  aria-label="Send WhatsApp Message"
                  className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white flex items-center justify-center shrink-0 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


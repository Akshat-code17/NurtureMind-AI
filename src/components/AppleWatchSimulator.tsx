import React, { useState } from 'react';
import {
  Watch,
  Heart,
  Activity,
  Moon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  X,
  Stethoscope,
} from 'lucide-react';
import {
  type MotherProfile,
  type DoctorProfile,
} from '../utils/riskEngine';

interface AppleWatchSimulatorProps {
  mother: MotherProfile;
  assignedDoctor: DoctorProfile;
  mode: 'tab' | 'floating';
  onWatchFeedResponse: (response: 'fed' | 'snooze') => void;
  onWatchMoodResponse: (mood: 'Calm' | 'Exhausted' | 'Overwhelmed') => void;
  onTriggerSosPartnerNudge: () => void;
  onAcknowledgePrescription: (prescriptionId: string) => void;
  onCloseFloating?: () => void;
}

export const AppleWatchSimulator: React.FC<AppleWatchSimulatorProps> = ({
  mother,
  assignedDoctor,
  mode,
  onWatchFeedResponse,
  onWatchMoodResponse,
  onTriggerSosPartnerNudge,
  onAcknowledgePrescription,
  onCloseFloating,
}) => {
  const [watchToast, setWatchToast] = useState<string | null>(null);
  const [sosWhatsappPreviewOpen, setSosWhatsappPreviewOpen] = useState<boolean>(false);
  const [sosSentConfirmed, setSosSentConfirmed] = useState<boolean>(false);

  const watch = mother.watchTelemetry || {
    heartRateBpm: 88,
    hrvMs: 29,
    totalSleepHours: 3.1,
    deepSleepHours: 0.7,
    wakeBoutCount: 6,
    sleepSummaryLabel: '3.1 hrs sleep / 6 wake-ups',
    moveRingPct: 84,
    restRingPct: 38,
    hydrationRingPct: 62,
    lastWatchAction: 'Synced with NurtureMind Companion',
    lastSyncedAt: 'Just now',
  };

  const prescriptions = mother.watchPrescriptions || [];
  const unacknowledgedRx = prescriptions.filter((rx) => !rx.acknowledged);

  const triggerWatchFeedback = (msg: string) => {
    setWatchToast(msg);
    setTimeout(() => setWatchToast(null), 4000);
  };

  const sosMessageText = `Hi ${mother.partnerName}, ${mother.name}'s Apple Watch & NurtureMind companion noticed high night sleep fragmentation. She needs a 2-hour uninterrupted sleep block—could you take over baby care duty? (No private logs shared).`;

  return (
    <div
      data-testid={
        mode === 'floating' ? 'apple-watch-floating-widget' : 'apple-watch-tab-view'
      }
      className={
        mode === 'floating'
          ? 'fixed bottom-16 right-5 z-40 w-[355px] sm:w-[385px] bg-[#16191D] text-white border-2 border-[#343B44] rounded-3xl p-4 shadow-2xl space-y-3.5'
          : 'bg-white border border-[#E6DFD3] rounded-2xl p-6 space-y-6'
      }
    >
      {/* Header for Floating or Tab Mode */}
      {mode === 'floating' ? (
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2E6F40] flex items-center justify-center text-white">
              <Watch className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                watchOS 11 · {mother.name.split(' ')[0]}&apos;s Watch
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                Live Sync · Dr. {assignedDoctor.fullName.replace(/^Dr\.?\s*/i, '')}
              </div>
            </div>
          </div>
          {onCloseFloating && (
            <button
              type="button"
              onClick={onCloseFloating}
              aria-label="Minimize Watch Simulator"
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DFD3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#16191D] text-emerald-400 flex items-center justify-center shrink-0">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-[#1F2421]">
                Interactive Apple Watch / Smartwatch Simulator & Wearable Telemetry
              </h2>
              <p className="text-xs text-[#5A625D]">
                Real-time watchOS biometric rings, 1-tap micro check-ins, SOS Partner Rest Nudge,
                and live prescriptions from{' '}
                <strong>{assignedDoctor.fullName}</strong> ({assignedDoctor.hospitalName}).
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-[#E3F2E6] text-[#2E6F40] text-xs font-mono font-semibold self-start">
            Synced: {watch.lastSyncedAt}
          </span>
        </div>
      )}

      {/* Main Layout: Watch Bezel + Wearable Telemetry Breakdown */}
      <div
        className={
          mode === 'tab'
            ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'
            : 'space-y-3'
        }
      >
        {/* Interactive Apple Watch Hardware Frame */}
        <div
          className={
            mode === 'tab'
              ? 'lg:col-span-6 bg-[#14171A] text-white rounded-[36px] p-5 border-4 border-[#2E343B] shadow-xl space-y-4 max-w-md mx-auto w-full'
              : 'space-y-3'
          }
        >
          {/* Watch Top Bar: Time + Live Heart Rate & HRV */}
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Watch className="w-3.5 h-3.5" />
              <span>NURTUREMIND OS</span>
            </span>
            <span className="text-gray-300">03:20 AM</span>
          </div>

          {/* watchOS Biometric Rings + Sleep Fragmentation Summary */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            {/* Concentric SVG Activity/Rest Rings */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#2A2F37"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="3"
                  strokeDasharray={`${watch.moveRingPct} 100`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="11"
                  fill="none"
                  stroke="#2A2F37"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="11"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray={`${watch.restRingPct} 100`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="7"
                  fill="none"
                  stroke="#2A2F37"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="7"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray={`${watch.hydrationRingPct} 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-rose-400 flex items-center gap-1 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span data-testid="watch-hr-bpm">{watch.heartRateBpm} BPM</span>
                </span>
                <span className="text-sky-300 font-mono" data-testid="watch-hrv-ms">
                  HRV: {watch.hrvMs} ms
                </span>
              </div>
              <div
                data-testid="watch-sleep-summary"
                className="text-amber-300 font-mono font-semibold text-xs flex items-center gap-1"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{watch.sleepSummaryLabel}</span>
              </div>
              <div className="text-[10px] text-gray-400">
                Deep Sleep: {watch.deepSleepHours}h · Wake Bouts: {watch.wakeBoutCount}
              </div>
            </div>
          </div>

          {/* BONUS #3: Glowing Live Doctor-to-Watch Care Prescription Notification */}
          {unacknowledgedRx.length > 0 && (
            <div
              data-testid="watch-live-prescription-alert"
              className="p-3.5 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 shadow-lg space-y-2 animate-pulse"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
                <span className="flex items-center gap-1 font-bold">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>LIVE CARE RX · {unacknowledgedRx[0].doctorName}</span>
                </span>
                <span>{unacknowledgedRx[0].createdAt}</span>
              </div>
              <p className="text-xs font-semibold text-white leading-snug">
                “{unacknowledgedRx[0].message}”
              </p>
              <button
                type="button"
                data-testid="watch-acknowledge-rx-btn"
                onClick={() => {
                  onAcknowledgePrescription(unacknowledgedRx[0].id);
                  triggerWatchFeedback(
                    `Acknowledged prescription from ${unacknowledgedRx[0].doctorName}!`
                  );
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Acknowledged</span>
              </button>
            </div>
          )}

          {/* Watch Prompt 1 (Feeding) */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="text-xs font-semibold text-white">
              🍼 Did {mother.babyName} feed in the last 3h?
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="watch-feed-yes-btn"
                onClick={() => {
                  onWatchFeedResponse('fed');
                  triggerWatchFeedback(`Logged ${mother.babyName} feeding from Watch`);
                }}
                className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                ✅ Yes, Fed
              </button>
              <button
                type="button"
                data-testid="watch-feed-snooze-btn"
                onClick={() => {
                  onWatchFeedResponse('snooze');
                  triggerWatchFeedback('Snoozed feeding reminder for 30m');
                }}
                className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold transition-colors"
              >
                ⏰ Snooze 30m
              </button>
            </div>
          </div>

          {/* Watch Prompt 2 (Mood) */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="text-xs font-semibold text-white">
              💜 5-Sec Watch Mood Check-In
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                data-testid="watch-mood-calm-btn"
                onClick={() => {
                  onWatchMoodResponse('Calm');
                  triggerWatchFeedback('Watch Mood Check-In: Calm (-2 risk pts)');
                }}
                className="py-2 px-1.5 rounded-xl bg-white/10 hover:bg-emerald-600/80 text-white text-[11px] font-semibold transition-colors"
              >
                😊 Calm
              </button>
              <button
                type="button"
                data-testid="watch-mood-exhausted-btn"
                onClick={() => {
                  onWatchMoodResponse('Exhausted');
                  triggerWatchFeedback('Watch Mood Check-In: Exhausted synced');
                }}
                className="py-2 px-1.5 rounded-xl bg-white/10 hover:bg-amber-600/80 text-white text-[11px] font-semibold transition-colors"
              >
                😓 Exhausted
              </button>
              <button
                type="button"
                data-testid="watch-mood-overwhelmed-btn"
                onClick={() => {
                  onWatchMoodResponse('Overwhelmed');
                  triggerWatchFeedback('Watch Mood Check-In: Overwhelmed synced to Doctor');
                }}
                className="py-2 px-1.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white text-[11px] font-semibold transition-colors"
              >
                😢 Overwhelmed
              </button>
            </div>
          </div>

          {/* BONUS FEATURE #2: 1-TAP "SOS PARTNER REST NUDGE" ON WATCH FACE */}
          <button
            type="button"
            data-testid="watch-sos-partner-nudge-btn"
            onClick={() => {
              onTriggerSosPartnerNudge();
              setSosWhatsappPreviewOpen(true);
              setSosSentConfirmed(false);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>1-Tap Partner Rest Nudge ({mother.partnerName.split(' ')[0]})</span>
          </button>

          {watchToast && (
            <div
              role="status"
              className="p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-500/40 text-[11px] text-emerald-200 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{watchToast}</span>
            </div>
          )}
        </div>

        {/* Right Column (When in Full Tab Mode): Detailed Biometric & Prescription Log */}
        {mode === 'tab' && (
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3] space-y-3">
              <h3 className="text-sm font-semibold text-[#1F2421] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2E6F40]" />
                <span>Maternal Sleep Cycle & Autonomic Recovery Telemetry</span>
              </h3>
              <p className="text-xs text-[#5A625D] leading-relaxed">
                Your Apple Watch passively measures nocturnal wake-bout fragmentation and Heart
                Rate Variability (HRV) without recording any audio or private messages.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-[#E6DFD3]">
                  <div className="text-[11px] text-[#5A625D]">Sleep Fragmentation</div>
                  <div className="text-sm font-mono font-bold text-[#E11D48] mt-0.5">
                    {watch.sleepSummaryLabel}
                  </div>
                  <div className="text-[11px] text-[#5A625D] mt-0.5">
                    Deep sleep: {watch.deepSleepHours} hrs (Target: 2.0+ hrs)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E6DFD3]">
                  <div className="text-[11px] text-[#5A625D]">Autonomic Stress (HRV)</div>
                  <div className="text-sm font-mono font-bold text-[#1F2421] mt-0.5">
                    {watch.hrvMs} ms · {watch.heartRateBpm} BPM
                  </div>
                  <div className="text-[11px] text-[#2E6F40] mt-0.5">
                    Last Action: {watch.lastWatchAction}
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor-to-Watch Live Care Prescriptions History */}
            <div className="p-5 rounded-2xl bg-[#F4EFFA]/60 border border-[#E2D6F3] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1F2421] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5B3E85]" />
                  <span>Doctor-to-Watch Live Care Prescriptions</span>
                </h3>
                <span className="text-xs font-mono text-[#5B3E85]">
                  {prescriptions.length} Total
                </span>
              </div>

              {prescriptions.length === 0 ? (
                <p className="text-xs text-[#5A625D]">
                  No watch prescriptions sent yet by {assignedDoctor.fullName}.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="p-3.5 rounded-xl bg-white border border-[#E2D6F3] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-[#1F2421]">
                          {rx.doctorName} ·{' '}
                          <span className="font-mono text-[11px] text-[#5A625D]">
                            {rx.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-[#3A403C]">“{rx.message}”</p>
                      </div>
                      {rx.acknowledged ? (
                        <span className="px-2.5 py-1 rounded-lg bg-[#E3F2E6] text-[#2E6F40] text-[11px] font-semibold shrink-0 self-start">
                          👍 Acknowledged ({rx.acknowledgedAt || 'Synced'})
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAcknowledgePrescription(rx.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold shrink-0 self-start"
                        >
                          👍 Acknowledge
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BONUS #2 MODAL: Permission-Based SOS Partner Rest Nudge WhatsApp Preview */}
      {sosWhatsappPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="SOS Partner Rest Nudge WhatsApp Preview"
          data-testid="sos-partner-whatsapp-modal"
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white text-[#1F2421] border border-[#E6DFD3] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-[#E6DFD3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#E3F2E6] text-[#2E6F40] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1F2421]">
                    🆘 1-Tap Partner Rest Nudge (WhatsApp Dispatch)
                  </h3>
                  <p className="text-xs text-[#5A625D]">
                    Recipient: <strong>{mother.partnerName}</strong> ({mother.partnerPhone})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSosWhatsappPreviewOpen(false)}
                className="p-1 rounded-lg text-[#5A625D] hover:text-[#1F2421]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              data-testid="sos-whatsapp-message-body"
              className="p-4 rounded-2xl bg-[#E3F2E6]/60 border border-[#C5E3CC] text-xs sm:text-sm text-[#1F2421] leading-relaxed font-medium"
            >
              “{sosMessageText}”
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#5A625D]">
              <span>Zero private mood or search logs are ever shared.</span>
              <span className="font-mono text-[#2E6F40]">Consent Verified</span>
            </div>

            {sosSentConfirmed && (
              <div className="p-2.5 rounded-xl bg-[#E3F2E6] text-[#2E6F40] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  WhatsApp Rest Nudge delivered to {mother.partnerName} ({mother.partnerPhone})!
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E6DFD3]">
              <button
                type="button"
                onClick={() => setSosWhatsappPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#F7F2EB] text-xs font-semibold text-[#1F2421]"
              >
                Close
              </button>
              <button
                type="button"
                data-testid="confirm-send-sos-whatsapp-btn"
                onClick={() => {
                  setSosSentConfirmed(true);
                  setTimeout(() => setSosWhatsappPreviewOpen(false), 1200);
                }}
                className="px-5 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors"
              >
                Send WhatsApp Nudge Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

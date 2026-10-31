import React, { useState } from 'react';
import {
  Stethoscope,
  BarChart3,
  MessageCircle,
  Send,
  PhoneForwarded,
  Search,
  LogOut,
  CheckCircle2,
  Volume2,
  FileText,
  ArrowRight,
  UserPlus,
  Copy,
  Users,
  Building2,
} from 'lucide-react';
import {
  type MotherProfile,
  type DoctorProfile,
  type NewMotherRegistrationInput,
  type RiskTier,
} from '../utils/riskEngine';
import {
  type LanguageCode,
  type TranslationDictionary,
  speakText,
} from '../i18n/translations';
import { WhatsappPreviewModal } from './WhatsappPreviewModal';
import { PatientOnboardModal } from './PatientOnboardModal';

interface DoctorPortalProps {
  currentDoctor: DoctorProfile;
  mothers: MotherProfile[];
  selectedMotherId: string;
  onSelectMother: (id: string) => void;
  onOnboardPatient: (input: NewMotherRegistrationInput) => Promise<MotherProfile>;
  onTestLoginAsPatient: (motherId: string, password: string) => Promise<void>;
  onTriggerPartnerNudge: (motherId: string) => void;
  onSendEpdsToMother: (motherId: string) => void;
  onAssignCounsellorAndLogNote: (motherId: string, noteText: string) => void;
  onLogout: () => void;
  lang: LanguageCode;
  t: TranslationDictionary;
}

export type DoctorTab = 'tabA' | 'tabB' | 'tabC';
export type QueueScope = 'assigned' | 'all';

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  currentDoctor,
  mothers,
  selectedMotherId,
  onSelectMother,
  onOnboardPatient,
  onTestLoginAsPatient,
  onTriggerPartnerNudge,
  onSendEpdsToMother,
  onAssignCounsellorAndLogNote,
  onLogout,
  lang,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<DoctorTab>('tabA');
  const [queueScope, setQueueScope] = useState<QueueScope>('all');
  const [tierFilter, setTierFilter] = useState<'all' | RiskTier>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clinicalNoteInput, setClinicalNoteInput] = useState<string>('');
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [isWhatsappOpen, setIsWhatsappOpen] = useState<boolean>(false);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const selectedMother =
    mothers.find((m) => m.id === selectedMotherId) || mothers[0];

  const isAssignedToDoctor = (m: MotherProfile): boolean => {
    return (
      currentDoctor.assignedPatientIds.includes(m.id) ||
      m.linkedDoctorId === currentDoctor.id ||
      (!!m.doctorInviteCode &&
        m.doctorInviteCode.toUpperCase() === currentDoctor.clinicCode.toUpperCase())
    );
  };

  const assignedCount = mothers.filter(isAssignedToDoctor).length;

  const filteredMothers = mothers.filter((m) => {
    const matchesScope = queueScope === 'all' || isAssignedToDoctor(m);
    const matchesTier = tierFilter === 'all' || m.riskTier === tierFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.hospitalId.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q));
    return matchesScope && matchesTier && matchesSearch;
  });

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => {
      setActionToast((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleCopyClinicCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(currentDoctor.clinicCode).catch(() => {});
    }
    setCopiedCode(true);
    showToast(`Copied Doctor Clinic Code: ${currentDoctor.clinicCode}`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const getDriverTranslation = (mother: MotherProfile): string => {
    if (mother.customTopDriverText) {
      return mother.customTopDriverText;
    }
    switch (mother.id) {
      case 'ananya':
        return t.driverAnanya;
      case 'priya':
        return t.driverPriya;
      case 'sneha':
        return t.driverSneha;
      case 'divya':
        return t.driverDivya;
      case 'meera':
        return t.driverMeera;
      default:
        return t.driverFarah;
    }
  };

  const getSoapTranslation = (mother: MotherProfile): string => {
    switch (mother.id) {
      case 'ananya':
        return t.soapAnanya;
      case 'priya':
        return t.soapPriya;
      case 'sneha':
        return t.soapSneha;
      case 'divya':
        return t.soapDivya;
      case 'meera':
        return t.soapMeera;
      case 'farah':
        return t.soapFarah;
      default:
        return `SUBJECTIVE / CONTEXT:\n${mother.name} (${mother.age}y, ${mother.city}) is ${mother.postpartumWeeks} weeks postpartum caring for ${mother.babyName}. Linked to ${currentDoctor.fullName} (Clinic Code: ${currentDoctor.clinicCode}).\n\nOBJECTIVE BEHAVIOURAL SIGNALS:\nRisk Score: ${mother.riskScore}/100 (+${mother.baselineDeviationPercent}% vs personal baseline ${mother.baselineScore}/100). Night sessions (1–4 AM): ${mother.explainableSignals.nightSessionsCount}. Partner WhatsApp Co-Care: ${mother.partnerName} (${mother.partnerPhone}).\n\nASSESSMENT & CARE ROUTING:\nNon-diagnostic behavioural baseline tracking active. Recommended human-in-the-loop check-in during routine postnatal review.`;
    }
  };

  const getShapLabel = (
    key: 'nightBursts' | 'distressSearch' | 'missedEdits' | 'reducedMood' | 'caregiverShare'
  ): string => {
    switch (key) {
      case 'nightBursts':
        return t.shapFeature1;
      case 'distressSearch':
        return t.shapFeature2;
      case 'missedEdits':
        return t.shapFeature3;
      case 'reducedMood':
        return t.shapFeature4;
      case 'caregiverShare':
        return t.shapFeature5;
    }
  };

  // Build SVG path for 7-day rolling risk trajectory
  const trajectoryPoints = selectedMother.sevenDayRiskTrajectory;
  const svgWidth = 560;
  const svgHeight = 180;
  const padX = 36;
  const padY = 24;

  const getCoords = (index: number, val: number) => {
    const x =
      padX +
      (index / Math.max(1, trajectoryPoints.length - 1)) * (svgWidth - padX * 2);
    const y =
      svgHeight - padY - (Math.min(100, Math.max(0, val)) / 100) * (svgHeight - padY * 2);
    return { x, y };
  };

  const riskPolyline = trajectoryPoints
    .map((pt, i) => {
      const { x, y } = getCoords(i, pt.risk);
      return `${x},${y}`;
    })
    .join(' ');

  const baselinePolyline = trajectoryPoints
    .map((pt, i) => {
      const { x, y } = getCoords(i, pt.baseline);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Doctor Portal Top Header with Clinic Code & "+ Add / Register My Patient" */}
      <div className="bg-white border border-[#E6DFD3] rounded-2xl p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E3F2E6] border border-[#C5E3CC] flex items-center justify-center text-[#2E6F40] shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-semibold text-[#1F2421]">
                {currentDoctor.fullName}
              </h1>
              <span className="text-xs font-mono font-semibold text-[#2E6F40]">
                ({currentDoctor.systemId} · {currentDoctor.specialization} ·{' '}
                {currentDoctor.kmcRegistrationId})
              </span>
            </div>
            <p className="text-xs text-[#5A625D] mt-0.5">
              {currentDoctor.hospitalName} · {t.doctorWorkspaceTitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Copyable Doctor Clinic Invite Code */}
          <button
            type="button"
            onClick={handleCopyClinicCode}
            title="Copy Doctor Clinic Code"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FDFBF7] hover:bg-[#E3F2E6]/50 border border-[#C5E3CC] text-xs font-mono text-[#1F2421] transition-colors"
          >
            <span className="text-[#5A625D] font-sans">Clinic Code:</span>
            <strong className="text-[#2E6F40]">{currentDoctor.clinicCode}</strong>
            <Copy className="w-3.5 h-3.5 text-[#2E6F40]" />
            {copiedCode && <span className="text-[10px] text-[#2E6F40]">Copied</span>}
          </button>

          {/* Prominent "+ Add / Register My Patient" Button */}
          <button
            type="button"
            onClick={() => setIsOnboardModalOpen(true)}
            data-testid="open-onboard-patient-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors shadow-xs whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {lang === 'hi'
                ? '+ नई रोगी जोड़ें (Add Patient)'
                : lang === 'kn'
                ? '+ ಹೊಸ ರೋಗಿ ಸೇರಿಸಿ (Add Patient)'
                : '+ Add / Register My Patient'}
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F7F2EB] hover:bg-[#EDE5D8] text-xs font-semibold text-[#1F2421] transition-colors whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t.doctorSwitchViewBtn}
          </button>
        </div>
      </div>

      {/* Live Action Toast */}
      {actionToast && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-[#E3F2E6] border border-[#2E6F40]/30 text-xs font-medium text-[#1F2421] flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E6F40]" />
            <span>{actionToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="text-xs text-[#2E6F40] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3 Structured Clinical Tabs */}
      <div
        role="tablist"
        aria-label="Doctor Workspace Tabs"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-[#F7F2EB] border border-[#E6DFD3] rounded-2xl"
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
          <Stethoscope className="w-4 h-4 text-[#2E6F40] shrink-0" />
          <span className="truncate">{t.docTabA}</span>
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
          <BarChart3 className="w-4 h-4 text-[#D97706] shrink-0" />
          <span className="truncate">{t.docTabB}</span>
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
          <PhoneForwarded className="w-4 h-4 text-[#E11D48] shrink-0" />
          <span className="truncate">{t.docTabC}</span>
        </button>
      </div>

      {/* ===================================================================
          TAB A: PRIORITIZED MATERNAL FOLLOW-UP QUEUE
      =================================================================== */}
      {activeTab === 'tabA' && (
        <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3 border-b border-[#E6DFD3]">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#1F2421]">
                {t.docQueueTitle}
              </h2>
              <p className="text-xs text-[#5A625D] mt-0.5">{t.docQueueSubtitle}</p>
            </div>

            {/* Scope Toggle: [ My Assigned Patients Only ] vs [ All Hospital Network Patients ] */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Clinical Queue Scope Filter"
                className="flex items-center gap-1 p-1 bg-[#E3F2E6]/60 rounded-xl border border-[#C5E3CC]"
              >
                <button
                  type="button"
                  onClick={() => setQueueScope('assigned')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    queueScope === 'assigned'
                      ? 'bg-[#2E6F40] text-white shadow-2xs'
                      : 'text-[#3A403C] hover:text-[#1F2421]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>My Assigned Patients Only ({assignedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQueueScope('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    queueScope === 'all'
                      ? 'bg-[#2E6F40] text-white shadow-2xs'
                      : 'text-[#3A403C] hover:text-[#1F2421]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>All Hospital Network Patients ({mothers.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Risk Tier Filter + Search Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#F7F2EB] rounded-xl border border-[#E6DFD3] self-start">
              {(
                [
                  { key: 'all', label: t.filterAll },
                  { key: 'high', label: t.filterHigh },
                  { key: 'moderate', label: t.filterModerate },
                  { key: 'low', label: t.filterLow },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setTierFilter(f.key)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    tierFilter === f.key
                      ? 'bg-white text-[#1F2421] shadow-xs'
                      : 'text-[#5A625D] hover:text-[#1F2421]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-[#5A625D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label={t.searchPatientPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPatientPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
              />
            </div>
          </div>

          {/* Maternal Patients Structured Clinical Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6DFD3] text-xs font-semibold text-[#5A625D]">
                  <th className="py-2.5 pr-4">{t.thMotherProfile}</th>
                  <th className="py-2.5 px-3">{t.thConsentStatus}</th>
                  <th className="py-2.5 px-3">{t.thRiskSignal}</th>
                  <th className="py-2.5 px-3">{t.thBaselineDev}</th>
                  <th className="py-2.5 px-3">{t.thTopDrivers}</th>
                  <th className="py-2.5 px-3">{t.thFollowUpStatus}</th>
                  <th className="py-2.5 pl-3 text-right">{t.thAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3] text-sm">
                {filteredMothers.map((m) => {
                  const isSelected = m.id === selectedMother.id;
                  const assigned = isAssignedToDoctor(m);
                  return (
                    <tr
                      key={m.id}
                      onClick={() => onSelectMother(m.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#F4EFFA]/50' : 'hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <td className="py-2.5 pr-4">
                        <div className="font-semibold text-[#1F2421] text-xs sm:text-sm flex items-center gap-1.5">
                          <span>
                            {m.name} ({m.age}y, {m.city})
                          </span>
                          {assigned && (
                            <span className="text-[10px] font-mono text-[#2E6F40] underline">
                              [Assigned]
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5A625D] font-mono">
                          {m.babyName} · {m.postpartumWeeks}w postpartum · {m.hospitalId}
                          {m.email && ` · ${m.email}`}
                          {m.epdsLastScore !== null && ` · EPDS: ${m.epdsLastScore}/15`}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-xs whitespace-nowrap">
                        <span
                          className={
                            m.consent.clinicianEscalationOptIn
                              ? 'text-[#2E6F40] font-semibold'
                              : 'text-[#D97706] font-semibold'
                          }
                        >
                          {m.consent.clinicianEscalationOptIn
                            ? t.consentVerifiedBadge
                            : t.consentPausedBadge}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-xs whitespace-nowrap">
                        {m.riskTier === 'high' && (
                          <span className="text-[#E11D48] font-bold">
                            {t.riskHighLabel} — {m.riskScore}/100
                          </span>
                        )}
                        {m.riskTier === 'moderate' && (
                          <span className="text-[#D97706] font-bold">
                            {t.riskModLabel} — {m.riskScore}/100
                          </span>
                        )}
                        {m.riskTier === 'low' && (
                          <span className="text-[#2E6F40] font-bold">
                            {t.riskLowLabel} — {m.riskScore}/100
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-xs whitespace-nowrap">
                        <span
                          className={
                            m.riskTier === 'high'
                              ? 'text-[#E11D48] font-semibold'
                              : m.riskTier === 'moderate'
                              ? 'text-[#D97706] font-semibold'
                              : 'text-[#2E6F40] font-semibold'
                          }
                        >
                          +{m.baselineDeviationPercent}% vs personal baseline
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-xs text-[#3A403C] max-w-xs">
                        {getDriverTranslation(m)}
                      </td>

                      <td className="py-2.5 px-3 text-xs font-semibold whitespace-nowrap">
                        <span
                          className={
                            m.followUpStatus === 'In Care Pathway'
                              ? 'text-[#2E6F40]'
                              : m.followUpStatus === 'Pending Clinician Review'
                              ? 'text-[#E11D48]'
                              : 'text-[#5B3E85]'
                          }
                        >
                          {m.followUpStatus}
                        </span>
                      </td>

                      <td className="py-2.5 pl-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMother(m.id);
                            setActiveTab('tabB');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F7F2EB] hover:bg-[#2E6F40] hover:text-white text-xs font-semibold text-[#1F2421] transition-colors"
                        >
                          {t.inspectBtn}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB B: DEEP-DIVE PATIENT EXPLAINABILITY & SHAP ATTRIBUTION INSPECTOR
      =================================================================== */}
      {activeTab === 'tabB' && (
        <div className="space-y-6">
          {/* Patient Selector Strip */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-white border border-[#E6DFD3] rounded-2xl p-3.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-[#5A625D] mr-1">Patient:</span>
              {mothers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectMother(m.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    m.id === selectedMother.id
                      ? 'bg-[#2E6F40] text-white'
                      : 'bg-[#F7F2EB] text-[#4A524D] hover:text-[#1F2421]'
                  }`}
                >
                  {m.name} ({m.riskScore}/100)
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('tabC')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E11D48] text-white text-xs font-semibold whitespace-nowrap shrink-0 self-start xl:self-auto"
            >
              <span>Open Escalation & Routing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* XGBoost / scikit-learn SHAP Attribution Bars */}
            <div className="lg:col-span-6 bg-white border border-[#E6DFD3] rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1F2421]">
                  {t.shapTitle}
                </h2>
                <p className="text-xs text-[#5A625D] mt-1">{t.shapSubtitle}</p>
              </div>

              <div className="space-y-4">
                {selectedMother.shapFeatures.map((feat) => (
                  <div key={feat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1F2421]">
                        {getShapLabel(feat.key)}
                      </span>
                      <span className="font-mono font-bold text-[#E11D48]">
                        +{feat.weightPercent}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#F7F2EB] rounded-full overflow-hidden">
                      <div
                        style={{ width: `${feat.weightPercent * 2.5}%` }}
                        className={`h-full rounded-full ${
                          feat.weightPercent >= 25
                            ? 'bg-[#E11D48]'
                            : feat.weightPercent >= 15
                            ? 'bg-[#D97706]'
                            : 'bg-[#2E6F40]'
                        }`}
                      />
                    </div>
                    <div className="text-[11px] text-[#5A625D] font-mono">
                      Observed Shift: {feat.deltaText}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Rolling Risk Trajectory SVG Graph vs Personal Baseline */}
            <div className="lg:col-span-6 bg-white border border-[#E6DFD3] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-semibold text-[#1F2421]">
                    {t.trajectoryTitle}
                  </h2>
                  <span className="font-mono text-xs font-bold text-[#E11D48]">
                    +{selectedMother.baselineDeviationPercent}% Shift
                  </span>
                </div>
                <p className="text-xs text-[#5A625D] mt-1 mb-4">{t.trajectorySubtitle}</p>

                <div className="bg-[#FDFBF7] border border-[#E6DFD3] rounded-xl p-3">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-44 overflow-visible"
                    role="img"
                    aria-label={t.trajectoryTitle}
                  >
                    {[25, 50, 75].map((lvl) => {
                      const y =
                        svgHeight - padY - (lvl / 100) * (svgHeight - padY * 2);
                      return (
                        <g key={lvl}>
                          <line
                            x1={padX}
                            y1={y}
                            x2={svgWidth - padX}
                            y2={y}
                            stroke="#E6DFD3"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={8}
                            y={y + 4}
                            fontSize="10"
                            fill="#5A625D"
                            fontFamily="JetBrains Mono"
                          >
                            {lvl}
                          </text>
                        </g>
                      );
                    })}

                    <polyline
                      fill="none"
                      stroke="#2E6F40"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      points={baselinePolyline}
                    />

                    <polyline
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="3"
                      points={riskPolyline}
                    />

                    {trajectoryPoints.map((pt, idx) => {
                      const { x, y } = getCoords(idx, pt.risk);
                      return (
                        <g key={pt.day}>
                          <circle cx={x} cy={y} r="4.5" fill="#E11D48" />
                          <text
                            x={x}
                            y={y - 10}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="#1F2421"
                            fontFamily="JetBrains Mono"
                          >
                            {pt.risk}
                          </text>
                          <text
                            x={x}
                            y={svgHeight - 6}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#5A625D"
                          >
                            {pt.day}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#5A625D]">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-[#2E6F40] inline-block" />
                  {t.legendBaseline} ({selectedMother.baselineScore}/100)
                </span>
                <span className="flex items-center gap-2 font-semibold text-[#E11D48]">
                  <span className="w-3 h-0.5 bg-[#E11D48] inline-block" />
                  {t.legendCurrentWeek} ({selectedMother.riskScore}/100)
                </span>
              </div>
            </div>
          </div>

          {/* Gemini Clinical Summary Note (SOAP Format) */}
          <div className="bg-[#FDFBF7] border border-[#E6DFD3] rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6DFD3]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#2E6F40]" />
                <div>
                  <h3 className="text-base font-semibold text-[#1F2421]">
                    {t.soapNoteTitle} — {selectedMother.name}
                  </h3>
                  <p className="text-xs text-[#5A625D]">{t.soapNoteSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => speakText(getSoapTranslation(selectedMother), lang)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors self-start"
              >
                <Volume2 className="w-4 h-4" />
                {t.listenVoiceBtn}
              </button>
            </div>

            <pre className="whitespace-pre-wrap font-sans text-sm text-[#1F2421] leading-relaxed bg-white p-5 rounded-xl border border-[#E6DFD3]">
              {getSoapTranslation(selectedMother)}
            </pre>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB C: HUMAN-IN-THE-LOOP ESCALATION & WHATSAPP ROUTING CENTER
      =================================================================== */}
      {activeTab === 'tabC' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6DFD3]">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1F2421]">
                  {t.escalationTitle} — {selectedMother.name}
                </h2>
                <p className="text-xs text-[#5A625D] mt-0.5">{t.escalationSubtitle}</p>
              </div>
              <span className="text-xs font-mono font-semibold text-[#2E6F40]">
                Current Queue Status: {selectedMother.followUpStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Action 1: Trigger Consented Partner WhatsApp Nudge */}
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3] flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#E3F2E6] text-[#2E6F40] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1F2421]">
                    {t.action1TriggerWhatsapp}
                  </h3>
                  <p className="text-xs text-[#5A625D] leading-relaxed">{t.action1Desc}</p>
                  <div className="text-xs font-mono text-[#2E6F40]">
                    Partner: {selectedMother.partnerName} ({selectedMother.partnerPhone})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onTriggerPartnerNudge(selectedMother.id);
                    setIsWhatsappOpen(true);
                    showToast(
                      `Partner WhatsApp Nudge triggered for ${selectedMother.partnerName}`
                    );
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors"
                >
                  {t.action1TriggerWhatsapp}
                </button>
              </div>

              {/* Action 2: Send Validated EPDS Screening Link to Mother's App */}
              <div className="p-5 rounded-2xl bg-[#F4EFFA]/60 border border-[#E2D6F3] flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#5B3E85] flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1F2421]">{t.action2SendEpds}</h3>
                  <p className="text-xs text-[#5A625D] leading-relaxed">{t.action2Desc}</p>
                  <div className="text-xs font-mono text-[#5B3E85]">
                    {selectedMother.epdsRequestedByDoctor
                      ? 'Status: Dispatched to Mother Portal'
                      : 'Status: Ready to dispatch'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSendEpdsToMother(selectedMother.id);
                    showToast(
                      `Validated EPDS Screening Link sent to ${selectedMother.name}'s Companion App`
                    );
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#5B3E85] hover:bg-[#49306B] text-white text-xs font-semibold transition-colors"
                >
                  {t.action2SendEpds}
                </button>
              </div>

              {/* Action 3: Assign Perinatal Counsellor Follow-Up Call & Log Clinical Note */}
              <div className="p-5 rounded-2xl bg-[#FFF5F5]/80 border border-[#F5D0D6] flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#E11D48] flex items-center justify-center">
                    <PhoneForwarded className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1F2421]">
                    {t.action3AssignCounsellor}
                  </h3>
                  <p className="text-xs text-[#5A625D] leading-relaxed">{t.action3Desc}</p>
                  <textarea
                    rows={2}
                    value={clinicalNoteInput}
                    onChange={(e) => setClinicalNoteInput(e.target.value)}
                    placeholder={t.clinicalNoteInputPlaceholder}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const noteToSave =
                      clinicalNoteInput.trim() ||
                      `Assigned Perinatal Counsellor outreach call for ${selectedMother.name}. Status updated to In Care Pathway.`;
                    onAssignCounsellorAndLogNote(selectedMother.id, noteToSave);
                    setClinicalNoteInput('');
                    showToast(
                      `${selectedMother.name} updated to "In Care Pathway" with timestamped clinical note.`
                    );
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold transition-colors"
                >
                  {t.action3AssignCounsellor}
                </button>
              </div>
            </div>

            {/* Clinical Care Pathway Audit Log */}
            <div className="pt-4 border-t border-[#E6DFD3]">
              <h3 className="text-xs font-semibold text-[#5A625D] uppercase tracking-wider mb-3">
                {t.clinicalLogHistoryTitle} ({selectedMother.clinicalNotes.length})
              </h3>
              <div className="space-y-2.5">
                {selectedMother.clinicalNotes.length === 0 ? (
                  <p className="text-xs text-[#5A625D]">
                    No clinician handoff notes recorded yet for {selectedMother.name}.
                  </p>
                ) : (
                  selectedMother.clinicalNotes.map((cn) => (
                    <div
                      key={cn.id}
                      className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#1F2421]">{cn.author}: </span>
                        <span className="text-[#3A403C]">{cn.note}</span>
                      </div>
                      <span className="font-mono text-[#5A625D] shrink-0">{cn.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <WhatsappPreviewModal
            isOpen={isWhatsappOpen}
            onClose={() => setIsWhatsappOpen(false)}
            motherName={selectedMother.name}
            partnerName={selectedMother.partnerName}
            partnerPhone={selectedMother.partnerPhone}
            nightSessionsCount={selectedMother.explainableSignals.nightSessionsCount}
            lang={lang}
            t={t}
          />
        </div>
      )}

      {/* Patient Onboarding & Invite Link Modal */}
      <PatientOnboardModal
        isOpen={isOnboardModalOpen}
        doctor={currentDoctor}
        lang={lang}
        onOnboardPatient={async (input) => {
          const created = await onOnboardPatient(input);
          showToast(
            `Registered & linked patient ${created.name} (${created.hospitalId}) under ${currentDoctor.fullName}`
          );
          return created;
        }}
        onTestLoginAsPatient={onTestLoginAsPatient}
        onClose={() => setIsOnboardModalOpen(false)}
      />
    </div>
  );
};

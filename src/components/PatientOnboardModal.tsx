import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Copy,
  CheckCircle2,
  Baby,
  Phone,
  Mail,
  FileText,
  Share2,
  AlertCircle,
  Printer,
  LogIn,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import {
  type DoctorProfile,
  type NewMotherRegistrationInput,
  type MotherProfile,
  generateSystemUserId,
  generateTempPassword,
} from '../utils/riskEngine';
import { type LanguageCode } from '../i18n/translations';

interface PatientOnboardModalProps {
  isOpen: boolean;
  doctor: DoctorProfile;
  lang: LanguageCode;
  onOnboardPatient: (input: NewMotherRegistrationInput) => Promise<MotherProfile>;
  onTestLoginAsPatient: (motherId: string, password: string) => Promise<void>;
  onClose: () => void;
}

export const PatientOnboardModal: React.FC<PatientOnboardModalProps> = ({
  isOpen,
  doctor,
  lang,
  onOnboardPatient,
  onTestLoginAsPatient,
  onClose,
}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [autoSystemId, setAutoSystemId] = useState<string>(() =>
    generateSystemUserId('mother')
  );
  const [password, setPassword] = useState<string>(() => generateTempPassword());
  const [age, setAge] = useState<number>(29);
  const [city, setCity] = useState<string>('Bengaluru');
  const [babyName, setBabyName] = useState<string>('');
  const [postpartumWeeks, setPostpartumWeeks] = useState<number>(4);
  const [partnerName, setPartnerName] = useState<string>('');
  const [partnerPhone, setPartnerPhone] = useState<string>('');
  const [initialBaselineNote, setInitialBaselineNote] = useState<string>('');

  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);
  const [copiedCreds, setCopiedCreds] = useState<boolean>(false);
  const [printedCard, setPrintedCard] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdMother, setCreatedMother] = useState<MotherProfile | null>(null);

  if (!isOpen) return null;

  const inviteUrl = `https://nurturemind.ai/join?code=${doctor.clinicCode}`;

  const handleCopyInvite = () => {
    const shareText = `NurtureMind AI Postpartum Companion Invite from ${doctor.fullName} (${doctor.hospitalName}): Use Clinic Code ${doctor.clinicCode} at ${inviteUrl}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  const handleCopyCredentials = (mother: MotherProfile) => {
    const text = `NurtureMind AI — Patient Onboarding Credential Handout Card\nHospital: ${doctor.hospitalName}\nClinician: ${doctor.fullName} (${doctor.clinicCode})\nPatient Name: ${mother.name} (${mother.postpartumWeeks}w postpartum · ${mother.babyName})\nUnique Login ID: ${mother.hospitalId}\nRegistered Email: ${mother.email}\nTemporary Password: ${mother.password || password}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 3000);
  };

  const handleDownloadOrPrintCard = (mother: MotherProfile) => {
    const cardContent = [
      '==============================================================',
      '   NURTUREMIND AI — OFFICIAL PATIENT CREDENTIAL HANDOUT CARD  ',
      '==============================================================',
      `Hospital / Network : ${doctor.hospitalName}`,
      `Attending Doctor   : ${doctor.fullName} (${doctor.specialization})`,
      `Doctor Clinic Code : ${doctor.clinicCode}`,
      '--------------------------------------------------------------',
      `Patient Full Name  : ${mother.name}`,
      `Baby & Postpartum  : ${mother.babyName} (${mother.postpartumWeeks} Weeks Postpartum)`,
      `Partner WhatsApp   : ${mother.partnerName} (${mother.partnerPhone})`,
      '--------------------------------------------------------------',
      `ASSIGNED UNIQUE ID : ${mother.hospitalId}`,
      `REGISTERED EMAIL   : ${mother.email}`,
      `TEMPORARY PASSWORD : ${mother.password || password}`,
      '==============================================================',
      'Clinical Framing: Non-diagnostic behavioural support companion.',
    ].join('\n');

    try {
      const blob = new Blob([cardContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${mother.hospitalId}-Credential-Card.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }
    setPrintedCard(true);
    setTimeout(() => setPrintedCard(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !babyName.trim() || !partnerPhone.trim()) {
      setErrorMsg(
        'Please complete Mother Name, Email, Baby Name, and Partner WhatsApp Contact.'
      );
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const created = await onOnboardPatient({
        name: name.trim(),
        email: email.trim(),
        hospitalId: autoSystemId.trim().toUpperCase(),
        password: password.trim() || 'Nurture@2026',
        age: Number(age) || 29,
        city: city.trim() || 'Bengaluru',
        babyName: babyName.trim(),
        postpartumWeeks: Number(postpartumWeeks) || 4,
        partnerName: partnerName.trim() || 'Family Caregiver',
        partnerPhone: partnerPhone.trim(),
        initialBaselineNote: initialBaselineNote.trim(),
      });
      setCreatedMother(created);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCreatedMother(null);
    setName('');
    setEmail('');
    setAutoSystemId(generateSystemUserId('mother'));
    setPassword(generateTempPassword());
    setBabyName('');
    setPartnerName('');
    setPartnerPhone('');
    setInitialBaselineNote('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Add or Onboard New Patient"
      data-testid="patient-onboard-modal"
    >
      <div className="bg-white border border-[#E6DFD3] rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E6DFD3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E3F2E6] border border-[#C5E3CC] flex items-center justify-center text-[#2E6F40] shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-[#1F2421]">
                {createdMother
                  ? 'Patient Onboarding Credential Handout Card'
                  : lang === 'hi'
                  ? 'नई माता / रोगी को जोड़ें और ऑनबोर्ड करें'
                  : lang === 'kn'
                  ? 'ಹೊಸ ತಾಯಿ / ರೋಗಿಯನ್ನು ಸೇರಿಸಿ ಮತ್ತು ಆನ್‌ಬೋರ್ಡ್ ಮಾಡಿ'
                  : 'Onboard & Register New Maternal Patient'}
              </h3>
              <p className="text-xs text-[#5A625D]">
                Attending Clinician: <strong>{doctor.fullName}</strong> (
                {doctor.systemId}) · Clinic Code:{' '}
                <span className="font-mono font-semibold text-[#2E6F40]">
                  {doctor.clinicCode}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close Onboard Modal"
            className="p-1.5 rounded-lg text-[#5A625D] hover:text-[#1F2421] hover:bg-[#F7F2EB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {createdMother ? (
          /* OFFICIAL PRINTABLE / COPYABLE PATIENT ONBOARDING CREDENTIAL HANDOUT CARD */
          <div
            data-testid="onboard-success-card"
            className="p-6 rounded-2xl bg-[#FDFBF7] border-2 border-[#2E6F40] space-y-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6DFD3]">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#2E6F40] font-semibold">
                  Official Hospital Maternal Handout Card
                </div>
                <h4 className="font-display text-lg font-semibold text-[#1F2421]">
                  {doctor.hospitalName}
                </h4>
                <p className="text-xs text-[#5A625D]">
                  Prescribing Clinician: <strong>{doctor.fullName}</strong> (
                  {doctor.specialization}) · Clinic Code:{' '}
                  <span className="font-mono font-semibold text-[#2E6F40]">
                    {doctor.clinicCode}
                  </span>
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#E3F2E6] text-[#2E6F40] text-xs font-semibold flex items-center gap-1.5 self-start">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved to Cloud DB</span>
              </div>
            </div>

            {/* Patient & Credential Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-[#E6DFD3]">
              <div>
                <div className="text-[11px] text-[#5A625D]">
                  Patient Name & Postpartum Stage
                </div>
                <div className="text-sm font-semibold text-[#1F2421] mt-0.5">
                  {createdMother.name} ({createdMother.postpartumWeeks} Weeks Postpartum)
                </div>
                <div className="text-xs text-[#5A625D] mt-0.5">
                  Baby: {createdMother.babyName} · Partner: {createdMother.partnerName} (
                  {createdMother.partnerPhone})
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#5A625D]">Registered Email</div>
                <div className="text-sm font-mono font-semibold text-[#1F2421] mt-0.5">
                  {createdMother.email}
                </div>
                <div className="text-xs text-[#2E6F40] mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Consent-First Baseline Active</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F4EFFA] border border-[#E2D6F3]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5B3E85]">
                  Assigned Unique Login ID
                </div>
                <div
                  data-testid="generated-mother-id"
                  className="text-lg font-mono font-bold text-[#1F2421] mt-0.5"
                >
                  {createdMother.hospitalId}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#E3F2E6]/70 border border-[#C5E3CC]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#2E6F40]">
                  Assigned Temporary Password
                </div>
                <div
                  data-testid="generated-mother-password"
                  className="text-lg font-mono font-bold text-[#1F2421] mt-0.5"
                >
                  {createdMother.password || password}
                </div>
              </div>
            </div>

            {/* 3 Action Buttons Required by Spec */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleCopyCredentials(createdMother)}
                className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-[#F7F2EB] border border-[#E6DFD3] text-xs font-semibold text-[#1F2421] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#2E6F40]" />
                <span>
                  {copiedCreds ? 'Credentials Copied!' : '1-Click Copy Credentials'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadOrPrintCard(createdMother)}
                className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-[#F7F2EB] border border-[#E6DFD3] text-xs font-semibold text-[#1F2421] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#5B3E85]" />
                <span>
                  {printedCard
                    ? 'Credential Card Downloaded!'
                    : 'Print / Download Credential Card'}
                </span>
              </button>

              <button
                type="button"
                data-testid="test-login-as-patient-btn"
                onClick={async () => {
                  const idToLogin = createdMother.hospitalId;
                  const passToLogin = createdMother.password || password;
                  handleResetAndClose();
                  await onTestLoginAsPatient(idToLogin, passToLogin);
                }}
                className="py-2.5 px-3.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Test Login as This Patient Now</span>
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E6DFD3]">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors"
              >
                Return to Clinical Queue →
              </button>
            </div>
          </div>
        ) : (
          /* Direct Patient Registration Form */
          <>
            {/* Shareable Clinic Invite Link & Code Banner */}
            <div className="p-3.5 rounded-xl bg-[#F7F2EB] border border-[#E6DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1F2421]">
                  <Share2 className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Personal Patient Onboarding Invite Link & Clinic Code</span>
                </div>
                <div className="text-[11px] font-mono text-[#5A625D] truncate">
                  Code: <strong className="text-[#2E6F40]">{doctor.clinicCode}</strong> ·{' '}
                  {inviteUrl}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyInvite}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E3F2E6] border border-[#C5E3CC] text-xs font-semibold text-[#2E6F40] flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedInvite ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Invite Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy WhatsApp Invite</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="onboard-mother-name"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Mother&apos;s Full Name *
                  </label>
                  <input
                    id="onboard-mother-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Nisha Shetty"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="onboard-mother-email"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Registered Email / Phone *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#2E6F40] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="onboard-mother-email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nisha.shetty@gmail.com"
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label
                    htmlFor="onboard-baby-name"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Baby&apos;s Name *
                  </label>
                  <div className="relative">
                    <Baby className="w-3.5 h-3.5 text-[#2E6F40] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="onboard-baby-name"
                      type="text"
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      placeholder="Baby Ira"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="onboard-weeks"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Postpartum Week *
                  </label>
                  <input
                    id="onboard-weeks"
                    type="number"
                    min={1}
                    max={52}
                    value={postpartumWeeks}
                    onChange={(e) => setPostpartumWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="onboard-age"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Mother Age
                  </label>
                  <input
                    id="onboard-age"
                    type="number"
                    min={18}
                    max={50}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="onboard-city"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    City
                  </label>
                  <input
                    id="onboard-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="onboard-partner-name"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Partner / Caregiver Name
                  </label>
                  <input
                    id="onboard-partner-name"
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Kiran Shetty"
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="onboard-partner-phone"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Partner WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#2E6F40] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="onboard-partner-phone"
                      type="text"
                      value={partnerPhone}
                      onChange={(e) => setPartnerPhone(e.target.value)}
                      placeholder="+91 98450 90112"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                    />
                  </div>
                </div>
              </div>

              {/* Auto-Generated Unique Login ID & Temporary Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#E3F2E6]/45 border border-[#C5E3CC]">
                <div>
                  <label
                    htmlFor="onboard-system-id"
                    className="block text-xs font-semibold text-[#2E6F40] mb-1"
                  >
                    Auto-Assigned Unique ID (NM-MOM-XXXX)
                  </label>
                  <input
                    id="onboard-system-id"
                    type="text"
                    value={autoSystemId}
                    onChange={(e) => setAutoSystemId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5E3CC] text-xs font-mono font-bold text-[#1F2421]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="onboard-password"
                    className="block text-xs font-semibold text-[#2E6F40] mb-1 flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Assigned Temporary Password</span>
                  </label>
                  <input
                    id="onboard-password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5E3CC] text-xs font-mono font-bold text-[#1F2421]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="onboard-baseline-note"
                  className="block text-xs font-semibold text-[#1F2421] mb-1 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Initial Clinical Baseline Notes</span>
                </label>
                <textarea
                  id="onboard-baseline-note"
                  rows={2}
                  value={initialBaselineNote}
                  onChange={(e) => setInitialBaselineNote(e.target.value)}
                  placeholder="e.g., Discharged after 38w delivery; monitoring Weeks 1–4 night sleep rhythm and lactation comfort."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                />
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-[#FFF5F5] border border-[#F5D0D6] text-xs font-medium text-[#E11D48] flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E6DFD3]">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl bg-[#F7F2EB] text-xs font-semibold text-[#1F2421]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  {isSubmitting
                    ? 'Generating Credentials...'
                    : '+ Create Patient & Issue Credential Card'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

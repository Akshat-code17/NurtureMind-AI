import React, { useState } from 'react';
import {
  HeartHandshake,
  Stethoscope,
  Lock,
  UserCheck,
  AlertCircle,
  UserPlus,
  Building2,
  Baby,
  Phone,
  Mail,
  ShieldCheck,
  BadgeCheck,
  Copy,
  Printer,
  CheckCircle2,
  LogIn,
} from 'lucide-react';
import { type LanguageCode, type TranslationDictionary } from '../i18n/translations';
import {
  type MotherProfile,
  type DoctorProfile,
  type NewDoctorRegistrationInput,
  type NewMotherRegistrationInput,
  generateSystemUserId,
  generateTempPassword,
} from '../utils/riskEngine';
import { GoogleChooserModal, GoogleLogoSvg } from './GoogleChooserModal';

interface GatewayLoginProps {
  onLoginMother: (loginId: string, password: string) => Promise<void>;
  onLoginDoctor: (loginId: string, password: string) => Promise<void>;
  onRegisterDoctor: (input: NewDoctorRegistrationInput) => Promise<DoctorProfile>;
  onRegisterMother: (input: NewMotherRegistrationInput) => Promise<MotherProfile>;
  onEnterPortalAfterRegister: (role: 'mother' | 'doctor') => void;
  onGoogleAuth: (
    role: 'mother' | 'doctor',
    email: string,
    password: string,
    fullName?: string
  ) => Promise<void>;
  doctors: DoctorProfile[];
  lang: LanguageCode;
  t: TranslationDictionary;
}

type LoginStep = 'selectRole' | 'motherPortal' | 'doctorPortal';
type AuthMode = 'signin' | 'register';

export const GatewayLogin: React.FC<GatewayLoginProps> = ({
  onLoginMother,
  onLoginDoctor,
  onRegisterDoctor,
  onRegisterMother,
  onEnterPortalAfterRegister,
  onGoogleAuth,
  doctors,
  lang,
  t,
}) => {
  const [step, setStep] = useState<LoginStep>('selectRole');
  const [motherMode, setMotherMode] = useState<AuthMode>('signin');
  const [doctorMode, setDoctorMode] = useState<AuthMode>('signin');

  // Strict Confidential Sign In State (Blank by default — requires valid ID/Email & Password)
  const [motherLoginId, setMotherLoginId] = useState<string>('');
  const [motherPassword, setMotherPassword] = useState<string>('');

  const [doctorLoginId, setDoctorLoginId] = useState<string>('');
  const [doctorPassword, setDoctorPassword] = useState<string>('');

  // Mother Register Yourself form state
  const [regMotherName, setRegMotherName] = useState<string>('');
  const [regMotherEmail, setRegMotherEmail] = useState<string>('');
  const [regMotherPassword, setRegMotherPassword] = useState<string>(() =>
    generateTempPassword()
  );
  const [regBabyName, setRegBabyName] = useState<string>('');
  const [regPostpartumWeeks, setRegPostpartumWeeks] = useState<number>(4);
  const [regPartnerName, setRegPartnerName] = useState<string>('');
  const [regPartnerPhone, setRegPartnerPhone] = useState<string>('');
  const [regSelectedDoctorCode, setRegSelectedDoctorCode] = useState<string>(
    doctors[0]?.clinicCode || 'DR-KAV88'
  );
  const [regConsentBehaviour, setRegConsentBehaviour] = useState<boolean>(true);
  const [regConsentWhatsapp, setRegConsentWhatsapp] = useState<boolean>(true);
  const [regConsentClinician, setRegConsentClinician] = useState<boolean>(true);

  // Doctor Register Yourself form state
  const [regDocName, setRegDocName] = useState<string>('');
  const [regDocEmail, setRegDocEmail] = useState<string>('');
  const [regDocPassword, setRegDocPassword] = useState<string>(() =>
    generateTempPassword()
  );
  const [regDocHospital, setRegDocHospital] = useState<string>('');
  const [regDocKmcId, setRegDocKmcId] = useState<string>('');
  const [regDocDept, setRegDocDept] = useState<string>('OB-GYN');

  // Newly registered credential handout card state
  const [issuedCredentialCard, setIssuedCredentialCard] = useState<{
    role: 'mother' | 'doctor';
    name: string;
    systemId: string;
    email: string;
    password: string;
    subtitle: string;
    hospitalName: string;
    clinicCode: string;
  } | null>(null);
  const [copiedCard, setCopiedCard] = useState<boolean>(false);

  // Google Confidential SSO Modal state
  const [googleModalRole, setGoogleModalRole] = useState<'mother' | 'doctor' | null>(
    null
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const signInTabLabel =
    lang === 'hi' ? 'साइन इन (Sign In)' : lang === 'kn' ? 'ಸೈನ್ ಇನ್ (Sign In)' : 'Sign In';
  const registerTabLabel =
    lang === 'hi'
      ? 'पंजीकरण करें (Register Yourself)'
      : lang === 'kn'
      ? 'ನೋಂದಾಯಿಸಿ (Register Yourself)'
      : 'Register Yourself';
  const googleBtnLabel =
    lang === 'hi'
      ? 'Google के साथ जारी रखें'
      : lang === 'kn'
      ? 'Google ಮೂಲಕ ಮುಂದುವರಿಸಿ'
      : 'Continue with Google';

  const handleOpenMotherPortal = (mode: AuthMode = 'signin') => {
    setErrorMsg(null);
    setIssuedCredentialCard(null);
    setMotherMode(mode);
    setStep('motherPortal');
  };

  const handleOpenDoctorPortal = (mode: AuthMode = 'signin') => {
    setErrorMsg(null);
    setIssuedCredentialCard(null);
    setDoctorMode(mode);
    setStep('doctorPortal');
  };

  const handleSubmitMotherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motherLoginId.trim() || !motherPassword.trim()) {
      setErrorMsg('Please enter your Unique ID (or Registered Email) and Password.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onLoginMother(motherLoginId.trim(), motherPassword.trim());
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Invalid Unique ID / Email or Password. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorLoginId.trim() || !doctorPassword.trim()) {
      setErrorMsg(
        'Please enter your Doctor Unique ID (or Registered Email) and Password.'
      );
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onLoginDoctor(doctorLoginId.trim(), doctorPassword.trim());
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Invalid Doctor Unique ID / Email or Password. Please verify your clinical credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitMotherRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !regMotherName.trim() ||
      !regMotherEmail.trim() ||
      !regBabyName.trim() ||
      !regPartnerPhone.trim()
    ) {
      setErrorMsg(
        'Please complete Mother Full Name, Email, Baby Name, and Partner WhatsApp Number.'
      );
      return;
    }
    if (!regConsentBehaviour) {
      setErrorMsg(
        'Explicit consent for behavioural pattern analysis is required to create your NurtureMind companion account.'
      );
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const assignedId = generateSystemUserId('mother');
      const assignedPass = regMotherPassword.trim() || generateTempPassword();
      const created = await onRegisterMother({
        name: regMotherName.trim(),
        email: regMotherEmail.trim(),
        hospitalId: assignedId,
        password: assignedPass,
        babyName: regBabyName.trim(),
        postpartumWeeks: Number(regPostpartumWeeks) || 4,
        partnerName: regPartnerName.trim() || 'Family Caregiver',
        partnerPhone: regPartnerPhone.trim(),
        doctorInviteCode: regSelectedDoctorCode,
        consent: {
          behaviouralSignalAnalysis: regConsentBehaviour,
          partnerWhatsappNudges: regConsentWhatsapp,
          clinicianEscalationOptIn: regConsentClinician,
        },
      });
      const linkedDoc =
        doctors.find((d) => d.clinicCode === regSelectedDoctorCode) || doctors[0];
      setIssuedCredentialCard({
        role: 'mother',
        name: created.name,
        systemId: created.hospitalId,
        email: created.email || regMotherEmail.trim(),
        password: created.password || assignedPass,
        subtitle: `${created.babyName} · ${created.postpartumWeeks} Weeks Postpartum`,
        hospitalName: linkedDoc?.hospitalName || 'NurtureMind Maternity Network',
        clinicCode: created.doctorInviteCode || 'DR-KAV88',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDoctorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !regDocName.trim() ||
      !regDocEmail.trim() ||
      !regDocHospital.trim() ||
      !regDocKmcId.trim()
    ) {
      setErrorMsg(
        'Please fill in Full Name, Official Email, Hospital/Clinic Name, and Medical Registration ID (KMC/NMC).'
      );
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const assignedId = generateSystemUserId('doctor');
      const assignedPass = regDocPassword.trim() || generateTempPassword();
      const created = await onRegisterDoctor({
        fullName: regDocName.trim(),
        email: regDocEmail.trim(),
        systemId: assignedId,
        password: assignedPass,
        hospitalName: regDocHospital.trim(),
        kmcRegistrationId: regDocKmcId.trim(),
        specialization: regDocDept,
      });
      setIssuedCredentialCard({
        role: 'doctor',
        name: created.fullName,
        systemId: created.systemId,
        email: created.email,
        password: created.password || assignedPass,
        subtitle: `${created.specialization} · Reg: ${created.kmcRegistrationId}`,
        hospitalName: created.hospitalName,
        clinicCode: created.clinicCode,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Top Serene Header (Shown on Home Step 1) */}
      {step === 'selectRole' && (
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#2E6F40] font-semibold">
            {t.gatewayKicker}
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-semibold text-[#1F2421] leading-tight text-balance">
            {t.gatewayHeadline}
          </h1>
          <p className="text-sm sm:text-base text-[#5A625D] leading-relaxed">
            {t.gatewaySubheadline}
          </p>
        </div>
      )}

      {/* ===================================================================
          STEP 1: CENTERED ROLE SELECTION BOX (MOTHER LOGIN / DOCTOR LOGIN)
      =================================================================== */}
      {step === 'selectRole' && (
        <div className="max-w-lg mx-auto bg-white border border-[#E6DFD3] rounded-2xl p-7 sm:p-9 shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-display text-xl font-semibold text-[#1F2421]">
              {t.chooseLoginPrompt}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Mother Portal Card Trigger */}
            <div className="p-4 rounded-2xl bg-[#F4EFFA]/80 border border-[#E2D6F3] space-y-3">
              <button
                type="button"
                onClick={() => handleOpenMotherPortal('signin')}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-[#FFF5F5] border border-[#E2D6F3] text-[#1F2421] font-semibold text-base transition-all flex items-center justify-between group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#F5D0D6] flex items-center justify-center text-[#E11D48]">
                    <HeartHandshake className="w-5 h-5" />
                  </span>
                  <span>{t.motherLoginBtn}</span>
                </span>
                <span className="text-[#5B3E85] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
              <div className="flex items-center justify-between px-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenMotherPortal('register')}
                  className="font-semibold text-[#5B3E85] hover:underline flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Mother — {registerTabLabel}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoogleModalRole('mother')}
                  className="font-semibold text-[#1F2421] hover:text-[#5B3E85] flex items-center gap-1.5"
                >
                  <GoogleLogoSvg className="w-3.5 h-3.5" />
                  <span>Google SSO</span>
                </button>
              </div>
            </div>

            {/* Doctor Portal Card Trigger */}
            <div className="p-4 rounded-2xl bg-[#E3F2E6]/70 border border-[#C5E3CC] space-y-3">
              <button
                type="button"
                onClick={() => handleOpenDoctorPortal('signin')}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-[#E3F2E6]/40 border border-[#C5E3CC] text-[#1F2421] font-semibold text-base transition-all flex items-center justify-between group shadow-2xs"
              >
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#E3F2E6] border border-[#C5E3CC] flex items-center justify-center text-[#2E6F40]">
                    <Stethoscope className="w-5 h-5" />
                  </span>
                  <span>{t.doctorLoginBtn}</span>
                </span>
                <span className="text-[#2E6F40] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
              <div className="flex items-center justify-between px-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenDoctorPortal('register')}
                  className="font-semibold text-[#2E6F40] hover:underline flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Doctor — {registerTabLabel}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoogleModalRole('doctor')}
                  className="font-semibold text-[#1F2421] hover:text-[#2E6F40] flex items-center gap-1.5"
                >
                  <GoogleLogoSvg className="w-3.5 h-3.5" />
                  <span>Google SSO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          ISSUED CREDENTIAL HANDOUT CARD MODAL AFTER SELF-REGISTRATION
      =================================================================== */}
      {issuedCredentialCard && (
        <div
          data-testid="self-reg-credential-card"
          className="max-w-lg mx-auto bg-white border-2 border-[#2E6F40] rounded-2xl p-6 sm:p-8 shadow-md space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#2E6F40] font-semibold">
                Official Onboarding Credential Handout Card
              </div>
              <h3 className="font-display text-xl font-semibold text-[#1F2421]">
                {issuedCredentialCard.name}
              </h3>
              <p className="text-xs text-[#5A625D]">
                {issuedCredentialCard.hospitalName} · {issuedCredentialCard.subtitle}
              </p>
            </div>
            <CheckCircle2 className="w-7 h-7 text-[#2E6F40] shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FDFBF7] p-4 rounded-xl border border-[#E6DFD3]">
            <div>
              <div className="text-[11px] text-[#5A625D]">Assigned Unique Login ID</div>
              <div className="text-base font-mono font-bold text-[#2E6F40] mt-0.5">
                {issuedCredentialCard.systemId}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#5A625D]">Assigned Password</div>
              <div className="text-base font-mono font-bold text-[#1F2421] mt-0.5">
                {issuedCredentialCard.password}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#5A625D]">Registered Email</div>
              <div className="text-xs font-mono text-[#1F2421] mt-0.5">
                {issuedCredentialCard.email}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#5A625D]">Linked Clinic Code</div>
              <div className="text-xs font-mono font-semibold text-[#5B3E85] mt-0.5">
                {issuedCredentialCard.clinicCode}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                const text = `NurtureMind AI Credentials\nName: ${issuedCredentialCard.name}\nUnique ID: ${issuedCredentialCard.systemId}\nEmail: ${issuedCredentialCard.email}\nPassword: ${issuedCredentialCard.password}`;
                if (navigator.clipboard?.writeText) {
                  navigator.clipboard.writeText(text).catch(() => {});
                }
                setCopiedCard(true);
                setTimeout(() => setCopiedCard(false), 3000);
              }}
              className="py-2.5 px-3 rounded-xl bg-[#F7F2EB] hover:bg-[#EDE5D8] text-xs font-semibold text-[#1F2421] flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-[#2E6F40]" />
              <span>{copiedCard ? 'Copied!' : '1-Click Copy Credentials'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="py-2.5 px-3 rounded-xl bg-[#F7F2EB] hover:bg-[#EDE5D8] text-xs font-semibold text-[#1F2421] flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#5B3E85]" />
              <span>Print / Save Credential Card</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              const role = issuedCredentialCard.role;
              setIssuedCredentialCard(null);
              onEnterPortalAfterRegister(role);
            }}
            className="w-full py-3 px-5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Open My Personalized Workspace Now →</span>
          </button>
        </div>
      )}

      {/* ===================================================================
          STEP 2A: MOTHER PORTAL CARD ([ SIGN IN ] | [ REGISTER YOURSELF ])
      =================================================================== */}
      {step === 'motherPortal' && !issuedCredentialCard && (
        <div className="max-w-lg mx-auto bg-[#F4EFFA] border border-[#E2D6F3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#F5D0D6] flex items-center justify-center text-[#E11D48]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#1F2421]">
                {t.motherLoginTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setStep('selectRole');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-xs font-semibold text-[#1F2421] border border-[#E2D6F3] transition-colors"
            >
              {t.backToRoleSelectBtn}
            </button>
          </div>

          {/* [ Sign In ] | [ Register Yourself ] Tabs */}
          <div
            role="tablist"
            aria-label="Mother Authentication Mode"
            className="grid grid-cols-2 gap-1.5 p-1 bg-white/70 border border-[#E2D6F3] rounded-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={motherMode === 'signin'}
              onClick={() => {
                setErrorMsg(null);
                setMotherMode('signin');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                motherMode === 'signin'
                  ? 'bg-[#5B3E85] text-white shadow-2xs'
                  : 'text-[#4A524D] hover:text-[#1F2421]'
              }`}
            >
              {signInTabLabel}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={motherMode === 'register'}
              onClick={() => {
                setErrorMsg(null);
                setMotherMode('register');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                motherMode === 'register'
                  ? 'bg-[#5B3E85] text-white shadow-2xs'
                  : 'text-[#4A524D] hover:text-[#1F2421]'
              }`}
            >
              {registerTabLabel}
            </button>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={() => setGoogleModalRole('mother')}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#E2D6F3] text-xs sm:text-sm font-semibold text-[#1F2421] flex items-center justify-center gap-2.5 shadow-2xs transition-colors"
          >
            <GoogleLogoSvg className="w-4 h-4" />
            <span>{googleBtnLabel}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E2D6F3] w-full" />
            <span className="bg-[#F4EFFA] px-3 text-[11px] font-mono uppercase text-[#5A625D]">
              OR
            </span>
            <div className="border-t border-[#E2D6F3] w-full" />
          </div>

          {motherMode === 'signin' ? (
            /* MOTHER STRICT CONFIDENTIAL SIGN IN FORM */
            <form onSubmit={handleSubmitMotherLogin} className="space-y-4">
              <p className="text-xs text-[#4A524D] leading-relaxed">
                {t.motherLoginSubtitle}
              </p>

              <div>
                <label
                  htmlFor="mother-login-id"
                  className="block text-xs font-semibold text-[#1F2421] mb-1.5"
                >
                  Unique ID or Registered Email
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-[#5B3E85] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="mother-login-id"
                    type="text"
                    value={motherLoginId}
                    onChange={(e) => {
                      setMotherLoginId(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="e.g., NM-MOM-2001 or email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E2D6F3] text-sm font-mono text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="mother-login-password"
                  className="block text-xs font-semibold text-[#1F2421] mb-1.5"
                >
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5B3E85] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="mother-login-password"
                    type="password"
                    value={motherPassword}
                    onChange={(e) => {
                      setMotherPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E2D6F3] text-sm text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                  />
                </div>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold transition-colors shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? '...' : t.loginSubmitBtn}
              </button>
            </form>
          ) : (
            /* MOTHER "REGISTER YOURSELF" FORM */
            <form onSubmit={handleSubmitMotherRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-mother-name"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Mother&apos;s Full Name *
                  </label>
                  <input
                    id="reg-mother-name"
                    type="text"
                    value={regMotherName}
                    onChange={(e) => setRegMotherName(e.target.value)}
                    placeholder="e.g., Kavya Deshmukh"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2D6F3] text-xs text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-mother-email"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Email / Google ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#5B3E85] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-mother-email"
                      type="email"
                      value={regMotherEmail}
                      onChange={(e) => setRegMotherEmail(e.target.value)}
                      placeholder="kavya@gmail.com"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#E2D6F3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="reg-mother-password"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Password *
                  </label>
                  <input
                    id="reg-mother-password"
                    type="text"
                    value={regMotherPassword}
                    onChange={(e) => setRegMotherPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2D6F3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-baby-name"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Baby&apos;s Name *
                  </label>
                  <div className="relative">
                    <Baby className="w-3.5 h-3.5 text-[#5B3E85] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-baby-name"
                      type="text"
                      value={regBabyName}
                      onChange={(e) => setRegBabyName(e.target.value)}
                      placeholder="Baby Reyansh"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#E2D6F3] text-xs text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-postpartum-weeks"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Weeks Postpartum *
                  </label>
                  <input
                    id="reg-postpartum-weeks"
                    type="number"
                    min={1}
                    max={52}
                    value={regPostpartumWeeks}
                    onChange={(e) => setRegPostpartumWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2D6F3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-partner-name"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Partner / Trusted Contact Name
                  </label>
                  <input
                    id="reg-partner-name"
                    type="text"
                    value={regPartnerName}
                    onChange={(e) => setRegPartnerName(e.target.value)}
                    placeholder="Siddharth Deshmukh"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2D6F3] text-xs text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-partner-phone"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Partner WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#5B3E85] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-partner-phone"
                      type="text"
                      value={regPartnerPhone}
                      onChange={(e) => setRegPartnerPhone(e.target.value)}
                      placeholder="+91 98450 55112"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#E2D6F3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                    />
                  </div>
                </div>
              </div>

              {/* Doctor Invite Code Input */}
              <div>
                <label
                  htmlFor="reg-select-doctor"
                  className="block text-xs font-semibold text-[#1F2421] mb-1"
                >
                  Doctor Invite Code / Select Hospital Clinic Code
                </label>
                <select
                  id="reg-select-doctor"
                  value={regSelectedDoctorCode}
                  onChange={(e) => setRegSelectedDoctorCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2D6F3] text-xs text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.clinicCode}>
                      {d.hospitalName} ({d.specialization}) · Clinic Code: {d.clinicCode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Explicit Privacy Consent Checkboxes */}
              <div className="p-3.5 rounded-xl bg-white/90 border border-[#E2D6F3] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B3E85]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Explicit Granular Privacy Consent</span>
                </div>
                <label className="flex items-start gap-2 text-xs text-[#3A403C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regConsentBehaviour}
                    onChange={(e) => setRegConsentBehaviour(e.target.checked)}
                    className="mt-0.5 rounded text-[#5B3E85]"
                  />
                  <span>
                    I consent to non-diagnostic behavioural risk pattern tracking from my
                    baby-care logs (Required).
                  </span>
                </label>
                <label className="flex items-start gap-2 text-xs text-[#3A403C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regConsentWhatsapp}
                    onChange={(e) => setRegConsentWhatsapp(e.target.checked)}
                    className="mt-0.5 rounded text-[#5B3E85]"
                  />
                  <span>
                    I consent to supportive, non-clinical WhatsApp caregiving nudges to my
                    partner.
                  </span>
                </label>
                <label className="flex items-start gap-2 text-xs text-[#3A403C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regConsentClinician}
                    onChange={(e) => setRegConsentClinician(e.target.checked)}
                    className="mt-0.5 rounded text-[#5B3E85]"
                  />
                  <span>
                    I consent to share explainable risk summaries with my linked hospital
                    care team.
                  </span>
                </label>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold transition-colors shadow-xs"
              >
                {isSubmitting
                  ? 'Creating Account...'
                  : 'Create Mother Companion Account →'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ===================================================================
          STEP 2B: DOCTOR PORTAL CARD ([ SIGN IN ] | [ REGISTER YOURSELF ])
      =================================================================== */}
      {step === 'doctorPortal' && !issuedCredentialCard && (
        <div className="max-w-lg mx-auto bg-[#E3F2E6]/80 border border-[#C5E3CC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#C5E3CC] flex items-center justify-center text-[#2E6F40]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#1F2421]">
                {t.doctorLoginTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setStep('selectRole');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-xs font-semibold text-[#1F2421] border border-[#C5E3CC] transition-colors"
            >
              {t.backToRoleSelectBtn}
            </button>
          </div>

          {/* [ Sign In ] | [ Register Yourself ] Tabs */}
          <div
            role="tablist"
            aria-label="Doctor Authentication Mode"
            className="grid grid-cols-2 gap-1.5 p-1 bg-white/80 border border-[#C5E3CC] rounded-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={doctorMode === 'signin'}
              onClick={() => {
                setErrorMsg(null);
                setDoctorMode('signin');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                doctorMode === 'signin'
                  ? 'bg-[#2E6F40] text-white shadow-2xs'
                  : 'text-[#3A403C] hover:text-[#1F2421]'
              }`}
            >
              {signInTabLabel}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={doctorMode === 'register'}
              onClick={() => {
                setErrorMsg(null);
                setDoctorMode('register');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                doctorMode === 'register'
                  ? 'bg-[#2E6F40] text-white shadow-2xs'
                  : 'text-[#3A403C] hover:text-[#1F2421]'
              }`}
            >
              {registerTabLabel}
            </button>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={() => setGoogleModalRole('doctor')}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#C5E3CC] text-xs sm:text-sm font-semibold text-[#1F2421] flex items-center justify-center gap-2.5 shadow-2xs transition-colors"
          >
            <GoogleLogoSvg className="w-4 h-4" />
            <span>{googleBtnLabel}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#C5E3CC] w-full" />
            <span className="bg-[#E3F2E6] px-3 text-[11px] font-mono uppercase text-[#3A403C]">
              OR
            </span>
            <div className="border-t border-[#C5E3CC] w-full" />
          </div>

          {doctorMode === 'signin' ? (
            /* DOCTOR STRICT CONFIDENTIAL SIGN IN FORM */
            <form onSubmit={handleSubmitDoctorLogin} className="space-y-4">
              <p className="text-xs text-[#3A403C] leading-relaxed">
                {t.doctorLoginSubtitle}
              </p>

              <div>
                <label
                  htmlFor="doctor-login-id"
                  className="block text-xs font-semibold text-[#1F2421] mb-1.5"
                >
                  Unique ID or Registered Email
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-[#2E6F40] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="doctor-login-id"
                    type="text"
                    value={doctorLoginId}
                    onChange={(e) => {
                      setDoctorLoginId(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="e.g., NM-DOC-1001 or email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#C5E3CC] text-sm font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="doctor-login-password"
                  className="block text-xs font-semibold text-[#1F2421] mb-1.5"
                >
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#2E6F40] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="doctor-login-password"
                    type="password"
                    value={doctorPassword}
                    onChange={(e) => {
                      setDoctorPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#C5E3CC] text-sm text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-sm font-semibold transition-colors shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? '...' : t.loginSubmitBtn}
              </button>
            </form>
          ) : (
            /* DOCTOR "REGISTER YOURSELF" FORM */
            <form onSubmit={handleSubmitDoctorRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-doc-name"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Doctor Full Name *
                  </label>
                  <input
                    id="reg-doc-name"
                    type="text"
                    value={regDocName}
                    onChange={(e) => setRegDocName(e.target.value)}
                    placeholder="e.g., Dr. Rohan Deshmukh"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5E3CC] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-doc-email"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Official Email / Google ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#2E6F40] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-doc-email"
                      type="email"
                      value={regDocEmail}
                      onChange={(e) => setRegDocEmail(e.target.value)}
                      placeholder="dr.rohan@apollo.in"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#C5E3CC] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-doc-password"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Password *
                  </label>
                  <input
                    id="reg-doc-password"
                    type="text"
                    value={regDocPassword}
                    onChange={(e) => setRegDocPassword(e.target.value)}
                    placeholder="Create clinical password"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5E3CC] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-doc-kmc"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Medical Reg ID (KMC / NMC) *
                  </label>
                  <div className="relative">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#2E6F40] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-doc-kmc"
                      type="text"
                      value={regDocKmcId}
                      onChange={(e) => setRegDocKmcId(e.target.value)}
                      placeholder="KMC-OBG-9921"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#C5E3CC] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-doc-hospital"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Hospital / Clinic Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-[#2E6F40] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="reg-doc-hospital"
                      type="text"
                      value={regDocHospital}
                      onChange={(e) => setRegDocHospital(e.target.value)}
                      placeholder="Apollo Cradle Maternity, Bengaluru"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#C5E3CC] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-doc-dept"
                    className="block text-xs font-semibold text-[#1F2421] mb-1"
                  >
                    Department / Specialization *
                  </label>
                  <select
                    id="reg-doc-dept"
                    value={regDocDept}
                    onChange={(e) => setRegDocDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5E3CC] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  >
                    <option value="OB-GYN">OB-GYN (Obstetrics & Gynaecology)</option>
                    <option value="Perinatal Psychiatry">Perinatal Psychiatry</option>
                    <option value="Paediatrics">Paediatrics & Neonatology</option>
                  </select>
                </div>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-sm font-semibold transition-colors shadow-xs"
              >
                {isSubmitting
                  ? 'Provisioning Clinical Workspace...'
                  : 'Register Doctor & Generate Clinic Code →'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Confidential Google Sign-In Email + Password Modal */}
      <GoogleChooserModal
        isOpen={googleModalRole !== null}
        role={googleModalRole || 'mother'}
        lang={lang}
        onGoogleSignInOrRegister={async (email, password, fullName) => {
          if (googleModalRole) {
            await onGoogleAuth(googleModalRole, email, password, fullName);
          }
        }}
        onClose={() => setGoogleModalRole(null)}
      />
    </div>
  );
};

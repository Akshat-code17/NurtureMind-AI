import React, { useState } from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Building2,
  PhoneCall,
  ArrowLeft,
  Stethoscope,
  Send,
  AlertTriangle,
  Clock,
  Mail,
} from 'lucide-react';
import { type NavSection } from './Navbar';
import { type TranslationDictionary } from '../i18n/translations';
import {
  type SessionAuth,
  type MotherProfile,
  type DoctorProfile,
  type SupportTicketRecord,
  resolveAssignedDoctor,
  createSupportTicketRecord,
} from '../utils/riskEngine';
import { dbService } from '../services/dbService';

interface InfoModalsProps {
  activeNav: NavSection;
  onClose: () => void;
  t: TranslationDictionary;
  sessionAuth?: SessionAuth | null;
  currentMother?: MotherProfile;
  currentDoctor?: DoctorProfile;
  doctors?: DoctorProfile[];
  onRequestCoordinatorCall?: (motherId: string) => void;
}

export const InfoModals: React.FC<InfoModalsProps> = ({
  activeNav,
  onClose,
  t,
  sessionAuth,
  currentMother,
  currentDoctor,
  doctors = [],
  onRequestCoordinatorCall,
}) => {
  if (activeNav === 'gateway') return null;

  const isLoggedIn = Boolean(sessionAuth && sessionAuth.role);
  const assignedDoctor =
    sessionAuth?.role === 'mother' && currentMother
      ? resolveAssignedDoctor(currentMother, doctors)
      : sessionAuth?.role === 'doctor' && currentDoctor
      ? currentDoctor
      : doctors[0] || {
          id: 'doc-kavitha',
          systemId: 'NM-DOC-1001',
          fullName: 'Dr. Kavitha Rao',
          email: 'kavitha.rao@manipal.edu',
          kmcRegistrationId: 'KMC-OBG-8821',
          hospitalName: 'Cloudnine / Manipal Maternity Network, Bengaluru',
          specialization: 'OB-GYN & Perinatal Mental Health',
          clinicCode: 'DR-KAV88',
          assignedPatientIds: [],
          createdAt: new Date().toISOString(),
        };

  const defaultName =
    sessionAuth?.name ||
    (sessionAuth?.role === 'mother' ? currentMother?.name : '') ||
    '';
  const defaultIdOrEmail =
    sessionAuth?.systemId ||
    sessionAuth?.email ||
    (sessionAuth?.role === 'mother' ? currentMother?.hospitalId : '') ||
    '';

  const [ticketName, setTicketName] = useState<string>(defaultName);
  const [ticketIdOrEmail, setTicketIdOrEmail] = useState<string>(defaultIdOrEmail);
  const [ticketUrgency, setTicketUrgency] = useState<SupportTicketRecord['urgency']>(
    'Moderate — Callback Within 2 Hours'
  );
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [submittedReceipt, setSubmittedReceipt] = useState<SupportTicketRecord | null>(
    null
  );
  const [isSavingTicket, setIsSavingTicket] = useState<boolean>(false);

  const handleSupportTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketError(null);
    const cleanName = ticketName.trim();
    const cleanId = ticketIdOrEmail.trim();
    const cleanMsg = ticketMessage.trim();

    if (!cleanName || !cleanId || !cleanMsg) {
      setTicketError(
        'Please complete your Name, Registered ID/Email, and Support Message before submitting.'
      );
      return;
    }

    setIsSavingTicket(true);
    try {
      const record = createSupportTicketRecord({
        name: cleanName,
        registeredIdOrEmail: cleanId,
        urgency: ticketUrgency,
        message: cleanMsg,
        assignedDoctorName: assignedDoctor.fullName,
        hospitalName: assignedDoctor.hospitalName,
      });

      await dbService.saveSupportTicket(record);
      if (
        sessionAuth?.role === 'mother' &&
        currentMother &&
        onRequestCoordinatorCall
      ) {
        onRequestCoordinatorCall(currentMother.id);
      }
      setSubmittedReceipt(record);
      setTicketMessage('');
    } finally {
      setIsSavingTicket(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
          <div className="flex items-center gap-3">
            {activeNav === 'about' && (
              <HeartHandshake className="w-6 h-6 text-[#2E6F40]" />
            )}
            {activeNav === 'privacy' && (
              <ShieldCheck className="w-6 h-6 text-[#2E6F40]" />
            )}
            {activeNav === 'contact' && (
              <PhoneCall className="w-6 h-6 text-[#2E6F40]" />
            )}
            <h2 className="font-display text-2xl font-semibold text-[#1F2421]">
              {activeNav === 'about' && t.aboutModalTitle}
              {activeNav === 'privacy' && t.privacyModalTitle}
              {activeNav === 'contact' &&
                'Contact Us & 24/7 Perinatal Mental Health Helpline'}
            </h2>
          </div>
          <button
            type="button"
            data-testid="back-to-active-dashboard-btn"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-sm font-semibold text-white transition-colors whitespace-nowrap shadow-xs self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {isLoggedIn ? '← Back to My Active Dashboard' : t.backToGatewayBtn}
            </span>
          </button>
        </div>

        {activeNav === 'about' && (
          <div className="mt-6 space-y-6">
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <p className="text-base text-[#1F2421] leading-relaxed">
                {t.aboutIntroText}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
                <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                  {t.aboutStep1Title}
                </h3>
                <p className="text-sm text-[#4A524D] leading-relaxed">
                  {t.aboutStep1Desc}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#F4EFFA]/60 border border-[#E2D6F3]">
                <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                  {t.aboutStep2Title}
                </h3>
                <p className="text-sm text-[#4A524D] leading-relaxed">
                  {t.aboutStep2Desc}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#E3F2E6]/60 border border-[#C5E3CC]">
                <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                  {t.aboutStep3Title}
                </h3>
                <p className="text-sm text-[#4A524D] leading-relaxed">
                  {t.aboutStep3Desc}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F2EB] border border-[#E6DFD3] flex flex-col sm:flex-row items-start gap-4">
              <Building2 className="w-6 h-6 text-[#2E6F40] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-[#1F2421] mb-1">
                  {t.b2b2cModelTitle}
                </h3>
                <p className="text-sm text-[#4A524D] leading-relaxed">
                  {t.b2b2cModelDesc}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'privacy' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <CheckCircle2 className="w-5 h-5 text-[#2E6F40] mb-3" />
              <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                {t.privacyPillar1Title}
              </h3>
              <p className="text-sm text-[#4A524D] leading-relaxed">
                {t.privacyPillar1Desc}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <CheckCircle2 className="w-5 h-5 text-[#2E6F40] mb-3" />
              <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                {t.privacyPillar2Title}
              </h3>
              <p className="text-sm text-[#4A524D] leading-relaxed">
                {t.privacyPillar2Desc}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <CheckCircle2 className="w-5 h-5 text-[#2E6F40] mb-3" />
              <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                {t.privacyPillar3Title}
              </h3>
              <p className="text-sm text-[#4A524D] leading-relaxed">
                {t.privacyPillar3Desc}
              </p>
            </div>
          </div>
        )}

        {activeNav === 'contact' && (
          <div data-testid="contact-us-modal-view" className="mt-6 space-y-6">
            {/* Section 1: 24/7 Maternal Mental Health Crisis Support */}
            <div className="p-5 rounded-2xl bg-[#FFF5F5] border border-[#F5D0D6] space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-semibold text-[#1F2421]">
                    24/7 Maternal Mental Health Crisis Support & National Helplines
                  </h3>
                  <p className="text-xs text-[#4A524D] mt-0.5">
                    Immediate, confidential, multilingual crisis support for mothers and families across India (English, हिंदी, ಕನ್ನಡ, and 20+ regional languages).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#F5D0D6] space-y-1.5">
                  <div className="text-xs font-semibold text-[#E11D48]">
                    Tele-MANAS India (Govt. of India 24/7)
                  </div>
                  <div className="font-mono text-base font-bold text-[#1F2421]">
                    14416 / 1800-891-4416
                  </div>
                  <p className="text-xs text-[#5A625D]">
                    Toll-free National Tele Mental Health Programme with NIMHANS perinatal psychiatric specialists.
                  </p>
                  <a
                    href="tel:14416"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E6F40] hover:underline pt-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Dial 14416 Toll-Free</span>
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#F5D0D6] space-y-1.5">
                  <div className="text-xs font-semibold text-[#5B3E85]">
                    Vandrevala Foundation 24/7 Crisis Line
                  </div>
                  <div className="font-mono text-base font-bold text-[#1F2421]">
                    +91 9999 666 555
                  </div>
                  <p className="text-xs text-[#5A625D]">
                    24/7 crisis intervention and emotional distress counselling via phone call and WhatsApp.
                  </p>
                  <a
                    href="tel:+919999666555"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E6F40] hover:underline pt-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call +91 9999 666 555</span>
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#F5D0D6] space-y-1.5">
                  <div className="text-xs font-semibold text-[#D97706]">
                    Emergency Hospital Desk (24/7 Triage)
                  </div>
                  <div className="font-mono text-base font-bold text-[#1F2421]">
                    108 / +91 80 6666 9999
                  </div>
                  <p className="text-xs text-[#5A625D]">
                    Direct Obstetric & Perinatal Emergency Response Desk ({assignedDoctor.hospitalName}).
                  </p>
                  <a
                    href="tel:108"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E11D48] hover:underline pt-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Emergency Obstetric Desk</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Section 2: Direct Hospital / Clinical Care Coordinator Contact Card & Quick Support Ticket Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Dynamic Hospital & Assigned Doctor Contact Card */}
              <div
                data-testid="contact-clinical-coordinator-card"
                className="lg:col-span-5 p-6 rounded-2xl bg-[#F4EFFA]/60 border border-[#E2D6F3] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#2E6F40] text-white flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#5B3E85]">
                        {sessionAuth?.role === 'mother'
                          ? 'Your Assigned Perinatal Care Team'
                          : 'Direct Hospital Clinical Care Coordinator'}
                      </div>
                      <h3 className="font-display text-lg font-semibold text-[#1F2421]">
                        {assignedDoctor.fullName}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E2D6F3] space-y-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-[#2E6F40] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#1F2421]">
                          {assignedDoctor.hospitalName}
                        </div>
                        <div className="text-[#5A625D]">
                          Specialization: {assignedDoctor.specialization} · KMC Reg:{' '}
                          <span className="font-mono">{assignedDoctor.kmcRegistrationId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#5B3E85] shrink-0" />
                      <span className="font-mono text-[#1F2421]">
                        {assignedDoctor.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span className="text-[#4A524D]">
                        Clinic Invite Code:{' '}
                        <strong className="font-mono text-[#2E6F40]">
                          {assignedDoctor.clinicCode}
                        </strong>{' '}
                        · 24/7 Coordinator Triage Active
                      </span>
                    </div>
                  </div>

                  {sessionAuth?.role === 'mother' && currentMother && (
                    <div className="p-3.5 rounded-xl bg-[#E3F2E6]/70 border border-[#C5E3CC] text-xs text-[#1F2421]">
                      Linked Patient: <strong>{currentMother.name}</strong> (
                      <span className="font-mono">{currentMother.hospitalId}</span>) · Caring for{' '}
                      <strong>{currentMother.babyName}</strong> ({currentMother.postpartumWeeks}w postpartum)
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E2D6F3] text-xs text-[#4A524D]">
                  All callback requests and support tickets are encrypted and synced directly to your hospital care team’s Supabase queue (`lujzrkfbcwtikpyekzzq`).
                </div>
              </div>

              {/* Right 7 Cols: Quick Support Ticket / Callback Request Form */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3] space-y-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#1F2421]">
                    Quick Support Ticket & Clinician Callback Request Form
                  </h3>
                  <p className="text-xs text-[#5A625D] mt-0.5">
                    Submit a priority callback request or support ticket directly to{' '}
                    <strong>{assignedDoctor.fullName}</strong> at{' '}
                    <strong>{assignedDoctor.hospitalName}</strong>.
                  </p>
                </div>

                <form onSubmit={handleSupportTicketSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="contact-ticket-name"
                        className="block text-xs font-semibold text-[#1F2421] mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-ticket-name"
                        data-testid="contact-ticket-name"
                        type="text"
                        value={ticketName}
                        onChange={(e) => setTicketName(e.target.value)}
                        placeholder="e.g., Ananya Sharma"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-ticket-id"
                        className="block text-xs font-semibold text-[#1F2421] mb-1"
                      >
                        Registered ID / Email
                      </label>
                      <input
                        id="contact-ticket-id"
                        data-testid="contact-ticket-id"
                        type="text"
                        value={ticketIdOrEmail}
                        onChange={(e) => setTicketIdOrEmail(e.target.value)}
                        placeholder="e.g., NM-MOM-2001 or email"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-ticket-urgency"
                      className="block text-xs font-semibold text-[#1F2421] mb-1"
                    >
                      Issue / Urgency Level
                    </label>
                    <select
                      id="contact-ticket-urgency"
                      data-testid="contact-ticket-urgency"
                      value={ticketUrgency}
                      onChange={(e) =>
                        setTicketUrgency(
                          e.target.value as SupportTicketRecord['urgency']
                        )
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                    >
                      <option value="Routine Check-In">
                        Routine Check-In — Newborn Feeding / Sleep Guidance
                      </option>
                      <option value="Moderate — Callback Within 2 Hours">
                        Moderate — Request Perinatal Care Coordinator Callback (Within 2 Hours)
                      </option>
                      <option value="High — Priority Clinical Callback">
                        High — Priority OB-GYN / Perinatal Mental Health Callback
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-ticket-message"
                      className="block text-xs font-semibold text-[#1F2421] mb-1"
                    >
                      How can your clinical care team support you today?
                    </label>
                    <textarea
                      id="contact-ticket-message"
                      data-testid="contact-ticket-message"
                      rows={3}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Describe your newborn care question, sleep exhaustion, or preferred callback window..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                    />
                  </div>

                  {ticketError && (
                    <div className="p-2.5 rounded-xl bg-[#FFF5F5] border border-[#F5D0D6] text-xs text-[#E11D48] font-medium">
                      {ticketError}
                    </div>
                  )}

                  <button
                    type="submit"
                    data-testid="contact-ticket-submit-btn"
                    disabled={isSavingTicket}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSavingTicket
                        ? 'Saving to Supabase Cloud DB...'
                        : 'Submit Support Ticket & Request Callback'}
                    </span>
                  </button>
                </form>

                {/* Instant Confirmation Receipt */}
                {submittedReceipt && (
                  <div
                    data-testid="contact-ticket-receipt"
                    className="p-4 rounded-2xl bg-[#E3F2E6] border border-[#2E6F40]/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E6F40]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          Support Ticket Confirmed & Synced to Supabase
                        </span>
                      </span>
                      <span className="font-mono text-xs font-bold text-[#1F2421]">
                        Receipt: {submittedReceipt.receiptId}
                      </span>
                    </div>
                    <p className="text-xs text-[#1F2421]">
                      Routed to <strong>{submittedReceipt.assignedDoctorName}</strong> (
                      {submittedReceipt.hospitalName}) · Urgency:{' '}
                      <strong>{submittedReceipt.urgency}</strong>
                    </p>
                    <p className="text-[11px] text-[#3A403C]">
                      Applicant: {submittedReceipt.name} ({submittedReceipt.registeredIdOrEmail}) · Logged at{' '}
                      {submittedReceipt.createdAt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



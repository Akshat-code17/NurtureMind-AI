/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { translations, type LanguageCode, stopSpeaking } from './i18n/translations';
import { NurtureMindDBProvider, useNurtureMindDB } from './context/NurtureMindDB';
import { Navbar, type NavSection } from './components/Navbar';
import { InfoModals } from './components/InfoModals';
import { GatewayLogin } from './components/GatewayLogin';
import { MotherPortal } from './components/MotherPortal';
import { DoctorPortal } from './components/DoctorPortal';
import { CloudSettingsModal } from './components/CloudSettingsModal';

export type ActivePortal = 'gateway' | 'mother' | 'doctor';

function NurtureMindAppContent() {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [activeNav, setActiveNav] = useState<NavSection>('gateway');
  const [activePortal, setActivePortal] = useState<ActivePortal>('gateway');
  const [gatewayResetKey, setGatewayResetKey] = useState<number>(0);
  const [cloudModalOpen, setCloudModalOpen] = useState<boolean>(false);

  const {
    doctors,
    mothers,
    currentDoctor,
    currentMother,
    selectedMotherId,
    setSelectedMotherId,
    cloudSettings,
    updateCloudSettings,
    syncCloudNow,
    loginMother,
    loginDoctor,
    googleAuthenticate,
    registerDoctor,
    registerMother,
    onboardPatientByDoctor,
    logoutSession,
    addActivityLog,
    updateConsent,
    saveEpdsScore,
    triggerPartnerNudge,
    requestCoordinatorCall,
    sendEpdsToMother,
    assignCounsellorAndLogNote,
  } = useNurtureMindDB();

  const t = translations[lang];

  const handleLanguageChange = (nextLang: LanguageCode) => {
    stopSpeaking();
    setLang(nextLang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1F2421]">
      {/* Persistent Top Navigation Bar with Global Language Switcher + Cloud Database Sync */}
      <Navbar
        lang={lang}
        setLang={handleLanguageChange}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        t={t}
        onOpenCloudSettings={() => setCloudModalOpen(true)}
        onReturnToGateway={() => {
          stopSpeaking();
          logoutSession();
          setActivePortal('gateway');
          setGatewayResetKey((prev) => prev + 1);
        }}
      />

      {/* Persistent Subtle Clinical Safety Framing Banner */}
      <div className="bg-[#F7F2EB] border-b border-[#E6DFD3] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center text-xs text-[#3A403C]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#2E6F40] shrink-0" />
          <span>{t.clinicalSafetyBanner}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeNav !== 'gateway' ? (
          <InfoModals
            activeNav={activeNav}
            onClose={() => setActiveNav('gateway')}
            t={t}
          />
        ) : (
          <>
            {activePortal === 'gateway' && (
              <GatewayLogin
                key={gatewayResetKey}
                onLoginMother={async (loginId, password) => {
                  await loginMother(loginId, password);
                  setActivePortal('mother');
                }}
                onLoginDoctor={async (loginId, password) => {
                  await loginDoctor(loginId, password);
                  setActivePortal('doctor');
                }}
                onRegisterDoctor={async (input) => {
                  return await registerDoctor(input);
                }}
                onRegisterMother={async (input) => {
                  return await registerMother(input);
                }}
                onEnterPortalAfterRegister={(role) => {
                  setActivePortal(role === 'doctor' ? 'doctor' : 'mother');
                }}
                onGoogleAuth={async (role, email, password, fullName) => {
                  await googleAuthenticate(role, email, password, fullName);
                  setActivePortal(role === 'doctor' ? 'doctor' : 'mother');
                }}
                doctors={doctors}
                lang={lang}
                t={t}
              />
            )}

            {activePortal === 'mother' && (
              <MotherPortal
                mother={currentMother}
                allMothers={mothers}
                onSelectMother={setSelectedMotherId}
                onAddLog={addActivityLog}
                onUpdateConsent={updateConsent}
                onSaveEpdsScore={saveEpdsScore}
                onTriggerPartnerNudge={triggerPartnerNudge}
                onRequestCoordinatorCall={requestCoordinatorCall}
                onLogout={() => {
                  stopSpeaking();
                  logoutSession();
                  setActivePortal('gateway');
                }}
                lang={lang}
                t={t}
              />
            )}

            {activePortal === 'doctor' && (
              <DoctorPortal
                currentDoctor={currentDoctor}
                mothers={mothers}
                selectedMotherId={selectedMotherId}
                onSelectMother={setSelectedMotherId}
                onOnboardPatient={(input) =>
                  onboardPatientByDoctor(currentDoctor.id, input)
                }
                onTestLoginAsPatient={async (motherId, password) => {
                  await loginMother(motherId, password);
                  setActivePortal('mother');
                }}
                onTriggerPartnerNudge={triggerPartnerNudge}
                onSendEpdsToMother={sendEpdsToMother}
                onAssignCounsellorAndLogNote={assignCounsellorAndLogNote}
                onLogout={() => {
                  stopSpeaking();
                  logoutSession();
                  setActivePortal('gateway');
                }}
                lang={lang}
                t={t}
              />
            )}
          </>
        )}
      </main>

      {/* Cloud Database Settings (Supabase / Built-in Cloud Run Live Sync) Modal */}
      <CloudSettingsModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
        settings={cloudSettings}
        onSaveSettings={updateCloudSettings}
        onSyncNow={syncCloudNow}
        doctorsCount={doctors.length}
        mothersCount={mothers.length}
      />
    </div>
  );
}

export default function App() {
  return (
    <NurtureMindDBProvider>
      <NurtureMindAppContent />
    </NurtureMindDBProvider>
  );
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type MotherProfile,
  type DoctorProfile,
  type SessionAuth,
  type ConsentSettings,
  type ActivityLogEntry,
  type NewDoctorRegistrationInput,
  type NewMotherRegistrationInput,
  applyNewActivityLog,
  createNewDoctorProfile,
  createNewMotherProfile,
  verifyMotherCredentials,
  verifyDoctorCredentials,
} from '../utils/riskEngine';
import {
  dbService,
  DB_STORAGE_KEYS,
  type CloudDatabaseSettings,
} from '../services/dbService';

interface NurtureMindDBContextValue {
  doctors: DoctorProfile[];
  mothers: MotherProfile[];
  sessionAuth: SessionAuth | null;
  currentDoctor: DoctorProfile;
  currentMother: MotherProfile;
  selectedMotherId: string;
  setSelectedMotherId: (id: string) => void;
  cloudSettings: CloudDatabaseSettings;
  updateCloudSettings: (next: CloudDatabaseSettings) => Promise<void>;
  syncCloudNow: () => Promise<void>;
  loginMother: (loginIdOrEmail: string, password?: string) => Promise<MotherProfile>;
  loginDoctor: (loginIdOrEmail: string, password?: string) => Promise<DoctorProfile>;
  googleAuthenticate: (
    role: 'mother' | 'doctor',
    email: string,
    password: string,
    fullName?: string
  ) => Promise<void>;
  registerDoctor: (input: NewDoctorRegistrationInput) => Promise<DoctorProfile>;
  registerMother: (input: NewMotherRegistrationInput) => Promise<MotherProfile>;
  onboardPatientByDoctor: (
    doctorId: string,
    input: NewMotherRegistrationInput
  ) => Promise<MotherProfile>;
  logoutSession: () => void;
  addActivityLog: (motherId: string, newLog: Omit<ActivityLogEntry, 'id'>) => void;
  updateConsent: (motherId: string, consent: ConsentSettings) => void;
  saveEpdsScore: (motherId: string, score: number, routeToDoctor: boolean) => void;
  triggerPartnerNudge: (motherId: string) => void;
  requestCoordinatorCall: (motherId: string) => void;
  sendEpdsToMother: (motherId: string) => void;
  assignCounsellorAndLogNote: (motherId: string, noteText: string) => void;
}

const NurtureMindDBContext = createContext<NurtureMindDBContextValue | undefined>(undefined);

function createJwtToken(role: 'doctor' | 'mother', userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      role,
      iat: Math.floor(Date.now() / 1000),
      iss: 'nurturemind-rbac-engine',
    })
  );
  return `${header}.${payload}.nm_sig_${Date.now().toString(36)}`;
}

export const NurtureMindDBProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(() =>
    dbService.loadLocalDoctors()
  );
  const [mothers, setMothers] = useState<MotherProfile[]>(() =>
    dbService.loadLocalMothers()
  );
  const [sessionAuth, setSessionAuth] = useState<SessionAuth | null>(() =>
    dbService.loadSession()
  );
  const [selectedMotherId, setSelectedMotherId] = useState<string>(() => {
    const sess = dbService.loadSession();
    if (sess?.role === 'mother' && sess.userId) return sess.userId;
    return 'ananya';
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(() => {
    const sess = dbService.loadSession();
    if (sess?.role === 'doctor' && sess.userId) return sess.userId;
    return 'doc-kavitha';
  });

  const [cloudSettings, setCloudSettings] = useState<CloudDatabaseSettings>(() =>
    dbService.loadCloudSettings()
  );

  // Persist users_doctors & users_mothers locally on change
  useEffect(() => {
    dbService.saveLocalState(doctors, mothers);
  }, [doctors, mothers]);

  // Persist session_auth to localStorage
  useEffect(() => {
    dbService.saveSession(sessionAuth);
  }, [sessionAuth]);

  // Cross-tab synchronization via window 'storage' event
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === DB_STORAGE_KEYS.DOCTORS && e.newValue) {
        try {
          setDoctors(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === DB_STORAGE_KEYS.MOTHERS && e.newValue) {
        try {
          setMothers(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === DB_STORAGE_KEYS.SESSION) {
        try {
          setSessionAuth(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Hydrate & sync multi-device Cloud Database on mount
  useEffect(() => {
    dbService
      .fetchCloudState()
      .then((snapshot) => {
        if (snapshot) {
          setDoctors(snapshot.doctors);
          setMothers(snapshot.mothers);
        }
        setCloudSettings(dbService.loadCloudSettings());
      })
      .catch(() => {});
  }, []);

  const syncWithCloud = useCallback(
    (nextDoctors: DoctorProfile[], nextMothers: MotherProfile[]) => {
      dbService
        .pushCloudState(nextDoctors, nextMothers)
        .then((snapshot) => {
          setDoctors(snapshot.doctors);
          setMothers(snapshot.mothers);
          const updatedSettings: CloudDatabaseSettings = {
            ...dbService.loadCloudSettings(),
            lastSyncedAt: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
          dbService.saveCloudSettings(updatedSettings);
          setCloudSettings(updatedSettings);
        })
        .catch(() => {});
    },
    []
  );

  const updateCloudSettings = useCallback(
    async (next: CloudDatabaseSettings) => {
      dbService.saveCloudSettings(next);
      setCloudSettings(next);
      const snapshot = await dbService.pushCloudState(doctors, mothers);
      setDoctors(snapshot.doctors);
      setMothers(snapshot.mothers);
    },
    [doctors, mothers]
  );

  const syncCloudNow = useCallback(async () => {
    const snapshot = await dbService.pushCloudState(doctors, mothers);
    setDoctors(snapshot.doctors);
    setMothers(snapshot.mothers);
    const updatedSettings: CloudDatabaseSettings = {
      ...dbService.loadCloudSettings(),
      lastSyncedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    dbService.saveCloudSettings(updatedSettings);
    setCloudSettings(updatedSettings);
  }, [doctors, mothers]);

  // Strict Confidential Mother Login (Unique ID NM-MOM-XXXX or Registered Email + Password)
  const loginMother = useCallback(
    async (loginIdOrEmail: string, password?: string): Promise<MotherProfile> => {
      const matched = verifyMotherCredentials(
        mothers,
        loginIdOrEmail,
        password || ''
      );
      if (!matched) {
        throw new Error(
          'Invalid Unique ID / Email or Password. Please verify your assigned NM-MOM-XXXX credentials.'
        );
      }

      const session: SessionAuth = {
        token: createJwtToken('mother', matched.id),
        role: 'mother',
        userId: matched.id,
        email: matched.email || `${matched.id}@nurturemind.in`,
        name: matched.name,
        authenticatedAt: new Date().toISOString(),
      };
      setSelectedMotherId(matched.id);
      setSessionAuth(session);
      return matched;
    },
    [mothers]
  );

  // Strict Confidential Doctor Login (Unique ID NM-DOC-XXXX, KMC ID, or Email + Password)
  const loginDoctor = useCallback(
    async (loginIdOrEmail: string, password?: string): Promise<DoctorProfile> => {
      const matched = verifyDoctorCredentials(
        doctors,
        loginIdOrEmail,
        password || ''
      );
      if (!matched) {
        throw new Error(
          'Invalid Clinician Unique ID / Email or Password. Please verify your assigned NM-DOC-XXXX credentials.'
        );
      }

      const session: SessionAuth = {
        token: createJwtToken('doctor', matched.id),
        role: 'doctor',
        userId: matched.id,
        email: matched.email,
        name: matched.fullName,
        authenticatedAt: new Date().toISOString(),
      };
      setSelectedDoctorId(matched.id);
      if (matched.assignedPatientIds.length > 0) {
        const firstAssigned = mothers.find((m) =>
          matched.assignedPatientIds.includes(m.id)
        );
        if (firstAssigned) {
          setSelectedMotherId(firstAssigned.id);
        }
      }
      setSessionAuth(session);
      return matched;
    },
    [doctors, mothers]
  );

  // Register a new Doctor (returns DoctorProfile with assigned NM-DOC-XXXX systemId)
  const registerDoctor = useCallback(
    async (input: NewDoctorRegistrationInput): Promise<DoctorProfile> => {
      const newDoc = createNewDoctorProfile(input);
      const nextDoctors = [newDoc, ...doctors];
      setDoctors(nextDoctors);
      syncWithCloud(nextDoctors, mothers);

      const session: SessionAuth = {
        token: createJwtToken('doctor', newDoc.id),
        role: 'doctor',
        userId: newDoc.id,
        email: newDoc.email,
        name: newDoc.fullName,
        authenticatedAt: new Date().toISOString(),
      };
      setSelectedDoctorId(newDoc.id);
      setSessionAuth(session);
      return newDoc;
    },
    [doctors, mothers, syncWithCloud]
  );

  // Register a new Mother / Patient (returns MotherProfile with assigned NM-MOM-XXXX hospitalId)
  const registerMother = useCallback(
    async (input: NewMotherRegistrationInput): Promise<MotherProfile> => {
      const codeOrId = (input.doctorInviteCode || input.linkedDoctorId || '')
        .trim()
        .toLowerCase();
      const linkedDoc =
        doctors.find(
          (d) =>
            d.id.toLowerCase() === codeOrId ||
            d.systemId.toLowerCase() === codeOrId ||
            d.clinicCode.toLowerCase() === codeOrId
        ) || doctors[0];

      const newMother = createNewMotherProfile(input, linkedDoc);
      const nextMothers = [newMother, ...mothers];
      const nextDoctors = doctors.map((d) =>
        d.id === linkedDoc.id && !d.assignedPatientIds.includes(newMother.id)
          ? { ...d, assignedPatientIds: [newMother.id, ...d.assignedPatientIds] }
          : d
      );

      setMothers(nextMothers);
      setDoctors(nextDoctors);
      syncWithCloud(nextDoctors, nextMothers);

      const session: SessionAuth = {
        token: createJwtToken('mother', newMother.id),
        role: 'mother',
        userId: newMother.id,
        email: newMother.email || input.email,
        name: newMother.name,
        authenticatedAt: new Date().toISOString(),
      };
      setSelectedMotherId(newMother.id);
      setSessionAuth(session);
      return newMother;
    },
    [doctors, mothers, syncWithCloud]
  );

  // Onboard a new Patient directly from the Doctor Portal (auto-generates NM-MOM-XXXX & temp password)
  const onboardPatientByDoctor = useCallback(
    async (
      doctorId: string,
      input: NewMotherRegistrationInput
    ): Promise<MotherProfile> => {
      const activeDoc = doctors.find((d) => d.id === doctorId) || doctors[0];
      const newMother = createNewMotherProfile(
        {
          ...input,
          linkedDoctorId: activeDoc.id,
          doctorInviteCode: activeDoc.clinicCode,
          onboardedByDoctorName: activeDoc.fullName,
        },
        activeDoc
      );

      const nextMothers = [newMother, ...mothers];
      const nextDoctors = doctors.map((d) =>
        d.id === activeDoc.id && !d.assignedPatientIds.includes(newMother.id)
          ? { ...d, assignedPatientIds: [newMother.id, ...d.assignedPatientIds] }
          : d
      );

      setMothers(nextMothers);
      setDoctors(nextDoctors);
      setSelectedMotherId(newMother.id);
      syncWithCloud(nextDoctors, nextMothers);
      return newMother;
    },
    [doctors, mothers, syncWithCloud]
  );

  // Confidential Google Sign-In & Account Provisioning (email + password, zero public list)
  const googleAuthenticate = useCallback(
    async (
      role: 'mother' | 'doctor',
      email: string,
      password: string,
      fullName?: string
    ) => {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !password.trim()) {
        throw new Error('Please enter both your Google email and password.');
      }

      if (role === 'mother') {
        const existing = mothers.find(
          (m) =>
            (m.email && m.email.toLowerCase() === cleanEmail) ||
            m.hospitalId.toLowerCase() === cleanEmail
        );
        if (existing) {
          await loginMother(cleanEmail, password);
          return;
        }
        const derivedName =
          fullName?.trim() ||
          cleanEmail
            .split('@')[0]
            .replace(/[._-]+/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
        await registerMother({
          name: derivedName || 'Postpartum Mother',
          email: cleanEmail,
          password: password.trim(),
          babyName: 'Baby',
          postpartumWeeks: 5,
          partnerName: 'Family Caregiver',
          partnerPhone: '+91 98450 11223',
        });
        return;
      }

      const existingDoc = doctors.find(
        (d) =>
          d.email.toLowerCase() === cleanEmail ||
          d.systemId.toLowerCase() === cleanEmail
      );
      if (existingDoc) {
        await loginDoctor(cleanEmail, password);
        return;
      }
      const derivedDocName =
        fullName?.trim() ||
        `Dr. ${cleanEmail
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())}`;
      await registerDoctor({
        fullName: derivedDocName,
        email: cleanEmail,
        password: password.trim(),
        hospitalName: 'Cloudnine / Manipal Maternity Network, Bengaluru',
        kmcRegistrationId: `KMC-${Math.floor(1000 + Math.random() * 8999)}`,
        specialization: 'OB-GYN',
      });
    },
    [doctors, mothers, loginDoctor, loginMother, registerDoctor, registerMother]
  );

  const logoutSession = useCallback(() => {
    setSessionAuth(null);
  }, []);

  const addActivityLog = useCallback(
    (motherId: string, newLog: Omit<ActivityLogEntry, 'id'>) => {
      setMothers((prev) => {
        const next = prev.map((m) =>
          m.id === motherId ? applyNewActivityLog(m, newLog) : m
        );
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, syncWithCloud]
  );

  const updateConsent = useCallback(
    (motherId: string, consent: ConsentSettings) => {
      setMothers((prev) => {
        const next = prev.map((m) => (m.id === motherId ? { ...m, consent } : m));
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, syncWithCloud]
  );

  const saveEpdsScore = useCallback(
    (motherId: string, score: number, routeToDoctor: boolean) => {
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          const nextStatus = routeToDoctor
            ? ('Pending Clinician Review' as const)
            : m.followUpStatus;
          const nextNotes = routeToDoctor
            ? [
                {
                  id: `cn-${Date.now()}`,
                  timestamp: 'Just now',
                  author: `${m.name} (Self-Screening)`,
                  note: `Completed validated 5-item EPDS check-in (Score: ${score}/15) and consented to clinical care routing.`,
                },
                ...m.clinicalNotes,
              ]
            : m.clinicalNotes;
          return {
            ...m,
            epdsLastScore: score,
            epdsRequestedByDoctor: false,
            followUpStatus: nextStatus,
            clinicalNotes: nextNotes,
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, syncWithCloud]
  );

  const triggerPartnerNudge = useCallback(
    (motherId: string) => {
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          return {
            ...m,
            followUpStatus:
              m.followUpStatus === 'In Care Pathway'
                ? ('In Care Pathway' as const)
                : ('Partner Nudged' as const),
            clinicalNotes: [
              {
                id: `cn-${Date.now()}`,
                timestamp: 'Just now',
                author: 'Consented WhatsApp Router',
                note: `Sent supportive non-clinical caregiving nudge to partner ${m.partnerName} (${m.partnerPhone}).`,
              },
              ...m.clinicalNotes,
            ],
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, syncWithCloud]
  );

  const requestCoordinatorCall = useCallback(
    (motherId: string) => {
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          return {
            ...m,
            followUpStatus: 'In Care Pathway' as const,
            clinicalNotes: [
              {
                id: `cn-${Date.now()}`,
                timestamp: 'Just now',
                author: `${m.name} (Mother Portal)`,
                note: 'Requested a warm outreach call from Perinatal Care Coordinator.',
              },
              ...m.clinicalNotes,
            ],
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, syncWithCloud]
  );

  const sendEpdsToMother = useCallback(
    (motherId: string) => {
      const activeDoc =
        doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          return {
            ...m,
            epdsRequestedByDoctor: true,
            followUpStatus:
              m.followUpStatus === 'In Care Pathway'
                ? ('In Care Pathway' as const)
                : ('EPDS Scheduled' as const),
            clinicalNotes: [
              {
                id: `cn-${Date.now()}`,
                timestamp: 'Just now',
                author: activeDoc.fullName,
                note: 'Dispatched validated EPDS self-screening invitation to Mother Companion App.',
              },
              ...m.clinicalNotes,
            ],
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, selectedDoctorId, syncWithCloud]
  );

  const assignCounsellorAndLogNote = useCallback(
    (motherId: string, noteText: string) => {
      const activeDoc =
        doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          return {
            ...m,
            followUpStatus: 'In Care Pathway' as const,
            clinicalNotes: [
              {
                id: `cn-${Date.now()}`,
                timestamp: 'Just now',
                author: `${activeDoc.fullName} (${activeDoc.specialization})`,
                note: noteText,
              },
              ...m.clinicalNotes,
            ],
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, selectedDoctorId, syncWithCloud]
  );

  const currentDoctor =
    doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const currentMother =
    mothers.find((m) => m.id === selectedMotherId) || mothers[0];

  return (
    <NurtureMindDBContext.Provider
      value={{
        doctors,
        mothers,
        sessionAuth,
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
      }}
    >
      {children}
    </NurtureMindDBContext.Provider>
  );
};

export function useNurtureMindDB(): NurtureMindDBContextValue {
  const ctx = useContext(NurtureMindDBContext);
  if (!ctx) {
    throw new Error('useNurtureMindDB must be used within a NurtureMindDBProvider');
  }
  return ctx;
}

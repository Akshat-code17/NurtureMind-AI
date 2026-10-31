import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type MotherProfile,
  type DoctorProfile,
  type SessionAuth,
  type ConsentSettings,
  type ActivityLogEntry,
  type CommunityPost,
  type PeerDirectMessage,
  type WatchPrescription,
  type NewDoctorRegistrationInput,
  type NewMotherRegistrationInput,
  applyNewActivityLog,
  createNewDoctorProfile,
  createNewMotherProfile,
  verifyMotherCredentials,
  verifyDoctorCredentials,
  resolveAssignedDoctor,
  formatAbhaId,
  formatAbhaAddress,
  parseWhatsAppVoiceOrTextCommand,
} from '../utils/riskEngine';
import { type ParsedVoiceCareLog } from '../utils/telemetryParser';
import {
  dbService,
  DB_STORAGE_KEYS,
  type CloudDatabaseSettings,
} from '../services/dbService';

interface NurtureMindDBContextValue {
  doctors: DoctorProfile[];
  mothers: MotherProfile[];
  communityPosts: CommunityPost[];
  peerMessages: PeerDirectMessage[];
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
  saveVoiceCareLog: (motherId: string, parsed: ParsedVoiceCareLog) => void;
  recordWatchFeedAction: (motherId: string, response: 'fed' | 'snooze') => void;
  recordWatchMoodAction: (
    motherId: string,
    mood: 'Calm' | 'Exhausted' | 'Overwhelmed'
  ) => void;
  triggerWatchSosPartnerNudge: (motherId: string) => void;
  pushDoctorWatchPrescription: (
    motherId: string,
    doctor: DoctorProfile,
    message: string
  ) => void;
  acknowledgeWatchPrescription: (motherId: string, prescriptionId: string) => void;
  createCommunityPost: (
    channel: CommunityPost['channel'],
    content: string,
    isAnonymous: boolean
  ) => void;
  likeCommunityPost: (postId: string) => void;
  sendPeerDirectMessage: (toPeerName: string, text: string) => void;
  notifyAssignedDoctorFromGuardian: (
    motherId: string,
    assignedDoctor: DoctorProfile,
    postText: string
  ) => void;
  updateConsent: (motherId: string, consent: ConsentSettings) => void;
  saveEpdsScore: (motherId: string, score: number, routeToDoctor: boolean) => void;
  triggerPartnerNudge: (motherId: string) => void;
  requestCoordinatorCall: (motherId: string) => void;
  sendEpdsToMother: (motherId: string) => void;
  assignCounsellorAndLogNote: (motherId: string, noteText: string) => void;
  verifyMotherAbhaId: (motherId: string, abhaIdInput: string) => void;
  pushFhirRiskSummaryToHospitalEhr: (
    motherId: string,
    doctor: DoctorProfile
  ) => string;
  processWhatsAppBotVoiceOrText: (
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
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() =>
    dbService.loadLocalCommunityPosts()
  );
  const [peerMessages, setPeerMessages] = useState<PeerDirectMessage[]>(() =>
    dbService.loadLocalPeerMessages()
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

  // Persist locally on change
  useEffect(() => {
    dbService.saveLocalState(doctors, mothers, communityPosts, peerMessages);
  }, [doctors, mothers, communityPosts, peerMessages]);

  useEffect(() => {
    dbService.saveSession(sessionAuth);
  }, [sessionAuth]);

  // Cross-tab synchronization
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
      if (e.key === DB_STORAGE_KEYS.COMMUNITY_POSTS && e.newValue) {
        try {
          setCommunityPosts(JSON.parse(e.newValue));
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
          if (Array.isArray(snapshot.communityPosts)) {
            setCommunityPosts(snapshot.communityPosts);
          }
          if (Array.isArray(snapshot.peerMessages)) {
            setPeerMessages(snapshot.peerMessages);
          }
        }
        setCloudSettings(dbService.loadCloudSettings());
      })
      .catch(() => {});
  }, []);

  const syncWithCloud = useCallback(
    (
      nextDoctors: DoctorProfile[],
      nextMothers: MotherProfile[],
      nextPosts?: CommunityPost[],
      nextMessages?: PeerDirectMessage[]
    ) => {
      dbService
        .pushCloudState(nextDoctors, nextMothers, nextPosts, nextMessages)
        .then((snapshot) => {
          setDoctors(snapshot.doctors);
          setMothers(snapshot.mothers);
          if (snapshot.communityPosts) setCommunityPosts(snapshot.communityPosts);
          if (snapshot.peerMessages) setPeerMessages(snapshot.peerMessages);
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
      const snapshot = await dbService.pushCloudState(
        doctors,
        mothers,
        communityPosts,
        peerMessages
      );
      setDoctors(snapshot.doctors);
      setMothers(snapshot.mothers);
    },
    [doctors, mothers, communityPosts, peerMessages]
  );

  const syncCloudNow = useCallback(async () => {
    const snapshot = await dbService.pushCloudState(
      doctors,
      mothers,
      communityPosts,
      peerMessages
    );
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
  }, [doctors, mothers, communityPosts, peerMessages]);

  // Strict Confidential Mother Login
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
        isLoggedIn: true,
        token: createJwtToken('mother', matched.id),
        role: 'mother',
        userId: matched.id,
        systemId: matched.hospitalId,
        email: matched.email || `${matched.id}@nurturemind.in`,
        name: matched.name,
        authenticatedAt: new Date().toISOString(),
        user: matched,
      };
      setSelectedMotherId(matched.id);
      setSessionAuth(session);
      return matched;
    },
    [mothers]
  );

  // Strict Confidential Doctor Login
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
        isLoggedIn: true,
        token: createJwtToken('doctor', matched.id),
        role: 'doctor',
        userId: matched.id,
        systemId: matched.systemId,
        email: matched.email,
        name: matched.fullName,
        authenticatedAt: new Date().toISOString(),
        user: matched,
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

  // Register a new Doctor
  const registerDoctor = useCallback(
    async (input: NewDoctorRegistrationInput): Promise<DoctorProfile> => {
      const newDoc = createNewDoctorProfile(input);
      const nextDoctors = [newDoc, ...doctors];
      setDoctors(nextDoctors);
      syncWithCloud(nextDoctors, mothers);

      const session: SessionAuth = {
        isLoggedIn: true,
        token: createJwtToken('doctor', newDoc.id),
        role: 'doctor',
        userId: newDoc.id,
        systemId: newDoc.systemId,
        email: newDoc.email,
        name: newDoc.fullName,
        authenticatedAt: new Date().toISOString(),
        user: newDoc,
      };
      setSelectedDoctorId(newDoc.id);
      setSessionAuth(session);
      return newDoc;
    },
    [doctors, mothers, syncWithCloud]
  );

  // Register a new Mother / Patient
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
        isLoggedIn: true,
        token: createJwtToken('mother', newMother.id),
        role: 'mother',
        userId: newMother.id,
        systemId: newMother.hospitalId,
        email: newMother.email || input.email,
        name: newMother.name,
        authenticatedAt: new Date().toISOString(),
        user: newMother,
      };
      setSelectedMotherId(newMother.id);
      setSessionAuth(session);
      return newMother;
    },
    [doctors, mothers, syncWithCloud]
  );

  // Onboard a new Patient directly from the Doctor Portal
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

  // Confidential Google Sign-In
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

  // Feature 4: Save Hands-Free Voice Care Log + Acoustic Fatigue Telemetry
  const saveVoiceCareLog = useCallback(
    (motherId: string, parsed: ParsedVoiceCareLog) => {
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          const withLog = applyNewActivityLog(m, {
            timestamp: parsed.timestamp,
            category: 'Voice Logger',
            detail: `Voice (${parsed.language}): ${parsed.feedingType} (${parsed.feedingDurationMins}m) · ${parsed.nightWakeUps} wake-ups · Mood: ${parsed.moodLabel}`,
            isNightBurst: parsed.isNightBurst,
            isDistressSignal: parsed.isDistressSignal,
            baselineComparison: parsed.acoustic.cadenceSummary,
          });

          // Feed Acoustic Telemetry directly into Explainable Risk Attribution Bars (SHAP)
          const hasAcousticShap = withLog.shapFeatures.some(
            (s) => s.key === 'acousticFatigue'
          );
          const updatedShap = hasAcousticShap
            ? withLog.shapFeatures.map((s) =>
                s.key === 'acousticFatigue'
                  ? {
                      ...s,
                      weightPercent: Math.max(12, Math.round(parsed.acoustic.vocalFatiguePercent / 3)),
                      deltaText: parsed.acoustic.cadenceSummary,
                    }
                  : s
              )
            : [
                ...withLog.shapFeatures,
                {
                  id: `shap-ac-${Date.now()}`,
                  key: 'acousticFatigue' as const,
                  weightPercent: Math.max(14, Math.round(parsed.acoustic.vocalFatiguePercent / 3)),
                  deltaText: parsed.acoustic.cadenceSummary,
                },
              ];

          return {
            ...withLog,
            acousticTelemetry: parsed.acoustic,
            shapFeatures: updatedShap,
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, syncWithCloud]
  );

  // Feature 5: Apple Watch Feeding Prompt Action
  const recordWatchFeedAction = useCallback(
    (motherId: string, response: 'fed' | 'snooze') => {
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          const actionText =
            response === 'fed'
              ? `Apple Watch: Confirmed ${m.babyName} fed in last 3h`
              : `Apple Watch: Snoozed feeding reminder for 30m`;
          const withLog = applyNewActivityLog(m, {
            timestamp: '03:20 AM',
            category: 'Apple Watch',
            detail: actionText,
            isNightBurst: response === 'snooze',
            isDistressSignal: false,
            baselineComparison: 'Wearable micro-interaction synced',
          });
          return {
            ...withLog,
            watchTelemetry: {
              ...(withLog.watchTelemetry || {
                heartRateBpm: 84,
                hrvMs: 34,
                totalSleepHours: 3.1,
                deepSleepHours: 0.7,
                wakeBoutCount: 6,
                sleepSummaryLabel: '3.1 hrs sleep / 6 wake-ups',
                moveRingPct: 84,
                restRingPct: 42,
                hydrationRingPct: 68,
              }),
              lastWatchAction: actionText,
              lastSyncedAt: 'Just now',
            },
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, syncWithCloud]
  );

  // Feature 5: Apple Watch 5-Sec Mood Prompt Action
  const recordWatchMoodAction = useCallback(
    (motherId: string, mood: 'Calm' | 'Exhausted' | 'Overwhelmed') => {
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          const isDistress = mood === 'Overwhelmed' || mood === 'Exhausted';
          const assignedDoc = resolveAssignedDoctor(m, doctors);
          const withLog = applyNewActivityLog(m, {
            timestamp: '03:22 AM',
            category: 'Apple Watch',
            detail: `5-Sec Watch Mood Check-In: ${mood}`,
            isNightBurst: isDistress,
            isDistressSignal: mood === 'Overwhelmed',
            baselineComparison:
              mood === 'Overwhelmed'
                ? `Routed to ${assignedDoc.fullName} queue`
                : 'Synced via Apple Watch companion',
          });

          const prevWatch = withLog.watchTelemetry || {
            heartRateBpm: 86,
            hrvMs: 31,
            totalSleepHours: 3.1,
            deepSleepHours: 0.7,
            wakeBoutCount: 6,
            sleepSummaryLabel: '3.1 hrs sleep / 6 wake-ups',
            moveRingPct: 84,
            restRingPct: 38,
            hydrationRingPct: 62,
          };

          return {
            ...withLog,
            followUpStatus:
              mood === 'Overwhelmed'
                ? ('Pending Clinician Review' as const)
                : withLog.followUpStatus,
            watchTelemetry: {
              ...prevWatch,
              heartRateBpm: mood === 'Overwhelmed' ? 92 : mood === 'Exhausted' ? 85 : 74,
              hrvMs: mood === 'Overwhelmed' ? 26 : mood === 'Exhausted' ? 34 : 52,
              lastWatchAction: `Watch Mood Check-In: ${mood}`,
              lastSyncedAt: 'Just now',
            },
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });
    },
    [doctors, syncWithCloud]
  );

  // Bonus #2: 1-Tap SOS Partner Rest Nudge on Watch Face
  const triggerWatchSosPartnerNudge = useCallback(
    (motherId: string) => {
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          const assignedDoc = resolveAssignedDoctor(m, doctors);
          return {
            ...m,
            followUpStatus: 'Partner Nudged' as const,
            watchTelemetry: {
              ...(m.watchTelemetry || {
                heartRateBpm: 88,
                hrvMs: 29,
                totalSleepHours: 3.1,
                deepSleepHours: 0.7,
                wakeBoutCount: 6,
                sleepSummaryLabel: '3.1 hrs sleep / 6 wake-ups',
                moveRingPct: 84,
                restRingPct: 38,
                hydrationRingPct: 62,
              }),
              lastWatchAction: `🆘 1-Tap SOS Partner Rest Nudge sent to ${m.partnerName}`,
              lastSyncedAt: 'Just now',
            },
            clinicalNotes: [
              {
                id: `cn-sos-${Date.now()}`,
                timestamp: 'Just now',
                author: `Apple Watch SOS Router (${assignedDoc.fullName})`,
                note: `Mother tapped 1-Tap SOS Partner Rest Nudge on Apple Watch (${
                  m.watchTelemetry?.sleepSummaryLabel || '3.1 hrs sleep / 6 wake-ups'
                }). Permission-based 2-hour sleep block request dispatched to ${m.partnerName} (${
                  m.partnerPhone
                }).`,
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

  // Bonus #3: Doctor-to-Watch Live Care Prescription Push
  const pushDoctorWatchPrescription = useCallback(
    (motherId: string, doctor: DoctorProfile, message: string) => {
      const cleanMsg = message.trim();
      if (!cleanMsg) return;
      const newRx: WatchPrescription = {
        id: `rx-${Date.now()}`,
        doctorId: doctor.id,
        doctorName: doctor.fullName,
        hospitalName: doctor.hospitalName,
        message: cleanMsg,
        createdAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        acknowledged: false,
      };

      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          return {
            ...m,
            followUpStatus: 'In Care Pathway' as const,
            watchPrescriptions: [newRx, ...(m.watchPrescriptions || [])],
            clinicalNotes: [
              {
                id: `cn-rx-${Date.now()}`,
                timestamp: 'Just now',
                author: `${doctor.fullName} (Watch Rx)`,
                note: `Pushed live Care Prescription to ${m.name}'s Apple Watch: "${cleanMsg}"`,
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

  // Bonus #3: Mother Acknowledges Doctor Watch Prescription
  const acknowledgeWatchPrescription = useCallback(
    (motherId: string, prescriptionId: string) => {
      const ackTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          const targetRx = (m.watchPrescriptions || []).find(
            (rx) => rx.id === prescriptionId
          );
          const updatedRx = (m.watchPrescriptions || []).map((rx) =>
            rx.id === prescriptionId
              ? { ...rx, acknowledged: true, acknowledgedAt: ackTime }
              : rx
          );
          return {
            ...m,
            watchPrescriptions: updatedRx,
            clinicalNotes: [
              {
                id: `cn-ack-${Date.now()}`,
                timestamp: 'Just now',
                author: `${m.name} (Apple Watch 👍)`,
                note: `Acknowledged Watch Care Prescription from ${
                  targetRx?.doctorName || 'Assigned Doctor'
                }: "${targetRx?.message || 'Care note'}"`,
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

  // Feature 3: MomCircle Community Posts & Dynamic AI Safety Guardian
  const currentMother =
    mothers.find((m) => m.id === selectedMotherId) || mothers[0];

  const createCommunityPost = useCallback(
    (
      channel: CommunityPost['channel'],
      content: string,
      isAnonymous: boolean
    ) => {
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        channel,
        authorId: currentMother.id,
        authorDisplayName: isAnonymous
          ? 'Verified Mom • Gentle Lotus'
          : currentMother.name,
        authorBadge: `Week ${currentMother.postpartumWeeks} Postpartum · ${currentMother.city}`,
        isAnonymous,
        content,
        timestamp: 'Just now',
        likes: 1,
        hugReactions: 1,
        replies: [],
      };
      setCommunityPosts((prev) => {
        const nextPosts = [newPost, ...prev];
        syncWithCloud(doctors, mothers, nextPosts, peerMessages);
        return nextPosts;
      });
    },
    [currentMother, doctors, mothers, peerMessages, syncWithCloud]
  );

  const likeCommunityPost = useCallback(
    (postId: string) => {
      setCommunityPosts((prev) => {
        const nextPosts = prev.map((p) =>
          p.id === postId
            ? { ...p, likes: p.likes + 1, hugReactions: p.hugReactions + 1 }
            : p
        );
        syncWithCloud(doctors, mothers, nextPosts, peerMessages);
        return nextPosts;
      });
    },
    [doctors, mothers, peerMessages, syncWithCloud]
  );

  const sendPeerDirectMessage = useCallback(
    (toPeerName: string, text: string) => {
      const newMsg: PeerDirectMessage = {
        id: `pm-${Date.now()}`,
        fromMotherId: currentMother.id,
        fromMotherName: `${currentMother.name} (Week ${currentMother.postpartumWeeks})`,
        toPeerName,
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setPeerMessages((prev) => {
        const nextMsgs = [...prev, newMsg];
        syncWithCloud(doctors, mothers, communityPosts, nextMsgs);
        return nextMsgs;
      });
    },
    [currentMother, doctors, mothers, communityPosts, syncWithCloud]
  );

  const notifyAssignedDoctorFromGuardian = useCallback(
    (motherId: string, assignedDoctor: DoctorProfile, postText: string) => {
      setMothers((prev) => {
        const nextMothers = prev.map((m) => {
          if (m.id !== motherId) return m;
          const boostedScore = Math.min(96, Math.max(76, m.riskScore + 6));
          return {
            ...m,
            riskScore: boostedScore,
            riskTier: 'high' as const,
            followUpStatus: 'Pending Clinician Review' as const,
            clinicalNotes: [
              {
                id: `cn-guardian-${Date.now()}`,
                timestamp: 'Just now',
                author: `AI Safety Guardian → ${assignedDoctor.fullName}`,
                note: `Mother consented to priority check-in with ${assignedDoctor.fullName} (${assignedDoctor.hospitalName}) after MomCircle distress signal: "${postText.slice(0, 120)}"`,
              },
              ...m.clinicalNotes,
            ],
          };
        });
        syncWithCloud(doctors, nextMothers, communityPosts, peerMessages);
        return nextMothers;
      });
    },
    [doctors, communityPosts, peerMessages, syncWithCloud]
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
          const assignedDoc = resolveAssignedDoctor(m, doctors);
          const nextStatus = routeToDoctor
            ? ('Pending Clinician Review' as const)
            : m.followUpStatus;
          const nextNotes = routeToDoctor
            ? [
                {
                  id: `cn-${Date.now()}`,
                  timestamp: 'Just now',
                  author: `${m.name} → ${assignedDoc.fullName}`,
                  note: `Completed validated 5-item EPDS check-in (Score: ${score}/15) and routed to assigned clinician ${assignedDoc.fullName} (${assignedDoc.hospitalName}).`,
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
          const assignedDoc = resolveAssignedDoctor(m, doctors);
          return {
            ...m,
            followUpStatus: 'In Care Pathway' as const,
            clinicalNotes: [
              {
                id: `cn-${Date.now()}`,
                timestamp: 'Just now',
                author: `${m.name} (Mother Portal)`,
                note: `Requested a warm outreach call from Perinatal Care Coordinator at ${assignedDoc.hospitalName} (${assignedDoc.fullName}).`,
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

  // ABDM / ABHA 14-Digit Health ID Gateway Verification
  const verifyMotherAbhaId = useCallback(
    (motherId: string, abhaIdInput: string) => {
      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          const formattedId = formatAbhaId(abhaIdInput, 8821);
          const formattedAddr = formatAbhaAddress(m.name, m.abhaAddress);
          return {
            ...m,
            abhaId: formattedId,
            abhaAddress: formattedAddr,
            abhaVerified: true,
            clinicalNotes: [
              {
                id: `cn-abha-${Date.now()}`,
                timestamp: 'Just now',
                author: 'ABDM Health ID Gateway',
                note: `Verified 14-Digit ABHA Health ID (${formattedId} · ${formattedAddr}) and linked to Maternity EHR.`,
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

  // HL7 FHIR R4 Push Risk Summary to Hospital EHR (Cloudnine / Manipal HIS)
  const pushFhirRiskSummaryToHospitalEhr = useCallback(
    (motherId: string, doctor: DoctorProfile): string => {
      const receiptId = `ABDM-HIS-${Math.floor(100000 + Math.random() * 899999)}`;
      const syncTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          const abhaId = m.abhaId || '91-4829-3104-8821';
          return {
            ...m,
            ehrSynced: true,
            ehrLastSyncReceiptId: receiptId,
            ehrLastSyncAt: `Today, ${syncTime}`,
            followUpStatus: 'In Care Pathway' as const,
            clinicalNotes: [
              {
                id: `cn-fhir-${Date.now()}`,
                timestamp: 'Just now',
                author: `HL7 FHIR R4 Gateway (${doctor.fullName})`,
                note: `POST /fhir/R4/Observation completed to ${doctor.hospitalName} HIS. ABHA: ${abhaId} · Risk Score: ${m.riskScore}/100 · EHR Sync Receipt ID: ${receiptId} (EHR Synced ✅).`,
              },
              ...m.clinicalNotes,
            ],
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });

      return receiptId;
    },
    [doctors, syncWithCloud]
  );

  // Live 2-Way WhatsApp Bot & Bhashini Voice Note Simulator
  const processWhatsAppBotVoiceOrText = useCallback(
    (motherId: string, messageText: string, lang: 'en' | 'hi' | 'kn') => {
      const extracted = parseWhatsAppVoiceOrTextCommand(messageText);
      const targetMother =
        mothers.find((m) => m.id === motherId) || mothers[0];
      const assignedDoc = resolveAssignedDoctor(targetMother, doctors);
      const durationStr = extracted.durationMins
        ? ` (${extracted.durationMins} mins)`
        : '';

      const withLog = applyNewActivityLog(targetMother, {
        timestamp: extracted.feeding,
        category: 'Voice Logger',
        detail: `WhatsApp Bot (${lang.toUpperCase()}): ${targetMother.babyName} fed at ${extracted.feeding}${durationStr} · ${extracted.wakeups} wake-ups · Mood: ${extracted.moodLabel}`,
        isNightBurst: extracted.isNightBurst,
        isDistressSignal: extracted.isDistress,
        baselineComparison: `Synced via WhatsApp Cloud Bot → ${assignedDoc.fullName}`,
      });

      const updatedRiskScore = withLog.riskScore;

      setMothers((prev) => {
        const next = prev.map((m) => {
          if (m.id !== motherId) return m;
          return {
            ...withLog,
            followUpStatus: extracted.isDistress
              ? ('Pending Clinician Review' as const)
              : withLog.followUpStatus,
            clinicalNotes: [
              {
                id: `cn-wabot-${Date.now()}`,
                timestamp: 'Just now',
                author: `WhatsApp Cloud Bot → ${assignedDoc.fullName}`,
                note: `Extracted from ${targetMother.name}'s WhatsApp Bhashini Voice Note/Chat (${targetMother.babyName}): { feeding: '${extracted.feeding}${durationStr}', wakeups: ${extracted.wakeups}, mood: ${extracted.mood} }. Updated 7-Day Risk Score to ${updatedRiskScore}/100.`,
              },
              ...withLog.clinicalNotes,
            ],
          };
        });
        syncWithCloud(doctors, next);
        return next;
      });

      return {
        feeding: extracted.feeding,
        durationMins: extracted.durationMins,
        wakeups: extracted.wakeups,
        mood: extracted.mood,
        moodLabel: extracted.moodLabel,
        updatedRiskScore,
        assignedDoctorName: assignedDoc.fullName,
      };
    },
    [mothers, doctors, syncWithCloud]
  );

  const currentDoctor =
    doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  return (
    <NurtureMindDBContext.Provider
      value={{
        doctors,
        mothers,
        communityPosts,
        peerMessages,
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
        saveVoiceCareLog,
        recordWatchFeedAction,
        recordWatchMoodAction,
        triggerWatchSosPartnerNudge,
        pushDoctorWatchPrescription,
        acknowledgeWatchPrescription,
        createCommunityPost,
        likeCommunityPost,
        sendPeerDirectMessage,
        notifyAssignedDoctorFromGuardian,
        updateConsent,
        saveEpdsScore,
        triggerPartnerNudge,
        requestCoordinatorCall,
        sendEpdsToMother,
        assignCounsellorAndLogNote,
        verifyMotherAbhaId,
        pushFhirRiskSummaryToHospitalEhr,
        processWhatsAppBotVoiceOrText,
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

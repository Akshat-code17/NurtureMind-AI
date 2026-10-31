export type RiskTier = 'high' | 'moderate' | 'low';

export type FollowUpStatus =
  | 'Pending Clinician Review'
  | 'Partner Nudged'
  | 'EPDS Scheduled'
  | 'In Care Pathway';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  category:
    | 'Feeding'
    | 'Sleep & Night Wake-up'
    | 'In-App Search'
    | 'Mood Check-In'
    | 'Voice Logger'
    | 'Apple Watch';
  detail: string;
  isNightBurst: boolean;
  isDistressSignal: boolean;
  baselineComparison: string;
}

export interface ShapFeature {
  id: string;
  key:
    | 'nightBursts'
    | 'distressSearch'
    | 'missedEdits'
    | 'reducedMood'
    | 'caregiverShare'
    | 'acousticFatigue';
  weightPercent: number;
  deltaText: string;
}

export interface ConsentSettings {
  behaviouralSignalAnalysis: boolean;
  partnerWhatsappNudges: boolean;
  clinicianEscalationOptIn: boolean;
}

export interface AcousticTelemetry {
  wpm: number;
  pauseFrequencyPerMin: number;
  vocalFatiguePercent: number;
  cadenceSummary: string; // e.g. "Elevated Vocal Fatigue: +18% slower cadence at 03:15 AM"
  stressIndicator: 'Low' | 'Moderate' | 'Elevated';
  lastRecordedAt: string;
  transcriptSnippet: string;
}

export interface WatchTelemetry {
  heartRateBpm: number;
  hrvMs: number;
  totalSleepHours: number;
  deepSleepHours: number;
  wakeBoutCount: number;
  sleepSummaryLabel: string; // e.g. "3.1 hrs sleep / 6 wake-ups"
  moveRingPct: number;
  restRingPct: number;
  hydrationRingPct: number;
  lastWatchAction: string;
  lastSyncedAt: string;
}

export interface WatchPrescription {
  id: string;
  doctorId: string;
  doctorName: string;
  hospitalName: string;
  message: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface CommunityPost {
  id: string;
  channel:
    | '#all-mothers-lounge'
    | '#3am-feeding-support'
    | '#sleep-deprivation-vent'
    | '#postpartum-healing'
    | '#bengaluru-moms-circle';
  authorId: string;
  authorDisplayName: string;
  authorBadge: string;
  isAnonymous: boolean;
  content: string;
  timestamp: string;
  likes: number;
  hugReactions: number;
  replies: {
    id: string;
    authorName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface PeerDirectMessage {
  id: string;
  fromMotherId: string;
  fromMotherName: string;
  toPeerName: string;
  text: string;
  timestamp: string;
}

export interface WhatsAppBotMessage {
  id: string;
  sender: 'mother' | 'bot';
  text: string;
  timestamp: string;
  language: 'en' | 'hi' | 'kn';
  isVoiceNote?: boolean;
  extractedTelemetry?: {
    feeding: string;
    wakeups: number;
    mood: number;
  };
  partnerWaLink?: string;
}

export interface MotherProfile {
  id: string;
  name: string;
  email?: string;
  password?: string;
  age: number;
  city: string;
  babyName: string;
  babyBirthDate?: string;
  postpartumWeeks: number;
  hospitalId: string; // Unique Login ID: NM-MOM-XXXX
  abhaId?: string; // 14-digit Ayushman Bharat Health Account ID e.g. 91-4829-3104-8821
  abhaAddress?: string; // e.g. ananya.sharma@abdm
  abhaVerified?: boolean;
  ehrSynced?: boolean;
  ehrLastSyncReceiptId?: string;
  ehrLastSyncAt?: string;
  linkedDoctorId?: string; // Relational FK -> DoctorProfile.id
  doctorInviteCode?: string;
  partnerName: string;
  partnerPhone: string;
  riskScore: number; // 0 to 100
  baselineScore: number; // personal baseline e.g. 22
  baselineDeviationPercent: number; // e.g. +64
  riskTier: RiskTier;
  topDriversTextKey: string;
  customTopDriverText?: string;
  followUpStatus: FollowUpStatus;
  consent: ConsentSettings;
  shapFeatures: ShapFeature[];
  baselineSeries14d: { dayLabel: string; personalBaseline: number; currentRolling: number }[];
  sevenDayRiskTrajectory: { day: string; risk: number; baseline: number }[];
  logs: ActivityLogEntry[];
  explainableSignals: {
    nightSessionsCount: number;
    usualNightSessions: number;
    missedMoodCheckIns: number;
    repeatedFeedingEdits: number;
  };
  epdsLastScore: number | null;
  epdsRequestedByDoctor: boolean;
  clinicalNotes: { id: string; timestamp: string; author: string; note: string }[];
  acousticTelemetry?: AcousticTelemetry;
  watchTelemetry?: WatchTelemetry;
  watchPrescriptions?: WatchPrescription[];
  whatsappHistory?: WhatsAppBotMessage[];
  createdAt?: string;
}

export interface DoctorProfile {
  id: string;
  systemId: string; // Unique Login ID: NM-DOC-XXXX
  fullName: string;
  email: string;
  password?: string;
  kmcRegistrationId: string;
  hospitalName: string;
  specialization: 'OB-GYN' | 'Paediatrics' | 'Perinatal Psychiatry' | string;
  clinicCode: string; // e.g. DR-KAV88
  assignedPatientIds: string[];
  createdAt: string;
}

export interface SessionAuth {
  isLoggedIn?: boolean;
  token: string;
  role: 'doctor' | 'mother';
  userId: string;
  systemId?: string;
  email: string;
  name: string;
  authenticatedAt: string;
  user?: DoctorProfile | MotherProfile;
}

export interface NewDoctorRegistrationInput {
  fullName: string;
  email: string;
  password?: string;
  hospitalName: string;
  kmcRegistrationId: string;
  specialization: 'OB-GYN' | 'Paediatrics' | 'Perinatal Psychiatry' | string;
  systemId?: string;
}

export interface NewMotherRegistrationInput {
  name: string;
  email: string;
  password?: string;
  hospitalId?: string;
  abhaId?: string;
  abhaAddress?: string;
  abhaVerified?: boolean;
  age?: number;
  city?: string;
  babyName: string;
  babyBirthDate?: string;
  postpartumWeeks: number;
  partnerName?: string;
  partnerPhone: string;
  linkedDoctorId?: string;
  doctorInviteCode?: string;
  consent?: ConsentSettings;
  initialBaselineNote?: string;
  onboardedByDoctorName?: string;
}

export function formatAbhaId(rawInput?: string, numericSeed?: number): string {
  const digitsOnly = (rawInput || '').replace(/\D/g, '');
  if (digitsOnly.length === 14) {
    return `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 6)}-${digitsOnly.slice(
      6,
      10
    )}-${digitsOnly.slice(10, 14)}`;
  }
  const seed =
    typeof numericSeed === 'number'
      ? String(1000 + (numericSeed % 8999)).slice(0, 4)
      : String(Math.floor(1000 + Math.random() * 8999));
  return `91-4829-3104-${seed}`;
}

export function formatAbhaAddress(name: string, rawAddress?: string): string {
  if (rawAddress && rawAddress.trim().includes('@')) {
    return rawAddress.trim().toLowerCase();
  }
  const cleanSlug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/(^\.|\.$)/g, '');
  return `${cleanSlug || 'mother'}@abdm`;
}

export function generateSystemUserId(
  role: 'mother' | 'doctor',
  numericSeed?: number
): string {
  const prefix = role === 'doctor' ? 'NM-DOC-' : 'NM-MOM-';
  const digits =
    typeof numericSeed === 'number'
      ? String(numericSeed).padStart(4, '0').slice(-4)
      : String(Math.floor(2100 + Math.random() * 7800));
  return `${prefix}${digits}`;
}

export function generateTempPassword(numericSeed?: number): string {
  const digits =
    typeof numericSeed === 'number'
      ? String(numericSeed).padStart(4, '0').slice(-4)
      : String(Math.floor(1000 + Math.random() * 8999));
  return `Nurture@${digits}`;
}

export function generateClinicCode(fullName: string, numericSuffix?: number): string {
  const cleaned = fullName
    .replace(/^dr\.?\s*/i, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();
  const prefix = (cleaned + 'MDX').slice(0, 3);
  const num =
    typeof numericSuffix === 'number'
      ? String(numericSuffix).padStart(2, '0').slice(-2)
      : String(Math.floor(10 + Math.random() * 89));
  return `DR-${prefix}${num}`;
}

export function resolveAssignedDoctor(
  mother: MotherProfile,
  doctors: DoctorProfile[]
): DoctorProfile {
  if (!doctors || doctors.length === 0) {
    return {
      id: 'doc-kavitha',
      systemId: 'NM-DOC-1001',
      fullName: 'Dr. Kavitha Rao',
      email: 'kavitha.rao@manipal.edu',
      kmcRegistrationId: 'KMC-OBG-8821',
      hospitalName: 'Cloudnine / Manipal Maternity Network, Bengaluru',
      specialization: 'OB-GYN',
      clinicCode: 'DR-KAV88',
      assignedPatientIds: [],
      createdAt: new Date().toISOString(),
    };
  }
  const byId = doctors.find(
    (d) =>
      d.id === mother.linkedDoctorId ||
      d.assignedPatientIds.includes(mother.id) ||
      (mother.doctorInviteCode &&
        d.clinicCode.toUpperCase() === mother.doctorInviteCode.toUpperCase())
  );
  return byId || doctors[0];
}

export function verifyMotherCredentials(
  mothers: MotherProfile[],
  identifier: string,
  passwordInput: string
): MotherProfile | null {
  const q = identifier.trim().toLowerCase();
  const pass = passwordInput.trim();
  if (!q || !pass) return null;

  const matched = mothers.find(
    (m) =>
      m.hospitalId.toLowerCase() === q ||
      (m.email && m.email.toLowerCase() === q) ||
      m.id.toLowerCase() === q
  );
  if (!matched) return null;

  const expectedPass = matched.password || 'Mother@123';
  if (expectedPass !== pass) return null;
  return matched;
}

export function verifyDoctorCredentials(
  doctors: DoctorProfile[],
  identifier: string,
  passwordInput: string
): DoctorProfile | null {
  const q = identifier.trim().toLowerCase();
  const pass = passwordInput.trim();
  if (!q || !pass) return null;

  const matched = doctors.find(
    (d) =>
      d.systemId.toLowerCase() === q ||
      d.email.toLowerCase() === q ||
      d.kmcRegistrationId.toLowerCase() === q ||
      d.clinicCode.toLowerCase() === q ||
      d.id.toLowerCase() === q
  );
  if (!matched) return null;

  const expectedPass = matched.password || 'Doctor@123';
  if (expectedPass !== pass) return null;
  return matched;
}

export function createNewDoctorProfile(
  input: NewDoctorRegistrationInput,
  numericSeed?: number
): DoctorProfile {
  const cleanName = input.fullName.trim().startsWith('Dr.')
    ? input.fullName.trim()
    : `Dr. ${input.fullName.trim()}`;
  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const id = `doc-${slug}-${Date.now().toString(36).slice(-4)}`;
  const clinicCode = generateClinicCode(cleanName, numericSeed);
  const systemId =
    input.systemId?.trim().toUpperCase() || generateSystemUserId('doctor', numericSeed);

  return {
    id,
    systemId,
    fullName: cleanName,
    email: input.email.trim().toLowerCase(),
    password: input.password?.trim() || generateTempPassword(numericSeed),
    kmcRegistrationId: input.kmcRegistrationId.trim().toUpperCase() || `KMC-${clinicCode}`,
    hospitalName:
      input.hospitalName.trim() || 'Cloudnine / Manipal Maternity Network, Bengaluru',
    specialization: input.specialization || 'OB-GYN',
    clinicCode,
    assignedPatientIds: [],
    createdAt: new Date().toISOString(),
  };
}

export function createNewMotherProfile(
  input: NewMotherRegistrationInput,
  linkedDoctor?: DoctorProfile,
  numericSeed?: number
): MotherProfile {
  const slug = input.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const id = `mother-${slug}-${Date.now().toString(36).slice(-4)}`;
  const hospitalId =
    input.hospitalId?.trim().toUpperCase() || generateSystemUserId('mother', numericSeed);
  const baselineScore = 22;
  const initialRiskScore = 26;
  const deviation = calculateBaselineDeviation(initialRiskScore, baselineScore);

  const consent: ConsentSettings = input.consent || {
    behaviouralSignalAnalysis: true,
    partnerWhatsappNudges: true,
    clinicianEscalationOptIn: true,
  };

  const authorName =
    input.onboardedByDoctorName ||
    linkedDoctor?.fullName ||
    'NurtureMind Onboarding Engine';

  const noteText =
    input.initialBaselineNote?.trim() ||
    `Patient onboarded (${input.postpartumWeeks} weeks postpartum, caring for ${input.babyName}). Personal baseline tracking active with full consent.`;

  const abhaId = formatAbhaId(input.abhaId, numericSeed);
  const abhaAddress = formatAbhaAddress(input.name, input.abhaAddress);

  return {
    id,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password?.trim() || generateTempPassword(numericSeed),
    age: input.age || 29,
    city: input.city?.trim() || 'Bengaluru',
    babyName: input.babyName.trim() || 'Baby',
    babyBirthDate: input.babyBirthDate,
    postpartumWeeks: Math.max(1, Math.min(52, Number(input.postpartumWeeks) || 4)),
    hospitalId,
    abhaId,
    abhaAddress,
    abhaVerified: input.abhaVerified ?? true,
    ehrSynced: false,
    linkedDoctorId: linkedDoctor?.id || input.linkedDoctorId || 'doc-kavitha',
    doctorInviteCode: linkedDoctor?.clinicCode || input.doctorInviteCode || 'DR-KAV88',
    partnerName: input.partnerName?.trim() || 'Family Caregiver',
    partnerPhone: input.partnerPhone.trim() || '+91 98450 11223',
    riskScore: initialRiskScore,
    baselineScore,
    baselineDeviationPercent: Math.max(8, deviation),
    riskTier: classifyRiskTier(initialRiskScore),
    topDriversTextKey: 'driverSneha',
    customTopDriverText: input.initialBaselineNote?.trim()
      ? `Baseline established: ${input.initialBaselineNote.trim()}`
      : 'Newly onboarded maternal baseline · Routine sleep & feeding window',
    followUpStatus: 'In Care Pathway',
    consent,
    shapFeatures: [
      { id: 's1', key: 'nightBursts', weightPercent: 20, deltaText: '1 session (1–4 AM) vs 1 usual' },
      { id: 's2', key: 'distressSearch', weightPercent: 15, deltaText: '0 late-night distress queries' },
      { id: 's3', key: 'missedEdits', weightPercent: 15, deltaText: 'Steady feeding logs' },
      { id: 's4', key: 'reducedMood', weightPercent: 25, deltaText: 'Voluntary check-ins active' },
      { id: 's5', key: 'caregiverShare', weightPercent: 25, deltaText: 'Partner WhatsApp sync active' },
    ],
    baselineSeries14d: Array.from({ length: 14 }, (_, idx) => ({
      dayLabel: `D${idx + 1}`,
      personalBaseline: baselineScore,
      currentRolling: baselineScore + (idx % 3) + 2,
    })),
    sevenDayRiskTrajectory: [
      { day: 'Day -6', risk: 22, baseline: baselineScore },
      { day: 'Day -5', risk: 23, baseline: baselineScore },
      { day: 'Day -4', risk: 24, baseline: baselineScore },
      { day: 'Day -3', risk: 24, baseline: baselineScore },
      { day: 'Day -2', risk: 25, baseline: baselineScore },
      { day: 'Yesterday', risk: 25, baseline: baselineScore },
      { day: 'Today', risk: initialRiskScore, baseline: baselineScore },
    ],
    logs: [
      {
        id: `log-init-${Date.now()}`,
        timestamp: '09:30 AM',
        category: 'Mood Check-In',
        detail: `Account registered & linked (${hospitalId} · ABHA ${abhaId}) · Initial baseline check-in`,
        isNightBurst: false,
        isDistressSignal: false,
        baselineComparison: 'Personal baseline initialized',
      },
    ],
    explainableSignals: {
      nightSessionsCount: 1,
      usualNightSessions: 1,
      missedMoodCheckIns: 0,
      repeatedFeedingEdits: 0,
    },
    epdsLastScore: null,
    epdsRequestedByDoctor: false,
    clinicalNotes: [
      {
        id: `cn-init-${Date.now()}`,
        timestamp: 'Just now',
        author: authorName,
        note: noteText,
      },
    ],
    acousticTelemetry: {
      wpm: 124,
      pauseFrequencyPerMin: 2.1,
      vocalFatiguePercent: 12,
      cadenceSummary: 'Steady vocal cadence: +2% baseline rhythm at 09:30 AM',
      stressIndicator: 'Low',
      lastRecordedAt: '09:30 AM',
      transcriptSnippet: 'Initial baseline voice check-in completed.',
    },
    watchTelemetry: {
      heartRateBpm: 74,
      hrvMs: 52,
      totalSleepHours: 5.8,
      deepSleepHours: 2.1,
      wakeBoutCount: 2,
      sleepSummaryLabel: '5.8 hrs sleep / 2 wake-ups',
      moveRingPct: 72,
      restRingPct: 80,
      hydrationRingPct: 85,
      lastWatchAction: 'Synced initial Apple Watch pairing',
      lastSyncedAt: 'Just now',
    },
    watchPrescriptions: [],
    whatsappHistory: [],
    createdAt: new Date().toISOString(),
  };
}

export function classifyRiskTier(score: number): RiskTier {
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

export function calculateBaselineDeviation(currentScore: number, baselineScore: number): number {
  if (baselineScore <= 0) return 0;
  const raw = Math.round(((currentScore - baselineScore) / baselineScore) * 100);
  return Math.max(-50, Math.min(250, raw));
}

export function evaluateSearchDistress(query: string): boolean {
  const normalized = query.toLowerCase().trim();
  const distressKeywords = [
    'numb',
    'overwhelmed',
    '3am',
    'colic',
    'crying',
    'exhausted',
    'hopeless',
    'anxious',
    'guilt',
    'failing',
    'alone',
    'panic',
    'can’t sleep',
    'cant sleep',
    "can't do this",
    'cant do this',
  ];
  return distressKeywords.some((kw) => normalized.includes(kw));
}

export function isLateNightTimestamp(timeStr: string): boolean {
  const normalized = timeStr.toUpperCase().trim();
  if (!normalized.includes('AM')) return false;
  const hourMatch = normalized.match(/^(\d{1,2}):/);
  if (!hourMatch) return false;
  const hour = parseInt(hourMatch[1], 10);
  return hour === 12 || (hour >= 1 && hour <= 4);
}

export function applyNewActivityLog(
  mother: MotherProfile,
  newLog: Omit<ActivityLogEntry, 'id'>
): MotherProfile {
  const entry: ActivityLogEntry = {
    ...newLog,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };

  let scoreDelta = 0;
  const updatedSignals = { ...mother.explainableSignals };

  if (entry.isNightBurst) {
    scoreDelta += 4;
    updatedSignals.nightSessionsCount += 1;
  }
  if (entry.isDistressSignal) {
    scoreDelta += 5;
  }
  if (
    (entry.category === 'Mood Check-In' || entry.category === 'Apple Watch') &&
    !entry.isDistressSignal
  ) {
    scoreDelta -= 2;
  }
  if (entry.category === 'Feeding' && entry.detail.toLowerCase().includes('edit')) {
    scoreDelta += 2;
    updatedSignals.repeatedFeedingEdits += 1;
  }

  // Only update behavioural risk score if consented
  const nextScore = mother.consent.behaviouralSignalAnalysis
    ? Math.max(8, Math.min(98, mother.riskScore + scoreDelta))
    : mother.riskScore;

  const nextTier = classifyRiskTier(nextScore);
  const nextDeviation = Math.max(5, mother.baselineDeviationPercent + scoreDelta * 2);

  const updatedTrajectory = mother.sevenDayRiskTrajectory.map((pt, idx, arr) =>
    idx === arr.length - 1 ? { ...pt, risk: nextScore } : pt
  );

  const updatedSeries14d = mother.baselineSeries14d.map((pt, idx, arr) =>
    idx === arr.length - 1 ? { ...pt, currentRolling: nextScore } : pt
  );

  return {
    ...mother,
    riskScore: nextScore,
    riskTier: nextTier,
    baselineDeviationPercent: nextDeviation,
    explainableSignals: updatedSignals,
    sevenDayRiskTrajectory: updatedTrajectory,
    baselineSeries14d: updatedSeries14d,
    logs: [entry, ...mother.logs],
  };
}

export interface EpdsEvaluation {
  totalScore: number;
  maxScore: number;
  severity: 'low' | 'moderate' | 'high';
  recommendationKey: 'epdsRecLow' | 'epdsRecModerate' | 'epdsRecHigh';
}

export function calculateEpdsEvaluation(answers: number[]): EpdsEvaluation {
  if (!Array.isArray(answers) || answers.length === 0) {
    return {
      totalScore: 0,
      maxScore: 15,
      severity: 'low',
      recommendationKey: 'epdsRecLow',
    };
  }
  const totalScore = answers.reduce((acc, val) => acc + Math.max(0, Math.min(3, val)), 0);
  const maxScore = answers.length * 3;

  if (totalScore >= 9) {
    return {
      totalScore,
      maxScore,
      severity: 'high',
      recommendationKey: 'epdsRecHigh',
    };
  }
  if (totalScore >= 5) {
    return {
      totalScore,
      maxScore,
      severity: 'moderate',
      recommendationKey: 'epdsRecModerate',
    };
  }
  return {
    totalScore,
    maxScore,
    severity: 'low',
    recommendationKey: 'epdsRecLow',
  };
}

export interface WhatsAppExtractedTelemetry {
  feeding: string;
  durationMins?: number;
  wakeups: number;
  mood: number;
  moodLabel: string;
  isDistress: boolean;
  isNightBurst: boolean;
}

export function parseWhatsAppVoiceOrTextCommand(
  messageText: string
): WhatsAppExtractedTelemetry {
  const lower = messageText.toLowerCase();
  const exactTimeMatch = messageText.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/);
  const hourOnlyMatch = messageText.match(/\b(\d{1,2})\s*(AM|PM|am|pm)\b/);

  const feeding = exactTimeMatch
    ? exactTimeMatch[1].replace(/\s+/g, ' ').toUpperCase()
    : hourOnlyMatch
    ? `${hourOnlyMatch[1]}:00 ${hourOnlyMatch[2].toUpperCase()}`
    : lower.includes('3:10') || lower.includes('3am') || lower.includes('3 am')
    ? '3:10 AM'
    : '03:10 AM';

  const durationMatch = messageText.match(
    /(\d{1,3})\s*(?:mins?|minutes?|मिनट|ನಿಮಿಷ)/i
  );
  const durationMins = durationMatch
    ? Math.max(1, Math.min(120, Number(durationMatch[1])))
    : undefined;

  const wakeMatch =
    messageText.match(/(\d+)\s*(?:times|wake|बार|ಬಾರಿ)/i) ||
    messageText.match(/woke up\s*(\d+)/i);
  const wakeups = wakeMatch
    ? Math.max(1, Math.min(9, Number(wakeMatch[1])))
    : lower.includes('3 times') || lower.includes('three')
    ? 3
    : lower.includes('once') || lower.includes('1 time')
    ? 1
    : 2;

  const isDistress =
    evaluateSearchDistress(messageText) ||
    lower.includes('exhausted') ||
    lower.includes('anxious') ||
    lower.includes('tired') ||
    lower.includes('crying') ||
    lower.includes('overwhelmed') ||
    lower.includes('थकान') ||
    lower.includes('घबराहट') ||
    lower.includes('चिंता') ||
    lower.includes('ಸುಸ್ತಾಗಿದೆ') ||
    lower.includes('ಆತಂಕ');

  const isCalm =
    !isDistress &&
    (lower.includes('calm') ||
      lower.includes('peaceful') ||
      lower.includes('good') ||
      lower.includes('better') ||
      lower.includes('happy') ||
      lower.includes('शांत') ||
      lower.includes('बेहतर') ||
      lower.includes('ಶಾಂತ'));

  const mood = isDistress ? 2 : isCalm ? 5 : 4;
  const moodLabel = isDistress
    ? 'Anxious & Exhausted (2/5)'
    : isCalm
    ? 'Calm & Restorative (5/5)'
    : 'Steady (4/5)';
  const isNightBurst = isLateNightTimestamp(feeding) || wakeups >= 3;

  return {
    feeding,
    durationMins,
    wakeups,
    mood,
    moodLabel,
    isDistress,
    isNightBurst,
  };
}

export function buildWhatsAppDeepLink(
  rawPhone: string,
  messageText: string
): string {
  const digits = (rawPhone || '').replace(/\D/g, '');
  const cleanPhone =
    digits.length === 10
      ? `91${digits}`
      : digits.length >= 11
      ? digits
      : '919845071234';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}

export interface SupportTicketRecord {
  id: string;
  receiptId: string;
  name: string;
  registeredIdOrEmail: string;
  urgency:
    | 'Routine Check-In'
    | 'Moderate — Callback Within 2 Hours'
    | 'High — Priority Clinical Callback';
  message: string;
  assignedDoctorName: string;
  hospitalName: string;
  createdAt: string;
}

export function createSupportTicketRecord(
  input: {
    name: string;
    registeredIdOrEmail: string;
    urgency: SupportTicketRecord['urgency'];
    message: string;
    assignedDoctorName?: string;
    hospitalName?: string;
  },
  numericSeed?: number
): SupportTicketRecord {
  const digits =
    typeof numericSeed === 'number'
      ? String(100000 + (numericSeed % 899999)).slice(0, 6)
      : String(Math.floor(100000 + Math.random() * 899999));
  return {
    id: `tkt-${Date.now()}`,
    receiptId: `NM-TKT-${digits}`,
    name: input.name.trim(),
    registeredIdOrEmail: input.registeredIdOrEmail.trim(),
    urgency: input.urgency,
    message: input.message.trim(),
    assignedDoctorName:
      input.assignedDoctorName || 'Dr. Kavitha Rao (Perinatal Care Desk)',
    hospitalName:
      input.hospitalName || 'Cloudnine / Manipal Maternity Network, Bengaluru',
    createdAt: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

export interface Hl7FhirR4Bundle {
  resourceType: 'Bundle';
  id: string;
  type: 'collection';
  timestamp: string;
  meta: {
    profile: string[];
    source: string;
  };
  entry: Array<{
    fullUrl: string;
    resource: Record<string, unknown>;
  }>;
}

export function buildHl7FhirR4Bundle(
  mother: MotherProfile,
  assignedDoctor: DoctorProfile
): Hl7FhirR4Bundle {
  const abhaId = mother.abhaId || formatAbhaId(undefined, 8821);
  const abhaAddress = mother.abhaAddress || formatAbhaAddress(mother.name);
  const nowIso = new Date().toISOString();

  return {
    resourceType: 'Bundle',
    id: `fhir-bundle-${mother.hospitalId.toLowerCase()}`,
    type: 'collection',
    timestamp: nowIso,
    meta: {
      profile: [
        'https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle',
      ],
      source: 'NurtureMind AI • ABDM HIE-CM Interoperability Gateway',
    },
    entry: [
      {
        fullUrl: `urn:uuid:patient-${mother.id}`,
        resource: {
          resourceType: 'Patient',
          id: mother.id,
          identifier: [
            {
              system: 'https://healthid.ndhm.gov.in',
              type: { text: 'ABHA 14-Digit Health ID' },
              value: abhaId,
            },
            {
              system: 'https://abdm.gov.in/phr-address',
              type: { text: 'ABHA PHR Address' },
              value: abhaAddress,
            },
            {
              system: 'https://nurturemind.in/patient-id',
              type: { text: 'NurtureMind Unique Patient ID' },
              value: mother.hospitalId,
            },
          ],
          name: [{ use: 'official', text: mother.name }],
          gender: 'female',
          extension: [
            {
              url: 'https://nurturemind.in/fhir/StructureDefinition/postpartum-weeks',
              valueInteger: mother.postpartumWeeks,
            },
            {
              url: 'https://nurturemind.in/fhir/StructureDefinition/newborn-name',
              valueString: mother.babyName,
            },
          ],
        },
      },
      {
        fullUrl: `urn:uuid:observation-${mother.id}`,
        resource: {
          resourceType: 'Observation',
          id: `obs-risk-${mother.id}`,
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'survey',
                  display: 'Postpartum Behavioral Risk & Biometric Telemetry',
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '99046-1',
                display: '7-Day Postpartum Behavioral Risk Signal (Non-Diagnostic)',
              },
            ],
          },
          subject: {
            reference: `Patient/${mother.id}`,
            display: `${mother.name} (ABHA: ${abhaId})`,
          },
          performer: [
            {
              reference: `Practitioner/${assignedDoctor.id}`,
              display: `${assignedDoctor.fullName} (${assignedDoctor.hospitalName})`,
            },
          ],
          effectiveDateTime: nowIso,
          valueQuantity: {
            value: mother.riskScore,
            unit: 'score/100',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          component: [
            {
              code: { text: 'Personal Baseline Deviation (%)' },
              valueQuantity: {
                value: mother.baselineDeviationPercent,
                unit: '%',
              },
            },
            {
              code: { text: 'Nocturnal Burst Index (1 AM - 4 AM Sessions)' },
              valueQuantity: {
                value: mother.explainableSignals.nightSessionsCount,
                unit: 'sessions/night',
              },
            },
            {
              code: { text: 'Apple Watch Sleep & Autonomic HRV' },
              valueString: `${
                mother.watchTelemetry?.sleepSummaryLabel || '3.1 hrs sleep / 6 wake-ups'
              } • HR ${mother.watchTelemetry?.heartRateBpm || 88} BPM • HRV ${
                mother.watchTelemetry?.hrvMs || 29
              } ms`,
            },
            {
              code: { text: 'Acoustic Vocal Fatigue Telemetry' },
              valueString:
                mother.acousticTelemetry?.cadenceSummary ||
                'Elevated Vocal Fatigue: +18% slower cadence at 03:15 AM',
            },
            {
              code: { text: 'SHAP Explainable Feature Attributions' },
              valueString: mother.shapFeatures
                .map((s) => `${s.key}: +${s.weightPercent}% (${s.deltaText})`)
                .join(' | '),
            },
          ],
        },
      },
      {
        fullUrl: `urn:uuid:questionnaire-epds-${mother.id}`,
        resource: {
          resourceType: 'QuestionnaireResponse',
          id: `epds-${mother.id}`,
          status: 'completed',
          subject: { reference: `Patient/${mother.id}`, display: mother.name },
          authored: nowIso,
          questionnaire: 'http://loinc.org/71354-5/EPDS-5-Item-Validated-Check',
          item: [
            {
              linkId: 'epds-total-score',
              text: 'Validated 5-Item Edinburgh Postnatal Depression Scale (EPDS) Self-Check Score',
              answer: [
                {
                  valueInteger: mother.epdsLastScore !== null ? mother.epdsLastScore : 10,
                },
              ],
            },
          ],
        },
      },
      {
        fullUrl: `urn:uuid:careplan-${mother.id}`,
        resource: {
          resourceType: 'CarePlan',
          id: `careplan-${mother.id}`,
          status: 'active',
          intent: 'plan',
          title: `Perinatal Support & Human-in-the-Loop Care Plan — ${mother.name}`,
          subject: { reference: `Patient/${mother.id}`, display: mother.name },
          author: {
            reference: `Practitioner/${assignedDoctor.id}`,
            display: `${assignedDoctor.fullName} (${assignedDoctor.kmcRegistrationId}) · ${assignedDoctor.hospitalName}`,
          },
          description: `Follow-up Status: ${mother.followUpStatus}. Consented Partner Support: ${mother.partnerName} (${mother.partnerPhone}). Non-diagnostic behavioral risk signal routed for OB-GYN / Perinatal Mental Health review.`,
        },
      },
    ],
  };
}


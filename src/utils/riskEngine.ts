export type RiskTier = 'high' | 'moderate' | 'low';

export type FollowUpStatus =
  | 'Pending Clinician Review'
  | 'Partner Nudged'
  | 'EPDS Scheduled'
  | 'In Care Pathway';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  category: 'Feeding' | 'Sleep & Night Wake-up' | 'In-App Search' | 'Mood Check-In';
  detail: string;
  isNightBurst: boolean;
  isDistressSignal: boolean;
  baselineComparison: string;
}

export interface ShapFeature {
  id: string;
  key: 'nightBursts' | 'distressSearch' | 'missedEdits' | 'reducedMood' | 'caregiverShare';
  weightPercent: number;
  deltaText: string;
}

export interface ConsentSettings {
  behaviouralSignalAnalysis: boolean;
  partnerWhatsappNudges: boolean;
  clinicianEscalationOptIn: boolean;
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
  linkedDoctorId?: string;
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
  token: string;
  role: 'doctor' | 'mother';
  userId: string;
  systemId: string;
  email: string;
  name: string;
  authenticatedAt: string;
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
        detail: `Account registered & linked (${hospitalId}) · Initial baseline check-in`,
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
  if (entry.category === 'Mood Check-In' && !entry.isDistressSignal) {
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

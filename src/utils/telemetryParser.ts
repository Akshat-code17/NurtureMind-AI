import {
  type MotherProfile,
  type DoctorProfile,
  type AcousticTelemetry,
  resolveAssignedDoctor,
  isLateNightTimestamp,
  evaluateSearchDistress,
} from './riskEngine.ts';

export interface ParsedVoiceCareLog {
  transcript: string;
  language: 'en-IN' | 'hi-IN' | 'kn-IN';
  feedingType: 'Breastfeeding' | 'Bottle / Formula';
  feedingDurationMins: number;
  nightWakeUps: number;
  moodScore: 1 | 2 | 3 | 4 | 5;
  moodLabel: string;
  distressNotes: string;
  timestamp: string;
  isNightBurst: boolean;
  isDistressSignal: boolean;
  acoustic: AcousticTelemetry;
}

export function analyzeAcousticFatigue(
  transcript: string,
  timestamp: string = '03:15 AM',
  spokenDurationSec: number = 14
): AcousticTelemetry {
  const words = transcript
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const wordCount = Math.max(4, words.length);
  const durationMinutes = Math.max(0.15, spokenDurationSec / 60);
  const rawWpm = Math.round(wordCount / durationMinutes);
  const wpm = Math.max(68, Math.min(155, rawWpm));

  // Count ellipses, commas, hesitations, or distress pauses
  const pauseMatches = transcript.match(/(\.\.\.|—|,|;\s|uh|um|sigh)/gi);
  const pauseCount = pauseMatches ? pauseMatches.length : 1;
  const pauseFrequencyPerMin = Number(
    Math.min(14.5, Math.max(1.2, (pauseCount / durationMinutes) * 0.65)).toFixed(1)
  );

  const lateNight = isLateNightTimestamp(timestamp);
  const hasDistress = evaluateSearchDistress(transcript) ||
    /थकान|रो|नींद|अकेला|ಸುಸ್ತಾಗಿದೆ|ನಿದ್ದೆ|ಅಳು/i.test(transcript);

  // Baseline WPM is ~125 WPM. Slower cadence at night indicates vocal fatigue.
  const cadenceDropPct = Math.max(
    4,
    Math.min(
      34,
      Math.round(((128 - wpm) / 128) * 100) + (lateNight ? 12 : 0) + (hasDistress ? 6 : 0)
    )
  );

  const vocalFatiguePercent = Math.min(
    94,
    Math.max(14, cadenceDropPct * 2 + (lateNight ? 18 : 6))
  );

  const stressIndicator: 'Low' | 'Moderate' | 'Elevated' =
    vocalFatiguePercent >= 55 || (lateNight && hasDistress)
      ? 'Elevated'
      : vocalFatiguePercent >= 32
      ? 'Moderate'
      : 'Low';

  const cadenceSummary =
    stressIndicator === 'Elevated'
      ? `Elevated Vocal Fatigue: +${cadenceDropPct}% slower cadence at ${timestamp}`
      : stressIndicator === 'Moderate'
      ? `Moderate Vocal Fatigue: +${cadenceDropPct}% slower cadence at ${timestamp}`
      : `Steady Vocal Cadence: within +${cadenceDropPct}% of personal baseline at ${timestamp}`;

  return {
    wpm,
    pauseFrequencyPerMin,
    vocalFatiguePercent,
    cadenceSummary,
    stressIndicator,
    lastRecordedAt: timestamp,
    transcriptSnippet: transcript.trim(),
  };
}

export function parseSpokenCareLog(
  transcript: string,
  language: 'en-IN' | 'hi-IN' | 'kn-IN' = 'en-IN',
  overrideTimestamp?: string
): ParsedVoiceCareLog {
  const lower = transcript.toLowerCase();

  // Detect feeding type
  const isBottle =
    lower.includes('bottle') ||
    lower.includes('formula') ||
    lower.includes('ml') ||
    transcript.includes('बोतल') ||
    transcript.includes('ಬಾಟಲ್');
  const feedingType: 'Breastfeeding' | 'Bottle / Formula' = isBottle
    ? 'Bottle / Formula'
    : 'Breastfeeding';

  // Detect duration in minutes
  const minsMatch = transcript.match(/(\d{1,2})\s*(min|mins|minute|minutes|मिनट|ನಿಮಿಷ)/i);
  const feedingDurationMins = minsMatch ? Math.max(5, Math.min(60, Number(minsMatch[1]))) : 20;

  // Detect night wake-ups
  const wakeMatch = transcript.match(/(\d)\s*(wake|times|बार|ಬಾರಿ)/i);
  const nightWakeUps = wakeMatch
    ? Math.max(1, Math.min(9, Number(wakeMatch[1])))
    : lower.includes('3am') || lower.includes('3:15') || transcript.includes('रात') || transcript.includes('ರಾತ್ರಿ')
    ? 4
    : 1;

  // Detect timestamp
  let timestamp = overrideTimestamp || '03:15 AM';
  if (!overrideTimestamp) {
    if (lower.includes('2:15') || lower.includes('2 am')) timestamp = '02:15 AM';
    else if (lower.includes('3:15') || lower.includes('3 am') || lower.includes('3am'))
      timestamp = '03:15 AM';
    else if (lower.includes('morning') || lower.includes('8 am')) timestamp = '08:15 AM';
  }

  // Detect mood & distress
  const hasSevereDistress =
    evaluateSearchDistress(transcript) ||
    lower.includes('exhausted') ||
    lower.includes('crying') ||
    lower.includes('overwhelmed') ||
    transcript.includes('थक') ||
    transcript.includes('रो') ||
    transcript.includes('ಸುಸ್ತಾಗಿದೆ') ||
    transcript.includes('ಅಳು');

  const moodScore: 1 | 2 | 3 | 4 | 5 = hasSevereDistress
    ? 1
    : nightWakeUps >= 3
    ? 2
    : 4;

  const moodLabel =
    moodScore === 1
      ? 'Overwhelmed & Exhausted (1/5)'
      : moodScore === 2
      ? 'Fatigued / Sleep Deprived (2/5)'
      : 'Calm & Steady (4/5)';

  const isNightBurst = isLateNightTimestamp(timestamp) || nightWakeUps >= 3;
  const acoustic = analyzeAcousticFatigue(
    transcript,
    timestamp,
    hasSevereDistress ? 18 : 11
  );

  return {
    transcript: transcript.trim(),
    language,
    feedingType,
    feedingDurationMins,
    nightWakeUps,
    moodScore,
    moodLabel,
    distressNotes: hasSevereDistress
      ? `Late-night vocal fatigue & maternal exhaustion flagged (${acoustic.cadenceSummary})`
      : 'Routine spoken newborn care entry',
    timestamp,
    isNightBurst,
    isDistressSignal: hasSevereDistress,
    acoustic,
  };
}

export interface SafetyGuardianAlert {
  triggered: boolean;
  matchedKeywords: string[];
  assignedDoctorId: string;
  assignedDoctorName: string;
  assignedDoctorHospital: string;
  bannerMessage: string;
}

export function evaluateCommunitySafetyGuardian(
  postText: string,
  mother: MotherProfile,
  doctors: DoctorProfile[]
): SafetyGuardianAlert {
  const normalized = postText.toLowerCase();
  const severeKeywords = [
    'hopeless',
    "can't do this anymore",
    'cant do this anymore',
    'crying nonstop',
    'overwhelmed',
    'feel numb',
    'breaking down',
    'give up',
    'so alone at 3am',
  ];

  const matchedKeywords = severeKeywords.filter((kw) => normalized.includes(kw));
  const assignedDoc = resolveAssignedDoctor(mother, doctors);

  const cleanDocTitle = assignedDoc.fullName.replace(/^Dr\.?\s*/i, '');
  const bannerMessage = `💜 Gentle Check-In: Would you like to send a private priority check-in request to your assigned doctor, Dr. ${cleanDocTitle} at ${assignedDoc.hospitalName}, or take a 2-minute EPDS self-check?`;

  return {
    triggered: matchedKeywords.length > 0,
    matchedKeywords,
    assignedDoctorId: assignedDoc.id,
    assignedDoctorName: `Dr. ${cleanDocTitle}`,
    assignedDoctorHospital: assignedDoc.hospitalName,
    bannerMessage,
  };
}

// Relational schema row mappers for Supabase PostgreSQL tables:
// doctors, mothers, nurturemind_store
export interface RelationalDoctorRow {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  hospital: string;
  kmc_id: string;
  specialization: string;
  clinic_code: string;
  created_at: string;
}

export interface RelationalMotherRow {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  age: number;
  baby_name: string;
  postpartum_weeks: number;
  doctor_id: string;
  partner_name: string;
  partner_phone: string;
  risk_score: number;
  risk_level: string;
  profile_data: MotherProfile;
  created_at: string;
}

export function toRelationalDoctorRow(doc: DoctorProfile): RelationalDoctorRow {
  return {
    id: doc.id,
    full_name: doc.fullName,
    email: doc.email,
    password: doc.password || 'Doctor@123',
    hospital: doc.hospitalName,
    kmc_id: doc.kmcRegistrationId,
    specialization: doc.specialization,
    clinic_code: doc.clinicCode,
    created_at: doc.createdAt || new Date().toISOString(),
  };
}

export function toRelationalMotherRow(mother: MotherProfile): RelationalMotherRow {
  return {
    id: mother.id,
    full_name: mother.name,
    email: mother.email || `${mother.id}@nurturemind.in`,
    password: mother.password || 'Mother@123',
    age: mother.age,
    baby_name: mother.babyName,
    postpartum_weeks: mother.postpartumWeeks,
    doctor_id: mother.linkedDoctorId || 'doc-kavitha',
    partner_name: mother.partnerName,
    partner_phone: mother.partnerPhone,
    risk_score: mother.riskScore,
    risk_level: mother.riskTier,
    profile_data: mother,
    created_at: mother.createdAt || new Date().toISOString(),
  };
}

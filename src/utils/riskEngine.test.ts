import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyRiskTier,
  evaluateSearchDistress,
  isLateNightTimestamp,
  calculateEpdsEvaluation,
  applyNewActivityLog,
  generateClinicCode,
  generateSystemUserId,
  generateTempPassword,
  createNewDoctorProfile,
  createNewMotherProfile,
  verifyMotherCredentials,
  verifyDoctorCredentials,
  resolveAssignedDoctor,
  formatAbhaId,
  formatAbhaAddress,
  parseWhatsAppVoiceOrTextCommand,
  buildWhatsAppDeepLink,
  createSupportTicketRecord,
  buildHl7FhirR4Bundle,
  type MotherProfile,
} from './riskEngine.ts';
import {
  analyzeAcousticFatigue,
  parseSpokenCareLog,
  evaluateCommunitySafetyGuardian,
  toRelationalDoctorRow,
  toRelationalMotherRow,
} from './telemetryParser.ts';
import { generateSupportAnswerFallback } from './supportSearchAi.ts';
import { initialDoctors, initialMothers } from '../data/initialMothers.ts';

const sampleMother: MotherProfile = {
  id: 'ananya',
  name: 'Ananya Sharma',
  age: 28,
  city: 'Bengaluru',
  babyName: 'Baby Aarav',
  postpartumWeeks: 6,
  hospitalId: 'NM-MOM-2001',
  partnerName: 'Rohan Sharma',
  partnerPhone: '+91 98450 71234',
  riskScore: 82,
  baselineScore: 50,
  baselineDeviationPercent: 64,
  riskTier: 'high',
  topDriversTextKey: 'driverAnanya',
  followUpStatus: 'Pending Clinician Review',
  consent: {
    behaviouralSignalAnalysis: true,
    partnerWhatsappNudges: true,
    clinicianEscalationOptIn: true,
  },
  shapFeatures: [
    { id: '1', key: 'nightBursts', weightPercent: 32, deltaText: '+3.1x vs wk 1-4' },
    { id: '2', key: 'distressSearch', weightPercent: 26, deltaText: '4 late-night queries' },
    { id: '3', key: 'missedEdits', weightPercent: 18, deltaText: '2 feeding log edits' },
    { id: '4', key: 'reducedMood', weightPercent: 14, deltaText: '3 missed check-ins' },
    { id: '5', key: 'caregiverShare', weightPercent: 10, deltaText: '-45% partner sync' },
  ],
  baselineSeries14d: [
    { dayLabel: 'D1', personalBaseline: 24, currentRolling: 78 },
    { dayLabel: 'D14', personalBaseline: 25, currentRolling: 82 },
  ],
  sevenDayRiskTrajectory: [
    { day: 'Mon', risk: 70, baseline: 25 },
    { day: 'Sun', risk: 82, baseline: 25 },
  ],
  logs: [],
  explainableSignals: {
    nightSessionsCount: 4,
    usualNightSessions: 1,
    missedMoodCheckIns: 3,
    repeatedFeedingEdits: 2,
  },
  epdsLastScore: null,
  epdsRequestedByDoctor: false,
  clinicalNotes: [],
};

test('classifyRiskTier assigns high, moderate, and low thresholds accurately', () => {
  assert.equal(classifyRiskTier(82), 'high');
  assert.equal(classifyRiskTier(70), 'high');
  assert.equal(classifyRiskTier(56), 'moderate');
  assert.equal(classifyRiskTier(18), 'low');
});

test('evaluateSearchDistress detects distress-oriented queries', () => {
  assert.equal(evaluateSearchDistress('why do I feel numb and overwhelmed'), true);
  assert.equal(evaluateSearchDistress('baby colic at 3am'), true);
  assert.equal(evaluateSearchDistress('normal feeding schedule'), false);
});

test('isLateNightTimestamp identifies 12 AM to 4 AM window', () => {
  assert.equal(isLateNightTimestamp('02:15 AM'), true);
  assert.equal(isLateNightTimestamp('03:40 AM'), true);
  assert.equal(isLateNightTimestamp('10:30 AM'), false);
  assert.equal(isLateNightTimestamp('08:15 PM'), false);
});

test('applyNewActivityLog increments risk score and night burst count when consented', () => {
  const updated = applyNewActivityLog(sampleMother, {
    timestamp: '03:10 AM',
    category: 'In-App Search',
    detail: 'why do I feel numb and overwhelmed',
    isNightBurst: true,
    isDistressSignal: true,
    baselineComparison: '+4th fragmented night session',
  });
  assert.equal(updated.riskScore, 91);
  assert.equal(updated.explainableSignals.nightSessionsCount, 5);
  assert.equal(updated.logs.length, 1);
});

test('calculateEpdsEvaluation computes 5-question validated score and severity', () => {
  const highRes = calculateEpdsEvaluation([2, 2, 2, 2, 2]);
  assert.equal(highRes.totalScore, 10);
  assert.equal(highRes.severity, 'high');

  const modRes = calculateEpdsEvaluation([1, 1, 2, 1, 1]);
  assert.equal(modRes.totalScore, 6);
  assert.equal(modRes.severity, 'moderate');

  const lowRes = calculateEpdsEvaluation([0, 1, 0, 0, 1]);
  assert.equal(lowRes.totalScore, 2);
  assert.equal(lowRes.severity, 'low');
});

test('generateSupportAnswerFallback returns structured multilingual AI answers for search queries', () => {
  const colicEn = generateSupportAnswerFallback('baby colic at 3am', 'en');
  assert.equal(colicEn.steps.length, 3);
  assert.ok(colicEn.summary.toLowerCase().includes('colic'));

  const numbHi = generateSupportAnswerFallback('why do I feel numb and overwhelmed', 'hi');
  assert.equal(numbHi.steps.length, 3);
  assert.ok(numbHi.summary.length > 20);

  const customKn = generateSupportAnswerFallback('newborn hiccups at night', 'kn');
  assert.equal(customKn.steps.length, 3);
  assert.ok(customKn.summary.includes('newborn hiccups at night'));
});

test('generateClinicCode, generateSystemUserId, and createNewDoctorProfile generate NM-DOC-XXXX and clinic codes', () => {
  const code = generateClinicCode('Dr. Rohan Deshmukh', 88);
  assert.equal(code, 'DR-ROH88');

  const sysId = generateSystemUserId('doctor', 1042);
  assert.equal(sysId, 'NM-DOC-1042');

  const tempPass = generateTempPassword(7391);
  assert.equal(tempPass, 'Nurture@7391');

  const doc = createNewDoctorProfile(
    {
      fullName: 'Dr. Rohan Deshmukh',
      email: 'dr.rohan@apollo.in',
      hospitalName: 'Apollo Cradle Maternity, Bengaluru',
      kmcRegistrationId: 'KMC-OBG-9921',
      specialization: 'OB-GYN',
    },
    88
  );
  assert.equal(doc.clinicCode, 'DR-ROH88');
  assert.ok(doc.systemId.startsWith('NM-DOC-'));
  assert.equal(doc.email, 'dr.rohan@apollo.in');
});

test('createNewMotherProfile assigns NM-MOM-XXXX Unique ID and links to doctor', () => {
  const doc = createNewDoctorProfile(
    {
      fullName: 'Dr. Kavitha Rao',
      email: 'kavitha.rao@manipal.edu',
      hospitalName: 'Cloudnine Bengaluru',
      kmcRegistrationId: 'OBG-KA-8821',
      specialization: 'OB-GYN',
    },
    88
  );
  const mother = createNewMotherProfile(
    {
      name: 'Nisha Shetty',
      email: 'nisha.shetty@gmail.com',
      babyName: 'Baby Ira',
      postpartumWeeks: 4,
      partnerName: 'Kiran Shetty',
      partnerPhone: '+91 98450 90112',
      initialBaselineNote: 'Healthy 4w postnatal discharge baseline',
    },
    doc
  );
  assert.equal(mother.name, 'Nisha Shetty');
  assert.ok(mother.hospitalId.startsWith('NM-MOM-'));
  assert.equal(mother.linkedDoctorId, doc.id);
  assert.equal(mother.doctorInviteCode, 'DR-KAV88');
});

test('verifyMotherCredentials and verifyDoctorCredentials strictly validate pre-seeded accounts and reject bad passwords', () => {
  const docById = verifyDoctorCredentials(initialDoctors, 'NM-DOC-1001', 'Doctor@123');
  assert.ok(docById);
  assert.equal(docById?.fullName, 'Dr. Kavitha Rao');

  const docByEmail = verifyDoctorCredentials(
    initialDoctors,
    'kavitha.rao@manipal.edu',
    'Doctor@123'
  );
  assert.ok(docByEmail);

  const docBadPass = verifyDoctorCredentials(initialDoctors, 'NM-DOC-1001', 'WrongPass');
  assert.equal(docBadPass, null);

  const mom1 = verifyMotherCredentials(initialMothers, 'NM-MOM-2001', 'Mother@123');
  assert.ok(mom1);
  assert.equal(mom1?.name, 'Ananya Sharma');

  const mom2 = verifyMotherCredentials(initialMothers, 'priya.nair@gmail.com', 'Mother@123');
  assert.ok(mom2);
  assert.equal(mom2?.name, 'Priya Nair');

  const mom3 = verifyMotherCredentials(initialMothers, 'NM-MOM-2003', 'Mother@123');
  assert.ok(mom3);
  assert.equal(mom3?.name, 'Sneha Kulkarni');

  assert.equal(verifyMotherCredentials(initialMothers, 'NM-MOM-2001', 'BadPass'), null);
  assert.equal(verifyMotherCredentials(initialMothers, 'NM-MOM-9999', 'Mother@123'), null);
});

test('parseSpokenCareLog and analyzeAcousticFatigue extract structured care telemetry across English, Hindi, and Kannada', () => {
  const enTranscript = 'Baby fed at 3:15 AM for 15 minutes... I woke up 4 times tonight and feel completely exhausted and overwhelmed.';
  const enParsed = parseSpokenCareLog(enTranscript, 'en-IN', '03:15 AM');
  assert.equal(enParsed.feedingDurationMins, 15);
  assert.equal(enParsed.nightWakeUps, 4);
  assert.equal(enParsed.moodScore, 1);
  assert.equal(enParsed.isDistressSignal, true);
  assert.equal(enParsed.acoustic.stressIndicator, 'Elevated');
  assert.ok(enParsed.acoustic.cadenceSummary.includes('slower cadence'));

  const hiTranscript = 'बच्चे ने सुबह 7 बजे 20 मिनट दूध पिया, आज मैं शांत और बेहतर महसूस कर रही हूँ।';
  const hiParsed = parseSpokenCareLog(hiTranscript, 'hi-IN', '08:15 AM');
  assert.equal(hiParsed.feedingDurationMins, 20);
  assert.equal(hiParsed.moodScore, 4);
  assert.equal(hiParsed.isDistressSignal, false);

  const knTranscript = 'ಮಗು ರಾತ್ರಿ 2:30 ಗಂಟೆಗೆ 15 ನಿಮಿಷ ಹಾಲು ಕುಡಿಯಿತು, ನನಗೆ ತುಂಬಾ ಸುಸ್ತಾಗಿದೆ.';
  const knParsed = parseSpokenCareLog(knTranscript, 'kn-IN', '02:30 AM');
  assert.equal(knParsed.feedingDurationMins, 15);
  assert.equal(knParsed.moodScore, 1);

  const acousticDirect = analyzeAcousticFatigue(enTranscript, '03:15 AM', 14);
  assert.equal(acousticDirect.stressIndicator, 'Elevated');
  assert.ok(acousticDirect.vocalFatiguePercent >= 18);
});

test('resolveAssignedDoctor and evaluateCommunitySafetyGuardian dynamically bind each mother to her exact assigned doctor', () => {
  const ananya = initialMothers.find((m) => m.id === 'ananya')!;
  const meera = initialMothers.find((m) => m.id === 'meera')!;

  const docAnanya = resolveAssignedDoctor(ananya, initialDoctors);
  assert.equal(docAnanya.fullName, 'Dr. Kavitha Rao');
  assert.equal(docAnanya.hospitalName, 'Cloudnine / Manipal Maternity Network, Bengaluru');

  const docMeera = resolveAssignedDoctor(meera, initialDoctors);
  assert.equal(docMeera.fullName, 'Dr. Aravind Hegde');
  assert.equal(docMeera.hospitalName, 'Manipal Hospital Perinatal Psychiatry, Bengaluru');

  const guardianAnanya = evaluateCommunitySafetyGuardian(
    "It is 3:20 AM, I have been crying nonstop and feel hopeless. I can't do this anymore.",
    ananya,
    initialDoctors
  );
  assert.equal(guardianAnanya.triggered, true);
  assert.equal(guardianAnanya.assignedDoctorName, 'Dr. Kavitha Rao');
  assert.ok(
    guardianAnanya.bannerMessage.includes(
      'Dr. Kavitha Rao at Cloudnine / Manipal Maternity Network, Bengaluru'
    )
  );

  const guardianMeera = evaluateCommunitySafetyGuardian(
    'Feeling completely overwhelmed and crying nonstop tonight.',
    meera,
    initialDoctors
  );
  assert.equal(guardianMeera.triggered, true);
  assert.equal(guardianMeera.assignedDoctorName, 'Dr. Aravind Hegde');
  assert.ok(
    guardianMeera.bannerMessage.includes(
      'Dr. Aravind Hegde at Manipal Hospital Perinatal Psychiatry, Bengaluru'
    )
  );
});

test('toRelationalDoctorRow and toRelationalMotherRow produce valid Supabase relational rows', () => {
  const docRow = toRelationalDoctorRow(initialDoctors[0]);
  assert.equal(docRow.id, 'doc-kavitha');
  assert.equal(docRow.clinic_code, 'DR-KAV88');

  const momRow = toRelationalMotherRow(initialMothers[0]);
  assert.equal(momRow.id, 'ananya');
  assert.equal(momRow.doctor_id, 'doc-kavitha');
  assert.equal(momRow.risk_level, 'high');
});

test('formatAbhaId, parseWhatsAppVoiceOrTextCommand, buildWhatsAppDeepLink, createSupportTicketRecord, and buildHl7FhirR4Bundle support ABDM & WhatsApp Bot telemetry', () => {
  const formattedAbha = formatAbhaId('91482931048821');
  assert.equal(formattedAbha, '91-4829-3104-8821');
  assert.equal(formatAbhaAddress('Ananya Sharma'), 'ananya.sharma@abdm');

  const waParsed = parseWhatsAppVoiceOrTextCommand(
    '🎙️ [0:12 Voice Note] Baby fed at 3:10 AM, woke up 3 times, feeling very exhausted and anxious'
  );
  assert.equal(waParsed.feeding, '3:10 AM');
  assert.equal(waParsed.wakeups, 3);
  assert.equal(waParsed.mood, 2);
  assert.equal(waParsed.isNightBurst, true);
  assert.equal(waParsed.isDistress, true);

  const customChatParsed = parseWhatsAppVoiceOrTextCommand(
    'Baby fed for 20 mins at 2 AM, woke up 3 times, I feel very anxious and tired'
  );
  assert.equal(customChatParsed.feeding, '2:00 AM');
  assert.equal(customChatParsed.durationMins, 20);
  assert.equal(customChatParsed.wakeups, 3);
  assert.equal(customChatParsed.mood, 2);
  assert.equal(customChatParsed.isNightBurst, true);

  const deepLink = buildWhatsAppDeepLink('+91 98450 71234', 'Hello NurtureMind');
  assert.equal(deepLink, 'https://wa.me/919845071234?text=Hello%20NurtureMind');

  const ticket = createSupportTicketRecord(
    {
      name: 'Ananya Sharma',
      registeredIdOrEmail: 'NM-MOM-2001',
      urgency: 'High — Priority Clinical Callback',
      message: 'Need lactation and sleep support callback',
      assignedDoctorName: 'Dr. Kavitha Rao',
      hospitalName: 'Cloudnine / Manipal Maternity Network, Bengaluru',
    },
    1024
  );
  assert.ok(ticket.receiptId.startsWith('NM-TKT-'));
  assert.equal(ticket.assignedDoctorName, 'Dr. Kavitha Rao');

  const ananya = initialMothers[0];
  const doc = initialDoctors[0];
  const fhirBundle = buildHl7FhirR4Bundle(ananya, doc);
  assert.equal(fhirBundle.resourceType, 'Bundle');
  assert.equal(fhirBundle.type, 'collection');
  const resourceTypes = fhirBundle.entry.map((e) => String(e.resource.resourceType));
  assert.deepEqual(resourceTypes, [
    'Patient',
    'Observation',
    'QuestionnaireResponse',
    'CarePlan',
  ]);
});




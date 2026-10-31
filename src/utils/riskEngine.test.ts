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
  type MotherProfile,
} from './riskEngine.ts';
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
  // Valid Doctor login by Unique ID and by Email
  const docById = verifyDoctorCredentials(initialDoctors, 'NM-DOC-1001', 'Doctor@123');
  assert.ok(docById);
  assert.equal(docById?.fullName, 'Dr. Kavitha Rao');

  const docByEmail = verifyDoctorCredentials(
    initialDoctors,
    'kavitha.rao@manipal.edu',
    'Doctor@123'
  );
  assert.ok(docByEmail);

  // Reject wrong password for Doctor
  const docBadPass = verifyDoctorCredentials(initialDoctors, 'NM-DOC-1001', 'WrongPass');
  assert.equal(docBadPass, null);

  // Valid Mother 1, 2, 3 logins by NM-MOM-XXXX and Email
  const mom1 = verifyMotherCredentials(initialMothers, 'NM-MOM-2001', 'Mother@123');
  assert.ok(mom1);
  assert.equal(mom1?.name, 'Ananya Sharma');

  const mom2 = verifyMotherCredentials(initialMothers, 'priya.nair@gmail.com', 'Mother@123');
  assert.ok(mom2);
  assert.equal(mom2?.name, 'Priya Nair');

  const mom3 = verifyMotherCredentials(initialMothers, 'NM-MOM-2003', 'Mother@123');
  assert.ok(mom3);
  assert.equal(mom3?.name, 'Sneha Kulkarni');

  // Reject wrong password or unknown ID
  assert.equal(verifyMotherCredentials(initialMothers, 'NM-MOM-2001', 'BadPass'), null);
  assert.equal(verifyMotherCredentials(initialMothers, 'NM-MOM-9999', 'Mother@123'), null);
});

export type LanguageCode = 'en' | 'hi' | 'kn';

export interface TranslationDictionary {
  // Brand & Top Navbar
  brandName: string;
  brandSubtitle: string;
  navGateway: string;
  navAbout: string;
  navPrivacy: string;
  clinicalSafetyBanner: string;

  // Step 1 & Step 2 Login Workflow (Matching User Sketch)
  gatewayKicker: string;
  gatewayHeadline: string;
  gatewaySubheadline: string;
  chooseLoginPrompt: string;
  motherLoginBtn: string;
  doctorLoginBtn: string;
  motherLoginTitle: string;
  motherLoginSubtitle: string;
  doctorLoginTitle: string;
  doctorLoginSubtitle: string;
  loginIdLabel: string;
  loginIdPlaceholderMother: string;
  loginIdPlaceholderDoctor: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginSubmitBtn: string;
  backToRoleSelectBtn: string;
  loginErrorEmpty: string;
  selectMotherAccountLabel: string;

  // Mother Profiles (No "Demo" wording)
  motherAnanyaDesc: string;
  motherPriyaDesc: string;
  motherSnehaDesc: string;
  doctorCredsName: string;
  doctorCredsRole: string;

  // Mother Portal Header & Tabs
  switchUserLogout: string;
  weeksOld: string;
  weeksPostpartum: string;
  motherTabA: string;
  motherTabB: string;
  motherTabC: string;
  motherTabD: string;

  // Mother Tab A: Daily Baby Care & 10-Second Check-In
  tabATitle: string;
  tabASubtitle: string;
  logFeedingTitle: string;
  feedTypeBreast: string;
  feedTypeBottle: string;
  feedTimeLabel: string;
  feedDurationLabel: string;
  feedMarkRepeatedEdit: string;
  logFeedingBtn: string;
  logSleepTitle: string;
  sleepWakeTimeLabel: string;
  sleepDurationLabel: string;
  sleepFragmentedLabel: string;
  logSleepBtn: string;
  inAppSearchTitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  searchQuickChipsLabel: string;
  chipColic3am: string;
  chipNumbOverwhelmed: string;
  chipNormalSchedule: string;
  moodCheckInTitle: string;
  moodPeaceful: string;
  moodSteady: string;
  moodTired: string;
  moodAnxious: string;
  moodOverwhelmed: string;
  activityLogTitle: string;
  activityLogSubtitle: string;
  colTime: string;
  colCategory: string;
  colDetail: string;
  colBaselineShift: string;
  nightBurstTag: string;
  normalWindowTag: string;

  // Mother Tab B: My Wellbeing & Explainable Insights
  tabBTitle: string;
  tabBSubtitle: string;
  chart14dTitle: string;
  chart14dSubtitle: string;
  legendBaseline: string;
  legendCurrentWeek: string;
  whyCheckInTitle: string;
  whyCheckInSubtitle: string;
  signalNightSessions: string;
  signalMissedMood: string;
  signalRepeatedEdits: string;
  geminiCompanionTitle: string;
  geminiCompanionBadge: string;
  listenVoiceBtn: string;
  stopVoiceBtn: string;
  refreshAiBtn: string;
  geminiCompanionAnanya: string;
  geminiCompanionPriya: string;
  geminiCompanionSneha: string;
  nextStepsHeading: string;
  step1Breathing: string;
  step2NudgePartner: string;
  step3EpdsCheck: string;
  step4RequestCall: string;
  breathingModalTitle: string;
  breathingInhale: string;
  breathingHold: string;
  breathingExhale: string;
  partnerNudgeSentToast: string;
  careCallRequestedToast: string;

  // Mother Tab C: Validated EPDS / PHQ-9 Self-Screening
  tabCTitle: string;
  tabCSubtitle: string;
  epdsDoctorPromptBanner: string;
  epdsQ1: string;
  epdsQ2: string;
  epdsQ3: string;
  epdsQ4: string;
  epdsQ5: string;
  epdsOpt0: string;
  epdsOpt1: string;
  epdsOpt2: string;
  epdsOpt3: string;
  submitEpdsBtn: string;
  resetEpdsBtn: string;
  epdsResultHeading: string;
  epdsRecLow: string;
  epdsRecModerate: string;
  epdsRecHigh: string;
  routeToDoctorBtn: string;
  routedSuccessMsg: string;

  // Mother Tab D: Privacy & Consent Center
  tabDTitle: string;
  tabDSubtitle: string;
  consentToggle1Title: string;
  consentToggle1Desc: string;
  consentToggle2Title: string;
  consentToggle2Desc: string;
  consentToggle3Title: string;
  consentToggle3Desc: string;
  statusActive: string;
  statusPaused: string;
  previewWhatsappBtn: string;
  whatsappModalTitle: string;
  whatsappPrivacyGuarantee: string;
  whatsappPartnerMessage: string;
  closeModalBtn: string;

  // Doctor Portal Header & Tabs
  doctorSwitchViewBtn: string;
  doctorWorkspaceTitle: string;
  doctorWorkspaceSubtitle: string;
  docTabA: string;
  docTabB: string;
  docTabC: string;

  // Doctor Tab A: Prioritized Maternal Follow-Up Queue
  docQueueTitle: string;
  docQueueSubtitle: string;
  filterAll: string;
  filterHigh: string;
  filterModerate: string;
  filterLow: string;
  searchPatientPlaceholder: string;
  thMotherProfile: string;
  thConsentStatus: string;
  thRiskSignal: string;
  thBaselineDev: string;
  thTopDrivers: string;
  thFollowUpStatus: string;
  thAction: string;
  consentVerifiedBadge: string;
  consentPausedBadge: string;
  riskHighLabel: string;
  riskModLabel: string;
  riskLowLabel: string;
  inspectBtn: string;

  // Top Explainable Drivers
  driverAnanya: string;
  driverPriya: string;
  driverSneha: string;
  driverDivya: string;
  driverMeera: string;
  driverFarah: string;

  // Doctor Tab B: Deep-Dive Patient Explainability & SHAP Attribution Inspector
  shapTitle: string;
  shapSubtitle: string;
  shapFeature1: string;
  shapFeature2: string;
  shapFeature3: string;
  shapFeature4: string;
  shapFeature5: string;
  trajectoryTitle: string;
  trajectorySubtitle: string;
  soapNoteTitle: string;
  soapNoteSubtitle: string;
  soapAnanya: string;
  soapPriya: string;
  soapSneha: string;
  soapDivya: string;
  soapMeera: string;
  soapFarah: string;

  // Doctor Tab C: Human-in-the-Loop Escalation & WhatsApp Routing Center
  escalationTitle: string;
  escalationSubtitle: string;
  action1TriggerWhatsapp: string;
  action1Desc: string;
  action2SendEpds: string;
  action2Desc: string;
  action3AssignCounsellor: string;
  action3Desc: string;
  clinicalNoteInputPlaceholder: string;
  clinicalLogHistoryTitle: string;

  // Top Nav Info Views (About What This App Is All About & Privacy)
  aboutModalTitle: string;
  aboutIntroText: string;
  aboutStep1Title: string;
  aboutStep1Desc: string;
  aboutStep2Title: string;
  aboutStep2Desc: string;
  aboutStep3Title: string;
  aboutStep3Desc: string;
  b2b2cModelTitle: string;
  b2b2cModelDesc: string;
  privacyModalTitle: string;
  privacyPillar1Title: string;
  privacyPillar1Desc: string;
  privacyPillar2Title: string;
  privacyPillar2Desc: string;
  privacyPillar3Title: string;
  privacyPillar3Desc: string;
  backToGatewayBtn: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brandName: 'NurtureMind AI',
    brandSubtitle: 'Consent-First Postpartum Support',
    navGateway: 'Home',
    navAbout: 'About',
    navPrivacy: 'Privacy & Ethics',
    clinicalSafetyBanner:
      'Clinical Framing: NurtureMind AI detects behavioural risk patterns from consented usage; it does NOT diagnose postpartum depression. Human-in-the-loop required.',

    gatewayKicker: 'Perinatal Behavioural Early-Warning System',
    gatewayHeadline:
      'Early, explainable risk signals from consented newborn-care behaviour — so support can reach mothers sooner.',
    gatewaySubheadline:
      'Choose your portal below to sign in to the Mother Companion Workspace or the Doctor Clinical Portal.',
    chooseLoginPrompt: 'Select Portal to Continue',
    motherLoginBtn: 'Mother Login',
    doctorLoginBtn: 'Doctor Login',
    motherLoginTitle: 'Mother Login',
    motherLoginSubtitle:
      'Sign in with your Hospital Maternal ID and password to access your daily baby-care logger and wellbeing companion.',
    doctorLoginTitle: 'Doctor Login',
    doctorLoginSubtitle:
      'Sign in with your Clinician ID and password to access the prioritized maternal follow-up queue and SHAP explainability console.',
    loginIdLabel: 'Login ID',
    loginIdPlaceholderMother: 'Enter Maternal ID (e.g. CN-BLR-4092)',
    loginIdPlaceholderDoctor: 'Enter Clinician ID (e.g. OBG-KA-8821)',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    loginSubmitBtn: 'Login →',
    backToRoleSelectBtn: '← Back',
    loginErrorEmpty: 'Please enter both your Login ID and Password to continue.',
    selectMotherAccountLabel: 'Registered Mother Account',

    motherAnanyaDesc: 'Ananya Sharma (28 yrs, Bengaluru — 6 weeks postpartum)',
    motherPriyaDesc: 'Priya Nair (31 yrs, Mysuru — 4 weeks postpartum)',
    motherSnehaDesc: 'Sneha Kulkarni (26 yrs, Hubballi — 9 weeks postpartum)',
    doctorCredsName: 'Dr. Kavitha Rao, MD (OB-GYN)',
    doctorCredsRole:
      'Senior OB-GYN & Perinatal Mental Health Specialist • Cloudnine / Manipal Maternity Network, Bengaluru',

    switchUserLogout: 'Logout',
    weeksOld: 'Weeks Old',
    weeksPostpartum: 'Weeks Postpartum',
    motherTabA: 'Daily Baby Care & Check-In',
    motherTabB: 'Wellbeing & Explainable Insights',
    motherTabC: 'Validated EPDS Self-Screening',
    motherTabD: 'Privacy & Consent Center',

    tabATitle: 'Daily Baby Care & 10-Second Check-In',
    tabASubtitle:
      'Every log updates your timeline and personal rhythm comparison in real time.',
    logFeedingTitle: 'Log Baby Feeding',
    feedTypeBreast: 'Breastfeeding',
    feedTypeBottle: 'Bottle / Formula',
    feedTimeLabel: 'Time of Feeding',
    feedDurationLabel: 'Duration (mins)',
    feedMarkRepeatedEdit: 'Include log correction / repeated edit',
    logFeedingBtn: 'Save Feeding Log',
    logSleepTitle: 'Log Baby Sleep & Night Wake-up',
    sleepWakeTimeLabel: 'Wake-up Timestamp',
    sleepDurationLabel: 'Sleep Stretch (hrs)',
    sleepFragmentedLabel: 'Fragmented 1 AM – 4 AM night wake-up burst',
    logSleepBtn: 'Save Sleep Log',
    inAppSearchTitle: 'In-App Support Search',
    searchPlaceholder: 'Search newborn care or how you are feeling...',
    searchBtn: 'Log Search',
    searchQuickChipsLabel: 'Common postpartum searches:',
    chipColic3am: 'baby colic at 3am',
    chipNumbOverwhelmed: 'why do I feel numb and overwhelmed',
    chipNormalSchedule: 'normal feeding schedule',
    moodCheckInTitle: '10-Second Voluntary Emoji Mood Check-In',
    moodPeaceful: 'Peaceful',
    moodSteady: 'Steady',
    moodTired: 'Exhausted',
    moodAnxious: 'Anxious',
    moodOverwhelmed: 'Overwhelmed',
    activityLogTitle: 'Structured Chronological Activity Log',
    activityLogSubtitle:
      'Real-time event stream comparing late-night fragmented bursts against your Weeks 1–4 baseline.',
    colTime: 'Timestamp',
    colCategory: 'Activity Type',
    colDetail: 'Logged Detail',
    colBaselineShift: 'Personal Baseline Comparison',
    nightBurstTag: '1–4 AM Fragmented Burst',
    normalWindowTag: 'Within Routine Rhythm',

    tabBTitle: 'My Wellbeing & Explainable Insights',
    tabBSubtitle:
      'Transparent, non-judgmental comparison of your current week against your own Weeks 1–4 personal baseline.',
    chart14dTitle: '14-Day Personal Baseline Comparison Chart',
    chart14dSubtitle:
      'Comparing your Weeks 1–4 Personal Baseline rhythm against your Last 7 Days rolling behavioural pattern.',
    legendBaseline: 'Weeks 1–4 Personal Baseline',
    legendCurrentWeek: 'Current Rolling Pattern',
    whyCheckInTitle: 'Why am I seeing this gentle check-in?',
    whyCheckInSubtitle:
      'We only compare your rhythm to your own earlier baseline — never against rigid rules or other mothers:',
    signalNightSessions:
      'late-night fragmented app sessions between 1 AM – 4 AM compared to your usual',
    signalMissedMood: 'missed voluntary mood check-ins over the past 5 days',
    signalRepeatedEdits:
      'repeated feeding log edits indicating possible sleep exhaustion',
    geminiCompanionTitle: 'Gemini Empathetic Companion',
    geminiCompanionBadge: 'Supportive Non-Diagnostic Guidance',
    listenVoiceBtn: 'Play Voice Guidance',
    stopVoiceBtn: 'Stop Voice',
    refreshAiBtn: 'Refresh Personalized Reflection',
    geminiCompanionAnanya:
      'Dear Ananya, caring for Baby Aarav through four fragmented wake-ups between 1 AM and 4 AM takes an immense physical and emotional toll. Feeling numb or overwhelmed at 3 AM does not mean you are failing — it means your body and mind have been carrying too much without unbroken rest. Let us take one gentle step together right now.',
    geminiCompanionPriya:
      'Dear Priya, we noticed your night-time sleep stretches in Mysuru have become slightly more interrupted this week compared to your first three weeks. You are doing a wonderful job responding to Baby Dev. Consider sharing one early-morning feeding window with your partner so you can get a continuous 4-hour rest block.',
    geminiCompanionSneha:
      'Dear Sneha, your daily care rhythm in Hubballi with Baby Sia remains steady and well-rested against your personal baseline. Keep honouring your rest windows and continue checking in whenever you feel like sharing.',
    nextStepsHeading: 'Actionable Next Steps (Your Choice)',
    step1Breathing: '1) Try a 3-minute guided breathing reset',
    step2NudgePartner: '2) Send a gentle nudge to husband/partner',
    step3EpdsCheck: '3) Take the 2-minute validated EPDS Self-Check',
    step4RequestCall: '4) Request a warm call from Care Coordinator',
    breathingModalTitle: '3-Minute Guided Breathing Reset',
    breathingInhale: 'Inhale gently through your nose (4s)...',
    breathingHold: 'Hold softly and relax your shoulders (4s)...',
    breathingExhale: 'Exhale slowly through your mouth (6s)...',
    partnerNudgeSentToast:
      'Gentle WhatsApp nudge sent to your partner (no private search or mood logs shared).',
    careCallRequestedToast:
      'Warm outreach request shared with Dr. Kavitha Rao’s Perinatal Care Coordinator.',

    tabCTitle: 'Validated EPDS / PHQ-9 Self-Screening & Support Routing',
    tabCSubtitle:
      'A brief 5-item validated screening tool to help you and Dr. Kavitha Rao’s care team understand how you have felt over the past 7 days.',
    epdsDoctorPromptBanner:
      'Dr. Kavitha Rao’s care team sent a gentle invitation to complete this 2-minute check-in.',
    epdsQ1: '1. In the past 7 days, I have been able to laugh and see the funny side of things:',
    epdsQ2: '2. I have felt anxious or worried for no good reason:',
    epdsQ3: '3. I have been so unhappy that I have had difficulty sleeping (even when the baby sleeps):',
    epdsQ4: '4. Things have been getting on top of me and I have felt overwhelmed:',
    epdsQ5: '5. I have felt sad, numb, or miserable during the night or day:',
    epdsOpt0: '0 — As much as I always could / Not at all',
    epdsOpt1: '1 — Not quite so much / Only occasionally',
    epdsOpt2: '2 — Definitely not so much / Yes, quite often',
    epdsOpt3: '3 — Not at all / Yes, most of the time',
    submitEpdsBtn: 'Calculate Validated Score & Route Safely',
    resetEpdsBtn: 'Retake Screening',
    epdsResultHeading: 'Validated Self-Screening Summary',
    epdsRecLow:
      'Your responses indicate a low distress score right now. Continue resting and using gentle self-care check-ins.',
    epdsRecModerate:
      'Your score shows moderate emotional strain and fatigue. We recommend a warm check-in call with a perinatal counsellor.',
    epdsRecHigh:
      'Your score indicates significant emotional exhaustion. With your consent, we recommend routing this summary to Dr. Kavitha Rao’s perinatal team for priority human support.',
    routeToDoctorBtn: 'Share Score with Dr. Kavitha Rao’s Care Team',
    routedSuccessMsg:
      'Synchronized live with Dr. Kavitha Rao’s Clinical Queue.',

    tabDTitle: 'Privacy & Consent Center (Privacy-by-Design)',
    tabDSubtitle:
      'You are in 100% control of your data. Toggle any permission at any time with immediate effect.',
    consentToggle1Title: 'Consented Newborn-Care Behavioural Signal Analysis',
    consentToggle1Desc:
      'Allows NurtureMind AI to compare your app usage timing (like 1 AM–4 AM fragmented bursts) against your personal baseline.',
    consentToggle2Title: 'Partner Gentle WhatsApp Nudges',
    consentToggle2Desc:
      'Shares a warm, supportive nudge ONLY — never exposes your private search queries, raw feeding logs, or clinical scores.',
    consentToggle3Title: 'Clinician Escalation Opt-In for High-Risk Shifts',
    consentToggle3Desc:
      'Allows Dr. Kavitha Rao’s care team to view your explainable risk shift and reach out when sustained deviations occur.',
    statusActive: 'ON • Explicit Opt-In',
    statusPaused: 'OFF • Paused',
    previewWhatsappBtn: 'Preview What My Partner Sees on WhatsApp',
    whatsappModalTitle: 'Partner WhatsApp Preview (Sent to Husband / Partner)',
    whatsappPrivacyGuarantee:
      'Privacy Guarantee: Zero private search text ("feeling numb"), zero clinical labels, and zero EPDS scores are ever included.',
    whatsappPartnerMessage:
      'Hi Rohan, NurtureMind Companion noticed Ananya has had 4 interrupted late-night baby-care stretches between 1 AM and 4 AM this week. A small gesture today—like taking over the 6 AM burping/soothing window, bringing her warm water, or letting her sleep an unbroken 3-hour stretch—can make a huge difference. Thank you for being her anchor!',
    closeModalBtn: 'Close Preview',

    doctorSwitchViewBtn: 'Logout',
    doctorWorkspaceTitle: 'Hospital Perinatal Triage & Explainability Console',
    doctorWorkspaceSubtitle:
      'Cloudnine / Manipal Maternity Network • Human-in-the-Loop Behavioural Risk Triage',
    docTabA: 'Prioritized Maternal Follow-Up Queue',
    docTabB: 'Patient Explainability & SHAP Inspector',
    docTabC: 'Escalation & WhatsApp Routing Center',

    docQueueTitle: 'Prioritized Maternal Follow-Up Queue (Karnataka Cohort)',
    docQueueSubtitle:
      'Consented postpartum mothers ranked by personal baseline deviation and explainable behavioural drivers.',
    filterAll: 'All Mothers (6)',
    filterHigh: 'High Risk Shift',
    filterModerate: 'Moderate Shift',
    filterLow: 'Healthy Baseline',
    searchPatientPlaceholder: 'Filter by mother name, city, or Hospital ID...',
    thMotherProfile: 'Mother, Age, Postpartum Week & ID',
    thConsentStatus: 'Consent Status',
    thRiskSignal: 'Risk Signal Level',
    thBaselineDev: 'Baseline Deviation %',
    thTopDrivers: 'Top Explainable Drivers',
    thFollowUpStatus: 'Follow-Up Status',
    thAction: 'Clinical Action',
    consentVerifiedBadge: 'Explicit Opt-In Verified',
    consentPausedBadge: 'Consent Paused by Mother',
    riskHighLabel: 'High Risk',
    riskModLabel: 'Moderate Risk',
    riskLowLabel: 'Low Baseline',
    inspectBtn: 'Inspect SHAP & Triage →',

    driverAnanya: 'Night-time fragmented bursts + Distress search intent',
    driverPriya: 'Missed mood check-ins + Repeated feeding log edits',
    driverSneha: 'Consistent sleep stretches + Steady baseline rhythm',
    driverDivya: '3 AM fragmented app sessions + Caregiver-share drop',
    driverMeera: 'Moderate night wake-up increase + Delayed log entries',
    driverFarah: 'Balanced partner co-logging + Regular rest windows',

    shapTitle: 'Deep-Dive Patient Explainability & SHAP Attribution Inspector',
    shapSubtitle:
      'XGBoost / scikit-learn Feature Attribution Weights explaining why this mother’s behavioural pattern deviated from her Weeks 1–4 baseline.',
    shapFeature1: '1. Night-time App Bursts / Fragmented Sessions',
    shapFeature2: '2. Distress-Oriented Search Intent',
    shapFeature3: '3. Missed Reminders & Repeated Log Edits',
    shapFeature4: '4. Reduced Voluntary Mood Check-ins',
    shapFeature5: '5. Caregiver-Share Inactivity',
    trajectoryTitle: '7-Day Rolling Risk Trajectory vs. Personal Baseline',
    trajectorySubtitle:
      'Continuous longitudinal comparison showing divergence from the mother’s individual Weeks 1–4 baseline.',
    soapNoteTitle: 'Gemini Clinical Summary Note (SOAP Format)',
    soapNoteSubtitle:
      'Prepared for OB-GYN & Perinatal Mental Health Counsellor — Non-diagnostic decision support.',
    soapAnanya:
      'S (Subjective / Behavioural Proxy): 28yo mother (6w postpartum, Bengaluru) exhibits +64% deviation above her Weeks 1–4 personal baseline, with distress-oriented late-night search activity at 02:15 AM and 03:40 AM.\nO (Objective Telemetry): 4 fragmented night-time app bursts (1 AM–4 AM) vs usual 1; 3 missed voluntary mood check-ins; 2 repeated feeding log edits.\nA (Assessment Framing): High behavioural fatigue and emotional strain signal (82/100). Not a standalone clinical diagnosis of PPD; warrants human-in-the-loop screening.\nP (Plan): 1) Trigger consented supportive WhatsApp nudge to partner Rohan Sharma, 2) Dispatch validated EPDS self-check to Mother Portal, 3) Schedule warm outreach call by Perinatal Counsellor within 24 hours.',
    soapPriya:
      'S: 31yo mother (4w postpartum, Mysuru) shows +34% shift from baseline with rising night-time feeding edits.\nO: Risk signal 56/100 (Moderate). 2 night bursts between 1 AM–4 AM; 2 missed mood logs.\nA: Moderate sleep fragmentation and caregiver fatigue. Early supportive intervention can prevent escalation.\nP: Send partner co-care WhatsApp nudge and prompt optional EPDS check-in at Week 5.',
    soapSneha:
      'S: 26yo mother (9w postpartum, Hubballi) maintaining steady newborn care rhythm.\nO: Risk signal 18/100 (+4% baseline variance). Consistent partner co-logging and regular sleep stretches.\nA: Healthy baseline adherence.\nP: Continue routine postpartum wellness support.',
    soapDivya:
      'S: 29yo mother (5w postpartum, Mangaluru) showing acute late-night app fragmentation (+58% deviation).\nO: Risk signal 76/100 (High). Elevated night bursts and reduced partner app sync.\nA: Significant nocturnal exhaustion pattern requiring clinician review.\nP: Initiate counsellor outreach and partner WhatsApp support nudge.',
    soapMeera:
      'S: 33yo mother (7w postpartum, Belagavi) experiencing moderate sleep disruption (+29% deviation).\nO: Risk signal 49/100 (Moderate). Occasional repeated feeding edits.\nA: Mild-to-moderate maternal fatigue.\nP: Recommend guided rest check-in and routine follow-up.',
    soapFarah:
      'S: 27yo mother (8w postpartum, Kalaburagi) with stable diurnal logging pattern.\nO: Risk signal 22/100 (+6% deviation). Active family support and regular mood check-ins.\nA: Low risk, stable postpartum adaptation.\nP: Standard 10-week wellness follow-up.',

    escalationTitle: 'Human-in-the-Loop Escalation & WhatsApp Routing Center',
    escalationSubtitle:
      'Execute consented, non-stigmatizing clinical and family support actions that sync immediately with the Mother’s Companion App.',
    action1TriggerWhatsapp: 'Trigger Consented Partner WhatsApp Nudge',
    action1Desc:
      'Sends a warm, practical caregiving prompt to husband/partner in English, Hindi, or Kannada without disclosing clinical data.',
    action2SendEpds: 'Send Validated EPDS Screening Link to Mother’s App',
    action2Desc:
      'Highlights the 2-minute EPDS self-screening card inside the Mother Portal for voluntary completion.',
    action3AssignCounsellor: 'Assign Perinatal Counsellor Follow-Up Call & Log Clinical Note',
    action3Desc:
      'Updates the patient’s queue status to "In Care Pathway" with a verified clinician timestamp.',
    clinicalNoteInputPlaceholder:
      'Enter clinician observation or counsellor handoff note (e.g., "Spoke with mother; scheduled Friday tele-counselling")...',
    clinicalLogHistoryTitle: 'Audit Trail & Clinical Care Pathway Notes',

    aboutModalTitle: 'What NurtureMind AI Is All About',
    aboutIntroText:
      'During the first weeks after childbirth, mothers often experience extreme sleep fragmentation and emotional exhaustion in silence between routine hospital visits. NurtureMind AI bridges this postpartum care gap by turning everyday newborn-care logs (feeding, sleep wake-ups, and 10-second check-ins) into early, explainable wellbeing signals — with 100% mother consent.',
    aboutStep1Title: '01. Everyday Baby Care Without Extra Burden',
    aboutStep1Desc:
      'Mothers use NurtureMind AI as a warm, multilingual daily companion to log baby feedings, sleep stretches, and questions at 2 AM — with voice guidance in English, Hindi, and Kannada.',
    aboutStep2Title: '02. Explainable Personal Baseline Comparison',
    aboutStep2Desc:
      'Instead of comparing a mother to rigid rules, NurtureMind AI compares her current week against her own Weeks 1–4 personal baseline, clearly explaining shifts like 1–4 AM fragmented sessions or missed check-ins.',
    aboutStep3Title: '03. Timely Family & Doctor Support',
    aboutStep3Desc:
      'When exhaustion builds up, mothers can trigger a gentle WhatsApp nudge to their partner for practical help (without sharing private logs) or connect directly with their OB-GYN and perinatal counsellor.',
    b2b2cModelTitle: 'How Mothers, Families & Hospitals Connect',
    b2b2cModelDesc:
      'Mothers receive continuous, non-judgmental companionship at home while their consented care team can prioritize timely, human-in-the-loop check-ins before distress escalates.',
    privacyModalTitle: 'Privacy-by-Design & Clinical Ethics',
    privacyPillar1Title: 'Not a Standalone Diagnostic Device',
    privacyPillar1Desc:
      'NurtureMind AI never labels a mother as having postpartum depression. It surfaces explainable behavioural risk shifts so qualified clinicians and counsellors can prioritize timely human outreach.',
    privacyPillar2Title: 'Strict Partner Confidentiality Boundary',
    privacyPillar2Desc:
      'Partner WhatsApp nudges suggest practical help (taking the 6 AM soothing shift or bringing warm meals) and NEVER expose private search text, mood logs, or clinical risk scores.',
    privacyPillar3Title: 'Granular Revocable Consent (DPDP Act 2023 Aligned)',
    privacyPillar3Desc:
      'Every mother can pause behavioural analysis, partner nudges, or clinician escalation independently with a single tap.',
    backToGatewayBtn: '← Back to Home',
  },

  hi: {
    brandName: 'नर्चरमाइंड एआई (NurtureMind AI)',
    brandSubtitle: 'सहमति-प्रथम प्रसवोत्तर सहायता',
    navGateway: 'होम',
    navAbout: 'परिचय (About)',
    navPrivacy: 'गोपनीयता और नैतिकता',
    clinicalSafetyBanner:
      'क्लिनिकल फ्रेमिंग: नर्चरमाइंड एआई सहमति से प्राप्त नवजात-देखभाल व्यवहार से जोखिम संकेतों की पहचान करता है; यह प्रसवोत्तर अवसाद (PPD) का निदान नहीं करता है। मानवीय डॉक्टर की समीक्षा आवश्यक है।',

    gatewayKicker: 'मातृ व्यवहारिक प्रारंभिक-चेतावनी प्रणाली',
    gatewayHeadline:
      'सहमति-आधारित नवजात देखभाल व्यवहार से प्रारंभिक, स्पष्ट जोखिम संकेत — ताकि माताओं तक सहायता समय पर पहुँच सके।',
    gatewaySubheadline:
      'माता के दैनिक साथी पोर्टल या डॉक्टर के क्लिनिकल पोर्टल में साइन इन करने के लिए नीचे अपना पोर्टल चुनें।',
    chooseLoginPrompt: 'आगे बढ़ने के लिए लॉगिन पोर्टल चुनें',
    motherLoginBtn: 'माता लॉगिन (Mother Login)',
    doctorLoginBtn: 'डॉक्टर लॉगिन (Doctor Login)',
    motherLoginTitle: 'माता लॉगिन (Mother Login)',
    motherLoginSubtitle:
      'अपने दैनिक शिशु-देखभाल लॉगर और स्वास्थ्य साथी तक पहुँचने के लिए अपनी लॉगिन आईडी और पासवर्ड दर्ज करें।',
    doctorLoginTitle: 'डॉक्टर लॉगिन (Doctor Login)',
    doctorLoginSubtitle:
      'मातृ फॉलो-अप कतार और SHAP व्याख्या कंसोल तक पहुँचने के लिए अपनी क्लिनिशियन आईडी और पासवर्ड दर्ज करें।',
    loginIdLabel: 'लॉगिन आईडी (Login ID)',
    loginIdPlaceholderMother: 'मातृ आईडी दर्ज करें (उदा. CN-BLR-4092)',
    loginIdPlaceholderDoctor: 'डॉक्टर आईडी दर्ज करें (उदा. OBG-KA-8821)',
    passwordLabel: 'पासवर्ड (Password)',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    loginSubmitBtn: 'लॉगिन करें →',
    backToRoleSelectBtn: '← वापस जाएँ',
    loginErrorEmpty: 'कृपया आगे बढ़ने के लिए लॉगिन आईडी और पासवर्ड दोनों दर्ज करें।',
    selectMotherAccountLabel: 'पंजीकृत माता खाता',

    motherAnanyaDesc: 'अनन्या शर्मा (28 वर्ष, बेंगलुरु — 6 सप्ताह प्रसवोत्तर)',
    motherPriyaDesc: 'प्रिया नायर (31 वर्ष, मैसूरु — 4 सप्ताह प्रसवोत्तर)',
    motherSnehaDesc: 'स्नेहा कुलकर्णी (26 वर्ष, हुबली — 9 सप्ताह प्रसवोत्तर)',
    doctorCredsName: 'डॉ. कविता राव, MD (OB-GYN)',
    doctorCredsRole:
      'वरिष्ठ प्रसूति एवं मातृ मानसिक स्वास्थ्य विशेषज्ञ • क्लाउडनाइन / मणिपाल मैटरनिटी नेटवर्क, बेंगलुरु',

    switchUserLogout: 'लॉगआउट',
    weeksOld: 'सप्ताह का शिशु',
    weeksPostpartum: 'सप्ताह प्रसवोत्तर',
    motherTabA: 'दैनिक शिशु देखभाल और चेक-इन',
    motherTabB: 'मेरा स्वास्थ्य और स्पष्ट अंतर्दृष्टि',
    motherTabC: 'प्रमाणित EPDS आत्म-जाँच',
    motherTabD: 'गोपनीयता और सहमति केंद्र',

    tabATitle: 'दैनिक शिशु देखभाल और 10-सेकंड चेक-इन',
    tabASubtitle: 'प्रत्येक लॉग आपकी समयरेखा और व्यक्तिगत बेसलाइन को रियल-टाइम में अपडेट करता है।',
    logFeedingTitle: 'शिशु आहार (Feeding) दर्ज करें',
    feedTypeBreast: 'स्तनपान',
    feedTypeBottle: 'बोतल / फॉर्मूला',
    feedTimeLabel: 'आहार का समय',
    feedDurationLabel: 'अवधि (मिनट)',
    feedMarkRepeatedEdit: 'लॉग सुधार / बार-बार संपादन शामिल करें',
    logFeedingBtn: 'आहार लॉग सहेजें',
    logSleepTitle: 'शिशु की नींद और रात में जागना दर्ज करें',
    sleepWakeTimeLabel: 'जागने का समय',
    sleepDurationLabel: 'नींद की अवधि (घंटे)',
    sleepFragmentedLabel: 'रात 1 AM – 4 AM के बीच बार-बार नींद टूटना',
    logSleepBtn: 'नींद लॉग सहेजें',
    inAppSearchTitle: 'इन-ऐप सहायता खोज (Search)',
    searchPlaceholder: 'नवजात की देखभाल या अपनी भावनाओं के बारे में खोजें...',
    searchBtn: 'खोज दर्ज करें',
    searchQuickChipsLabel: 'सामान्य प्रसवोत्तर खोजें:',
    chipColic3am: 'रात 3 बजे शिशु का पेट दर्द (baby colic at 3am)',
    chipNumbOverwhelmed: 'मुझे सुन्न और बहुत भारीपन क्यों महसूस हो रहा है',
    chipNormalSchedule: 'सामान्य फीडिंग समय-सारणी',
    moodCheckInTitle: '10-सेकंड स्वैच्छिक इमोजी मूड चेक-इन',
    moodPeaceful: 'शांत',
    moodSteady: 'स्थिर',
    moodTired: 'थकावट',
    moodAnxious: 'चिंतित',
    moodOverwhelmed: 'अत्यधिक भारीपन',
    activityLogTitle: 'कालानुक्रमिक गतिविधि लॉग तालिका',
    activityLogSubtitle:
      'सप्ताह 1–4 की आपकी सामान्य बेसलाइन की तुलना में देर रात (2:15 AM, 3:40 AM) के सत्रों का विवरण।',
    colTime: 'समय',
    colCategory: 'गतिविधि श्रेणी',
    colDetail: 'विवरण',
    colBaselineShift: 'व्यक्तिगत बेसलाइन तुलना',
    nightBurstTag: '1–4 AM खंडित रात्रि सत्र',
    normalWindowTag: 'सामान्य दिनचर्या',

    tabBTitle: 'मेरा स्वास्थ्य और स्पष्ट अंतर्दृष्टि (Explainable Insights)',
    tabBSubtitle:
      'सप्ताह 1–4 के आपके अपने व्यक्तिगत बेसलाइन की तुलना में वर्तमान सप्ताह के पैटर्न का सरल विवरण।',
    chart14dTitle: '14-दिवसीय व्यक्तिगत बेसलाइन तुलना चार्ट',
    chart14dSubtitle:
      'सप्ताह 1–4 के व्यक्तिगत बेसलाइन बनाम पिछले 7 दिनों के व्यवहारिक पैटर्न की तुलना।',
    legendBaseline: 'सप्ताह 1–4 व्यक्तिगत बेसलाइन',
    legendCurrentWeek: 'वर्तमान 7-दिन का पैटर्न',
    whyCheckInTitle: 'मुझे यह सौम्य चेक-इन क्यों दिखाई दे रहा है?',
    whyCheckInSubtitle:
      'हम आपकी तुलना केवल आपके अपने पिछले पैटर्न से करते हैं — किसी अन्य से नहीं:',
    signalNightSessions:
      'रात 1 AM से 4 AM के बीच खंडित ऐप सत्र, जबकि सामान्यतः आपका सत्र होता था:',
    signalMissedMood: 'पिछले 5 दिनों में छूटे हुए स्वैच्छिक मूड चेक-इन',
    signalRepeatedEdits: 'आहार लॉग में बार-बार बदलाव (जो गहरी थकान का संकेत हो सकता है)',
    geminiCompanionTitle: 'जेमिनी सहानुभूतिपूर्ण साथी (Gemini Companion)',
    geminiCompanionBadge: 'सहानुभूतिपूर्ण गैर-निदानात्मक मार्गदर्शन',
    listenVoiceBtn: 'आवाज़ में मार्गदर्शन सुनें',
    stopVoiceBtn: 'आवाज़ रोकें',
    refreshAiBtn: 'नया परामर्श प्राप्त करें',
    geminiCompanionAnanya:
      'प्रिय अनन्या, रात 1 बजे से 4 बजे के बीच चार बार जागकर शिशु आरव की देखभाल करना शरीर और मन दोनों को गहराई से थका देता है। रात 3 बजे सुन्न या अकेला महसूस करने का मतलब यह बिल्कुल नहीं है कि आप एक अच्छी माँ नहीं हैं — इसका अर्थ केवल यह है कि आपको बिना रुके आराम की आवश्यकता है। आइए अभी एक छोटा सा कदम उठाएँ।',
    geminiCompanionPriya:
      'प्रिय प्रिया, मैसूरु में इस सप्ताह आपकी रात की नींद पहले तीन हफ्तों की तुलना में थोड़ी अधिक बाधित हुई है। आप शिशु देव की बहुत अच्छी देखभाल कर रही हैं। सुबह की एक फीडिंग की जिम्मेदारी अपने जीवनसाथी के साथ साझा करने पर विचार करें ताकि आपको लगातार 4 घंटे की नींद मिल सके।',
    geminiCompanionSneha:
      'प्रिय स्नेहा, हुबली में शिशु सिया के साथ आपकी दैनिक देखभाल की लय आपके व्यक्तिगत बेसलाइन के अनुसार स्थिर और संतुलित है। अपने आराम का ध्यान रखें।',
    nextStepsHeading: 'अगले सहायक कदम (आपकी पसंद)',
    step1Breathing: '1) 3-मिनट का निर्देशित श्वास रीसेट करें',
    step2NudgePartner: '2) पति / जीवनसाथी (रोहन) को सौम्य संदेश भेजें',
    step3EpdsCheck: '3) 2-मिनट की प्रमाणित EPDS आत्म-जाँच करें',
    step4RequestCall: '4) केयर कोऑर्डिनेटर से आत्मीय कॉल का अनुरोध करें',
    breathingModalTitle: '3-मिनट निर्देशित श्वास अभ्यास',
    breathingInhale: 'नाक से धीरे-धीरे सांस अंदर लें (4 सेकंड)...',
    breathingHold: 'कंधों को ढीला छोड़ें और सांस रोकें (4 सेकंड)...',
    breathingExhale: 'मुंह से धीरे-धीरे सांस बाहर छोड़ें (6 सेकंड)...',
    partnerNudgeSentToast:
      'जीवनसाथी को सौम्य व्हाट्सएप संदेश भेजा गया (कोई निजी खोज या मूड डेटा साझा नहीं किया गया)।',
    careCallRequestedToast:
      'डॉ. कविता राव की केयर कोऑर्डिनेटर को कॉल का अनुरोध भेज दिया गया है।',

    tabCTitle: 'प्रमाणित EPDS / PHQ-9 आत्म-जाँच और सहायता रूटिंग',
    tabCSubtitle:
      'पिछले 7 दिनों में आपने कैसा महसूस किया है, यह समझने के लिए 5-प्रश्नों की प्रमाणित प्रश्नावली।',
    epdsDoctorPromptBanner:
      'डॉ. कविता राव की टीम ने आपको यह 2-मिनट का चेक-इन पूरा करने के लिए आमंत्रित किया है।',
    epdsQ1: '1. पिछले 7 दिनों में, मैं मुस्कुराने और जीवन के खुशनुमा पहलुओं को देखने में सक्षम रही हूँ:',
    epdsQ2: '2. मैं बिना किसी विशेष कारण के चिंतित या घबराई हुई महसूस करती रही हूँ:',
    epdsQ3: '3. मैं इतनी उदास या बेचैन रही हूँ कि शिशु के सोने पर भी मुझे सोने में कठिनाई हुई:',
    epdsQ4: '4. मुझे लगा है कि जिम्मेदारियाँ मुझ पर भारी पड़ रही हैं और मैं संभाल नहीं पा रही हूँ:',
    epdsQ5: '5. मुझे रात या दिन के समय उदासी, सूनापन या रोने का मन हुआ है:',
    epdsOpt0: '0 — हमेशा की तरह / बिल्कुल नहीं',
    epdsOpt1: '1 — पहले जितना नहीं / कभी-कभार',
    epdsOpt2: '2 — निश्चित रूप से कम / हाँ, अक्सर',
    epdsOpt3: '3 — बिल्कुल नहीं / हाँ, अधिकतर समय',
    submitEpdsBtn: 'स्कोर की गणना करें और सुरक्षित रूप से भेजें',
    resetEpdsBtn: 'पुनः जाँच करें',
    epdsResultHeading: 'प्रमाणित आत्म-जाँच परिणाम',
    epdsRecLow:
      'आपका स्कोर वर्तमान में कम तनाव दर्शाता है। अपना आराम और दैनिक देखभाल जारी रखें।',
    epdsRecModerate:
      'आपका स्कोर मध्यम थकान और भावनात्मक तनाव दर्शाता है। हम काउंसलर से एक सौम्य बातचीत की सलाह देते हैं।',
    epdsRecHigh:
      'आपका स्कोर गहरी भावनात्मक थकान दर्शाता है। आपकी सहमति से हम इस सारांश को डॉ. कविता राव की टीम के साथ प्राथमिकता सहायता के लिए साझा करने की सलाह देते हैं।',
    routeToDoctorBtn: 'डॉ. कविता राव की केयर टीम के साथ स्कोर साझा करें',
    routedSuccessMsg: 'डॉ. कविता राव के क्लिनिकल पोर्टल के साथ लाइव सिंक किया गया।',

    tabDTitle: 'गोपनीयता और सहमति केंद्र (Privacy-by-Design)',
    tabDSubtitle:
      'आप अपने डेटा पर 100% नियंत्रण रखती हैं। किसी भी समय किसी भी अनुमति को चालू या बंद करें।',
    consentToggle1Title: 'सहमति-आधारित नवजात देखभाल व्यवहार संकेत विश्लेषण',
    consentToggle1Desc:
      'नर्चरमाइंड एआई को आपके ऐप उपयोग के समय (जैसे रात 1–4 बजे जागना) की तुलना आपके व्यक्तिगत बेसलाइन से करने की अनुमति देता है।',
    consentToggle2Title: 'जीवनसाथी को सौम्य व्हाट्सएप संकेत (Partner Nudges)',
    consentToggle2Desc:
      'केवल एक सहयोगी संदेश भेजता है — आपकी निजी खोज (search text) या रॉ लॉग कभी साझा नहीं करता।',
    consentToggle3Title: 'उच्च जोखिम बदलावों के लिए डॉक्टर एस्केलेशन सहमति',
    consentToggle3Desc:
      'लगातार उच्च बदलाव होने पर डॉ. कविता राव की टीम को समय पर सहायता के लिए सूचित करने की अनुमति देता है।',
    statusActive: 'चालू (ON) • स्पष्ट सहमति',
    statusPaused: 'बंद (OFF) • रोका गया',
    previewWhatsappBtn: 'देखें कि मेरे पति को व्हाट्सएप पर क्या संदेश दिखेगा',
    whatsappModalTitle: 'जीवनसाथी व्हाट्सएप पूर्वावलोकन (पति रोहन शर्मा को भेजा गया)',
    whatsappPrivacyGuarantee:
      'गोपनीयता गारंटी: इसमें आपकी कोई भी निजी खोज, मूड लॉग या मेडिकल स्कोर कभी शामिल नहीं होता है।',
    whatsappPartnerMessage:
      'नमस्ते रोहन, नर्चरमाइंड साथी ने देखा है कि इस सप्ताह अनन्या को रात 1 बजे से 4 बजे के बीच शिशु की देखभाल के लिए 4 बार जागना पड़ा है। आज आपका एक छोटा सा सहयोग—जैसे सुबह 6 बजे शिशु को संभालना, अनन्या को गर्म पानी/भोजन देना, या उन्हें लगातार 3 घंटे सोने देना—उन्हें बहुत राहत दे सकता है। उनका संबल बनने के लिए धन्यवाद!',
    closeModalBtn: 'पूर्वावलोकन बंद करें',

    doctorSwitchViewBtn: 'लॉगआउट',
    doctorWorkspaceTitle: 'अस्पताल मातृ ट्रायज और व्याख्या कंसोल',
    doctorWorkspaceSubtitle:
      'क्लाउडनाइन / मणिपाल मैटरनिटी नेटवर्क • मानव-समीक्षा व्यवहार जोखिम प्रणाली',
    docTabA: 'प्राथमिकता मातृ फॉलो-अप कतार',
    docTabB: 'रोगी व्याख्या और SHAP इंस्पेक्टर',
    docTabC: 'एस्केलेशन और व्हाट्सएप रूटिंग केंद्र',

    docQueueTitle: 'प्राथमिकता मातृ फॉलो-अप कतार (कर्नाटक समूह)',
    docQueueSubtitle:
      'व्यक्तिगत बेसलाइन विचलन और व्यवहारिक संकेतों के आधार पर क्रमबद्ध सहमति-प्राप्त माताएँ।',
    filterAll: 'सभी माताएँ (6)',
    filterHigh: 'उच्च जोखिम बदलाव',
    filterModerate: 'मध्यम बदलाव',
    filterLow: 'स्वस्थ बेसलाइन',
    searchPatientPlaceholder: 'माता का नाम, शहर या अस्पताल आईडी से खोजें...',
    thMotherProfile: 'माता का नाम, आयु, सप्ताह और आईडी',
    thConsentStatus: 'सहमति स्थिति',
    thRiskSignal: 'जोखिम संकेत स्तर',
    thBaselineDev: 'बेसलाइन विचलन %',
    thTopDrivers: 'प्रमुख व्याख्यात्मक कारण',
    thFollowUpStatus: 'फॉलो-अप स्थिति',
    thAction: 'क्लिनिकल कार्रवाई',
    consentVerifiedBadge: 'स्पष्ट सहमति सत्यापित',
    consentPausedBadge: 'माता द्वारा सहमति रोकी गई',
    riskHighLabel: 'उच्च जोखिम',
    riskModLabel: 'मध्यम जोखिम',
    riskLowLabel: 'स्वस्थ बेसलाइन',
    inspectBtn: 'SHAP और ट्रायज देखें →',

    driverAnanya: 'देर रात खंडित सत्र + तनाव-आधारित खोज (Search)',
    driverPriya: 'छूटे हुए मूड चेक-इन + फीडिंग लॉग में बार-बार संशोधन',
    driverSneha: 'नियमित नींद की अवधि + स्थिर बेसलाइन लय',
    driverDivya: 'रात 3 बजे ऐप सत्र + परिवार साझाकरण में कमी',
    driverMeera: 'रात में जागने में मध्यम वृद्धि + विलंबित लॉग',
    driverFarah: 'संतुलित पार्टनर सहयोग + नियमित आराम',

    shapTitle: 'गहन रोगी व्याख्या और SHAP फीचर योगदान इंस्पेक्टर',
    shapSubtitle:
      'XGBoost / scikit-learn फीचर वेट्स जो स्पष्ट करते हैं कि माता का पैटर्न सप्ताह 1–4 के बेसलाइन से क्यों बदला।',
    shapFeature1: '1. देर रात ऐप सत्र / खंडित नींद (Night-time App Bursts)',
    shapFeature2: '2. तनाव-आधारित इन-ऐप खोज (Distress Search Intent)',
    shapFeature3: '3. छूटे हुए रिमाइंडर और बार-बार लॉग संपादन',
    shapFeature4: '4. स्वैच्छिक मूड चेक-इन में कमी',
    shapFeature5: '5. पार्टनर/देखभालकर्ता साझाकरण में कमी',
    trajectoryTitle: '7-दिवसीय रोलिंग जोखिम ग्राफ बनाम व्यक्तिगत बेसलाइन',
    trajectorySubtitle: 'माता के सप्ताह 1–4 के व्यक्तिगत बेसलाइन से वर्तमान सप्ताह के विचलन का ग्राफ।',
    soapNoteTitle: 'जेमिनी क्लिनिकल सारांश नोट (SOAP प्रारूप)',
    soapNoteSubtitle:
      'प्रसूति विशेषज्ञ (OB-GYN) और काउंसलर के लिए तैयार — गैर-निदानात्मक निर्णय सहायता।',
    soapAnanya:
      'S (व्यवहारिक संकेत): 28 वर्षीय माता (6 सप्ताह प्रसवोत्तर, बेंगलुरु) अपने सप्ताह 1–4 के व्यक्तिगत बेसलाइन से +64% विचलन दिखाती हैं, साथ ही रात 02:15 AM और 03:40 AM पर तनाव-संबंधित खोज दर्ज हैं।\nO (ऑब्जेक्टिव टेलीमेट्री): रात 1–4 बजे के बीच 4 खंडित सत्र (सामान्य 1 की तुलना में); 3 छूटे हुए मूड चेक-इन; 2 बार फीडिंग लॉग में संशोधन।\nA (आकलन): उच्च व्यवहारिक थकान और भावनात्मक तनाव संकेत (82/100)। यह स्वयं में PPD का निदान नहीं है; मानवीय काउंसलर समीक्षा आवश्यक है।\nP (योजना): 1) पति रोहन शर्मा को सहमति-आधारित व्हाट्सएप सहयोग संदेश भेजें, 2) माता के ऐप पर EPDS प्रश्नावली भेजें, 3) 24 घंटे के भीतर पेरिनेटल काउंसलर कॉल निर्धारित करें।',
    soapPriya:
      'S: 31 वर्षीय माता (4 सप्ताह प्रसवोत्तर, मैसूरु) में बेसलाइन से +34% विचलन।\nO: जोखिम संकेत 56/100 (मध्यम)। रात में 2 खंडित सत्र और लॉग संशोधन।\nA: मध्यम नींद की कमी और थकान।\nP: जीवनसाथी को सहयोग संदेश और सप्ताह 5 में EPDS चेक-इन।',
    soapSneha:
      'S: 26 वर्षीय माता (9 सप्ताह प्रसवोत्तर, हुबली) की दिनचर्या स्थिर है।\nO: जोखिम संकेत 18/100 (+4% विचलन)। नियमित नींद और परिवार का सहयोग।\nA: स्वस्थ बेसलाइन।\nP: सामान्य प्रसवोत्तर देखभाल जारी रखें।',
    soapDivya:
      'S: 29 वर्षीय माता (5 सप्ताह प्रसवोत्तर, मंगलुरु) में देर रात के सत्रों में +58% विचलन।\nO: जोखिम संकेत 76/100 (उच्च)।\nA: रात्रि थकान पैटर्न, क्लिनिकल समीक्षा आवश्यक।\nP: काउंसलर कॉल और पार्टनर व्हाट्सएप संदेश।',
    soapMeera:
      'S: 33 वर्षीय माता (7 सप्ताह प्रसवोत्तर, बेलगावी) में +29% विचलन।\nO: जोखिम संकेत 49/100 (मध्यम)।\nA: हल्की से मध्यम मातृ थकान।\nP: आराम चेक-इन और नियमित फॉलो-अप।',
    soapFarah:
      'S: 27 वर्षीय माता (8 सप्ताह प्रसवोत्तर, कलबुर्गी) का पैटर्न संतुलित है।\nO: जोखिम संकेत 22/100 (+6% विचलन)।\nA: कम जोखिम, स्वस्थ अनुकूलन।\nP: मानक 10-सप्ताह फॉलो-अप।',

    escalationTitle: 'मानव-समीक्षा (Human-in-the-Loop) एस्केलेशन और व्हाट्सएप रूटिंग केंद्र',
    escalationSubtitle:
      'सहमति-आधारित क्लिनिकल और पारिवारिक सहायता कार्रवाई करें जो तुरंत माता के ऐप के साथ सिंक होती है।',
    action1TriggerWhatsapp: 'जीवनसाथी को सहमति-आधारित व्हाट्सएप संदेश भेजें',
    action1Desc:
      'बिना किसी मेडिकल डेटा को उजागर किए पति/परिवार को अंग्रेजी, हिंदी या कन्नड़ में सहयोगी संदेश भेजता है।',
    action2SendEpds: 'माता के ऐप पर प्रमाणित EPDS स्क्रीनिंग लिंक भेजें',
    action2Desc:
      'माता पोर्टल में 2-मिनट की स्वैच्छिक EPDS आत्म-जाँच को सक्रिय करता है।',
    action3AssignCounsellor: 'पेरिनेटल काउंसलर कॉल निर्धारित करें और क्लिनिकल नोट दर्ज करें',
    action3Desc:
      'रोगी की कतार स्थिति को सत्यापित समय के साथ "In Care Pathway" में अपडेट करता है।',
    clinicalNoteInputPlaceholder:
      'क्लिनिकल नोट या काउंसलर निर्देश लिखें (उदा. "माता से बात हुई; शुक्रवार को टेली-काउंसलिंग निर्धारित")...',
    clinicalLogHistoryTitle: 'क्लिनिकल केयर पाथवे लॉग इतिहास',

    aboutModalTitle: 'नर्चरमाइंड एआई (NurtureMind AI) किस बारे में है?',
    aboutIntroText:
      'प्रसव के बाद के शुरुआती हफ्तों में, कई माताएँ नींद की भारी कमी और भावनात्मक थकान से अकेले जूझती हैं। नर्चरमाइंड एआई माता की पूर्ण सहमति से दैनिक शिशु-देखभाल लॉग (आहार, नींद और 10-सेकंड मूड चेक-इन) से प्रारंभिक और स्पष्ट संकेत पहचानता है — ताकि परिवार और डॉक्टर समय पर सहारा दे सकें।',
    aboutStep1Title: '01. बिना किसी अतिरिक्त बोझ के दैनिक शिशु देखभाल',
    aboutStep1Desc:
      'माताएँ शिशु के आहार, नींद और सवालों को दर्ज करने के लिए इस ऐप का उपयोग करती हैं — जिसमें अंग्रेजी, हिंदी और कन्नड़ में वॉइस सपोर्ट उपलब्ध है।',
    aboutStep2Title: '02. व्यक्तिगत बेसलाइन से स्पष्ट तुलना',
    aboutStep2Desc:
      'किसी कठोर नियम के बजाय, यह ऐप माता के वर्तमान सप्ताह की तुलना उनके अपने सप्ताह 1–4 के व्यक्तिगत पैटर्न से करता है।',
    aboutStep3Title: '03. परिवार और डॉक्टर से समय पर सहयोग',
    aboutStep3Desc:
      'थकान बढ़ने पर पति/परिवार को सौम्य व्हाट्सएप संदेश भेजा जा सकता है और आवश्यकता होने पर डॉक्टर व काउंसलर से तुरंत जुड़ाव होता है।',
    b2b2cModelTitle: 'माता, परिवार और अस्पताल का समन्वय',
    b2b2cModelDesc:
      'माताओं को घर पर सहानुभूतिपूर्ण साथ मिलता है और डॉक्टरों को समय पर देखभाल प्रदान करने में सहायता मिलती है।',
    privacyModalTitle: 'गोपनीयता-प्रथम (Privacy-by-Design) और क्लिनिकल नैतिकता',
    privacyPillar1Title: 'कोई स्वतंत्र निदान उपकरण नहीं',
    privacyPillar1Desc:
      'नर्चरमाइंड एआई कभी भी प्रसवोत्तर अवसाद का निदान नहीं करता है। यह केवल समय पर मानवीय सहायता के लिए प्रारंभिक संकेत देता है।',
    privacyPillar2Title: 'जीवनसाथी गोपनीयता सीमा',
    privacyPillar2Desc:
      'व्हाट्सएप संदेश केवल व्यावहारिक मदद का सुझाव देते हैं और कभी भी निजी सर्च या मेडिकल स्कोर साझा नहीं करते।',
    privacyPillar3Title: 'पूर्णतः नियंत्रण योग्य सहमति (DPDP अधिनियम 2023 के अनुरूप)',
    privacyPillar3Desc:
      'प्रत्येक माता किसी भी समय एक क्लिक से डेटा विश्लेषण या व्हाट्सएप संदेश को रोक सकती है।',
    backToGatewayBtn: '← होम पर वापस जाएँ',
  },

  kn: {
    brandName: 'ನರ್ಚರ್‌ಮೈಂಡ್ ಎಐ (NurtureMind AI)',
    brandSubtitle: 'ಸಮ್ಮತಿ-ಮೊದಲ ಬಾಣಂತನದ ಬೆಂಬಲ',
    navGateway: 'ಮುಖಪುಟ (Home)',
    navAbout: 'ಕುರಿತು (About)',
    navPrivacy: 'ಗೌಪ್ಯತೆ ಮತ್ತು ನೈತಿಕತೆ',
    clinicalSafetyBanner:
      'ಕ್ಲಿನಿಕಲ್ ಚೌಕಟ್ಟು: ನರ್ಚರ್‌ಮೈಂಡ್ ಎಐ ಸಮ್ಮತಿಸಲಾದ ನವಜಾತ ಶಿಶು ಆರೈಕೆ ನಡವಳಿಕೆಯಿಂದ ಅಪಾಯದ ಸಂಕೇತಗಳನ್ನು ಗುರುತಿಸುತ್ತದೆ; ಇದು ಪ್ರಸವಾನಂತರದ ಖಿನ್ನತೆಯನ್ನು (PPD) ನಿರ್ಣಯಿಸುವುದಿಲ್ಲ. ವೈದ್ಯರ ಪರಿಶೀಲನೆ ಕಡ್ಡಾಯವಾಗಿದೆ.',

    gatewayKicker: 'ತಾಯಂದಿರ ನಡವಳಿಕೆಯ ಆರಂಭಿಕ-ಎಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ',
    gatewayHeadline:
      'ಸಮ್ಮತಿಸಲಾದ ನವಜಾತ ಶಿಶು ಆರೈಕೆ ನಡವಳಿಕೆಯಿಂದ ಸ್ಪಷ್ಟ ಆರಂಭಿಕ ಸಂಕೇತಗಳು — ತಾಯಂದಿರಿಗೆ ಸಕಾಲದಲ್ಲಿ ಬೆಂಬಲ ತಲುಪಲು.',
    gatewaySubheadline:
      'ತಾಯಿಯ ಕಂಪ್ಯಾನಿಯನ್ ಪೋರ್ಟಲ್ ಅಥವಾ ವೈದ್ಯರ ಕ್ಲಿನಿಕಲ್ ಪೋರ್ಟಲ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಲು ಕೆಳಗೆ ಆಯ್ಕೆಮಾಡಿ.',
    chooseLoginPrompt: 'ಮುಂದುವರಿಯಲು ಲಾಗಿನ್ ಪೋರ್ಟಲ್ ಆಯ್ಕೆಮಾಡಿ',
    motherLoginBtn: 'ತಾಯಿ ಲಾಗಿನ್ (Mother Login)',
    doctorLoginBtn: 'ವೈದ್ಯರ ಲಾಗಿನ್ (Doctor Login)',
    motherLoginTitle: 'ತಾಯಿ ಲಾಗಿನ್ (Mother Login)',
    motherLoginSubtitle:
      'ನಿಮ್ಮ ದೈನಂದಿನ ಮಗುವಿನ ಆರೈಕೆ ಲಾಗರ್ ಮತ್ತು ಯೋಗಕ್ಷೇಮ ಒಡನಾಡಿಯನ್ನು ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ಲಾಗಿನ್ ಐಡಿ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.',
    doctorLoginTitle: 'ವೈದ್ಯರ ಲಾಗಿನ್ (Doctor Login)',
    doctorLoginSubtitle:
      'ತಾಯಂದಿರ ಫಾಲೋ-ಅಪ್ ಪಟ್ಟಿ ಮತ್ತು SHAP ವಿವರಣೆ ಕನ್ಸೋಲ್ ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಐಡಿ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.',
    loginIdLabel: 'ಲಾಗಿನ್ ಐಡಿ (Login ID)',
    loginIdPlaceholderMother: 'ತಾಯಿಯ ಐಡಿ ನಮೂದಿಸಿ (ಉದಾ: CN-BLR-4092)',
    loginIdPlaceholderDoctor: 'ವೈದ್ಯರ ಐಡಿ ನಮೂದಿಸಿ (ಉದಾ: OBG-KA-8821)',
    passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್ (Password)',
    passwordPlaceholder: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    loginSubmitBtn: 'ಲಾಗಿನ್ ಮಾಡಿ →',
    backToRoleSelectBtn: '← ಹಿಂದೆ',
    loginErrorEmpty: 'ಮುಂದುವರಿಯಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಐಡಿ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಎರಡನ್ನೂ ನಮೂದಿಸಿ.',
    selectMotherAccountLabel: 'ನೋಂದಾಯಿತ ತಾಯಿಯ ಖಾತೆ',

    motherAnanyaDesc: 'ಅನನ್ಯಾ ಶರ್ಮಾ (28 ವರ್ಷ, ಬೆಂಗಳೂರು — 6 ವಾರಗಳ ಬಾಣಂತನ)',
    motherPriyaDesc: 'ಪ್ರಿಯಾ ನಾಯರ್ (31 ವರ್ಷ, ಮೈಸೂರು — 4 ವಾರಗಳ ಬಾಣಂತನ)',
    motherSnehaDesc: 'ಸ್ನೇಹಾ ಕುಲಕರ್ಣಿ (26 ವರ್ಷ, ಹುಬ್ಬಳ್ಳಿ — 9 ವಾರಗಳ ಬಾಣಂತನ)',
    doctorCredsName: 'ಡಾ. ಕವಿತಾ ರಾವ್, MD (OB-GYN)',
    doctorCredsRole:
      'ಹಿರಿಯ ಪ್ರಸೂತಿ ಮತ್ತು ತಾಯಂದಿರ ಮಾನಸಿಕ ಆರೋಗ್ಯ ತಜ್ಞರು • ಕ್ಲೌಡ್‌ನೈನ್ / ಮಣಿಪಾಲ್ ಮೆಟರ್ನಿಟಿ ನೆಟ್‌ವರ್ಕ್, ಬೆಂಗಳೂರು',

    switchUserLogout: 'ಲಾಗ್ಔಟ್',
    weeksOld: 'ವಾರಗಳ ಮಗು',
    weeksPostpartum: 'ವಾರಗಳ ಬಾಣಂತನ',
    motherTabA: 'ದೈನಂದಿನ ಶಿಶು ಆರೈಕೆ & ಚೆಕ್-ಇನ್',
    motherTabB: 'ನನ್ನ ಯೋಗಕ್ಷೇಮ & ಸ್ಪಷ್ಟ ಒಳನೋಟಗಳು',
    motherTabC: 'ದೃಢೀಕೃತ EPDS ಸ್ವಯಂ-ತಪಾಸಣೆ',
    motherTabD: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಸಮ್ಮತಿ ಕೇಂದ್ರ',

    tabATitle: 'ದೈನಂದಿನ ಶಿಶು ಆರೈಕೆ ಮತ್ತು 10-ಸೆಕೆಂಡ್ ಚೆಕ್-ಇನ್',
    tabASubtitle: 'ಪ್ರತಿಯೊಂದು ಲಾಗ್ ನಿಮ್ಮ ಟೈಮ್‌ಲೈನ್ ಮತ್ತು ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್ ಅನ್ನು ತಕ್ಷಣವೇ ನವೀಕರಿಸುತ್ತದೆ.',
    logFeedingTitle: 'ಮಗುವಿನ ಆಹಾರ (Feeding) ದಾಖಲಿಸಿ',
    feedTypeBreast: 'ಎದೆಹಾಲು ಉಣಿಸುವಿಕೆ',
    feedTypeBottle: 'ಬಾಟಲ್ / ಫಾರ್ಮುಲಾ',
    feedTimeLabel: 'ಆಹಾರ ನೀಡಿದ ಸಮಯ',
    feedDurationLabel: 'ಅವಧಿ (ನಿಮಿಷಗಳು)',
    feedMarkRepeatedEdit: 'ಲಾಗ್ ತಿದ್ದುಪಡಿ / ಮರು-ಸಂಪಾದನೆ ಸೇರಿಸಿ',
    logFeedingBtn: 'ಆಹಾರ ಲಾಗ್ ಉಳಿಸಿ',
    logSleepTitle: 'ಮಗುವಿನ ನಿದ್ರೆ ಮತ್ತು ರಾತ್ರಿ ಎಚ್ಚರ ದಾಖಲಿಸಿ',
    sleepWakeTimeLabel: 'ಎಚ್ಚರವಾದ ಸಮಯ',
    sleepDurationLabel: 'ನಿದ್ರೆಯ ಅವಧಿ (ಗಂಟೆಗಳು)',
    sleepFragmentedLabel: 'ರಾತ್ರಿ 1 AM – 4 AM ನಡುವೆ ತುಂಡಾದ ನಿದ್ರೆಯ ಎಚ್ಚರ',
    logSleepBtn: 'ನಿದ್ರೆ ಲಾಗ್ ಉಳಿಸಿ',
    inAppSearchTitle: 'ಆಪ್ ಒಳಗಿನ ಬೆಂಬಲ ಹುಡುಕಾಟ (Search)',
    searchPlaceholder: 'ಮಗುವಿನ ಆರೈಕೆ ಅಥವಾ ನಿಮ್ಮ ಭಾವನೆಗಳ ಬಗ್ಗೆ ಹುಡುಕಿ...',
    searchBtn: 'ಹುಡುಕಾಟ ದಾಖಲಿಸಿ',
    searchQuickChipsLabel: 'ಸಾಮಾನ್ಯ ಹುಡುಕಾಟಗಳು:',
    chipColic3am: 'ರಾತ್ರಿ 3 ಗಂಟೆಗೆ ಮಗುವಿನ ಹೊಟ್ಟೆ ನೋವು (baby colic at 3am)',
    chipNumbOverwhelmed: 'ನನಗೆ ಏಕೆ ಮರಗಟ್ಟಿದಂತೆ ಮತ್ತು ಅತಿಯಾದ ಭಾರ ಎನಿಸುತ್ತಿದೆ',
    chipNormalSchedule: 'ಸಾಮಾನ್ಯ ಹಾಲುಣಿಸುವ ವೇಳಾಪಟ್ಟಿ',
    moodCheckInTitle: '10-ಸೆಕೆಂಡ್ ಸ್ವಯಂಪ್ರೇರಿತ ಎಮೋಜಿ ಮನಸ್ಥಿತಿ ಚೆಕ್-ಇನ್',
    moodPeaceful: 'ಶಾಂತ',
    moodSteady: 'ಸ್ಥಿರ',
    moodTired: 'ದಣಿವು',
    moodAnxious: 'ಆತಂಕ',
    moodOverwhelmed: 'ಅತಿಯಾದ ಒತ್ತಡ',
    activityLogTitle: 'ಕಾಲಾನುಕ್ರಮ ಚಟುವಟಿಕೆ ಲಾಗ್ ಕೋಷ್ಟಕ',
    activityLogSubtitle:
      'ನಿಮ್ಮ 1–4 ವಾರಗಳ ಸಾಮಾನ್ಯ ಬೇಸ್‌ಲೈನ್‌ಗೆ ಹೋಲಿಸಿದರೆ ತಡರಾತ್ರಿ (2:15 AM, 3:40 AM) ಚಟುವಟಿಕೆಗಳ ವಿವರ.',
    colTime: 'ಸಮಯ',
    colCategory: 'ಚಟುವಟಿಕೆ ವರ್ಗ',
    colDetail: 'ವಿವರ',
    colBaselineShift: 'ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್ ಹೋಲಿಕೆ',
    nightBurstTag: '1–4 AM ತುಂಡಾದ ರಾತ್ರಿ ಸೆಷನ್',
    normalWindowTag: 'ಸಾಮಾನ್ಯ ದಿನಚರಿ',

    tabBTitle: 'ನನ್ನ ಯೋಗಕ್ಷೇಮ ಮತ್ತು ಸ್ಪಷ್ಟ ಒಳನೋಟಗಳು (Explainable Insights)',
    tabBSubtitle:
      'ನಿಮ್ಮದೇ ಆದ 1–4 ವಾರಗಳ ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್‌ಗೆ ಹೋಲಿಸಿದರೆ ಈ ವಾರದ ನಡವಳಿಕೆಯ ಸರಳ ವಿವರಣೆ.',
    chart14dTitle: '14-ದಿನಗಳ ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್ ಹೋಲಿಕೆ ಚಾರ್ಟ್',
    chart14dSubtitle:
      'ನಿಮ್ಮ 1–4 ವಾರಗಳ ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್ ಮತ್ತು ಕಳೆದ 7 ದಿನಗಳ ಮಾದರಿಯ ಹೋಲಿಕೆ.',
    legendBaseline: 'ವಾರ 1–4 ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್',
    legendCurrentWeek: 'ಪ್ರಸ್ತುತ 7-ದಿನಗಳ ಮಾದರಿ',
    whyCheckInTitle: 'ನನಗೆ ಈ ಸೌಮ್ಯ ಚೆಕ್-ಇನ್ ಏಕೆ ಕಾಣಿಸುತ್ತಿದೆ?',
    whyCheckInSubtitle:
      'ನಾವು ನಿಮ್ಮ ದಿನಚರಿಯನ್ನು ನಿಮ್ಮದೇ ಹಿಂದಿನ ಬೇಸ್‌ಲೈನ್‌ಗೆ ಮಾತ್ರ ಹೋಲಿಸುತ್ತೇವೆ:',
    signalNightSessions:
      'ರಾತ್ರಿ 1 AM – 4 AM ನಡುವೆ ತುಂಡಾದ ಆಪ್ ಸೆಷನ್‌ಗಳು, ನಿಮ್ಮ ಸಾಮಾನ್ಯ ಸೆಷನ್:',
    signalMissedMood: 'ಕಳೆದ 5 ದಿನಗಳಲ್ಲಿ ತಪ್ಪಿಹೋದ ಸ್ವಯಂಪ್ರೇರಿತ ಮನಸ್ಥಿತಿ ಚೆಕ್-ಇನ್‌ಗಳು',
    signalRepeatedEdits: 'ಆಹಾರ ಲಾಗ್‌ನಲ್ಲಿ ಪದೇ ಪದೇ ತಿದ್ದುಪಡಿಗಳು (ತೀವ್ರ ನಿದ್ರೆಯ ಕೊರತೆಯ ಸಂಕೇತ)',
    geminiCompanionTitle: 'ಜೆಮಿನಿ ಸಹಾನುಭೂತಿಯ ಒಡನಾಡಿ (Gemini Companion)',
    geminiCompanionBadge: 'ಸಹಾನುಭೂತಿಯ ರೋಗನಿರ್ಣಯವಲ್ಲದ ಮಾರ್ಗದರ್ಶನ',
    listenVoiceBtn: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಕೇಳಿ',
    stopVoiceBtn: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    refreshAiBtn: 'ಹೊಸ ಸಲಹೆ ಪಡೆಯಿರಿ',
    geminiCompanionAnanya:
      'ಪ್ರಿಯ ಅನನ್ಯಾ, ರಾತ್ರಿ 1 ರಿಂದ 4 ಗಂಟೆಯ ನಡುವೆ ನಾಲ್ಕು ಬಾರಿ ಎಚ್ಚರಗೊಂಡು ಮಗು ಆರವ್‌ನನ್ನು ಆರೈಕೆ ಮಾಡುವುದು ದೇಹ ಮತ್ತು ಮನಸ್ಸಿಗೆ ತೀವ್ರ ಆಯಾಸ ತರುತ್ತದೆ. ರಾತ್ರಿ 3 ಗಂಟೆಗೆ ಮರಗಟ್ಟಿದಂತೆ ಅಥವಾ ಒತ್ತಡ ಎನಿಸುವುದು ನಿಮ್ಮ ವೈಫಲ್ಯವಲ್ಲ — ನಿಮಗೆ ನಿರಂತರ ವಿಶ್ರಾಂತಿಯ ಅಗತ್ಯವಿದೆ ಎಂದರ್ಥ. ಈಗ ಒಂದು ಸಣ್ಣ ಶಾಂತ ಹೆಜ್ಜೆ ಇಡೋಣ.',
    geminiCompanionPriya:
      'ಪ್ರಿಯ ಪ್ರಿಯಾ, ಮೈಸೂರಿನಲ್ಲಿ ಈ ವಾರ ನಿಮ್ಮ ರಾತ್ರಿಯ ನಿದ್ರೆ ಮೊದಲ ಮೂರು ವಾರಗಳಿಗಿಂತ ಸ್ವಲ್ಪ ಹೆಚ್ಚು ತುಂಡಾಗಿದೆ. ನೀವು ಮಗು ದೇವ್‌ನನ್ನು ಪ್ರೀತಿಯಿಂದ ನೋಡಿಕೊಳ್ಳುತ್ತಿದ್ದೀರಿ. ಬೆಳಗಿನ ಜಾವದ ಒಂದು ಆರೈಕೆಯ ಜವಾಬ್ದಾರಿಯನ್ನು ನಿಮ್ಮ ಪತಿಯೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ, ಇದರಿಂದ ನಿಮಗೆ ಸತತ 4 ಗಂಟೆಗಳ ನಿದ್ರೆ ಸಿಗುತ್ತದೆ.',
    geminiCompanionSneha:
      'ಪ್ರಿಯ ಸ್ನೇಹಾ, ಹುಬ್ಬಳ್ಳಿಯಲ್ಲಿ ಮಗು ಸಿಯಾ ಜೊತೆಗಿನ ನಿಮ್ಮ ದೈನಂದಿನ ಆರೈಕೆಯ ಲಯವು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್‌ಗೆ ಅನುಗುಣವಾಗಿ ಸ್ಥಿರವಾಗಿದೆ. ನಿಮ್ಮ ವಿಶ್ರಾಂತಿಯನ್ನು ಹೀಗೆಯೇ ಮುಂದುವರಿಸಿ.',
    nextStepsHeading: 'ಮುಂದಿನ ಪೂರಕ ಹೆಜ್ಜೆಗಳು (ನಿಮ್ಮ ಆಯ್ಕೆ)',
    step1Breathing: '1) 3-ನಿಮಿಷದ ಮಾರ್ಗದರ್ಶಿ ಉಸಿರಾಟದ ಅಭ್ಯಾಸ ಮಾಡಿ',
    step2NudgePartner: '2) ಪತಿ / ಸಂಗಾತಿಗೆ (ರೋಹನ್) ಸೌಮ್ಯ ಸಂದೇಶ ಕಳುಹಿಸಿ',
    step3EpdsCheck: '3) 2-ನಿಮಿಷದ ದೃಢೀಕೃತ EPDS ಸ್ವಯಂ-ತಪಾಸಣೆ ಮಾಡಿ',
    step4RequestCall: '4) ಕೇರ್ ಕೋಆರ್ಡಿನೇಟರ್ ಅವರಿಂದ ಕರೆಗೆ ವಿನಂತಿಸಿ',
    breathingModalTitle: '3-ನಿಮಿಷದ ಮಾರ್ಗದರ್ಶಿ ಉಸಿರಾಟದ ವಿಶ್ರಾಂತಿ',
    breathingInhale: 'ಮೂಗಿನ ಮೂಲಕ ನಿಧಾನವಾಗಿ ಉಸಿರು ಎಳೆದುಕೊಳ್ಳಿ (4 ಸೆಕೆಂಡ್)...',
    breathingHold: 'ಭುಜಗಳನ್ನು ಸಡಿಲಿಸಿ ಉಸಿರು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳಿ (4 ಸೆಕೆಂಡ್)...',
    breathingExhale: 'ಬಾಯಿಯ ಮೂಲಕ ನಿಧಾನವಾಗಿ ಉಸಿರು ಬಿಡಿ (6 ಸೆಕೆಂಡ್)...',
    partnerNudgeSentToast:
      'ಪತಿಗೆ ಸೌಮ್ಯ ವಾಟ್ಸಾಪ್ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ (ಯಾವುದೇ ಖಾಸಗಿ ಹುಡುಕಾಟ ಅಥವಾ ಲಾಗ್ ಹಂಚಿಕೊಂಡಿಲ್ಲ).',
    careCallRequestedToast:
      'ಡಾ. ಕವಿತಾ ರಾವ್ ಅವರ ಕೇರ್ ಕೋಆರ್ಡಿನೇಟರ್‌ಗೆ ಕರೆ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ.',

    tabCTitle: 'ದೃಢೀಕೃತ EPDS / PHQ-9 ಸ್ವಯಂ-ತಪಾಸಣೆ ಮತ್ತು ಬೆಂಬಲ ರೂಟಿಂಗ್',
    tabCSubtitle:
      'ಕಳೆದ 7 ದಿನಗಳಲ್ಲಿ ನೀವು ಹೇಗೆ ಭಾವಿಸಿದ್ದೀರಿ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು 5-ಪ್ರಶ್ನೆಗಳ ದೃಢೀಕೃತ ತಪಾಸಣೆ.',
    epdsDoctorPromptBanner:
      'ಡಾ. ಕವಿತಾ ರಾವ್ ಅವರ ತಂಡವು ಈ 2-ನಿಮಿಷದ ಚೆಕ್-ಇನ್ ಪೂರ್ಣಗೊಳಿಸಲು ಸೌಮ್ಯ ಆಹ್ವಾನ ಕಳುಹಿಸಿದೆ.',
    epdsQ1: '1. ಕಳೆದ 7 ದಿನಗಳಲ್ಲಿ, ನಾನು ನಗಲು ಮತ್ತು ಜೀವನದ ಸಂತೋಷದ ಸಂಗತಿಗಳನ್ನು ಕಾಣಲು ಸಾಧ್ಯವಾಗಿದೆ:',
    epdsQ2: '2. ಯಾವುದೇ ಕಾರಣವಿಲ್ಲದೆ ನಾನು ಆತಂಕ ಅಥವಾ ಚಿಂತೆಗೆ ಒಳಗಾಗಿದ್ದೇನೆ:',
    epdsQ3: '3. ನಾನು ಎಷ್ಟು ದುಃಖಿತಳಾಗಿದ್ದೆ ಎಂದರೆ ಮಗು ಮಲಗಿದ್ದಾಗಲೂ ನನಗೆ ನಿದ್ರೆ ಮಾಡಲು ಕಷ್ಟವಾಯಿತು:',
    epdsQ4: '4. ಜವಾಬ್ದಾರಿಗಳು ನನ್ನ ಮೇಲೆ ಅತಿಯಾಗಿ ಪರಿಣಾಮ ಬೀರುತ್ತಿವೆ ಮತ್ತು ನನಗೆ ಒತ್ತಡವಾಗುತ್ತಿದೆ ಎನಿಸಿದೆ:',
    epdsQ5: '5. ರಾತ್ರಿ ಅಥವಾ ಹಗಲಿನಲ್ಲಿ ನನಗೆ ದುಃಖ, ಮರಗಟ್ಟುವಿಕೆ ಅಥವಾ ಅಳಬೇಕೆಂದು ಅನಿಸಿದೆ:',
    epdsOpt0: '0 — ಯಾವಾಗಲೂ ಇದ್ದಂತೆ / ಇಲ್ಲವೇ ಇಲ್ಲ',
    epdsOpt1: '1 — ಮೊದಲಿನಷ್ಟಲ್ಲ / ಒಮ್ಮೊಮ್ಮೆ ಮಾತ್ರ',
    epdsOpt2: '2 — ಖಂಡಿತವಾಗಿಯೂ ಕಡಿಮೆ / ಹೌದು, ಸಾಕಷ್ಟು ಬಾರಿ',
    epdsOpt3: '3 — ಇಲ್ಲವೇ ಇಲ್ಲ / ಹೌದು, ಹೆಚ್ಚಿನ ಸಮಯ',
    submitEpdsBtn: 'ಸ್ಕೋರ್ ಲೆಕ್ಕಹಾಕಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿ ಕಳುಹಿಸಿ',
    resetEpdsBtn: 'ಮತ್ತೊಮ್ಮೆ ತಪಾಸಣೆ ಮಾಡಿ',
    epdsResultHeading: 'ದೃಢೀಕೃತ ಸ್ವಯಂ-ತಪಾಸಣೆಯ ಫಲಿತಾಂಶ',
    epdsRecLow:
      'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಕಡಿಮೆ ಒತ್ತಡವನ್ನು ತೋರಿಸುತ್ತವೆ. ವಿಶ್ರಾಂತಿ ಮತ್ತು ಆರೈಕೆಯನ್ನು ಮುಂದುವರಿಸಿ.',
    epdsRecModerate:
      'ನಿಮ್ಮ ಸ್ಕೋರ್ ಸಾಧಾರಣ ಭಾವನಾತ್ಮಕ ಆಯಾಸವನ್ನು ತೋರಿಸುತ್ತದೆ. ಕೌನ್ಸಿಲರ್ ಜೊತೆ ಸೌಮ್ಯ ಮಾತುಕತೆ ನಡೆಸಲು ನಾವು ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ.',
    epdsRecHigh:
      'ನಿಮ್ಮ ಸ್ಕೋರ್ ತೀವ್ರ ಭಾವನಾತ್ಮಕ ದಣಿವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ನಿಮ್ಮ ಸಮ್ಮತಿಯೊಂದಿಗೆ ಆದ್ಯತೆಯ ಬೆಂಬಲಕ್ಕಾಗಿ ಡಾ. ಕವಿತಾ ರಾವ್ ಅವರ ತಂಡದೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ.',
    routeToDoctorBtn: 'ಡಾ. ಕವಿತಾ ರಾವ್ ಅವರ ಕೇರ್ ತಂಡದೊಂದಿಗೆ ಸ್ಕೋರ್ ಹಂಚಿಕೊಳ್ಳಿ',
    routedSuccessMsg: 'ಡಾ. ಕವಿತಾ ರಾವ್ ಅವರ ಕ್ಲಿನಿಕಲ್ ಪಟ್ಟಿಯೊಂದಿಗೆ ಲೈವ್ ಸಿಂಕ್ ಆಗಿದೆ.',

    tabDTitle: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಸಮ್ಮತಿ ಕೇಂದ್ರ (Privacy-by-Design)',
    tabDSubtitle:
      'ನಿಮ್ಮ ಡೇಟಾದ ಮೇಲೆ ನಿಮಗೆ 100% ನಿಯಂತ್ರಣವಿದೆ. ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ಅನುಮತಿಯನ್ನು ಆನ್ ಅಥವಾ ಆಫ್ ಮಾಡಿ.',
    consentToggle1Title: 'ಸಮ್ಮತಿಸಲಾದ ನವಜಾತ ಶಿಶು ಆರೈಕೆ ನಡವಳಿಕೆ ಸಂಕೇತ ವಿಶ್ಲೇಷಣೆ',
    consentToggle1Desc:
      'ನಿಮ್ಮ ಆಪ್ ಬಳಕೆಯ ಸಮಯವನ್ನು (ರಾತ್ರಿ 1–4 ಗಂಟೆಯ ಎಚ್ಚರ) ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್‌ಗೆ ಹೋಲಿಸಲು ನರ್ಚರ್‌ಮೈಂಡ್ ಎಐಗೆ ಅನುಮತಿಸುತ್ತದೆ.',
    consentToggle2Title: 'ಸಂಗಾತಿಗೆ ಸೌಮ್ಯ ವಾಟ್ಸಾಪ್ ಸಂದೇಶಗಳು (Partner Nudges)',
    consentToggle2Desc:
      'ಬೆಂಬಲ ನೀಡುವ ಸಂದೇಶವನ್ನು ಮಾತ್ರ ಕಳುಹಿಸುತ್ತದೆ — ನಿಮ್ಮ ಖಾಸಗಿ ಹುಡುಕಾಟ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸ್ಕೋರ್ ಅನ್ನು ಎಂದಿಗೂ ತೋರಿಸುವುದಿಲ್ಲ.',
    consentToggle3Title: 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಬದಲಾವಣೆಗಳಿಗೆ ವೈದ್ಯರ ಎಸ್ಕಲೇಷನ್ ಸಮ್ಮತಿ',
    consentToggle3Desc:
      'ನಿರಂತರ ಬದಲಾವಣೆಗಳು ಕಂಡುಬಂದಾಗ ಸಕಾಲಿಕ ಸಹಾಯಕ್ಕಾಗಿ ಡಾ. ಕವಿತಾ ರಾವ್ ಅವರ ತಂಡಕ್ಕೆ ತಿಳಿಸಲು ಅನುಮತಿಸುತ್ತದೆ.',
    statusActive: 'ಆನ್ (ON) • ಸ್ಪಷ್ಟ ಸಮ್ಮತಿ',
    statusPaused: 'ಆಫ್ (OFF) • ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ',
    previewWhatsappBtn: 'ನನ್ನ ಪತಿಗೆ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಕಾಣುವ ಸಂದೇಶವನ್ನು ವೀಕ್ಷಿಸಿ',
    whatsappModalTitle: 'ಪತಿಗೆ ವಾಟ್ಸಾಪ್ ಪೂರ್ವವೀಕ್ಷಣೆ (ರೋಹನ್ ಶರ್ಮಾ ಅವರಿಗೆ ಕಳುಹಿಸಲಾಗುವ ಸಂದೇಶ)',
    whatsappPrivacyGuarantee:
      'ಗೌಪ್ಯತೆ ಭರವಸೆ: ಯಾವುದೇ ಖಾಸಗಿ ಹುಡುಕಾಟ ಪಠ್ಯ, ಮನಸ್ಥಿತಿ ಲಾಗ್ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸ್ಕೋರ್ ಅನ್ನು ಎಂದಿಗೂ ಸೇರಿಸಲಾಗುವುದಿಲ್ಲ.',
    whatsappPartnerMessage:
      'ನಮಸ್ಕಾರ ರೋಹನ್, ಈ ವಾರ ಅನನ್ಯಾ ಅವರು ರಾತ್ರಿ 1 ರಿಂದ 4 ಗಂಟೆಯ ನಡುವೆ ಮಗುವಿನ ಆರೈಕೆಗಾಗಿ 4 ಬಾರಿ ಎಚ್ಚರಗೊಂಡಿದ್ದಾರೆ ಎಂದು ನರ್ಚರ್‌ಮೈಂಡ್ ಗಮನಿಸಿದೆ. ಇಂದು ನಿಮ್ಮ ಒಂದು ಸಣ್ಣ ಸಹಾಯ—ಬೆಳಿಗ್ಗೆ 6 ಗಂಟೆಗೆ ಮಗುವನ್ನು ಸಮಾಧಾನಪಡಿಸುವುದು, ಅನನ್ಯಾಗೆ ಬೆಚ್ಚಗಿನ ನೀರು/ಆಹಾರ ನೀಡುವುದು ಅಥವಾ ಸತತ 3 ಗಂಟೆಗಳ ಕಾಲ ನಿದ್ರಿಸಲು ಅನುವು ಮಾಡಿಕೊಡುವುದು—ಅವರಿಗೆ ಹೆಚ್ಚಿನ ಚೈತನ್ಯ ನೀಡುತ್ತದೆ. ಅವರಿಗೆ ಆಸರೆಯಾಗಿರುವುದಕ್ಕೆ ಧನ್ಯವಾದಗಳು!',
    closeModalBtn: 'ಪೂರ್ವವೀಕ್ಷಣೆ ಮುಚ್ಚಿ',

    doctorSwitchViewBtn: 'ಲಾಗ್ಔಟ್',
    doctorWorkspaceTitle: 'ಆಸ್ಪತ್ರೆ ತಾಯಂದಿರ ಟ್ರಯಾಜ್ ಮತ್ತು ವಿವರಣಾ ಕನ್ಸೋಲ್',
    doctorWorkspaceSubtitle:
      'ಕ್ಲೌಡ್‌ನೈನ್ / ಮಣಿಪಾಲ್ ಮೆಟರ್ನಿಟಿ ನೆಟ್‌ವರ್ಕ್ • ಮಾನವ-ಪರಿಶೀಲಿತ ನಡವಳಿಕೆ ಅಪಾಯದ ಟ್ರಯಾಜ್',
    docTabA: 'ಆದ್ಯತೆಯ ತಾಯಂದಿರ ಫಾಲೋ-ಅಪ್ ಪಟ್ಟಿ',
    docTabB: 'ರೋಗಿಯ ವಿವರಣೆ & SHAP ಇನ್ಸ್‌ಪೆಕ್ಟರ್',
    docTabC: 'ಎಸ್ಕಲೇಷನ್ & ವಾಟ್ಸಾಪ್ ರೂಟಿಂಗ್ ಕೇಂದ್ರ',

    docQueueTitle: 'ಆದ್ಯತೆಯ ತಾಯಂದಿರ ಫಾಲೋ-ಅಪ್ ಪಟ್ಟಿ (ಕರ್ನಾಟಕ ತಂಡ)',
    docQueueSubtitle:
      'ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್ ವ್ಯತ್ಯಾಸ ಮತ್ತು ನಡವಳಿಕೆಯ ಸಂಕೇತಗಳ ಆಧಾರದ ಮೇಲೆ ಸಮ್ಮತಿಸಿದ ಬಾಣಂತಿಯರ ಪಟ್ಟಿ.',
    filterAll: 'ಎಲ್ಲಾ ತಾಯಂದಿರು (6)',
    filterHigh: 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಬದಲಾವಣೆ',
    filterModerate: 'ಸಾಧಾರಣ ಬದಲಾವಣೆ',
    filterLow: 'ಆರೋಗ್ಯಕರ ಬೇಸ್‌ಲೈನ್',
    searchPatientPlaceholder: 'ತಾಯಿಯ ಹೆಸರು, ನಗರ ಅಥವಾ ಆಸ್ಪತ್ರೆ ಐಡಿ ಮೂಲಕ ಹುಡುಕಿ...',
    thMotherProfile: 'ತಾಯಿಯ ಹೆಸರು, ವಯಸ್ಸು, ವಾರ & ಐಡಿ',
    thConsentStatus: 'ಸಮ್ಮತಿ ಸ್ಥಿತಿ',
    thRiskSignal: 'ಅಪಾಯದ ಸಂಕೇತ ಮಟ್ಟ',
    thBaselineDev: 'ಬೇಸ್‌ಲೈನ್ ವ್ಯತ್ಯಾಸ %',
    thTopDrivers: 'ಪ್ರಮುಖ ಕಾರಣಗಳು',
    thFollowUpStatus: 'ಫಾಲೋ-ಅಪ್ ಸ್ಥಿತಿ',
    thAction: 'ಕ್ಲಿನಿಕಲ್ ಕ್ರಮ',
    consentVerifiedBadge: 'ಸ್ಪಷ್ಟ ಸಮ್ಮತಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    consentPausedBadge: 'ತಾಯಿಯಿಂದ ಸಮ್ಮತಿ ವಿರಾಮ',
    riskHighLabel: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    riskModLabel: 'ಸಾಧಾರಣ ಅಪಾಯ',
    riskLowLabel: 'ಆರೋಗ್ಯಕರ ಬೇಸ್‌ಲೈನ್',
    inspectBtn: 'SHAP & ಟ್ರಯಾಜ್ ವೀಕ್ಷಿಸಿ →',

    driverAnanya: 'ತಡರಾತ್ರಿ ತುಂಡಾದ ಸೆಷನ್‌ಗಳು + ಒತ್ತಡದ ಹುಡುಕಾಟ (Search)',
    driverPriya: 'ತಪ್ಪಿದ ಮನಸ್ಥಿತಿ ಚೆಕ್-ಇನ್ + ಆಹಾರ ಲಾಗ್ ಮರು-ಸಂಪಾದನೆ',
    driverSneha: 'ನಿರಂತರ ನಿದ್ರೆಯ ಅವಧಿ + ಸ್ಥಿರ ಬೇಸ್‌ಲೈನ್ ಲಯ',
    driverDivya: 'ರಾತ್ರಿ 3 ಗಂಟೆಯ ಆಪ್ ಸೆಷನ್ + ಕುಟುಂಬ ಹಂಚಿಕೆ ಇಳಿಕೆ',
    driverMeera: 'ರಾತ್ರಿ ಎಚ್ಚರದಲ್ಲಿ ಸಾಧಾರಣ ಹೆಚ್ಚಳ + ತಡವಾದ ಲಾಗ್',
    driverFarah: 'ಸಮತೋಲಿತ ಸಂಗಾತಿ ಸಹ-ಲಾಗಿಂಗ್ + ನಿಯಮಿತ ವಿಶ್ರಾಂತಿ',

    shapTitle: 'ಆಳವಾದ ರೋಗಿಯ ವಿವರಣೆ ಮತ್ತು SHAP ಫೀಚರ್ ಇನ್ಸ್‌ಪೆಕ್ಟರ್',
    shapSubtitle:
      'ತಾಯಿಯ ನಡವಳಿಕೆಯ ಮಾದರಿಯು ಅವರ 1–4 ವಾರಗಳ ಬೇಸ್‌ಲೈನ್‌ನಿಂದ ಏಕೆ ಬದಲಾಗಿದೆ ಎಂಬುದನ್ನು ವಿವರಿಸುವ XGBoost / scikit-learn ತೂಕಗಳು.',
    shapFeature1: '1. ತಡರಾತ್ರಿ ಆಪ್ ಸೆಷನ್‌ಗಳು / ತುಂಡಾದ ನಿದ್ರೆ',
    shapFeature2: '2. ಒತ್ತಡ-ಆಧಾರಿತ ಹುಡುಕಾಟ ಉದ್ದೇಶ (Distress Search)',
    shapFeature3: '3. ತಪ್ಪಿದ ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ಪದೇ ಪದೇ ಲಾಗ್ ತಿದ್ದುಪಡಿ',
    shapFeature4: '4. ಸ್ವಯಂಪ್ರೇರಿತ ಮನಸ್ಥಿತಿ ಚೆಕ್-ಇನ್ ಇಳಿಕೆ',
    shapFeature5: '5. ಸಂಗಾತಿ / ಕುಟುಂಬ ಹಂಚಿಕೆಯ ನಿಷ್ಕ್ರಿಯತೆ',
    trajectoryTitle: '7-ದಿನಗಳ ರೋಲಿಂಗ್ ಅಪಾಯದ ಗ್ರಾಫ್ vs ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್',
    trajectorySubtitle: 'ತಾಯಿಯ 1–4 ವಾರಗಳ ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್‌ನಿಂದ ಪ್ರಸ್ತುತ ವಾರದ ವ್ಯತ್ಯಾಸದ ಗ್ರಾಫ್.',
    soapNoteTitle: 'ಜೆಮಿನಿ ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ ಟಿಪ್ಪಣಿ (SOAP ಮಾದರಿ)',
    soapNoteSubtitle:
      'ಪ್ರಸೂತಿ ತಜ್ಞರು (OB-GYN) ಮತ್ತು ಕೌನ್ಸಿಲರ್‌ಗಾಗಿ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ — ರೋಗನಿರ್ಣಯವಲ್ಲದ ನಿರ್ಧಾರ ಬೆಂಬಲ.',
    soapAnanya:
      'S (ನಡವಳಿಕೆಯ ಸಂಕೇತ): 28 ವರ್ಷದ ತಾಯಿ (6 ವಾರಗಳ ಬಾಣಂತನ, ಬೆಂಗಳೂರು) ತಮ್ಮ 1–4 ವಾರಗಳ ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್‌ಗಿಂತ +64% ವ್ಯತ್ಯಾಸವನ್ನು ತೋರಿಸುತ್ತಿದ್ದಾರೆ, ರಾತ್ರಿ 02:15 AM ಮತ್ತು 03:40 AM ಕ್ಕೆ ಒತ್ತಡದ ಹುಡುಕಾಟ ನಡೆಸಿದ್ದಾರೆ.\nO (ಆಬ್ಜೆಕ್ಟಿವ್ ಟೆಲಿಮೆಟ್ರಿ): ರಾತ್ರಿ 1–4 ಗಂಟೆಯ ನಡುವೆ 4 ತುಂಡಾದ ಆಪ್ ಸೆಷನ್‌ಗಳು (ಸಾಮಾನ್ಯ 1 ಕ್ಕೆ ಹೋಲಿಸಿದರೆ); 3 ತಪ್ಪಿದ ಮನಸ್ಥಿತಿ ಚೆಕ್-ಇನ್‌ಗಳು; 2 ಆಹಾರ ಲಾಗ್ ತಿದ್ದುಪಡಿಗಳು.\nA (ಮೌಲ್ಯಮಾಪನ): ಹೆಚ್ಚಿನ ನಡವಳಿಕೆಯ ದಣಿವು ಮತ್ತು ಭಾವನಾತ್ಮಕ ಒತ್ತಡದ ಸಂಕೇತ (82/100). ಇದು ಸ್ವತಂತ್ರ PPD ರೋಗನಿರ್ಣಯವಲ್ಲ; ಮಾನವ ಕೌನ್ಸಿಲರ್ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ.\nP (ಯೋಜನೆ): 1) ಪತಿ ರೋಹನ್ ಶರ್ಮಾ ಅವರಿಗೆ ಸಮ್ಮತಿಸಲಾದ ವಾಟ್ಸಾಪ್ ಬೆಂಬಲ ಸಂದೇಶ ಕಳುಹಿಸಿ, 2) ತಾಯಿಯ ಆಪ್‌ಗೆ ದೃಢೀಕೃತ EPDS ಲಿಂಕ್ ಕಳುಹಿಸಿ, 3) 24 ಗಂಟೆಗಳ ಒಳಗೆ ಕೌನ್ಸಿಲರ್ ಕರೆಯನ್ನು ನಿಗದಿಪಡಿಸಿ.',
    soapPriya:
      'S: 31 ವರ್ಷದ ತಾಯಿ (4 ವಾರಗಳ ಬಾಣಂತನ, ಮೈಸೂರು) ಬೇಸ್‌ಲೈನ್‌ಗಿಂತ +34% ಬದಲಾವಣೆ.\nO: ಅಪಾಯದ ಸಂಕೇತ 56/100 (ಸಾಧಾರಣ). ರಾತ್ರಿ 2 ತುಂಡಾದ ಸೆಷನ್‌ಗಳು.\nA: ಸಾಧಾರಣ ನಿದ್ರೆಯ ಕೊರತೆ ಮತ್ತು ಆಯಾಸ.\nP: ಸಂಗಾತಿಗೆ ವಾಟ್ಸಾಪ್ ಸಂದೇಶ ಮತ್ತು 5ನೇ ವಾರದಲ್ಲಿ EPDS ತಪಾಸಣೆ.',
    soapSneha:
      'S: 26 ವರ್ಷದ ತಾಯಿ (9 ವಾರಗಳ ಬಾಣಂತನ, ಹುಬ್ಬಳ್ಳಿ) ಸ್ಥಿರವಾದ ದಿನಚರಿಯನ್ನು ಹೊಂದಿದ್ದಾರೆ.\nO: ಅಪಾಯದ ಸಂಕೇತ 18/100 (+4% ವ್ಯತ್ಯಾಸ).\nA: ಆರೋಗ್ಯಕರ ಬೇಸ್‌ಲೈನ್.\nP: ಸಾಮಾನ್ಯ ಬಾಣಂತನದ ಕ್ಷೇಮ ಬೆಂಬಲ ಮುಂದುವರಿಸಿ.',
    soapDivya:
      'S: 29 ವರ್ಷದ ತಾಯಿ (5 ವಾರಗಳ ಬಾಣಂತನ, ಮಂಗಳೂರು) ತಡರಾತ್ರಿ ಆಪ್ ಬಳಕೆಯಲ್ಲಿ +58% ವ್ಯತ್ಯಾಸ.\nO: ಅಪಾಯದ ಸಂಕೇತ 76/100 (ಹೆಚ್ಚು).\nA: ರಾತ್ರಿಯ ತೀವ್ರ ಆಯಾಸದ ಮಾದರಿ, ವೈದ್ಯರ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.\nP: ಕೌನ್ಸಿಲರ್ ಕರೆ ಮತ್ತು ಸಂಗಾತಿಗೆ ವಾಟ್ಸಾಪ್ ಸಂದೇಶ.',
    soapMeera:
      'S: 33 ವರ್ಷದ ತಾಯಿ (7 ವಾರಗಳ ಬಾಣಂತನ, ಬೆಳಗಾವಿ) +29% ವ್ಯತ್ಯಾಸ.\nO: ಅಪಾಯದ ಸಂಕೇತ 49/100 (ಸಾಧಾರಣ).\nA: ಸಾಧಾರಣ ತಾಯಿಯ ಆಯಾಸ.\nP: ವಿಶ್ರಾಂತಿ ಚೆಕ್-ಇನ್ ಮತ್ತು ನಿಯಮಿತ ಫಾಲೋ-ಅಪ್.',
    soapFarah:
      'S: 27 ವರ್ಷದ ತಾಯಿ (8 ವಾರಗಳ ಬಾಣಂತನ, ಕಲಬುರಗಿ) ಸ್ಥಿರ ಲಾಗಿಂಗ್ ಮಾದರಿ.\nO: ಅಪಾಯದ ಸಂಕೇತ 22/100 (+6% ವ್ಯತ್ಯಾಸ).\nA: ಕಡಿಮೆ ಅಪಾಯ, ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ.\nP: 10-ವಾರಗಳ ಸಾಮಾನ್ಯ ತಪಾಸಣೆ.',

    escalationTitle: 'ಮಾನವ-ಪರಿಶೀಲಿತ (Human-in-the-Loop) ಎಸ್ಕಲೇಷನ್ & ವಾಟ್ಸಾಪ್ ರೂಟಿಂಗ್ ಕೇಂದ್ರ',
    escalationSubtitle:
      'ತಾಯಿಯ ಕಂಪ್ಯಾನಿಯನ್ ಆಪ್‌ನೊಂದಿಗೆ ತಕ್ಷಣವೇ ಸಿಂಕ್ ಆಗುವ ಸಮ್ಮತಿಸಲಾದ ವೈದ್ಯಕೀಯ ಮತ್ತು ಕುಟುಂಬ ಬೆಂಬಲ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ.',
    action1TriggerWhatsapp: 'ಪತಿಗೆ ಸಮ್ಮತಿಸಲಾದ ವಾಟ್ಸಾಪ್ ಬೆಂಬಲ ಸಂದೇಶ ಕಳುಹಿಸಿ',
    action1Desc:
      'ಯಾವುದೇ ವೈದ್ಯಕೀಯ ಡೇಟಾವನ್ನು ಬಹಿರಂಗಪಡಿಸದೆ ಪತಿ/ಕುಟುಂಬಕ್ಕೆ ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಪ್ರಾಯೋಗಿಕ ಸಹಾಯದ ಸಂದೇಶ ಕಳುಹಿಸುತ್ತದೆ.',
    action2SendEpds: 'ತಾಯಿಯ ಆಪ್‌ಗೆ ದೃಢೀಕೃತ EPDS ತಪಾಸಣಾ ಲಿಂಕ್ ಕಳುಹಿಸಿ',
    action2Desc:
      'ತಾಯಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ 2-ನಿಮಿಷದ ಸ್ವಯಂಪ್ರೇರಿತ EPDS ತಪಾಸಣಾ ಕಾರ್ಡ್ ಅನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತದೆ.',
    action3AssignCounsellor: 'ಪೆರಿನೇಟಲ್ ಕೌನ್ಸಿಲರ್ ಕರೆಯನ್ನು ನಿಯೋಜಿಸಿ & ಕ್ಲಿನಿಕಲ್ ಟಿಪ್ಪಣಿ ದಾಖಲಿಸಿ',
    action3Desc:
      'ರೋಗಿಯ ಸ್ಥಿತಿಯನ್ನು ದೃಢೀಕೃತ ಸಮಯದೊಂದಿಗೆ "In Care Pathway" ಗೆ ನವೀಕರಿಸುತ್ತದೆ.',
    clinicalNoteInputPlaceholder:
      'ವೈದ್ಯರ ವೀಕ್ಷಣೆ ಅಥವಾ ಕೌನ್ಸಿಲರ್ ಟಿಪ್ಪಣಿ ನಮೂದಿಸಿ (ಉದಾ: "ತಾಯಿಯೊಂದಿಗೆ ಮಾತನಾಡಲಾಗಿದೆ; ಶುಕ್ರವಾರ ಟೆಲಿ-ಕೌನ್ಸಿಲಿಂಗ್ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ")...',
    clinicalLogHistoryTitle: 'ಕ್ಲಿನಿಕಲ್ ಕೇರ್ ಪಾತ್‌ವೇ ದಾಖಲೆಗಳು',

    aboutModalTitle: 'ನರ್ಚರ್‌ಮೈಂಡ್ ಎಐ (NurtureMind AI) ಎಂದರೇನು?',
    aboutIntroText:
      'ಹೆರಿಗೆಯ ನಂತರದ ಮೊದಲ ಕೆಲವು ವಾರಗಳಲ್ಲಿ, ಅನೇಕ ತಾಯಂದಿರು ತೀವ್ರ ನಿದ್ರೆಯ ಕೊರತೆ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಆಯಾಸವನ್ನು ಮೌನವಾಗಿ ಅನುಭವಿಸುತ್ತಾರೆ. ನರ್ಚರ್‌ಮೈಂಡ್ ಎಐ ತಾಯಿಯ ಪೂರ್ಣ ಸಮ್ಮತಿಯೊಂದಿಗೆ ದೈನಂದಿನ ಮಗುವಿನ ಆರೈಕೆ ಲಾಗ್‌ಗಳಿಂದ (ಹಾಲುಣಿಸುವಿಕೆ, ನಿದ್ರೆ ಮತ್ತು 10-ಸೆಕೆಂಡ್ ಚೆಕ್-ಇನ್) ಆರಂಭಿಕ ಸಂಕೇತಗಳನ್ನು ಗುರುತಿಸಿ ಕುಟುಂಬ ಮತ್ತು ವೈದ್ಯರ ಬೆಂಬಲವನ್ನು ಸಕಾಲದಲ್ಲಿ ತಲುಪಿಸುತ್ತದೆ.',
    aboutStep1Title: '01. ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಹೊರೆಯಿಲ್ಲದ ದೈನಂದಿನ ಆರೈಕೆ',
    aboutStep1Desc:
      'ತಾಯಂದಿರು ಮಗುವಿನ ಹಾಲುಣಿಸುವಿಕೆ, ನಿದ್ರೆ ಮತ್ತು ಪ್ರಶ್ನೆಗಳನ್ನು ದಾಖಲಿಸಲು ಈ ಆಪ್ ಬಳಸುತ್ತಾರೆ — ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನದೊಂದಿಗೆ.',
    aboutStep2Title: '02. ವೈಯಕ್ತಿಕ ಬೇಸ್‌ಲೈನ್‌ನೊಂದಿಗೆ ಸ್ಪಷ್ಟ ಹೋಲಿಕೆ',
    aboutStep2Desc:
      'ಯಾವುದೇ ಕಠಿಣ ನಿಯಮಗಳ ಬದಲಿಗೆ, ಪ್ರತಿ ತಾಯಿಯ ಪ್ರಸ್ತುತ ವಾರವನ್ನು ಅವರದೇ ಆದ 1–4 ವಾರಗಳ ವೈಯಕ್ತಿಕ ದಿನಚರಿಗೆ ಹೋಲಿಸಿ ಬದಲಾವಣೆಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸುತ್ತದೆ.',
    aboutStep3Title: '03. ಕುಟುಂಬ ಮತ್ತು ವೈದ್ಯರಿಂದ ಸಕಾಲಿಕ ಬೆಂಬಲ',
    aboutStep3Desc:
      'ಆಯಾಸ ಹೆಚ್ಚಾದಾಗ ಪತಿಗೆ ಸೌಮ್ಯ ವಾಟ್ಸಾಪ್ ಸಂದೇಶ ಕಳುಹಿಸಬಹುದು ಹಾಗೂ ಅಗತ್ಯವಿದ್ದಾಗ ವೈದ್ಯರು ಮತ್ತು ಕೌನ್ಸಿಲರ್‌ಗಳೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕ ಸಾಧಿಸಬಹುದು.',
    b2b2cModelTitle: 'ತಾಯಿ, ಕುಟುಂಬ ಮತ್ತು ಆಸ್ಪತ್ರೆಯ ಸಮನ್ವಯ',
    b2b2cModelDesc:
      'ತಾಯಂದಿರಿಗೆ ಮನೆಯಲ್ಲಿಯೇ ನಿರಂತರ ಬೆಂಬಲ ದೊರೆಯುತ್ತದೆ ಮತ್ತು ವೈದ್ಯಕೀಯ ತಂಡಕ್ಕೆ ಸಕಾಲದಲ್ಲಿ ಆರೈಕೆ ನೀಡಲು ನೆರವಾಗುತ್ತದೆ.',
    privacyModalTitle: 'ಗೌಪ್ಯತೆ-ಮೊದಲು (Privacy-by-Design) & ವೈದ್ಯಕೀಯ ನೈತಿಕತೆ',
    privacyPillar1Title: 'ಸ್ವತಂತ್ರ ರೋಗನಿರ್ಣಯ ಸಾಧನವಲ್ಲ',
    privacyPillar1Desc:
      'ನರ್ಚರ್‌ಮೈಂಡ್ ಎಐ ಎಂದಿಗೂ ಪ್ರಸವಾನಂತರದ ಖಿನ್ನತೆಯನ್ನು ನಿರ್ಣಯಿಸುವುದಿಲ್ಲ. ಇದು ಸಕಾಲಿಕ ಮಾನವ ಬೆಂಬಲಕ್ಕಾಗಿ ಆರಂಭಿಕ ಸಂಕೇತಗಳನ್ನು ಮಾತ್ರ ನೀಡುತ್ತದೆ.',
    privacyPillar2Title: 'ಸಂಗಾತಿಯ ಗೌಪ್ಯತೆಯ ಗಡಿ',
    privacyPillar2Desc:
      'ವಾಟ್ಸಾಪ್ ಸಂದೇಶಗಳು ಪ್ರಾಯೋಗಿಕ ಸಹಾಯವನ್ನು ಮಾತ್ರ ಸೂಚಿಸುತ್ತವೆ ಮತ್ತು ಖಾಸಗಿ ಹುಡುಕಾಟ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸ್ಕೋರ್ ಅನ್ನು ಎಂದಿಗೂ ತೋರಿಸುವುದಿಲ್ಲ.',
    privacyPillar3Title: 'ಸಂಪೂರ್ಣ ನಿಯಂತ್ರಣದ ಸಮ್ಮತಿ (DPDP ಕಾಯ್ದೆ 2023 ಕ್ಕೆ ಅನುಗುಣವಾಗಿ)',
    privacyPillar3Desc:
      'ಪ್ರತಿಯೊಬ್ಬ ತಾಯಿಯು ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಸಂದೇಶಗಳನ್ನು ವಿರಾಮಗೊಳಿಸಬಹುದು.',
    backToGatewayBtn: '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
  },
};

export function speakText(
  text: string,
  lang: LanguageCode,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<LanguageCode, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
    };
    utterance.lang = langMap[lang] || 'en-IN';
    utterance.rate = 0.96;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const targetPrefix = lang === 'en' ? 'en' : lang === 'hi' ? 'hi' : 'kn';
    const matchingVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase())) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

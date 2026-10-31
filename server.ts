import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { initialMothers, initialDoctors } from './src/data/initialMothers.ts';
import {
  type MotherProfile,
  type DoctorProfile,
  applyNewActivityLog,
  evaluateSearchDistress,
  createNewDoctorProfile,
  createNewMotherProfile,
  verifyMotherCredentials,
  verifyDoctorCredentials,
} from './src/utils/riskEngine.ts';
import {
  generateSupportAnswerFallback,
  type SupportSearchAnswer,
} from './src/utils/supportSearchAi.ts';
import { type LanguageCode } from './src/i18n/translations.ts';

const CLOUD_DB_FILE = '/tmp/nurturemind-cloud-db-v2.json';

interface PersistedCloudState {
  doctors: DoctorProfile[];
  mothers: MotherProfile[];
  updatedAt: string;
}

function loadCloudStateFromDisk(): PersistedCloudState {
  try {
    if (fs.existsSync(CLOUD_DB_FILE)) {
      const raw = fs.readFileSync(CLOUD_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as PersistedCloudState;
      if (
        Array.isArray(parsed.doctors) &&
        parsed.doctors.length > 0 &&
        Array.isArray(parsed.mothers) &&
        parsed.mothers.length > 0
      ) {
        return parsed;
      }
    }
  } catch {
    // Fallback to initial cohort
  }
  return {
    doctors: structuredClone(initialDoctors),
    mothers: structuredClone(initialMothers),
    updatedAt: new Date().toISOString(),
  };
}

function saveCloudStateToDisk(doctors: DoctorProfile[], mothers: MotherProfile[]) {
  try {
    const payload: PersistedCloudState = {
      doctors,
      mothers,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CLOUD_DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch {
    // Ignore disk write errors in read-only environments
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  const initialDiskState = loadCloudStateFromDisk();
  let doctorsStore: DoctorProfile[] = initialDiskState.doctors;
  let mothersStore: MotherProfile[] = initialDiskState.mothers;

  const persistCurrentStore = () => {
    saveCloudStateToDisk(doctorsStore, mothersStore);
  };

  // Healthcheck for Google Cloud Run startup probes
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ ok: true, status: 'healthy', port: PORT });
  });

  // 1. GET /api/db/state — Fetch full shared cloud database state across devices
  app.get('/api/db/state', (_req, res) => {
    res.json({
      ok: true,
      doctors: doctorsStore,
      mothers: mothersStore,
      updatedAt: new Date().toISOString(),
    });
  });

  app.get('/api/mothers', (_req, res) => {
    res.json({ mothers: mothersStore, doctors: doctorsStore });
  });

  app.get('/api/doctors', (_req, res) => {
    res.json({ doctors: doctorsStore });
  });

  // 2. POST /api/db/sync — Merge & persist multi-device state
  app.post('/api/db/sync', (req, res) => {
    const { doctors, mothers } = req.body || {};
    if (Array.isArray(doctors) && doctors.length > 0) {
      // Merge by id/systemId so new registrations from any laptop/phone are preserved
      const map = new Map<string, DoctorProfile>();
      for (const d of doctorsStore) map.set(d.id, d);
      for (const d of doctors) map.set(d.id, d);
      doctorsStore = Array.from(map.values());
    }
    if (Array.isArray(mothers) && mothers.length > 0) {
      const map = new Map<string, MotherProfile>();
      for (const m of mothersStore) map.set(m.id, m);
      for (const m of mothers) map.set(m.id, m);
      mothersStore = Array.from(map.values());
    }
    persistCurrentStore();
    res.json({
      ok: true,
      doctors: doctorsStore,
      mothers: mothersStore,
      syncedAt: new Date().toISOString(),
    });
  });

  // 3. POST /api/auth/login — Strict confidential authentication against database records
  app.post('/api/auth/login', (req, res) => {
    const { role, loginId = '', password = '' } = req.body || {};
    if (!String(loginId).trim() || !String(password).trim()) {
      res
        .status(400)
        .json({ ok: false, error: 'Unique ID / Email and Password are required.' });
      return;
    }

    if (role === 'mother') {
      const matched = verifyMotherCredentials(
        mothersStore,
        String(loginId),
        String(password)
      );
      if (!matched) {
        res.status(401).json({
          ok: false,
          error:
            'Invalid Unique ID / Email or Password. Please verify your credentials or Register Yourself.',
        });
        return;
      }

      res.json({
        ok: true,
        role: 'mother',
        motherId: matched.id,
        mother: matched,
        mothers: mothersStore,
        doctors: doctorsStore,
      });
      return;
    }

    const matchedDoc = verifyDoctorCredentials(
      doctorsStore,
      String(loginId),
      String(password)
    );
    if (!matchedDoc) {
      res.status(401).json({
        ok: false,
        error:
          'Invalid Doctor Unique ID / Email or Password. Please verify your clinical credentials or Register Yourself.',
      });
      return;
    }

    res.json({
      ok: true,
      role: 'doctor',
      doctorId: matchedDoc.id,
      doctor: matchedDoc,
      mothers: mothersStore,
      doctors: doctorsStore,
    });
  });

  // 4. POST /api/auth/register-doctor — Register a new Doctor with auto-generated NM-DOC-XXXX
  app.post('/api/auth/register-doctor', (req, res) => {
    const newDoc = createNewDoctorProfile(req.body || {});
    doctorsStore = [newDoc, ...doctorsStore];
    persistCurrentStore();
    res.json({ ok: true, doctor: newDoc, doctors: doctorsStore, mothers: mothersStore });
  });

  // 5. POST /api/auth/register-mother — Register a new Mother with auto-generated NM-MOM-XXXX
  app.post('/api/auth/register-mother', (req, res) => {
    const input = req.body || {};
    const codeOrId = String(input.doctorInviteCode || input.linkedDoctorId || '')
      .trim()
      .toLowerCase();
    const linkedDoc =
      doctorsStore.find(
        (d) =>
          d.id.toLowerCase() === codeOrId ||
          d.clinicCode.toLowerCase() === codeOrId ||
          d.systemId.toLowerCase() === codeOrId
      ) || doctorsStore[0];

    const newMother = createNewMotherProfile(input, linkedDoc);
    mothersStore = [newMother, ...mothersStore];
    doctorsStore = doctorsStore.map((d) =>
      d.id === linkedDoc.id && !d.assignedPatientIds.includes(newMother.id)
        ? { ...d, assignedPatientIds: [newMother.id, ...d.assignedPatientIds] }
        : d
    );
    persistCurrentStore();
    res.json({
      ok: true,
      mother: newMother,
      mothers: mothersStore,
      doctors: doctorsStore,
    });
  });

  // 6. POST /api/doctors/:id/onboard-patient — Doctor onboards a new patient directly
  app.post('/api/doctors/:id/onboard-patient', (req, res) => {
    const { id } = req.params;
    const input = req.body || {};
    const activeDoc =
      doctorsStore.find((d) => d.id === id || d.systemId === id) || doctorsStore[0];
    const newMother = createNewMotherProfile(
      {
        ...input,
        linkedDoctorId: activeDoc.id,
        doctorInviteCode: activeDoc.clinicCode,
        onboardedByDoctorName: activeDoc.fullName,
      },
      activeDoc
    );
    mothersStore = [newMother, ...mothersStore];
    doctorsStore = doctorsStore.map((d) =>
      d.id === activeDoc.id && !d.assignedPatientIds.includes(newMother.id)
        ? { ...d, assignedPatientIds: [newMother.id, ...d.assignedPatientIds] }
        : d
    );
    persistCurrentStore();
    res.json({
      ok: true,
      mother: newMother,
      mothers: mothersStore,
      doctors: doctorsStore,
    });
  });

  // 7. POST /api/mothers/:id/logs — Add a real-time care/mood/search log
  app.post('/api/mothers/:id/logs', (req, res) => {
    const { id } = req.params;
    const newLog = req.body;
    mothersStore = mothersStore.map((m) =>
      m.id === id ? applyNewActivityLog(m, newLog) : m
    );
    persistCurrentStore();
    const updated = mothersStore.find((m) => m.id === id);
    res.json({ ok: true, mother: updated, mothers: mothersStore });
  });

  // 8. PATCH /api/mothers/:id/consent — Update privacy & consent toggles
  app.patch('/api/mothers/:id/consent', (req, res) => {
    const { id } = req.params;
    const { consent } = req.body || {};
    mothersStore = mothersStore.map((m) =>
      m.id === id && consent ? { ...m, consent } : m
    );
    persistCurrentStore();
    const updated = mothersStore.find((m) => m.id === id);
    res.json({ ok: true, mother: updated, mothers: mothersStore });
  });

  // 9. POST /api/mothers/:id/epds — Save EPDS screening score & route to doctor
  app.post('/api/mothers/:id/epds', (req, res) => {
    const { id } = req.params;
    const { score, routeToDoctor } = req.body || {};
    mothersStore = mothersStore.map((m) => {
      if (m.id !== id) return m;
      const nextStatus = routeToDoctor ? 'Pending Clinician Review' : m.followUpStatus;
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
    persistCurrentStore();
    const updated = mothersStore.find((m) => m.id === id);
    res.json({ ok: true, mother: updated, mothers: mothersStore });
  });

  // 10. POST /api/mothers/:id/escalation — Partner nudge, EPDS link, or Counsellor assignment
  app.post('/api/mothers/:id/escalation', (req, res) => {
    const { id } = req.params;
    const { action, actionType, noteText } = req.body || {};
    const type = action || actionType;

    mothersStore = mothersStore.map((m) => {
      if (m.id !== id) return m;

      if (type === 'partner_nudge' || type === 'partnerNudge') {
        return {
          ...m,
          followUpStatus:
            m.followUpStatus === 'In Care Pathway' ? 'In Care Pathway' : 'Partner Nudged',
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
      }

      if (type === 'coordinator_call' || type === 'requestCall') {
        return {
          ...m,
          followUpStatus: 'In Care Pathway',
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
      }

      if (type === 'send_epds' || type === 'sendEpds') {
        return {
          ...m,
          epdsRequestedByDoctor: true,
          followUpStatus:
            m.followUpStatus === 'In Care Pathway' ? 'In Care Pathway' : 'EPDS Scheduled',
          clinicalNotes: [
            {
              id: `cn-${Date.now()}`,
              timestamp: 'Just now',
              author: 'Dr. Kavitha Rao',
              note: 'Dispatched validated EPDS self-screening invitation to Mother Companion App.',
            },
            ...m.clinicalNotes,
          ],
        };
      }

      if (type === 'assign_counsellor' || type === 'assignCounsellor') {
        return {
          ...m,
          followUpStatus: 'In Care Pathway',
          clinicalNotes: [
            {
              id: `cn-${Date.now()}`,
              timestamp: 'Just now',
              author: 'Dr. Kavitha Rao (OB-GYN)',
              note:
                noteText ||
                `Assigned Perinatal Counsellor outreach call for ${m.name}. Status updated to In Care Pathway.`,
            },
            ...m.clinicalNotes,
          ],
        };
      }

      return m;
    });

    persistCurrentStore();
    const updated = mothersStore.find((m) => m.id === id);
    res.json({ ok: true, mother: updated, mothers: mothersStore });
  });

  // 11. POST /api/support-search — AI Support Search Engine + Behavioural Log
  app.post('/api/support-search', async (req, res) => {
    const {
      query = '',
      lang = 'en',
      motherId = 'ananya',
      nightBurstTag = '1–4 AM Fragmented Burst',
      normalWindowTag = 'Within Routine Rhythm',
    } = req.body || {};

    const trimmedQuery = String(query).trim();
    if (!trimmedQuery) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const isDistress = evaluateSearchDistress(trimmedQuery);
    const isNight = trimmedQuery.toLowerCase().includes('3am') || isDistress;
    mothersStore = mothersStore.map((m) =>
      m.id === motherId
        ? applyNewActivityLog(m, {
            timestamp: isNight ? '03:15 AM' : '11:20 AM',
            category: 'In-App Search',
            detail: `Query: "${trimmedQuery}"`,
            isNightBurst: isNight,
            isDistressSignal: isDistress,
            baselineComparison: isDistress
              ? 'Distress-oriented query (+26% SHAP weight)'
              : isNight
              ? nightBurstTag
              : normalWindowTag,
          })
        : m
    );
    persistCurrentStore();

    const apiKey = process.env.GEMINI_API_KEY;
    const validKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY';

    if (validKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const languageName =
          lang === 'hi' ? 'Hindi (हिंदी)' : lang === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English';

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `A postpartum mother searched for: "${trimmedQuery}". Provide a warm, helpful, evidence-based answer in ${languageName}.`,
          config: {
            systemInstruction:
              'You are NurtureMind AI, a compassionate perinatal and newborn-care assistant. Never diagnose postpartum depression. Provide a clear summary, 3 practical actionable care steps, and a warm reassurance sentence.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                reassurance: { type: Type.STRING },
              },
              required: ['summary', 'steps', 'reassurance'],
            },
          },
        });

        const parsed = JSON.parse((response.text ?? '{}').trim());
        if (parsed.summary && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
          const answer: SupportSearchAnswer = {
            query: trimmedQuery,
            summary: parsed.summary,
            steps: parsed.steps.slice(0, 4),
            reassurance: parsed.reassurance || '',
            source: 'gemini-ai',
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
          res.json({ answer, mothers: mothersStore });
          return;
        }
      } catch {
        // Fall through to instant clinical knowledge engine
      }
    }

    const fallbackAnswer = generateSupportAnswerFallback(
      trimmedQuery,
      lang as LanguageCode
    );
    res.json({ answer: fallbackAnswer, mothers: mothersStore });
  });

  // 12. POST /api/gemini/companion — Personalized Gemini Empathetic Reflection
  app.post('/api/gemini/companion', async (req, res) => {
    const {
      motherName = 'Ananya',
      babyName = 'Baby Aarav',
      postpartumWeeks = 6,
      nightSessionsCount = 4,
      riskTier = 'high',
      lang = 'en',
    } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(200).json({ text: null, source: 'fallback' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const languageName =
        lang === 'hi' ? 'Hindi (हिंदी)' : lang === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Write a warm, empathetic, non-diagnostic 3-sentence reflection in ${languageName} for ${motherName} (${postpartumWeeks} weeks postpartum caring for ${babyName}) who had ${nightSessionsCount} late-night fragmented app sessions between 1 AM and 4 AM (current shift tier: ${riskTier}). Reassure her that exhaustion is not failure and suggest sharing one rest window with her family.`,
        config: {
          systemInstruction:
            'You are NurtureMind AI, a warm, non-diagnostic postpartum companion. Never diagnose postpartum depression. Respond only with the supportive message in the requested language.',
        },
      });

      res.json({ text: response.text || null, source: 'gemini' });
    } catch (error) {
      res.status(200).json({ text: null, error: String(error) });
    }
  });

  const distPath = path.join(process.cwd(), 'dist');
  const isProd =
    process.env.NODE_ENV === 'production' ||
    (fs.existsSync(path.join(distPath, 'index.html')) &&
      process.env.USE_VITE_DEV !== 'true' &&
      process.env.NODE_ENV === 'production');

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NurtureMind AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

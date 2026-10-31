import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  initialMothers,
  initialDoctors,
  initialCommunityPosts,
  initialPeerMessages,
} from './src/data/initialMothers.ts';
import {
  type MotherProfile,
  type DoctorProfile,
  type CommunityPost,
  type PeerDirectMessage,
  type NewDoctorRegistrationInput,
  type NewMotherRegistrationInput,
  createNewDoctorProfile,
  createNewMotherProfile,
  applyNewActivityLog,
  verifyMotherCredentials,
  verifyDoctorCredentials,
} from './src/utils/riskEngine.ts';
import {
  generateSupportAnswerFallback,
  type SupportSearchAnswer,
} from './src/utils/supportSearchAi.ts';
import { type LanguageCode } from './src/i18n/translations.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PERSIST_FILE_PATH = path.resolve('/tmp', 'nurturemind-cloud-db-v3.json');

interface CloudDBStore {
  doctors: DoctorProfile[];
  mothers: MotherProfile[];
  communityPosts: CommunityPost[];
  peerMessages: PeerDirectMessage[];
  updatedAt: string;
}

function loadPersistedCloudStore(): CloudDBStore {
  try {
    if (fs.existsSync(PERSIST_FILE_PATH)) {
      const raw = fs.readFileSync(PERSIST_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as CloudDBStore;
      if (
        Array.isArray(parsed.doctors) &&
        parsed.doctors.length > 0 &&
        Array.isArray(parsed.mothers) &&
        parsed.mothers.length > 0
      ) {
        return {
          doctors: parsed.doctors,
          mothers: parsed.mothers,
          communityPosts: Array.isArray(parsed.communityPosts)
            ? parsed.communityPosts
            : structuredClone(initialCommunityPosts),
          peerMessages: Array.isArray(parsed.peerMessages)
            ? parsed.peerMessages
            : structuredClone(initialPeerMessages),
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }
  } catch {
    // Fallback to initial cohort
  }
  return {
    doctors: structuredClone(initialDoctors),
    mothers: structuredClone(initialMothers),
    communityPosts: structuredClone(initialCommunityPosts),
    peerMessages: structuredClone(initialPeerMessages),
    updatedAt: new Date().toISOString(),
  };
}

function savePersistedCloudStore(store: CloudDBStore): void {
  try {
    fs.writeFileSync(PERSIST_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // Non-fatal in read-only environments
  }
}

let cloudStore: CloudDBStore = loadPersistedCloudStore();

function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of existing) {
    map.set(item.id, item);
  }
  for (const item of incoming) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // =========================================================================
  // 1. HEALTH & CLOUD DATABASE SYNC API ROUTES
  // =========================================================================
  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      status: 'healthy',
      port: PORT,
      doctorsCount: cloudStore.doctors.length,
      mothersCount: cloudStore.mothers.length,
      communityPostsCount: cloudStore.communityPosts.length,
      updatedAt: cloudStore.updatedAt,
    });
  });

  app.get('/api/db/state', (_req, res) => {
    res.json(cloudStore);
  });

  app.post('/api/db/sync', (req, res) => {
    const { doctors, mothers, communityPosts, peerMessages } = req.body as {
      doctors?: DoctorProfile[];
      mothers?: MotherProfile[];
      communityPosts?: CommunityPost[];
      peerMessages?: PeerDirectMessage[];
    };
    if (Array.isArray(doctors) && doctors.length > 0) {
      cloudStore.doctors = mergeById(cloudStore.doctors, doctors);
    }
    if (Array.isArray(mothers) && mothers.length > 0) {
      cloudStore.mothers = mergeById(cloudStore.mothers, mothers);
    }
    if (Array.isArray(communityPosts) && communityPosts.length > 0) {
      cloudStore.communityPosts = mergeById(cloudStore.communityPosts, communityPosts);
    }
    if (Array.isArray(peerMessages) && peerMessages.length > 0) {
      cloudStore.peerMessages = mergeById(cloudStore.peerMessages, peerMessages);
    }
    cloudStore.updatedAt = new Date().toISOString();
    savePersistedCloudStore(cloudStore);

    res.json({
      doctors: cloudStore.doctors,
      mothers: cloudStore.mothers,
      communityPosts: cloudStore.communityPosts,
      peerMessages: cloudStore.peerMessages,
      syncedAt: cloudStore.updatedAt,
    });
  });

  // Strict Confidential Authentication Verification Endpoint
  app.post('/api/auth/login', (req, res) => {
    const { role, identifier, password } = req.body as {
      role?: 'mother' | 'doctor';
      identifier?: string;
      password?: string;
    };

    if (!role || !identifier || !password) {
      return res.status(400).json({
        error: 'Please enter both your Unique ID / Registered Email and Password.',
      });
    }

    if (role === 'doctor') {
      const matched = verifyDoctorCredentials(cloudStore.doctors, identifier, password);
      if (!matched) {
        return res.status(401).json({
          error: 'Invalid Clinician Unique ID / Email or Password.',
        });
      }
      return res.json({ doctor: matched });
    }

    const matchedMother = verifyMotherCredentials(cloudStore.mothers, identifier, password);
    if (!matchedMother) {
      return res.status(401).json({
        error: 'Invalid Mother Unique ID / Email or Password.',
      });
    }
    return res.json({ mother: matchedMother });
  });

  app.post('/api/auth/register-doctor', (req, res) => {
    const input = req.body as NewDoctorRegistrationInput;
    if (!input?.fullName || !input?.email) {
      return res.status(400).json({ error: 'Full Name and Email are required.' });
    }
    const newDoc = createNewDoctorProfile(input);
    cloudStore.doctors = [newDoc, ...cloudStore.doctors];
    cloudStore.updatedAt = new Date().toISOString();
    savePersistedCloudStore(cloudStore);
    return res.status(201).json(newDoc);
  });

  app.post('/api/auth/register-mother', (req, res) => {
    const input = req.body as NewMotherRegistrationInput;
    if (!input?.name || !input?.email) {
      return res.status(400).json({ error: 'Name and Email are required.' });
    }
    const codeOrId = (input.doctorInviteCode || input.linkedDoctorId || '')
      .trim()
      .toLowerCase();
    const linkedDoc =
      cloudStore.doctors.find(
        (d) =>
          d.id.toLowerCase() === codeOrId ||
          d.clinicCode.toLowerCase() === codeOrId ||
          d.systemId.toLowerCase() === codeOrId
      ) || cloudStore.doctors[0];

    const newMother = createNewMotherProfile(input, linkedDoc);
    cloudStore.mothers = [newMother, ...cloudStore.mothers];
    cloudStore.doctors = cloudStore.doctors.map((d) =>
      d.id === linkedDoc.id && !d.assignedPatientIds.includes(newMother.id)
        ? { ...d, assignedPatientIds: [newMother.id, ...d.assignedPatientIds] }
        : d
    );
    cloudStore.updatedAt = new Date().toISOString();
    savePersistedCloudStore(cloudStore);
    return res.status(201).json({ mother: newMother, linkedDoctor: linkedDoc });
  });

  app.get('/api/mothers', (_req, res) => {
    res.json(cloudStore.mothers);
  });

  app.get('/api/doctors', (_req, res) => {
    res.json(cloudStore.doctors);
  });

  app.post('/api/mothers/:id/logs', (req, res) => {
    const { id } = req.params;
    const newLog = req.body;
    const idx = cloudStore.mothers.findIndex((m) => m.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Mother profile not found' });
    }
    cloudStore.mothers[idx] = applyNewActivityLog(cloudStore.mothers[idx], newLog);
    cloudStore.updatedAt = new Date().toISOString();
    savePersistedCloudStore(cloudStore);
    return res.json(cloudStore.mothers[idx]);
  });

  // =========================================================================
  // 2. AI SUPPORT SEARCH ENGINE ENDPOINT
  // =========================================================================
  app.post('/api/support-search', async (req, res) => {
    const { query, lang = 'en', motherName, babyName, postpartumWeeks } = req.body as {
      query?: string;
      lang?: LanguageCode;
      motherName?: string;
      babyName?: string;
      postpartumWeeks?: number;
    };

    const cleanQuery = (query || '').trim();
    if (!cleanQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const fallbackAnswer = generateSupportAnswerFallback(cleanQuery, lang);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json(fallbackAnswer);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const langName =
        lang === 'hi' ? 'Hindi (हिंदी)' : lang === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English';

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are NurtureMind AI, a warm, non-diagnostic perinatal & newborn-care companion for ${
          motherName || 'a mother'
        } (${postpartumWeeks || 6} weeks postpartum, caring for ${babyName || 'her newborn'}).
The mother searched in the app: "${cleanQuery}".
Respond strictly in ${langName} with practical, compassionate guidance.`,
        config: {
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

      if (response.text) {
        const parsed = JSON.parse(response.text) as {
          summary?: string;
          steps?: string[];
          reassurance?: string;
        };
        if (parsed.summary && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
          const liveAnswer: SupportSearchAnswer = {
            query: cleanQuery,
            summary: parsed.summary,
            steps: parsed.steps.slice(0, 4),
            reassurance: parsed.reassurance || fallbackAnswer.reassurance,
            source: 'gemini-ai',
            timestamp: fallbackAnswer.timestamp,
          };
          return res.json(liveAnswer);
        }
      }
    } catch {
      // Fallback to built-in clinical support knowledge base
    }

    return res.json(fallbackAnswer);
  });

  // =========================================================================
  // 3. VITE DEV MIDDLEWARE OR PRODUCTION STATIC ASSETS
  // =========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NurtureMind AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

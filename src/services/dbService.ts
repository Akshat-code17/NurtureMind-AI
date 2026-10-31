import {
  type MotherProfile,
  type DoctorProfile,
  type SessionAuth,
} from '../utils/riskEngine.ts';
import { initialMothers, initialDoctors } from '../data/initialMothers.ts';

export const DB_STORAGE_KEYS = {
  DOCTORS: 'users_doctors_v2',
  MOTHERS: 'users_mothers_v2',
  SESSION: 'session_auth_v2',
  CLOUD_SETTINGS: 'nurturemind_cloud_settings_v2',
} as const;

export interface CloudDatabaseSettings {
  mode: 'builtin-cloud' | 'supabase-live';
  supabaseUrl: string;
  supabaseAnonKey: string;
  lastSyncedAt: string;
  status: 'connected' | 'syncing' | 'local-fallback';
}

export interface DatabaseStateSnapshot {
  doctors: DoctorProfile[];
  mothers: MotherProfile[];
  updatedAt: string;
}

const DEFAULT_CLOUD_SETTINGS: CloudDatabaseSettings = {
  mode: 'builtin-cloud',
  supabaseUrl: '',
  supabaseAnonKey: '',
  lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  status: 'connected',
};

export const dbService = {
  loadLocalDoctors(): DoctorProfile[] {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEYS.DOCTORS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial cohort
    }
    return structuredClone(initialDoctors);
  },

  loadLocalMothers(): MotherProfile[] {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEYS.MOTHERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial cohort
    }
    return structuredClone(initialMothers);
  },

  loadSession(): SessionAuth | null {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEYS.SESSION);
      if (raw) return JSON.parse(raw) as SessionAuth;
    } catch {}
    return null;
  },

  saveSession(session: SessionAuth | null): void {
    try {
      if (session) {
        localStorage.setItem(DB_STORAGE_KEYS.SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(DB_STORAGE_KEYS.SESSION);
      }
    } catch {}
  },

  loadCloudSettings(): CloudDatabaseSettings {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEYS.CLOUD_SETTINGS);
      if (raw) {
        return { ...DEFAULT_CLOUD_SETTINGS, ...JSON.parse(raw) };
      }
    } catch {}
    return DEFAULT_CLOUD_SETTINGS;
  },

  saveCloudSettings(settings: CloudDatabaseSettings): void {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.CLOUD_SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  saveLocalState(doctors: DoctorProfile[], mothers: MotherProfile[]): void {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
      localStorage.setItem(DB_STORAGE_KEYS.MOTHERS, JSON.stringify(mothers));
    } catch {}
  },

  async fetchCloudState(): Promise<DatabaseStateSnapshot | null> {
    const settings = this.loadCloudSettings();

    // 1. Optional Supabase REST sync if configured
    if (
      settings.mode === 'supabase-live' &&
      settings.supabaseUrl.trim() &&
      settings.supabaseAnonKey.trim()
    ) {
      try {
        const cleanUrl = settings.supabaseUrl.trim().replace(/\/$/, '');
        const res = await fetch(
          `${cleanUrl}/rest/v1/nurturemind_state?id=eq.global&select=*`,
          {
            headers: {
              apikey: settings.supabaseAnonKey.trim(),
              Authorization: `Bearer ${settings.supabaseAnonKey.trim()}`,
            },
          }
        );
        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows[0]?.payload) {
            return rows[0].payload as DatabaseStateSnapshot;
          }
        }
      } catch {
        // Fallback to built-in Cloud Run store
      }
    }

    // 2. Built-in Cloud Run shared JSON store
    try {
      const res = await fetch('/api/db/state');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.doctors) && Array.isArray(data.mothers)) {
          this.saveLocalState(data.doctors, data.mothers);
          return {
            doctors: data.doctors,
            mothers: data.mothers,
            updatedAt: data.updatedAt || new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fallback to local state
    }
    return null;
  },

  async pushCloudState(
    doctors: DoctorProfile[],
    mothers: MotherProfile[]
  ): Promise<DatabaseStateSnapshot> {
    this.saveLocalState(doctors, mothers);
    const settings = this.loadCloudSettings();

    // 1. Optional Supabase Live Sync push
    if (
      settings.mode === 'supabase-live' &&
      settings.supabaseUrl.trim() &&
      settings.supabaseAnonKey.trim()
    ) {
      try {
        const cleanUrl = settings.supabaseUrl.trim().replace(/\/$/, '');
        await fetch(`${cleanUrl}/rest/v1/nurturemind_state`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: settings.supabaseAnonKey.trim(),
            Authorization: `Bearer ${settings.supabaseAnonKey.trim()}`,
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            id: 'global',
            payload: {
              doctors,
              mothers,
              updatedAt: new Date().toISOString(),
            },
          }),
        });
      } catch {
        // Continue to built-in Cloud Run store
      }
    }

    // 2. Built-in Cloud Run shared store push
    try {
      const res = await fetch('/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctors, mothers }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.doctors) && Array.isArray(data.mothers)) {
          this.saveLocalState(data.doctors, data.mothers);
          return {
            doctors: data.doctors,
            mothers: data.mothers,
            updatedAt: data.syncedAt || new Date().toISOString(),
          };
        }
      }
    } catch {
      // LocalStorage already saved
    }

    return {
      doctors,
      mothers,
      updatedAt: new Date().toISOString(),
    };
  },
};

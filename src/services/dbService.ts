import {
  type MotherProfile,
  type DoctorProfile,
  type SessionAuth,
  type CommunityPost,
  type PeerDirectMessage,
  type SupportTicketRecord,
} from '../utils/riskEngine.ts';
import {
  initialMothers,
  initialDoctors,
  initialCommunityPosts,
  initialPeerMessages,
} from '../data/initialMothers.ts';
import {
  toRelationalDoctorRow,
  toRelationalMotherRow,
} from '../utils/telemetryParser.ts';

export const DEFAULT_SUPABASE_URL = 'https://lujzrkfbcwtikpyekzzq.supabase.co';

export const DB_STORAGE_KEYS = {
  DOCTORS: 'users_doctors_v3',
  MOTHERS: 'users_mothers_v3',
  COMMUNITY_POSTS: 'nurturemind_community_posts_v3',
  PEER_MESSAGES: 'nurturemind_peer_messages_v3',
  SUPPORT_TICKETS: 'nurturemind_support_tickets_v3',
  SESSION: 'nm_active_session',
  LEGACY_SESSION: 'session_auth_v3',
  CLOUD_SETTINGS: 'nurturemind_cloud_settings_v3',
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
  communityPosts?: CommunityPost[];
  peerMessages?: PeerDirectMessage[];
  supportTickets?: SupportTicketRecord[];
  updatedAt: string;
}

const DEFAULT_CLOUD_SETTINGS: CloudDatabaseSettings = {
  mode: 'builtin-cloud',
  supabaseUrl: DEFAULT_SUPABASE_URL,
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
        const parsed = JSON.parse(raw) as MotherProfile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m) => {
            const seedMatch = initialMothers.find((im) => im.id === m.id);
            return {
              ...m,
              abhaId: m.abhaId || seedMatch?.abhaId || '91-4829-3104-8821',
              abhaAddress:
                m.abhaAddress ||
                seedMatch?.abhaAddress ||
                `${m.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@abdm`,
              abhaVerified: m.abhaVerified ?? true,
            };
          });
        }
      }
    } catch {
      // Fallback to initial cohort
    }
    return structuredClone(initialMothers);
  },

  loadLocalCommunityPosts(): CommunityPost[] {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEYS.COMMUNITY_POSTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return structuredClone(initialCommunityPosts);
  },

  loadLocalPeerMessages(): PeerDirectMessage[] {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEYS.PEER_MESSAGES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return structuredClone(initialPeerMessages);
  },

  loadSession(): SessionAuth | null {
    try {
      const raw =
        localStorage.getItem(DB_STORAGE_KEYS.SESSION) ||
        localStorage.getItem(DB_STORAGE_KEYS.LEGACY_SESSION);
      if (raw) {
        const parsed = JSON.parse(raw) as SessionAuth;
        if (parsed && parsed.role && parsed.userId) {
          return { ...parsed, isLoggedIn: true };
        }
      }
    } catch {}
    return null;
  },

  saveSession(session: SessionAuth | null): void {
    try {
      if (session) {
        const payload = JSON.stringify({ ...session, isLoggedIn: true });
        localStorage.setItem(DB_STORAGE_KEYS.SESSION, payload);
        localStorage.setItem(DB_STORAGE_KEYS.LEGACY_SESSION, payload);
      } else {
        localStorage.removeItem(DB_STORAGE_KEYS.SESSION);
        localStorage.removeItem(DB_STORAGE_KEYS.LEGACY_SESSION);
      }
    } catch {}
  },

  loadCloudSettings(): CloudDatabaseSettings {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEYS.CLOUD_SETTINGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_CLOUD_SETTINGS,
          ...parsed,
          supabaseUrl: parsed.supabaseUrl || DEFAULT_SUPABASE_URL,
        };
      }
    } catch {}
    return DEFAULT_CLOUD_SETTINGS;
  },

  saveCloudSettings(settings: CloudDatabaseSettings): void {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.CLOUD_SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  loadSupportTickets(): SupportTicketRecord[] {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEYS.SUPPORT_TICKETS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return [];
  },

  async saveSupportTicket(ticket: SupportTicketRecord): Promise<SupportTicketRecord[]> {
    const existing = this.loadSupportTickets();
    const updated = [ticket, ...existing];
    try {
      localStorage.setItem(DB_STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(updated));
    } catch {}

    const settings = this.loadCloudSettings();
    const baseUrl = (settings.supabaseUrl || DEFAULT_SUPABASE_URL)
      .trim()
      .replace(/\/$/, '');

    if (settings.supabaseAnonKey.trim()) {
      const headers = {
        'Content-Type': 'application/json',
        apikey: settings.supabaseAnonKey.trim(),
        Authorization: `Bearer ${settings.supabaseAnonKey.trim()}`,
        Prefer: 'resolution=merge-duplicates',
      };
      fetch(`${baseUrl}/rest/v1/nurturemind_store`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          key: 'support_tickets',
          data: updated,
          updated_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    return updated;
  },

  saveLocalState(
    doctors: DoctorProfile[],
    mothers: MotherProfile[],
    communityPosts?: CommunityPost[],
    peerMessages?: PeerDirectMessage[]
  ): void {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
      localStorage.setItem(DB_STORAGE_KEYS.MOTHERS, JSON.stringify(mothers));
      if (communityPosts) {
        localStorage.setItem(
          DB_STORAGE_KEYS.COMMUNITY_POSTS,
          JSON.stringify(communityPosts)
        );
      }
      if (peerMessages) {
        localStorage.setItem(
          DB_STORAGE_KEYS.PEER_MESSAGES,
          JSON.stringify(peerMessages)
        );
      }
    } catch {}
  },

  async fetchCloudState(): Promise<DatabaseStateSnapshot | null> {
    const settings = this.loadCloudSettings();
    const baseUrl = (settings.supabaseUrl || DEFAULT_SUPABASE_URL)
      .trim()
      .replace(/\/$/, '');

    // 1. Direct Supabase PostgreSQL REST sync (`nurturemind_store`, `doctors`, `mothers`)
    if (settings.supabaseAnonKey.trim()) {
      try {
        const headers = {
          apikey: settings.supabaseAnonKey.trim(),
          Authorization: `Bearer ${settings.supabaseAnonKey.trim()}`,
        };
        const res = await fetch(
          `${baseUrl}/rest/v1/nurturemind_store?key=eq.global_state&select=*`,
          { headers }
        );
        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows[0]?.data) {
            const payload = rows[0].data as DatabaseStateSnapshot;
            if (Array.isArray(payload.doctors) && Array.isArray(payload.mothers)) {
              this.saveLocalState(
                payload.doctors,
                payload.mothers,
                payload.communityPosts,
                payload.peerMessages
              );
              return payload;
            }
          }
        }
      } catch {
        // Graceful fallback to built-in Cloud Run store & localStorage
      }
    }

    // 2. Built-in Cloud Run shared JSON store
    try {
      const res = await fetch('/api/db/state');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.doctors) && Array.isArray(data.mothers)) {
          this.saveLocalState(
            data.doctors,
            data.mothers,
            data.communityPosts,
            data.peerMessages
          );
          return {
            doctors: data.doctors,
            mothers: data.mothers,
            communityPosts: data.communityPosts || this.loadLocalCommunityPosts(),
            peerMessages: data.peerMessages || this.loadLocalPeerMessages(),
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
    mothers: MotherProfile[],
    communityPosts?: CommunityPost[],
    peerMessages?: PeerDirectMessage[]
  ): Promise<DatabaseStateSnapshot> {
    const postsToSync = communityPosts || this.loadLocalCommunityPosts();
    const messagesToSync = peerMessages || this.loadLocalPeerMessages();

    this.saveLocalState(doctors, mothers, postsToSync, messagesToSync);
    const settings = this.loadCloudSettings();
    const baseUrl = (settings.supabaseUrl || DEFAULT_SUPABASE_URL)
      .trim()
      .replace(/\/$/, '');

    // 1. Live Supabase REST sync to relational tables (`doctors`, `mothers`, `nurturemind_store`)
    if (settings.supabaseAnonKey.trim()) {
      const headers = {
        'Content-Type': 'application/json',
        apikey: settings.supabaseAnonKey.trim(),
        Authorization: `Bearer ${settings.supabaseAnonKey.trim()}`,
        Prefer: 'resolution=merge-duplicates',
      };

      const relationalDoctors = doctors.map(toRelationalDoctorRow);
      const relationalMothers = mothers.map(toRelationalMotherRow);

      Promise.allSettled([
        fetch(`${baseUrl}/rest/v1/doctors`, {
          method: 'POST',
          headers,
          body: JSON.stringify(relationalDoctors),
        }),
        fetch(`${baseUrl}/rest/v1/mothers`, {
          method: 'POST',
          headers,
          body: JSON.stringify(relationalMothers),
        }),
        fetch(`${baseUrl}/rest/v1/nurturemind_store`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            key: 'global_state',
            data: {
              doctors,
              mothers,
              communityPosts: postsToSync,
              peerMessages: messagesToSync,
              updatedAt: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          }),
        }),
      ]).catch(() => {});
    }

    // 2. Built-in Cloud Run shared store push
    try {
      const res = await fetch('/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctors,
          mothers,
          communityPosts: postsToSync,
          peerMessages: messagesToSync,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.doctors) && Array.isArray(data.mothers)) {
          this.saveLocalState(
            data.doctors,
            data.mothers,
            data.communityPosts || postsToSync,
            data.peerMessages || messagesToSync
          );
          return {
            doctors: data.doctors,
            mothers: data.mothers,
            communityPosts: data.communityPosts || postsToSync,
            peerMessages: data.peerMessages || messagesToSync,
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
      communityPosts: postsToSync,
      peerMessages: messagesToSync,
      updatedAt: new Date().toISOString(),
    };
  },
};

import React, { useState } from 'react';
import {
  X,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Database,
  KeyRound,
  Link2,
} from 'lucide-react';
import { type CloudDatabaseSettings } from '../services/dbService';

interface CloudSettingsModalProps {
  isOpen: boolean;
  settings: CloudDatabaseSettings;
  doctorsCount: number;
  mothersCount: number;
  onSaveSettings: (next: CloudDatabaseSettings) => Promise<void>;
  onSyncNow: () => Promise<void>;
  onClose: () => void;
}

export const CloudSettingsModal: React.FC<CloudSettingsModalProps> = ({
  isOpen,
  settings,
  doctorsCount,
  mothersCount,
  onSaveSettings,
  onSyncNow,
  onClose,
}) => {
  const [mode, setMode] = useState<'builtin-cloud' | 'supabase-live'>(settings.mode);
  const [supabaseUrl, setSupabaseUrl] = useState<string>(settings.supabaseUrl);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState<string>(
    settings.supabaseAnonKey
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await onSaveSettings({
        ...settings,
        mode,
        supabaseUrl: supabaseUrl.trim(),
        supabaseAnonKey: supabaseAnonKey.trim(),
        lastSyncedAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'connected',
      });
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cloud Database Settings"
      data-testid="cloud-settings-modal"
    >
      <div className="bg-white border border-[#E6DFD3] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E6DFD3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E3F2E6] border border-[#C5E3CC] flex items-center justify-center text-[#2E6F40] shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-[#1F2421]">
                Cloud Database Settings (Supabase / Live Sync)
              </h3>
              <p className="text-xs text-[#5A625D] mt-0.5">
                Multi-device persistence across laptops & phones
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Cloud Settings"
            className="p-1.5 rounded-lg text-[#5A625D] hover:text-[#1F2421] hover:bg-[#F7F2EB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Sync Status Card */}
        <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2E6F40]">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {mode === 'supabase-live'
                  ? 'Supabase REST + Cloud Run Hybrid Active'
                  : 'Built-In Cloud Run Multi-Device Store Active'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#5A625D]">
              Synced Records: {doctorsCount} Doctors · {mothersCount} Mothers · Last Sync:{' '}
              {settings.lastSyncedAt}
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              setIsSyncing(true);
              await onSyncNow();
              setIsSyncing(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E3F2E6] border border-[#C5E3CC] text-xs font-semibold text-[#2E6F40] flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F2EB] border border-[#E6DFD3] rounded-xl">
            <button
              type="button"
              onClick={() => setMode('builtin-cloud')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'builtin-cloud'
                  ? 'bg-[#2E6F40] text-white shadow-2xs'
                  : 'text-[#4A524D] hover:text-[#1F2421]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Built-in Cloud Store (Zero Setup)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('supabase-live')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'supabase-live'
                  ? 'bg-[#2E6F40] text-white shadow-2xs'
                  : 'text-[#4A524D] hover:text-[#1F2421]'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Supabase / External Cloud</span>
            </button>
          </div>

          {mode === 'supabase-live' ? (
            <div className="space-y-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <div>
                <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                  Supabase Project URL (or Cloud REST Endpoint)
                </label>
                <div className="relative">
                  <Link2 className="w-3.5 h-3.5 text-[#5A625D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                  Supabase Public Anon Key
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-[#5A625D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#E3F2E6]/50 border border-[#C5E3CC] text-xs text-[#3A403C] leading-relaxed">
              <strong>Zero-Configuration Cloud Sync Active:</strong> All registered
              doctors, onboarded mothers, unique login credentials (<code className="font-mono">NM-MOM-XXXX</code>),
              and activity logs automatically sync with the shared Cloud Run backend API
              (<code className="font-mono">/api/db/sync</code>) and local storage.
            </div>
          )}

          {savedBanner && (
            <div className="p-2.5 rounded-xl bg-[#E3F2E6] border border-[#2E6F40]/30 text-xs font-semibold text-[#2E6F40] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cloud Database Settings saved and synchronized!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6DFD3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#F7F2EB] text-xs font-semibold text-[#1F2421]"
            >
              Close
            </button>
            <button
              type="submit"
              data-testid="save-cloud-settings-btn"
              disabled={isSyncing}
              className="px-5 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors"
            >
              Save & Sync Cloud Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

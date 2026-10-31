import React, { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { type LanguageCode } from '../i18n/translations';

interface GoogleChooserModalProps {
  isOpen: boolean;
  role: 'mother' | 'doctor';
  lang: LanguageCode;
  onGoogleSignInOrRegister: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<void>;
  onClose: () => void;
}

export const GoogleLogoSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
    />
  </svg>
);

export const GoogleChooserModal: React.FC<GoogleChooserModalProps> = ({
  isOpen,
  role,
  lang,
  onGoogleSignInOrRegister,
  onClose,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const titleText =
    lang === 'hi'
      ? 'Google के साथ साइन इन करें'
      : lang === 'kn'
      ? 'Google ಮೂಲಕ ಸೈನ್ ಇನ್ ಮಾಡಿ'
      : 'Sign in with Google to NurtureMind AI';

  const subtitleText =
    role === 'mother'
      ? 'Confidential Mother & Family Companion Portal'
      : 'Confidential Doctor & Clinical Care Team Portal';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@') || !password.trim()) {
      setErrorMsg('Please enter your Google Email address and Password.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await onGoogleSignInOrRegister(email.trim(), password.trim(), fullName.trim());
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Invalid Google email or password for this account.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Google Confidential Sign In"
      data-testid="google-chooser-modal"
    >
      <div className="bg-white border border-[#E6DFD3] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E6DFD3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] flex items-center justify-center shrink-0">
              <GoogleLogoSvg className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-[#1F2421]">
                {titleText}
              </h3>
              <p className="text-xs text-[#5A625D] mt-0.5">{subtitleText}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Google Sign In"
            className="p-1.5 rounded-lg text-[#5A625D] hover:text-[#1F2421] hover:bg-[#F7F2EB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Strict Confidential Google Email + Password Form (No Public Account List) */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="google-sso-email"
              className="block text-xs font-semibold text-[#1F2421] mb-1"
            >
              Google Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5A625D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="google-sso-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder={
                  role === 'doctor' ? 'doctor@hospital.edu' : 'mother@gmail.com'
                }
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs font-mono text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="google-sso-password"
              className="block text-xs font-semibold text-[#1F2421] mb-1"
            >
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5A625D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="google-sso-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Enter your password"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="google-sso-name"
              className="block text-xs font-semibold text-[#1F2421] mb-1"
            >
              Full Name (Optional — used if registering a new account)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5A625D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="google-sso-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'doctor' ? 'Dr. Full Name' : 'Mother Full Name'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
              />
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-2.5 rounded-xl bg-[#FFF5F5] border border-[#F5D0D6] text-xs font-medium text-[#E11D48] flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#F7F2EB] text-xs font-semibold text-[#1F2421]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Sign In / Continue →'}
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-[#E6DFD3] flex items-center gap-2 text-[11px] text-[#5A625D]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E6F40] shrink-0" />
          <span>
            Strict HIPAA/DISHA Confidentiality · Existing users authenticate with their
            password; new Google emails provision a confidential profile.
          </span>
        </div>
      </div>
    </div>
  );
};

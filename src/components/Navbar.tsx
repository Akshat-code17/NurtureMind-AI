import React from 'react';
import { Globe, HeartHandshake, Cloud, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';
import { type LanguageCode, type TranslationDictionary } from '../i18n/translations';
import { type SessionAuth } from '../utils/riskEngine';

export type NavSection = 'gateway' | 'about' | 'privacy' | 'contact';

interface NavbarProps {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  activeNav: NavSection;
  setActiveNav: (nav: NavSection) => void;
  t: TranslationDictionary;
  sessionAuth?: SessionAuth | null;
  onReturnToDashboard: () => void;
  onExplicitLogout?: () => void;
  onOpenCloudSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  activeNav,
  setActiveNav,
  t,
  sessionAuth,
  onReturnToDashboard,
  onExplicitLogout,
  onOpenCloudSettings,
}) => {
  const handleNavClick = (section: NavSection) => {
    if (section === 'gateway') {
      onReturnToDashboard();
    }
    setActiveNav(section);
  };

  const isLoggedIn = Boolean(sessionAuth && sessionAuth.role);

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E6DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark + Subtitle */}
        <button
          type="button"
          data-testid="nav-brand-home-btn"
          onClick={() => handleNavClick('gateway')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#2E6F40] text-white flex items-center justify-center shadow-xs group-hover:bg-[#245832] transition-colors shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-[#1F2421] whitespace-nowrap">
                {t.brandName}
              </span>
              <span className="hidden xl:inline-block text-xs text-[#2E6F40] font-medium whitespace-nowrap">
                · {t.brandSubtitle}
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Home | About & Architecture | Privacy & Ethics | Team Omnitrix) */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6">
          <button
            type="button"
            data-testid="nav-home-btn"
            onClick={() => handleNavClick('gateway')}
            className={`text-sm font-medium transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeNav === 'gateway'
                ? 'border-[#2E6F40] text-[#1F2421]'
                : 'border-transparent text-[#5A625D] hover:text-[#1F2421]'
            }`}
          >
            {isLoggedIn ? 'My Dashboard' : t.navGateway}
          </button>
          <button
            type="button"
            data-testid="nav-about-btn"
            onClick={() => handleNavClick('about')}
            className={`text-sm font-medium transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeNav === 'about'
                ? 'border-[#2E6F40] text-[#1F2421]'
                : 'border-transparent text-[#5A625D] hover:text-[#1F2421]'
            }`}
          >
            {lang === 'en' ? 'About & Architecture' : t.navAbout}
          </button>
          <button
            type="button"
            data-testid="nav-privacy-btn"
            onClick={() => handleNavClick('privacy')}
            className={`text-sm font-medium transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeNav === 'privacy'
                ? 'border-[#2E6F40] text-[#1F2421]'
                : 'border-transparent text-[#5A625D] hover:text-[#1F2421]'
            }`}
          >
            {t.navPrivacy}
          </button>
          <button
            type="button"
            data-testid="nav-contact-btn"
            onClick={() => handleNavClick('contact')}
            className={`text-sm font-medium transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeNav === 'contact'
                ? 'border-[#2E6F40] text-[#1F2421]'
                : 'border-transparent text-[#5A625D] hover:text-[#1F2421]'
            }`}
          >
            {lang === 'hi'
              ? 'संपर्क और हेल्पलाइन'
              : lang === 'kn'
              ? 'ಸಂಪರ್ಕಿಸಿ (24/7)'
              : 'Contact Us'}
          </button>
        </nav>

        {/* Zone 3: Cloud Sync Button + Global 3-Button Language Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenCloudSettings && (
            <button
              type="button"
              onClick={onOpenCloudSettings}
              data-testid="open-cloud-settings-btn"
              title="Cloud Database Settings (Supabase / Live Sync)"
              aria-label="Cloud Database Settings"
              className="p-2 rounded-xl bg-[#F7F2EB] hover:bg-[#E3F2E6] border border-[#E6DFD3] text-[#2E6F40] flex items-center gap-1.5 text-xs font-semibold transition-colors"
            >
              <Cloud className="w-4 h-4" />
              <span className="hidden lg:inline">Cloud Sync</span>
            </button>
          )}

          <div
            role="group"
            aria-label="Language Switcher"
            className="flex items-center gap-1 p-1 bg-[#F7F2EB] border border-[#E6DFD3] rounded-xl shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-[#5A625D] ml-1.5 mr-0.5 hidden sm:inline" />
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                lang === 'en'
                  ? 'bg-[#2E6F40] text-white shadow-xs'
                  : 'text-[#4A524D] hover:text-[#1F2421]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                lang === 'hi'
                  ? 'bg-[#2E6F40] text-white shadow-xs'
                  : 'text-[#4A524D] hover:text-[#1F2421]'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLang('kn')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                lang === 'kn'
                  ? 'bg-[#2E6F40] text-white shadow-xs'
                  : 'text-[#4A524D] hover:text-[#1F2421]'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Logged-In Active Session Bar when viewing About / Privacy / Team */}
      {isLoggedIn && sessionAuth && activeNav !== 'gateway' && (
        <div
          data-testid="persistent-session-bar"
          className="bg-[#E3F2E6] border-t border-[#C5E3CC] px-4 sm:px-6 lg:px-8 py-2.5"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1F2421]">
              <ShieldCheck className="w-4 h-4 text-[#2E6F40]" />
              <span>
                Active Session: <strong>{sessionAuth.name}</strong> (
                {sessionAuth.systemId || sessionAuth.role.toUpperCase()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="navbar-back-to-dashboard-btn"
                onClick={() => handleNavClick('gateway')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to My Active Dashboard</span>
              </button>
              {onExplicitLogout && (
                <button
                  type="button"
                  data-testid="navbar-explicit-logout-btn"
                  onClick={onExplicitLogout}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF5F5] border border-[#E6DFD3] text-xs font-semibold text-[#1F2421] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Secondary Navigation Strip */}
      <div className="flex md:hidden items-center justify-around border-t border-[#E6DFD3] bg-[#F7F2EB] px-2 py-1.5 text-xs font-medium">
        <button
          type="button"
          onClick={() => handleNavClick('gateway')}
          className={`px-2 py-1 rounded ${
            activeNav === 'gateway' ? 'text-[#2E6F40] font-semibold' : 'text-[#5A625D]'
          }`}
        >
          {isLoggedIn ? 'Dashboard' : t.navGateway}
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('about')}
          className={`px-2 py-1 rounded ${
            activeNav === 'about' ? 'text-[#2E6F40] font-semibold' : 'text-[#5A625D]'
          }`}
        >
          About
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('privacy')}
          className={`px-2 py-1 rounded ${
            activeNav === 'privacy' ? 'text-[#2E6F40] font-semibold' : 'text-[#5A625D]'
          }`}
        >
          {t.navPrivacy}
        </button>
        <button
          type="button"
          data-testid="mobile-nav-contact-btn"
          onClick={() => handleNavClick('contact')}
          className={`px-2 py-1 rounded ${
            activeNav === 'contact' ? 'text-[#2E6F40] font-semibold' : 'text-[#5A625D]'
          }`}
        >
          Contact Us
        </button>
      </div>
    </header>
  );
};


import React from 'react';
import { Globe, HeartHandshake, Cloud } from 'lucide-react';
import { type LanguageCode, type TranslationDictionary } from '../i18n/translations';

export type NavSection = 'gateway' | 'about' | 'privacy';

interface NavbarProps {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  activeNav: NavSection;
  setActiveNav: (nav: NavSection) => void;
  t: TranslationDictionary;
  onReturnToGateway: () => void;
  onOpenCloudSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  activeNav,
  setActiveNav,
  t,
  onReturnToGateway,
  onOpenCloudSettings,
}) => {
  const handleNavClick = (section: NavSection) => {
    if (section === 'gateway') {
      onReturnToGateway();
    }
    setActiveNav(section);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E6DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark + Subtitle */}
        <button
          type="button"
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

        {/* Zone 2: Navigation Links (Home | About | Privacy & Ethics) */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => handleNavClick('gateway')}
            className={`text-sm font-medium transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeNav === 'gateway'
                ? 'border-[#2E6F40] text-[#1F2421]'
                : 'border-transparent text-[#5A625D] hover:text-[#1F2421]'
            }`}
          >
            {t.navGateway}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`text-sm font-medium transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeNav === 'about'
                ? 'border-[#2E6F40] text-[#1F2421]'
                : 'border-transparent text-[#5A625D] hover:text-[#1F2421]'
            }`}
          >
            {t.navAbout}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('privacy')}
            className={`text-sm font-medium transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeNav === 'privacy'
                ? 'border-[#2E6F40] text-[#1F2421]'
                : 'border-transparent text-[#5A625D] hover:text-[#1F2421]'
            }`}
          >
            {t.navPrivacy}
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

      {/* Mobile Secondary Navigation Strip */}
      <div className="flex md:hidden items-center justify-around border-t border-[#E6DFD3] bg-[#F7F2EB] px-2 py-1.5 text-xs font-medium">
        <button
          type="button"
          onClick={() => handleNavClick('gateway')}
          className={`px-2 py-1 rounded ${
            activeNav === 'gateway' ? 'text-[#2E6F40] font-semibold' : 'text-[#5A625D]'
          }`}
        >
          {t.navGateway}
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('about')}
          className={`px-2 py-1 rounded ${
            activeNav === 'about' ? 'text-[#2E6F40] font-semibold' : 'text-[#5A625D]'
          }`}
        >
          {t.navAbout}
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
      </div>
    </header>
  );
};

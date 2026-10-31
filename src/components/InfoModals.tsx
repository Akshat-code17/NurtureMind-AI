import React from 'react';
import { ShieldCheck, HeartHandshake, CheckCircle2, Building2 } from 'lucide-react';
import { type NavSection } from './Navbar';
import { type TranslationDictionary } from '../i18n/translations';

interface InfoModalsProps {
  activeNav: NavSection;
  onClose: () => void;
  t: TranslationDictionary;
}

export const InfoModals: React.FC<InfoModalsProps> = ({ activeNav, onClose, t }) => {
  if (activeNav === 'gateway') return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
          <div className="flex items-center gap-3">
            {activeNav === 'about' && <HeartHandshake className="w-6 h-6 text-[#2E6F40]" />}
            {activeNav === 'privacy' && <ShieldCheck className="w-6 h-6 text-[#2E6F40]" />}
            <h2 className="font-display text-2xl font-semibold text-[#1F2421]">
              {activeNav === 'about' && t.aboutModalTitle}
              {activeNav === 'privacy' && t.privacyModalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F7F2EB] hover:bg-[#EDE5D8] text-sm font-medium text-[#1F2421] transition-colors whitespace-nowrap"
          >
            {t.backToGatewayBtn}
          </button>
        </div>

        {activeNav === 'about' && (
          <div className="mt-6 space-y-6">
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <p className="text-base text-[#1F2421] leading-relaxed">{t.aboutIntroText}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
                <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                  {t.aboutStep1Title}
                </h3>
                <p className="text-sm text-[#4A524D] leading-relaxed">{t.aboutStep1Desc}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#F4EFFA]/60 border border-[#E2D6F3]">
                <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                  {t.aboutStep2Title}
                </h3>
                <p className="text-sm text-[#4A524D] leading-relaxed">{t.aboutStep2Desc}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#E3F2E6]/60 border border-[#C5E3CC]">
                <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                  {t.aboutStep3Title}
                </h3>
                <p className="text-sm text-[#4A524D] leading-relaxed">{t.aboutStep3Desc}</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F2EB] border border-[#E6DFD3] flex flex-col sm:flex-row items-start gap-4">
              <Building2 className="w-6 h-6 text-[#2E6F40] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-[#1F2421] mb-1">
                  {t.b2b2cModelTitle}
                </h3>
                <p className="text-sm text-[#4A524D] leading-relaxed">{t.b2b2cModelDesc}</p>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'privacy' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <CheckCircle2 className="w-5 h-5 text-[#2E6F40] mb-3" />
              <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                {t.privacyPillar1Title}
              </h3>
              <p className="text-sm text-[#4A524D] leading-relaxed">{t.privacyPillar1Desc}</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <CheckCircle2 className="w-5 h-5 text-[#2E6F40] mb-3" />
              <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                {t.privacyPillar2Title}
              </h3>
              <p className="text-sm text-[#4A524D] leading-relaxed">{t.privacyPillar2Desc}</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E6DFD3]">
              <CheckCircle2 className="w-5 h-5 text-[#2E6F40] mb-3" />
              <h3 className="text-base font-semibold text-[#1F2421] mb-2">
                {t.privacyPillar3Title}
              </h3>
              <p className="text-sm text-[#4A524D] leading-relaxed">{t.privacyPillar3Desc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

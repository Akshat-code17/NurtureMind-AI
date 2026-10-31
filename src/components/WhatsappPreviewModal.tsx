import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, Volume2, X } from 'lucide-react';
import {
  type LanguageCode,
  type TranslationDictionary,
  translations,
  speakText,
} from '../i18n/translations';

interface WhatsappPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  motherName: string;
  partnerName: string;
  partnerPhone: string;
  nightSessionsCount: number;
  lang: LanguageCode;
  t: TranslationDictionary;
}

export const WhatsappPreviewModal: React.FC<WhatsappPreviewModalProps> = ({
  isOpen,
  onClose,
  motherName,
  partnerName,
  partnerPhone,
  nightSessionsCount,
  lang,
  t,
}) => {
  const [previewLang, setPreviewLang] = useState<LanguageCode>(lang);

  if (!isOpen) return null;

  const activeDict = translations[previewLang];
  const dynamicMessage = activeDict.whatsappPartnerMessage
    .replace('Rohan', partnerName.split(' ')[0])
    .replace('रोहन', partnerName.split(' ')[0])
    .replace('ರೋಹನ್', partnerName.split(' ')[0])
    .replace('Ananya', motherName.split(' ')[0])
    .replace('अनन्या', motherName.split(' ')[0])
    .replace('ಅನನ್ಯಾ', motherName.split(' ')[0])
    .replace('4', String(nightSessionsCount));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
    >
      <div className="bg-[#FDFBF7] border border-[#E6DFD3] rounded-2xl max-w-lg w-full p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6DFD3]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2E6F40] text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="whatsapp-modal-title" className="text-base font-semibold text-[#1F2421]">
                {t.whatsappModalTitle}
              </h3>
              <p className="text-xs text-[#5A625D] font-mono">
                {partnerName} · {partnerPhone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModalBtn}
            className="p-1.5 rounded-lg text-[#5A625D] hover:bg-[#F7F2EB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Toggle inside WhatsApp Preview */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-[#5A625D]">Message Language:</span>
          <div className="flex items-center gap-1 p-1 bg-[#F7F2EB] rounded-lg border border-[#E6DFD3]">
            {(['en', 'hi', 'kn'] as LanguageCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setPreviewLang(code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  previewLang === code
                    ? 'bg-[#2E6F40] text-white'
                    : 'text-[#4A524D] hover:text-[#1F2421]'
                }`}
              >
                {code === 'en' ? 'English' : code === 'hi' ? 'हिंदी' : 'ಕನ್ನಡ'}
              </button>
            ))}
          </div>
        </div>

        {/* Simulated WhatsApp Bubble */}
        <div className="mt-4 p-4 rounded-2xl bg-[#E3F2E6] border border-[#C5E3CC] text-sm text-[#1F2421] leading-relaxed">
          <div className="text-xs font-semibold text-[#2E6F40] mb-1">
            NurtureMind Family Care Companion • Verified
          </div>
          <p>{dynamicMessage}</p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#4A524D] font-mono">
            <span>Consented Caregiver Nudge</span>
            <button
              type="button"
              onClick={() => speakText(dynamicMessage, previewLang)}
              className="inline-flex items-center gap-1 text-[#2E6F40] font-sans font-semibold hover:underline"
            >
              <Volume2 className="w-3.5 h-3.5" />
              {activeDict.listenVoiceBtn}
            </button>
          </div>
        </div>

        {/* Privacy Guarantee Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#F4EFFA] border border-[#E2D6F3] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#2E6F40] shrink-0 mt-0.5" />
          <p className="text-xs text-[#3F3A45] leading-relaxed">{t.whatsappPrivacyGuarantee}</p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#245832] text-white text-sm font-medium transition-colors"
          >
            {t.closeModalBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

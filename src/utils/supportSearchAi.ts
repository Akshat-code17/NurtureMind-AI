import { type LanguageCode } from '../i18n/translations.ts';

export interface SupportSearchAnswer {
  query: string;
  summary: string;
  steps: string[];
  reassurance: string;
  source: 'gemini-ai' | 'nurturemind-clinical-kb';
  timestamp: string;
}

export function generateSupportAnswerFallback(
  query: string,
  lang: LanguageCode = 'en'
): SupportSearchAnswer {
  const q = query.toLowerCase().trim();
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Baby Colic / 3 AM Crying / Soothing
  if (q.includes('colic') || q.includes('3am') || q.includes('cry') || q.includes('पेट दर्द') || q.includes('ಹೊಟ್ಟೆ')) {
    if (lang === 'hi') {
      return {
        query,
        summary:
          'नवजात शिशुओं में रात के समय (विशेषकर 2 से 4 बजे के बीच) गैस या कोलिक के कारण लगातार रोना बहुत सामान्य है। यह लगभग 6 सप्ताह की आयु में चरम पर होता है और अपने आप ठीक हो जाता है।',
        steps: [
          'शिशु को अपने सीने से लगाकर या बाईं करवट में हल्का सहारा देकर थपथपाएँ और डकार (burp) दिलाएँ।',
          'हल्के गुनगुने हाथ से शिशु के पेट पर घड़ी की दिशा (clockwise) में धीरे-धीरे मालिश करें और साइकिल चलाने जैसे पैर हिलाएँ।',
          'कमरे की रोशनी धीमी रखें और धीमी "शश..." की आवाज़ (white noise) का उपयोग करें।',
        ],
        reassurance:
          'आप अकेली नहीं हैं—यदि आप बहुत थक गई हैं, तो शिशु को सुरक्षित पालने में लिटाकर 5 मिनट गहरी सांस लें या अपने जीवनसाथी को जगाएँ।',
        source: 'nurturemind-clinical-kb',
        timestamp: now,
      };
    }
    if (lang === 'kn') {
      return {
        query,
        summary:
          'ನವಜಾತ ಶಿಶುಗಳಲ್ಲಿ ತಡರಾತ್ರಿ (ವಿಶೇಷವಾಗಿ ರಾತ್ರಿ 2 ರಿಂದ 4 ಗಂಟೆಯ ನಡುವೆ) ಗ್ಯಾಸ್ ಅಥವಾ ಹೊಟ್ಟೆ ನೋವಿನಿಂದ (Colic) ಅಳುವುದು ತುಂಬಾ ಸಾಮಾನ್ಯವಾಗಿದೆ. ಇದು 6 ವಾರಗಳ ವಯಸ್ಸಿನಲ್ಲಿ ಹೆಚ್ಚಾಗಿ ಕಂಡುಬರುತ್ತದೆ.',
        steps: [
          'ಮಗುವನ್ನು ಭುಜದ ಮೇಲೆ ಒರಗಿಸಿಕೊಂಡು ಬೆನ್ನನ್ನು ನಿಧಾನವಾಗಿ ತಟ್ಟಿ ತೇಗು (burp) ಬರುವಂತೆ ಮಾಡಿ.',
          'ಮಗುವಿನ ಹೊಟ್ಟೆಯ ಮೇಲೆ ಬೆಚ್ಚಗಿನ ಕೈಯಿಂದ ನಿಧಾನವಾಗಿ ಮಸಾಜ್ ಮಾಡಿ ಮತ್ತು ಕಾಲುಗಳನ್ನು ಸೈಕಲ್ ತುಳಿಯುವಂತೆ ಆಡಿಸಿ.',
          'ಕೋಣೆಯ ಬೆಳಕನ್ನು ಮಂದಗೊಳಿಸಿ ಮತ್ತು ಶಾಂತವಾದ ವಾತಾವರಣ ನಿರ್ಮಿಸಿ.',
        ],
        reassurance:
          'ನೀವು ಒಬ್ಬಂಟಿಯಲ್ಲ—ನಿಮಗೆ ತೀವ್ರ ದಣಿವಾಗಿದ್ದರೆ, ಮಗುವನ್ನು ತೊಟ್ಟಿಲಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಮಲಗಿಸಿ ನಿಮ್ಮ ಪತಿಯ ಸಹಾಯ ಪಡೆಯಿರಿ.',
        source: 'nurturemind-clinical-kb',
        timestamp: now,
      };
    }
    return {
      query,
      summary:
        'Late-night crying spells or colic around 2 AM–4 AM are very common in newborns (peaking around 6 weeks postpartum) due to an immature digestive system and nervous system overstimulation.',
      steps: [
        'Hold your baby upright against your chest or across your forearm ("colic carry") and gently burp their back for 3–5 minutes.',
        'Do gentle clockwise tummy massage and slow bicycle-leg movements to release trapped gas.',
        'Keep lights dim, swaddle snugly if under 8 weeks, and use steady low white noise ("shhh" rhythm).',
      ],
      reassurance:
        'Soothing a crying baby at 3 AM is deeply exhausting. If you feel overwhelmed, it is 100% safe to place your baby on their back in the crib for 5 minutes while you breathe or wake your partner.',
      source: 'nurturemind-clinical-kb',
      timestamp: now,
    };
  }

  // 2. Emotional Numbness / Overwhelmed / Postpartum Exhaustion / Sadness
  if (
    q.includes('numb') ||
    q.includes('overwhelmed') ||
    q.includes('sad') ||
    q.includes('anxious') ||
    q.includes('cry') ||
    q.includes('exhausted') ||
    q.includes('alone') ||
    q.includes('सुन्न') ||
    q.includes('भारीपन') ||
    q.includes('ಮರಗಟ್ಟಿದಂತೆ') ||
    q.includes('ಒತ್ತಡ')
  ) {
    if (lang === 'hi') {
      return {
        query,
        summary:
          'प्रसव के बाद सुन्नपन (numbness), भारीपन या अचानक रोना आना बहुत सी माताओं को अनुभव होता है। हार्मोनल बदलाव और रात की टूटी हुई नींद मस्तिष्क के भावनात्मक केंद्र को थका देती है।',
        steps: [
          'खुद को दोष न दें—यह भावना आपकी कमजोरी नहीं है, बल्कि शरीर और मन की गहरी थकान का संकेत है।',
          'आज रात या सुबह की एक फीडिंग की जिम्मेदारी अपने जीवनसाथी या परिवार के सदस्य को सौंपें ताकि आपको लगातार 3-4 घंटे की नींद मिल सके।',
          'हमारे "Wellbeing" टैब में 3-मिनट का श्वास अभ्यास करें या पेरिनेटल काउंसलर से बात करने के लिए अनुरोध करें।',
        ],
        reassurance:
          'मदद माँगना एक मजबूत माँ की निशानी है। आपकी देखभाल टीम हर कदम पर आपके साथ है।',
        source: 'nurturemind-clinical-kb',
        timestamp: now,
      };
    }
    if (lang === 'kn') {
      return {
        query,
        summary:
          'ಹೆರಿಗೆಯ ನಂತರ ಮನಸ್ಸು ಮರಗಟ್ಟಿದಂತೆ ಭಾವಿಸುವುದು ಅಥವಾ ಅತಿಯಾದ ಒತ್ತಡ ಉಂಟಾಗುವುದು ಅನೇಕ ತಾಯಂದಿರಲ್ಲಿ ಕಂಡುಬರುತ್ತದೆ. ಹಾರ್ಮೋನ್ ಬದಲಾವಣೆ ಮತ್ತು ನಿದ್ರೆಯ ಕೊರತೆಯೇ ಇದಕ್ಕೆ ಮುಖ್ಯ ಕಾರಣ.',
        steps: [
          'ನಿಮ್ಮನ್ನು ನೀವು ದೂಷಿಸಿಕೊಳ್ಳಬೇಡಿ—ಇದು ನಿಮ್ಮ ವೈಫಲ್ಯವಲ್ಲ, ನಿಮ್ಮ ದೇಹಕ್ಕೆ ವಿಶ್ರಾಂತಿಯ ಅಗತ್ಯವಿದೆ ಎಂಬುದರ ಸಂಕೇತ.',
          'ಮುಂದಿನ ಒಂದು ಹಾಲುಣಿಸುವ ಅಥವಾ ಮಗುವನ್ನು ತೂಗುವ ಜವಾಬ್ದಾರಿಯನ್ನು ನಿಮ್ಮ ಪತಿಗೆ ನೀಡಿ ಸತತ 3-4 ಗಂಟೆಗಳ ನಿದ್ರೆ ಪಡೆಯಿರಿ.',
          '"Wellbeing" ಟ್ಯಾಬ್‌ನಲ್ಲಿ 3-ನಿಮಿಷದ ಉಸಿರಾಟದ ಅಭ್ಯಾಸ ಮಾಡಿ ಅಥವಾ ಕೇರ್ ಕೋಆರ್ಡಿನೇಟರ್ ಕರೆಗೆ ವಿನಂತಿಸಿ.',
        ],
        reassurance:
          'ಸಹಾಯ ಕೇಳುವುದು ಉತ್ತಮ ತಾಯಿಯ ಲಕ್ಷಣವಾಗಿದೆ. ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ತಂಡವು ನಿಮ್ಮ ಬೆಂಬಲಕ್ಕಿದೆ.',
        source: 'nurturemind-clinical-kb',
        timestamp: now,
      };
    }
    return {
      query,
      summary:
        'Feeling emotionally numb, detached, or overwhelmed is a recognized response to severe sleep fragmentation and sharp postpartum hormonal shifts. When your brain goes days without an unbroken 4-hour sleep block, it enters emotional conservation mode.',
      steps: [
        'Release any guilt immediately — feeling numb does not mean you do not love your baby; it means your nervous system is depleted.',
        'Hand off the next non-feeding soothing window to your partner or family member so you can get one uninterrupted 3–4 hour sleep stretch.',
        'Use the 2-minute EPDS Self-Screening or request a warm call from your Perinatal Care Coordinator for compassionate human support.',
      ],
      reassurance:
        'You do not have to carry every hour of the night alone. Support is here whenever you are ready.',
      source: 'nurturemind-clinical-kb',
      timestamp: now,
    };
  }

  // 3. Feeding Schedule / Breastfeeding / Formula / Milk Supply
  if (
    q.includes('feed') ||
    q.includes('milk') ||
    q.includes('latch') ||
    q.includes('bottle') ||
    q.includes('schedule') ||
    q.includes('फीडिंग') ||
    q.includes('आहार') ||
    q.includes('ಹಾಲುಣಿಸುವ')
  ) {
    if (lang === 'hi') {
      return {
        query,
        summary:
          '4 से 8 सप्ताह के शिशु आमतौर पर हर 2 से 3.5 घंटे में (24 घंटे में लगभग 8–10 बार) आहार लेते हैं। विकास की गति (growth spurts) के दौरान शिशु जल्दी-जल्दी दूध माँग सकता है।',
        steps: [
          'घड़ी देखने के बजाय शिशु के शुरुआती भूख के संकेतों (हाथ मुंह में लेना, होंठ हिलाना) पर ध्यान दें।',
          'प्रत्येक फीडिंग लगभग 15–25 मिनट की हो सकती है; बीच में और अंत में डकार (burp) जरूर दिलाएँ।',
          'यदि शिशु दिन में 6 या अधिक गीले डायपर कर रहा है, तो उसे पर्याप्त पोषण मिल रहा है।',
        ],
        reassurance:
          'हर शिशु की अपनी लय होती है। यदि स्तनपान में दर्द हो या शिशु सुस्त लगे, तो अपने डॉक्टर से परामर्श करें।',
        source: 'nurturemind-clinical-kb',
        timestamp: now,
      };
    }
    if (lang === 'kn') {
      return {
        query,
        summary:
          '4 ರಿಂದ 8 ವಾರಗಳ ನವಜಾತ ಶಿಶುಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಪ್ರತಿ 2 ರಿಂದ 3.5 ಗಂಟೆಗಳಿಗೊಮ್ಮೆ (ದಿನಕ್ಕೆ 8–10 ಬಾರಿ) ಹಾಲು ಕುಡಿಯುತ್ತವೆ.',
        steps: [
          'ಮಗುವಿನ ಆರಂಭಿಕ ಹಸಿವಿನ ಸಂಕೇತಗಳನ್ನು (ಕೈಯನ್ನು ಬಾಯಿಗೆ ಇಟ್ಟುಕೊಳ್ಳುವುದು) ಗಮನಿಸಿ ಹಾಲುಣಿಸಿ.',
          'ಪ್ರತಿ ಬಾರಿ 15–25 ನಿಮಿಷಗಳ ಕಾಲ ಹಾಲುಣಿಸಿ ಮತ್ತು ನಂತರ ತೇಗು (burp) ಬರುವಂತೆ ಬೆನ್ನು ತಟ್ಟಿ.',
          'ದಿನಕ್ಕೆ 6 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಒದ್ದೆಯಾದ ಡೈಪರ್‌ಗಳಾಗುತ್ತಿದ್ದರೆ ಮಗುವಿಗೆ ಸಾಕಷ್ಟು ಹಾಲು ಸಿಗುತ್ತಿದೆ ಎಂದರ್ಥ.',
        ],
        reassurance:
          'ಪ್ರತಿಯೊಂದು ಮಗುವಿನ ಬೆಳವಣಿಗೆಯ ಲಯ ವಿಭಿನ್ನವಾಗಿರುತ್ತದೆ. ನಿಮಗೆ ವಿಶ್ರಾಂತಿ ಬೇಕಾದಾಗ ಕುಟುಂಬದ ಸಹಾಯ ಪಡೆಯಿರಿ.',
        source: 'nurturemind-clinical-kb',
        timestamp: now,
      };
    }
    return {
      query,
      summary:
        'Between Weeks 4 and 9, most newborns feed every 2.5 to 3.5 hours during the day (8–10 feeds in 24 hours) and may begin stretching one night window to 3.5–4 hours.',
      steps: [
        'Watch for early hunger cues (rooting, opening mouth, sucking on hands) rather than waiting for full crying.',
        'Typical active nursing or bottle sessions last 15–25 minutes; pause halfway to burp gently.',
        '6+ wet diapers per 24 hours and steady weight gain confirm your baby is getting enough milk.',
      ],
      reassurance:
        'Cluster feeding in the evening is normal and helps build supply. Consider expressing or sharing one bottle feed so your partner can give you an unbroken rest block.',
      source: 'nurturemind-clinical-kb',
      timestamp: now,
    };
  }

  // 4. General Newborn & Maternal Support Fallback for any custom query
  if (lang === 'hi') {
    return {
      query,
      summary: `"${query}" के संबंध में मातृ एवं नवजात देखभाल मार्गदर्शन: शुरुआती प्रसवोत्तर हफ्तों में शिशु की दिनचर्या और माँ के स्वास्थ्य में उतार-चढ़ाव सामान्य हैं।`,
      steps: [
        'शिशु के तापमान, गीले डायपर (दिन में 6+) और आहार की नियमितता पर नज़र रखें।',
        'माँ के लिए पर्याप्त पानी, गर्म पौष्टिक भोजन और कम से कम 3–4 घंटे की लगातार नींद अत्यंत महत्वपूर्ण है।',
        'यदि बुखार, तेज दर्द या अत्यधिक थकान हो, तो तुरंत अपनी केयर टीम को सूचित करें।',
      ],
      reassurance:
        'आपका यह प्रश्न आपके लॉग में सुरक्षित रूप से दर्ज कर लिया गया है। अधिक सहायता के लिए आप केयर कोऑर्डिनेटर कॉल का अनुरोध कर सकती हैं।',
      source: 'nurturemind-clinical-kb',
      timestamp: now,
    };
  }
  if (lang === 'kn') {
    return {
      query,
      summary: `"${query}" ಕುರಿತು ತಾಯಿ ಮತ್ತು ನವಜಾತ ಶಿಶು ಆರೈಕೆ ಮಾರ್ಗದರ್ಶನ: ಬಾಣಂತನದ ಮೊದಲ ವಾರಗಳಲ್ಲಿ ಮಗುವಿನ ದಿನಚರಿ ಮತ್ತು ತಾಯಿಯ ಆರೋಗ್ಯದಲ್ಲಿ ಬದಲಾವಣೆಗಳು ಸಹಜ.`,
      steps: [
        'ಮಗುವಿನ ಹಾಲುಣಿಸುವಿಕೆ, ನಿದ್ರೆ ಮತ್ತು ದಿನಕ್ಕೆ 6+ ಒದ್ದೆ ಡೈಪರ್‌ಗಳನ್ನು ಗಮನಿಸಿ.',
        'ತಾಯಿಯು ಬೆಚ್ಚಗಿನ ಪೌಷ್ಟಿಕ ಆಹಾರ, ಸಾಕಷ್ಟು ನೀರು ಮತ್ತು ವಿಶ್ರಾಂತಿ ಪಡೆಯುವುದು ಅತಿ ಮುಖ್ಯ.',
        'ಯಾವುದೇ ತುರ್ತು ಲಕ್ಷಣಗಳಿದ್ದರೆ ತಕ್ಷಣ ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      ],
      reassurance:
        'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ. ಹೆಚ್ಚಿನ ಸಹಾಯಕ್ಕಾಗಿ ಕೇರ್ ಕೋಆರ್ಡಿನೇಟರ್ ಕರೆಗೆ ವಿನಂತಿಸಬಹುದು.',
      source: 'nurturemind-clinical-kb',
      timestamp: now,
    };
  }
  return {
    query,
    summary: `Perinatal & Newborn Care Guidance for "${query}": During the first 12 weeks postpartum, both newborn rhythms and maternal recovery shift week by week.`,
    steps: [
      'Monitor your baby’s feeding comfort, 6+ wet diapers daily, and breathing/temperature steadiness.',
      'Protect your own recovery by hydrating after every feed and sharing at least one night soothing window with your partner.',
      'If you notice persistent physical discomfort, fever, or emotional heaviness, reach out to your care team.',
    ],
    reassurance:
      'We have logged your question to your personal timeline so you can track patterns over time.',
    source: 'nurturemind-clinical-kb',
    timestamp: now,
  };
}

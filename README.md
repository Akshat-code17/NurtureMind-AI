[nurturemind_ai_github_readme.md](https://github.com/user-attachments/files/34255098/nurturemind_ai_github_readme.md)
# 🌿 NurtureMind AI

> **Early, explainable postpartum emotional distress risk signals from consented newborn-care behaviour — so human support reaches mothers sooner.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Application-nurturemind--ai.ai.studio-166534?style=for-the-badge)](https://nurturemind-ai.ai.studio/)
[![Database](https://img.shields.io/badge/Cloud_DB-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Interoperability](https://img.shields.io/badge/Standard-ABDM_ABHA_%7C_HL7_FHIR_R4-0284c7?style=for-the-badge)](#)
[![Languages](https://img.shields.io/badge/Multilingual-English_%7C_हिंदी_%7C_ಕನ್ನಡ-f59e0b?style=for-the-badge)](#)

---

## 🔗 Live Deployment
👉 **Launch Live Application:** **[https://nurturemind-ai.ai.studio/](https://nurturemind-ai.ai.studio/)**

---

## 🚨 The Problem: The Silent Postpartum Gap
Millions of new mothers experience severe postpartum emotional distress or depression (PPD/PPA), yet it is routinely normalized as *"standard new-parent exhaustion"* until it escalates into a clinical crisis. 

Meanwhile, a new mother interacts with her newborn-care tracking app **10 to 15 times a day**—especially between **1:00 AM and 5:00 AM**—logging feedings, diaper changes, sleep stretches, and searching for answers. Traditional baby apps treat this purely as infant utility data and discard the behavioral telemetry.

## 💡 Our Solution: Digital Phenotyping & Personal Baseline Deviation
**NurtureMind AI** transforms consented, everyday newborn-care app interactions into an **early, explainable maternal mental-health risk signal** with strict clinical boundaries:
* **Personal Baseline Deviation (No False Alarms):** Every new mother wakes up at night. Instead of comparing a mother against a rigid global rule, our engine compares her rolling **7-day behavioral window** against **her own personal baseline** ($\Delta$).
* **Explainable by Design (SHAP-Style Attribution):** Zero black-box scores. Every risk flag displays human-readable attribution bars (e.g., `+32% Nocturnal Fragmented Sessions`, `+26% Distress Search Intent`).
* **Strict Clinical Boundary:** **NurtureMind AI detects behavioural risk patterns; it NEVER diagnoses postpartum depression.** Elevated risk scores always route to validated **PHQ-2 / 10-Question EPDS screening** and a **Clinician-in-the-Loop**.

---

## ✨ Key Platform Features

### 1. 🔐 Strict Dual-Portal Confidential Gateway (HIPAA / DPDP Aligned)
* Separate, role-locked portals for **Mothers & Families** (`NM-MOM-XXXX`) and **Clinicians / OB-GYNs** (`NM-DOC-XXXX`).
* Zero public exposure of patient lists; automated generation of printable **Patient Onboarding Credential Cards** upon hospital discharge.

### 2. 🧠 6-Signal Behavioural Risk & Digital Phenotyping Engine
Computes a rolling 7-day Personal Baseline Deviation score (`0–100`) across six weighted signals:
$$Risk\ Score = \sum_{i=1}^{6} w_i \cdot \max\left(0, \frac{X_{i,\text{7-day}} - \mu_{i,\text{baseline}}}{\sigma_{i,\text{baseline}}}\right)$$
1. **Nocturnal Fragmented Session Bursts (25%):** Distinguishes healthy *log-and-sleep* behavior from 1:00 AM–5:00 AM *insomnia doom-scrolling* after the baby is logged asleep.
2. **Hyper-Vigilant Log Micro-Editing vs. Abrupt Abandonment (20%):** Flags compulsive log re-editing (postpartum anxiety) or sudden 48-hour logging collapse (withdrawal).
3. **In-App Search Semantic Shift (20%):** Detects shifts from routine infant queries (*"burping techniques"*) to acute maternal distress queries (*"why do I feel numb"*, *"crying nonstop"*).
4. **10-Second Micro-Mood Check-In Trend & Skip Rate (15%):** Tracks low mood trends and consecutive skipped check-ins.
5. **Multilingual Voice Logger & Acoustic Fatigue Cadence (10%):** Hands-free speech-to-form logging in **English (`en-IN`), Hindi (`hi-IN`), and Kannada (`kn-IN`)** that analyzes speech rate (WPM), pause ratio, and vocal fatigue at 3:00 AM.
6. **Caregiver Co-Logging Inactivity & Wearable Biometrics (10%):** Tracks solo night-care burden alongside optional **Apple Watch / Smartwatch** sleep fragmentation and Heart Rate Variability (HRV).

### 3. ⌚ Interactive Apple Watch Companion & Doctor-to-Watch Prescriptions
* Live simulated **watchOS Biometric Companion** tracking maternal HR, HRV (`ms`), and fragmented sleep bouts.
* **Interactive Watch Notifications:** Mothers can log baby feedings, complete 5-second mood check-ins, or trigger a **1-Tap SOS Partner Rest Nudge** directly from the watch face.
* **Doctor-to-Watch Care Nudges:** Assigned clinicians can push gentle rest prescriptions straight to the mother's watch.

### 4. 💬 2-Way Live WhatsApp Care Bot & Guilt-Free Partner Nudges
* **In-App & Real WhatsApp Deep-Linking (`wa.me`):** Mothers can log 3:00 AM updates via natural text or voice notes.
* **Privacy-Safe Partner Nudge:** Sends a permission-based WhatsApp alert asking her partner/family to take over a 2-hour baby shift **without ever exposing private search history or raw mood logs**.

### 5. 👩‍👧‍👦 MomCircle Peer Community + Dynamic AI Safety Guardian
* Auth-gated peer support channels (`#3am-feeding-support`, `#sleep-deprivation-vent`, `#bengaluru-moms-circle`) with an **Anonymous Verified Alias** toggle.
* **Dynamic Multi-Doctor AI Safety Guardian:** If high-distress phrasing is detected in chat, a private, compassionate check-in banner appears *only* to that mother, dynamically routing her to her specific assigned OB-GYN (`mother.doctor_id`) or 24/7 crisis support (**Tele-MANAS `14416`**).

### 6. 🏥 ABDM / ABHA Health ID & HL7 FHIR R4 Hospital EHR Integration
* **14-Digit ABHA ID Verification:** Links maternal behavioral telemetry with India's Ayushman Bharat Digital Mission gateway.
* **HL7 FHIR R4 Bundle Export:** One-click generation and REST push of standardized FHIR `Patient`, `Observation`, `QuestionnaireResponse` (EPDS), and `CarePlan` resources for hospital systems (e.g., Cloudnine, Manipal HIS).

---

## 🧪 Judge & Developer Demo Credentials

To test the live application at **[https://nurturemind-ai.ai.studio/](https://nurturemind-ai.ai.studio/)** without registering from scratch, use these pre-seeded clinical accounts:

| Portal Role | Profile Name | Scenario / Risk Tier | Unique Login ID *(or Email)* | Password |
| :--- | :--- | :--- | :--- | :--- |
| **🩺 Doctor Portal** | **Dr. Kavitha Rao** | Senior OB-GYN (Manipal / Cloudnine) | `NM-DOC-1001` *(or `kavitha.rao@manipal.edu`)* | `Doctor@123` |
| **🤱 Mother Portal** | **Ananya Sharma** | **High Risk (`78–98/100`)** • 6w Postpartum | `NM-MOM-2001` *(or `ananya.sharma@gmail.com`)* | `Mother@123` |
| **🤱 Mother Portal** | **Priya Nair** | **Moderate Risk (`54/100`)** • 4w Postpartum | `NM-MOM-2002` *(or `priya.nair@gmail.com`)* | `Mother@123` |
| **🤱 Mother Portal** | **Sneha Kulkarni** | **Normal Baseline (`18/100`)** • 9w Postpartum | `NM-MOM-2003` *(or `sneha.kulkarni@gmail.com`)* | `Mother@123` |

> **💡 Live Multi-Device Sync Test:** Log into the **Doctor Portal** (`NM-DOC-1001`), click **`+ Add New Patient`**, copy the auto-generated `NM-MOM-XXXX` Unique ID and Temporary Password, log out, and sign into the **Mother Portal** from any device!

---

## 🏗️ System Architecture & Tech Stack

```text
+-------------------------------------------------------------------------+
|                   CONSENTED MATERNAL & INFANT INPUTS                    |
|  • Baby Feed/Sleep Logs   • 10s Micro-Moods   • Multilingual Voice Mic  |
|  • Apple Watch HRV/Sleep  • In-App Searches   • 2-Way WhatsApp Bot      |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|             TWO-LAYER EXPLAINABLE AI & CLINICAL RISK ENGINE             |
|  Layer 1: 7-Day Personal Baseline Deviation & SHAP Feature Attribution  |
|  Layer 2: Gemini AI Empathetic Nudge Generator & Acoustic NLP Parser    |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|               REAL-TIME CLOUD PERSISTENCE & INTEROPERABILITY            |
|  • Supabase PostgreSQL (REST Sync)   • Dynamic Multi-Doctor Relational  |
|  • ABDM 14-Digit ABHA Verification   • HL7 FHIR R4 EHR Bundle Exporter  |
+------------------+-----------------------------------+------------------+
                   |                                   |
                   v                                   v
+------------------------------------+   +--------------------------------+
|       MOTHER COMPANION PORTAL      |   |     CLINICAL TRIAGE PORTAL     |
| • Warm Non-Diagnostic Nudges       |   | • Prioritized Follow-Up Queue  |
| • Privacy-Safe Partner WhatsApp    |   | • 7-Day Trajectory & SHAP Bars |
| • Validated EPDS + Tele-MANAS 14416|   | • Watch Care Prescriptions     |
+------------------------------------+   +--------------------------------+
```

* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Chart.js / Recharts
* **Voice & Speech AI:** Browser Web Speech API (`SpeechRecognition` & `speechSynthesis` for `en-IN`, `hi-IN`, `kn-IN`) + Acoustic WPM/Pause Cadence Analyzer
* **Cloud Database:** Supabase PostgreSQL (`nurturemind_store`, `doctors`, `mothers`) with offline-resilient hybrid sync
* **Healthcare Standards:** Validated Edinburgh Postnatal Depression Scale (EPDS), PHQ-2, HL7 FHIR R4 JSON schema, ABDM ABHA ID format

---

## 💻 Local Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Akshat-code17/nurturemind-ai.git
cd nurturemind-ai

# 2. Install dependencies
npm install

# 3. Start the development server (binds to 0.0.0.0:3000)
npm run dev
```

---

## 💼 B2B2C Business Model Summary
* **100% Free for Mothers:** Core risk detection, multilingual voice logging, and crisis routing are never paywalled.
* **Hospital & Maternity Clinic SaaS:** ₹25,000–₹75,000/month per branch (or ₹350 per 6-month postnatal discharge package) with **~89% gross margin** and near-zero CAC via hospital discharge onboarding.
* **Plug-and-Play B2B SDK (`@nurturemind/sdk`):** ₹8–₹15/MAU API licensing for existing parenting and baby-tracking apps.

---

## 👥 Team Omnitrix — JAIN (Deemed-to-be University), FET
* **Akshat Kumar**
* **Trushika Maharana**
* **Zoya Fatima**
* **Muhammad Abu Bakr Siddique**

---

> ⚠️ **Clinical Disclaimer:** *NurtureMind AI is a behavioral risk-screening and clinical triage support tool. It does not provide medical or psychiatric diagnoses and never replaces professional evaluation by an OB-GYN, psychiatrist, or licensed perinatal mental-health specialist. In case of acute crisis in India, call **Tele-MANAS at `14416` or `1800-891-4416`** (24/7, toll-free).*
